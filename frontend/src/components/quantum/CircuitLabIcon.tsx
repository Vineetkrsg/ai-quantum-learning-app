import React from 'react';

interface CircuitLabIconProps {
  className?: string;
  size?: number;
}

/**
 * Original Circuit Lab Logo & Icon
 * 
 * Design Concept:
 * A distinctive quantum circuit glyph featuring:
 * - Two parallel horizontal quantum wire paths (q0 and q1)
 * - A central quantum gate matrix block with an embedded phase-coherence diamond
 * - An entangled vertical control-target connector with quantum state nodes
 * - Clean geometric strokes with balanced proportions suitable for 16px to 48px rendering
 */
export const CircuitLabIcon: React.FC<CircuitLabIconProps> = ({ 
  className = 'w-5 h-5', 
  size 
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Top Wire (q0) */}
      <path
        d="M2 7H7M17 7H22"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Bottom Wire (q1) */}
      <path
        d="M2 17H12M16 17H22"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Vertical Entanglement Connector Wire */}
      <path
        d="M14 7V17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeDasharray="2 1.5"
      />

      {/* Top Wire: Gate Block (Unitary Transformation Box) */}
      <rect
        x="7"
        y="3.5"
        width="10"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
        className="fill-current/15"
      />

      {/* Gate Interior: Superposition / Phase Coherence Glyph */}
      <path
        d="M12 5.25L13.75 7L12 8.75L10.25 7L12 5.25Z"
        fill="currentColor"
      />

      {/* Entanglement Control Node on Top Wire inside/connected */}
      <circle
        cx="14"
        cy="7"
        r="1.75"
        fill="currentColor"
      />

      {/* Bottom Wire: Target Target / Entangled Node (NOT/X Circle) */}
      <circle
        cx="14"
        cy="17"
        r="3"
        stroke="currentColor"
        strokeWidth="1.75"
        className="fill-[var(--bg-canvas,#070B13)]"
      />
      {/* Crosshair inside Target Node */}
      <path
        d="M14 15V19M12 17H16"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {/* Input State Qubit Dots */}
      <circle cx="3" cy="7" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="3" cy="17" r="1" fill="currentColor" opacity="0.6" />

      {/* Measurement / Output State Arrow Hints on Wire Ends */}
      <circle cx="21" cy="7" r="1" fill="currentColor" opacity="0.8" />
      <circle cx="21" cy="17" r="1" fill="currentColor" opacity="0.8" />
    </svg>
  );
};

export default CircuitLabIcon;
