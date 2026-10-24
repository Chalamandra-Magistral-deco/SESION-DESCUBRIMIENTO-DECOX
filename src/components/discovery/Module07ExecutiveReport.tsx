import React, { useState } from 'react';
import {
  Printer,
  Cloud,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu
} from 'lucide-react';
import {
  DiscoveryDeliverableState,
  StrategicMapData,
  ActionPlanWeek
} from '../../types';
import {
  HACKS_DATA,
  getPoderForHack,
  INTERACTIVE_ARCHETYPES
} from '../../data/interactiveCatalog';
import { recommendSingleHackForCase } from '../../data/discoveryFlowConfig';
import {
  deriveSynthesisFromResponses,
  deriveSrapFromCase,
  formatHackPlantillaSummary,
  mergeActionPlanPreservingCustomTasks,
  sanitizeActivePayloadForProcessing
} from '../../utils/discoverySynthesisEngine';
import { useAudio } from '../../hooks/useAudio';
import { triggerConfetti } from '../Confetti';
import { ChalamandraMedallion, AlchemicalGeometryBackdrop } from '../ChalamandraSeal';

interface Module07ExecutiveReportProps {
  state: DiscoveryDeliverableState;
  onSaveServer: () => Promise<boolean>;
  onMarkCompleted: () => void;
  onApplySynthesis: (updatedMap: StrategicMapData, updatedPlan: ActionPlanWeek[]) => void;
  onPrev: () => void;
  onJumpToModule: (moduleNum: number) => void;
}

