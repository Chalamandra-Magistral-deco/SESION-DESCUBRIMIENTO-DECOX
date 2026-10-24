import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, VolumeX, Sparkles, Zap, Award } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { triggerConfetti } from './Confetti';

interface SRAPMetronomeProps {
  onCompleteSession?: (minutes: number) => void;
}

export default function SRAPMetronome({ onCompleteSession }: SRAPMetronomeProps) {
  const [bpm, setBpm] = useState<number>(60);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [binauralEnabled, setBinauralEnabled] = useState<boolean>(false);
  const [pattern, setPattern] = useState<'box' | 'relax' | 'energy'>('box');
  const [breathState, setBreathState] = useState<'Inhala' | 'Retén' | 'Exhala' | 'Vacio'>('Inhala');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const { playTick, playSuccessChime, playBinauralDrone } = useAudio();
  const timerRef = useRef<any>(null);
  const stopBinauralRef = useRef<any>(null);

  // Metronome Sound Loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / bpm) * 1000;
      timerRef.current = setInterval(() => {
        if (soundEnabled) {
          playTick(880, 'sine', 0.04);
        }
        setElapsedSeconds((prev) => prev + 1);
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, soundEnabled, playTick]);

  // Binaural tone controller
  useEffect(() => {
    if (isPlaying && binauralEnabled) {
      stopBinauralRef.current = playBinauralDrone(210, 8, 300);
    } else {
      if (stopBinauralRef.current) stopBinauralRef.current();
    }
    return () => {
      if (stopBinauralRef.current) stopBinauralRef.current();
    };
  }, [isPlaying, binauralEnabled, playBinauralDrone]);

  // Breathing Visual Sync
  useEffect(() => {
    if (!isPlaying) return;

    const cycleSeconds = pattern === 'box' ? 16 : pattern === 'relax' ? 19 : 4;
    const currentStep = elapsedSeconds % cycleSeconds;

    if (pattern === 'box') {
      // 4-4-4-4
      if (currentStep < 4) setBreathState('Inhala');
      else if (currentStep < 8) setBreathState('Retén');
      else if (currentStep < 12) setBreathState('Exhala');
      else setBreathState('Vacio');
    } else if (pattern === 'relax') {
      // 4-7-8
      if (currentStep < 4) setBreathState('Inhala');
      else if (currentStep < 11) setBreathState('Retén');
      else setBreathState('Exhala');
    } else {
      // 2-2
      if (currentStep < 2) setBreathState('Inhala');
      else setBreathState('Exhala');
    }
  }, [elapsedSeconds, isPlaying, pattern]);

  const handleFinishSession = () => {
    setIsPlaying(false);
    const minutes = Math.max(1, Math.floor(elapsedSeconds / 60));
    if (onCompleteSession) {
      onCompleteSession(minutes);
    }
    playSuccessChime();
    triggerConfetti();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Zap className="w-3.5 h-3.5" />
          <span>Frecuencia Somática Metronómica</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Metrónomo Táctico SRAP
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Sincroniza tus ondas cerebrales y ritmo cardíaco con ritmos somáticos diseñados para inducir enfoque absoluto.
        </p>
      </div>

      {/* Main Visualizer Orb Card */}
      <div className="relative p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-cyan-500/20 shadow-2xl flex flex-col items-center justify-center space-y-8 overflow-hidden">
        {/* Background pulsing glow */}
        <div
          className={`absolute w-72 h-72 rounded-full blur-3xl transition-all duration-1000 ${
            isPlaying ? 'bg-cyan-500/20 scale-125' : 'bg-slate-800/10 scale-90'
          }`}
        />

        {/* Breathing Visual Orb */}
        <div className="relative z-10 flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80">
          {/* Animated pulse rings */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-cyan-500/30 transition-all duration-700 ${
              isPlaying
                ? breathState === 'Inhala'
                  ? 'scale-110 border-cyan-400 bg-cyan-500/10'
                  : breathState === 'Retén'
                  ? 'scale-105 border-amber-400 bg-amber-500/10'
                  : 'scale-90 border-slate-700'
                : 'scale-100'
            }`}
          />
          <div
            className={`absolute inset-4 rounded-full border border-cyan-400/20 transition-all duration-500 ${
              isPlaying ? 'animate-pulse' : ''
            }`}
          />

          {/* Central orb content */}
          <div className="text-center space-y-2 z-20 select-none">
            <span className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight font-mono">
              {isPlaying ? breathState : `${bpm} BPM`}
            </span>
            <span className="block text-xs font-mono text-cyan-400 uppercase tracking-widest">
              {isPlaying ? `Paso: ${breathState}` : 'Listo para iniciar'}
            </span>
            <span className="block text-xl font-mono text-slate-400 pt-2">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
          <button
            id="metronome-toggle-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl cursor-pointer ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-950/40'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-950/50'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isPlaying ? 'Pausar Ritmo' : 'Iniciar Metrónomo'}</span>
          </button>

          <button
            id="metronome-reset-btn"
            onClick={() => {
              setIsPlaying(false);
              setElapsedSeconds(0);
            }}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Reiniciar Temporizador"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {elapsedSeconds > 30 && (
            <button
              id="metronome-claim-xp-btn"
              onClick={handleFinishSession}
              className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-sm font-semibold transition-all cursor-pointer animate-bounce"
            >
              <Award className="w-4 h-4" />
              <span>Concluir y Reclamar XP</span>
            </button>
          )}
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BPM Slider & Sound Controls */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 text-sm">Velocidad de Frecuencia (BPM)</h3>
            <span className="font-mono font-bold text-amber-400 text-lg">{bpm} BPM</span>
          </div>

          <input
            id="metronome-bpm-slider"
            type="range"
            min="40"
            max="180"
            step="1"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <button
                id="metronome-sound-toggle-btn"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>Click Auditivo</span>
              </button>

              <button
                id="metronome-binaural-toggle-btn"
                onClick={() => setBinauralEnabled(!binauralEnabled)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  binauralEnabled
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Tono Binaural Alfa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Breathing Pattern Selector */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm">Patrones Tácticos de Respiración</h3>

          <div className="space-y-2">
            <button
              id="metronome-pattern-box"
              onClick={() => setPattern('box')}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                pattern === 'box'
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-medium'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">Box Breathing (4-4-4-4)</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800">Calma Estratégica</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">4s Inhalar • 4s Retener • 4s Exhalar • 4s Vacío. Usado por Navy SEALs.</p>
            </button>

            <button
              id="metronome-pattern-relax"
              onClick={() => setPattern('relax')}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                pattern === 'relax'
                  ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 font-medium'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">Hiper-Foco (4-7-8)</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800">Reducción Cortisol</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">4s Inhalar • 7s Retener • 8s Exhalar. Desactiva la respuesta de estrés.</p>
            </button>

            <button
              id="metronome-pattern-energy"
              onClick={() => setPattern('energy')}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                pattern === 'energy'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-medium'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">Carga de Energía (2-2)</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800">Activación Rápida</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">2s Inhalar • 2s Exhalar ritmo acelerado. Incrementa oxígeno prefrontal.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
