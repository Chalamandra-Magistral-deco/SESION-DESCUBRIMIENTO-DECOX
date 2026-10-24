import { useState } from 'react';
import { Target, CheckCircle2, RotateCcw, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { ARCHETYPES, QUIZ_QUESTIONS } from '../utils/constants';
import { Archetype } from '../types';
import { useAudio } from '../hooks/useAudio';
import { triggerConfetti } from './Confetti';

interface ArchetypeQuizProps {
  onQuizComplete: (archetypeId: string) => void;
}

export default function ArchetypeQuiz({ onQuizComplete }: ArchetypeQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, number>>({
    arquitecto: 0,
    alquimista: 0,
    comandante: 0,
    sabio: 0
  });
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const { playTick, playSuccessChime } = useAudio();

  const handleSelectOption = (archetypeId: string, points: number, optionIdx: number) => {
    playTick(700, 'sine', 0.05);

    const newScores = { ...scores, [archetypeId]: scores[archetypeId] + points };
    setScores(newScores);

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIdx;
    setSelectedAnswers(newAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
      playSuccessChime();
      triggerConfetti();

      // Find highest scoring archetype
      let maxScore = -1;
      let winningId = 'arquitecto';
      (Object.entries(newScores) as [string, number][]).forEach(([id, val]) => {
        if (val > maxScore) {
          maxScore = val;
          winningId = id;
        }
      });
      onQuizComplete(winningId);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScores({ arquitecto: 0, alquimista: 0, comandante: 0, sabio: 0 });
    setSelectedAnswers([]);
    setCompleted(false);
  };

  const getWinningArchetype = (): Archetype => {
    let maxScore = -1;
    let winningId = 'arquitecto';
    (Object.entries(scores) as [string, number][]).forEach(([id, val]) => {
      if (val > maxScore) {
        maxScore = val;
        winningId = id;
      }
    });
    return ARCHETYPES[winningId] || ARCHETYPES.arquitecto;
  };

  const totalPoints: number = (Object.values(scores) as number[]).reduce((a: number, b: number) => a + b, 0) || 1;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Target className="w-3.5 h-3.5" />
          <span>Evaluación Neuro-Psicológica</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Quiz de Arquetipos de Dominio
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Descubre tu modelo mental dominante y recibe la estrategia exacta para neutralizar tus puntos ciegos.
        </p>
      </div>

      {!completed ? (
        /* Question Card */
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-4">
            <span>Pregunta {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}</span>
            <span className="text-emerald-400 font-bold">
              {Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100)}% Completado
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
            {QUIZ_QUESTIONS[currentQuestionIndex].question}
          </h2>

          <div className="space-y-3">
            {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
              <button
                key={idx}
                id={`quiz-opt-${currentQuestionIndex}-${idx}`}
                onClick={() => handleSelectOption(opt.archetypeId, opt.points, idx)}
                className="w-full text-left p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-slate-200 text-sm leading-relaxed transition-all cursor-pointer flex items-center justify-between group"
              >
                <span>{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Tu Arquetipo Principal</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono">
              {getWinningArchetype().name}
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto italic">
              "{getWinningArchetype().tagline}"
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            {getWinningArchetype().description}
          </p>

          {/* Radar / Score Progress Bars */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Desglose de Puntuación por Arquetipo
            </h3>
            {Object.entries(ARCHETYPES).map(([id, arch]) => {
              const scoreVal = scores[id] || 0;
              const percentage = Math.round((scoreVal / totalPoints) * 100);
              const isWinner = id === getWinningArchetype().id;

              return (
                <div key={id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-semibold ${isWinner ? 'text-amber-400' : 'text-slate-300'}`}>
                      {arch.name} {isWinner && '(Dominante)'}
                    </span>
                    <span className="font-mono text-slate-400">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isWinner ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-slate-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strengths & Blindspots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Fortalezas Clave</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {getWinningArchetype().strengths.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Puntos Ciegos Tácticos</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {getWinningArchetype().blindspots.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Callout */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-mono text-amber-300 block font-bold">Hack Recomendado:</span>
                <span className="text-sm font-bold text-slate-100">{getWinningArchetype().recommendedHack}</span>
              </div>
            </div>
            <button
              id="quiz-reset-btn"
              onClick={resetQuiz}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
