import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  Building2,
  User,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  Users
} from 'lucide-react';
import { ChallengeData, ExplorationFocusType, DiscoveryTrackType } from '../../types';
import {
  DISCOVERY_TRACK_OPTIONS,
  EXPLORATION_FOCUS_OPTIONS,
  STEP1_CONDITIONAL_QUESTIONS
} from '../../data/discoveryFlowConfig';

interface Module01ChallengeProps {
  challenge: ChallengeData;
  onChange: (updated: ChallengeData) => void;
  onNext: () => void;
}

export default function Module01Challenge({
  challenge,
  onChange,
  onNext
}: Module01ChallengeProps) {
  const [validationNotice, setValidationNotice] = useState<string | null>(null);

  const categories: ChallengeData['category'][] = [
    'Escala de Negocio',
    'Liderazgo & Dirección',
    'Foco & Sobrecarga',
    'Disrupción e Innovación'
  ];

  const activeTrack: DiscoveryTrackType = challenge.track || 'persona';
  const isOrg = activeTrack === 'organizacion';
  const activeFocus: ExplorationFocusType = challenge.explorationFocus || 'Problema o bloqueo';
  const activeConditionals = STEP1_CONDITIONAL_QUESTIONS.filter((q) =>
    q.shouldDisplay({ ...challenge, track: activeTrack, explorationFocus: activeFocus })
  );

  const handleTrackChange = (newTrack: DiscoveryTrackType) => {
    onChange({
      ...challenge,
      track: newTrack
    });
  };

  const handleConditionalChange = (id: string, value: string) => {
    onChange({
      ...challenge,
      conditionalAnswers: {
        ...(challenge.conditionalAnswers || {}),
        [id]: value
      }
    });
  };

  const handleAdvance = () => {
    if (!challenge.currentSituation.trim() && !challenge.criticalFriction.trim()) {
      setValidationNotice(
        'Registra al menos los hechos observables de tu situación actual o el nodo de fricción principal para continuar con una base real.'
      );
      return;
    }
    setValidationNotice(null);
    onNext();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Heading */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-2 tabular-nums">
            <Target className="w-3.5 h-3.5" />
            <span>Paso 01 de 13 · Encuadre Inicial y Exploración</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            {isOrg
              ? 'Contexto del Sistema de Trabajo, Actores y Desafío'
              : 'Contexto de tu Problema, Idea o Proyecto'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {isOrg
              ? 'Describe los hechos observables del sistema organizacional, quiénes intervienen y dónde se bloquea hoy la coordinación o ejecución.'
              : 'Describe los hechos observables de tu situación personal o profesional sin adornos ni suposiciones para activar los 7 hacks adaptativos.'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 self-start sm:self-auto">
          {isOrg ? (
            <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <User className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div className="text-xs">
            <span className="text-slate-400 block font-mono">Recorrido Activo</span>
            <span className="font-bold text-slate-200">
              {isOrg ? 'Organizaciones · Sistema y Actores' : 'Personas · Proyectos y Decisiones'}
            </span>
          </div>
        </div>
      </div>

      {/* 0. Dual Track Selector (Personas vs Organizaciones) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/25 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            1. Recorrido Metodológico (Personas vs. Organizaciones)
          </h3>
          <span className="text-[11px] font-mono text-amber-400">
            Adapta preguntas, ejemplos, hacks y síntesis final
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {DISCOVERY_TRACK_OPTIONS.map((tOpt) => {
            const selected = activeTrack === tOpt.value;
            const Icon = tOpt.value === 'organizacion' ? Building2 : User;
            return (
              <button
                key={tOpt.value}
                type="button"
                onClick={() => handleTrackChange(tOpt.value)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  selected
                    ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-100">
                    <Icon className={`w-4 h-4 ${selected ? 'text-amber-400' : 'text-slate-400'}`} />
                    {tOpt.title}
                  </span>
                  <span className="text-[11px] font-mono text-amber-400">
                    {selected ? 'Seleccionado' : 'Cambiar'}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-300">{tOpt.subtitle}</p>
                <p className="text-[11px] text-slate-400 leading-snug">{tOpt.focusSummary}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Exploration Focus Selector (Interactive Conditional Trigger) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            2. ¿Qué tipo de desafío vas a explorar hoy?
          </h3>
          <span className="text-[11px] font-mono text-cyan-400">
            Dispara preguntas condicionales específicas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXPLORATION_FOCUS_OPTIONS.map((opt) => {
            const isSelected = activeFocus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...challenge, explorationFocus: opt.value })}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold block text-slate-100">{opt.title}</span>
                <p className="text-[11px] text-slate-400 leading-snug">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Participant & Domain */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            3. {isOrg ? 'Responsable y Unidad / Organización' : 'Titular y Contexto Profesional'}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                {isOrg ? 'Nombre de quien lidera la exploración' : 'Tu Nombre o Identificador'}
              </label>
              <input
                type="text"
                value={challenge.clientName}
                onChange={(e) => onChange({ ...challenge, clientName: e.target.value })}
                placeholder={isOrg ? 'Ej: Carlos Méndez' : 'Ej: Ana Morales'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                {isOrg
                  ? 'Organización, Área y Tamaño del Sistema'
                  : 'Proyecto, Actividad o Rol Actual'}
              </label>
              <input
                type="text"
                value={challenge.companyOrRole}
                onChange={(e) => onChange({ ...challenge, companyOrRole: e.target.value })}
                placeholder={
                  isOrg
                    ? 'Ej: Dirección de Operaciones · Empresa B2B (25 personas)'
                    : 'Ej: Consultoría Independiente / Nuevo Producto Digital'
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            4. Ámbito Principal y Horizonte
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ ...challenge, category: cat })}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                  challenge.category === cat
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>

          <div className="pt-1">
            <label className="block text-xs text-slate-400 mb-1">Horizonte Temporal</label>
            <input
              type="text"
              value={challenge.timeframe}
              onChange={(e) => onChange({ ...challenge, timeframe: e.target.value })}
              placeholder="Ej: Próximos 14 días / Próximos 30 días"
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Core Factual Inputs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
            5. Enunciado Breve del Desafío a Decodificar
          </label>
          <input
            type="text"
            value={challenge.title}
            onChange={(e) => onChange({ ...challenge, title: e.target.value })}
            placeholder={
              isOrg
                ? 'Ej: Destrabar aprobaciones entre comercial y operaciones sin perder margen'
                : 'Ej: Validar oferta de diagnóstico propio sin comprometer mis ingresos actuales'
            }
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hechos Observados Hoy (Sin adjetivos ni suposiciones)</span>
            </label>
            <textarea
              rows={4}
              value={challenge.currentSituation}
              onChange={(e) => {
                if (validationNotice) setValidationNotice(null);
                onChange({ ...challenge, currentSituation: e.target.value });
              }}
              placeholder={
                isOrg
                  ? 'Describe hechos verificables del sistema de trabajo: tiempos de ciclo, volumen de retrabajo, pasos actuales...'
                  : 'Describe hechos concretos hoy: horas reales dedicadas, resultados medidos, acciones ejecutadas...'
              }
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Nodo Crítico de Fricción (¿Dónde se detiene el sistema?)</span>
            </label>
            <textarea
              rows={4}
              value={challenge.criticalFriction}
              onChange={(e) => {
                if (validationNotice) setValidationNotice(null);
                onChange({ ...challenge, criticalFriction: e.target.value });
              }}
              placeholder={
                isOrg
                  ? 'Especifica en qué interacción, regla o escalamiento se estanca la ejecución...'
                  : 'Especifica el bloqueo exacto que hoy frena tu decisión o el avance del proyecto...'
              }
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Actors & Incentives Context (Critical for Organizaciones, helpful for Personas) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {isOrg
                ? 'Mapa de Actores Clave e Incentivos Actuales del Sistema'
                : 'Personas, Clientes o Interlocutores Involucrados (Opcional)'}
            </span>
          </label>
          <textarea
            rows={2}
            value={challenge.keyActorsAndIncentives || ''}
            onChange={(e) =>
              onChange({ ...challenge, keyActorsAndIncentives: e.target.value })
            }
            placeholder={
              isOrg
                ? 'Ej: Dirección (busca cuidar margen), Líderes de área (prefieren escalar dudas para evitar errores), Clientes (exigen respuesta rápida)...'
                : 'Ej: Clientes potenciales de mi red, socio técnico o entorno familiar/laboral que influye en mi agenda...'
            }
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Resultado Esperado en el Mundo Real</span>
            </label>
            <textarea
              rows={3}
              value={challenge.expectedOutcome}
              onChange={(e) => onChange({ ...challenge, expectedOutcome: e.target.value })}
              placeholder="¿Qué cambio observable y defendible quieres tener operando al cierre del horizonte?"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Criterio Medible de Decisión (Dato Observado)</span>
            </label>
            <textarea
              rows={3}
              value={challenge.primaryMetric}
              onChange={(e) => onChange({ ...challenge, primaryMetric: e.target.value })}
              placeholder={
                isOrg
                  ? 'Ej: Reducir ciclo de cotización de 48h a 6h manteniendo margen >= 45%'
                  : 'Ej: Cerrar 3 diagnósticos pagados dedicando <= 6 horas semanales'
              }
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Dynamic Conditional Questions Block */}
      {activeConditionals.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-cyan-500/30 space-y-5">
          <div className="flex items-start gap-3">
            <GitBranch className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                Preguntas Adaptativas · {isOrg ? 'Organizaciones' : 'Personas'} · {activeFocus}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Estas preguntas se ajustan a tu recorrido y alimentan directamente la separación entre hechos, hipótesis y posibilidades imaginadas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeConditionals.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="block text-xs font-bold text-slate-200 leading-snug">
                  {q.label}
                </label>
                <p className="text-[11px] text-slate-400 leading-snug">{q.helperText}</p>
                <textarea
                  rows={3}
                  value={challenge.conditionalAnswers?.[q.id] || ''}
                  onChange={(e) => handleConditionalChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {validationNotice && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/35 text-xs text-rose-200 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{validationNotice}</span>
        </div>
      )}

      {/* Navigation CTA */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleAdvance}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span>Guardar Contexto y Pasar a Calibración Epistémica</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

