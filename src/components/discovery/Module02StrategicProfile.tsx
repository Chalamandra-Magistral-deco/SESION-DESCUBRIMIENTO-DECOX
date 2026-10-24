import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ShieldAlert,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  HelpCircle,
  GitBranch
} from 'lucide-react';
import { StrategicProfileData, ChallengeData } from '../../types';
import {
  EVIDENCE_LEVEL_OPTIONS,
  DEPENDENCY_SCOPE_OPTIONS,
  URGENCY_LEVEL_OPTIONS,
  STEP2_CONDITIONAL_QUESTIONS
} from '../../data/discoveryFlowConfig';

interface Module02StrategicProfileProps {
  profile: StrategicProfileData;
  challenge: ChallengeData;
  onChange: (updated: StrategicProfileData) => void;
  onPrev: () => void;
  onNext: () => void;
}

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

  const uncertainties = profile.uncertainties || [];
  const activeConditionals = STEP2_CONDITIONAL_QUESTIONS.filter((q) =>
    q.shouldDisplay(challenge, profile)
  );

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

  const isOrg = challenge.track === 'organizacion';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Heading */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono mb-2 tabular-nums">
            <Compass className="w-3.5 h-3.5" />
            <span>
              Paso 02 de 13 · Epistemología del Caso ({isOrg ? 'Recorrido Organizaciones' : 'Recorrido Personas'})
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Hechos, Hipótesis, Reglas e Incertidumbres
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {isOrg
              ? 'Distingue las reglas formales e incentivos reales del sistema (hechos e hipótesis) de las costumbres heredadas modificables y los vacíos de evidencia.'
              : 'Separa los hechos observables de tus hipótesis aún no probadas, de las barreras autoimpuestas y de lo que todavía desconoces.'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 self-start sm:self-auto">
          <Lightbulb className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400 block font-mono">Disciplina Epistémica</span>
            <span className="font-bold text-slate-200">Correlación ≠ Causalidad Probada</span>
          </div>
        </div>
      </div>

      {/* 1. Interactive Calibration Controls (Triggers Conditional Questions) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/25 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evidence Level */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              1. Nivel de Evidencia Actual
            </span>
            <div className="space-y-2">
              {EVIDENCE_LEVEL_OPTIONS.map((opt) => {
                const active = (profile.evidenceLevel || 'Señales parciales') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...profile, evidenceLevel: opt.value })}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-100">{opt.title}</span>
                    <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dependency Scope */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              2. Alcance de Dependencia
            </span>
            <div className="space-y-2">
              {DEPENDENCY_SCOPE_OPTIONS.map((opt) => {
                const active = (profile.dependencyScope || 'Equipo o socios internos') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...profile, dependencyScope: opt.value })}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-purple-500/15 border-purple-500/50 text-purple-300'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-100">{opt.title}</span>
                    <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urgency Level */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              3. Ventana de Urgencia
            </span>
            <div className="space-y-2">
              {URGENCY_LEVEL_OPTIONS.map((opt) => {
                const active = (profile.urgencyLevel || 'Táctica (7–14 días)') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...profile, urgencyLevel: opt.value })}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conditional Questions triggered by Evidence Level or Dependency Scope */}
        {activeConditionals.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <GitBranch className="w-4 h-4" />
              <span>Preguntas condicionales activadas según tu calibración</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeConditionals.map((q) => (
                <div key={q.id} className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200 leading-snug">
                    {q.label}
                  </label>
                  <p className="text-[11px] text-slate-400">{q.helperText}</p>
                  <textarea
                    rows={3}
                    value={profile.conditionalProfileAnswers?.[q.id] || ''}
                    onChange={(e) => handleConditionalAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dominant Pattern & Hidden Incentives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>
              {isOrg
                ? 'Relato Interno Dominante del Sistema (Base 01. Scheherazade)'
                : 'Historia o Patrón Dominante Actual (Base 01. Scheherazade)'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isOrg
              ? 'La explicación que hoy repite la organización sobre por qué ocurre el bloqueo.'
              : 'La historia que hoy te cuentas o cuentas a otros sobre tu problema o idea.'}
          </p>
          <textarea
            rows={4}
            value={profile.dominantThoughtPattern}
            onChange={(e) => onChange({ ...profile, dominantThoughtPattern: e.target.value })}
            placeholder={
              isOrg
                ? "Ej: 'Aquí ninguna iniciativa avanza si no pasa primero por tres comités...'"
                : "Ej: 'Hasta no tener todo el sistema terminado no puedo mostrar ni validar el valor real...'"
            }
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>
              {isOrg
                ? 'Reglas Declaradas vs. Incentivos Reales (Base 04. Hacker)'
                : 'Incentivos Reales que Mantienen el Bloqueo (Base 04. Hacker)'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isOrg
              ? '¿Qué premia o penaliza realmente el sistema más allá del discurso oficial?'
              : '¿Qué comodidad inmediata, hábito o incentivo indirecto sostiene hoy el statu quo?'}
          </p>
          <textarea
            rows={4}
            value={profile.hiddenIncentives}
            onChange={(e) => onChange({ ...profile, hiddenIncentives: e.target.value })}
            placeholder={
              isOrg
                ? 'Ej: El discurso pide agilidad, pero los incentivos reales premian cero errores visibles...'
                : 'Ej: Seguir puliendo en privado evita exponerse a un rechazo o ajuste temprano...'
            }
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Assumptions & Uncertainties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assumptions (Hypotheses) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            Hipótesis y Supuestos No Verificados
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ideas o correlaciones aparentes que hoy asumes sin haber comprobado causalidad directa.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAssumption}
              onChange={(e) => setNewAssumption(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addAssumption()}
              placeholder="Añadir supuesto..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={addAssumption}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Añadir</span>
            </button>
          </div>

          <div className="space-y-2">
            {profile.underlyingAssumptions.map((assump, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 gap-2"
              >
                <span>{assump}</span>
                <button
                  type="button"
                  onClick={() => removeAssumption(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Explicit Uncertainties */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/25 space-y-4">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Incertidumbres Abiertas (¿Qué no sabes aún?)</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Incógnitas reales o preguntas sin responder que requieren datos o experimentos.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newUncertainty}
              onChange={(e) => setNewUncertainty(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addUncertainty()}
              placeholder="Ej: ¿Qué tasa de conversión real tendría el formato nuevo?"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={addUncertainty}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Añadir</span>
            </button>
          </div>

          <div className="space-y-2">
            {uncertainties.map((unc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 gap-2"
              >
                <span>{unc}</span>
                <button
                  type="button"
                  onClick={() => removeUncertainty(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Constraints (Facts) vs Artificial Constraints (Interpretations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Restricciones Reales (Hechos Objetivos: Capital, Tiempo, Reglas)
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newRealConstraint}
              onChange={(e) => setNewRealConstraint(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRealConstraint()}
              placeholder="Ej: Disponibilidad real de 2 horas diarias..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="button"
              onClick={addRealConstraint}
              className="px-3 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          <div className="space-y-2">
            {profile.realConstraints.map((rc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 gap-2"
              >
                <span>{rc}</span>
                <button
                  type="button"
                  onClick={() => removeRealConstraint(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Restricciones Autoimpuestas (Hábitos o Reglas Modificables)
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newArtificialConstraint}
              onChange={(e) => setNewArtificialConstraint(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addArtificialConstraint()}
              placeholder="Ej: Atender interrupciones menores en tiempo real..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="button"
              onClick={addArtificialConstraint}
              className="px-3 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-400" />
            </button>
          </div>

          <div className="space-y-2">
            {profile.artificialConstraints.map((ac, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 gap-2"
              >
                <span>{ac}</span>
                <button
                  type="button"
                  onClick={() => removeArtificialConstraint(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Hypothesis Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-purple-500/30 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Hipótesis Estratégica de Trabajo</span>
        </div>
        <textarea
          rows={3}
          value={profile.strategicHypothesis}
          onChange={(e) => onChange({ ...profile, strategicHypothesis: e.target.value })}
          placeholder="Si modifico [variable o regla concreta] en lugar de [patrón actual], entonces ocurrirá [cambio medible]..."
          className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-purple-500/30 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Nav Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Paso 01</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span>Entrar a Mundo Simulado · 01. Scheherazade</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
