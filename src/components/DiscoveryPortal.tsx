import React, { useState, useEffect } from 'react';
import {
  Target,
  Compass,
  FlaskConical,
  Crown,
  Calendar,
  FileText,
  Cloud,
  Bot,
  Zap,
  ArrowRight,
  RotateCcw,
  Box,
  Sparkles,
  Play,
  Layers,
  User,
  Building2,
  PenTool,
  Cpu,
  Flame,
  BarChart3,
  Check
} from 'lucide-react';
import {
  DiscoveryDeliverableState,
  ActiveView,
  StrategicMapData,
  ActionPlanWeek,
  DiscoveryTrackType
} from '../types';
import {
  createBlankDiscoveryState,
  createDemoDiscoveryState,
  generateDiscoverySessionId
} from '../utils/constants';
import {
  calculateDiscoveryCompletion,
  DISCOVERY_TRACK_OPTIONS,
  MUNDO_PHASES_OVERVIEW,
  DISCOVERY_FLOW_STEPS,
  DISCOVERY_PHASE_GROUPS,
  STEP_NUM_BY_HACK_ID,
  DISCOVERY_EXPERIMENTS_STEP,
  DISCOVERY_SYNTHESIS_STEP,
  DISCOVERY_PLAN_STEP,
  DISCOVERY_REPORT_STEP,
  TOTAL_DISCOVERY_STEPS,
  DiscoveryFlowPhaseGroup
} from '../data/discoveryFlowConfig';
import Module01Challenge from './discovery/Module01Challenge';
import Module02StrategicProfile from './discovery/Module02StrategicProfile';
import Module03SevenHacks from './discovery/Module03SevenHacks';
import Module04LabExperiments from './discovery/Module04LabExperiments';
import Module05StrategicMap from './discovery/Module05StrategicMap';
import Module06ActionPlan from './discovery/Module06ActionPlan';
import Module07ExecutiveReport from './discovery/Module07ExecutiveReport';

const STORAGE_KEY = 'decox_discovery_deliverable_v2';
const DEFAULT_HERO_VISUAL = '/images/sesion-descubrimiento-hero.jpg';

interface DiscoveryPortalProps {
  setActiveView: (view: ActiveView) => void;
  initialModule?: number | null;
  onConsumeInitialModule?: () => void;
  onSessionMetaChange?: (meta: {
    activeModule: number;
    viewingStartScreen: boolean;
    hasSavedProgress: boolean;
    completionPct: number;
  }) => void;
}

const VALID_CLIENT_SESSION_REGEX = /^(DX|DEMO)-[A-Z0-9]{4,20}-[A-Z0-9]{4,20}$/;

function ensureValidSessionId(candidate?: string, isDemo?: boolean): string {
  if (candidate && VALID_CLIENT_SESSION_REGEX.test(candidate.trim())) {
    return candidate.trim();
  }
  return generateDiscoverySessionId(isDemo ? 'DEMO' : 'DX');
}

function clampModuleStep(step?: number | null): number {
  if (!step || Number.isNaN(step)) return 1;
  return Math.min(Math.max(1, Math.round(step)), TOTAL_DISCOVERY_STEPS);
}

function getStepIconComponent(stepId: string) {
  switch (stepId) {
    case 'contexto':
      return Target;
    case 'epistemologia':
      return Compass;
    case 'scheherazade':
      return PenTool;
    case 'hermes':
      return Layers;
    case 'carroll':
      return Compass;
    case 'nino-8-anos':
      return Sparkles;
    case 'hacker':
      return Cpu;
    case 'trickster':
      return Flame;
    case 'data':
      return BarChart3;
    case 'experimentos':
      return FlaskConical;
    case 'mundo-real':
      return Crown;
    case 'ruta-30d':
      return Calendar;
    case 'informe-pdf':
      return FileText;
    default:
      return Sparkles;
  }
}

