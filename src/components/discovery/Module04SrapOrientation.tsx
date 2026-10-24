import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  DiscoveryDeliverableState,
  SrapOrientationState,
  ActionPlanWeek,
  ActionPlanTask
} from '../../types';
import { HACKS_DATA, getPoderForHack } from '../../data/interactiveCatalog';
import { recommendSingleHackForCase } from '../../data/discoveryFlowConfig';
import {
  deriveSrapFromCase,
  deriveSynthesisFromResponses,
  mergeActionPlanPreservingCustomTasks
} from '../../utils/discoverySynthesisEngine';
import { useAudio } from '../../hooks/useAudio';

interface Module04SrapOrientationProps {
  state: DiscoveryDeliverableState;
  onChangeSrap: (updated: SrapOrientationState, clearSyncFlag?: boolean) => void;
  onChangeActionPlan: (updatedPlan: ActionPlanWeek[], clearPlanSync?: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Module04SrapOrientation({
  state,
  onChangeSrap,
  onChangeActionPlan,
  onPrev,
  onNext
}: Module04SrapOrientationProps) {
  const { srapOrientation, srapNeedsSync } = state;
  const recommendation = recommendSingleHackForCase(state.challenge, state.strategicProfile);
  const chosenHack =
    (state.selectedHackId ? HACKS_DATA.find((h) => h.id === state.selectedHackId) : null) ||
    recommendation.recommendedHack;
  const linkedPower = getPoderForHack(chosenHack);

  const [pulseActive, setPulseActive] = useState(false);
  const [pulseBpm, setPulseBpm] = useState<number>(srapOrientation?.metronomeUsedBpm || 60);
  const [customTaskText, setCustomTaskText] = useState('');
  const [customTaskKpi, setCustomTaskKpi] = useState('');
  const [validationNotice, setValidationNotice] = useState<string | null>(null);

  const { playTick } = useAudio();
  const pulseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isBlankSrap =
    !srapOrientation.sincronizar.trim() &&
    !srapOrientation.reconocer.trim() &&
    !srapOrientation.activar.trim() &&
    !srapOrientation.pausa.trim();

  useEffect(() => {
    if (isBlankSrap) {
      const derived = deriveSrapFromCase(state);
      onChangeSrap(derived, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pulseActive) {
      const intervalMs = (60 / pulseBpm) * 1000;
      pulseTimerRef.current = setInterval(() => {
        playTick(760, 'sine', 0.035);
      }, intervalMs);
    } else if (pulseTimerRef.current) {
      clearInterval(pulseTimerRef.current);
    }
    return () => {
      if (pulseTimerRef.current) clearInterval(pulseTimerRef.current);
    };
  }, [pulseActive, pulseBpm, playTick]);

  const handleResyncFromCase = () => {
    const derived = deriveSrapFromCase(state);
    onChangeSrap(
      {
        ...derived,
        metronomeUsedBpm: pulseBpm,
        isCustomized: false
      },
      true
    );

    const { recommendedPlan } = deriveSynthesisFromResponses({
      ...state,
      srapOrientation: derived,
      srapNeedsSync: false
    });
    const mergedPlan = mergeActionPlanPreservingCustomTasks(recommendedPlan, state.actionPlan);
    onChangeActionPlan(mergedPlan, true);
  };

  const handleFieldChange = (field: keyof SrapOrientationState, value: string) => {
    if (validationNotice) setValidationNotice(null);
    onChangeSrap(
      {
        ...srapOrientation,
        [field]: value,
        isCustomized: true
      },
      true
    );
  };

  const customTasks: { weekNumber: number; task: ActionPlanTask }[] = [];
  (state.actionPlan || []).forEach((w) => {
    (w.tasks || []).forEach((t) => {
      if (t.isCustom) {
        customTasks.push({ weekNumber: w.weekNumber, task: t });
      }
    });
  });

  const handleAddCustomTask = () => {
    if (!customTaskText.trim()) return;
    const basePlan =
      state.actionPlan && state.actionPlan.length > 0
        ? state.actionPlan
        : deriveSynthesisFromResponses(state).recommendedPlan;

    const newTask: ActionPlanTask = {
      id: `custom-${Date.now()}`,
      label: customTaskText.trim(),
      completed: false,
      targetDay: 'Propio',
      kpi: customTaskKpi.trim() || 'Verificación propia',
      isCustom: true
    };

    const updatedPlan = basePlan.map((w, idx) =>
      idx === 0 ? { ...w, tasks: [...w.tasks, newTask] } : w
    );
    onChangeActionPlan(updatedPlan, false);
    setCustomTaskText('');
    setCustomTaskKpi('');
  };

  const handleRemoveCustomTask = (taskId: string) => {
    const updatedPlan = state.actionPlan.map((w) => ({
      ...w,
      tasks: w.tasks.filter((t) => t.id !== taskId)
    }));
    onChangeActionPlan(updatedPlan, false);
  };

  const handleAdvance = () => {
    if (!srapOrientation.activar.trim() || !srapOrientation.pausa.trim()) {
      setValidationNotice(
        'Define al menos la acción inmediata (ACTIVAR) y el criterio de detención o revisión (PAUSA) para cerrar tu Ruta Inicial con rigor.'
      );
      return;
    }
    setPulseActive(false);
    setValidationNotice(null);
    onNext();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado de Fase 4 */}
      <div className="border-b border-[#D4AF37]/35 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#ECC964] text-xs font-mono font-semibold tabular-nums">
            <Zap className="w-4 h-4 text-[#ECC964]" />
            <span>Fase 04 de 05 · Orientar con SRAP</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#FAF6ED] tracking-tight text-balance">
            Aterrizar el caso con el protocolo SRAP
          </h2>
          <p className="text-xs sm:text-sm text-[#D6CFC2] max-w-2xl leading-relaxed">
            Traduce lo trabajado con <strong className="text-[#FFF0BE]">{chosenHack.title}</strong>
            {linkedPower ? ` (${linkedPower.title})` : ''} en una orientación operativa real: Sincronizar condiciones, Reconocer el patrón crítico, Activar una acción proporcionada y fijar el criterio explícito de Pausa.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleResyncFromCase}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#ECC964] shrink-0" />
            <span>Derivar SRAP desde mis respuestas</span>
          </button>
        </div>
      </div>

      {/* Aviso cuando hubo ediciones aguas arriba (Fases 1, 2 o 3) */}
      {srapNeedsSync && (
        <div className="p-4 rounded-xl chalamandra-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-[#FFF0BE] leading-relaxed">
            Modificaste respuestas en fases anteriores. Puedes actualizar esta orientación SRAP con los nuevos datos (tus tareas personalizadas se conservarán intactas).
          </p>
          <button
            type="button"
            onClick={handleResyncFromCase}
            className="px-4 py-2 rounded-xl chalamandra-btn-primary font-bold whitespace-nowrap cursor-pointer shrink-0"
          >
            Actualizar SRAP ahora
          </button>
        </div>
      )}

      {/* Consola de calibración rítmica SRAP */}
      <div className="p-5 rounded-2xl chalamandra-surface-cyan flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="font-display font-semibold text-[#FAF6ED]">
              Pulso rítmico SRAP opcional
            </span>
            <span aria-hidden="true" className="text-[#ECC964]">·</span>
            <span className="font-mono text-cyan-200 font-semibold tabular-nums">
              {pulseBpm} BPM · Respiración 4-4-4-4
            </span>
          </div>
          <p className="text-[#D6CFC2] leading-relaxed">
            Úsalo durante 30–60 segundos si necesitas reducir ruido mental antes de fijar tu acción inmediata y tu criterio de pausa.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <input
            type="range"
            min={45}
            max={90}
            value={pulseBpm}
            onChange={(e) => {
              const nextBpm = Number(e.target.value);
              setPulseBpm(nextBpm);
              onChangeSrap({ ...srapOrientation, metronomeUsedBpm: nextBpm }, false);
            }}
            aria-label="Frecuencia BPM del pulso SRAP"
            className="w-24 accent-[#ECC964] cursor-pointer"
          />
          <button
            type="button"
            onClick={() => setPulseActive(!pulseActive)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold cursor-pointer whitespace-nowrap ${
              pulseActive ? 'chalamandra-selector-cyan-active' : 'chalamandra-btn-secondary'
            }`}
          >
            {pulseActive ? (
              <Pause className="w-3.5 h-3.5 text-cyan-200 shrink-0" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#ECC964] shrink-0" />
            )}
            <span>{pulseActive ? 'Detener pulso' : 'Activar pulso'}</span>
          </button>
        </div>
      </div>

      {/* Las 4 coordenadas operativas SRAP aplicadas al caso */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* S — SINCRONIZAR */}
        <div className="p-6 rounded-2xl chalamandra-surface-cyan space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="font-display text-sm sm:text-base font-semibold text-cyan-200">
              S · Sincronizar
            </label>
            <span className="text-[11px] font-mono text-[#FFF0BE]">Condiciones reales</span>
          </div>
          <p className="text-xs text-[#D6CFC2]">
            Sitúa la acción dentro del tiempo, margen, actores y nivel de evidencia reales que declaraste.
          </p>
          <textarea
            rows={4}
            value={srapOrientation.sincronizar}
            onChange={(e) => handleFieldChange('sincronizar', e.target.value)}
            placeholder="¿Bajo qué condiciones y restricciones reales vas a actuar hoy?"
            className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
          />
        </div>

        {/* R — RECONOCER */}
        <div className="p-6 rounded-2xl chalamandra-surface space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="font-display text-sm sm:text-base font-semibold text-[#FFF0BE]">
              R · Reconocer
            </label>
            <span className="text-[11px] font-mono text-[#ECC964]">El patrón que importa</span>
          </div>
          <p className="text-xs text-[#D6CFC2]">
            Nombra el bucle, silencio o supuesto que explica por qué los intentos previos no funcionaron.
          </p>
          <textarea
            rows={4}
            value={srapOrientation.reconocer}
            onChange={(e) => handleFieldChange('reconocer', e.target.value)}
            placeholder="¿Qué patrón concreto estás reconociendo gracias a la decodificación y al Hack aplicado?"
            className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
          />
        </div>

        {/* A — ACTIVAR */}
        <div className="p-6 rounded-2xl chalamandra-surface-emerald space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="font-display text-sm sm:text-base font-semibold text-emerald-200">
              A · Activar
            </label>
            <span className="text-[11px] font-mono text-emerald-300">
              Acción inmediata y proporcionada
            </span>
          </div>
          <p className="text-xs text-[#D6CFC2]">
            ¿Qué movimiento específico, pequeño y verificable vas a ejecutar sin exceder tus restricciones?
          </p>
          <textarea
            rows={4}
            value={srapOrientation.activar}
            onChange={(e) => handleFieldChange('activar', e.target.value)}
            placeholder="Describe la acción inmediata derivada de la plantilla de tu Hack..."
            className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
          />
        </div>

        {/* P — PAUSA */}
        <div className="p-6 rounded-2xl chalamandra-surface-rose space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="font-display text-sm sm:text-base font-semibold text-rose-200">
              P · Pausa
            </label>
            <span className="text-[11px] font-mono text-rose-300">
              Cuándo detenerse o revisar
            </span>
          </div>
          <p className="text-xs text-[#D6CFC2]">
            Señala qué resultado adverso, falta de evidencia o hábito previo obliga a parar y revisar antes de escalar.
          </p>
          <textarea
            rows={4}
            value={srapOrientation.pausa}
            onChange={(e) => handleFieldChange('pausa', e.target.value)}
            placeholder="¿En qué momento o bajo qué señal debes detenerte y revisar en vez de insistir por inercia?"
            className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
          />
        </div>
      </section>

      {/* Puente de ejecución: Paso inmediato 24–72h + Siguiente paso tras revisión */}
      <section className="p-6 sm:p-7 rounded-2xl chalamandra-surface-elevated space-y-5">
        <h3 className="font-display text-base font-semibold text-[#FFF0BE]">
          Secuencia de salida para tu Ruta Inicial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6DF96]">
              Primer movimiento verificable (próximas 24–72 horas)
            </label>
            <textarea
              rows={2}
              value={srapOrientation.immediateStep24h}
              onChange={(e) => handleFieldChange('immediateStep24h', e.target.value)}
              placeholder="Ej: Enviar los primeros 3 mensajes directos con alcance y precio cerrados hoy antes de las 18:00..."
              className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6DF96]">
              Siguiente paso tras evaluar el punto de pausa
            </label>
            <textarea
              rows={2}
              value={srapOrientation.nextStepAfterPause}
              onChange={(e) => handleFieldChange('nextStepAfterPause', e.target.value)}
              placeholder="Ej: Revisar respuestas reales el viernes y decidir si extender la regla o llevar las objeciones a la sesión en vivo..."
              className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Tareas propias opcionales */}
        <div className="pt-4 border-t border-[#D4AF37]/25 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-semibold text-[#FAF6ED]">
              Compromisos propios adicionales (opcional)
            </span>
            <span className="text-[11px] font-mono text-[#ECC964]">
              Se conservan aunque edites respuestas anteriores
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customTaskText}
              onChange={(e) => setCustomTaskText(e.target.value)}
              placeholder="Añadir acción o recordatorio específico propio..."
              className="flex-1 px-3.5 py-2 rounded-xl chalamandra-input text-xs"
            />
            <input
              type="text"
              value={customTaskKpi}
              onChange={(e) => setCustomTaskKpi(e.target.value)}
              placeholder="Criterio de verificación (opcional)"
              className="sm:w-56 px-3.5 py-2 rounded-xl chalamandra-input text-xs"
            />
            <button
              type="button"
              onClick={handleAddCustomTask}
              className="px-4 py-2 rounded-xl chalamandra-btn-secondary text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-[#ECC964]" />
              <span>Añadir</span>
            </button>
          </div>

          {customTasks.length > 0 && (
            <div className="space-y-2">
              {customTasks.map(({ task }) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2.5 rounded-xl chalamandra-chamber text-xs text-[#FAF6ED] gap-2"
                >
                  <div>
                    <span>{task.label}</span>
                    {task.kpi && (
                      <span className="ml-2 font-mono text-[11px] text-[#ECC964]">
                        ({task.kpi})
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomTask(task.id)}
                    className="text-[#B8B0A0] hover:text-rose-300 p-1 cursor-pointer"
                    aria-label="Eliminar tarea personalizada"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
          onClick={() => {
            setPulseActive(false);
            onPrev();
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Volver a Fase 03 · Aplicar un Hack</span>
        </button>

        <button
          type="button"
          onClick={handleAdvance}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl chalamandra-btn-primary font-bold text-xs cursor-pointer whitespace-nowrap"
        >
          <span>Continuar a Fase 05 · Cerrar con una Ruta Inicial</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
