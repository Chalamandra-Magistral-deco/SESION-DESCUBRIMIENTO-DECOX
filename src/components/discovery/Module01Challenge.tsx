import React, { useState } from 'react';
import {
  Target,
  Building2,
  User,
  ArrowRight,
  AlertTriangle,
  GitBranch
} from 'lucide-react';
import {
  ChallengeData,
  ExplorationFocusType,
  DiscoveryTrackType,
  PowerLensDomain
} from '../../types';
import {
  DISCOVERY_TRACK_OPTIONS,
  EXPLORATION_FOCUS_OPTIONS,
  STEP1_CONDITIONAL_QUESTIONS
} from '../../data/discoveryFlowConfig';
import {
  POWER_LENS_DOMAINS,
  inferDomainFromCategory
} from '../../data/interactiveCatalog';

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
  const activeDomain: PowerLensDomain =
    challenge.domain || inferDomainFromCategory(challenge.category);

  const activeConditionals = STEP1_CONDITIONAL_QUESTIONS.filter((q) =>
    q.shouldDisplay({ ...challenge, track: activeTrack, explorationFocus: activeFocus })
  );

  const handleTrackChange = (newTrack: DiscoveryTrackType) => {
    onChange({
      ...challenge,
      track: newTrack
    });
  };

  const handleCategoryChange = (cat: ChallengeData['category']) => {
    onChange({
      ...challenge,
      category: cat,
      domain: challenge.domain || inferDomainFromCategory(cat)
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
    const hasProblem =
      Boolean(challenge.currentSituation.trim()) || Boolean(challenge.criticalFriction.trim());
    const hasObjective = Boolean(challenge.expectedOutcome.trim());

    if (!hasProblem || !hasObjective) {
      setValidationNotice(
        'Para avanzar a Decodificar, describe al menos qué objetivo buscas alcanzar y cuál es el problema o fricción actual.'
      );
      return;
    }
    setValidationNotice(null);
    onNext();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado de Fase 1 */}
      <div className="border-b border-[#D4AF37]/35 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#ECC964] text-xs font-mono font-semibold tabular-nums">
            <Target className="w-4 h-4 text-[#ECC964]" />
            <span>Fase 01 de 05 · Explorar</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#FAF6ED] tracking-tight text-balance">
            {isOrg
              ? 'Explorar el objetivo, la fricción y el sistema actual'
              : 'Explorar tu objetivo, tu fricción actual y lo intentado'}
          </h2>
          <p className="text-xs sm:text-sm text-[#D6CFC2] max-w-2xl leading-relaxed">
            Registra con hechos concretos qué quieres lograr, qué frena hoy el avance, qué ya intentaste con su resultado y bajo qué restricciones reales operas.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl chalamandra-chamber text-xs font-mono sm:text-right shrink-0">
          <span className="block text-[#B8B0A0]">Recorrido activo</span>
          <span className="font-semibold text-[#FFF0BE]">
            {isOrg ? 'Organizaciones' : 'Personas'} · Dominio {activeDomain}
          </span>
        </div>
      </div>

      {/* Bloque 1: Contexto base (Recorrido, Tipo de caso y Dominio Interactive) */}
      <section className="p-6 sm:p-7 rounded-2xl chalamandra-surface space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {DISCOVERY_TRACK_OPTIONS.map((tOpt) => {
            const selected = activeTrack === tOpt.value;
            const Icon = tOpt.value === 'organizacion' ? Building2 : User;
            return (
              <button
                key={tOpt.value}
                type="button"
                onClick={() => handleTrackChange(tOpt.value)}
                className={`p-4 rounded-xl text-left cursor-pointer space-y-1.5 ${
                  selected ? 'chalamandra-selector-active' : 'chalamandra-selector'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-display font-semibold text-[#FAF6ED]">
                    <Icon className={`w-4 h-4 ${selected ? 'text-[#FFF0BE]' : 'text-[#ECC964]'}`} />
                    {tOpt.title}
                  </span>
                  <span className="text-[11px] font-mono text-[#FFF0BE]">
                    {selected ? '✓ Activo' : 'Elegir'}
                  </span>
                </div>
                <p className="text-xs text-[#D6CFC2] leading-relaxed">{tOpt.subtitle}</p>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-semibold text-[#F6DF96]">
            Naturaleza de lo que vas a trabajar hoy
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXPLORATION_FOCUS_OPTIONS.map((opt) => {
              const isSelected = activeFocus === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ ...challenge, explorationFocus: opt.value })}
                  className={`p-3.5 rounded-xl text-left cursor-pointer space-y-1 ${
                    isSelected ? 'chalamandra-selector-active' : 'chalamandra-selector'
                  }`}
                >
                  <span className="text-xs font-bold block text-[#FAF6ED]">{opt.title}</span>
                  <p className="text-[11px] text-[#D6CFC2] leading-snug">{opt.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#D4AF37]/25">
          <div>
            <label className="block text-xs font-semibold text-[#F6DF96] mb-1.5">
              {isOrg ? 'Responsable de la sesión (opcional)' : 'Tu nombre o identificador (opcional)'}
            </label>
            <input
              type="text"
              value={challenge.clientName}
              onChange={(e) => onChange({ ...challenge, clientName: e.target.value })}
              placeholder={isOrg ? 'Ej: Dirección Operaciones' : 'Ej: Ana Morales'}
              className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F6DF96] mb-1.5">
              {isOrg ? 'Organización / equipo y tamaño' : 'Rol, proyecto o actividad'}
            </label>
            <input
              type="text"
              value={challenge.companyOrRole}
              onChange={(e) => onChange({ ...challenge, companyOrRole: e.target.value })}
              placeholder={
                isOrg ? 'Ej: Firma B2B · 18 personas' : 'Ej: Consultora independiente'
              }
              className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F6DF96] mb-1.5">
              Dominio del caso (conectado a Lentes de Poder)
            </label>
            <select
              value={activeDomain}
              onChange={(e) =>
                onChange({ ...challenge, domain: e.target.value as PowerLensDomain })
              }
              className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs"
            >
              {POWER_LENS_DOMAINS.map((dom) => (
                <option key={dom} value={dom} className="bg-[#0D0C13] text-[#FAF6ED]">
                  {dom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#F6DF96] mb-1.5">
              Ámbito operativo principal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-2.5 rounded-xl text-xs text-left cursor-pointer ${
                    challenge.category === cat
                      ? 'chalamandra-selector-active font-semibold'
                      : 'chalamandra-selector'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F6DF96] mb-1.5">
              Horizonte de referencia
            </label>
            <input
              type="text"
              value={challenge.timeframe}
              onChange={(e) => onChange({ ...challenge, timeframe: e.target.value })}
              placeholder="Ej: Próximos 30 días"
              className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs"
            />
          </div>
        </div>
      </section>

      {/* Bloque 2: Las 4 dimensiones obligatorias de EXPLORAR */}
      <section className="p-6 sm:p-8 rounded-2xl chalamandra-surface-elevated space-y-6">
        <div>
          <label className="block font-display text-sm font-semibold text-[#FFF0BE] mb-1.5">
            Enunciado breve del caso
          </label>
          <input
            type="text"
            value={challenge.title}
            onChange={(e) => {
              if (validationNotice) setValidationNotice(null);
              onChange({ ...challenge, title: e.target.value });
            }}
            placeholder={
              isOrg
                ? 'Ej: Destrabar cotizaciones retenidas en dirección sin perder margen'
                : 'Ej: Validar un diagnóstico propio pagado sin comprometer mi trabajo actual'
            }
            className="w-full px-4 py-3 rounded-xl chalamandra-input text-sm font-medium"
          />
        </div>

        {/* 1. Objetivo y cambio deseado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#FAF6ED]">
              <span className="font-mono text-[#ECC964] mr-1.5">01.</span>
              Objetivo que quieres alcanzar y cambio deseado
            </label>
            <p className="text-xs text-[#C4BCAD]">
              ¿Qué resultado concreto quieres ver operando al final del horizonte elegido?
            </p>
            <textarea
              rows={3}
              value={challenge.expectedOutcome}
              onChange={(e) => {
                if (validationNotice) setValidationNotice(null);
                onChange({ ...challenge, expectedOutcome: e.target.value });
              }}
              placeholder={
                isOrg
                  ? 'Ej: Que el 70% de las propuestas estándar salgan aprobadas por los líderes manteniendo >= 45% de margen...'
                  : 'Ej: Cerrar y entregar los primeros 3 diagnósticos pagados dedicando <= 6 horas por semana...'
              }
              className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#FAF6ED]">
              <span className="font-mono text-cyan-300 mr-1.5">Señal ·</span>
              Indicador observable de avance (¿cómo sabrás que funcionó?)
            </label>
            <p className="text-xs text-[#C4BCAD]">
              Define un hecho o indicador verificable para evaluar el cambio sin autoengaño.
            </p>
            <textarea
              rows={3}
              value={challenge.primaryMetric}
              onChange={(e) => onChange({ ...challenge, primaryMetric: e.target.value })}
              placeholder={
                isOrg
                  ? 'Ej: Reducir demora comercial de 48h a menos de 6h sin bajar del 45% de margen.'
                  : 'Ej: 3 propuestas pagadas aceptadas en 30 días dentro de 6h semanales.'
              }
              className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* 2. Problema o fricción actual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#FAF6ED]">
              <span className="font-mono text-[#ECC964] mr-1.5">02.</span>
              Situación actual (hechos observables hoy)
            </label>
            <p className="text-xs text-[#C4BCAD]">
              Describe qué ocurre hoy con datos concretos (tiempos, volumen, frecuencia), sin etiquetas.
            </p>
            <textarea
              rows={4}
              value={challenge.currentSituation}
              onChange={(e) => {
                if (validationNotice) setValidationNotice(null);
                onChange({ ...challenge, currentSituation: e.target.value });
              }}
              placeholder={
                isOrg
                  ? 'Ej: El 85% de las cotizaciones pasa por Dirección General y tarda de 48 a 72 horas en responderse...'
                  : 'Ej: Dedico 6h semanales a preparar mi oferta propia desde hace 6 semanas, pero he enviado 0 propuestas...'
              }
              className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#FAF6ED]">
              <span className="font-mono text-amber-300 mr-1.5">Fricción ·</span>
              Problema específico que bloquea el avance
            </label>
            <p className="text-xs text-[#C4BCAD]">
              ¿Dónde exactamente se frena la decisión, la entrega o la coordinación?
            </p>
            <textarea
              rows={4}
              value={challenge.criticalFriction}
              onChange={(e) => {
                if (validationNotice) setValidationNotice(null);
                onChange({ ...challenge, criticalFriction: e.target.value });
              }}
              placeholder={
                isOrg
                  ? 'Ej: Los líderes escalan hasta ajustes menores por temor a equivocarse sin un criterio escrito de respaldo...'
                  : 'Ej: Sigo rehaciendo el documento de presentación en lugar de presentar alcance y precio a contactos reales...'
              }
              className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* 3. Qué ha intentado y con qué resultado + 4. Restricciones relevantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#FAF6ED]">
              <span className="font-mono text-[#ECC964] mr-1.5">03.</span>
              Qué has intentado hasta ahora y con qué resultado
            </label>
            <p className="text-xs text-[#C4BCAD]">
              Anota soluciones o esfuerzos previos y qué ocurrió realmente al probarlos.
            </p>
            <textarea
              rows={4}
              value={challenge.previousAttempts || ''}
              onChange={(e) => onChange({ ...challenge, previousAttempts: e.target.value })}
              placeholder={
                isOrg
                  ? 'Ej: Pedimos mayor autonomía en dos reuniones mensuales, pero a las dos semanas volvieron las consultas constantes por chat...'
                  : 'Ej: Reescribí 4 veces el documento y di 3 llamadas gratuitas sin encuadre comercial; agradecieron, pero nadie contrató...'
              }
              className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#FAF6ED]">
              <span className="font-mono text-emerald-300 mr-1.5">04.</span>
              Restricciones relevantes a respetar
            </label>
            <p className="text-xs text-[#C4BCAD]">
              Tiempo disponible, presupuesto, acuerdos o límites no negociables del contexto actual.
            </p>
            <textarea
              rows={4}
              value={challenge.constraintsSummary || ''}
              onChange={(e) => onChange({ ...challenge, constraintsSummary: e.target.value })}
              placeholder={
                isOrg
                  ? 'Ej: Sin presupuesto para nuevas contrataciones este trimestre y margen bruto mínimo obligatorio del 45%...'
                  : 'Ej: Máximo 6 horas semanales disponibles fuera del trabajo actual y cero presupuesto publicitario...'
              }
              className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-[#D4AF37]/25">
          <label className="block text-xs font-semibold text-[#F6DF96]">
            {isOrg
              ? 'Actores clave e incentivos en juego'
              : 'Personas o interlocutores involucrados (opcional)'}
          </label>
          <textarea
            rows={2}
            value={challenge.keyActorsAndIncentives || ''}
            onChange={(e) =>
              onChange({ ...challenge, keyActorsAndIncentives: e.target.value })
            }
            placeholder={
              isOrg
                ? 'Ej: Dirección General, 6 líderes técnicos y clientes B2B que esperan cotización rápida...'
                : 'Ej: Red de exclientes y contactos directos con cuellos de botella técnicos urgentes...'
            }
            className="w-full px-4 py-2.5 rounded-xl chalamandra-input text-xs leading-relaxed"
          />
        </div>
      </section>

      {/* Bloque 3: Preguntas adaptativas según foco/recorrido */}
      {activeConditionals.length > 0 && (
        <section className="p-6 sm:p-7 rounded-2xl chalamandra-surface-cyan space-y-4">
          <div className="flex items-start gap-2.5">
            <GitBranch className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display text-sm font-semibold text-[#FFF0BE]">
                Preguntas adaptativas para {activeFocus}
              </h3>
              <p className="text-xs text-[#D6CFC2] mt-0.5">
                Afinan las evidencias e incertidumbres que utilizarás en la Fase 02 (Decodificar).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeConditionals.map((q) => (
              <div key={q.id} className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#FAF6ED]">
                  {q.label}
                </label>
                <p className="text-[11px] text-[#C4BCAD]">{q.helperText}</p>
                <textarea
                  rows={3}
                  value={challenge.conditionalAnswers?.[q.id] || ''}
                  onChange={(e) => handleConditionalChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs leading-relaxed"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {validationNotice && (
        <div
          role="alert"
          className="p-4 rounded-xl chalamandra-surface-rose text-xs text-rose-100 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
          <span>{validationNotice}</span>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleAdvance}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl chalamandra-btn-primary font-bold text-xs cursor-pointer whitespace-nowrap"
        >
          <span>Continuar a Fase 02 · Decodificar</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
