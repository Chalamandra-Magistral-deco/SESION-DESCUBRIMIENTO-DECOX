import { useState } from 'react';
import { Bot, Sparkles, Send, Copy, BookmarkCheck, Volume2, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { OracleResponse } from '../types';
import { useAudio } from '../hooks/useAudio';
import { triggerConfetti } from './Confetti';

interface OraculoChalamandraProps {
  onSaveWisdom: (wisdom: OracleResponse) => void;
}

export default function OraculoChalamandra({ onSaveWisdom }: OraculoChalamandraProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Reconfiguración Mindset');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<OracleResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const { playSuccessChime, playTick } = useAudio();

  const categories = [
    'Reconfiguración Mindset',
    'Desbloqueo Emocional',
    'Estrategia Empresarial',
    'Claridad Operativa',
    'Transmutación de Fuego'
  ];

  const presetQuestions = [
    '¿Cómo supero la parálisis por análisis en un proyecto clave?',
    'Siento fricción al delegar tareas estratégicas, ¿qué reencuadre necesito?',
    '¿Cómo elimino el miedo al fracaso en una decisión de alto riesgo?',
    'Tengo dispersión de foco entre 3 metas distintas, ¿cómo elijo la principal?'
  ];

  const handleConsult = async (customPrompt?: string) => {
    const textToQuery = customPrompt || prompt;
    if (!textToQuery.trim()) return;

    setLoading(true);
    setResponse(null);
    setSaved(false);
    playTick(600, 'sine', 0.1);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToQuery,
          category: selectedCategory
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResponse(json.data);
        playSuccessChime();
        triggerConfetti();
      } else {
        throw new Error('Sin respuesta');
      }
    } catch (err) {
      // Fallback local oracle response
      setResponse({
        mantra: 'EL CAOS ES SOLO INFORMACIÓN NO PROCESADA.',
        diagnostico: `Para tu consulta sobre "${textToQuery}", el freno principal es la resistencia al primer movimiento. La mente busca certeza completa antes de actuar, cuando la certeza solo se crea mediante la acción.`,
        protocolo24h: [
          'Aplica el Hack de los 5 Segundos para iniciar la tarea más temida.',
          'Define la métrica única de éxito antes de las 14:00 hrs.',
          'Ejecuta 7 minutos de Metrónomo SRAP a 60 BPM al despertar.'
        ],
        preguntaReflexion: '¿Qué pasaría si dejas de pedir permiso a tu duda y actúas en frío?'
      });
      playSuccessChime();
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    const text = `=== ORÁCULO CHALAMANDRA ===\nMantra: ${response.mantra}\n\nDiagnóstico: ${response.diagnostico}\n\nProtocolo 24h:\n${response.protocolo24h.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nPregunta: ${response.preguntaReflexion}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!response) return;
    onSaveWisdom(response);
    setSaved(true);
  };

  const handleSpeech = () => {
    if (!response || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(`${response.mantra}. ${response.diagnostico}`);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono">
          <Bot className="w-3.5 h-3.5" />
          <span>Núcleo de Inteligencia Estratégica AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          El Oráculo Chalamandra
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Plantea tu obstáculo actual. La inteligencia estratégica de Decox diagnosticará el patrón y entregará tu protocolo de 24 horas.
        </p>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`oracle-cat-${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Input Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Consulta Estratégica al Oráculo:
          </label>
          <div className="relative">
            <textarea
              id="oracle-prompt-textarea"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ejemplo: 'Siento mucha resistencia para lanzar mi oferta comercial por miedo a no estar listo...'"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-purple-500/30 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Preset Questions */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-slate-400 block">Consultas Frecuentes Tácticas:</span>
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(q);
                  handleConsult(q);
                }}
                className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-purple-500/30 transition-colors cursor-pointer"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            id="oracle-submit-btn"
            disabled={loading || !prompt.trim()}
            onClick={() => handleConsult()}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-950/50 disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Canalizando Diagnóstico...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Revelar Mantra y Protocolo</span>
                <Send className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Oracle Answer Card */}
      {response && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-6 animate-fadeIn">
          {/* Mantra Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-amber-500/30 text-center space-y-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Mantra Magistral</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-wide font-mono">
              "{response.mantra}"
            </h2>
          </div>

          {/* Diagnostico */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Diagnóstico Psicológico & Estratégico</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {response.diagnostico}
            </p>
          </div>

          {/* Protocolo 24h */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Protocolo de Acción Táctica en 24 Horas</span>
            </h3>
            <div className="space-y-2">
              {response.protocolo24h.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pregunta Reflexion */}
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3">
            <Bot className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono text-purple-300 block font-bold">Pregunta Disruptiva:</span>
              <p className="text-sm text-slate-200 italic mt-0.5">"{response.preguntaReflexion}"</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                id="oracle-save-btn"
                onClick={handleSave}
                disabled={saved}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  saved
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                }`}
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>{saved ? 'Guardado en Mi Panel' : 'Guardar en Cuaderno'}</span>
              </button>

              <button
                id="oracle-copy-btn"
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4 text-slate-400" />
                <span>{copied ? '¡Copiado!' : 'Copiar Protocolo'}</span>
              </button>
            </div>

            <button
              id="oracle-audio-btn"
              onClick={handleSpeech}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Escuchar en Voz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
