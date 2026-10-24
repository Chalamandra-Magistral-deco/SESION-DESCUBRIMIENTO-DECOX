import React, { useState } from 'react';
import {
  Printer,
  Cloud,
  ArrowLeft,
  ShieldCheck,
  Award,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DiscoveryDeliverableState } from '../../types';
import { SEVEN_MAGISTRAL_HACKS } from '../../utils/constants';
import { DISCOVERY_SYNTHESIS_STEP } from '../../data/discoveryFlowConfig';
import {
  deriveSynthesisFromResponses,
  mergeActionPlanPreservingCustomTasks
} from '../../utils/discoverySynthesisEngine';
import { useAudio } from '../../hooks/useAudio';
import { triggerConfetti } from '../Confetti';

interface Module07ExecutiveReportProps {
  state: DiscoveryDeliverableState;
  onSaveServer: () => Promise<boolean>;
  onMarkCompleted: () => void;
  onPrev: () => void;
  onJumpToModule: (moduleNum: number) => void;
}

export default function Module07ExecutiveReport({
  state,
  onSaveServer,
  onMarkCompleted,
  onPrev,
  onJumpToModule
}: Module07ExecutiveReportProps) {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { playSuccessChime } = useAudio();

  const derivedBundle = deriveSynthesisFromResponses(state);
  const effectiveMap = state.strategicMap.isSynthesized
    ? state.strategicMap
    : derivedBundle.strategicMap;

  const isPlanEmpty = state.actionPlan.every((w) => w.tasks.length === 0);
  const effectiveActionPlan =
    isPlanEmpty || state.planNeedsSync
      ? mergeActionPlanPreservingCustomTasks(derivedBundle.recommendedPlan, state.actionPlan)
      : state.actionPlan;

  const prioritizedHacks = SEVEN_MAGISTRAL_HACKS.filter((h) =>
    state.selectedHackIds.includes(h.id)
  );

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const ok = await onSaveServer();
      if (!ok) {
        throw new Error('No se pudo sincronizar con el servidor; tus datos permanecen guardados localmente.');
      }
      onMarkCompleted();
      setSaveSuccess(true);
      playSuccessChime();
      triggerConfetti();
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e: any) {
      setSaveError(e.message || 'Error al sincronizar con el servidor.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadJson = () => {
    const exportPayload: DiscoveryDeliverableState = {
      ...state,
      strategicMap: effectiveMap,
      actionPlan: effectiveActionPlan,
      planNeedsSync: false
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sesion-descubrimiento-decox-${state.sessionId || Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Completion & Action Bar (Hidden in Print) */}
      <div className="no-print border-b border-slate-800 pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-2 tabular-nums">
            <FileText className="w-3.5 h-3.5" />
            <span>Paso 13 de 13 · Fase C · Mundo Real: Entrega Ejecutiva</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Informe Ejecutivo de Sesión de Descubrimiento
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Documento consolidado a partir de tus respuestas. Puedes sincronizarlo, exportar respaldo estructurado o imprimirlo como PDF oficial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>
              {saving
                ? 'Sincronizando...'
                : saveSuccess
                ? 'Sesión Sellada y Sincronizada'
                : 'Sellar y Guardar Sesión'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Respaldo JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Descargar / Imprimir PDF</span>
          </button>
        </div>
      </div>

      {/* Persistence & Session Scope Notice (Hidden in Print) */}
      <div className="no-print p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <strong className="text-slate-200 font-mono">Persistencia actual ({state.sessionId}):</strong>{' '}
          Tu sesión se conserva automáticamente en este navegador (<code className="text-amber-300">localStorage</code>) al recargar la página, pero no sincroniza automáticamente entre dispositivos distintos. El guardado en servidor utiliza memoria temporal volátil; para conservar una copia permanente fuera de este navegador, descarga el <strong className="text-slate-200">Respaldo JSON</strong> o el <strong className="text-slate-200">Informe PDF</strong>.
        </div>
      </div>

      {/* Completion or Error Feedback */}
      {state.sessionCompleted && (
        <div className="no-print p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/35 text-xs text-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Sesión finalizada y respaldada en este navegador (y en memoria temporal activa del servidor). Puedes volver a cualquier paso si necesitas ajustar respuestas y regenerar este informe.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToModule(1)}
            className="text-emerald-300 hover:underline font-mono shrink-0 cursor-pointer"
          >
            Editar respuestas
          </button>
        </div>
      )}

      {saveError && (
        <div className="no-print p-4 rounded-2xl bg-rose-500/10 border border-rose-500/35 text-xs text-rose-200 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* PRINTABLE EXECUTIVE DOCUMENT CONTAINER                         */}
      {/* ============================================================== */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 shadow-2xl print:p-0 print:border-none print:shadow-none print:bg-white print:text-slate-900">
        {/* Official Header */}
        <div className="border-b-2 border-amber-500/40 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 print:border-slate-300">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <img
                src="/images/chalamandra-emblem.jpg"
                alt="Logo Salamandra Chalamandra Magistral"
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-xl object-cover shadow-md ring-1 ring-amber-500/40 print:border print:border-slate-800"
              />
              <div>
                <span className="font-extrabold text-base tracking-wider text-slate-100 print:text-slate-900">
                  CHALAMANDRA MAGISTRAL · DECOX
                </span>
                <span className="block text-[10px] font-mono text-amber-400 print:text-amber-700">
                  SESIÓN DE DESCUBRIMIENTO · SÍNTESIS PERSONALIZADA
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 print:text-slate-900 pt-3">
              INFORME DE EXPLORACIÓN Y MAPA ESTRATÉGICO
            </h1>
          </div>

          <div className="sm:text-right text-xs font-mono text-slate-400 print:text-slate-600 space-y-0.5">
            {state.isDemoCase && (
              <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 print:text-amber-800 font-bold mb-1">
                CASO DE REFERENCIA DEMOSTRATIVO
              </span>
            )}
            <span className="block font-bold text-slate-200 print:text-slate-800">
              DOCUMENTO DE TRABAJO PRIVADO · ID: {state.sessionId}
            </span>
            <span>
              Fecha: {effectiveMap.generatedAt || new Date().toLocaleDateString('es-ES')}
            </span>
            <span className="block">
              Titular: {state.challenge.clientName || 'Participante de Sesión'}
            </span>
            {state.challenge.companyOrRole && (
              <span className="block text-amber-400 print:text-amber-700">
                {state.challenge.companyOrRole}
              </span>
            )}
          </div>
        </div>

        {/* Section 1: Challenge & Context */}
        <div className="space-y-3 print-card p-5 rounded-2xl bg-slate-950/60 border border-slate-850">
          <h2 className="text-xs font-bold text-amber-400 print:text-amber-700 font-mono uppercase tracking-wider">
            01. CONTEXTO Y RECORRIDO ({state.challenge.track === 'organizacion' ? 'ORGANIZACIONES' : 'PERSONAS'} · {state.challenge.explorationFocus || 'Exploración'})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-mono">Frente Definido:</span>
              <p className="font-semibold text-slate-200 print:text-slate-900">
                {state.challenge.title || 'Sin título especificado'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Ámbito y Horizonte:</span>
              <p className="font-semibold text-slate-200 print:text-slate-900">
                {state.challenge.category} ({state.challenge.timeframe || 'Por definir'})
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="text-slate-400 block font-mono">Situación Observable y Fricción:</span>
              <p className="text-slate-300 print:text-slate-700 mt-0.5 leading-relaxed">
                {state.challenge.currentSituation}{' '}
                {state.challenge.criticalFriction
                  ? `— Fricción crítica: ${state.challenge.criticalFriction}`
                  : ''}
              </p>
            </div>
            {state.challenge.keyActorsAndIncentives && (
              <div className="md:col-span-2">
                <span className="text-slate-400 block font-mono">Actores e Incentivos del Tablero:</span>
                <p className="text-slate-300 print:text-slate-700 mt-0.5 leading-relaxed">
                  {state.challenge.keyActorsAndIncentives}
                </p>
              </div>
            )}
            <div className="md:col-span-2">
              <span className="text-slate-400 block font-mono">Indicador Verificable de Éxito:</span>
              <p className="text-emerald-400 print:text-emerald-700 font-mono font-bold mt-0.5">
                {state.challenge.primaryMetric || 'Pendiente de cuantificar'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Epistemic Distinction (Facts / Hypotheses / Imagined Possibilities / Uncertainties) */}
        <div className="space-y-3 print-card p-5 rounded-2xl bg-slate-950/60 border border-slate-850">
          <h2 className="text-xs font-bold text-cyan-400 print:text-cyan-800 font-mono uppercase tracking-wider">
            02. CLARIFICACIÓN EPISTÉMICA: HECHOS, HIPÓTESIS, POSIBILIDADES E INCERTIDUMBRES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-mono font-bold text-cyan-300 print:text-cyan-800 block mb-1">
                Hechos Declarados:
              </span>
              <ul className="list-disc list-inside text-slate-300 print:text-slate-700 space-y-1">
                {(effectiveMap.facts || derivedBundle.strategicMap.facts || []).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-mono font-bold text-emerald-300 print:text-emerald-800 block mb-1">
                Hipótesis Medibles (Correlación ≠ Causalidad):
              </span>
              <ul className="list-disc list-inside text-slate-300 print:text-slate-700 space-y-1">
                {(
                  effectiveMap.hypotheses ||
                  effectiveMap.interpretations ||
                  derivedBundle.strategicMap.hypotheses ||
                  []
                ).map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-mono font-bold text-purple-300 print:text-purple-800 block mb-1">
                Posibilidades Imaginadas (Mundo Simulado):
              </span>
              <ul className="list-disc list-inside text-slate-300 print:text-slate-700 space-y-1">
                {(
                  effectiveMap.imaginedPossibilities ||
                  derivedBundle.strategicMap.imaginedPossibilities ||
                  []
                ).map((pos, i) => (
                  <li key={i}>{pos}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-mono font-bold text-amber-300 print:text-amber-800 block mb-1">
                Incertidumbres por Verificar:
              </span>
              <ul className="list-disc list-inside text-slate-300 print:text-slate-700 space-y-1">
                {(effectiveMap.uncertainties || derivedBundle.strategicMap.uncertainties || []).map(
                  (u, i) => (
                    <li key={i}>{u}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Strategic Synthesis, Critical Points & Next Steps */}
        <div className="space-y-4 print-card p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-slate-950 border border-amber-500/40">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono text-amber-400 print:text-amber-800 font-bold uppercase tracking-widest">
              03. PRINCIPIO RECTOR Y NODO CRÍTICO
            </span>
            <h3 className="text-lg sm:text-2xl font-extrabold text-amber-300 print:text-amber-800 font-mono">
              "{effectiveMap.tacticalMantra}"
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <span className="text-slate-400 font-mono block">Lectura Sistémica del Caso:</span>
              <p className="text-slate-200 print:text-slate-900 mt-0.5 leading-relaxed">
                {effectiveMap.keyInsight}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-mono block">Movimientos Operativos (24–72h):</span>
              <ul className="list-disc list-inside text-slate-200 print:text-slate-900 mt-0.5 space-y-1">
                {(effectiveMap.nextSteps || []).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Hacks & Reversible Experiments */}
        {(prioritizedHacks.length > 0 || state.experiments.length > 0) && (
          <div className="space-y-4 print-card p-5 rounded-2xl bg-slate-950/60 border border-slate-850">
            <h2 className="text-xs font-bold text-purple-400 print:text-purple-800 font-mono uppercase tracking-wider">
              04. LOS HACKS DE CHALAMANDRA APLICADOS Y EXPERIMENTOS CONTROLADOS
            </h2>

            {prioritizedHacks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prioritizedHacks.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs"
                  >
                    <span className="font-bold text-amber-400 print:text-amber-800 block">
                      {h.name} · [{h.epistemicRole}]
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300 print:text-cyan-800 block mt-0.5">
                      Entregable: {h.expectedDeliverable}
                    </span>
                    <p className="text-slate-300 print:text-slate-700 leading-snug mt-1">
                      {state.hackNotes[h.id] || h.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {state.experiments.length > 0 && (
              <div className="space-y-2 pt-1">
                {state.experiments.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs flex flex-col sm:flex-row justify-between gap-2"
                  >
                    <div>
                      <strong className="text-emerald-400 print:text-emerald-700">
                        [{exp.hackName}]
                      </strong>{' '}
                      {exp.hypothesis}
                      <p className="text-slate-300 print:text-slate-700 text-[11px] mt-0.5">
                        Variación: {exp.concreteAction}
                      </p>
                      {exp.reversibilityNote && (
                        <p className="text-slate-400 print:text-slate-600 text-[11px] mt-0.5">
                          Reversibilidad: {exp.reversibilityNote}
                        </p>
                      )}
                    </div>
                    <div className="sm:text-right shrink-0 font-mono text-[11px]">
                      <span className="text-amber-400 print:text-amber-800 block">
                        {exp.executionWindow} · {exp.status}
                      </span>
                      <span className="text-slate-400">{exp.successIndicator}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 5: Fase C Real World Option Comparison & Live Session Brief */}
        <div className="space-y-4 print-card p-5 rounded-2xl bg-slate-950/60 border border-slate-850">
          <h2 className="text-xs font-bold text-amber-400 print:text-amber-800 font-mono uppercase tracking-wider">
            05. FASE C (MUNDO REAL): CONTRASTE DE ALTERNATIVAS Y PUENTE A SESIÓN EN VIVO
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {(effectiveMap.realWorldOptions || derivedBundle.strategicMap.realWorldOptions || []).map(
              (opt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 space-y-1"
                >
                  <span className="font-bold text-slate-100 print:text-slate-900 block">
                    {opt.optionTitle}
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    Recursos: {opt.resourcesRequired}
                  </span>
                  <span className="block text-[11px] text-rose-300 print:text-rose-700">
                    Riesgo: {opt.keyRisk}
                  </span>
                  <span className="block text-[11px] text-emerald-300 print:text-emerald-800">
                    Resultado: {opt.expectedOutcome}
                  </span>
                </div>
              )
            )}
          </div>

          {(effectiveMap.liveSessionBrief || derivedBundle.strategicMap.liveSessionBrief) && (
            <div className="p-4 rounded-xl bg-slate-900 print:bg-slate-100 border border-amber-500/30 print:border-slate-300 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-amber-300 print:text-amber-800 font-mono uppercase">
                  Guía para la Sesión en Vivo y Siguiente Paso Defendible
                </strong>
                <span className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                  Referencia ecosistema: USD 27 (cobro no configurado en esta aplicación)
                </span>
              </div>
              <p className="text-slate-200 print:text-slate-900">
                <strong>Siguiente paso defendible:</strong>{' '}
                {
                  (effectiveMap.liveSessionBrief || derivedBundle.strategicMap.liveSessionBrief)
                    ?.defensibleNextStep
                }
              </p>
              <ul className="list-disc list-inside text-slate-300 print:text-slate-700 space-y-1">
                {(
                  (effectiveMap.liveSessionBrief || derivedBundle.strategicMap.liveSessionBrief)
                    ?.questionsForLiveSession || []
                ).map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section 6: 30-Day Execution Plan */}
        <div className="space-y-4 print-card p-5 rounded-2xl bg-slate-950/60 border border-slate-850">
          <h2 className="text-xs font-bold text-emerald-400 print:text-emerald-800 font-mono uppercase tracking-wider">
            06. HOJA DE RUTA A 30 DÍAS EN EL MUNDO REAL
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {effectiveActionPlan.map((w) => (
              <div
                key={w.weekNumber}
                className="p-3.5 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 space-y-2"
              >
                <span className="font-bold text-amber-400 print:text-amber-800 font-mono block">
                  {w.title}
                </span>
                <p className="text-[11px] text-slate-400">{w.focusObjective}</p>
                <div className="space-y-1">
                  {w.tasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-start gap-1.5 text-slate-300 print:text-slate-800 text-[11px]"
                    >
                      <span>{t.completed ? '☑' : '☐'}</span>
                      <span>
                        {t.label} <em className="text-slate-500 font-mono">({t.kpi})</em>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Sign-off */}
        <div className="border-t border-slate-800 print:border-slate-300 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 print:text-slate-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-amber-400 print:text-amber-700" />
            <div>
              <span className="font-bold text-slate-200 print:text-slate-800 block">
                Chalamandra Magistral · Interactive DecoX
              </span>
              <span>Síntesis derivada de las respuestas registradas en la Sesión de Descubrimiento</span>
            </div>
          </div>

          <div className="sm:text-right font-mono text-[11px]">
            <span className="block text-amber-400 print:text-amber-800 font-bold">
              {state.sessionCompleted ? 'Estado: Sesión Finalizada' : 'Estado: En Revisión Activa'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Nav Buttons (Hidden in print) */}
      <div className="no-print flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Plan de 30 Días</span>
        </button>

        <button
          type="button"
          onClick={() => onJumpToModule(DISCOVERY_SYNTHESIS_STEP)}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Award className="w-4 h-4" />
          <span>Volver a Fase C · Mundo Real</span>
        </button>
      </div>
    </div>
  );
}
