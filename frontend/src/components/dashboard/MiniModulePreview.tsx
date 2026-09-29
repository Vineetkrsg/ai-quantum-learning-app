import React from 'react';

interface MiniModulePreviewProps {
  slug: string;
  isCompleted?: boolean;
  isActive?: boolean;
  isHovered?: boolean;
  className?: string;
}

export const MiniModulePreview: React.FC<MiniModulePreviewProps> = ({
  slug,
  isCompleted = false,
  isActive = false,
  isHovered = false,
  className = ''
}) => {
  const primaryColor = isCompleted
    ? '#10b981' // emerald-500
    : isActive
    ? '#14b8a6' // sciteal-500
    : isHovered
    ? '#0d9488'
    : 'var(--fg-muted)';

  const secondaryColor = isCompleted
    ? 'rgba(16, 185, 129, 0.25)'
    : isActive
    ? 'rgba(20, 184, 166, 0.25)'
    : 'rgba(100, 116, 139, 0.2)';

  const wireColor = 'var(--circuit-wire)';

  switch (slug) {
    case 'fundamentals':
      // 4-dot quantum basis state grid
      return (
        <svg
          viewBox="0 0 54 36"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Grid lines */}
          <line x1="12" y1="18" x2="42" y2="18" stroke={wireColor} strokeWidth="1" strokeDasharray="2 2" />
          <line x1="27" y1="6" x2="27" y2="30" stroke={wireColor} strokeWidth="1" strokeDasharray="2 2" />
          
          {/* State Basis Points */}
          <circle cx="16" cy="11" r="3" fill={secondaryColor} stroke={primaryColor} strokeWidth="1.2" />
          <circle cx="38" cy="11" r="3" fill={secondaryColor} stroke={primaryColor} strokeWidth="1.2" />
          <circle cx="16" cy="25" r="3" fill={secondaryColor} stroke={primaryColor} strokeWidth="1.2" />
          <circle cx="38" cy="25" r="3.5" fill={primaryColor} />

          {/* Basis Labels */}
          <text x="16" y="12" fontSize="5" fill={primaryColor} textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">0</text>
          <text x="38" y="25" fontSize="5" fill="#ffffff" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">1</text>
        </svg>
      );

    case 'qubits':
      // Bloch Sphere projection
      return (
        <svg
          viewBox="0 0 54 36"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Main sphere circle */}
          <circle cx="27" cy="18" r="13" stroke={primaryColor} strokeWidth="1.2" strokeOpacity={0.7} />
          {/* Equator ellipse */}
          <ellipse cx="27" cy="18" rx="13" ry="4" stroke={wireColor} strokeWidth="0.8" strokeDasharray="2 2" />
          {/* Z-Axis */}
          <line x1="27" y1="4" x2="27" y2="32" stroke={wireColor} strokeWidth="1" />
          {/* State vector |psi> */}
          <line x1="27" y1="18" x2="35" y2="10" stroke={primaryColor} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="35" cy="10" r="2" fill={primaryColor} />
          {/* Pole marker |0> */}
          <circle cx="27" cy="4" r="1.5" fill={primaryColor} />
        </svg>
      );

    case 'superposition':
      // Wave splitting into 50/50 dual paths
      return (
        <svg
          viewBox="0 0 54 36"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Input state wire */}
          <line x1="4" y1="18" x2="16" y2="18" stroke={primaryColor} strokeWidth="1.5" />
          {/* Hadamard branching node */}
          <rect x="16" y="12" width="10" height="12" rx="2" fill={secondaryColor} stroke={primaryColor} strokeWidth="1" />
          <text x="21" y="19" fontSize="7" fontWeight="bold" fill={primaryColor} textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">H</text>

          {/* Branching wave paths */}
          <path d="M 26 15 Q 36 9 48 9" stroke={primaryColor} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 26 21 Q 36 27 48 27" stroke={primaryColor} strokeWidth="1.2" strokeLinecap="round" />

          {/* Terminal superposition probabilities */}
          <circle cx="48" cy="9" r="2.5" fill={primaryColor} />
          <circle cx="48" cy="27" r="2.5" fill={primaryColor} />
        </svg>
      );

    case 'gates':
      // Unitary operator gate transformation
      return (
        <svg
          viewBox="0 0 54 36"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Incoming & outgoing wire */}
          <line x1="4" y1="18" x2="17" y2="18" stroke={wireColor} strokeWidth="1.2" />
          <line x1="37" y1="18" x2="50" y2="18" stroke={primaryColor} strokeWidth="1.2" />

          {/* Gate Box */}
          <rect x="17" y="7" width="20" height="22" rx="3" fill={secondaryColor} stroke={primaryColor} strokeWidth="1.4" />
          <text x="27" y="16" fontSize="8" fontWeight="bold" fill={primaryColor} textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">U</text>
          <text x="27" y="23" fontSize="5" fill="var(--fg-muted)" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">U†U=I</text>
        </svg>
      );

    case 'circuits':
      // 2-wire circuit with CNOT
      return (
        <svg
          viewBox="0 0 54 36"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Wires */}
          <line x1="6" y1="11" x2="48" y2="11" stroke={wireColor} strokeWidth="1.2" />
          <line x1="6" y1="25" x2="48" y2="25" stroke={wireColor} strokeWidth="1.2" />

          {/* H Gate on q0 */}
          <rect x="14" y="5" width="10" height="12" rx="2" fill={secondaryColor} stroke={primaryColor} strokeWidth="1" />
          <text x="19" y="11.5" fontSize="7" fontWeight="bold" fill={primaryColor} textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">H</text>

          {/* CNOT link */}
          <line x1="34" y1="11" x2="34" y2="25" stroke={primaryColor} strokeWidth="1.4" />
          <circle cx="34" cy="11" r="2.5" fill={primaryColor} />
          {/* Target circle with plus */}
          <circle cx="34" cy="25" r="4.5" fill={secondaryColor} stroke={primaryColor} strokeWidth="1" />
          <line x1="34" y1="22" x2="34" y2="28" stroke={primaryColor} strokeWidth="1" />
          <line x1="31" y1="25" x2="37" y2="25" stroke={primaryColor} strokeWidth="1" />
        </svg>
      );

    case 'entanglement':
      // Two entangled correlated particles with bridging wave
      return (
        <svg
          viewBox="0 0 54 36"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Entanglement correlation sine wave */}
          <path
            d="M 15 18 Q 21 10, 27 18 T 39 18"
            stroke={primaryColor}
            strokeWidth="1.2"
            strokeDasharray="2 1.5"
          />
          {/* Particle A */}
          <circle cx="14" cy="18" r="6" fill={secondaryColor} stroke={primaryColor} strokeWidth="1.2" />
          <circle cx="14" cy="18" r="2" fill={primaryColor} />

          {/* Particle B */}
          <circle cx="40" cy="18" r="6" fill={secondaryColor} stroke={primaryColor} strokeWidth="1.2" />
          <circle cx="40" cy="18" r="2" fill={primaryColor} />

          {/* Bell state tag */}
          <text x="27" y="30" fontSize="5.5" fill="var(--fg-muted)" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">|Φ⁺⟩</text>
        </svg>
      );

    case 'algorithms':
      // Constructive interference peak
      return (
        <svg
          viewBox="0 0 54 36"
          className={`w-full h-full select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Baseline */}
          <line x1="6" y1="28" x2="48" y2="28" stroke={wireColor} strokeWidth="1" />

          {/* Destructive cancelled states (small bars) */}
          <line x1="13" y1="28" x2="13" y2="23" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="28" x2="20" y2="24" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="41" y1="28" x2="41" y2="23" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" />

          {/* Amplified constructive target state (tall bar) */}
          <line x1="30" y1="28" x2="30" y2="8" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="30" cy="8" r="2.5" fill={primaryColor} />

          {/* Interference wave overlay */}
          <path
            d="M 8 26 Q 20 25, 30 7 Q 38 25, 46 26"
            stroke={primaryColor}
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            fill="none"
          />
        </svg>
      );

    default:
      return null;
  }
};
