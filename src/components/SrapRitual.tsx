import { useState } from 'react';
import { Flame, Check, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { triggerConfetti } from './Confetti';

interface SrapRitualProps {
  onComplete: () => void;
}

export default function SrapRitual({ onComplete }: SrapRitualProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [intention, setIntention] = useState<string>('');
  const [completedPhases, setCompletedPhases] = useState<boolean[]>([false, false, false, false]);

  const phases = [
    {
      title: 'Fase 1: Desconexión Sensorial',
      subtitle: 'Congelamiento de Entradas Dopaminérgicas',
      description: 'Cierra todas las pestañas secundarias, apaga notificaciones y coloca tu teléfono bocabajo.',
      instruction: 'Toma una postura firme. Mantén la columna recta sin rigidez.',
      checklist: [
        'Celular en silencio o fuera de alcance.',
        'Notificaciones de aplicaciones desactivadas.',
        'Pared o pantalla limpia al frente.'
      ]
    },
    {
      title: 'Fase 2: Recalibración Somática',
      subtitle: 'Sincronización Respiratoria SRAP',
      description: 'Realiza 4 ciclos de respiración profunda en ritmo 4-4-4-4 para desacelerar el ritmo cardíaco.',
      instruction: 'Inhala en 4s, retén 4s, exhala 4s, mantén vacío 4s.',
      checklist: [
        'Ciclo 1: Liberar tensión en hombros.',
        'Ciclo 2: Relajar la mandíbula y ceño.',
        'Ciclo 3: Enfocar la mirada interna.',
        'Ciclo 4: Activar presencia cero.'
      ]
    },
    {
      title: 'Fase 3: Anclaje de Intención Exponencial',
      subtitle: 'Definición de Objetivo Irreversible',
      description: 'Escribe la única tarea o hito que vas a ejecutar en los próximos 45 minutos sin interrupción.',
      instruction: 'La claridad disuelve la procrastinación. Define tu victoria inmediata.',
      isInput: true
    },
    {
      title: 'Fase 4: Ejecución Ininterrumpida',
      subtitle: 'Sellado Táctico del Ritual',
      description: 'El ritual está completo. Entras en modo de flujo ininterrumpido.',
      instruction: 'Al hacer clic en "Sellar y Activar", reclamarás 50 XP y comenzará tu bloque de trabajo.',
      isFinal: true
    }
  ];

  const handleNextStep = () => {
    const nextCompleted = [...completedPhases];
    nextCompleted[currentStep] = true;
    setCompletedPhases(nextCompleted);

    if (currentStep < phases.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      triggerConfetti();
      onComplete();
    }
  };

  const phase = phases[currentStep];

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Step Indicators */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4">
        {phases.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                idx === currentStep
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                  : completedPhases[idx]
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {completedPhases[idx] ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            <span
              className={`hidden sm:inline text-xs font-medium truncate ${
                idx === currentStep ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              {p.title.split(':')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">{phase.subtitle}</span>
            <h2 className="text-2xl font-extrabold text-slate-100">{phase.title}</h2>
          </div>
        </div>

        <p className="text-slate-300 text-base leading-relaxed">{phase.description}</p>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-amber-300/90 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <span>{phase.instruction}</span>
        </div>

        {/* Checklist for Phases 1 & 2 */}
        {phase.checklist && (
          <div className="space-y-3 pt-2">
            {phase.checklist.map((item, i) => (
              <label
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 cursor-pointer text-sm text-slate-200"
              >
                <input type="checkbox" className="accent-amber-500 w-4 h-4 rounded" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        )}

        {/* Input for Phase 3 */}
        {phase.isInput && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-medium text-slate-300">
              Escribe tu Objetivo Inmediato de Flujo (Ej: "Terminar la propuesta comercial de Decox"):
            </label>
            <input
              id="ritual-intention-input"
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="Mi objetivo de los próximos 45 minutos es..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
        )}

        {/* Confirmation Card for Phase 4 */}
        {phase.isFinal && (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">Estado de Flujo Desbloqueado</h3>
            {intention && (
              <p className="text-sm font-mono text-emerald-300 bg-slate-950/60 p-3 rounded-xl border border-emerald-500/20">
                "{intention}"
              </p>
            )}
            <p className="text-xs text-slate-400">
              Al confirmar, se registrarán +50 XP a tu perfil de Arquitecto y tu racha de días aumentará.
            </p>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            id="ritual-prev-btn"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            id="ritual-next-btn"
            disabled={phase.isInput && !intention.trim()}
            onClick={handleNextStep}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-950/40 disabled:opacity-50 cursor-pointer"
          >
            <span>{phase.isFinal ? 'Sellar Ritual y Reclamar XP' : 'Siguiente Fase'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
