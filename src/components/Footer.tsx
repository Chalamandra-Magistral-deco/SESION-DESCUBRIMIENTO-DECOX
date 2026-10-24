import React from 'react';
import {
  DISCOVERY_SYNTHESIS_STEP,
  DISCOVERY_REPORT_STEP
} from '../data/discoveryFlowConfig';

interface FooterProps {
  onOpenStartScreen: () => void;
  onSelectModule: (moduleNum: number) => void;
}

export default function Footer({ onOpenStartScreen, onSelectModule }: FooterProps) {
  return (
    <footer className="no-print mt-12 border-t border-slate-900 bg-slate-950 py-8 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/chalamandra-emblem.jpg"
            alt="Emblema Salamandra"
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-md object-cover ring-1 ring-amber-500/30"
          />
          <span>Chalamandra Magistral DecoX · Sesión de Descubrimiento Interactiva</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onOpenStartScreen}
            className="hover:text-amber-400 cursor-pointer transition-colors whitespace-nowrap"
          >
            Pantalla Inicial
          </button>
          <button
            type="button"
            onClick={() => onSelectModule(1)}
            className="hover:text-amber-400 cursor-pointer transition-colors whitespace-nowrap"
          >
            Base · Encuadre
          </button>
          <button
            type="button"
            onClick={() => onSelectModule(3)}
            className="hover:text-amber-400 cursor-pointer transition-colors whitespace-nowrap"
          >
            Fase A · Mundo Simulado
          </button>
          <button
            type="button"
            onClick={() => onSelectModule(7)}
            className="hover:text-amber-400 cursor-pointer transition-colors whitespace-nowrap"
          >
            Fase B · Decodificación
          </button>
          <button
            type="button"
            onClick={() => onSelectModule(DISCOVERY_SYNTHESIS_STEP)}
            className="hover:text-amber-400 cursor-pointer transition-colors whitespace-nowrap"
          >
            Fase C · Mundo Real
          </button>
          <button
            type="button"
            onClick={() => onSelectModule(DISCOVERY_REPORT_STEP)}
            className="hover:text-amber-400 cursor-pointer transition-colors whitespace-nowrap"
          >
            Informe PDF
          </button>
        </div>
      </div>
    </footer>
  );
}
