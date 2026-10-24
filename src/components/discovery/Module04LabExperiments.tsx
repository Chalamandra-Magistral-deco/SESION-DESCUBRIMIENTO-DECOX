import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  Wand2,
  Pencil,
  Check
} from 'lucide-react';
import { LabExperimentItem, MagistralHackItem, DiscoveryDeliverableState } from '../../types';
import { SEVEN_MAGISTRAL_HACKS } from '../../utils/constants';
import { buildDraftExperimentFromState } from '../../utils/discoverySynthesisEngine';
import { useAudio } from '../../hooks/useAudio';
import { triggerConfetti } from '../Confetti';

interface Module04LabExperimentsProps {
  fullState: DiscoveryDeliverableState;
  experiments: LabExperimentItem[];
  selectedHackIds: number[];
  onChange: (updated: LabExperimentItem[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Module04LabExperiments({
  fullState,
  experiments,
  selectedHackIds,
  onChange,
  onPrev,
  onNext
}: Module04LabExperimentsProps) {
  const { playSuccessChime, playTick } = useAudio();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newExp, setNewExp] = useState<Partial<LabExperimentItem>>({
    hackId: selectedHackIds[0] || 5,
    hypothesis: '',
    concreteAction: '',
    executionWindow: '48 Horas',
    successIndicator: '',
    reversibilityNote: '',
    status: 'Propuesto'
  });

  const availableHacks: MagistralHackItem[] =
    selectedHackIds.length > 0
      ? SEVEN_MAGISTRAL_HACKS.filter((h) => selectedHackIds.includes(h.id))
      : SEVEN_MAGISTRAL_HACKS;

  const handleAutoDraft = () => {
    const draft = buildDraftExperimentFromState(fullState);
    setNewExp(draft);
    playTick(680, 'sine', 0.06);
  };

  const handleAddExperiment = () => {
    if (!newExp.hypothesis?.trim() || !newExp.concreteAction?.trim()) return;

    const hackObj = SEVEN_MAGISTRAL_HACKS.find((h) => h.id === Number(newExp.hackId));
    const createdItem: LabExperimentItem = {
      id: `exp-${Date.now()}`,
      hackId: Number(newExp.hackId) || 5,
      hackName: hackObj ? `${hackObj.codeNumber}. ${hackObj.archetypeName}` : '05. Trickster',
      hypothesis: newExp.hypothesis.trim(),
      concreteAction: newExp.concreteAction.trim(),
      executionWindow: (newExp.executionWindow as LabExperimentItem['executionWindow']) || '48 Horas',
      successIndicator:
        newExp.successIndicator?.trim() || 'Señal observable registrada sin asumir causalidad absoluta',
      reversibilityNote:
        newExp.reversibilityNote?.trim() || 'Prueba acotada y 100% reversible si no genera señal clara.',
      status: 'Propuesto'
    };

    onChange([...experiments, createdItem]);
    setNewExp({
      hackId: selectedHackIds[0] || 5,
      hypothesis: '',
      concreteAction: '',
      executionWindow: '48 Horas',
      successIndicator: '',
      reversibilityNote: '',
      status: 'Propuesto'
    });

    playSuccessChime();
    triggerConfetti();
  };

  const handleUpdateExisting = (id: string, patch: Partial<LabExperimentItem>) => {
    onChange(experiments.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const handleRemoveExperiment = (id: string) => {
    onChange(experiments.filter((e) => e.id !== id));
    playTick(450, 'sine', 0.05);
  };

  const handleStatusChange = (id: string, newStatus: LabExperimentItem['status']) => {
    handleUpdateExisting(id, { status: newStatus });
    playTick(700, 'sine', 0.05);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-2 tabular-nums">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Paso 10 de 13 · Fase B · Decodificación: Laboratorio Reversible</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Experimentos Controlados e Hipótesis Medibles
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Introduce variaciones pequeñas y reversibles (Trickster) y define qué señal observable mirarás para decidir sin confundir una correlación inicial con causalidad definitiva.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-xs tabular-nums">
            <span className="text-slate-400 block font-mono">Registrados</span>
            <span className="font-bold text-slate-200">{experiments.length} Experimentos</span>
          </div>
        </div>
      </div>

      {/* New Experiment Builder Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>Diseñar Experimento Controlado y Reversible</span>
          </h3>

          <button
            type="button"
            onClick={handleAutoDraft}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sugerir Borrador desde Mis Respuestas</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs text-slate-300 font-medium">Hack Asociado</label>
            <select
              value={newExp.hackId}
              onChange={(e) => setNewExp({ ...newExp, hackId: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {availableHacks.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-300 font-medium">Ventana de Prueba</label>
            <select
              value={newExp.executionWindow}
              onChange={(e) =>
                setNewExp({
                  ...newExp,
                  executionWindow: e.target.value as LabExperimentItem['executionWindow']
                })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="24 Horas">24 Horas (Variación Inmediata)</option>
              <option value="48 Horas">48 Horas (Contraste Rápido)</option>
              <option value="7 Días">7 Días (Ciclo Semanal)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">
              Hipótesis Medible a Contrastar (06. Inteligencia basada en datos)
            </label>
            <input
              type="text"
              value={newExp.hypothesis || ''}
              onChange={(e) => setNewExp({ ...newExp, hypothesis: e.target.value })}
              placeholder="Si introducimos [variación específica], esperamos observar [señal medible]..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">
              Variación Pequeña de Ejecución (05. Trickster)
            </label>
            <input
              type="text"
              value={newExp.concreteAction || ''}
              onChange={(e) => setNewExp({ ...newExp, concreteAction: e.target.value })}
              placeholder="¿Qué cambio concreto y acotado ejecutarás, con quién y cuándo?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                Señal Observable y Criterio de Decisión
              </label>
              <input
                type="text"
                value={newExp.successIndicator || ''}
                onChange={(e) => setNewExp({ ...newExp, successIndicator: e.target.value })}
                placeholder="¿Qué dato observable te dirá si vale la pena seguir o descartar?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                Condición de Reversibilidad / Riesgo Acotado
              </label>
              <input
                type="text"
                value={newExp.reversibilityNote || ''}
                onChange={(e) => setNewExp({ ...newExp, reversibilityNote: e.target.value })}
                placeholder="Ej: Solo con 5 casos; si falla volvemos al flujo actual en 24h."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleAddExperiment}
            disabled={!newExp.hypothesis?.trim() || !newExp.concreteAction?.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/40 disabled:opacity-40 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Experimento Controlado</span>
          </button>
        </div>
      </div>

      {/* Existing Experiments List (Editable) */}
      {experiments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Experimentos Controlados ({experiments.length})
            </h3>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {experiments.filter((e) => e.status === 'Validado').length} validados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments.map((exp) => {
              const isEditing = editingId === exp.id;
              return (
                <div
                  key={exp.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={exp.hypothesis}
                        onChange={(e) => handleUpdateExisting(exp.id, { hypothesis: e.target.value })}
                        placeholder="Hipótesis medible"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                      />
                      <input
                        type="text"
                        value={exp.concreteAction}
                        onChange={(e) =>
                          handleUpdateExisting(exp.id, { concreteAction: e.target.value })
                        }
                        placeholder="Acción concreta"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                      />
                      <input
                        type="text"
                        value={exp.successIndicator}
                        onChange={(e) =>
                          handleUpdateExisting(exp.id, { successIndicator: e.target.value })
                        }
                        placeholder="Criterio de decisión"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-300"
                      />
                      <input
                        type="text"
                        value={exp.reversibilityNote || ''}
                        onChange={(e) =>
                          handleUpdateExisting(exp.id, { reversibilityNote: e.target.value })
                        }
                        placeholder="Condición de reversibilidad"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Guardar Edición</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold">{exp.hackName}</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {exp.executionWindow}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Hipótesis Medible
                        </span>
                        <p className="text-xs text-slate-200 font-medium leading-snug">
                          {exp.hypothesis}
                        </p>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-slate-950 border border-slate-850">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                          Variación Controlada
                        </span>
                        <p className="text-xs text-slate-300 leading-snug">{exp.concreteAction}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Señal Observable / Criterio de Decisión
                        </span>
                        <p className="text-xs text-emerald-300 font-mono">{exp.successIndicator}</p>
                      </div>

                      {exp.reversibilityNote && (
                        <div className="space-y-0.5 pt-1 border-t border-slate-800/70">
                          <span className="text-[10px] font-mono text-amber-400/90 uppercase tracking-wider block">
                            Reversibilidad
                          </span>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            {exp.reversibilityNote}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      {(['Propuesto', 'En Progreso', 'Validado'] as LabExperimentItem['status'][]).map(
                        (st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(exp.id, st)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                              exp.status === st
                                ? 'bg-slate-800 text-amber-400 border border-amber-500/40 font-bold'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(isEditing ? null : exp.id)}
                        className="text-slate-400 hover:text-amber-400 p-1.5 cursor-pointer"
                        title="Editar experimento"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperiment(exp.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 cursor-pointer"
                        title="Eliminar experimento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nav Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a 06. Data (Paso 09)</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span>Pasar a Fase C · Mundo Real y Sesión en Vivo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