export default function Module07ExecutiveReport({
  state,
  onSaveServer,
  onMarkCompleted,
  onApplySynthesis,
  onPrev,
  onJumpToModule
}: Module07ExecutiveReportProps) {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [engineNotice, setEngineNotice] = useState<string | null>(null);

  const { playSuccessChime } = useAudio();

  const recommendation = recommendSingleHackForCase(state.challenge, state.strategicProfile);
  const chosenHack =
    (state.selectedHackId ? HACKS_DATA.find((h) => h.id === state.selectedHackId) : null) ||
    recommendation.recommendedHack;
  const linkedPower = getPoderForHack(chosenHack);
  const plantillaPairs = formatHackPlantillaSummary(
    chosenHack.id,
    state.hackPlantillaResponses
  );

  const derivedBundle = deriveSynthesisFromResponses(state);
  const effectiveMap = state.strategicMap.isSynthesized
    ? state.strategicMap
    : derivedBundle.strategicMap;

  const effectiveSrap =
    state.srapOrientation?.sincronizar?.trim() &&
    state.srapOrientation?.reconocer?.trim() &&
    state.srapOrientation?.activar?.trim() &&
    state.srapOrientation?.pausa?.trim() &&
    !state.srapNeedsSync
      ? state.srapOrientation
      : deriveSrapFromCase(state);

  const isPlanEmpty = state.actionPlan.every((w) => w.tasks.length === 0);
  const effectiveActionPlan =
    isPlanEmpty || state.planNeedsSync
      ? mergeActionPlanPreservingCustomTasks(derivedBundle.recommendedPlan, state.actionPlan)
      : state.actionPlan;

  const archetypeHyp = state.strategicProfile.archetypeHypothesis || null;
  const archetypeDetails = archetypeHyp ? INTERACTIVE_ARCHETYPES[archetypeHyp] : null;

  const handleRefreshLocalSynthesis = () => {
    const fresh = deriveSynthesisFromResponses(state);
    const mergedPlan = mergeActionPlanPreservingCustomTasks(
      fresh.recommendedPlan,
      state.actionPlan
    );
    onApplySynthesis(fresh.strategicMap, mergedPlan);
    setEngineNotice(
      'Ruta inicial actualizada mediante el Motor Analítico Local determinista sobre tus respuestas actuales.'
    );
  };

  const handleProcessWithExternalAI = async () => {
    setAiProcessing(true);
    setEngineNotice(null);
    try {
      const payload = sanitizeActivePayloadForProcessing(state);
      const res = await fetch('/api/discovery/process-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (res.ok && json.success && json.data) {
        const aiMap: StrategicMapData = {
          ...derivedBundle.strategicMap,
          ...json.data,
          synthesisSource: 'ai',
          isSynthesized: true,
          generatedAt: new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })
        };
        const mergedPlan = mergeActionPlanPreservingCustomTasks(
          derivedBundle.recommendedPlan,
          state.actionPlan
        );
        onApplySynthesis(aiMap, mergedPlan);
        setEngineNotice('Síntesis complementada con el motor externo de IA.');
      } else {
        const mergedPlan = mergeActionPlanPreservingCustomTasks(
          derivedBundle.recommendedPlan,
          state.actionPlan
        );
        onApplySynthesis(derivedBundle.strategicMap, mergedPlan);
        setEngineNotice(
          json?.error ||
            'El motor externo no está disponible en este momento; se mantiene activa la síntesis del Motor Analítico Local.'
        );
      }
    } catch {
      const mergedPlan = mergeActionPlanPreservingCustomTasks(
        derivedBundle.recommendedPlan,
        state.actionPlan
      );
      onApplySynthesis(derivedBundle.strategicMap, mergedPlan);
      setEngineNotice(
        'No hubo conexión con el motor externo; tu Ruta Inicial permanece generada con el Motor Analítico Local.'
      );
    } finally {
      setAiProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const ok = await onSaveServer();
      if (!ok) {
        throw new Error(
          'No se pudo sincronizar con la memoria temporal del servidor; tus datos siguen guardados en este navegador.'
        );
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
      selectedHackId: chosenHack.id,
      srapOrientation: effectiveSrap,
      strategicMap: effectiveMap,
      actionPlan: effectiveActionPlan,
      planNeedsSync: false,
      srapNeedsSync: false
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ruta-inicial-decox-${state.sessionId || Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const uncertaintiesList =
    effectiveMap.uncertainties && effectiveMap.uncertainties.length > 0
      ? effectiveMap.uncertainties
      : derivedBundle.strategicMap.uncertainties || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Barra de Cierre y Acciones (Oculta en Impresión A4) */}
      <div className="no-print border-b border-[#D4AF37]/35 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#ECC964] text-xs font-mono font-semibold tabular-nums">
            <FileText className="w-4 h-4 text-[#ECC964]" />
            <span>Fase 05 de 05 · Cerrar con una Ruta Inicial</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#FAF6ED] tracking-tight text-balance">
            Ruta Inicial e Informe Ejecutivo Personalizado
          </h2>
          <p className="text-xs sm:text-sm text-[#D6CFC2] max-w-2xl leading-relaxed">
            Síntesis breve, fundamentada y accionable con tu problema prioritario, tu hipótesis de trabajo, la aplicación real de <strong className="text-[#FFF0BE]">{chosenHack.title}</strong>, tu orientación SRAP y exportación directa a PDF/A4 o JSON.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap ${
              saveSuccess
                ? 'chalamandra-selector-emerald text-emerald-200'
                : 'chalamandra-btn-secondary'
            }`}
          >
            <Cloud className="w-4 h-4 text-[#ECC964] shrink-0" />
            <span>
              {saving
                ? 'Guardando...'
                : saveSuccess
                ? 'Sesión sellada'
                : 'Sellar sesión'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl chalamandra-btn-secondary text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-[#ECC964] shrink-0" />
            <span>Exportar JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl chalamandra-btn-primary font-bold text-xs cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Imprimir / Guardar PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* Estado transparente del Motor de Síntesis y Persistencia (Oculto en impresión) */}
      <div className="no-print p-5 rounded-2xl chalamandra-surface space-y-3 text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-[#DDD6C7]">
            <div className="font-mono text-[#FFF0BE] font-semibold">
              Motor activo:{' '}
              {effectiveMap.synthesisSource === 'ai'
                ? 'Motor de IA externo'
                : 'Motor Analítico Local (determinista sobre tus respuestas)'}
            </div>
            <p className="text-[#C4BCAD] leading-relaxed">
              Persistencia (<span className="font-mono text-[#FAF6ED]">{state.sessionId}</span>): tu avance se recupera en este navegador (<code className="text-[#ECC964] font-mono">localStorage</code>), sin sincronización automática entre dispositivos distintos ni autenticación entre clientes. El respaldo en servidor usa memoria temporal volátil.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefreshLocalSynthesis}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl chalamandra-btn-secondary font-semibold cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#ECC964] shrink-0" />
              <span>Recalcular con motor local</span>
            </button>

            <button
              type="button"
              disabled={aiProcessing}
              onClick={handleProcessWithExternalAI}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl chalamandra-btn-secondary font-semibold cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <Cpu className="w-3.5 h-3.5 text-[#ECC964] shrink-0" />
              <span>{aiProcessing ? 'Consultando motor IA...' : 'Intentar síntesis IA externa'}</span>
            </button>
          </div>
        </div>

        {engineNotice && (
          <div className="p-3 rounded-xl chalamandra-chamber text-[#FAF6ED] font-mono text-[11px]">
            {engineNotice}
          </div>
        )}
      </div>

      {state.sessionCompleted && (
        <div className="no-print p-4 rounded-xl chalamandra-surface-emerald text-xs text-emerald-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>
              Ruta inicial sellada. Si modificas cualquier respuesta en las fases 01 a 04, este informe se actualizará con tus nuevos datos.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToModule(1)}
            className="text-emerald-200 hover:underline font-mono shrink-0 cursor-pointer whitespace-nowrap"
          >
            Editar respuestas
          </button>
        </div>
      )}

      {saveError && (
        <div className="no-print p-4 rounded-xl chalamandra-surface-rose text-xs text-rose-100 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* DOSSIER EJECUTIVO A4 (OBSIDIANA/ORO EN PANTALLA · B/N EN A4)   */}
      {/* ============================================================== */}
      <article className="print-dossier relative overflow-hidden p-7 sm:p-10 rounded-2xl chalamandra-surface-elevated space-y-6">
        <AlchemicalGeometryBackdrop className="absolute -right-28 -top-28 w-[420px] h-[420px] text-[#ECC964] opacity-[0.16]" />

        {/* Cabecera Oficial del Dossier */}
        <header className="relative z-10 border-b border-[#D4AF37]/38 print:border-slate-300 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3.5">
              <ChalamandraMedallion size="md" className="print:border print:border-slate-400 print:rounded-lg" />
              <div>
                <span className="font-display font-semibold text-sm tracking-wide text-[#FAF6ED] print:text-slate-900 block">
                  Chalamandra Magistral · <span className="text-[#ECC964] print:text-slate-900">Interactive DecoX</span>
                </span>
                <span className="text-[11px] font-mono text-[#ECC964] print:text-slate-600">
                  Informe Ejecutivo · Sesión de Descubrimiento (5 Fases)
                </span>
              </div>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#FAF6ED] print:text-slate-900 pt-1 text-balance">
              {state.challenge.title.trim() || 'Ruta Inicial de Descubrimiento Aplicado'}
            </h1>
          </div>

          <div className="sm:text-right text-xs font-mono text-[#D6CFC2] print:text-slate-600 space-y-0.5 tabular-nums">
            {state.isDemoCase && (
              <span className="block font-bold text-[#FFF0BE] print:text-slate-800">
                CASO DEMOSTRATIVO DE REFERENCIA
              </span>
            )}
            <span className="block font-semibold text-[#FFF0BE] print:text-slate-900">
              ID: {state.sessionId}
            </span>
            <span className="block">
              Fecha: {effectiveMap.generatedAt || new Date().toLocaleDateString('es-ES')}
            </span>
            <span className="block">
              Recorrido:{' '}
              {state.challenge.track === 'organizacion' ? 'Organizaciones' : 'Personas'} ·{' '}
              {state.challenge.domain || 'Negocios'}
            </span>
            {(state.challenge.clientName || state.challenge.companyOrRole) && (
              <span className="block text-[#FAF6ED] print:text-slate-800">
                {[state.challenge.clientName, state.challenge.companyOrRole]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            )}
          </div>
        </header>

        {/* 01. Síntesis del Problema Prioritario y Objetivo */}
        <section className="relative z-10 print-card p-5 rounded-xl chalamandra-surface space-y-3 text-xs">
          <h2 className="font-display font-semibold text-sm text-[#FFF0BE] print:text-slate-900">
            01. Problema prioritario, lo intentado y cambio deseado
          </h2>
          <p className="text-[#FAF6ED] print:text-slate-900 font-medium leading-relaxed">
            {effectiveMap.summaryChallenge}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <span className="font-mono text-[#ECC964] print:text-slate-600 block">
                Situación y fricción actual:
              </span>
              <p className="text-[#DDD6C7] print:text-slate-800 mt-0.5 leading-relaxed">
                {[state.challenge.currentSituation.trim(), state.challenge.criticalFriction.trim()]
                  .filter(Boolean)
                  .join(' — ') || 'Pendiente de detallar en Fase 01.'}
              </p>
            </div>

            <div>
              <span className="font-mono text-[#ECC964] print:text-slate-600 block">
                Intentos previos y restricciones reales:
              </span>
              <p className="text-[#DDD6C7] print:text-slate-800 mt-0.5 leading-relaxed">
                {state.challenge.previousAttempts?.trim()
                  ? `Intentado: ${state.challenge.previousAttempts.trim()} `
                  : ''}
                {state.challenge.constraintsSummary?.trim()
                  ? `Restricciones: ${state.challenge.constraintsSummary.trim()}`
                  : state.strategicProfile.realConstraints.join('; ') ||
                    'Sin restricciones adicionales declaradas.'}
              </p>
            </div>
          </div>
        </section>

        {/* 02. Hipótesis de Trabajo e Incertidumbres */}
        <section className="relative z-10 print-card p-5 rounded-xl chalamandra-surface space-y-3 text-xs">
          <h2 className="font-display font-semibold text-sm text-[#FFF0BE] print:text-slate-900">
            02. Hipótesis de trabajo e incertidumbres a verificar
          </h2>

          <div className="space-y-2.5">
            <div>
              <span className="font-mono text-[#ECC964] print:text-slate-600 block">
                Hipótesis central (sujeta a evidencia):
              </span>
              <p className="text-[#FAF6ED] print:text-slate-900 font-medium mt-0.5 leading-relaxed">
                {effectiveMap.keyInsight}
              </p>
            </div>

            {archetypeDetails && (
              <div className="pt-1">
                <span className="font-mono text-violet-300 print:text-slate-600 block">
                  Arquetipo Interactive incorporado como hipótesis (no como etiqueta fija):
                </span>
                <p className="text-[#DDD6C7] print:text-slate-800 mt-0.5 leading-relaxed">
                  <strong className="text-[#FAF6ED] print:text-slate-900">{archetypeDetails.name}</strong> —{' '}
                  {state.strategicProfile.archetypeHypothesisNotes?.trim() ||
                    `Vigilar punto ciego operativo: ${archetypeDetails.blindspots[0]}.`}
                </p>
              </div>
            )}

            <div className="pt-1">
              <span className="font-mono text-cyan-300 print:text-slate-600 block mb-1">
                Incertidumbres abiertas:
              </span>
              <ul className="list-disc list-inside text-[#DDD6C7] print:text-slate-800 space-y-1">
                {uncertaintiesList.map((u, idx) => (
                  <li key={idx}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 03. Hack Seleccionado, Plantilla Metodológica y Lente de Poder */}
        <section className="relative z-10 print-card p-5 rounded-xl chalamandra-surface space-y-3.5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="font-display font-semibold text-sm text-[#FFF0BE] print:text-slate-900">
              03. Herramienta Interactive aplicada: {chosenHack.title} ({chosenHack.metodo})
            </h2>
            <span className="font-mono text-[11px] text-[#ECC964] print:text-slate-600">
              {linkedPower
                ? `Poder asociado: ${linkedPower.title}`
                : 'Sin poderDeSherezadeId en catálogo'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plantillaPairs.map((pair, idx) => (
              <div
                key={pair.aspecto}
                className="print-subcard p-3.5 rounded-lg chalamandra-chamber space-y-1"
              >
                <span className="font-semibold text-[#FFF0BE] print:text-slate-900 block tabular-nums">
                  {idx + 1}. {pair.aspecto}
                </span>
                <p className="text-[#DDD6C7] print:text-slate-800 leading-relaxed">
                  {pair.respuesta || 'Pendiente de completar en Fase 03.'}
                </p>
              </div>
            ))}
          </div>

          {state.powerLens?.used && state.powerLens.directive.trim() && (
            <div className="print-subcard p-3.5 rounded-lg chalamandra-surface-violet space-y-1">
              <span className="font-mono font-semibold text-violet-200 print:text-slate-900 block">
                Lente de Poder complementario utilizado ({state.powerLens.poderTitle} ·{' '}
                {state.powerLens.domain}):
              </span>
              <p className="text-[#FAF6ED] print:text-slate-800 leading-relaxed">
                {state.powerLens.directive}
              </p>
            </div>
          )}
        </section>

        {/* 04. Orientación SRAP Aplicada al Caso */}
        <section className="relative z-10 print-card p-5 rounded-xl chalamandra-surface space-y-3.5 text-xs">
          <h2 className="font-display font-semibold text-sm text-[#FFF0BE] print:text-slate-900">
            04. Orientación operativa SRAP
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="print-subcard p-3.5 rounded-lg chalamandra-surface-cyan space-y-1">
              <span className="font-mono font-bold text-cyan-200 print:text-slate-900 block">
                S · Sincronizar
              </span>
              <p className="text-[#FAF6ED] print:text-slate-800 leading-relaxed">
                {effectiveSrap.sincronizar}
              </p>
            </div>

            <div className="print-subcard p-3.5 rounded-lg chalamandra-chamber space-y-1">
              <span className="font-mono font-bold text-[#FFF0BE] print:text-slate-900 block">
                R · Reconocer
              </span>
              <p className="text-[#FAF6ED] print:text-slate-800 leading-relaxed">
                {effectiveSrap.reconocer}
              </p>
            </div>

            <div className="print-subcard p-3.5 rounded-lg chalamandra-surface-emerald space-y-1">
              <span className="font-mono font-bold text-emerald-200 print:text-slate-900 block">
                A · Activar (Acción inmediata)
              </span>
              <p className="text-[#FAF6ED] print:text-slate-800 leading-relaxed">
                {effectiveSrap.activar}
              </p>
            </div>

            <div className="print-subcard p-3.5 rounded-lg chalamandra-surface-rose space-y-1">
              <span className="font-mono font-bold text-rose-200 print:text-slate-900 block">
                P · Criterio explícito de pausa
              </span>
              <p className="text-[#FAF6ED] print:text-slate-800 leading-relaxed">
                {effectiveSrap.pausa}
              </p>
            </div>
          </div>
        </section>

        {/* 05. Ruta Inicial: Acción Inmediata, Criterio de Pausa y Siguiente Paso */}
        <section className="relative z-10 print-card p-5 rounded-xl chalamandra-surface-elevated space-y-3.5 text-xs">
          <h2 className="font-display font-semibold text-sm text-[#FFF0BE] print:text-slate-900">
            05. Ruta inicial de salida y preparación para sesión en vivo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="font-mono font-semibold text-[#ECC964] print:text-slate-700 block">
                1. Acción inmediata (24–72 h)
              </span>
              <p className="text-[#FAF6ED] print:text-slate-900 font-medium leading-relaxed">
                {effectiveSrap.immediateStep24h}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono font-semibold text-rose-300 print:text-slate-700 block">
                2. Criterio de pausa y revisión
              </span>
              <p className="text-[#DDD6C7] print:text-slate-800 leading-relaxed">
                {effectiveSrap.pausa}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono font-semibold text-emerald-300 print:text-slate-700 block">
                3. Siguiente paso
              </span>
              <p className="text-[#DDD6C7] print:text-slate-800 leading-relaxed">
                {effectiveSrap.nextStepAfterPause}
              </p>
            </div>
          </div>

          {effectiveActionPlan.some((w) => w.tasks.length > 0) && (
            <div className="pt-3 border-t border-[#D4AF37]/30 print:border-slate-300 space-y-2.5">
              <span className="font-mono font-semibold text-[#FFF0BE] print:text-slate-800 block">
                Secuencia de compromisos y tareas registradas:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {effectiveActionPlan.map((w) => (
                  <div key={w.weekNumber} className="space-y-1">
                    <span className="font-display font-semibold text-[#ECC964] print:text-slate-900 block">
                      {w.title}
                    </span>
                    <ul className="space-y-1 text-[11px] text-[#DDD6C7] print:text-slate-800">
                      {w.tasks.map((t) => (
                        <li key={t.id}>
                          • {t.label}{' '}
                          <span className="text-[#B8B0A0] print:text-slate-600 font-mono">
                            ({t.kpi}
                            {t.isCustom ? ' · Propia' : ''})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Pie del documento */}
        <footer className="relative z-10 border-t border-[#D4AF37]/30 print:border-slate-300 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#C4BCAD] print:text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ECC964] print:text-slate-700 shrink-0" />
            <span>
              Chalamandra Magistral · Interactive DecoX — Hipótesis y ruta inicial derivadas de las respuestas del participante.
            </span>
          </div>
          <span className="font-mono text-[#FFF0BE] print:text-slate-800">
            {state.sessionCompleted ? 'Estado: Sesión sellada' : 'Estado: Borrador activo'}
          </span>
        </footer>
      </article>

      {/* Navegación inferior (Oculta en impresión) */}
      <div className="no-print flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-3 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Volver a Fase 04 · Orientar con SRAP</span>
        </button>

        <button
          type="button"
          onClick={() => onJumpToModule(3)}
          className="px-4 py-2.5 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
        >
          Revisar Hack y Plantilla (Fase 03)
        </button>
      </div>
    </div>
  );
}
