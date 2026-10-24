import React, { useState } from 'react';

interface ChalamandraMedallionProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Emblema oficial de la Salamandra Chalamandra Magistral DecoX
 * enmarcado con doble bisel alquímico de oro bruñido y resplandor ámbar.
 */
export function ChalamandraMedallion({
  size = 'md',
  className = ''
}: ChalamandraMedallionProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const dimensions =
    size === 'sm'
      ? 'w-8 h-8 rounded-full p-[1.5px]'
      : size === 'lg'
      ? 'w-14 h-14 rounded-full p-[2px]'
      : size === 'xl'
      ? 'w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2.5px]'
      : 'w-10 h-10 rounded-full p-[1.5px]';

  return (
    <div
      className={`relative shrink-0 bg-gradient-to-br from-[#FFF0BE] via-[#D4AF37] to-[#8C6214] shadow-[0_0_28px_rgba(212,175,55,0.42)] print:shadow-none print:bg-transparent print:p-0 ${dimensions} ${className}`}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[#07060A] ring-1 ring-inset ring-[#FFF0BE]/30">
        {!imgFailed ? (
          <img
            src="/images/chalamandra-emblem.jpg"
            alt="Emblema oficial Salamandra Chalamandra Magistral DecoX"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover object-center scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0D0C13] text-[#ECC964] font-display font-bold text-xs">
            DX
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Geometría simbólica inspirada en los anillos alquímicos, muescas cardinales
 * y ejes estratégicos del medallón oficial de Chalamandra Magistral DecoX.
 */
export function AlchemicalGeometryBackdrop({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 600"
      fill="none"
      className={`no-print pointer-events-none select-none ${className}`}
    >
      <circle
        cx="300"
        cy="300"
        r="276"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 7"
        opacity="0.52"
      />
      <circle cx="300" cy="300" r="236" stroke="currentColor" strokeWidth="1.25" opacity="0.65" />
      <circle cx="300" cy="300" r="220" stroke="currentColor" strokeWidth="0.75" opacity="0.42" />
      <circle cx="300" cy="300" r="168" stroke="currentColor" strokeWidth="1" opacity="0.48" />
      <polygon
        points="300,64 536,300 300,536 64,300"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.44"
      />
      <rect
        x="133"
        y="133"
        width="334"
        height="334"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.3"
      />
      <line x1="300" y1="16" x2="300" y2="584" stroke="currentColor" strokeWidth="0.8" opacity="0.32" />
      <line x1="16" y1="300" x2="584" y2="300" stroke="currentColor" strokeWidth="0.8" opacity="0.32" />
      <polygon points="300,54 308,64 300,74 292,64" fill="currentColor" opacity="0.85" />
      <polygon points="546,300 536,308 526,300 536,292" fill="currentColor" opacity="0.85" />
      <polygon points="300,546 308,536 300,526 292,536" fill="currentColor" opacity="0.85" />
      <polygon points="54,300 64,308 74,300 64,292" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/**
 * Divisor arquitectónico dorado con nodo romboidal central.
 */
export function AlchemicalHairline({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`no-print flex items-center gap-3 w-full ${className}`}
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#ECC964]/80" />
      <div className="w-2.5 h-2.5 rotate-45 border border-[#ECC964] bg-[#14111C] shadow-[0_0_10px_rgba(212,175,55,0.55)]" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/50 to-[#ECC964]/80" />
    </div>
  );
}
