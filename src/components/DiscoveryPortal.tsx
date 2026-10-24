import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  Compass,
  BookOpen,
  Zap,
  FileText,
  Cloud,
  ArrowRight,
  RotateCcw,
  Play,
  Layers,
  User,
  Building2,
  Check,
  Home
} from 'lucide-react';
import {
  DiscoveryDeliverableState,
  ActiveView,
  ActionPlanWeek,
  DiscoveryTrackType,
  PowerLensApplicationState,
  SrapOrientationState
} from '../types';
import {
  createBlankDiscoveryState,
  createDemoDiscoveryState,
  generateDiscoverySessionId
} from '../utils/constants';
import { HACKS_DATA } from '../data/interactiveCatalog';
import {
  calculateDiscoveryCompletion,
  DISCOVERY_TRACK_OPTIONS,
  DISCOVERY_FIVE_PHASES,
  TOTAL_DISCOVERY_STEPS
} from '../data/discoveryFlowConfig';
import {
  ChalamandraMedallion,
  AlchemicalGeometryBackdrop,
  AlchemicalHairline
} from './ChalamandraSeal';
import Module01Challenge from './discovery/Module01Challenge';
import Module02StrategicProfile from './discovery/Module02StrategicProfile';
import Module03SevenHacks from './discovery/Module03SevenHacks';
import Module04SrapOrientation from './discovery/Module04SrapOrientation';
import Module07ExecutiveReport from './discovery/Module07ExecutiveReport';

const STORAGE_KEY = 'decox_discovery_deliverable_v2';
const DEMO_STORAGE_KEY = 'decox_discovery_demo_deliverable_v2';
const ACTIVE_STORAGE_KEY = 'decox_discovery_active_storage_v1';
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

function clampPhaseStep(step?: number | null): number {
  if (!step || Number.isNaN(step)) return 1;
  return Math.min(Math.max(1, Math.round(step)), TOTAL_DISCOVERY_STEPS);
}

function getPhaseIconComponent(phaseId: string) {
  switch (phaseId) {
    case 'explorar':
      return Target;
    case 'decodificar':
      return Compass;
    case 'aplicar-hack':
      return BookOpen;
    case 'orientar-srap':
      return Zap;
    case 'ruta-inicial':
    default:
      return FileText;
  }
}

function getPhaseAccentClasses(phaseId: string): {
  badge: string;
  icon: string;
  kicker: string;
} {
  switch (phaseId) {
    case 'explorar':
      return {
        badge: 'bg-[#1D1710] border-[#ECC964]/70 text-[#FFF0BE]',
        icon: 'text-[#ECC964]',
        kicker: 'Hechos y foco'
      };
    case 'decodificar':
      return {
        badge: 'bg-[#171327] border-violet-400/65 text-violet-200',
        icon: 'text-violet-300',
        kicker: 'Hipótesis y evidencia'
      };
    case 'aplicar-hack':
      return {
        badge: 'bg-[#1F170E] border-amber-400/70 text-amber-200',
        icon: 'text-amber-300',
        kicker: '1 Hack oficial'
      };
    case 'orientar-srap':
      return {
        badge: 'bg-[#0F1E22] border-cyan-400/65 text-cyan-200',
        icon: 'text-cyan-300',
        kicker: 'Acción y pausa'
      };
    case 'ruta-inicial':
    default:
      return {
        badge: 'bg-[#101F1A] border-emerald-400/65 text-emerald-200',
        icon: 'text-emerald-300',
        kicker: 'Dossier PDF / JSON'
      };
  }
}

function isDiscoveryPhasePopulated(state: DiscoveryDeliverableState, phaseNum: number): boolean {
  if (phaseNum === 1) {
    return Boolean(
      state.challenge.expectedOutcome.trim() &&
        (state.challenge.currentSituation.trim() || state.challenge.criticalFriction.trim())
    );
  }
  if (phaseNum === 2) {
    return Boolean(
      state.strategicProfile.dominantThoughtPattern.trim() ||
        state.strategicProfile.strategicHypothesis.trim() ||
        state.strategicProfile.realConstraints.length > 0
    );
  }
  if (phaseNum === 3) {
    const hackId = state.selectedHackId;
    if (!hackId) return false;
    const answers = state.hackPlantillaResponses[hackId] || [];
    return answers.some((answer) => Boolean(answer?.trim()));
  }
  if (phaseNum === 4) {
    return Boolean(state.srapOrientation.activar.trim() && state.srapOrientation.pausa.trim());
  }
  if (phaseNum === 5) return Boolean(state.sessionCompleted);
  return false;
}

function firstMissingPrerequisite(
  state: DiscoveryDeliverableState,
  targetPhaseNum: number
) {
  return DISCOVERY_FIVE_PHASES.find(
    (phase) => phase.num < targetPhaseNum && !isDiscoveryPhasePopulated(state, phase.num)
  ) || null;
}

