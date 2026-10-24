import { useState } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { PowerLensDomain } from '../types';
import {
  PODERES_SHEREZADE_DATA,
  POWER_LENS_DOMAINS,
  buildLocalPowerLensDirective
} from '../data/interactiveCatalog';
import { useAudio } from '../hooks/useAudio';

export default function PowerLensGenerator() {
  const [selectedPoderId, setSelectedPoderId] = useState<number>(PODERES_SHEREZADE_DATA[0].id);
  const [selectedDomain, setSelectedDomain] = useState<PowerLensDomain>('Negocios');
  const [contextNote, setContextNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    directive: string;
    source: 'ai' | 'local';
    notice?: string;
  } | null>(null);

  const { playSuccessChime, playTick } = useAudio();

  const activePoder =
    PODERES_SHEREZADE_DATA.find((p) => p.id === selectedPoderId) || PODERES_SHEREZADE_DATA[0];

  const handleGenerateLens = async () => {
    setLoading(true);
    playTick(650, 'sine', 0.06);

    try {
      const res = await fetch('/api/discovery/power-lens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poderTitle: activePoder.title,
          domain: selectedDomain,
          criticalFriction: contextNote
        })
      });
      const json = await res.json();
      if (res.ok && json.success && json.directive) {
        setResult({
          directive: json.directive,
          source: json.source === 'ai' ? 'ai' : 'local',
          notice: json.engineNotice
        });
      } else {
        setResult({
          directive: buildLocalPowerLensDirective({
            poderTitle: activePoder.title,
            domain: selectedDomain,
            criticalFriction: contextNote
          }),
          source: 'local',
          notice: json?.error
        });
      }
      playSuccessChime();
    } catch {
      setResult({
        directive: buildLocalPowerLensDirective({
          poderTitle: activePoder.title,
          domain: selectedDomain,
          criticalFriction: contextNote
        }),
        source: 'local'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fadeIn">
      <div className="space-y-2 border-b border-[#D4AF37]/20 pb-5">
        <span className="text-xs font-mono text-[#E8C766] block">
          Herramienta complementaria · Interactive DecoX
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F2EB] tracking-tight text-balance">
          Generador de Lentes de Poder
        </h1>
        <p className="text-sm text-[#B8B2A6] max-w-2xl leading-relaxed">
          Cruza uno de los Siete Poderes de Sherezade con el dominio real de tu caso para obtener una directiva concisa de enfoque estratégico.
        </p>
      </div>

      <div className="p-7 sm:p-8 rounded-2xl chalamandra-surface space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#F3DC9B] mb-1.5">
              01. Poder de Sherezade (`PODERES_SHEREZADE_DATA`)
            </label>
            <select
              value={selectedPoderId}
              onChange={(e) => setSelectedPoderId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs"
            >
              {PODERES_SHEREZADE_DATA.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0B0D13] text-[#F5F2EB]">
                  {p.id}. {p.title} — {p.proposito}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#A8A39A] mt-1.5 leading-relaxed">{activePoder.poder}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F3DC9B] mb-1.5">
              02. Dominio del caso
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value as PowerLensDomain)}
              className="w-full px-3.5 py-2.5 rounded-xl chalamandra-input text-xs"
            >
              {POWER_LENS_DOMAINS.map((dom) => (
                <option key={dom} value={dom} className="bg-[#0B0D13] text-[#F5F2EB]">
                  {dom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#F3DC9B] mb-1.5">
            03. Fricción o foco concreto (opcional)
          </label>
          <textarea
            rows={3}
            value={contextNote}
            onChange={(e) => setContextNote(e.target.value)}
            placeholder="Describe brevemente el bloqueo o decisión concreta sobre la que quieres aplicar el lente..."
            className="w-full px-4 py-3 rounded-xl chalamandra-input text-xs leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerateLens}
            className="flex items-center gap-2 px-5 py-3 rounded-xl chalamandra-btn-primary font-bold text-xs cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>Generando Lente...</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 shrink-0" />
                <span>Generar Lente de Poder</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="p-6 sm:p-7 rounded-2xl chalamandra-surface-elevated border-violet-400/35 space-y-3 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-violet-300">
            <span>
              {activePoder.title} · {selectedDomain}
            </span>
            <span className="text-[#A8A39A]">
              Origen: {result.source === 'ai' ? 'Motor IA externo' : 'Motor local determinista'}
            </span>
          </div>
          <p className="text-sm text-[#F5F2EB] leading-relaxed">{result.directive}</p>
          {result.notice && (
            <p className="text-[11px] font-mono text-[#A8A39A]">{result.notice}</p>
          )}
        </div>
      )}
    </div>
  );
}
