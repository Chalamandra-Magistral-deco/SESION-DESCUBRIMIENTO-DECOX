import { useState } from 'react';
import { Target, CheckCircle2, RotateCcw, ArrowRight, Award } from 'lucide-react';
import { ARCHETYPES, QUIZ_QUESTIONS } from '../utils/constants';
import { Archetype, InteractiveArchetype } from '../types';
import { useAudio } from '../hooks/useAudio';
import { triggerConfetti } from './Confetti';

interface ArchetypeQuizProps {
  onQuizComplete: (archetypeId: InteractiveArchetype) => void;
}

const INITIAL_SCORES: Record<InteractiveArchetype, number> = {
  'El Arquitecto': 0,
  'El Alquimista': 0,
  'El Explorador': 0
};

export default function ArchetypeQuiz({ onQuizComplete }: ArchetypeQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [scores, setScores] = useState<Record<InteractiveArchetype, number>>(INITIAL_SCORES);
  const [completed, setCompleted] = useState<boolean>(false);
  const { playTick, playSuccessChime } = useAudio();

  const handleSelectOption = (archetypeId: InteractiveArchetype, points: number) => {
    playTick(700, 'sine', 0.05);

    const newScores: Record<InteractiveArchetype, number> = {
      ...scores,
      [archetypeId]: (scores[archetypeId] || 0) + points
    };
    setScores(newScores);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
      playSuccessChime();
      triggerConfetti();

      let maxScore = -1;
      let winningId: InteractiveArchetype = 'El Arquitecto';
      (Object.entries(newScores) as [InteractiveArchetype, number][]).forEach(([id, val]) => {
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
    setScores(INITIAL_SCORES);
    setCompleted(false);
  };

  const getWinningArchetype = (): Archetype => {
    let maxScore = -1;
    let winningId: InteractiveArchetype = 'El Arquitecto';
    (Object.entries(scores) as [InteractiveArchetype, number][]).forEach(([id, val]) => {
      if (val > maxScore) {
        maxScore = val;
        winningId = id;
      }
    });
    return ARCHETYPES[winningId] || ARCHETYPES['El Arquitecto'];
  };

  const totalPoints: number =
    (Object.values(scores) as number[]).reduce((a: number, b: number) => a + b, 0) || 1;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 animate-fadeIn">
      <div className="space-y-2 border-b border-[#D4AF37]/20 pb-5">
        <span className="text-xs font-mono text-violet-300/90 block">
          Test oficial Interactive DecoX · 10 preguntas
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F2EB] tracking-tight text-balance">
          Test de Arquetipo (Hipótesis Operativa)
        </h1>
        <p className="text-sm text-[#B8B2A6] max-w-2xl leading-relaxed">
          Explora cuál de los tres arquetipos del catálogo de Interactive (El Arquitecto, El Alquimista o El Explorador) predomina hoy como punto de partida revisable, nunca como etiqueta fija.
        </p>
      </div>

      {!completed ? (
        <div className="p-7 sm:p-8 rounded-2xl chalamandra-surface space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#A8A39A] border-b border-[#D4AF37]/15 pb-4 tabular-nums">
            <span>
              Pregunta {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-[#F3DC9B] font-semibold">
              {Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100)}%
            </span>
          </div>

          <h2 className="font-display text-lg sm:text-xl font-semibold text-[#F5F2EB] leading-snug">
            {QUIZ_QUESTIONS[currentQuestionIndex].question}
          </h2>

          <div className="space-y-3">
            {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
              <button
                key={idx}
                id={`quiz-opt-${currentQuestionIndex}-${idx}`}
                type="button"
                onClick={() => handleSelectOption(opt.archetypeId, opt.points)}
                className="w-full text-left p-4 rounded-xl bg-[#07080C] hover:bg-[#11141E] border border-[#252938] hover:border-[#D4AF37]/50 text-[#EAE4D8] text-sm leading-relaxed transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-[#8C867A] group-hover:text-[#D4AF37] transition-colors shrink-0 ml-3" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-7 sm:p-8 rounded-2xl chalamandra-surface-elevated space-y-6 animate-fadeIn">
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-violet-300 block">
              Hipótesis de estilo actual (revisable con hechos)
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F2EB]">
              {getWinningArchetype().name}
            </h2>
            <p className="text-sm text-[#D1CCC0]">{getWinningArchetype().tagline}</p>
          </div>

          <p className="text-xs sm:text-sm text-[#D1CCC0] leading-relaxed chalamandra-chamber p-4 rounded-xl">
            {getWinningArchetype().description}
          </p>

          <div className="p-5 rounded-xl chalamandra-chamber space-y-3">
            <h3 className="text-xs font-semibold text-[#F3DC9B]">
              Distribución en los 3 arquetipos reales de Interactive
            </h3>
            {Object.entries(ARCHETYPES).map(([id, arch]) => {
              const scoreVal = scores[id as InteractiveArchetype] || 0;
              const percentage = Math.round((scoreVal / totalPoints) * 100);
              const isWinner = id === getWinningArchetype().id;

              return (
                <div key={id} className="space-y-1">
                  <div className="flex justify-between text-xs tabular-nums">
                    <span className={`font-semibold ${isWinner ? 'text-[#F3DC9B]' : 'text-[#D1CCC0]'}`}>
                      {arch.name}
                    </span>
                    <span className="font-mono text-[#A8A39A]">{percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-sm bg-[#161A26] overflow-hidden">
                    <div
                      className={`h-full ${
                        isWinner
                          ? 'bg-gradient-to-r from-[#B58E24] to-[#F3DC9B]'
                          : 'bg-[#383E52]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl chalamandra-chamber space-y-2">
              <h4 className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fortalezas potenciales</span>
              </h4>
              <ul className="space-y-1 text-xs text-[#D1CCC0]">
                {getWinningArchetype().strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl chalamandra-chamber space-y-2">
              <h4 className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Puntos ciegos a vigilar</span>
              </h4>
              <ul className="space-y-1 text-xs text-[#D1CCC0]">
                {getWinningArchetype().blindspots.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl chalamandra-chamber flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div className="text-xs">
                <span className="font-mono text-[#A8A39A] block">Hacks afines en catálogo:</span>
                <span className="font-semibold text-[#F5F2EB]">{getWinningArchetype().recommendedHack}</span>
              </div>
            </div>
            <button
              id="quiz-reset-btn"
              type="button"
              onClick={resetQuiz}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Repetir test</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
