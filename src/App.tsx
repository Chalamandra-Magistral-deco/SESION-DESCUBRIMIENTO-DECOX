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

const THEME_STORAGE_KEY = 'chalamandra_discovery_theme';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) return saved === 'dark';
    } catch {}
    return true;
  });

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
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors">
      <Header
        activeView={activeView}
        activeModule={sessionMeta.activeModule}
        viewingStartScreen={sessionMeta.viewingStartScreen}
        hasProgress={sessionMeta.hasSavedProgress}
        completionPct={sessionMeta.completionPct}
        onSelectModule={handleSelectModuleFromNav}
        onOpenStartScreen={() => handleSelectModuleFromNav(0)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView !== 'discovery' && (
          <div className="no-print mb-6 flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-amber-500/30">
            <div className="text-xs font-mono text-amber-300">
              HERRAMIENTA COMPLEMENTARIA SRAP · Tu Sesión de Descubrimiento permanece guardada
            </div>
            <button
              type="button"
              onClick={() => setActiveView('discovery')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                Volver a mi Sesión (Paso {String(sessionMeta.activeModule).padStart(2, '0')})
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
