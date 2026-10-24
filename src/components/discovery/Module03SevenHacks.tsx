import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import {
  ChallengeData,
  StrategicProfileData,
  PowerLensApplicationState,
  PowerLensDomain
} from '../../types';
import {
  HACKS_DATA,
  PODERES_SHEREZADE_DATA,
  POWER_LENS_DOMAINS,
  getPoderForHack,
  inferDomainFromCategory,
  buildLocalPowerLensDirective
} from '../../data/interactiveCatalog';
import { recommendSingleHackForCase } from '../../data/discoveryFlowConfig';

interface Module03SevenHacksProps {
  challenge: ChallengeData;
  profile: StrategicProfileData;
  selectedHackId: number | null;
  hackPlantillaResponses: Record<number, string[]>;
  powerLens: PowerLensApplicationState;
  onSelectHack: (hackId: number) => void;
  onUpdatePlantillaField: (hackId: number, fieldIndex: number, value: string) => void;
  onUpdatePowerLens: (updated: PowerLensApplicationState) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Module03SevenHacks({
  challenge,
  profile,
  selectedHackId,
  hackPlantillaResponses,
  powerLens,
  onSelectHack,
  onUpdatePlantillaField,
  onUpdatePowerLens,
  onPrev,
  onNext
}: Module03SevenHacksProps) {
  const recommendation = recommendSingleHackForCase(challenge, profile);
  const effectiveHackId = selectedHackId || recommendation.recommendedHack.id;
  const activeHack =
    HACKS_DATA.find((h) => h.id === effectiveHackId) || recommendation.recommendedHack;
  const linkedPower = getPoderForHack(activeHack);

  const [showHackSwitcher, setShowHackSwitcher] = useState(false);
  const [showPowerLensPanel, setShowPowerLensPanel] = useState<boolean>(
    () => Boolean(powerLens?.used)
  );
  const [lensLoading, setLensLoading] = useState(false);
  const [lensEngineNote, setLensEngineNote] = useState<string | null>(null);
  const [validationNotice, setValidationNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedHackId) {
      onSelectHack(recommendation.recommendedHack.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHackId, recommendation.recommendedHack.id]);

  useEffect(() => {
    if (!powerLens.used && linkedPower && powerLens.poderId !== linkedPower.id) {
      onUpdatePowerLens({
        ...powerLens,
        poderId: linkedPower.id,
        poderTitle: linkedPower.title,
        domain: challenge.domain || inferDomainFromCategory(challenge.category)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHack.id]);

  const currentResponses = hackPlantillaResponses[activeHack.id] || ['', '', ''];
  const isRecommendedSelection = activeHack.id === recommendation.recommendedHack.id;
  const completedFieldsCount = activeHack.plantillaMetodologica.filter(
    (_, idx) => (currentResponses[idx] || '').trim().length > 0
  ).length;

  const effectiveDomain: PowerLensDomain =
    powerLens.domain || challenge.domain || inferDomainFromCategory(challenge.category);

  const activeLensPoder =
    PODERES_SHEREZADE_DATA.find((p) => p.id === powerLens.poderId) ||
    linkedPower ||
    PODERES_SHEREZADE_DATA[0];

  const handleChooseHack = (id: number) => {
    onSelectHack(id);
    setShowHackSwitcher(false);
    setValidationNotice(null);
  };

  const handleGeneratePowerLens = async () => {
    setLensLoading(true);
    setLensEngineNote(null);

    try {
      const res = await fetch('/api/discovery/power-lens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poderTitle: activeLensPoder.title,
          domain: effectiveDomain,
          caseTitle: challenge.title,
          criticalFriction: challenge.criticalFriction || challenge.currentSituation,
          expectedOutcome: challenge.expectedOutcome
        })
      });

      const json = await res.json();
      if (res.ok && json.success && json.directive) {
        onUpdatePowerLens({
          used: true,
          poderId: activeLensPoder.id,
          poderTitle: activeLensPoder.title,
          domain: effectiveDomain,
          directive: json.directive,
          source: json.source === 'ai' ? 'ai' : 'local',
          generatedAt: new Date().toISOString()
        });
        if (json.engineNotice) {
          setLensEngineNote(json.engineNotice);
        }
      } else {
        const localDirective = buildLocalPowerLensDirective({
          poderTitle: activeLensPoder.title,
          domain: effectiveDomain,
          caseTitle: challenge.title,
          criticalFriction: challenge.criticalFriction || challenge.currentSituation,
          expectedOutcome: challenge.expectedOutcome
        });
        onUpdatePowerLens({
          used: true,
          poderId: activeLensPoder.id,
          poderTitle: activeLensPoder.title,
          domain: effectiveDomain,
          directive: localDirective,
          source: 'local',
          generatedAt: new Date().toISOString()
        });
        setLensEngineNote(
          json?.error ||
            'El motor externo no está disponible en este momento; se generó el Lente de Poder mediante el motor determinista local sobre tu caso.'
        );
      }
    } catch {
      const localDirective = buildLocalPowerLensDirective({
        poderTitle: activeLensPoder.title,
        domain: effectiveDomain,
        caseTitle: challenge.title,
        criticalFriction: challenge.criticalFriction || challenge.currentSituation,
        expectedOutcome: challenge.expectedOutcome
      });
      onUpdatePowerLens({
        used: true,
        poderId: activeLensPoder.id,
        poderTitle: activeLensPoder.title,
        domain: effectiveDomain,
        directive: localDirective,
        source: 'local',
        generatedAt: new Date().toISOString()
      });
      setLensEngineNote(
        'Lente generado localmente a partir del poder seleccionado y el dominio de tu caso.'
      );
    } finally {
      setLensLoading(false);
    }
  };

  const handleClearPowerLens = () => {
    onUpdatePowerLens({
      ...powerLens,
      used: false,
      directive: ''
    });
    setLensEngineNote(null);
  };

  const handleAdvance = () => {
    if (completedFieldsCount === 0) {
      setValidationNotice(
        `Completa al menos un campo de la plantilla metodológica de "${activeHack.title}" (idealmente los 3 pasos) para que SRAP pueda operar sobre tu aplicación real.`
      );
      return;
    }
    setValidationNotice(null);
    onNext();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado de Fase 3 */}
      <div className="border-b border-[#D4AF37]/35 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#ECC964] text-xs font-mono font-semibold tabular-nums">
            <BookOpen className="w-4 h-4 text-[#ECC964]" />
            <span>Fase 03 de 05 · Aplicar un Hack</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#FAF6ED] tracking-tight text-balance">
            Aplicar un solo Hack central de Interactive a tu caso
          </h2>
          <p className="text-xs sm:text-sm text-[#D6CFC2] max-w-2xl leading-relaxed">
            En lugar de dispersarte en siete ejercicios consecutivos, aplicamos el Hack más pertinente para tu fricción actual usando su plantilla metodológica oficial. Puedes cambiar la recomendación si prefieres otro enfoque.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl chalamandra-chamber text-xs font-mono sm:text-right shrink-0 tabular-nums">
          <span className="block text-[#B8B0A0]">Plantilla completada</span>
          <span className="font-semibold text-[#FFF0BE]">
            {completedFieldsCount} de {activeHack.plantillaMetodologica.length} campos
          </span>
        </div>
      </div>

      {/* 1. Tarjeta Maestra: Recomendación Única Fundamentada + Opción de Cambio */}
      <section className="p-6 sm:p-8 rounded-2xl chalamandra-surface-elevated space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono">
              <span className="text-[#FFF0BE] font-semibold">
                {isRecommendedSelection
                  ? 'Hack recomendado para tu caso'
                  : 'Hack elegido manualmente por ti'}
              </span>
              <span aria-hidden="true" className="text-[#D4AF37]">·</span>
              <span className="text-[#ECC964] tabular-nums">
                Catálogo Interactive #{String(activeHack.id).padStart(2, '0')}
              </span>
              <span aria-hidden="true" className="text-[#D4AF37]">·</span>
              <span className="text-[#D6CFC2]">Afinidad: {activeHack.archetype}</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#FAF6ED] tracking-wide">
              {activeHack.title}{' '}
              <span className="chalamandra-gold-text">— {activeHack.metodo}</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#DDD6C7] leading-relaxed">
              {activeHack.description}
            </p>

            <div className="p-3.5 rounded-xl chalamandra-chamber text-xs text-[#DDD6C7] leading-relaxed">
              <strong className="text-[#FFF0BE] font-semibold">
                Justificación frente a tu caso:{' '}
              </strong>
              {isRecommendedSelection
                ? recommendation.justification
                : `Seleccionaste manualmente "${activeHack.title}" (${activeHack.metodo}). La recomendación automática inicial para tus respuestas era "${recommendation.recommendedHack.title}".`}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {!isRecommendedSelection && (
              <button
                type="button"
                onClick={() => handleChooseHack(recommendation.recommendedHack.id)}
                className="px-3.5 py-2 rounded-xl chalamandra-selector-active text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                Volver al recomendado ({recommendation.recommendedHack.title})
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowHackSwitcher(!showHackSwitcher)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <span>{showHackSwitcher ? 'Ocultar catálogo de Hacks' : 'Cambiar de Hack'}</span>
              {showHackSwitcher ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#ECC964]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#ECC964]" />
              )}
            </button>
          </div>
        </div>

        {/* Selector desplegable con los 8 Hacks reales de HACKS_DATA */}
        {showHackSwitcher && (
          <div className="pt-5 border-t border-[#D4AF37]/30 space-y-3.5">
            <p className="text-xs text-[#D6CFC2]">
              Selecciona cualquiera de los 8 Hacks oficiales de <code className="text-[#ECC964] font-mono">HACKS_DATA</code>. Tus respuestas previas se conservan si exploras otro Hack.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HACKS_DATA.map((h) => {
                const isCurrent = h.id === activeHack.id;
                const isRec = h.id === recommendation.recommendedHack.id;
                const hPoder = getPoderForHack(h);
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => handleChooseHack(h.id)}
                    className={`p-4 rounded-xl text-left cursor-pointer space-y-1.5 ${
                      isCurrent ? 'chalamandra-selector-active' : 'chalamandra-selector'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-xs sm:text-sm font-semibold text-[#FAF6ED] tabular-nums">
                        {String(h.id).padStart(2, '0')}. {h.title} ·{' '}
                        <span className="text-[#ECC964]">{h.metodo}</span>
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isRec && (
                          <span className="text-[10px] font-mono font-semibold text-[#FFF0BE]">
                            Recomendado
                          </span>
                        )}
                        {isCurrent && <Check className="w-4 h-4 text-[#FFF0BE]" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#D6CFC2] leading-snug">{h.description}</p>
                    <span className="block text-[10px] font-mono text-[#ECC964]/90">
                      {hPoder
                        ? `Poder asociado: ${hPoder.title}`
                        : 'Sin poderDeSherezadeId definido en catálogo'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Relación oficial con Poder de Sherezade (`poderDeSherezadeId`) */}
        <div className="p-4 rounded-xl chalamandra-chamber flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {linkedPower ? (
            <div className="space-y-1">
              <div className="font-mono text-[#FFF0BE] font-semibold">
                Asociación oficial (`poderDeSherezadeId: {linkedPower.id}`) → {linkedPower.title}
              </div>
              <p className="text-[#DDD6C7] leading-relaxed">
                <strong className="text-[#FAF6ED]">Propósito:</strong> {linkedPower.proposito}{' '}
                <strong className="text-[#ECC964]">Clave:</strong> {linkedPower.clave} —{' '}
                {linkedPower.poder}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="font-mono text-[#FFF0BE] font-semibold">
                Asociación de catálogo (`poderDeSherezadeId` no definido en `{activeHack.title}`)
              </div>
              <p className="text-[#D6CFC2] leading-relaxed">
                En los datos originales de Interactive DecoX, este octavo Hack opera directamente desde su método ({activeHack.metodo}) sin un `poderDeSherezadeId` preasignado. Si deseas usar el Generador de Lentes de Poder abajo, puedes elegir cualquiera de los 7 poderes manualmente.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Plantilla Metodológica Real (`plantillaMetodologica`) */}
      <section className="p-6 sm:p-8 rounded-2xl chalamandra-surface space-y-6">
        <div className="space-y-1.5 border-b border-[#D4AF37]/25 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base sm:text-lg font-semibold text-[#FAF6ED]">
              Plantilla metodológica oficial · {activeHack.title}
            </h3>
            <span className="text-xs font-mono font-semibold text-[#ECC964]">
              {activeHack.subtitle}
            </span>
          </div>
          <p className="text-xs text-[#D6CFC2] leading-relaxed">
            Aplica cada campo directamente sobre tu caso{' '}
            {challenge.title.trim() ? `("${challenge.title.trim()}")` : 'actual'}. Conservamos íntegramente las etiquetas y guías de `plantillaMetodologica` en Interactive DecoX.
          </p>
          <p className="text-xs text-[#FFF0BE] pt-1">
            <strong>Mini-reto de referencia del catálogo:</strong> {activeHack.miniReto}
          </p>
        </div>

        <div className="space-y-6">
          {activeHack.plantillaMetodologica.map((item, idx) => (
            <div key={item.aspecto} className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-[#FAF6ED]">
                <span className="font-mono text-[#ECC964] mr-1.5 tabular-nums">
                  0{idx + 1}.
                </span>
                {item.aspecto}
              </label>
              <p className="text-xs text-[#C4BCAD]">{item.guia}</p>
              <textarea
                rows={3}
                value={currentResponses[idx] || ''}
                onChange={(e) => {
                  if (validationNotice) setValidationNotice(null);
                  onUpdatePlantillaField(activeHack.id, idx, e.target.value);
                }}
                placeholder={`Escribe aquí tu aplicación concreta para "${item.aspecto}"...`}
                className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Herramienta Complementaria Opcional: Cámara Óptica del Lente de Poder */}
      <section className="p-6 sm:p-7 rounded-2xl chalamandra-surface-violet space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-violet-300" />
              <h3 className="font-display text-sm sm:text-base font-semibold text-[#FAF6ED]">
                Herramienta complementaria opcional · Generador de Lentes de Poder
              </h3>
            </div>
            <p className="text-xs text-[#D6CFC2]">
              Cruza el poder asociado y el dominio de tu caso ({effectiveDomain}) para enfocar un ángulo estratégico concreto. Es opcional; puedes avanzar sin activarlo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPowerLensPanel(!showPowerLensPanel)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer shrink-0 self-start sm:self-auto whitespace-nowrap"
          >
            <span>{showPowerLensPanel ? 'Ocultar Lente de Poder' : 'Abrir Lente de Poder'}</span>
            {showPowerLensPanel ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#ECC964]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#ECC964]" />
            )}
          </button>
        </div>

        {showPowerLensPanel && (
          <div className="pt-5 border-t border-violet-400/25 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-violet-200 mb-1.5">
                  Poder de Sherezade a aplicar
                </label>
                <select
                  value={activeLensPoder.id}
                  onChange={(e) => {
                    const chosen =
                      PODERES_SHEREZADE_DATA.find((p) => p.id === Number(e.target.value)) ||
                      PODERES_SHEREZADE_DATA[0];
                    onUpdatePowerLens({
                      ...powerLens,
                      poderId: chosen.id,
                      poderTitle: chosen.title,
                      domain: effectiveDomain
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs"
                >
                  {PODERES_SHEREZADE_DATA.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0D0C13] text-[#FAF6ED]">
                      {p.id}. {p.title} ({p.proposito})
                      {linkedPower?.id === p.id ? ' — Asociado al Hack actual' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-violet-200 mb-1.5">
                  Dominio de aplicación
                </label>
                <select
                  value={effectiveDomain}
                  onChange={(e) =>
                    onUpdatePowerLens({
                      ...powerLens,
                      poderId: activeLensPoder.id,
                      poderTitle: activeLensPoder.title,
                      domain: e.target.value as PowerLensDomain
                    })
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

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={lensLoading}
                onClick={handleGeneratePowerLens}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl chalamandra-btn-primary font-bold text-xs cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {lensLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                    <span>Generando Lente de Poder...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Generar Lente ({activeLensPoder.title} · {effectiveDomain})
                    </span>
                  </>
                )}
              </button>

              {powerLens.used && (
                <button
                  type="button"
                  onClick={handleClearPowerLens}
                  className="px-3.5 py-2 rounded-xl chalamandra-chamber hover:border-[#ECC964] text-xs text-[#D6CFC2] hover:text-[#FFF0BE] cursor-pointer transition-colors whitespace-nowrap"
                >
                  Descartar lente en este informe
                </button>
              )}
            </div>

            {lensEngineNote && (
              <p className="text-[11px] font-mono text-[#D6CFC2]">{lensEngineNote}</p>
            )}

            {powerLens.used && powerLens.directive && (
              <div className="p-4 rounded-xl chalamandra-chamber space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-violet-200">
                  <span>
                    Lente incorporado al caso · {powerLens.poderTitle} en {powerLens.domain}
                  </span>
                  <span className="text-[#ECC964]">
                    Origen: {powerLens.source === 'ai' ? 'Motor IA externo' : 'Motor local determinista'}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={powerLens.directive}
                  onChange={(e) =>
                    onUpdatePowerLens({
                      ...powerLens,
                      used: true,
                      directive: e.target.value,
                      source: 'manual'
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs leading-relaxed"
                />
              </div>
            )}
          </div>
        )}
      </section>

      {validationNotice && (
        <div
          role="alert"
          className="p-4 rounded-xl chalamandra-surface-rose text-xs text-rose-100 flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
          <span>{validationNotice}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-3 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Volver a Fase 02 · Decodificar</span>
        </button>

        <button
          type="button"
          onClick={handleAdvance}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl chalamandra-btn-primary font-bold text-xs cursor-pointer whitespace-nowrap"
        >
          <span>Continuar a Fase 04 · Orientar con SRAP</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
