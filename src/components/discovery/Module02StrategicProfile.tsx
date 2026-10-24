import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import {
  StrategicProfileData,
  ChallengeData,
  InteractiveArchetype
} from '../../types';
import {
  EVIDENCE_LEVEL_OPTIONS,
  DEPENDENCY_SCOPE_OPTIONS,
  URGENCY_LEVEL_OPTIONS,
  STEP2_CONDITIONAL_QUESTIONS,
  deriveGroundedPowersForCase
} from '../../data/discoveryFlowConfig';
import {
  INTERACTIVE_ARCHETYPES,
  INTERACTIVE_QUIZ_QUESTIONS
} from '../../data/interactiveCatalog';

interface Module02StrategicProfileProps {
  profile: StrategicProfileData;
  challenge: ChallengeData;
  onChange: (updated: StrategicProfileData) => void;
  onPrev: () => void;
  onNext: () => void;
}

const ARCHETYPE_LIST: InteractiveArchetype[] = [
  'El Arquitecto',
  'El Alquimista',
  'El Explorador'
];

export default function Module02StrategicProfile({
  profile,
  challenge,
  onChange,
  onPrev,
  onNext
}: Module02StrategicProfileProps) {
  const [newAssumption, setNewAssumption] = useState('');
  const [newRealConstraint, setNewRealConstraint] = useState('');
  const [newArtificialConstraint, setNewArtificialConstraint] = useState('');
  const [newUncertainty, setNewUncertainty] = useState('');

  const [showInlineQuiz, setShowInlineQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, InteractiveArchetype>>({});

  const uncertainties = profile.uncertainties || [];
  const activeConditionals = STEP2_CONDITIONAL_QUESTIONS.filter((q) =>
    q.shouldDisplay(challenge, profile)
  );
  const groundedPowers = deriveGroundedPowersForCase(challenge, profile);
  const isOrg = challenge.track === 'organizacion';

  const selectedArchetype = profile.archetypeHypothesis || null;
  const archetypeDetails = selectedArchetype
    ? INTERACTIVE_ARCHETYPES[selectedArchetype]
    : null;

  const handleSelectArchetypeManual = (arch: InteractiveArchetype | null) => {
    onChange({
      ...profile,
      archetypeHypothesis: arch,
      archetypeSource: arch ? 'manual' : 'none'
    });
  };

  const handleQuizOptionPick = (arch: InteractiveArchetype) => {
    const q = INTERACTIVE_QUIZ_QUESTIONS[quizStep];
    const updatedAnswers = { ...quizAnswers, [q.id]: arch };
    setQuizAnswers(updatedAnswers);

    if (quizStep < INTERACTIVE_QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
      return;
    }

    const counts: Record<InteractiveArchetype, number> = {
      'El Arquitecto': 0,
      'El Alquimista': 0,
      'El Explorador': 0
    };
    (Object.values(updatedAnswers) as InteractiveArchetype[]).forEach((val) => {
      counts[val] = (counts[val] || 0) + 1;
    });

    let winner: InteractiveArchetype = 'El Arquitecto';
    let maxCount = -1;
    ARCHETYPE_LIST.forEach((candidate) => {
      if (counts[candidate] > maxCount) {
        maxCount = counts[candidate];
        winner = candidate;
      }
    });

    onChange({
      ...profile,
      archetypeHypothesis: winner,
      archetypeSource: 'quiz'
    });
    setShowInlineQuiz(false);
    setQuizStep(0);
  };

  const addAssumption = () => {
    if (!newAssumption.trim()) return;
    onChange({
      ...profile,
      underlyingAssumptions: [...profile.underlyingAssumptions, newAssumption.trim()]
    });
    setNewAssumption('');
  };

  const removeAssumption = (idx: number) => {
    onChange({
      ...profile,
      underlyingAssumptions: profile.underlyingAssumptions.filter((_, i) => i !== idx)
    });
  };

  const addRealConstraint = () => {
    if (!newRealConstraint.trim()) return;
    onChange({
      ...profile,
      realConstraints: [...profile.realConstraints, newRealConstraint.trim()]
    });
    setNewRealConstraint('');
  };

  const removeRealConstraint = (idx: number) => {
    onChange({
      ...profile,
      realConstraints: profile.realConstraints.filter((_, i) => i !== idx)
    });
  };

  const addArtificialConstraint = () => {
    if (!newArtificialConstraint.trim()) return;
    onChange({
      ...profile,
      artificialConstraints: [...profile.artificialConstraints, newArtificialConstraint.trim()]
    });
    setNewArtificialConstraint('');
  };

  const removeArtificialConstraint = (idx: number) => {
    onChange({
      ...profile,
      artificialConstraints: profile.artificialConstraints.filter((_, i) => i !== idx)
    });
  };

  const addUncertainty = () => {
    if (!newUncertainty.trim()) return;
    onChange({
      ...profile,
      uncertainties: [...uncertainties, newUncertainty.trim()]
    });
    setNewUncertainty('');
  };

  const removeUncertainty = (idx: number) => {
    onChange({
      ...profile,
      uncertainties: uncertainties.filter((_, i) => i !== idx)
    });
  };

  const handleConditionalAnswer = (id: string, val: string) => {
    onChange({
      ...profile,
      conditionalProfileAnswers: {
        ...(profile.conditionalProfileAnswers || {}),
        [id]: val
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado de Fase 2 */}
      <div className="border-b border-[#D4AF37]/35 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#ECC964] text-xs font-mono font-semibold tabular-nums">
            <Compass className="w-4 h-4 text-[#ECC964]" />
            <span>Fase 02 de 05 · Decodificar</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#FAF6ED] tracking-tight text-balance">
            Decodificar patrones, restricciones, evidencias e hipótesis
          </h2>
          <p className="text-xs sm:text-sm text-[#D6CFC2] max-w-2xl leading-relaxed">
            Separa lo que sabes con certeza de lo que hoy supones, incorpora opcionalmente el resultado del test de arquetipo como hipótesis revisable y detecta qué poderes del catálogo de Interactive guardan relación real con tu caso.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl chalamandra-surface-cyan text-xs font-mono sm:text-right shrink-0">
          <span className="block text-[#C4BCAD]">Criterio epistémico</span>
          <span className="font-semibold text-cyan-200">Hipótesis ≠ Diagnóstico fijo</span>
        </div>
      </div>

      {/* 1. Resultado del Test de Arquetipo Interactive (Opcional y como Hipótesis) */}
      <section className="p-6 sm:p-7 rounded-2xl chalamandra-surface-violet space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono font-semibold text-violet-200">
              <span>Lectura cognitiva opcional</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#ECC964]">Solo como hipótesis revisable</span>
            </div>
            <h3 className="font-display text-base sm:text-lg font-semibold text-[#FAF6ED]">
              1. Resultado del Test de Arquetipo Interactive
            </h3>
            <p className="text-xs text-[#D6CFC2] leading-relaxed">
              El catálogo oficial de Interactive contempla tres arquetipos (<strong className="text-[#FFF0BE]">El Arquitecto</strong>, <strong className="text-[#FFF0BE]">El Alquimista</strong> y <strong className="text-[#FFF0BE]">El Explorador</strong>). Si ya hiciste el test o quieres responderlo aquí, lo usaremos únicamente como hipótesis de estilo operativo a contrastar con hechos, nunca como etiqueta permanente. También puedes continuar sin él.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowInlineQuiz(!showInlineQuiz);
                setQuizStep(0);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <span>{showInlineQuiz ? 'Cerrar test (10 preguntas)' : 'Hacer test de 10 preguntas aquí'}</span>
              {showInlineQuiz ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#ECC964]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#ECC964]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectArchetypeManual(null)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer whitespace-nowrap ${
                selectedArchetype === null
                  ? 'chalamandra-selector-active font-semibold'
                  : 'chalamandra-selector'
              }`}
            >
              Continuar sin resultado del test
            </button>
          </div>
        </div>

        {/* Selector directo de los 3 arquetipos reales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {ARCHETYPE_LIST.map((archKey) => {
            const info = INTERACTIVE_ARCHETYPES[archKey];
            const isSelected = selectedArchetype === archKey;
            return (
              <button
                key={archKey}
                type="button"
                onClick={() => handleSelectArchetypeManual(archKey)}
                className={`p-4 rounded-xl text-left cursor-pointer space-y-1.5 ${
                  isSelected ? 'chalamandra-selector-violet-active' : 'chalamandra-selector'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-xs sm:text-sm font-semibold text-[#FAF6ED]">
                    {info.name}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-violet-200 shrink-0" />}
                </div>
                <p className="text-xs text-[#D6CFC2] leading-snug">{info.tagline}</p>
              </button>
            );
          })}
        </div>

        {/* Test interactivo oficial de 10 preguntas (desplegable opcional) */}
        {showInlineQuiz && (
          <div className="p-5 rounded-xl chalamandra-chamber space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-violet-200 tabular-nums">
              <span>
                Test oficial Interactive · Pregunta {quizStep + 1} de {INTERACTIVE_QUIZ_QUESTIONS.length}
              </span>
              <button
                type="button"
                onClick={() => setShowInlineQuiz(false)}
                className="text-[#C4BCAD] hover:text-[#FFF0BE] cursor-pointer"
              >
                Cancelar
              </button>
            </div>
            <h4 className="text-sm font-semibold text-[#FAF6ED]">
              {INTERACTIVE_QUIZ_QUESTIONS[quizStep].text}
            </h4>
            <div className="space-y-2.5">
              {INTERACTIVE_QUIZ_QUESTIONS[quizStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuizOptionPick(opt.archetype)}
                  className="w-full text-left p-3.5 rounded-xl chalamandra-selector text-xs cursor-pointer flex items-center justify-between gap-3"
                >
                  <span>{opt.text}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ECC964] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lectura crítica como hipótesis cuando hay arquetipo seleccionado */}
        {archetypeDetails && (
          <div className="p-4 rounded-xl chalamandra-chamber space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-violet-200">
                Hipótesis activa: {archetypeDetails.name} (
                {profile.archetypeSource === 'quiz'
                  ? 'calculado con el test de 10 preguntas'
                  : 'seleccionado manualmente'}
                )
              </span>
              <span className="font-mono text-[11px] text-[#ECC964]">
                Punto ciego a vigilar: {archetypeDetails.blindspots[0]}
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#DDD6C7] mb-1.5">
                ¿Cómo podría estar ayudando o sesgando esta tendencia a tu problema actual? (Opcional)
              </label>
              <input
                type="text"
                value={profile.archetypeHypothesisNotes || ''}
                onChange={(e) =>
                  onChange({ ...profile, archetypeHypothesisNotes: e.target.value })
                }
                placeholder="Ej: Mi tendencia a estructurar todo primero me está haciendo postergar la validación real..."
                className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs"
              />
            </div>
          </div>
        )}
      </section>

      {/* 2. Calibración de Evidencia, Dependencia y Urgencia */}
      <section className="p-6 sm:p-7 rounded-2xl chalamandra-surface space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-[#FFF0BE] block">
              <span className="font-mono text-cyan-300 mr-1.5">02.</span>
              Nivel de evidencia disponible
            </span>
            <div className="space-y-2.5">
              {EVIDENCE_LEVEL_OPTIONS.map((opt) => {
                const active = (profile.evidenceLevel || 'Señales parciales') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...profile, evidenceLevel: opt.value })}
                    className={`w-full text-left p-3.5 rounded-xl cursor-pointer ${
                      active ? 'chalamandra-selector-cyan-active' : 'chalamandra-selector'
                    }`}
                  >
                    <span className="text-xs font-bold block text-[#FAF6ED]">{opt.title}</span>
                    <span className="text-[11px] text-[#D6CFC2] leading-snug block mt-0.5">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-[#FFF0BE] block">
              <span className="font-mono text-[#ECC964] mr-1.5">03.</span>
              Alcance de dependencia
            </span>
            <div className="space-y-2.5">
              {DEPENDENCY_SCOPE_OPTIONS.map((opt) => {
                const active =
                  (profile.dependencyScope || 'Control propio directo') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...profile, dependencyScope: opt.value })}
                    className={`w-full text-left p-3.5 rounded-xl cursor-pointer ${
                      active ? 'chalamandra-selector-active' : 'chalamandra-selector'
                    }`}
                  >
                    <span className="text-xs font-bold block text-[#FAF6ED]">{opt.title}</span>
                    <span className="text-[11px] text-[#D6CFC2] leading-snug block mt-0.5">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-[#FFF0BE] block">
              <span className="font-mono text-[#ECC964] mr-1.5">04.</span>
              Ventana de urgencia
            </span>
            <div className="space-y-2.5">
              {URGENCY_LEVEL_OPTIONS.map((opt) => {
                const active = (profile.urgencyLevel || 'Táctica (7–14 días)') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...profile, urgencyLevel: opt.value })}
                    className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      active ? 'chalamandra-selector-active' : 'chalamandra-selector'
                    }`}
                  >
                    {opt.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeConditionals.length > 0 && (
          <div className="pt-4 border-t border-[#D4AF37]/25 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#ECC964]">
              <GitBranch className="w-4 h-4 text-[#ECC964]" />
              <span>Preguntas condicionales según evidencia y dependencia</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeConditionals.map((q) => (
                <div key={q.id} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#FAF6ED]">
                    {q.label}
                  </label>
                  <p className="text-[11px] text-[#C4BCAD]">{q.helperText}</p>
                  <textarea
                    rows={3}
                    value={profile.conditionalProfileAnswers?.[q.id] || ''}
                    onChange={(e) => handleConditionalAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Patrones, Supuestos, Restricciones e Incertidumbres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl chalamandra-surface space-y-2.5">
          <h3 className="font-display text-sm font-semibold text-[#FFF0BE]">
            {isOrg
              ? 'Patrón o relato dominante en la organización'
              : 'Patrón o relato dominante sobre el problema'}
          </h3>
          <p className="text-xs text-[#C4BCAD]">
            ¿Qué explicación se repite hoy como si fuera inamovible?
          </p>
          <textarea
            rows={3}
            value={profile.dominantThoughtPattern}
            onChange={(e) => onChange({ ...profile, dominantThoughtPattern: e.target.value })}
            placeholder={
              isOrg
                ? 'Ej: "Si dirección no revisa cada detalle antes de salir, perderemos margen..."'
                : 'Ej: "Hasta no tener toda la plataforma lista nadie pagará por una sesión diagnóstica..."'
            }
            className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs leading-relaxed"
          />
        </div>

        <div className="p-6 rounded-2xl chalamandra-surface space-y-2.5">
          <h3 className="font-display text-sm font-semibold text-[#FFF0BE]">
            {isOrg
              ? 'Subtexto e incentivos reales del sistema'
              : 'Incentivo implícito o beneficio oculto de no mover nada'}
          </h3>
          <p className="text-xs text-[#C4BCAD]">
            ¿Qué incomodidad evita hoy el patrón actual o qué premia implícitamente el entorno?
          </p>
          <textarea
            rows={3}
            value={profile.hiddenIncentives}
            onChange={(e) => onChange({ ...profile, hiddenIncentives: e.target.value })}
            placeholder={
              isOrg
                ? 'Ej: Escalar todo hacia dirección protege al líder de cualquier reproche...'
                : 'Ej: Seguir editando documentos en privado evita exponerse a un rechazo comercial directo...'
            }
            className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* Listas de Supuestos e Incertidumbres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supuestos */}
        <div className="p-6 rounded-2xl chalamandra-surface space-y-3.5">
          <h3 className="font-display text-sm font-semibold text-[#FAF6ED]">
            Supuestos asumidos sin prueba completa
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAssumption}
              onChange={(e) => setNewAssumption(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addAssumption()}
              placeholder="Añadir supuesto a contrastar..."
              className="flex-1 px-3.5 py-2 rounded-xl chalamandra-input text-xs"
            />
            <button
              type="button"
              onClick={addAssumption}
              className="px-3.5 py-2 rounded-xl chalamandra-btn-secondary text-xs font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#ECC964]" />
              <span>Añadir</span>
            </button>
          </div>
          <div className="space-y-2">
            {profile.underlyingAssumptions.map((assump, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl chalamandra-chamber text-xs text-[#DDD6C7] gap-2"
              >
                <span>{assump}</span>
                <button
                  type="button"
                  onClick={() => removeAssumption(idx)}
                  className="text-[#B8B0A0] hover:text-rose-300 p-1 cursor-pointer shrink-0"
                  aria-label="Eliminar supuesto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Incertidumbres */}
        <div className="p-6 rounded-2xl chalamandra-surface-cyan space-y-3.5">
          <h3 className="font-display text-sm font-semibold text-cyan-200 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-cyan-300" />
            <span>Incertidumbres abiertas (lo que aún desconoces)</span>
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newUncertainty}
              onChange={(e) => setNewUncertainty(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addUncertainty()}
              placeholder="Ej: ¿Qué objeción real aparecerá al presentar precio?"
              className="flex-1 px-3.5 py-2 rounded-xl chalamandra-input text-xs"
            />
            <button
              type="button"
              onClick={addUncertainty}
              className="px-3.5 py-2 rounded-xl chalamandra-btn-secondary text-xs font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#ECC964]" />
              <span>Añadir</span>
            </button>
          </div>
          <div className="space-y-2">
            {uncertainties.map((unc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl chalamandra-chamber text-xs text-[#DDD6C7] gap-2"
              >
                <span>{unc}</span>
                <button
                  type="button"
                  onClick={() => removeUncertainty(idx)}
                  className="text-[#B8B0A0] hover:text-rose-300 p-1 cursor-pointer shrink-0"
                  aria-label="Eliminar incertidumbre"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restricciones reales vs autoimpuestas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl chalamandra-surface-emerald space-y-3.5">
          <h3 className="font-display text-sm font-semibold text-emerald-200">
            Restricciones reales verificadas (hechos duros)
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newRealConstraint}
              onChange={(e) => setNewRealConstraint(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRealConstraint()}
              placeholder="Ej: Margen mínimo >= 45% / 6h semanales disponibles..."
              className="flex-1 px-3.5 py-2 rounded-xl chalamandra-input text-xs"
            />
            <button
              type="button"
              onClick={addRealConstraint}
              className="px-3 py-2 rounded-xl chalamandra-btn-secondary text-xs cursor-pointer shrink-0"
              aria-label="Añadir restricción real"
            >
              <Plus className="w-4 h-4 text-[#ECC964]" />
            </button>
          </div>
          <div className="space-y-2">
            {profile.realConstraints.map((rc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl chalamandra-chamber text-xs text-[#DDD6C7] gap-2"
              >
                <span>{rc}</span>
                <button
                  type="button"
                  onClick={() => removeRealConstraint(idx)}
                  className="text-[#B8B0A0] hover:text-rose-300 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl chalamandra-surface space-y-3.5">
          <h3 className="font-display text-sm font-semibold text-[#FFF0BE]">
            Restricciones autoimpuestas o hábitos modificables
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newArtificialConstraint}
              onChange={(e) => setNewArtificialConstraint(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addArtificialConstraint()}
              placeholder="Ej: Revisar personalmente propuestas estándar..."
              className="flex-1 px-3.5 py-2 rounded-xl chalamandra-input text-xs"
            />
            <button
              type="button"
              onClick={addArtificialConstraint}
              className="px-3 py-2 rounded-xl chalamandra-btn-secondary text-xs cursor-pointer shrink-0"
              aria-label="Añadir restricción autoimpuesta"
            >
              <Plus className="w-4 h-4 text-[#ECC964]" />
            </button>
          </div>
          <div className="space-y-2">
            {profile.artificialConstraints.map((ac, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl chalamandra-chamber text-xs text-[#DDD6C7] gap-2"
              >
                <span>{ac}</span>
                <button
                  type="button"
                  onClick={() => removeArtificialConstraint(idx)}
                  className="text-[#B8B0A0] hover:text-rose-300 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Relación fundamentada con los Siete Poderes de Interactive */}
      <section className="p-6 rounded-2xl chalamandra-surface space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-display text-sm sm:text-base font-semibold text-[#FFF0BE]">
            Relación fundamentada con los Siete Poderes de Interactive
          </h3>
          <span className="text-[11px] font-mono text-[#ECC964]">
            Solo se muestran cuando tus respuestas aportan fundamento
          </span>
        </div>

        {groundedPowers.length === 0 ? (
          <p className="text-xs text-[#C4BCAD] leading-relaxed">
            Aún no hay suficientes señales específicas registradas para vincular poderes con fundamento. Al detallar el relato dominante, los intentos previos o las restricciones, aquí aparecerán únicamente las conexiones justificadas.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {groundedPowers.map(({ poder, foundation }) => (
              <div
                key={poder.id}
                className="p-4 rounded-xl chalamandra-chamber space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-xs font-semibold text-[#FFF0BE]">
                    {poder.title}
                  </span>
                  <span className="text-[11px] font-mono text-[#ECC964]">{poder.proposito}</span>
                </div>
                <p className="text-[11px] text-[#DDD6C7] leading-relaxed">{foundation}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Hipótesis de Trabajo */}
      <section className="p-6 rounded-2xl chalamandra-surface-elevated space-y-2.5">
        <label className="block font-display text-sm sm:text-base font-semibold text-[#FFF0BE]">
          Hipótesis de trabajo inicial (revisable con evidencia)
        </label>
        <p className="text-xs text-[#DDD6C7]">
          Formula la relación que pondrás a prueba: qué cambio puntual crees que destrabará la fricción y cómo lo verificarás.
        </p>
        <textarea
          rows={3}
          value={profile.strategicHypothesis}
          onChange={(e) => onChange({ ...profile, strategicHypothesis: e.target.value })}
          placeholder="Si cambio [condición o encuadre concreto] respetando [restricción real], entonces debería observarse [señal verificable]..."
          className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
        />
      </section>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-3 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Volver a Fase 01 · Explorar</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl chalamandra-btn-primary font-bold text-xs cursor-pointer whitespace-nowrap"
        >
          <span>Continuar a Fase 03 · Aplicar un Hack</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
