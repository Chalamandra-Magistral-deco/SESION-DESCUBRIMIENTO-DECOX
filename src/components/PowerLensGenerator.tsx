import { useState } from 'react';
import { Compass, Sparkles, RefreshCw, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { triggerConfetti } from './Confetti';

export default function PowerLensGenerator() {
  const [problemText, setProblemText] = useState<string>('');
  const [selectedLens, setSelectedLens] = useState<string>('Stoic Reframe');
  const [loading, setLoading] = useState<boolean>(false);
  const [reframedOutput, setReframedOutput] = useState<{
    newPerspective: string;
    hiddenOpportunity: string;
    microActionSteps: string[];
  } | null>(null);

  const { playSuccessChime, playTick } = useAudio();

  const lenses = [
    { id: 'Stoic Reframe', title: 'Lente Estoico', desc: 'Disocia lo que está bajo tu control directo de las variables externas.' },
    { id: 'Oportunidad Oculta', title: 'Lente de Oportunidad', desc: 'Encuentra la ventaja estratégica que la crisis contiene.' },
    { id: 'Inversión Total', title: 'Lente de Inversión', desc: 'Pregunta qué tendrías que hacer para empeorar el problema y haz lo opuesto.' },
    { id: 'Abundancia Cuántica', title: 'Lente de Abundancia', desc: 'Sustituye el enfoque en escasez de recursos por creatividad de apalancamiento.' }
  ];

  const handleGenerateLens = () => {
    if (!problemText.trim()) return;

    setLoading(true);
    setReframedOutput(null);
    playTick(650, 'sine', 0.08);

    setTimeout(() => {
      let output = {
        newPerspective: `Al aplicar la ${selectedLens} a: "${problemText}", eliminamos la historia trágica. Esto no es un callejón sin salida, es un filtro de resistencia que la mayoría abandonará. Tu ventaja es mantener la calma mientras otros caen en pánico.`,
        hiddenOpportunity: `Este bloqueo te fuerza a optimizar tu proceso sin depender de recursos externos. Es la oportunidad perfecta para automatizar o delegar el cuello de botella.`,
        microActionSteps: [
          'Acepta el estado actual fríamente sin añadir drama emocional.',
          'Aísla el 20% del problema que causa el 80% del estrés.',
          'Ejecuta una prueba piloto de solución en las próximas 2 horas.'
        ]
      };

      setReframedOutput(output);
      setLoading(false);
      playSuccessChime();
      triggerConfetti();
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono">
          <Compass className="w-3.5 h-3.5" />
          <span>Generador de Reencuadre Cognitivo</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Power Lens Generator
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Cambia la lente con la que observas cualquier dilema para desarticular la parálisis mental y encontrar salidas inmediatas.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-yellow-500/30 shadow-2xl space-y-6">
        {/* Lens Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Selecciona tu Lente Cognitiva:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lenses.map((lens) => (
              <button
                key={lens.id}
                id={`lens-opt-${lens.id}`}
                onClick={() => setSelectedLens(lens.id)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  selectedLens === lens.id
                    ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-300 shadow-md ring-1 ring-yellow-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-bold text-xs text-slate-200 block">{lens.title}</span>
                <p className="text-[11px] text-slate-400 leading-snug">{lens.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Problem Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            2. Describe la Fricción o Bloqueo Actual:
          </label>
          <textarea
            id="lens-problem-input"
            rows={3}
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="Ejemplo: 'Tengo un cliente muy exigente que cambió el presupuesto a mitad de camino y no sé cómo responder sin perder el contrato...'"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-yellow-500/30 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            id="lens-generate-btn"
            disabled={loading || !problemText.trim()}
            onClick={handleGenerateLens}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-yellow-950/40 disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Enfocando Lente...</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Generar Perspectiva Reencuadrada</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reframed Output Card */}
      {reframedOutput && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-yellow-500/40 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-yellow-400 uppercase tracking-wider block">Resultado con {selectedLens}</span>
              <h3 className="text-xl font-bold text-slate-100">Nueva Realidad Táctica</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-xs font-mono text-yellow-400 font-bold block">Reencuadre Principal:</span>
              <p className="text-sm text-slate-200 leading-relaxed">{reframedOutput.newPerspective}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-bold block">Oportunidad Estratégica Oculta:</span>
              <p className="text-sm text-slate-200 leading-relaxed">{reframedOutput.hiddenOpportunity}</p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Micro-Acciones de Desbloqueo:</span>
              <div className="space-y-2">
                {reframedOutput.microActionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
