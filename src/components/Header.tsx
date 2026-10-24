import React from 'react';
import { FileText } from 'lucide-react';
import { ActiveView } from '../types';
import {
  DISCOVERY_PHASE_GROUPS,
  DISCOVERY_REPORT_STEP
} from '../data/discoveryFlowConfig';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  activeView: ActiveView;
  activeModule: number;
  viewingStartScreen: boolean;
  hasProgress: boolean;
  completionPct: number;
  onSelectModule: (moduleNum: number) => void;
  onOpenStartScreen: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({
  activeView,
  activeModule,
  viewingStartScreen,
  hasProgress,
  completionPct,
  onSelectModule,
  onOpenStartScreen,
  darkMode,
  setDarkMode
}: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-40 backdrop-blur-md bg-slate-950/90 border-b border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <button
          type="button"
          onClick={onOpenStartScreen}
          className="flex items-center gap-3 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl shrink-0"
        >
          <img
            src="/images/chalamandra-emblem.jpg"
            alt="Emblema Salamandra Chalamandra Magistral DecoX"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-lg object-cover ring-1 ring-amber-500/40 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-100 tracking-tight whitespace-nowrap">
              <span>Chalamandra Magistral</span>
              <span className="text-amber-400 font-mono text-xs font-semibold">DecoX</span>
            </div>
            <div className="text-xs text-slate-400 whitespace-nowrap">Sesión de Descubrimiento</div>
          </div>
        </button>

        {/* Desktop Methodological World Navigation */}
        <nav
          aria-label="Fases de la Sesión de Descubrimiento"
          className="hidden lg:flex items-center gap-1.5"
        >
          {DISCOVERY_PHASE_GROUPS.map((phase) => {
            const isActive =
              activeView === 'discovery' &&
              !viewingStartScreen &&
              activeModule >= phase.startStep &&
              activeModule <= phase.endStep;
            const isPast =
              activeView === 'discovery' &&
              !viewingStartScreen &&
              activeModule > phase.endStep;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => onSelectModule(phase.startStep)}
                aria-current={isActive ? 'step' : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                    : isPast
                    ? 'text-emerald-300 hover:bg-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-mono tabular-nums mr-1.5 opacity-80">{phase.code} ·</span>
                <span>{phase.shortTitle}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {hasProgress &&
            (viewingStartScreen ||
              activeModule !== DISCOVERY_REPORT_STEP ||
              activeView !== 'discovery') && (
              <button
                type="button"
                onClick={() => onSelectModule(DISCOVERY_REPORT_STEP)}
                className="hidden sm:flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-slate-700 hover:border-amber-500 text-xs font-semibold text-slate-200 cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Informe Ejecutivo</span>
              </button>
            )}

          <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        </div>
      </div>

      {/* Mobile & Tablet Phase Strip */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-slate-900 gap-1.5 scrollbar-none">
        {DISCOVERY_PHASE_GROUPS.map((phase) => {
          const isActive =
            activeView === 'discovery' &&
            !viewingStartScreen &&
            activeModule >= phase.startStep &&
            activeModule <= phase.endStep;
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelectModule(phase.startStep)}
              aria-current={isActive ? 'step' : undefined}
              className={`min-h-9 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="font-mono tabular-nums mr-1">{phase.code} ·</span>
              <span>{phase.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Discreet Linear Progress Bar */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={completionPct}
        aria-label="Progreso de respuestas de la sesión"
        className="h-0.5 w-full bg-slate-900 overflow-hidden"
      >
        <div
          className="h-full bg-amber-500 transition-all duration-300 ease-out"
          style={{ width: `${completionPct}%` }}
        />
      </div>
    </header>
  );
}
