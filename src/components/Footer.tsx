import React from 'react';
import { DISCOVERY_FIVE_PHASES } from '../data/discoveryFlowConfig';
import { ChalamandraMedallion } from './ChalamandraSeal';

interface FooterProps {
  onOpenStartScreen: () => void;
  onSelectModule: (moduleNum: number) => void;
}

export default function Footer({ onOpenStartScreen, onSelectModule }: FooterProps) {
  return (
    <footer className="site-footer no-print relative z-10 mt-16 border-t border-[#D4AF37]/30 bg-[#060509] py-9 text-[#B8B0A0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs">
        <div className="flex items-center gap-3">
          <ChalamandraMedallion size="sm" />
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-display font-semibold text-[#F7F3EA] tracking-wide">
              Chalamandra Magistral <span className="text-[#ECC964]">DecoX</span>
            </span>
            <span aria-hidden="true" className="text-[#D4AF37]">·</span>
            <span className="text-[#D6CFC2]">Interactive DecoX</span>
            <span aria-hidden="true" className="text-[#D4AF37]">·</span>
            <span>Sesión de Descubrimiento</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={onOpenStartScreen}
            className="text-[#ECC964] font-semibold hover:text-[#FFF0BE] cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            Portada
          </button>
          {DISCOVERY_FIVE_PHASES.map((phase) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelectModule(phase.num)}
              className="hover:text-[#FFF0BE] cursor-pointer transition-colors whitespace-nowrap shrink-0 tabular-nums"
            >
              {phase.navLabel}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
