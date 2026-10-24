import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import DiscoveryPortal from './components/DiscoveryPortal';
import Footer from './components/Footer';
import OraculoChalamandra from './components/OraculoChalamandra';
import SRAPMetronome from './components/SRAPMetronome';
import DecoxMonolith3D from './components/DecoxMonolith3D';
import StrategicImageStudio from './components/StrategicImageStudio';
import ArchetypeQuiz from './components/ArchetypeQuiz';
import PowerLensGenerator from './components/PowerLensGenerator';
import { ActiveView, OracleResponse } from './types';
import { DISCOVERY_SYNTHESIS_STEP } from './data/discoveryFlowConfig';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('discovery');
  const [requestedModule, setRequestedModule] = useState<number | null>(null);
  const [sessionMeta, setSessionMeta] = useState<{
    activeModule: number;
    viewingStartScreen: boolean;
    hasSavedProgress: boolean;
    completionPct: number;
  }>({
    activeModule: 1,
    viewingStartScreen: true,
    hasSavedProgress: false,
    completionPct: 0
  });

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSelectModuleFromNav = useCallback((moduleNum: number) => {
    setActiveView('discovery');
    setRequestedModule(moduleNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleConsumeRequestedModule = useCallback(() => {
    setRequestedModule(null);
  }, []);

  const handleSaveOracleWisdom = useCallback((wisdom: OracleResponse) => {
    try {
      const prevRaw = localStorage.getItem('decox_saved_oracle_wisdom');
      const prev: OracleResponse[] = prevRaw ? JSON.parse(prevRaw) : [];
      localStorage.setItem('decox_saved_oracle_wisdom', JSON.stringify([wisdom, ...prev].slice(0, 20)));
    } catch {}
  }, []);

  return (
    <div className="chalamandra-obsidian-canvas relative min-h-screen flex flex-col text-[#F7F3EA] font-sans selection:bg-[#D4AF37] selection:text-[#07060A]">
      {/* Corona de luz ambiental dorada y ámbar sobre el eje estratégico */}
      <div
        aria-hidden="true"
        className="no-print pointer-events-none fixed inset-x-0 top-0 h-[520px] z-0 bg-[radial-gradient(ellipse_72%_52%_at_50%_-8%,rgba(212,175,55,0.20),rgba(245,158,11,0.07)_54%,transparent_100%)]"
      />

      <Header
        activeView={activeView}
        activeModule={sessionMeta.activeModule}
        viewingStartScreen={sessionMeta.viewingStartScreen}
        hasProgress={sessionMeta.hasSavedProgress}
        completionPct={sessionMeta.completionPct}
        onSelectModule={handleSelectModuleFromNav}
        onOpenStartScreen={() => handleSelectModuleFromNav(0)}
      />

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9">
        {activeView !== 'discovery' && (
          <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl chalamandra-surface-elevated">
            <div className="text-xs font-mono text-[#ECC964]">
              Herramienta complementaria Interactive DecoX · Tu Sesión de Descubrimiento permanece resguardada
            </div>
            <button
              type="button"
              onClick={() => setActiveView('discovery')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg chalamandra-btn-primary font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="tabular-nums">
                Volver a mi Sesión (Fase {String(sessionMeta.activeModule).padStart(2, '0')})
              </span>
            </button>
          </div>
        )}

        {activeView === 'discovery' && (
          <DiscoveryPortal
            setActiveView={setActiveView}
            initialModule={requestedModule}
            onConsumeInitialModule={handleConsumeRequestedModule}
            onSessionMetaChange={setSessionMeta}
          />
        )}

        {activeView === 'oraculo' && (
          <OraculoChalamandra onSaveWisdom={handleSaveOracleWisdom} />
        )}

        {activeView === 'metronome' && <SRAPMetronome />}

        {activeView === 'matrix-3d' && (
          <DecoxMonolith3D setActiveView={setActiveView} standalone />
        )}

        {activeView === 'image-studio' && (
          <StrategicImageStudio
            setActiveView={setActiveView}
            onOpenMapModule={() => handleSelectModuleFromNav(DISCOVERY_SYNTHESIS_STEP)}
          />
        )}

        {activeView === 'quiz' && <ArchetypeQuiz onQuizComplete={() => {}} />}

        {activeView === 'power-lens' && <PowerLensGenerator />}
      </main>

      <Footer
        onOpenStartScreen={() => handleSelectModuleFromNav(0)}
        onSelectModule={handleSelectModuleFromNav}
      />
    </div>
  );
}