function hasMeaningfulSavedData(state: DiscoveryDeliverableState): boolean {
  if (state.isDemoCase) return false;
  const hasPlantilla = Object.values(state.hackPlantillaResponses || {}).some(
    (arr) => Array.isArray(arr) && arr.some((v) => typeof v === 'string' && v.trim().length > 0)
  );
  return Boolean(
    state.challenge.title.trim() ||
      state.challenge.currentSituation.trim() ||
      state.challenge.criticalFriction.trim() ||
      state.challenge.expectedOutcome.trim() ||
      state.challenge.previousAttempts?.trim() ||
      state.challenge.constraintsSummary?.trim() ||
      state.challenge.clientName.trim() ||
      state.strategicProfile.dominantThoughtPattern.trim() ||
      state.strategicProfile.strategicHypothesis.trim() ||
      state.strategicProfile.archetypeHypothesis ||
      state.strategicProfile.realConstraints.length > 0 ||
      state.strategicProfile.underlyingAssumptions.length > 0 ||
      hasPlantilla ||
      state.powerLens?.used ||
      state.srapOrientation?.isCustomized
  );
}

function hydrateDiscoveryState(raw: Partial<DiscoveryDeliverableState>): DiscoveryDeliverableState {
  const validSid = ensureValidSessionId(raw.sessionId, raw.isDemoCase);
  const savedTrack = raw.challenge?.track || 'persona';
  const base = createBlankDiscoveryState(validSid, savedTrack);

  const migratedSelectedHackId =
    typeof raw.selectedHackId === 'number' && HACKS_DATA.some((h) => h.id === raw.selectedHackId)
      ? raw.selectedHackId
      : Array.isArray(raw.selectedHackIds) &&
        raw.selectedHackIds.length > 0 &&
        HACKS_DATA.some((h) => h.id === raw.selectedHackIds![0])
      ? raw.selectedHackIds[0]
      : null;

  return {
    ...base,
    ...raw,
    sessionId: validSid,
    currentModule: clampPhaseStep(raw.currentModule),
    challenge: {
      ...base.challenge,
      ...(raw.challenge || {}),
      track: savedTrack
    },
    strategicProfile: {
      ...base.strategicProfile,
      ...(raw.strategicProfile || {})
    },
    selectedHackId: migratedSelectedHackId,
    hackPlantillaResponses: raw.hackPlantillaResponses || {},
    powerLens: {
      ...base.powerLens,
      ...(raw.powerLens || {})
    },
    srapOrientation: {
      ...base.srapOrientation,
      ...(raw.srapOrientation || {})
    },
    actionPlan: Array.isArray(raw.actionPlan) && raw.actionPlan.length > 0 ? raw.actionPlan : base.actionPlan
  };
}

function readSavedRealDiscoveryState(): DiscoveryDeliverableState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as Partial<DiscoveryDeliverableState>;
    if (!parsed?.challenge || !parsed.strategicProfile || parsed.isDemoCase) return null;
    const hydrated = hydrateDiscoveryState(parsed);
    return hasMeaningfulSavedData(hydrated) ? hydrated : null;
  } catch {
    return null;
  }
}

