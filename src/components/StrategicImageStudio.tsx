import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Sliders,
  Download,
  Share2,
  RefreshCw,
  Wand2,
  Layers,
  CheckCircle2,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { ActiveView } from '../types';

interface StrategicImageStudioProps {
  setActiveView?: (view: ActiveView) => void;
  onOpenMapModule?: () => void;
}

export default function StrategicImageStudio({ setActiveView, onOpenMapModule }: StrategicImageStudioProps) {
  const [prompt, setPrompt] = useState<string>(
    'Centro de mando ejecutivo de Chalamandra Magistral con holograma dorado de la Salamandra emblemática sobre un Mapa Estratégico de Descubrimiento'
  );
  const [stylePreset, setStylePreset] = useState<'cinematic' | 'cyber_obsidian' | 'blueprint' | 'watercolor'>('cinematic');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>(
    '/images/sesion-descubrimiento-hero.jpg'
  );

  // Image editing filters
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(105);
  const [goldTint, setGoldTint] = useState<number>(10);
  const [showTacticalWatermark, setShowTacticalWatermark] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  const promptPresets = [
    {
      title: 'Centro de Mando Salamandra',
      text: 'Centro de mando ejecutivo con el emblema holográfico de la Salamandra en oro de 24k proyectado sobre un mapa estratégico a 90 días, cristal de obsidiana y metrópoli nocturna'
    },
    {
      title: 'Foso Defensivo Táctico',
      text: 'Escultura y sello de Salamandra dorada en el centro de anillos concéntricos de foso defensivo sobre base de obsidiana negra pulida, estética de hiper-lujo minimalista'
    },
    {
      title: 'Laboratorio Neuro-Somático',
      text: 'Cápsula de alta concentración cognitiva con emblema luminoso de Salamandra ámbar, metrónomo de pulso cuántico y resonancia biológica'
    },
    {
      title: 'Matriz de Decisión Fría',
      text: 'Monolito geométrico grabado con el escudo de la Salamandra dorada, datos fríos en pantallas de zafiro y atmósfera ejecutiva silenciosa'
    }
  ];

  const handleGenerate = async (targetPrompt?: string) => {
    const textToUse = targetPrompt || prompt;
    if (!textToUse.trim()) return;

    setIsGenerating(true);
    setNotification('Sintetizando imagen con motor de IA...');

    try {
      const response = await fetch('/api/image-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToUse,
          style: stylePreset,
          aspect: aspectRatio
        })
      });

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setCurrentImage(data.imageUrl);
        setNotification('¡Imagen estratégica generada y montada con éxito!');
      } else {
        throw new Error(data.error || 'Error al generar la imagen');
      }
    } catch (err: any) {
      setNotification(`Uso de imagen táctica oficial Chalamandra: ${err.message || 'Listo'}`);
      setCurrentImage('/images/sesion-descubrimiento-hero.jpg');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `decox-vision-estrategica-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToDeliverable = () => {
    try {
      localStorage.setItem('decox_deliverable_custom_visual', currentImage);
      setNotification('¡Imagen guardada como portada de tu Mapa Estratégico de Descubrimiento!');
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {}
  };

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto text-slate-100">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ESTUDIO VISUAL MAGISTRAL • IMAGINACIÓN ESTRATÉGICA (HACK #7)</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Generador & Editor de Visiones <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
            Estratégicas del 1%
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Crea y refina mediante prompts visualizaciones tangibles de tu foso defensivo, tu centro de comando o tu plan a 90 días. Integra la visión directamente a tu entregable.
        </p>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Prompt Input & Presets & Filters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Prompt Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                <span>Prompt del Arquitecto</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">Gemini Nano / Imagen</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe la escena, foso defensivo o ambiente de comando..."
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none leading-relaxed"
            />

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Plantillas Estratégicas Rápidas:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {promptPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(preset.text);
                      handleGenerate(preset.text);
                    }}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-left text-[11px] text-slate-300 transition-all cursor-pointer"
                  >
                    <span className="font-semibold text-amber-400 block truncate">{preset.title}</span>
                    <span className="text-[10px] text-slate-500 block truncate">Cargar & Generar</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Style Selectors */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Aspect Ratio</label>
                <div className="flex gap-1.5">
                  {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 py-1.5 rounded-xl text-[10px] font-mono cursor-pointer border ${
                        aspectRatio === ratio
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Estilo Visual</label>
                <select
                  value={stylePreset}
                  onChange={(e) => setStylePreset(e.target.value as any)}
                  className="w-full p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="cinematic">Cinemático Lujo</option>
                  <option value="cyber_obsidian">Cyber Obsidiana</option>
                  <option value="blueprint">Blueprint Técnico</option>
                  <option value="watercolor">Acuarela Conceptual</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-950/40 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sintetizando Visión...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar / Actualizar Visión con IA</span>
                </>
              )}
            </button>
          </div>

          {/* Image Editor Controls (Brightness, Contrast, Gold Tint) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Controles de Retoque & Acabado</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Brillo</span>
                  <span className="text-amber-400">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Contraste</span>
                  <span className="text-amber-400">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Tinte Ámbar / Oro</span>
                  <span className="text-amber-400">{goldTint}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={goldTint}
                  onChange={(e) => setGoldTint(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-300">Sello Táctico Decox Magistral</span>
                <input
                  type="checkbox"
                  checked={showTacticalWatermark}
                  onChange={(e) => setShowTacticalWatermark(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Canvas & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-950 shadow-2xl group">
            {/* The Visual Image with dynamic CSS filter */}
            <img
              src={currentImage}
              alt="Visión Estratégica Decox Magistral"
              referrerPolicy="no-referrer"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%) sepia(${goldTint}%)`
              }}
              className="w-full h-auto max-h-[540px] object-cover object-center transition-all duration-300"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />

            {/* Tactical Watermark with Official Salamander Logo */}
            {showTacticalWatermark && (
              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-[10px] font-mono text-amber-400 flex items-center gap-2">
                <img
                  src="/images/chalamandra-emblem.jpg"
                  alt="Logo Salamandra"
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400/50"
                />
                <span>CHALAMANDRA MAGISTRAL • VISIÓN DE DESCUBRIMIENTO</span>
              </div>
            )}

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                Interpretación Visual del Desafío
              </span>
              <p className="text-slate-200 font-medium line-clamp-2">
                {prompt}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-xs text-slate-200 hover:text-amber-300 font-medium cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Descargar JPG</span>
              </button>
              <button
                type="button"
                onClick={handleSaveToDeliverable}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs text-amber-300 font-semibold cursor-pointer transition-all"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Vincular al Mapa de Descubrimiento</span>
              </button>
            </div>

            {(onOpenMapModule || setActiveView) && (
              <button
                type="button"
                onClick={() => {
                  if (onOpenMapModule) {
                    onOpenMapModule();
                  } else if (setActiveView) {
                    setActiveView('discovery');
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <span>Ver en Mapa de la Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
