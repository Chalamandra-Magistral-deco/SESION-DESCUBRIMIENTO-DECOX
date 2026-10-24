import { ActiveView } from '../types';
import { Flame, Bot, Target, Zap, Shield, BookOpen, Compass, ArrowRight, Sparkles, CheckCircle2, Crown } from 'lucide-react';

interface IntroductionProps {
  setActiveView: (view: ActiveView) => void;
  userStats: {
    level: number;
    xp: number;
    ritualsCompleted: number;
    streakDays: number;
  };
}

export default function Introduction({ setActiveView, userStats }: IntroductionProps) {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-amber-500/20 p-8 sm:p-12 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema Táctico de Reconfiguración de Alto Rendimiento (SRAP)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.1]">
            Hackea tu Mente. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
              Domina tu Realidad.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Bienvenido a la plataforma interactiva de <strong className="text-amber-300">Decox Magistral</strong>. Elimina la sobrecarga cognitiva, potencia tu foco neurológico y ejecuta decisiones estratégicas con precisión quirúrgica.
          </p>

          {/* Quick CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              id="hero-map-btn"
              onClick={() => setActiveView('discovery')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>Volver a Sesión de Descubrimiento</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              id="hero-start-ritual-btn"
              onClick={() => setActiveView('ritual-srap')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-amber-300 border border-amber-500/30 text-sm font-semibold transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Iniciar Ritual SRAP</span>
            </button>

            <button
              id="hero-oraculo-btn"
              onClick={() => setActiveView('oraculo')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-amber-300 border border-slate-800 text-sm font-semibold transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Consultar Oráculo AI</span>
            </button>

            <button
              id="hero-quiz-btn"
              onClick={() => setActiveView('quiz')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-amber-300 border border-slate-800 text-sm font-semibold transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Quiz de Arquetipo</span>
            </button>
          </div>

          {/* Live Metrics Banner */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Nivel de Dominio</span>
              <span className="text-xl font-bold font-mono text-amber-400">Nivel {userStats.level}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Puntos XP acumulados</span>
              <span className="text-xl font-bold font-mono text-slate-100">{userStats.xp} XP</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Rituales SRAP</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{userStats.ritualsCompleted}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-xs text-slate-400 block">Racha Activa</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{userStats.streakDays} Días</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules & Interactive Gateways Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Módulos Tácticos de la Plataforma</h2>
            <p className="text-sm text-slate-400">Selecciona una herramienta para activar tu sesión de reconfiguración mental.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 0: Sesión de Descubrimiento */}
          <div
            id="intro-card-discovery-portal"
            onClick={() => setActiveView('discovery')}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 hover:border-amber-400 hover:bg-slate-850 transition-all cursor-pointer shadow-xl space-y-4 md:col-span-2 lg:col-span-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-lg">
                  <Crown className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
                    MESA PRINCIPAL • 7 MÓDULOS EN VIVO
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 group-hover:text-amber-400 transition-colors">
                    Sesión de Descubrimiento & Mapa Estratégico
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Ficha del desafío, diagnóstico de supuestos, biblioteca de los 7 hacks del 1%, laboratorio de micro-experimentos, síntesis estratégica ejecutiva, plan a 30 días e informe oficial descargable en PDF.
                  </p>
                </div>
              </div>

              <div className="flex items-center text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-3 rounded-xl shadow-md gap-2 group-hover:scale-105 transition-all shrink-0">
                <span>Continuar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 1: Ritual SRAP */}
          <div
            id="intro-card-ritual"
            onClick={() => setActiveView('ritual-srap')}
            className="group relative p-6 rounded-2xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">Ritual SRAP Completo</h3>
              <p className="text-xs text-slate-400 mt-1">4 fases sistemáticas de desconexión, calibración fisiológica y anclaje de objetivos.</p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-amber-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Comenzar Ritual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Metrónomo */}
          <div
            id="intro-card-metronome"
            onClick={() => setActiveView('metronome')}
            className="group relative p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">Metrónomo Cognitivo</h3>
              <p className="text-xs text-slate-400 mt-1">Frecuencias auditivas ajustables (40-180 BPM) y patrones de respiración para estado de flujo.</p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-cyan-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Abrir Metrónomo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Oráculo Chalamandra */}
          <div
            id="intro-card-oraculo"
            onClick={() => setActiveView('oraculo')}
            className="group relative p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition-colors">Oráculo AI Chalamandra</h3>
              <p className="text-xs text-slate-400 mt-1">IA estratégica Gemini entrenada para diagnosticar tus frenos mentales y generar mantras en 24h.</p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-purple-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Hacer Consulta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Quiz de Arquetipos */}
          <div
            id="intro-card-quiz"
            onClick={() => setActiveView('quiz')}
            className="group relative p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">Quiz de Arquetipo</h3>
              <p className="text-xs text-slate-400 mt-1">Descubre si eres Arquitecto, Alquimista, Comandante o Sabio Chalamandra.</p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Iniciar Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Power Lens */}
          <div
            id="intro-card-powerlens"
            onClick={() => setActiveView('power-lens')}
            className="group relative p-6 rounded-2xl bg-slate-900/90 border border-yellow-500/20 hover:border-yellow-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-yellow-400 transition-colors">Power Lens Generator</h3>
              <p className="text-xs text-slate-400 mt-1">Reencuadra cualquier obstáculo o dilema utilizando 4 lentes cognitivas avanzadas.</p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-yellow-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Reencuadrar Problema</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Códice Magistral */}
          <div
            id="intro-card-codex"
            onClick={() => setActiveView('codex')}
            className="group relative p-6 rounded-2xl bg-slate-900/90 border border-rose-500/20 hover:border-rose-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-rose-400 transition-colors">El Códice Táctico</h3>
              <p className="text-xs text-slate-400 mt-1">Biblioteca interactiva con la ciencia y los pasos de cada hack mental.</p>
            </div>
            <div className="pt-2 flex items-center text-xs font-semibold text-rose-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explorar Hacks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* Why Decox Magistral Guarantee Section */}
      <section className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-slate-100 text-center sm:text-left">
          Los 3 Pilares del Método Decox
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Modulación Somática</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No puedes reprogramar tu mente si tu cuerpo está inundado de cortisol. El metrónomo regula tu frecuencia cardíaca.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Claridad de Inteligencia AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              El Oráculo Chalamandra corta el ruido emocional y te entrega diagnósticos fríos para actuar en 24 horas.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Gamificación de Progreso</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mide tu nivel de dominio, desbloquea artefactos y mantén tu racha diaria activa con recompensas reales.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
