import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Wand2
} from 'lucide-react';
import { ActionPlanWeek, ActionPlanTask, DiscoveryDeliverableState } from '../../types';
import {
  deriveSynthesisFromResponses,
  mergeActionPlanPreservingCustomTasks
} from '../../utils/discoverySynthesisEngine';
import { useAudio } from '../../hooks/useAudio';

interface Module06ActionPlanProps {
  fullState: DiscoveryDeliverableState;
  actionPlan: ActionPlanWeek[];
  onChange: (updated: ActionPlanWeek[], clearSyncFlag?: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Module06ActionPlan({
  fullState,
  actionPlan,
  onChange,
  onPrev,
  onNext
}: Module06ActionPlanProps) {
  const [activeWeekNum, setActiveWeekNum] = useState<number>(1);
  const [newTaskLabel, setNewTaskLabel] = useState<string>('');
  const [newTaskDay, setNewTaskDay] = useState<string>('Días 1–3');
  const [newTaskKpi, setNewTaskKpi] = useState<string>('');

  const { playSuccessChime, playTick } = useAudio();

  const activeWeek = actionPlan.find((w) => w.weekNumber === activeWeekNum) || actionPlan[0];

  // Auto-sync derived tasks if upstream responses were modified and user has real inputs
  useEffect(() => {
    const hasRealInput =
      Boolean(fullState.challenge.currentSituation.trim()) ||
      Boolean(fullState.challenge.criticalFriction.trim()) ||
      Boolean(fullState.challenge.title.trim());

    if (fullState.planNeedsSync && hasRealInput) {
      const { recommendedPlan } = deriveSynthesisFromResponses(fullState);
      const merged = mergeActionPlanPreservingCustomTasks(recommendedPlan, actionPlan);
      onChange(merged, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullState.planNeedsSync]);

  const handleGenerateFromSession = () => {
    const { recommendedPlan } = deriveSynthesisFromResponses(fullState);
    const merged = mergeActionPlanPreservingCustomTasks(recommendedPlan, actionPlan);
    onChange(merged, true);
    playSuccessChime();
  };

  const handleToggleTask = (weekNum: number, taskId: string) => {
    const updated = actionPlan.map((w) => {
      if (w.weekNumber !== weekNum) return w;
      return {
        ...w,
        tasks: w.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            playSuccessChime();
          } else {
            playTick(500, 'sine', 0.05);
          }
          return { ...t, completed: nextCompleted };
        })
      };
    });
    onChange(updated);
  };

  const handleAddTask = () => {
    if (!newTaskLabel.trim()) return;

    const newTask: ActionPlanTask = {
      id: `task-${Date.now()}`,
      label: newTaskLabel.trim(),
      completed: false,
      targetDay: newTaskDay || 'Esta semana',
      kpi: newTaskKpi.trim() || 'Verificación objetiva',
      isCustom: true
    };

    const updated = actionPlan.map((w) => {
      if (w.weekNumber !== activeWeekNum) return w;
      return { ...w, tasks: [...w.tasks, newTask] };
    });

    onChange(updated);
    setNewTaskLabel('');
    setNewTaskKpi('');
    playTick(750, 'sine', 0.05);
  };

  const handleRemoveTask = (weekNum: number, taskId: string) => {
    const updated = actionPlan.map((w) => {
      if (w.weekNumber !== weekNum) return w;
      return { ...w, tasks: w.tasks.filter((t) => t.id !== taskId) };
    });
    onChange(updated);
  };

  const totalTasks = actionPlan.reduce((acc, w) => acc + w.tasks.length, 0);
  const completedTasks = actionPlan.reduce(
    (acc, w) => acc + w.tasks.filter((t) => t.completed).length,
    0
  );
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-2 tabular-nums">
            <Calendar className="w-3.5 h-3.5" />
            <span>Paso 12 de 13 · Fase C · Mundo Real: Ruta de Ejecución a 30 Días</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Plan de Acción en el Mundo Real (4 Semanas)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Traduce el siguiente paso defendible, tus experimentos reversibles y la sesión en vivo en bloques semanales con señales observables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleGenerateFromSession}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-bold cursor-pointer transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Sincronizar Plan desde Mis Respuestas</span>
          </button>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex justify-between text-xs font-mono mb-1 gap-3 tabular-nums">
              <span className="text-slate-400">Avance Plan:</span>
              <span className="text-amber-400 font-bold">
                {progressPct}% ({completedTasks}/{totalTasks})
              </span>
            </div>
            <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Week Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actionPlan.map((week) => {
          const isActive = activeWeekNum === week.weekNumber;
          const weekDone = week.tasks.filter((t) => t.completed).length;

          return (
            <button
              key={week.weekNumber}
              type="button"
              onClick={() => setActiveWeekNum(week.weekNumber)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                isActive
                  ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono">
                <span className={`font-bold ${isActive ? 'text-amber-400' : 'text-slate-300'}`}>
                  Semana {week.weekNumber}
                </span>
                <span className="text-[10px] text-slate-500">
                  {weekDone}/{week.tasks.length}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200 truncate">
                {week.title.split(':')[1]?.trim() || week.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Week Sprint Detail Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4 space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
            Bloque Operativo · Semana {activeWeek.weekNumber}
          </span>
          <h3 className="text-xl font-extrabold text-slate-100">{activeWeek.title}</h3>
          <p className="text-xs text-slate-300 pt-1">
            <strong>Objetivo semanal:</strong> {activeWeek.focusObjective}
          </p>
        </div>

        {/* Task List */}
        {activeWeek.tasks.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400">
              No hay acciones cargadas en esta semana todavía. Puedes generarlas desde tus respuestas o añadirlas manualmente abajo.
            </p>
            <button
              type="button"
              onClick={handleGenerateFromSession}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              Generar Plan Personalizado Ahora
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeWeek.tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-950/40 border-slate-850 opacity-80'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggleTask(activeWeek.weekNumber, task.id)}
                    className="mt-0.5 text-amber-400 hover:text-amber-300 cursor-pointer shrink-0"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-medium ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {task.label}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span className="text-cyan-400">Ventana: {task.targetDay}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-400/90">Criterio: {task.kpi}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTask(activeWeek.weekNumber, task.id)}
                  className="self-end sm:self-auto text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                  title="Eliminar tarea"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Task Box */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Añadir Acción a la Semana {activeWeek.weekNumber}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              placeholder="Descripción concreta de la acción..."
              className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <input
              type="text"
              value={newTaskDay}
              onChange={(e) => setNewTaskDay(e.target.value)}
              placeholder="Ej: Días 1–3"
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskKpi}
              onChange={(e) => setNewTaskKpi(e.target.value)}
              placeholder="Indicador verificable..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Resultados Personalizados</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span>Finalizar Sesión y Abrir Informe PDF</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
