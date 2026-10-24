import React from 'react';
import { FileText, Compass, Home } from 'lucide-react';
import { ActiveView } from '../types';
import {
  DISCOVERY_FIVE_PHASES,
  DISCOVERY_REPORT_STEP
} from '../data/discoveryFlowConfig';
import { ChalamandraMedallion } from './ChalamandraSeal';

interface HeaderProps {
  activeView: ActiveView;
  activeModule: number;
  viewingStartScreen: boolean;
  hasProgress: boolean;
  completionPct: number;
  onSelectModule: (moduleNum: number) => void;
  onOpenStartScreen: () => void;
}

export default function Header({
  activeView,
  activeModule,
  viewingStartScreen,
  hasProgress,
  completionPct,
  onSelectModule,
  onOpenStartScreen
}: HeaderProps) {
  return (
    <header className="site-header no-print sticky top-0 z-40 backdrop-blur-xl bg-[#09080E]/92 border-b border-[#D4AF37]/38 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.85)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zona 1: Emblema oficial + Wordmark */}
        <button
          type="button"
          onClick={onOpenStartScreen}
          className="flex items-center gap-2 sm:gap-3 min-w-0 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ECC964] rounded-lg shrink"
          title="Ir a la Portada de la Sesión de Descubrimiento"
        >
          <ChalamandraMedallion size="md" />
          <span className="font-display text-[10px] sm:text-base leading-tight font-semibold tracking-wide text-[#F7F3EA] group-hover:text-[#FFF0BE] transition-colors whitespace-normal sm:whitespace-nowrap min-w-0">
            Chalamandra Magistral <span className="text-[#ECC964]">DecoX</span>
          </span>
        </button>

        {/* Zona 2: Navegación tipográfica limpia de las 5 Fases */}
        <nav
          aria-label="Cinco fases de la Sesión de Descubrimiento"
          className="hidden lg:flex items-center gap-5"
        >
          {DISCOVERY_FIVE_PHASES.map((phase) => {
            const isActive =
              activeView === 'discovery' &&
              !viewingStartScreen &&
              activeModule === phase.num;
            const isPast =
              activeView === 'discovery' &&
              !viewingStartScreen &&
              activeModule > phase.num;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => onSelectModule(phase.num)}
                aria-current={isActive ? 'step' : undefined}
                className={`relative py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ECC964] rounded ${
                  isActive
                    ? 'text-[#FFF0BE] font-semibold'
                    : isPast
                    ? 'text-emerald-300 hover:text-emerald-200'
                    : 'text-[#C4BCAD] hover:text-[#FFF0BE]'
                }`}
              >
                <span
                  className={`font-mono tabular-nums mr-1.5 text-[11px] ${
                    isActive ? 'text-[#ECC964]' : isPast ? 'text-emerald-400' : 'text-[#D4AF37]/80'
                  }`}
                >
                  {phase.code}.
                </span>
                <span>{phase.shortLabel}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-transparent via-[#ECC964] to-transparent shadow-[0_0_8px_rgba(236,201,100,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zona 3: Acciones contextuales (Portada siempre accesible en sesión activa) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!viewingStartScreen && (
            <button
              type="button"
              onClick={onOpenStartScreen}
              aria-label="Portada"
              className="flex items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3.5 rounded-lg chalamandra-btn-secondary text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
            >
              <Home className="w-4 h-4 sm:hidden" aria-hidden="true" />
              <span className="hidden sm:inline">Portada</span>
            </button>
          )}

          {viewingStartScreen ? (
            hasProgress ? null : (
              <button
                type="button"
                onClick={() => onSelectModule(1)}
                className="flex items-center gap-2 h-9 px-4 rounded-lg chalamandra-btn-primary text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Comenzar sesión</span>
              </button>
            )
          ) : (
            hasProgress &&
            activeModule !== DISCOVERY_REPORT_STEP && (
              <button
                type="button"
                onClick={() => onSelectModule(DISCOVERY_REPORT_STEP)}
                className="hidden sm:flex items-center gap-2 h-9 px-3.5 rounded-lg chalamandra-btn-primary text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Ruta Inicial</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Línea conductora metálica de progreso */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={completionPct}
        aria-label="Progreso de respuestas de la sesión"
        className="h-[3px] w-full bg-[#151320] overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-[#B98519] via-[#ECC964] to-[#FFF0BE] shadow-[0_0_12px_rgba(236,201,100,0.65)] transition-all duration-300 ease-out"
          style={{ width: `${Math.max(viewingStartScreen && !hasProgress ? 0 : 8, completionPct)}%` }}
        />
      </div>
    </header>
  );
}
