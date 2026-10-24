import { UserStats, ActiveView } from '../types';
import { ARCHETYPES } from '../utils/constants';
import { UserCheck, Shield, Flame, Zap, Award, BookOpen, Clock, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { triggerConfetti } from './Confetti';

interface ArchitectDashboardProps {
  userStats: UserStats;
  onAddFocusMinutes: (mins: number) => void;
  onClearWisdom: (index: number) => void;
  setActiveView: (view: ActiveView) => void;
}

export default function ArchitectDashboard({
  userStats,
  onAddFocusMinutes,
  onClearWisdom,
  setActiveView
}: ArchitectDashboardProps) {
  const { playSuccessChime } = useAudio();

  const primaryArch = userStats.primaryArchetype ? ARCHETYPES[userStats.primaryArchetype] : null;

  const handleManualFocusAdd = (mins: number) => {
    onAddFocusMinutes(mins);
    playSuccessChime();
    triggerConfetti();
  };

  // Mock 7-day focus history for the SVG chart
  const weeklyData = [
    { day: 'Lun', mins: 45 },
    { day: 'Mar', mins: 60 },
    { day: 'Mié', mins: 30 },
    { day: 'Jue', mins: 90 },
    { day: 'Vie', mins: 75 },
    { day: 'Sáb', mins: 40 },
    { day: 'Dom', mins: userStats.dailyFocusMinutes }
  ];

  const maxMins = Math.max(...weeklyData.map(d => d.mins), 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Panel Personal de Control</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Dashboard del Arquitecto
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Monitorea tu racha activa, registra tus bloques de foco y revisa tus diagnósticos guardados del Oráculo.
        </p>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1">
          <span className="text-xs text-slate-400 block font-mono">Nivel de Dominio</span>
          <span className="text-2xl font-bold font-mono text-amber-400">Niv {userStats.level}</span>
          <span className="text-[10px] text-slate-500 block">Total: {userStats.xp} XP</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
          <span className="text-xs text-slate-400 block font-mono">Racha Activa</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{userStats.streakDays} Días</span>
          <span className="text-[10px] text-slate-500 block">Continuidad diaria</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-1">
          <span className="text-xs text-slate-400 block font-mono">Foco Hoy</span>
          <span className="text-2xl font-bold font-mono text-cyan-400">{userStats.dailyFocusMinutes} Min</span>
          <span className="text-[10px] text-slate-500 block">Tiempo en flujo</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-1">
          <span className="text-xs text-slate-400 block font-mono">Rituales SRAP</span>
          <span className="text-2xl font-bold font-mono text-purple-400">{userStats.ritualsCompleted}</span>
          <span className="text-[10px] text-slate-500 block">Sesiones selladas</span>
        </div>
      </div>

      {/* Main Grid: Focus Logger & Archetype Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Focus Logger Card */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Registrador de Bloques de Foco</span>
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            ¿Trabajaste fuera del metrónomo? Registra tus minutos de trabajo profundo para sumar puntos XP y actualizar tus gráficos.
          </p>

          <div className="flex items-center gap-3">
            <button
              id="dash-add-15"
              onClick={() => handleManualFocusAdd(15)}
              className="flex-1 py-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-cyan-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>+15 Min</span>
            </button>

            <button
              id="dash-add-30"
              onClick={() => handleManualFocusAdd(30)}
              className="flex-1 py-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-cyan-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>+30 Min</span>
            </button>

            <button
              id="dash-add-60"
              onClick={() => handleManualFocusAdd(60)}
              className="flex-1 py-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-cyan-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>+60 Min</span>
            </button>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 block">Minutos de Foco (Últimos 7 días):</span>
            <div className="h-32 flex items-end justify-between gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
              {weeklyData.map((d, i) => {
                const heightPct = Math.min(100, Math.round((d.mins / maxMins) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[9px] font-mono text-slate-400">{d.mins}m</span>
                    <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t-lg transition-all duration-700"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary Archetype & Shortcuts */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Perfil de Arquetipo</span>
              </h3>
              <button
                id="dash-retake-quiz"
                onClick={() => setActiveView('quiz')}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                Hacer Quiz
              </button>
            </div>

            {primaryArch ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">Arquetipo Asignado:</span>
                <h4 className="text-lg font-bold text-slate-100">{primaryArch.name}</h4>
                <p className="text-xs text-slate-400 leading-snug">{primaryArch.tagline}</p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <p className="text-xs text-slate-400">Aún no has evaluado tu arquetipo principal.</p>
                <button
                  id="dash-start-quiz-now"
                  onClick={() => setActiveView('quiz')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Descubrir mi Arquetipo
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-xs font-mono text-slate-400 block">Accesos Rápidos Recomendados:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveView('ritual-srap')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-medium text-left flex items-center justify-between cursor-pointer"
              >
                <span>Ritual SRAP</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => setActiveView('oraculo')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-medium text-left flex items-center justify-between cursor-pointer"
              >
                <span>Oráculo AI</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Saved Wisdom Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-500/20 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Cuaderno de Mantras Guardados del Oráculo</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {userStats.savedWisdom.length} Guardados
          </span>
        </div>

        {userStats.savedWisdom.length > 0 ? (
          <div className="space-y-4">
            {userStats.savedWisdom.map((wisdom, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group">
                <button
                  id={`dash-delete-wisdom-${idx}`}
                  onClick={() => onClearWisdom(idx)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Eliminar Mantra"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono text-amber-400 font-bold block">"{wisdom.mantra}"</span>
                <p className="text-xs text-slate-300 leading-relaxed pr-8">{wisdom.diagnostico}</p>

                <div className="pt-2 flex flex-wrap gap-2">
                  {wisdom.protocolo24h.map((step, sIdx) => (
                    <span key={sIdx} className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      Paso {sIdx + 1}: {step}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">
            Aún no has guardado ninguna respuesta del Oráculo Chalamandra. Visita el Oráculo para guardar tus mantras tácticos.
          </p>
        )}
      </div>
    </div>
  );
}
