import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PenTool,
  Layers,
  Compass,
  Cpu,
  Flame,
  BarChart3,
  HelpCircle,
  FileText,
  ShieldCheck,
  Wand2
} from 'lucide-react';
import { SEVEN_MAGISTRAL_HACKS } from '../../utils/constants';
import { MagistralHackItem, ChallengeData, StrategicProfileData } from '../../types';
import { computeRecommendedHacks } from '../../data/discoveryFlowConfig';
import { useAudio } from '../../hooks/useAudio';
import { triggerConfetti } from '../Confetti';

interface Module03SevenHacksProps {
  challenge: ChallengeData;
  profile: StrategicProfileData;
  selectedHackIds: number[];
  hackNotes: Record<number, string>;
  focusedHackId?: number;
  stepNumber?: number;
  totalSteps?: number;
  prevStepLabel?: string;
  nextStepLabel?: string;
  onSelectHackStep?: (hackId: number) => void;
  onToggleHack: (id: number) => void;
  onApplyRecommended: (ids: number[]) => void;
  onUpdateNote: (id: number, note: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Module03SevenHacks({
  challenge,
  profile,
  selectedHackIds,
  hackNotes,
  focusedHackId,
  stepNumber = 3,
  totalSteps = 13,
  prevStepLabel = 'Volver al paso anterior',
  nextStepLabel = 'Continuar al siguiente módulo',
  onSelectHackStep,
  onToggleHack,
  onApplyRecommended,
  onUpdateNote,
  onPrev,
  onNext
}: Module03SevenHacksProps) {
  const isOrg = challenge.track === 'organizacion';
  const recommendations = computeRecommendedHacks(challenge, profile);
  const [activeHackId, setActiveHackId] = useState<number>(
    focusedHackId || selectedHackIds[0] || recommendations[0]?.hackId || 1
  );
  const { playTick, playSuccessChime } = useAudio();

  React.useEffect(() => {
    if (focusedHackId) {
      setActiveHackId(focusedHackId);
    }
  }, [focusedHackId]);

  const effectiveHackId = focusedHackId || activeHackId;
  const activeHack: MagistralHackItem =
    SEVEN_MAGISTRAL_HACKS.find((h) => h.id === effectiveHackId) || SEVEN_MAGISTRAL_HACKS[0];

  const faseAHacks = SEVEN_MAGISTRAL_HACKS.filter((h) => h.phase === 'mundo_simulado');
  const faseBHacks = SEVEN_MAGISTRAL_HACKS.filter((h) => h.phase === 'decodificacion_sistema');

  const adaptiveQuestions = isOrg
    ? activeHack.organizacionQuestions || activeHack.guidingQuestions
    : activeHack.personaQuestions || activeHack.guidingQuestions;

  const adaptiveTemplate = isOrg
    ? activeHack.organizacionTemplate || activeHack.templatePrompt
    : activeHack.personaTemplate || activeHack.templatePrompt;

  const getHackIcon = (iconName: string) => {
    switch (iconName) {
      case 'PenTool':
        return <PenTool className="w-4 h-4 text-amber-400" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-cyan-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'BarChart3':
        return <BarChart3 className="w-4 h-4 text-amber-300" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-yellow-300" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-300" />;
    }
  };

  const handleSelectToggle = (id: number) => {
    onToggleHack(id);
    if (!selectedHackIds.includes(id)) {
      playSuccessChime();
      triggerConfetti();
    } else {
      playTick(450, 'sine', 0.05);
    }
  };

  const handleInsertGuidedScaffold = () => {
    const current = (hackNotes[activeHack.id] || '').trim();
    const nextValue = current ? `${current}\n${adaptiveTemplate}` : adaptiveTemplate;
    onUpdateNote(activeHack.id, nextValue);
    if (!selectedHackIds.includes(activeHack.id)) {
      onToggleHack(activeHack.id);
    }
    playTick(660, 'sine', 0.05);
  };

  const activeRecommendation = recommendations.find((r) => r.hackId === activeHack.id);

  const renderHackButton = (hack: MagistralHackItem) => {
    const isCurrent = effectiveHackId === hack.id;
    const isSelected = selectedHackIds.includes(hack.id);
    const isRecommended = recommendations.some((r) => r.hackId === hack.id);
    const hasNote = Boolean(hackNotes[hack.id]?.trim());

    return (
      <div
        key={hack.id}
        onClick={() => {
          setActiveHackId(hack.id);
          if (onSelectHackStep) {
            onSelectHackStep(hack.id);
          }
          playTick(600, 'sine', 0.04);
        }}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          isCurrent
            ? 'bg-slate-850 border-cyan-500/50 shadow-lg ring-1 ring-cyan-500/30'
            : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
            {getHackIcon(hack.iconName)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4
                className={`text-xs font-bold truncate ${
                  isCurrent ? 'text-slate-100' : 'text-slate-300'
                }`}
              >
                {hack.codeNumber}. {hack.archetypeName}
              </h4>
              {isRecommended && (
                <span className="text-[10px] font-mono text-amber-400 shrink-0">
                  · Sugerido
                </span>
              )}
              {hasNote && (
                <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                  · Aplicado
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 truncate block">
              {hack.subtitle}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSelectToggle(hack.id);
          }}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
            isSelected
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
          }`}
        >
          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          <span>{isSelected ? 'Activo' : 'Activar'}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div
            className={`flex items-center gap-2 text-xs font-mono mb-2 tabular-nums ${
              activeHack.phase === 'mundo_simulado' ? 'text-purple-300' : 'text-cyan-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              Paso {String(stepNumber).padStart(2, '0')} de {totalSteps} · {activeHack.phaseLabel} (
              {isOrg ? 'Organizaciones' : 'Personas'})
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Módulo de Razonamiento: {activeHack.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {activeHack.phase === 'mundo_simulado'
              ? 'Estás en Mundo Simulado: expande la percepción, detecta patrones, rompe dilemas o imagina posibilidades sin limitaciones heredadas antes de pasar a la Decodificación.'
              : 'Estás en Decodificación: examina reglas declaradas frente a incentivos reales, diseña variaciones reversibles y separa suposiciones de señales medibles.'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="text-xs tabular-nums">
            <span className="text-slate-400 block font-mono">Módulos Activos</span>
            <span className="font-bold text-slate-200">{selectedHackIds.length} de 7 Hacks</span>
          </div>
        </div>
      </div>

      {/* Dynamic Recommendation Banner derived from Steps 01 & 02 */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
            Ruta Adaptativa Sugerida ({isOrg ? 'Organización' : 'Persona'} · {challenge.explorationFocus || 'Exploración'} · {profile.evidenceLevel || 'Evidencia'})
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Para combinar expansión en el Mundo Simulado y lectura real del sistema en tu caso, te sugerimos activar:{' '}
            <strong className="text-slate-100">
              {recommendations
                .map((r) => {
                  const found = SEVEN_MAGISTRAL_HACKS.find((h) => h.id === r.hackId);
                  return found ? `${found.codeNumber}. ${found.archetypeName}` : null;
                })
                .filter(Boolean)
                .join(' · ')}
            </strong>
            . Puedes explorar y aplicar cualquiera de los 7 módulos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onApplyRecommended(recommendations.map((r) => r.hackId));
            playSuccessChime();
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors self-start md:self-auto"
        >
          Activar los 3 Sugeridos
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7 Hacks grouped into Fase A & Fase B */}
        <div className="lg:col-span-5 space-y-5">
          {/* Fase A Group */}
          <div className="space-y-2.5">
            <div className="px-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-300 block">
                Fase A · Mundo Simulado
              </span>
              <span className="text-[11px] text-slate-400 block">
                Imaginar, cuestionar y rediseñar el tablero (01, 02, 03 y 07)
              </span>
            </div>
            {faseAHacks.map(renderHackButton)}
          </div>

          {/* Fase B Group */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <div className="px-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 block">
                Fase B · Decodificación del sistema
              </span>
              <span className="text-[11px] text-slate-400 block">
                Descubrir cómo funciona realmente el tablero (04, 05 y 06)
              </span>
            </div>
            {faseBHacks.map(renderHackButton)}
          </div>
        </div>

        {/* Right Column: Active Hack Reasoning Module */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
                <span
                  className={
                    activeHack.phase === 'mundo_simulado'
                      ? 'text-purple-300 font-bold'
                      : 'text-cyan-300 font-bold'
                  }
                >
                  {activeHack.phaseLabel}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-300">
                  Estatuto epistémico: {activeHack.epistemicRole}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                {activeHack.name}
              </h3>
              <p className="text-xs text-emerald-300 font-mono">
                Resultado esperado: <strong>{activeHack.expectedDeliverable}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSelectToggle(activeHack.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start shrink-0 ${
                selectedHackIds.includes(activeHack.id)
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {selectedHackIds.includes(activeHack.id)
                  ? 'Activo en tu Síntesis'
                  : 'Activar este Hack'}
              </span>
            </button>
          </div>

          {/* Live Case Anchor so the hack operates directly on the user's case */}
          {(challenge.title.trim() || challenge.criticalFriction.trim()) && (
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Aplicando {activeHack.archetypeName} sobre tu caso ({isOrg ? 'Organización' : 'Persona'}):
              </span>
              <p className="text-slate-200 font-medium leading-relaxed">
                {challenge.title.trim() || 'Frente en exploración'}
                {challenge.criticalFriction.trim()
                  ? ` — Fricción: "${challenge.criticalFriction.trim()}"`
                  : ''}
              </p>
            </div>
          )}

          {activeRecommendation && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
              <strong className="text-amber-300 font-mono">Por qué se recomienda en tu caso: </strong>
              {activeRecommendation.reason}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Función Metodológica
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeHack.coreConcept}
            </p>
          </div>

          {/* Ethical & Epistemic Guardrail when present */}
          {activeHack.ethicalGuardrail && (
            <div className="p-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-300 font-mono block uppercase text-[10px] tracking-wider mb-0.5">
                  Criterio Ético y Epistémico Chalamandra
                </strong>
                {activeHack.ethicalGuardrail}
              </div>
            </div>
          )}

          {/* Track-Adaptive Questions */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Preguntas Adaptativas para {isOrg ? 'Organizaciones' : 'Personas'}
              </span>
            </span>
            <div className="space-y-2">
              {adaptiveQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/50 border border-slate-850 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <span className="text-cyan-400 font-mono font-bold shrink-0 tabular-nums">
                    {idx + 1}.
                  </span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/20 space-y-1.5">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
              Operación Práctica sobre el Tablero
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{activeHack.tacticalExercise}</p>
          </div>

          {/* Client Application Deliverable Input */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tu Entregable: {activeHack.expectedDeliverable}</span>
              </label>
              <button
                type="button"
                onClick={handleInsertGuidedScaffold}
                className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 hover:text-amber-200 cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                <span>Insertar estructura guía ({isOrg ? 'Organización' : 'Persona'})</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={hackNotes[activeHack.id] || ''}
              onChange={(e) => onUpdateNote(activeHack.id, e.target.value)}
              placeholder={adaptiveTemplate}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-cyan-500/30 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{prevStepLabel || 'Paso anterior'}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/40 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span>{nextStepLabel || 'Siguiente módulo'}</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
