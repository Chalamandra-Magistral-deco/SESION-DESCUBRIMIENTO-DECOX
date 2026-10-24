import React, { useState, useEffect } from 'react';
import {
  Crown,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Shield,
  ArrowRight,
  ArrowLeft,
  Bot,
  Award,
  Printer,
  AlertTriangle,
  Cpu,
  HelpCircle,
  Eye,
  Pencil,
  Layers,
  Scale,
  MessageSquare
} from 'lucide-react';
import {
  DiscoveryDeliverableState,
  StrategicMapData,
  ActionPlanWeek
} from '../../types';
import { SEVEN_MAGISTRAL_HACKS } from '../../utils/constants';
import {
  DISCOVERY_EXPERIMENTS_STEP,
  STEP_NUM_BY_HACK_ID
} from '../../data/discoveryFlowConfig';
import {
  deriveSynthesisFromResponses,
  mergeActionPlanPreservingCustomTasks,
  sanitizeActivePayloadForProcessing
} from '../../utils/discoverySynthesisEngine';
import { useAudio } from '../../hooks/useAudio';
import { triggerConfetti } from '../Confetti';

interface Module05StrategicMapProps {
  fullState: DiscoveryDeliverableState;
  visualUrl?: string;
  onOpenVisualStudio?: () => void;
  onApplySynthesis: (updatedMap: StrategicMapData, recommendedPlan?: ActionPlanWeek[]) => void;
  onChangeMap: (updatedMap: StrategicMapData) => void;
  onJumpToModule: (moduleNum: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenReport: () => void;
}

export default function Module05StrategicMap({
  fullState,
  visualUrl,
  onOpenVisualStudio,
  onApplySynthesis,
  onChangeMap,
  onJumpToModule,
  onPrev,
  onNext,
  onOpenReport
}: Module05StrategicMapProps) {
  const { challenge, strategicMap, selectedHackIds, hackNotes, experiments } = fullState;
  const isOrg = challenge.track === 'organizacion';

  const [processingState, setProcessingState] = useState<'idle' | 'loading' | 'error' | 'done'>(
    strategicMap.isSynthesized ? 'done' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingMantra, setEditingMantra] = useState<boolean>(false);

  const { playSuccessChime, playTick } = useAudio();

  const prioritizedHacks = SEVEN_MAGISTRAL_HACKS.filter((h) => selectedHackIds.includes(h.id));
  const derivedBundle = deriveSynthesisFromResponses(fullState);
  const derivedFallback = derivedBundle.strategicMap;

  // Automatically process locally on entry if invalidated/unsynthesized and user has real inputs
  useEffect(() => {
    const hasRealInput =
      Boolean(challenge.currentSituation.trim()) ||
      Boolean(challenge.criticalFriction.trim()) ||
      Boolean(challenge.title.trim());

    if (!strategicMap.isSynthesized && hasRealInput && processingState !== 'loading') {
      handleLocalProcess(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategicMap.isSynthesized]);

  const handleLocalProcess = (silent = false) => {
    if (!silent) playTick(620, 'sine', 0.06);
    setProcessingState('loading');
    setErrorMessage(null);

    window.setTimeout(() => {
      const { strategicMap: derivedMap, recommendedPlan } = deriveSynthesisFromResponses(fullState);
      const isPlanEmpty = fullState.actionPlan.every((w) => w.tasks.length === 0);
      const shouldUpdatePlan = isPlanEmpty || Boolean(fullState.planNeedsSync);
      const syncedPlan = shouldUpdatePlan
        ? mergeActionPlanPreservingCustomTasks(recommendedPlan, fullState.actionPlan)
        : undefined;

      onApplySynthesis(derivedMap, syncedPlan);
      setProcessingState('done');
      if (!silent) {
        playSuccessChime();
      }
    }, 250);
  };

  const handleAiProcess = async () => {
    setProcessingState('loading');
    setErrorMessage(null);
    playTick(600, 'sine', 0.08);

    try {
      const sanitized = sanitizeActivePayloadForProcessing(fullState);
      const res = await fetch('/api/discovery/process-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge: sanitized.challenge,
          strategicProfile: sanitized.strategicProfile,
          selectedHacks: prioritizedHacks,
          hackNotes,
          experiments
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(
          json.error || 'No se pudo completar el procesamiento con el motor IA.'
        );
      }

      const { strategicMap: localDerived, recommendedPlan } = deriveSynthesisFromResponses(fullState);
      const isPlanEmpty = fullState.actionPlan.every((w) => w.tasks.length === 0);
      const shouldUpdatePlan = isPlanEmpty || Boolean(fullState.planNeedsSync);
      const syncedPlan = shouldUpdatePlan
        ? mergeActionPlanPreservingCustomTasks(recommendedPlan, fullState.actionPlan)
        : undefined;

      const aiHypotheses =
        Array.isArray(json.data.hypotheses) && json.data.hypotheses.length > 0
          ? json.data.hypotheses
          : Array.isArray(json.data.interpretations) && json.data.interpretations.length > 0
          ? json.data.interpretations
          : localDerived.hypotheses || [];

      const mergedMap: StrategicMapData = {
        ...strategicMap,
        summaryChallenge: json.data.summaryChallenge,
        keyInsight: json.data.keyInsight,
        prioritizedHackKeys: prioritizedHacks.map((h) => h.key),
        tacticalMantra: json.data.tacticalMantra,
        defensiveMoat: json.data.defensiveMoat,
        nonNegotiables: json.data.nonNegotiables || [],
        facts: json.data.facts || localDerived.facts || [],
        interpretations: json.data.interpretations || aiHypotheses,
        hypotheses: aiHypotheses,
        imaginedPossibilities:
          Array.isArray(json.data.imaginedPossibilities) &&
          json.data.imaginedPossibilities.length > 0
            ? json.data.imaginedPossibilities
            : localDerived.imaginedPossibilities || [],
        uncertainties: json.data.uncertainties || localDerived.uncertainties || [],
        criticalPoints: json.data.criticalPoints || localDerived.criticalPoints || [],
        nextSteps: json.data.nextSteps || localDerived.nextSteps || [],
        hackDeliverables: localDerived.hackDeliverables || [],
        realWorldOptions:
          Array.isArray(json.data.realWorldOptions) && json.data.realWorldOptions.length > 0
            ? json.data.realWorldOptions
            : localDerived.realWorldOptions || [],
        liveSessionBrief: json.data.liveSessionBrief || localDerived.liveSessionBrief,
        synthesisSource: 'ai',
        isSynthesized: true,
        generatedAt: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      };

      onApplySynthesis(mergedMap, syncedPlan);
      setProcessingState('done');
      playSuccessChime();
      triggerConfetti();
    } catch (err: any) {
      setProcessingState('error');
      setErrorMessage(
        err.message || 'Ocurrió un error al conectar con el servidor de procesamiento.'
      );
    }
  };

  const factsList = strategicMap.facts?.length ? strategicMap.facts : derivedFallback.facts || [];
  const hypothesesList = strategicMap.hypotheses?.length
    ? strategicMap.hypotheses
    : strategicMap.interpretations?.length
    ? strategicMap.interpretations
    : derivedFallback.hypotheses || [];
  const possibilitiesList = strategicMap.imaginedPossibilities?.length
    ? strategicMap.imaginedPossibilities
    : derivedFallback.imaginedPossibilities || [];
  const uncertaintiesList = strategicMap.uncertainties?.length
    ? strategicMap.uncertainties
    : derivedFallback.uncertainties || [];
  const criticalPointsList = strategicMap.criticalPoints?.length
    ? strategicMap.criticalPoints
    : derivedFallback.criticalPoints || [];
  const nextStepsList = strategicMap.nextSteps?.length
    ? strategicMap.nextSteps
    : derivedFallback.nextSteps || [];
  const hackDeliverablesList = strategicMap.hackDeliverables?.length
    ? strategicMap.hackDeliverables
    : derivedFallback.hackDeliverables || [];
  const realWorldOptionsList = strategicMap.realWorldOptions?.length
    ? strategicMap.realWorldOptions
    : derivedFallback.realWorldOptions || [];
  const liveBrief = strategicMap.liveSessionBrief || derivedFallback.liveSessionBrief;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-2 tabular-nums">
            <Crown className="w-3.5 h-3.5" />
            <span>
              Paso 11 de 13 · Fase C · Mundo Real ({isOrg ? 'Recorrido Organizaciones' : 'Recorrido Personas'})
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Síntesis del Caso, Contraste en el Mundo Real y Sesión en Vivo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Separa con rigor hechos, hipótesis medibles y posibilidades imaginadas; compara tus alternativas frente a recursos y riesgos; y prepara la sesión en vivo con un siguiente paso defendible.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => handleLocalProcess(false)}
            disabled={processingState === 'loading'}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recalcular Síntesis</span>
          </button>

          <button
            type="button"
            onClick={handleAiProcess}
            disabled={processingState === 'loading'}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border border-purple-500/35 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {processingState === 'loading' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-purple-300" />
            ) : (
              <Bot className="w-4 h-4 text-purple-400" />
            )}
            <span>{processingState === 'loading' ? 'Procesando...' : 'Profundizar con Motor IA'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Informe PDF</span>
          </button>
        </div>
      </div>

      {/* LOADING STATE */}
      {processingState === 'loading' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-center space-y-3">
          <RefreshCw className="w-7 h-7 text-amber-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-100">
            Procesando tus respuestas y contrastando alternativas en el Mundo Real...
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Separando hechos observables, hipótesis medibles, posibilidades imaginadas y preparando tu guía de sesión en vivo.
          </p>
        </div>
      )}

      {/* EXTERNAL AI UNAVAILABLE NOTICE WITH CLEAR LOCAL ENGINE CONTINUITY */}
      {processingState === 'error' && errorMessage && (
        <div
          role="alert"
          className="p-6 rounded-3xl bg-amber-950/25 border border-amber-500/40 space-y-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-amber-300 uppercase font-bold block">
                Motor Externo de IA No Disponible · Motor Analítico Local Activo
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{errorMessage}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {strategicMap.isSynthesized
                  ? 'Tus resultados actuales provienen del Motor Analítico Local determinista, calculado directamente sobre tus respuestas reales sin pérdida de información.'
                  : 'Pulsa el botón inferior para generar de inmediato tu síntesis estructurada con el Motor Analítico Local.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pl-8">
            <button
              type="button"
              onClick={() => handleLocalProcess(false)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              {strategicMap.isSynthesized
                ? 'Actualizar con Motor Analítico Local (Activo)'
                : 'Generar Síntesis con Motor Analítico Local'}
            </button>
            <button
              type="button"
              onClick={handleAiProcess}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Reintentar Motor IA Externo
            </button>
          </div>
        </div>
      )}

      {/* EMPTY GUARD IF USER JUMPED WITHOUT ENTERING DATA */}
      {!strategicMap.isSynthesized && processingState !== 'loading' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Aún no se han procesado respuestas suficientes. Registra tu situación en el Paso 01 o ejecuta ahora el Motor Analítico Local sobre los datos cargados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onJumpToModule(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
            >
              Ir a Completar Paso 01
            </button>
            <button
              type="button"
              onClick={() => handleLocalProcess(false)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              Procesar con Motor Analítico Local
            </button>
          </div>
        </div>
      )}

      {/* PERSONALIZED RESULTS CARD */}
      {strategicMap.isSynthesized && (
        <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-amber-500/40 shadow-2xl space-y-8 overflow-hidden">
          <div className="absolute top-0 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Quick Edit & Engine Transparency Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80 text-xs font-mono text-slate-400">
            <div className="space-y-0.5">
              <span>
                Motor activo:{' '}
                <strong className="text-amber-300">
                  {strategicMap.synthesisSource === 'ai'
                    ? 'Motor Estratégico IA Externo (Gemini)'
                    : 'Motor Analítico Local DecoX (Determinista · Sin dependencia externa)'}
                </strong>
              </span>
              {strategicMap.synthesisSource !== 'ai' && (
                <span className="block text-[11px] text-slate-500 font-sans">
                  Calculado en este navegador a partir de tus hechos, hipótesis, posibilidades imaginadas y experimentos reales.
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onJumpToModule(1)}
                className="hover:text-amber-300 underline underline-offset-4 cursor-pointer"
              >
                Editar Contexto
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onJumpToModule(2)}
                className="hover:text-amber-300 underline underline-offset-4 cursor-pointer"
              >
                Editar Epistemología
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onJumpToModule(3)}
                className="hover:text-amber-300 underline underline-offset-4 cursor-pointer"
              >
                Mundo Simulado
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onJumpToModule(7)}
                className="hover:text-amber-300 underline underline-offset-4 cursor-pointer"
              >
                Decodificación
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onJumpToModule(DISCOVERY_EXPERIMENTS_STEP)}
                className="hover:text-amber-300 underline underline-offset-4 cursor-pointer"
              >
                Experimentos
              </button>
            </div>
          </div>

          {/* Map Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-start gap-4">
              <img
                src="/images/chalamandra-emblem.jpg"
                alt="Logo Salamandra Chalamandra Magistral"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-2xl object-cover ring-1 ring-amber-400/50 shadow-lg shrink-0 mt-1"
              />
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                  CHALAMANDRA MAGISTRAL · FASE C (MUNDO REAL) · {isOrg ? 'ORGANIZACIONES' : 'PERSONAS'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                  {challenge.title || `${challenge.explorationFocus || 'Exploración'} · ${challenge.category}`}
                </h1>
                <p className="text-xs text-slate-400">
                  Titular: <strong className="text-amber-300">{challenge.clientName || 'Participante'}</strong>
                  {challenge.companyOrRole ? ` (${challenge.companyOrRole})` : ''} · {strategicMap.generatedAt}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <Award className="w-5 h-5 text-amber-400" />
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  {challenge.explorationFocus || 'Enfoque'}
                </span>
                <span className="text-xs font-bold text-slate-100">{challenge.category}</span>
              </div>
            </div>
          </div>

          {/* 1. EPISTEMIC SEPARATION: FACTS vs HYPOTHESES vs IMAGINED POSSIBILITIES vs UNCERTAINTIES */}
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                1. Matriz Epistémica (Hechos · Hipótesis · Posibilidades Imaginadas · Incertidumbres)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Regla: ninguna correlación se presenta como causalidad probada
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facts */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Hechos Observados y Restricciones Reales</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  {factsList.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-mono font-bold">·</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hypotheses */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>Hipótesis a Comprobar (No Causalidad Probada)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  {hypothesesList.map((hyp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono font-bold">·</span>
                      <span>{hyp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Imagined Possibilities (Mundo Simulado) */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-bold uppercase">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Posibilidades Imaginadas (Fase A · Mundo Simulado)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  {possibilitiesList.map((pos, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-400 font-mono font-bold">·</span>
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Uncertainties */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Incertidumbres por Verificar en Terreno</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  {uncertaintiesList.map((unc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-mono font-bold">·</span>
                      <span>{unc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 2. DELIVERABLES FROM THE 7 CHALAMANDRA HACKS */}
          {hackDeliverablesList.length > 0 && (
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>2. Entregables Generados con los Hacks de Chalamandra</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hackDeliverablesList.map((item) => (
                  <div
                    key={item.hackId}
                    className="p-4 rounded-2xl bg-slate-950/85 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() =>
                          onJumpToModule(STEP_NUM_BY_HACK_ID[item.hackId] || 3)
                        }
                        className="text-cyan-300 hover:text-amber-300 font-bold underline underline-offset-2 cursor-pointer text-left"
                      >
                        {item.hackName}
                      </button>
                      <span className="text-amber-300 uppercase">{item.epistemicTag}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-100 block">
                      {item.deliverableTitle}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Core Summary & Key Insight */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                3. Síntesis del Caso ({isOrg ? 'Sistema Organizacional' : 'Proyecto / Desafío'})
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {strategicMap.summaryChallenge}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block">
                4. Nodo Crítico y Lectura Sistémica
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {strategicMap.keyInsight}
              </p>
            </div>
          </div>

          {/* 5. FASE C · REAL WORLD OPTIONS COMPARISON */}
          {realWorldOptionsList.length > 0 && (
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>
                  5. Fase C · Mundo Real: Comparación de Alternativas (Recursos · Riesgos · Resultados)
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {realWorldOptionsList.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      opt.recommended
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-950/85 border-slate-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                        {opt.originPhase} {opt.recommended ? '· Ruta Recomendada' : ''}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                        {opt.optionTitle}
                      </h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px] uppercase">
                          Recursos requeridos
                        </span>
                        <span className="text-slate-300">{opt.resourcesRequired}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px] uppercase">
                          Riesgo principal
                        </span>
                        <span className="text-rose-300">{opt.keyRisk}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px] uppercase">
                          Resultado esperado
                        </span>
                        <span className="text-emerald-300">{opt.expectedOutcome}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. LIVE SESSION BRIDGE & DEFENSIBLE NEXT STEP */}
          {liveBrief && (
            <div className="relative z-10 p-6 rounded-2xl bg-slate-950/90 border border-amber-500/40 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4" />
                  <span>6. Puente a la Sesión en Vivo y Siguiente Paso Defendible</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Valor de referencia ecosistema: USD 27 (cobro no configurado en esta vista)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div className="space-y-2">
                  <span className="font-mono text-rose-300 uppercase text-[10px] font-bold block">
                    Nodo Crítico para Decidir en Vivo
                  </span>
                  <p className="text-slate-200 leading-relaxed">{liveBrief.criticalNode}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-emerald-300 uppercase text-[10px] font-bold block">
                    Siguiente Paso Defendible (24–72h)
                  </span>
                  <p className="text-slate-100 font-semibold leading-relaxed">
                    {liveBrief.defensibleNextStep}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-amber-300 uppercase text-[10px] font-bold block">
                    Preguntas Clave para la Sesión en Vivo
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    {liveBrief.questionsForLiveSession.map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-mono font-bold tabular-nums">
                          {i + 1}.
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-cyan-300 uppercase text-[10px] font-bold block">
                    Preparación antes del Encuentro
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    {liveBrief.preparationChecklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-mono font-bold">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Critical Points & Prioritized Next Steps */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/85 border border-rose-500/30 space-y-3">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider block">
                7. Puntos Críticos Detectados
              </span>
              <div className="space-y-2">
                {criticalPointsList.map((cp, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <span className="text-rose-400 font-mono font-bold tabular-nums">{idx + 1}.</span>
                    <span>{cp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/85 border border-emerald-500/30 space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                8. Movimientos Operativos Inmediatos (24–72h)
              </span>
              <div className="space-y-2">
                {nextStepsList.map((ns, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed">
                    <span className="text-emerald-400 font-mono font-bold tabular-nums">{idx + 1}.</span>
                    <span>{ns}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tactical Mantra Banner (Editable) */}
          <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-slate-900 border border-amber-500/35 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
              <span>Principio Rector de Ejecución</span>
              <button
                type="button"
                onClick={() => setEditingMantra(!editingMantra)}
                className="text-slate-400 hover:text-amber-300 cursor-pointer"
                title="Editar principio rector"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
            {editingMantra ? (
              <div className="max-w-2xl mx-auto flex gap-2">
                <input
                  type="text"
                  value={strategicMap.tacticalMantra}
                  onChange={(e) =>
                    onChangeMap({ ...strategicMap, tacticalMantra: e.target.value })
                  }
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-sm font-mono text-amber-300 text-center"
                />
                <button
                  type="button"
                  onClick={() => setEditingMantra(false)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Listo
                </button>
              </div>
            ) : (
              <h2 className="text-lg sm:text-2xl font-extrabold text-amber-300 font-mono tracking-wide">
                "{strategicMap.tacticalMantra}"
              </h2>
            )}
          </div>

          {/* Prioritized Hacks & Legitimate Advantage + Non-negotiables */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>9. Ventaja Legítima Dentro de las Reglas</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {strategicMap.defensiveMoat}
              </p>
              {prioritizedHacks.length > 0 && (
                <div className="pt-2 border-t border-slate-850 text-[11px] font-mono text-cyan-300">
                  Hacks activos: {prioritizedHacks.map((h) => `${h.codeNumber}. ${h.archetypeName}`).join(' · ')}
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>10. Reglas Éticas y Operativas No Negociables</span>
              </div>
              <div className="space-y-1.5">
                {strategicMap.nonNegotiables.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-amber-400 font-bold font-mono">·</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Linked Session Visual Strip */}
          {visualUrl && (
            <div className="relative z-10 rounded-2xl overflow-hidden border border-amber-500/25 bg-slate-950">
              <img
                src={visualUrl}
                alt="Visión Estratégica de la Sesión de Descubrimiento"
                referrerPolicy="no-referrer"
                className="w-full h-40 sm:h-48 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-amber-300">Ancla Visual de la Sesión</span>
                {onOpenVisualStudio && (
                  <button
                    type="button"
                    onClick={onOpenVisualStudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/90 hover:bg-slate-900 text-slate-200 hover:text-amber-300 border border-amber-500/30 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Personalizar en Estudio Visual AI</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Experimentos Controlados</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span>Continuar a Ruta Ejecutable de 30 Días</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