export default function DiscoveryPortal({
  setActiveView,
  initialModule,
  onConsumeInitialModule,
  onSessionMetaChange
}: DiscoveryPortalProps) {
  const [deliverableState, setDeliverableState] = useState<DiscoveryDeliverableState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DiscoveryDeliverableState>;
        if (parsed && parsed.challenge && parsed.strategicProfile) {
          const validSid = ensureValidSessionId(parsed.sessionId, parsed.isDemoCase);
          const savedTrack = parsed.challenge.track || 'persona';
          const base = createBlankDiscoveryState(validSid, savedTrack);
          return {
            ...base,
            ...parsed,
            currentModule: clampModuleStep(parsed.currentModule),
            challenge: {
              ...base.challenge,
              ...parsed.challenge,
              track: savedTrack
            },
            sessionId: validSid
          };
        }
      }
    } catch {}
    return createBlankDiscoveryState(generateDiscoverySessionId('DX'), 'persona');
  });

  const [selectedStartTrack, setSelectedStartTrack] = useState<DiscoveryTrackType>(
    () => deliverableState.challenge.track || 'persona'
  );
  const [viewingStartScreen, setViewingStartScreen] = useState<boolean>(
    () => !deliverableState.sessionStarted && !initialModule
  );
  const [activeModule, setActiveModule] = useState<number>(
    clampModuleStep(initialModule || deliverableState.currentModule || 1)
  );
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [sessionVisual, setSessionVisual] = useState<string>(DEFAULT_HERO_VISUAL);

  useEffect(() => {
    try {
      const savedVisual = localStorage.getItem('decox_deliverable_custom_visual');
      if (savedVisual) setSessionVisual(savedVisual);
    } catch {}
  }, [activeModule]);

  useEffect(() => {
    if (initialModule !== undefined && initialModule !== null) {
      if (initialModule === 0) {
        setViewingStartScreen(true);
      } else if (initialModule >= 1 && initialModule <= TOTAL_DISCOVERY_STEPS) {
        setViewingStartScreen(false);
        setActiveModule(initialModule);
        setDeliverableState((prev) => ({ ...prev, sessionStarted: true }));
      }
      if (onConsumeInitialModule) {
        onConsumeInitialModule();
      }
    }
  }, [initialModule, onConsumeInitialModule]);

  // Persist locally on every edit under isolated session envelope
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...deliverableState, currentModule: activeModule })
      );
    } catch {}
  }, [deliverableState, activeModule]);

  // Hydrate from server ONLY for this exact validated sessionId (never cross-session)
  useEffect(() => {
    const sid = ensureValidSessionId(deliverableState.sessionId, deliverableState.isDemoCase);
    if (deliverableState.isDemoCase) return;

    async function loadServerState() {
      try {
        const res = await fetch(`/api/discovery/load?clientId=${encodeURIComponent(sid)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && json.state && json.state.sessionId === sid && json.state.sessionStarted) {
          setDeliverableState((prev) =>
            prev.sessionStarted ? prev : { ...prev, ...json.state, sessionId: sid }
          );
        }
      } catch {
        // Local storage remains authoritative
      }
    }
    loadServerState();
  }, [deliverableState.sessionId, deliverableState.isDemoCase]);

  const saveToServer = async (): Promise<boolean> => {
    setSyncStatus('saving');
    try {
      const sid = ensureValidSessionId(deliverableState.sessionId, deliverableState.isDemoCase);
      const updatedState: DiscoveryDeliverableState = {
        ...deliverableState,
        sessionId: sid,
        currentModule: activeModule,
        lastSavedTimestamp: new Date().toISOString()
      };
      if (sid !== deliverableState.sessionId) {
        setDeliverableState(updatedState);
      }
      const res = await fetch('/api/discovery/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: sid,
          deliverableState: updatedState
        })
      });
      const json = await res.json();
      if (res.ok && json.success && json.sessionId === sid) {
        setSyncStatus('synced');
        return true;
      }
      setSyncStatus('error');
      return false;
    } catch {
      setSyncStatus('error');
      return false;
    }
  };

  // Mark map synthesis AND derived 30-day plan stale whenever upstream inputs change
  const updateUpstreamState = (patch: Partial<DiscoveryDeliverableState>) => {
    setDeliverableState((prev) => ({
      ...prev,
      ...patch,
      sessionStarted: true,
      sessionCompleted: false,
      planNeedsSync: true,
      strategicMap: {
        ...prev.strategicMap,
        ...(patch.strategicMap || {}),
        isSynthesized: patch.strategicMap ? patch.strategicMap.isSynthesized : false
      }
    }));
  };

  const handleStartFreshSession = (trackOverride?: DiscoveryTrackType) => {
    const chosenTrack = trackOverride || selectedStartTrack || deliverableState.challenge.track || 'persona';
    const fresh = createBlankDiscoveryState(generateDiscoverySessionId('DX'), chosenTrack);
    fresh.sessionStarted = true;
    setDeliverableState(fresh);
    setSelectedStartTrack(chosenTrack);
    setActiveModule(1);
    setViewingStartScreen(false);
    setConfirmReset(false);
    setSyncStatus('synced');
  };

  const handleContinueSession = () => {
    setDeliverableState((prev) => ({ ...prev, sessionStarted: true }));
    setViewingStartScreen(false);
  };

  const handleLoadReferenceCase = (trackOverride?: DiscoveryTrackType) => {
    const chosenTrack = trackOverride || selectedStartTrack || 'organizacion';
    const demo = createDemoDiscoveryState(chosenTrack);
    setDeliverableState(demo);
    setSelectedStartTrack(chosenTrack);
    setActiveModule(1);
    setViewingStartScreen(false);
    setConfirmReset(false);
  };

  const currentStepDef =
    DISCOVERY_FLOW_STEPS.find((s) => s.num === activeModule) || DISCOVERY_FLOW_STEPS[0];
  const prevStepDef = DISCOVERY_FLOW_STEPS.find((s) => s.num === activeModule - 1);
  const nextStepDef = DISCOVERY_FLOW_STEPS.find((s) => s.num === activeModule + 1);

  const isStepPopulated = (stepNum: number): boolean => {
    const step = DISCOVERY_FLOW_STEPS.find((s) => s.num === stepNum);
    if (!step) return false;
    if (step.num === 1) {
      return Boolean(
        deliverableState.challenge.title.trim() ||
          deliverableState.challenge.currentSituation.trim()
      );
    }
    if (step.num === 2) {
      return Boolean(
        deliverableState.strategicProfile.dominantThoughtPattern.trim() ||
          deliverableState.strategicProfile.underlyingAssumptions.length > 0 ||
          deliverableState.strategicProfile.realConstraints.length > 0
      );
    }
    if (step.hackId) {
      return Boolean(
        deliverableState.selectedHackIds.includes(step.hackId) ||
          deliverableState.hackNotes[step.hackId]?.trim()
      );
    }
    if (step.num === DISCOVERY_EXPERIMENTS_STEP) {
      return deliverableState.experiments.length > 0;
    }
    if (step.num === DISCOVERY_SYNTHESIS_STEP) {
      return Boolean(deliverableState.strategicMap.isSynthesized);
    }
    if (step.num === DISCOVERY_PLAN_STEP) {
      return deliverableState.actionPlan.some((w) => w.tasks.length > 0);
    }
    if (step.num === DISCOVERY_REPORT_STEP) {
      return Boolean(deliverableState.sessionCompleted);
    }
    return false;
  };

  const getPhaseBadgeClasses = (phase: DiscoveryFlowPhaseGroup, isActive: boolean) => {
    if (!isActive) {
      return 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200';
    }
    switch (phase) {
      case 'mundo_simulado':
        return 'bg-purple-500/15 text-purple-200 border-purple-500/50 ring-1 ring-purple-500/30';
      case 'decodificacion':
        return 'bg-cyan-500/15 text-cyan-200 border-cyan-500/50 ring-1 ring-cyan-500/30';
      case 'mundo_real':
        return 'bg-amber-500/15 text-amber-200 border-amber-500/50 ring-1 ring-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-100 border-slate-600 ring-1 ring-slate-500/30';
    }
  };

  const getStepButtonClasses = (
    phase: DiscoveryFlowPhaseGroup,
    isCurrent: boolean,
    populated: boolean
  ) => {
    if (isCurrent) {
      if (phase === 'mundo_simulado') {
        return 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-950/40';
      }
      if (phase === 'decodificacion') {
        return 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40';
      }
      return 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/40';
    }
    if (populated) {
      return 'bg-slate-900 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50';
    }
    return 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700';
  };

  const completion = calculateDiscoveryCompletion(deliverableState);
  const hasSavedProgress =
    Boolean(deliverableState.sessionStarted) &&
    (Boolean(deliverableState.challenge.currentSituation.trim()) ||
      Boolean(deliverableState.challenge.criticalFriction.trim()) ||
      Boolean(deliverableState.challenge.title.trim()));

  const activeTrack: DiscoveryTrackType = deliverableState.challenge.track || 'persona';

  useEffect(() => {
    if (onSessionMetaChange) {
      onSessionMetaChange({
        activeModule,
        viewingStartScreen,
        hasSavedProgress,
        completionPct: completion.percentage
      });
    }
  }, [activeModule, viewingStartScreen, hasSavedProgress, completion.percentage, onSessionMetaChange]);

  // ==============================================================
  // PANTALLA INICIAL COHERENTE CON INTERACTIVE DECOX
  // ==============================================================
  if (viewingStartScreen) {
    return (
      <div className="max-w-6xl mx-auto py-4 space-y-10 animate-fadeIn">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-amber-500/30 p-7 sm:p-12 shadow-2xl">
          <div className="absolute -top-24 right-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 text-xs font-mono text-amber-400">
                <img
                  src="/images/chalamandra-emblem.jpg"
                  alt="Emblema Salamandra Chalamandra Magistral"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-amber-400/50"
                />
                <span>CHALAMANDRA MAGISTRAL · INTERACTIVE DECOX · SESIÓN DE DESCUBRIMIENTO</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-[1.12]">
                Del Mundo Simulado al{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
                  Mundo Real
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Recorre paso a paso los <strong className="text-slate-100">7 módulos de razonamiento de Chalamandra</strong> (Scheherazade, Hermes, Carroll, Niño de 8 años, Hacker, Trickster y Data) estructurados entre{' '}
                <strong className="text-slate-100">Mundo Simulado, Decodificación y Mundo Real</strong> para preparar tu síntesis de caso y el siguiente paso hacia la sesión en vivo.
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-slate-400">
                <span className="text-slate-200">Encuadre</span>
                <span aria-hidden="true">→</span>
                <span className="text-purple-300">Mundo Simulado (4 módulos)</span>
                <span aria-hidden="true">→</span>
                <span className="text-cyan-300">Decodificación (3 módulos + lab)</span>
                <span aria-hidden="true">→</span>
                <span className="text-amber-300">Mundo Real y Sesión en Vivo</span>
              </div>

              {/* Dual Track Selector (Personas vs Organizaciones) */}
              <div className="pt-1 space-y-2.5">
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider block font-semibold">
                  Selecciona tu recorrido metodológico:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DISCOVERY_TRACK_OPTIONS.map((tOpt) => {
                    const isSelected = selectedStartTrack === tOpt.value;
                    const TrackIcon = tOpt.value === 'organizacion' ? Building2 : User;
                    return (
                      <button
                        key={tOpt.value}
                        type="button"
                        onClick={() => setSelectedStartTrack(tOpt.value)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/30'
                            : 'bg-slate-950/75 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-100">
                            <TrackIcon
                              className={`w-4 h-4 ${
                                isSelected ? 'text-amber-400' : 'text-slate-400'
                              }`}
                            />
                            {tOpt.title}
                          </span>
                          <span className="text-[11px] font-mono text-amber-400">
                            {isSelected ? 'Activo' : 'Elegir'}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-300">{tOpt.subtitle}</p>
                        <p className="text-[11px] text-slate-400 leading-snug">{tOpt.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Start Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                {hasSavedProgress ? (
                  <>
                    <button
                      id="start-continue-session-btn"
                      type="button"
                      onClick={handleContinueSession}
                      className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-950/50 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span className="tabular-nums">
                        Continuar Mi Sesión ({completion.percentage}% ·{' '}
                        {activeTrack === 'organizacion' ? 'Organizaciones' : 'Personas'})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartFreshSession(selectedStartTrack)}
                      className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        Nueva Sesión en Blanco (
                        {selectedStartTrack === 'organizacion' ? 'Organizaciones' : 'Personas'})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoadReferenceCase(selectedStartTrack)}
                      className="flex items-center gap-2 px-4 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        Ver Caso Demo (
                        {selectedStartTrack === 'organizacion' ? 'Organizaciones' : 'Personas'})
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="start-new-session-btn"
                      type="button"
                      onClick={() => handleStartFreshSession(selectedStartTrack)}
                      className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-950/50 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>
                        Iniciar Recorrido{' '}
                        {selectedStartTrack === 'organizacion' ? 'Organizaciones' : 'Personas'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      id="load-demo-case-btn"
                      type="button"
                      onClick={() => handleLoadReferenceCase(selectedStartTrack)}
                      className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-slate-200 hover:text-amber-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>
                        Explorar Caso Demo (
                        {selectedStartTrack === 'organizacion' ? 'Organizaciones' : 'Personas'})
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
                <img
                  src={sessionVisual}
                  alt="Escena de Sesión de Descubrimiento Chalamandra Magistral DecoX"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-72 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-amber-300">
                  <span>Mesa Metodológica DecoX</span>
                  <span className="text-slate-300">7 Módulos · 3 Mundos</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/85 border border-slate-800 space-y-1.5 text-xs">
                <span className="font-mono text-amber-400 font-semibold block">
                  Regla Epistémica y Ética Chalamandra
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Hackear un sistema significa encontrar ventajas legítimas dentro de las reglas; nunca engañar personas ni presentar correlaciones como causalidad demostrada. Esta herramienta prepara el diagnóstico previo a la sesión en vivo (valor de referencia del ecosistema: USD 27; sin cobro configurado en esta aplicación).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Preview Strip — Fase A (Mundo Simulado) -> Fase B (Decodificación) -> Fase C (Mundo Real) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MUNDO_PHASES_OVERVIEW.map((phase, index) => {
            const accentColor =
              index === 0
                ? 'text-purple-300'
                : index === 1
                ? 'text-cyan-300'
                : 'text-amber-400';
            return (
              <div
                key={phase.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5"
              >
                <span className={`text-xs font-mono ${accentColor} font-bold block`}>
                  {phase.title}
                </span>
                <h3 className="text-sm font-bold text-slate-100">{phase.subtitle}</h3>
                <p className="text-[11px] font-mono text-slate-300">{phase.hacksSummary}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{phase.description}</p>
              </div>
            );
          })}
        </section>
      </div>
    );
  }

  // ==============================================================
  // ENTORNO ACTIVO DE LA SESIÓN DE DESCUBRIMIENTO (FLUJO ESTRUCTURADO)
  // ==============================================================
  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2">
      {deliverableState.isDemoCase && (
        <div
          role="status"
          className="no-print px-5 py-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5 text-amber-200">
            <Layers className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="font-mono text-amber-300">CASO DE REFERENCIA DEMOSTRATIVO:</strong>{' '}
              Explorando recorrido{' '}
              <strong>{activeTrack === 'organizacion' ? 'Organizaciones' : 'Personas'}</strong> (
              {deliverableState.sessionId}). Esta demostración está aislada de tus sesiones reales.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() =>
                handleLoadReferenceCase(
                  activeTrack === 'organizacion' ? 'persona' : 'organizacion'
                )
              }
              className="px-3 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-amber-500/35 text-amber-200 font-semibold whitespace-nowrap cursor-pointer transition-colors"
            >
              Cambiar a Demo {activeTrack === 'organizacion' ? 'Personas' : 'Organizaciones'}
            </button>
            <button
              type="button"
              onClick={() => handleStartFreshSession(activeTrack)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold whitespace-nowrap cursor-pointer transition-colors"
            >
              Iniciar Mi Sesión Real en Blanco
            </button>
          </div>
        </div>
      )}

      <section className="no-print rounded-3xl bg-slate-900/95 border border-amber-500/25 shadow-xl overflow-hidden">
        {/* Top Session Status & Controls */}
        <div className="px-5 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <img
              src="/images/chalamandra-emblem.jpg"
              alt="Logo Salamandra Chalamandra Magistral"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400/50 shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono text-amber-400">
                <span>
                  {activeTrack === 'organizacion'
                    ? 'RECORRIDO ORGANIZACIONES'
                    : 'RECORRIDO PERSONAS'}
                </span>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    currentStepDef.phase === 'mundo_simulado'
                      ? 'text-purple-300'
                      : currentStepDef.phase === 'decodificacion'
                      ? 'text-cyan-300'
                      : 'text-amber-300'
                  }
                >
                  {currentStepDef.phaseTitle}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">
                  {deliverableState.challenge.explorationFocus || 'Exploración'}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight">
                {deliverableState.challenge.title.trim() ||
                  'Mesa Interactiva Chalamandra Magistral · DecoX'}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Real Completion Progress */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono tabular-nums">
              <span className="text-slate-400">
                Paso {String(activeModule).padStart(2, '0')}/{TOTAL_DISCOVERY_STEPS} · Avance{' '}
                {completion.percentage}%
              </span>
              <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => saveToServer()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:border-amber-500/40 cursor-pointer transition-colors"
              title="Tu avance se guarda automáticamente en este navegador (sin sincronización automática entre dispositivos). Pulsa para respaldar también en la memoria temporal del servidor durante la ejecución actual."
            >
              <Cloud
                className={`w-3.5 h-3.5 ${
                  syncStatus === 'synced'
                    ? 'text-emerald-400'
                    : syncStatus === 'saving'
                    ? 'text-cyan-400'
                    : 'text-amber-400'
                }`}
              />
              <span>
                {syncStatus === 'saving'
                  ? 'Sincronizando...'
                  : syncStatus === 'error'
                  ? 'Guardado local (este navegador)'
                  : 'Guardado en navegador'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewingStartScreen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 cursor-pointer transition-colors"
            >
              Pantalla Inicial
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer transition-colors"
                title="Reiniciar sesión en blanco"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-500/40 px-2.5 py-1 rounded-xl text-xs">
                <span className="text-rose-200 font-mono">¿Limpiar todo?</span>
                <button
                  type="button"
                  onClick={() => handleStartFreshSession(activeTrack)}
                  className="px-2 py-0.5 rounded bg-rose-500 text-slate-950 font-bold cursor-pointer"
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 cursor-pointer"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tier 1: Methodological Phase Selector (Encuadre | Mundo Simulado | Decodificación | Mundo Real) + SRAP Tools */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Fases metodológicas de la Sesión de Descubrimiento"
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5"
          >
            {DISCOVERY_PHASE_GROUPS.map((group) => {
              const isActivePhase = currentStepDef.phase === group.id;
              const groupSteps = DISCOVERY_FLOW_STEPS.filter((s) => s.phase === group.id);
              const populatedCount = groupSteps.filter((s) => isStepPopulated(s.num)).length;

              return (
                <button
                  key={group.id}
                  type="button"
                  role="tab"
                  aria-selected={isActivePhase}
                  onClick={() => setActiveModule(group.startStep)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer tabular-nums ${getPhaseBadgeClasses(
                    group.id,
                    isActivePhase
                  )}`}
                >
                  <span className="font-mono text-[10px] opacity-80">{group.code}</span>
                  <span className="font-semibold">{group.shortTitle}</span>
                  <span className="font-mono text-[10px] opacity-75">
                    ({populatedCount}/{groupSteps.length})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
            <span>Apoyo SRAP:</span>
            <button
              type="button"
              onClick={() => setActiveView('oraculo')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Bot className="w-3 h-3 text-purple-400" />
              <span>Oráculo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('metronome')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Metrónomo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('matrix-3d')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Box className="w-3 h-3 text-cyan-400" />
              <span>3D</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('image-studio')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Visual</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Structured Flow Steps (including all 7 reasoning modules grouped by Mundo Simulado, Decodificación & Mundo Real) */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/90 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {DISCOVERY_FLOW_STEPS.map((step, idx) => {
              const Icon = getStepIconComponent(step.id);
              const isCurrent = activeModule === step.num;
              const populated = isStepPopulated(step.num);
              const prevPhase = idx > 0 ? DISCOVERY_FLOW_STEPS[idx - 1].phase : step.phase;
              const showPhaseSeparator = idx > 0 && prevPhase !== step.phase;

              return (
                <React.Fragment key={step.id}>
                  {showPhaseSeparator && (
                    <span
                      aria-hidden="true"
                      className="mx-1 h-5 w-px bg-slate-800 shrink-0"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveModule(step.num)}
                    aria-current={isCurrent ? 'step' : undefined}
                    title={`${step.phaseTitle} — ${step.shortLabel}`}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer tabular-nums ${getStepButtonClasses(
                      step.phase,
                      isCurrent,
                      populated
                    )}`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isCurrent
                          ? 'text-slate-950'
                          : populated
                          ? 'text-emerald-400'
                          : step.phase === 'mundo_simulado'
                          ? 'text-purple-400'
                          : step.phase === 'decodificacion'
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }`}
                    />
                    <span className="font-mono text-[10px] opacity-80">
                      {String(step.num).padStart(2, '0')}.
                    </span>
                    <span>{step.shortLabel}</span>
                    {!isCurrent && populated && (
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Interactive Step */}
      <div className="min-h-[520px]">
        {activeModule === 1 && (
          <Module01Challenge
            challenge={deliverableState.challenge}
            onChange={(updated) => updateUpstreamState({ challenge: updated })}
            onNext={() => setActiveModule(2)}
          />
        )}

        {activeModule === 2 && (
          <Module02StrategicProfile
            profile={deliverableState.strategicProfile}
            challenge={deliverableState.challenge}
            onChange={(updated) => updateUpstreamState({ strategicProfile: updated })}
            onPrev={() => setActiveModule(1)}
            onNext={() => setActiveModule(3)}
          />
        )}

        {currentStepDef.hackId !== undefined && (
          <Module03SevenHacks
            challenge={deliverableState.challenge}
            profile={deliverableState.strategicProfile}
            selectedHackIds={deliverableState.selectedHackIds}
            hackNotes={deliverableState.hackNotes}
            focusedHackId={currentStepDef.hackId}
            stepNumber={activeModule}
            totalSteps={TOTAL_DISCOVERY_STEPS}
            prevStepLabel={
              prevStepDef
                ? `Volver a ${prevStepDef.shortLabel}`
                : 'Volver al paso anterior'
            }
            nextStepLabel={
              nextStepDef
                ? nextStepDef.phase !== currentStepDef.phase
                  ? `Pasar a ${
                      nextStepDef.phase === 'decodificacion'
                        ? 'Decodificación'
                        : 'Mundo Real'
                    }: ${nextStepDef.shortLabel}`
                  : `Continuar a ${nextStepDef.shortLabel}`
                : 'Continuar'
            }
            onSelectHackStep={(hackId) => {
              const targetStep = STEP_NUM_BY_HACK_ID[hackId];
              if (targetStep) setActiveModule(targetStep);
            }}
            onToggleHack={(id) => {
              const current = deliverableState.selectedHackIds;
              const next = current.includes(id)
                ? current.filter((x) => x !== id)
                : [...current, id];
              updateUpstreamState({ selectedHackIds: next });
            }}
            onApplyRecommended={(ids) => updateUpstreamState({ selectedHackIds: ids })}
            onUpdateNote={(id, note) => {
              updateUpstreamState({
                hackNotes: { ...deliverableState.hackNotes, [id]: note }
              });
            }}
            onPrev={() => setActiveModule(Math.max(1, activeModule - 1))}
            onNext={() => setActiveModule(Math.min(TOTAL_DISCOVERY_STEPS, activeModule + 1))}
          />
        )}

        {activeModule === DISCOVERY_EXPERIMENTS_STEP && (
          <Module04LabExperiments
            fullState={deliverableState}
            experiments={deliverableState.experiments}
            selectedHackIds={deliverableState.selectedHackIds}
            onChange={(updated) => updateUpstreamState({ experiments: updated })}
            onPrev={() => setActiveModule(DISCOVERY_EXPERIMENTS_STEP - 1)}
            onNext={() => setActiveModule(DISCOVERY_SYNTHESIS_STEP)}
          />
        )}

        {activeModule === DISCOVERY_SYNTHESIS_STEP && (
          <Module05StrategicMap
            fullState={deliverableState}
            visualUrl={sessionVisual}
            onOpenVisualStudio={() => setActiveView('image-studio')}
            onApplySynthesis={(updatedMap: StrategicMapData, recommendedPlan?: ActionPlanWeek[]) => {
              setDeliverableState((prev) => ({
                ...prev,
                sessionStarted: true,
                planNeedsSync: recommendedPlan ? false : prev.planNeedsSync,
                strategicMap: updatedMap,
                actionPlan: recommendedPlan || prev.actionPlan
              }));
            }}
            onChangeMap={(updatedMap) =>
              setDeliverableState((prev) => ({ ...prev, strategicMap: updatedMap }))
            }
            onJumpToModule={(num) => setActiveModule(clampModuleStep(num))}
            onPrev={() => setActiveModule(DISCOVERY_EXPERIMENTS_STEP)}
            onNext={() => setActiveModule(DISCOVERY_PLAN_STEP)}
            onOpenReport={() => setActiveModule(DISCOVERY_REPORT_STEP)}
          />
        )}

        {activeModule === DISCOVERY_PLAN_STEP && (
          <Module06ActionPlan
            fullState={deliverableState}
            actionPlan={deliverableState.actionPlan}
            onChange={(updated, clearSyncFlag) =>
              setDeliverableState((prev) => ({
                ...prev,
                actionPlan: updated,
                planNeedsSync: clearSyncFlag ? false : prev.planNeedsSync
              }))
            }
            onPrev={() => setActiveModule(DISCOVERY_SYNTHESIS_STEP)}
            onNext={() => setActiveModule(DISCOVERY_REPORT_STEP)}
          />
        )}

        {activeModule === DISCOVERY_REPORT_STEP && (
          <Module07ExecutiveReport
            state={deliverableState}
            onSaveServer={saveToServer}
            onMarkCompleted={() =>
              setDeliverableState((prev) => ({ ...prev, sessionCompleted: true }))
            }
            onPrev={() => setActiveModule(DISCOVERY_PLAN_STEP)}
            onJumpToModule={(num) => setActiveModule(clampModuleStep(num))}
          />
        )}
      </div>
    </div>
  );
}