export default function DiscoveryPortal({
  setActiveView: _setActiveView,
  initialModule,
  onConsumeInitialModule,
  onSessionMetaChange
}: DiscoveryPortalProps) {
  const [deliverableState, setDeliverableState] = useState<DiscoveryDeliverableState>(() => {
    try {
      const activeBucket = localStorage.getItem(ACTIVE_STORAGE_KEY);
      const preferredKey = activeBucket === 'demo' ? DEMO_STORAGE_KEY : STORAGE_KEY;
      const candidateKeys = [...new Set([preferredKey, STORAGE_KEY, DEMO_STORAGE_KEY])];
      for (const key of candidateKeys) {
        const saved = localStorage.getItem(key);
        if (!saved) continue;
        const parsed = JSON.parse(saved) as Partial<DiscoveryDeliverableState>;
        if (!parsed || !parsed.challenge || !parsed.strategicProfile) continue;

        // Migrate an older demo that was stored in the old single-session bucket.
        if (key === STORAGE_KEY && parsed.isDemoCase) {
          localStorage.setItem(DEMO_STORAGE_KEY, saved);
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(ACTIVE_STORAGE_KEY, 'demo');
        }
        return hydrateDiscoveryState(parsed);
      }
    } catch {}
    return createBlankDiscoveryState(generateDiscoverySessionId('DX'), 'persona');
  });

  const [selectedStartTrack, setSelectedStartTrack] = useState<DiscoveryTrackType>(
    () => deliverableState.challenge.track || 'persona'
  );

  // Mostrar siempre primero la Portada ceremonial al cargar la aplicación,
  // conservando intacto cualquier progreso guardado para ofrecer «Continuar sesión».
  const [viewingStartScreen, setViewingStartScreen] = useState<boolean>(
    () => !(initialModule && initialModule >= 1 && initialModule <= TOTAL_DISCOVERY_STEPS)
  );
  const [activeModule, setActiveModule] = useState<number>(
    clampPhaseStep(initialModule || deliverableState.currentModule || 1)
  );
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [confirmCoverNewSession, setConfirmCoverNewSession] = useState<boolean>(false);
  const [sessionVisual, setSessionVisual] = useState<string>(DEFAULT_HERO_VISUAL);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);
  const [navigationNotice, setNavigationNotice] = useState<string | null>(null);

  const hasSavedProgress = hasMeaningfulSavedData(deliverableState);
  const savedRealSession = useMemo(
    () => deliverableState.isDemoCase ? readSavedRealDiscoveryState() : null,
    [deliverableState.isDemoCase, deliverableState.sessionId]
  );
  const hasSavedRealProgress = Boolean(savedRealSession);
  const hasCoverProgress = hasSavedProgress || hasSavedRealProgress;
  const coverSessionState = hasSavedProgress ? deliverableState : savedRealSession || deliverableState;
  const coverCompletion = calculateDiscoveryCompletion(coverSessionState);
  const coverActiveModule = clampPhaseStep(coverSessionState.currentModule || activeModule);
  const coverTrack = coverSessionState.challenge.track || 'persona';

  useEffect(() => {
    try {
      const savedVisual = localStorage.getItem('decox_deliverable_custom_visual');
      if (savedVisual) setSessionVisual(savedVisual);
    } catch {}
  }, [activeModule]);

  useEffect(() => {
    if (initialModule >= 1 && initialModule <= TOTAL_DISCOVERY_STEPS && viewingStartScreen && deliverableState.isDemoCase) {
      const savedReal = readSavedRealDiscoveryState();
      if (savedReal) {
        const savedModule = clampPhaseStep(savedReal.currentModule || initialModule);
        const missingPhase = firstMissingPrerequisite(savedReal, savedModule);
        setNavigationNotice(
          missingPhase
            ? 'Tu sesión se reanuda en la Fase ' + String(missingPhase.num).padStart(2, '0') +
              ' porque falta completar: ' + missingPhase.shortLabel + '.'
            : null
        );
        setViewingStartScreen(false);
        setSelectedStartTrack(savedReal.challenge.track);
        setActiveModule(missingPhase?.num || savedModule);
        setDeliverableState(savedReal);
        if (onConsumeInitialModule) onConsumeInitialModule();
        return;
      }
    }

    if (initialModule !== undefined && initialModule !== null) {
      if (initialModule === 0) {
        setViewingStartScreen(true);
        setConfirmCoverNewSession(false);
      } else if (initialModule >= 1 && initialModule <= TOTAL_DISCOVERY_STEPS) {
        const isBackwardNavigation = !viewingStartScreen && initialModule <= activeModule;
        const missingPriorPhases = isBackwardNavigation
          ? []
          : DISCOVERY_FIVE_PHASES.filter(
              (phase) =>
                phase.num < initialModule &&
                !isDiscoveryPhasePopulated(deliverableState, phase.num)
            );

        if (missingPriorPhases.length > 0) {
          setNavigationNotice(
            'Para abrir la Fase ' + String(initialModule).padStart(2, '0') +
            ', completa primero: ' + missingPriorPhases.map((phase) => phase.shortLabel).join(', ') + '.'
          );
        } else {
          setNavigationNotice(null);
          setViewingStartScreen(false);
          setActiveModule(initialModule);
          setDeliverableState((prev) => {
            const prevHasData = hasMeaningfulSavedData(prev);
            if (!prevHasData && prev.isDemoCase && initialModule === 1) {
              const fresh = createBlankDiscoveryState(
                generateDiscoverySessionId('DX'),
                selectedStartTrack
              );
              fresh.sessionStarted = true;
              return fresh;
            }
            return {
              ...prev,
              sessionStarted: true,
              challenge: !prevHasData
                ? { ...prev.challenge, track: selectedStartTrack }
                : prev.challenge
            };
          });
        }
      }
      if (onConsumeInitialModule) {
        onConsumeInitialModule();
      }
    }
  }, [initialModule, onConsumeInitialModule, selectedStartTrack]);

  // Mantener separados el caso real y el demostrativo para que un demo no sobrescriba el borrador del cliente.
  useEffect(() => {
    try {
      const storageKey = deliverableState.isDemoCase ? DEMO_STORAGE_KEY : STORAGE_KEY;
      localStorage.setItem(
        storageKey,
        JSON.stringify({ ...deliverableState, currentModule: activeModule })
      );
      localStorage.setItem(ACTIVE_STORAGE_KEY, deliverableState.isDemoCase ? 'demo' : 'real');
    } catch {}
  }, [deliverableState, activeModule]);

  // Hidratar desde el servidor únicamente para el mismo sessionId validado sin borrar datos locales
  useEffect(() => {
    const sid = ensureValidSessionId(deliverableState.sessionId, deliverableState.isDemoCase);
    if (deliverableState.isDemoCase) return;

    async function loadServerState() {
      try {
        const res = await fetch(`/api/discovery/load?clientId=${encodeURIComponent(sid)}`);
        if (!res.ok) return;
        const json = await res.json();
        if (
          json.success &&
          json.state &&
          json.state.sessionId === sid &&
          json.state.sessionStarted
        ) {
          setDeliverableState((prev) =>
            hasMeaningfulSavedData(prev)
              ? prev
              : hydrateDiscoveryState({ ...json.state, sessionId: sid })
          );
        }
      } catch {
        // localStorage sigue siendo la fuente local principal
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

  // Invalidar síntesis previa y marcar SRAP/Ruta como pendientes de sincronización cuando se editan Fases 1, 2 o 3
  const updateUpstreamState = (patch: Partial<DiscoveryDeliverableState>) => {
    setDeliverableState((prev) => ({
      ...prev,
      ...patch,
      sessionStarted: true,
      sessionCompleted: false,
      srapNeedsSync: true,
      planNeedsSync: true,
      strategicMap: {
        ...prev.strategicMap,
        ...(patch.strategicMap || {}),
        isSynthesized: false
      }
    }));
  };

  const handleSelectSingleHack = (hackId: number) => {
    updateUpstreamState({
      selectedHackId: hackId,
      selectedHackIds: [hackId]
    });
  };

  const handleUpdatePlantillaField = (hackId: number, fieldIndex: number, value: string) => {
    const hack = HACKS_DATA.find((h) => h.id === hackId);
    const prevArr = deliverableState.hackPlantillaResponses[hackId] || ['', '', ''];
    const nextArr = [...prevArr];
    nextArr[fieldIndex] = value;

    const summaryNote = hack
      ? hack.plantillaMetodologica
          .map((item, idx) =>
            nextArr[idx]?.trim() ? `${item.aspecto}: ${nextArr[idx].trim()}` : null
          )
          .filter(Boolean)
          .join(' | ')
      : '';

    updateUpstreamState({
      selectedHackId: hackId,
      selectedHackIds: [hackId],
      hackPlantillaResponses: {
        ...deliverableState.hackPlantillaResponses,
        [hackId]: nextArr
      },
      hackNotes: {
        ...deliverableState.hackNotes,
        [hackId]: summaryNote
      }
    });
  };

  const handleUpdatePowerLens = (updatedLens: PowerLensApplicationState) => {
    updateUpstreamState({
      powerLens: updatedLens
    });
  };

  const handleUpdateSrap = (updatedSrap: SrapOrientationState, clearSyncFlag = true) => {
    setDeliverableState((prev) => ({
      ...prev,
      sessionStarted: true,
      sessionCompleted: false,
      srapNeedsSync: clearSyncFlag ? false : prev.srapNeedsSync,
      planNeedsSync: true,
      srapOrientation: updatedSrap,
      strategicMap: {
        ...prev.strategicMap,
        isSynthesized: false
      }
    }));
  };

  const handleUpdateActionPlan = (updatedPlan: ActionPlanWeek[], clearPlanSync = false) => {
    setDeliverableState((prev) => ({
      ...prev,
      actionPlan: updatedPlan,
      planNeedsSync: clearPlanSync ? false : prev.planNeedsSync
    }));
  };

  const handleStartFreshSession = (trackOverride?: DiscoveryTrackType) => {
    const chosenTrack =
      trackOverride || selectedStartTrack || deliverableState.challenge.track || 'persona';
    const fresh = createBlankDiscoveryState(generateDiscoverySessionId('DX'), chosenTrack);
    fresh.sessionStarted = true;
    setDeliverableState(fresh);
    setSelectedStartTrack(chosenTrack);
    setActiveModule(1);
    setViewingStartScreen(false);
    setConfirmReset(false);
    setConfirmCoverNewSession(false);
    setSyncStatus('synced');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueSession = () => {
    const savedReal = deliverableState.isDemoCase ? readSavedRealDiscoveryState() : null;
    const resumeState = savedReal || deliverableState;
    const resumeModule = clampPhaseStep(resumeState.currentModule || activeModule || 1);
    const missingPhase = firstMissingPrerequisite(resumeState, resumeModule);

    if (savedReal) {
      setDeliverableState(savedReal);
      setSelectedStartTrack(savedReal.challenge.track);
    } else {
      setDeliverableState((prev) => ({ ...prev, sessionStarted: true }));
    }
    setActiveModule(missingPhase?.num || resumeModule);
    setNavigationNotice(
      missingPhase
        ? 'Tu sesión se reanuda en la Fase ' + String(missingPhase.num).padStart(2, '0') +
          ' porque falta completar: ' + missingPhase.shortLabel + '.'
        : null
    );
    setViewingStartScreen(false);
    setConfirmCoverNewSession(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadReferenceCase = (trackOverride?: DiscoveryTrackType) => {
    const chosenTrack = trackOverride || selectedStartTrack || 'organizacion';
    let demo: DiscoveryDeliverableState | null = null;
    try {
      const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
      if (savedDemo) {
        const parsed = JSON.parse(savedDemo) as Partial<DiscoveryDeliverableState>;
        if (parsed?.isDemoCase && parsed.challenge?.track === chosenTrack && parsed.strategicProfile) {
          demo = hydrateDiscoveryState(parsed);
        }
      }
    } catch {}
    demo = demo || createDemoDiscoveryState(chosenTrack);
    setDeliverableState(demo);
    setSelectedStartTrack(chosenTrack);
    setActiveModule(1);
    setViewingStartScreen(false);
    setConfirmReset(false);
    setConfirmCoverNewSession(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPhasePopulated = (phaseNum: number): boolean =>
    isDiscoveryPhasePopulated(deliverableState, phaseNum);

  const requestPhaseNavigation = (phaseNum: number) => {
    const canGoBack = phaseNum <= activeModule;
    const missingPriorPhases = canGoBack
      ? []
      : DISCOVERY_FIVE_PHASES.filter(
          (phase) => phase.num < phaseNum && !isPhasePopulated(phase.num)
        );
    if (missingPriorPhases.length > 0) {
      setNavigationNotice(
        'Para abrir la Fase ' + String(phaseNum).padStart(2, '0') +
        ', completa primero: ' + missingPriorPhases.map((phase) => phase.shortLabel).join(', ') + '.'
      );
      return;
    }
    setNavigationNotice(null);
    setActiveModule(phaseNum);
  };

  const completion = calculateDiscoveryCompletion(deliverableState);
  const activeTrack: DiscoveryTrackType = deliverableState.challenge.track || 'persona';
  const currentPhaseDef =
    DISCOVERY_FIVE_PHASES.find((p) => p.num === activeModule) || DISCOVERY_FIVE_PHASES[0];

  useEffect(() => {
    if (onSessionMetaChange) {
      const showSavedRealInCover = viewingStartScreen && Boolean(savedRealSession);
      onSessionMetaChange({
        activeModule: showSavedRealInCover ? coverActiveModule : activeModule,
        viewingStartScreen,
        hasSavedProgress: viewingStartScreen ? hasCoverProgress : hasSavedProgress,
        completionPct: showSavedRealInCover ? coverCompletion.percentage : completion.percentage
      });
    }
  }, [
    activeModule,
    viewingStartScreen,
    hasSavedProgress,
    hasCoverProgress,
    savedRealSession?.sessionId,
    coverActiveModule,
    coverCompletion.percentage,
    completion.percentage,
    onSessionMetaChange
  ]);

  // ==============================================================
  // PORTADA CEREMONIAL — CHALAMANDRA MAGISTRAL DECOX
  // ==============================================================
  if (viewingStartScreen) {
    return (
      <div className="max-w-6xl mx-auto py-2 sm:py-4 space-y-10 animate-fadeIn">
        {navigationNotice && (
          <div role="alert" className="no-print rounded-xl chalamandra-surface-rose px-4 py-3 text-xs text-rose-100">
            {navigationNotice}
          </div>
        )}
        <section className="relative overflow-hidden rounded-2xl chalamandra-surface-elevated p-6 sm:p-10 lg:p-12">
          {/* Geometría simbólica de Chalamandra sobre obsidiana */}
          <AlchemicalGeometryBackdrop className="absolute -right-24 -top-24 w-[480px] h-[480px] text-[#ECC964] opacity-[0.20]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Columna principal: Emblema oficial, Título, Explicación, Selector y Acciones */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-7">
              <div className="space-y-5">
                {/* Emblema oficial de la Salamandra + firma */}
                <div className="flex items-center gap-4">
                  <ChalamandraMedallion size="xl" />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 text-xs font-mono font-semibold text-[#ECC964]">
                      <span>Chalamandra Magistral DecoX</span>
                      <span aria-hidden="true" className="text-[#D4AF37]">·</span>
                      <span className="text-[#FFF0BE]">Ecosistema Oficial</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#D6CFC2]">
                      Alquimia cognitiva aplicada, decodificación de patrones y arquitectura estratégica
                    </p>
                  </div>
                </div>

                {/* Título exacto de la Portada */}
                <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.7rem] font-semibold text-[#FAF6ED] tracking-tight leading-[1.14] text-balance">
                  Sesión de Descubrimiento{' '}
                  <span className="chalamandra-gold-text">Interactive DecoX</span>
                </h1>

                {/* Explicación breve de la experiencia */}
                <p className="text-sm sm:text-base text-[#DDD6C7] leading-relaxed max-w-2xl">
                  Experiencia guiada en cinco fases para transformar un problema, bloqueo o iniciativa real en una ruta estratégica verificable. Distinguirás hechos de hipótesis, aplicarás{' '}
                  <strong className="text-[#FFF0BE] font-semibold">
                    un único Hack oficial con su plantilla metodológica
                  </strong>
                  , calibrarás la ejecución con <strong className="text-[#FFF0BE] font-semibold">SRAP</strong> y obtendrás tu informe ejecutivo en PDF/A4 y JSON.
                </p>

                {/* Selector Personas / Organizaciones */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#F6DF96]">
                      Selecciona el recorrido de tu sesión:
                    </span>
                    <span className="text-[11px] font-mono text-[#C4BCAD]">
                      Adapta preguntas, ejemplos y criterios
                    </span>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label="Seleccionar recorrido Personas u Organizaciones"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                  >
                    {DISCOVERY_TRACK_OPTIONS.map((tOpt) => {
                      const isSelected = selectedStartTrack === tOpt.value;
                      const TrackIcon = tOpt.value === 'organizacion' ? Building2 : User;
                      return (
                        <button
                          key={tOpt.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedStartTrack(tOpt.value)}
                          className={`p-4 rounded-xl text-left cursor-pointer space-y-2 ${
                            isSelected ? 'chalamandra-selector-active' : 'chalamandra-selector'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-2.5 text-sm font-display font-semibold text-[#FAF6ED] whitespace-nowrap">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border ${
                                  isSelected
                                    ? 'bg-[#ECC964]/20 border-[#ECC964] text-[#FFF0BE]'
                                    : 'bg-[#09080E] border-[#D4AF37]/30 text-[#D4AF37]'
                                }`}
                              >
                                <TrackIcon className="w-4 h-4 shrink-0" />
                              </span>
                              <span>{tOpt.title}</span>
                            </span>
                            <span
                              className={`text-[11px] font-mono whitespace-nowrap ${
                                isSelected ? 'text-[#FFF0BE] font-semibold' : 'text-[#B8B0A0]'
                              }`}
                            >
                              {isSelected ? '✓ Activo' : 'Seleccionar'}
                            </span>
                          </div>
                          <p className="text-xs text-[#D6CFC2] leading-relaxed">
                            {tOpt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Aviso de progreso resguardado + Botones principales */}
              <div className="space-y-3.5 pt-2">
                {hasCoverProgress && (
                  <div className="p-3.5 rounded-xl chalamandra-surface-emerald flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-[#FAF6ED]">
                      <span className="font-mono font-semibold text-emerald-300">
                        Progreso guardado disponible:
                      </span>{' '}
                      <span>
                        {coverSessionState.challenge.title.trim() ||
                          `Recorrido ${coverTrack === 'organizacion' ? 'Organizaciones' : 'Personas'}`}{' '}
                        · Fase 0{coverActiveModule} ({coverCompletion.percentage}% completado)
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-200/90 tabular-nums">
                      {coverSessionState.sessionId}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {hasCoverProgress ? (
                    <>
                      <button
                        id="start-continue-session-btn"
                        type="button"
                        onClick={handleContinueSession}
                        className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl chalamandra-btn-primary font-bold text-sm cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Play className="w-4 h-4 fill-[#08070B] shrink-0" />
                        <span className="tabular-nums">
                          {hasSavedRealProgress
                            ? 'Volver a mi sesión real (Fase 0' + coverActiveModule + ' · ' + coverCompletion.percentage + '%)'
                            : 'Continuar sesión (Fase 0' + activeModule + ' · ' + completion.percentage + '%)'}
                        </span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>

                      {!confirmCoverNewSession ? (
                        <button
                          id="start-new-session-btn"
                          type="button"
                          onClick={() => setConfirmCoverNewSession(true)}
                          className="flex items-center gap-2 px-5 py-3.5 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#ECC964] shrink-0" />
                          <span>Comenzar sesión nueva</span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl chalamandra-surface-rose text-xs">
                          <span className="text-rose-100 font-medium px-1">
                            {hasSavedRealProgress
                              ? '¿Abrir Fase 01 en blanco y reemplazar el borrador real guardado?'
                              : '¿Abrir Fase 01 en blanco y reemplazar el borrador actual?'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStartFreshSession(selectedStartTrack)}
                            className="px-3 py-1.5 rounded-lg chalamandra-btn-primary font-bold cursor-pointer whitespace-nowrap"
                          >
                            Comenzar sesión
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmCoverNewSession(false)}
                            className="px-3 py-1.5 rounded-lg chalamandra-btn-secondary font-semibold cursor-pointer whitespace-nowrap"
                          >
                            Conservar avance
                          </button>
                        </div>
                      )}

                      <button
                        id="load-demo-case-btn"
                        type="button"
                        onClick={() => handleLoadReferenceCase(selectedStartTrack)}
                        className="flex items-center gap-2 px-4 py-3.5 rounded-xl chalamandra-selector text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#ECC964] shrink-0" />
                        <span>
                          Caso demostrativo (
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
                        className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl chalamandra-btn-primary font-bold text-sm cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Play className="w-4 h-4 fill-[#08070B] shrink-0" />
                        <span>Comenzar sesión</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>

                      <button
                        id="load-demo-case-btn"
                        type="button"
                        onClick={() => handleLoadReferenceCase(selectedStartTrack)}
                        className="flex items-center gap-2 px-5 py-3.5 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Layers className="w-4 h-4 text-[#ECC964] shrink-0" />
                        <span>
                          Ver caso demostrativo (
                          {selectedStartTrack === 'organizacion' ? 'Organizaciones' : 'Personas'})
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Columna visual: Imagen Hero oficial de la mesa estratégica + Cámara de rigor */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="relative flex-1 min-h-[270px] rounded-xl overflow-hidden border border-[#ECC964]/55 bg-[#09080E] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9),0_0_32px_-12px_rgba(212,175,55,0.28)]">
                {!heroImgFailed ? (
                  <img
                    src={sessionVisual}
                    alt="Mesa estratégica iluminada Chalamandra Magistral DecoX con sello de salamandra"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full min-h-[270px] object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full min-h-[270px] flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.22),#09080E_72%)]">
                    <ChalamandraMedallion size="xl" />
                    <span className="mt-3 font-display text-sm text-[#FFF0BE]">
                      Chalamandra Magistral DecoX
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07060A] via-[#07060A]/75 to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-[#FFF0BE] font-semibold">
                    Recorrido {selectedStartTrack === 'organizacion' ? 'Organizaciones' : 'Personas'}
                  </span>
                  <span className="text-[#ECC964] tabular-nums">5 Fases · 1 Hack · SRAP</span>
                </div>
              </div>

              <div className="p-4 rounded-xl chalamandra-surface-cyan space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2 font-mono text-cyan-200 font-semibold">
                  <span>Rigor epistémico y resguardo local</span>
                  <span className="text-[#FFF0BE] text-[11px]">Aislamiento por sesión</span>
                </div>
                <p className="text-[#D6CFC2] leading-relaxed">
                  El test de arquetipo es opcional y opera siempre como hipótesis revisable, nunca como etiqueta fija. Tus respuestas se guardan localmente en este navegador sin exponerse en la URL.
                </p>
              </div>
            </div>
          </div>
        </section>

        <AlchemicalHairline />

        {/* Vista previa visual del recorrido de las cinco fases */}
        <section aria-labelledby="five-phases-preview-heading" className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-semibold text-[#ECC964]">
                Vista previa del viaje estratégico
              </span>
              <h2
                id="five-phases-preview-heading"
                className="font-display text-xl sm:text-2xl font-semibold text-[#FAF6ED] mt-0.5"
              >
                Arquitectura conectada de las cinco fases DecoX
              </h2>
            </div>
            <span className="text-xs font-mono text-[#C4BCAD]">
              De la exploración de hechos a tu Ruta Inicial exportable
            </span>
          </div>

          <div className="relative">
            {/* Hilo conductor dorado en escritorio */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-9 left-10 right-10 h-[2px] bg-gradient-to-r from-[#D4AF37]/30 via-[#ECC964]/75 to-[#34D399]/55 pointer-events-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
              {DISCOVERY_FIVE_PHASES.map((phase) => {
                const PhaseIcon = getPhaseIconComponent(phase.id);
                const accents = getPhaseAccentClasses(phase.id);
                const isSavedStep = hasSavedProgress && activeModule === phase.num;

                return (
                  <div
                    key={phase.id}
                    className={`p-5 rounded-xl flex flex-col justify-between space-y-4 ${
                      isSavedStep ? 'chalamandra-surface-elevated' : 'chalamandra-surface'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-mono font-bold tabular-nums ${accents.badge}`}
                        >
                          {phase.code}
                        </span>
                        <PhaseIcon className={`w-4 h-4 shrink-0 ${accents.icon}`} />
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[11px] font-mono text-[#ECC964]">
                          {accents.kicker}
                        </span>
                        <h3 className="font-display text-sm sm:text-base font-semibold text-[#FAF6ED]">
                          {phase.shortLabel}
                        </h3>
                      </div>

                      <p className="text-xs text-[#D6CFC2] leading-relaxed">
                        {phase.purpose}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] font-mono text-[#B8B0A0]">
                      <span>Fase {phase.code}</span>
                      {isSavedStep ? (
                        <span className="text-emerald-300 font-semibold">En curso</span>
                      ) : isPhasePopulated(phase.num) && hasSavedProgress ? (
                        <span className="text-emerald-300">Completada</span>
                      ) : (
                        <span className="text-[#ECC964]/90">Guiada</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==============================================================
  // FLUJO ACTIVO DE 5 FASES — RIEL CONDUCTOR DORADO
  // ==============================================================
  return (
    <div className="max-w-6xl mx-auto space-y-7 py-1">
      {deliverableState.isDemoCase && (
        <div
          role="status"
          className="no-print px-5 py-3.5 rounded-xl chalamandra-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5 text-[#FFF0BE]">
            <Layers className="w-4 h-4 text-[#ECC964] shrink-0" />
            <span>
              <strong className="font-mono text-[#ECC964]">CASO DEMOSTRATIVO:</strong> Recorrido{' '}
              <strong>{activeTrack === 'organizacion' ? 'Organizaciones' : 'Personas'}</strong> (
              <span className="font-mono">{deliverableState.sessionId}</span>). Aislado de tus sesiones propias.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                handleLoadReferenceCase(
                  activeTrack === 'organizacion' ? 'persona' : 'organizacion'
                )
              }
              className="px-3 py-1.5 rounded-lg chalamandra-btn-secondary font-semibold cursor-pointer whitespace-nowrap"
            >
              Ver demo {activeTrack === 'organizacion' ? 'Personas' : 'Organizaciones'}
            </button>
            <button
              type="button"
              onClick={() => handleStartFreshSession(activeTrack)}
              className="px-3.5 py-1.5 rounded-lg chalamandra-btn-primary font-bold cursor-pointer whitespace-nowrap"
            >
              Comenzar mi caso real
            </button>
          </div>
        </div>
      )}

      {/* Cabecera unificada y Riel Conductor de las 5 Fases */}
      <section className="no-print rounded-2xl chalamandra-surface-elevated overflow-hidden">
        <div className="px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3.5 min-w-0">
            <ChalamandraMedallion size="md" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono text-[#ECC964]">
                <span className="font-semibold">
                  {activeTrack === 'organizacion'
                    ? 'Recorrido Organizaciones'
                    : 'Recorrido Personas'}
                </span>
                <span aria-hidden="true" className="text-[#D4AF37]">·</span>
                <span className="text-[#FFF0BE]">{currentPhaseDef.phaseTitle}</span>
              </div>
              <h1 className="font-display text-base sm:text-lg font-semibold text-[#FAF6ED] tracking-wide truncate">
                {deliverableState.challenge.title.trim() ||
                  'Sesión de Descubrimiento Interactive DecoX'}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg chalamandra-chamber text-xs font-mono tabular-nums">
              <span className="text-[#DDD6C7]">
                Fase {activeModule}/{TOTAL_DISCOVERY_STEPS} ·{' '}
                <span className="text-[#FFF0BE] font-semibold">{completion.percentage}%</span>
              </span>
              <div className="w-16 h-2 rounded-sm bg-[#1A1726] overflow-hidden border border-[#D4AF37]/25">
                <div
                  className="h-full bg-gradient-to-r from-[#B98519] via-[#ECC964] to-[#FFF0BE] transition-all duration-300"
                  style={{ width: `${Math.max(6, completion.percentage)}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => saveToServer()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg chalamandra-chamber text-xs font-mono text-[#DDD6C7] hover:border-[#ECC964] cursor-pointer transition-colors whitespace-nowrap"
              title="Guardado automático en este navegador; pulsa para respaldar en la memoria temporal del servidor."
            >
              <Cloud
                className={`w-3.5 h-3.5 shrink-0 ${
                  syncStatus === 'synced'
                    ? 'text-emerald-400'
                    : syncStatus === 'saving'
                    ? 'text-[#ECC964]'
                    : 'text-[#B8B0A0]'
                }`}
              />
              <span>
                {syncStatus === 'saving'
                  ? 'Guardando...'
                  : syncStatus === 'error'
                  ? 'Local (navegador)'
                  : 'Guardado local'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewingStartScreen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5 text-[#ECC964] shrink-0" />
              <span>Portada</span>
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="p-2 rounded-lg chalamandra-chamber text-[#C4BCAD] hover:text-rose-300 hover:border-rose-400/60 cursor-pointer transition-colors"
                title="Reiniciar sesión en blanco"
                aria-label="Reiniciar sesión en blanco"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 chalamandra-surface-rose px-2.5 py-1 rounded-lg text-xs">
                <span className="text-rose-100 font-mono">¿Reiniciar?</span>
                <button
                  type="button"
                  onClick={() => handleStartFreshSession(activeTrack)}
                  className="px-2 py-0.5 rounded bg-rose-400 text-[#08070B] font-bold cursor-pointer"
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 rounded bg-[#1A1726] text-[#FAF6ED] cursor-pointer"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Riel Conductor de las 5 Fases Conectadas */}
        <div
          role="tablist"
          aria-label="Cinco fases de la Sesión de Descubrimiento"
          className="relative px-4 sm:px-5 py-4 bg-[#0B0A11]/95"
        >
          {/* Línea conductora dorada detrás de las pestañas */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute top-1/2 left-10 right-10 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#D4AF37]/30 via-[#ECC964]/65 to-[#34D399]/45 pointer-events-none"
          />

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {DISCOVERY_FIVE_PHASES.map((phase) => {
              const Icon = getPhaseIconComponent(phase.id);
              const isCurrent = activeModule === phase.num;
              const populated = isPhasePopulated(phase.num);

              return (
                <button
                  key={phase.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  onClick={() => requestPhaseNavigation(phase.num)}
                  aria-disabled={phase.num > activeModule && !DISCOVERY_FIVE_PHASES.filter(
                    (priorPhase) => priorPhase.num < phase.num
                  ).every((priorPhase) => isPhasePopulated(priorPhase.num))}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs cursor-pointer text-left ${
                    isCurrent
                      ? 'chalamandra-btn-primary font-bold'
                      : populated
                      ? 'chalamandra-selector-emerald font-medium'
                      : 'chalamandra-selector'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isCurrent
                          ? 'text-[#08070B]'
                          : populated
                          ? 'text-emerald-300'
                          : 'text-[#ECC964]'
                      }`}
                    />
                    <span className="truncate tabular-nums">{phase.navLabel}</span>
                  </span>
                  {!isCurrent && populated && (
                    <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {navigationNotice && (
        <div role="alert" className="no-print rounded-xl chalamandra-surface-rose px-4 py-3 text-xs text-rose-100">
          {navigationNotice}
        </div>
      )}

      {/* Fase Activa */}
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

        {activeModule === 3 && (
          <Module03SevenHacks
            challenge={deliverableState.challenge}
            profile={deliverableState.strategicProfile}
            selectedHackId={deliverableState.selectedHackId}
            hackPlantillaResponses={deliverableState.hackPlantillaResponses}
            powerLens={deliverableState.powerLens}
            onSelectHack={handleSelectSingleHack}
            onUpdatePlantillaField={handleUpdatePlantillaField}
            onUpdatePowerLens={handleUpdatePowerLens}
            onPrev={() => setActiveModule(2)}
            onNext={() => setActiveModule(4)}
          />
        )}

        {activeModule === 4 && (
          <Module04SrapOrientation
            state={deliverableState}
            onChangeSrap={handleUpdateSrap}
            onChangeActionPlan={handleUpdateActionPlan}
            onPrev={() => setActiveModule(3)}
            onNext={() => setActiveModule(5)}
          />
        )}

        {activeModule === 5 && (
          <Module07ExecutiveReport
            state={deliverableState}
            onSaveServer={saveToServer}
            onMarkCompleted={() =>
              setDeliverableState((prev) => ({ ...prev, sessionCompleted: true }))
            }
            onApplySynthesis={(updatedMap, updatedPlan) =>
              setDeliverableState((prev) => ({
                ...prev,
                strategicMap: updatedMap,
                actionPlan: updatedPlan,
                planNeedsSync: false
              }))
            }
            onPrev={() => setActiveModule(4)}
            onJumpToModule={(num) => setActiveModule(clampPhaseStep(num))}
          />
        )}
      </div>
    </div>
  );
}
