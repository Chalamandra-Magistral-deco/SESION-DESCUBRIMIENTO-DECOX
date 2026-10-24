import { useState, useEffect } from 'react';
import { BookOpen, Search, Clock, CheckCircle2, Play, Pause, Award, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { MENTAL_HACKS } from '../utils/constants';
import { MentalHack } from '../types';
import { useAudio } from '../hooks/useAudio';
import { triggerConfetti } from './Confetti';

interface TheCodexProps {
  onPracticeComplete: (minutes: number) => void;
}

export default function TheCodex({ onPracticeComplete }: TheCodexProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeHack, setActiveHack] = useState<MentalHack | null>(MENTAL_HACKS[0]);
  
  // Practice Mode state
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [practiceSeconds, setPracticeSeconds] = useState<number>(0);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const { playTick, playSuccessChime } = useAudio();

  const categories = ['Todos', 'Mindset', 'Productividad', 'Resiliencia', 'Enfoque'];

  const filteredHacks = MENTAL_HACKS.filter((hack) => {
    const matchesCategory = selectedCategory === 'Todos' || hack.category === selectedCategory;
    const matchesSearch = hack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hack.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Practice mode timer
  useEffect(() => {
    let interval: any = null;
    if (isPracticing && activeHack) {
      interval = setInterval(() => {
        setPracticeSeconds((prev) => {
          const next = prev + 1;
          if (next >= activeHack.durationMinutes * 60) {
            setIsPracticing(false);
            playSuccessChime();
            triggerConfetti();
            onPracticeComplete(activeHack.durationMinutes);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPracticing, activeHack, playSuccessChime, onPracticeComplete]);

  const startPractice = (hack: MentalHack) => {
    setActiveHack(hack);
    setPracticeSeconds(0);
    setCurrentStepIdx(0);
    setIsPracticing(true);
    playTick(800, 'sine', 0.1);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Grimorio de Protocolos de Neuro-Hackeo</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          El Códice Magistral
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Biblioteca de hacks mentales validados por neurociencia para ejecutar en minutos ante cualquier fricción.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="codex-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar hack por palabra clave..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`codex-cat-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Hack List & Hack Detail Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left List */}
        <div className="space-y-3">
          {filteredHacks.map((hack) => {
            const isSelected = activeHack?.id === hack.id;
            return (
              <div
                key={hack.id}
                id={`codex-card-${hack.id}`}
                onClick={() => {
                  setActiveHack(hack);
                  setIsPracticing(false);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-rose-400 border border-rose-500/20">
                    {hack.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{hack.durationMinutes} min</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{hack.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{hack.shortDesc}</p>
              </div>
            );
          })}
        </div>

        {/* Right Inspector & Practice Module */}
        {activeHack && (
          <div className="md:col-span-2 p-8 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                    {activeHack.category} • {activeHack.difficulty}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-100 mt-2">{activeHack.title}</h2>
              </div>

              <button
                id="codex-start-practice-btn"
                onClick={() => startPractice(activeHack)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Práctica Guiada</span>
              </button>
            </div>

            {/* Description & Science */}
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {activeHack.fullDescription}
            </p>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono text-rose-300 block font-bold">Base Neuro-Científica:</span>
                <p className="text-xs text-slate-300 italic mt-0.5">{activeHack.scientificBasis}</p>
              </div>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Instrucciones de Ejecución Paso a Paso:</h3>
              <div className="space-y-2">
                {activeHack.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors ${
                      isPracticing && currentStepIdx === idx
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Timer Overlay Mode */}
            {isPracticing && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-mono text-amber-400 font-bold">Modo de Práctica Activo</span>
                  </div>
                  <span className="text-xl font-mono font-extrabold text-slate-100">
                    {formatTime(practiceSeconds)} / {formatTime(activeHack.durationMinutes * 60)}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (practiceSeconds / (activeHack.durationMinutes * 60)) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    id="codex-pause-practice-btn"
                    onClick={() => setIsPracticing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    Pausar
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
