import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ModulePreviewVisualProps {
  slug: string;
  isHovered?: boolean;
}

export const ModulePreviewVisual: React.FC<ModulePreviewVisualProps> = ({ slug, isHovered = false }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isHighContrast = theme === 'high-contrast';

  const baseStroke = isHighContrast ? '#000000' : isDark ? '#2dd4bf' : '#0d9488';
  const wireStroke = isHighContrast ? '#000000' : isDark ? '#334155' : '#cbd5e1';
  const amberColor = isHighContrast ? '#000000' : isDark ? '#fbbf24' : '#d97706';
  const purpleColor = isHighContrast ? '#000000' : isDark ? '#a78bfa' : '#7c3aed';
  const fillBg = isHighContrast ? '#ffffff' : isDark ? '#111823' : '#f8fafc';

  switch (slug) {
    case 'fundamentals':
      // Quantum grid / Foundational particles / 0 to |ψ⟩ transition
      return (
        <div className="w-full h-24 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] p-2 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 80" fill="none">
            {/* Background Grid */}
            <defs>
              <pattern id="fund-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke={wireStroke} strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="240" height="80" fill="url(#fund-grid)" />

            {/* Classical Bit Box (Left) */}
            <rect x="25" y="24" width="45" height="32" rx="6" fill={fillBg} stroke={wireStroke} strokeWidth="1.2" />
            <text x="47" y="44" textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              [ 0 / 1 ]
            </text>
            <text x="47" y="66" textAnchor="middle" fill={isDark ? '#64748b' : '#64748b'} fontSize="8" fontFamily="sans-serif">
              Classical
            </text>

            {/* Transition Arrow with quantum wave */}
            <path
              d="M 80 40 Q 95 32 110 40 T 140 40"
              stroke={baseStroke}
              strokeWidth="1.5"
              strokeDasharray={isHovered ? 'none' : '3 3'}
              fill="none"
              className={isHovered ? 'animate-pulse' : ''}
            />
            <polygon points="144,40 138,36 138,44" fill={baseStroke} />

            {/* Quantum Qubit State (Right) */}
            <circle cx="185" cy="40" r="18" fill={fillBg} stroke={baseStroke} strokeWidth="1.5" />
            <circle
              cx="185"
              cy="40"
              r="12"
              fill={isHighContrast ? '#000000' : 'rgba(45, 212, 191, 0.2)'}
              className="animate-pulse-subtle"
            />
            <text x="185" y="44" textAnchor="middle" fill={baseStroke} fontSize="11" fontFamily="monospace" fontWeight="bold">
              |ψ⟩
            </text>
            <text x="185" y="66" textAnchor="middle" fill={baseStroke} fontSize="8" fontFamily="sans-serif">
              Qubit State
            </text>
          </svg>
        </div>
      );

    case 'qubits':
      // Bloch Sphere mini preview
      return (
        <div className="w-full h-24 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] p-2 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 80" fill="none">
            {/* Centered Bloch projection */}
            <g transform="translate(120, 40)">
              {/* Outer boundary circle */}
              <circle r="30" stroke={wireStroke} strokeWidth="1.2" fill={fillBg} />
              {/* Equator ellipse */}
              <ellipse rx="30" ry="10" stroke={wireStroke} strokeWidth="1" strokeDasharray="2 2" fill="none" />
              {/* Z-Axis */}
              <line x1="0" y1="-34" x2="0" y2="34" stroke={wireStroke} strokeWidth="1" />
              <text x="0" y="-36" textAnchor="middle" fill={baseStroke} fontSize="9" fontFamily="monospace" fontWeight="bold">
                |0⟩
              </text>
              <text x="0" y="45" textAnchor="middle" fill={amberColor} fontSize="9" fontFamily="monospace" fontWeight="bold">
                |1⟩
              </text>

              {/* State Vector pointing towards superposition / custom angle */}
              <line
                x1="0"
                y1="0"
                x2={isHovered ? '24' : '20'}
                y2={isHovered ? '-12' : '-18'}
                stroke={baseStroke}
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <circle
                cx={isHovered ? '24' : '20'}
                cy={isHovered ? '-12' : '-18'}
                r="3.5"
                fill={baseStroke}
                className="transition-all duration-300"
              />
              <circle cx="0" cy="0" r="2.5" fill={wireStroke} />
            </g>

            {/* Dirac notation badges */}
            <text x="35" y="32" fill={isDark ? '#94a3b8' : '#475569'} fontSize="9" fontFamily="monospace">
              θ: Polar
            </text>
            <text x="35" y="48" fill={isDark ? '#94a3b8' : '#475569'} fontSize="9" fontFamily="monospace">
              φ: Phase
            </text>
            <text x="205" y="42" textAnchor="middle" fill={baseStroke} fontSize="10" fontFamily="monospace" fontWeight="bold">
              |+⟩
            </text>
          </svg>
        </div>
      );

    case 'superposition':
      // Two-state branching visualization
      return (
        <div className="w-full h-24 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] p-2 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 80" fill="none">
            {/* Input wire */}
            <line x1="20" y1="40" x2="65" y2="40" stroke={wireStroke} strokeWidth="1.5" />
            <text x="14" y="43" textAnchor="end" fill={baseStroke} fontSize="10" fontFamily="monospace" fontWeight="bold">
              |0⟩
            </text>

            {/* Hadamard Gate Box */}
            <rect x="65" y="26" width="28" height="28" rx="5" fill={fillBg} stroke={baseStroke} strokeWidth="1.5" />
            <text x="79" y="44" textAnchor="middle" fill={baseStroke} fontSize="12" fontFamily="monospace" fontWeight="bold">
              H
            </text>

            {/* Branching paths to |0⟩ and |1⟩ */}
            <path
              d="M 93 36 C 115 36, 125 24, 150 24 L 175 24"
              stroke={baseStroke}
              strokeWidth="1.5"
              fill="none"
              strokeDasharray={isHovered ? 'none' : '3 3'}
            />
            <path
              d="M 93 44 C 115 44, 125 56, 150 56 L 175 56"
              stroke={amberColor}
              strokeWidth="1.5"
              fill="none"
              strokeDasharray={isHovered ? 'none' : '3 3'}
            />

            {/* Branch outcome nodes */}
            <circle cx="185" cy="24" r="10" fill={fillBg} stroke={baseStroke} strokeWidth="1.2" />
            <text x="185" y="27" textAnchor="middle" fill={baseStroke} fontSize="8" fontFamily="monospace" fontWeight="bold">
              |0⟩ 50%
            </text>

            <circle cx="185" cy="56" r="10" fill={fillBg} stroke={amberColor} strokeWidth="1.2" />
            <text x="185" y="59" textAnchor="middle" fill={amberColor} fontSize="8" fontFamily="monospace" fontWeight="bold">
              |1⟩ 50%
            </text>
          </svg>
        </div>
      );

    case 'gates':
      // Unitary gate transformations
      return (
        <div className="w-full h-24 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] p-2 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 80" fill="none">
            {/* Wire */}
            <line x1="15" y1="40" x2="225" y2="40" stroke={wireStroke} strokeWidth="1.5" />

            {/* Pauli X */}
            <g transform="translate(45, 26)">
              <rect width="28" height="28" rx="5" fill={fillBg} stroke={baseStroke} strokeWidth="1.5" />
              <text x="14" y="18" textAnchor="middle" fill={baseStroke} fontSize="11" fontFamily="monospace" fontWeight="bold">
                X
              </text>
              <text x="14" y="38" textAnchor="middle" fill={isDark ? '#64748b' : '#64748b'} fontSize="7" fontFamily="sans-serif">
                Bit-Flip
              </text>
            </g>

            {/* Hadamard */}
            <g transform="translate(105, 26)">
              <rect width="28" height="28" rx="5" fill={fillBg} stroke={baseStroke} strokeWidth="1.5" />
              <text x="14" y="18" textAnchor="middle" fill={baseStroke} fontSize="11" fontFamily="monospace" fontWeight="bold">
                H
              </text>
              <text x="14" y="38" textAnchor="middle" fill={isDark ? '#64748b' : '#64748b'} fontSize="7" fontFamily="sans-serif">
                Superpos
              </text>
            </g>

            {/* Pauli Z / Phase */}
            <g transform="translate(165, 26)">
              <rect width="28" height="28" rx="5" fill={fillBg} stroke={amberColor} strokeWidth="1.5" />
              <text x="14" y="18" textAnchor="middle" fill={amberColor} fontSize="11" fontFamily="monospace" fontWeight="bold">
                Z
              </text>
              <text x="14" y="38" textAnchor="middle" fill={isDark ? '#64748b' : '#64748b'} fontSize="7" fontFamily="sans-serif">
                Phase
              </text>
            </g>
          </svg>
        </div>
      );

    case 'circuits':
      // Mini multi-qubit circuit with flowing packet
      return (
        <div className="w-full h-24 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] p-2 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 80" fill="none">
            {/* Wires */}
            <text x="18" y="29" fill={baseStroke} fontSize="9" fontFamily="monospace" fontWeight="bold">
              q₀
            </text>
            <line x1="32" y1="26" x2="225" y2="26" stroke={wireStroke} strokeWidth="1.5" />

            <text x="18" y="57" fill={baseStroke} fontSize="9" fontFamily="monospace" fontWeight="bold">
              q₁
            </text>
            <line x1="32" y1="54" x2="225" y2="54" stroke={wireStroke} strokeWidth="1.5" />

            {/* H Gate on q0 */}
            <rect x="65" y="14" width="24" height="24" rx="4" fill={fillBg} stroke={baseStroke} strokeWidth="1.4" />
            <text x="77" y="30" textAnchor="middle" fill={baseStroke} fontSize="10" fontFamily="monospace" fontWeight="bold">
              H
            </text>

            {/* CNOT between q0 and q1 */}
            <line x1="130" y1="26" x2="130" y2="54" stroke={baseStroke} strokeWidth="2" />
            <circle cx="130" cy="26" r="4.5" fill={baseStroke} />
            <circle cx="130" cy="54" r="8" fill={fillBg} stroke={baseStroke} strokeWidth="1.5" />
            <line x1="130" y1="48" x2="130" y2="60" stroke={baseStroke} strokeWidth="1.5" />
            <line x1="124" y1="54" x2="136" y2="54" stroke={baseStroke} strokeWidth="1.5" />

            {/* Measurement block */}
            <rect x="180" y="14" width="24" height="24" rx="4" fill={fillBg} stroke={amberColor} strokeWidth="1.4" />
            <path d="M 186 31 A 6 6 0 0 1 198 31 M 192 31 L 196 23" stroke={amberColor} strokeWidth="1.2" fill="none" />

            {/* Flowing packet dot */}
            <circle
              cx={isHovered ? '100' : '50'}
              cy="26"
              r="3.5"
              fill={baseStroke}
              className="transition-all duration-700 ease-in-out"
            />
          </svg>
        </div>
      );

    case 'entanglement':
      // Two correlated nodes with resonant link
      return (
        <div className="w-full h-24 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] p-2 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 80" fill="none">
            {/* Correlation Wave Link between left & right qubits */}
            <path
              d="M 65 40 C 90 20, 110 60, 135 40 C 150 25, 160 50, 175 40"
              stroke={purpleColor}
              strokeWidth="1.8"
              fill="none"
              strokeDasharray={isHovered ? 'none' : '4 3'}
              className="animate-pulse-subtle"
            />

            {/* Left Qubit Node (q0) */}
            <circle cx="50" cy="40" r="16" fill={fillBg} stroke={baseStroke} strokeWidth="1.5" />
            <circle cx="50" cy="40" r="10" fill={isHighContrast ? '#000' : 'rgba(45, 212, 191, 0.2)'} />
            <text x="50" y="44" textAnchor="middle" fill={baseStroke} fontSize="10" fontFamily="monospace" fontWeight="bold">
              q₀
            </text>

            {/* Right Qubit Node (q1) */}
            <circle cx="190" cy="40" r="16" fill={fillBg} stroke={purpleColor} strokeWidth="1.5" />
            <circle cx="190" cy="40" r="10" fill={isHighContrast ? '#000' : 'rgba(167, 139, 250, 0.2)'} />
            <text x="190" y="44" textAnchor="middle" fill={purpleColor} fontSize="10" fontFamily="monospace" fontWeight="bold">
              q₁
            </text>

            {/* Bell State Formula in Center */}
            <rect x="85" y="55" width="70" height="18" rx="4" fill={fillBg} stroke={wireStroke} strokeWidth="0.8" />
            <text x="120" y="67" textAnchor="middle" fill={isDark ? '#e6edf4' : '#0f172a'} fontSize="8" fontFamily="monospace" fontWeight="bold">
              |Φ⁺⟩ = (|00⟩+|11⟩)/√2
            </text>
          </svg>
        </div>
      );

    case 'algorithms':
      // Quantum Algorithm pipeline / constructive interference peak
      return (
        <div className="w-full h-24 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] p-2 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 80" fill="none">
            {/* Algorithm Stages */}
            <g transform="translate(15, 20)">
              {/* Stage 1: Init */}
              <rect x="0" y="5" width="45" height="30" rx="4" fill={fillBg} stroke={wireStroke} strokeWidth="1" />
              <text x="22" y="20" textAnchor="middle" fill={baseStroke} fontSize="9" fontFamily="monospace" fontWeight="bold">
                |0⟩⊗ⁿ
              </text>
              <text x="22" y="30" textAnchor="middle" fill={isDark ? '#64748b' : '#64748b'} fontSize="7" fontFamily="sans-serif">
                Init
              </text>

              {/* Arrow */}
              <path d="M 48 20 L 58 20" stroke={wireStroke} strokeWidth="1.2" />

              {/* Stage 2: Oracle */}
              <rect x="62" y="5" width="45" height="30" rx="4" fill={fillBg} stroke={amberColor} strokeWidth="1.2" />
              <text x="84" y="20" textAnchor="middle" fill={amberColor} fontSize="9" fontFamily="monospace" fontWeight="bold">
                U_f
              </text>
              <text x="84" y="30" textAnchor="middle" fill={isDark ? '#64748b' : '#64748b'} fontSize="7" fontFamily="sans-serif">
                Oracle
              </text>

              {/* Arrow */}
              <path d="M 110 20 L 120 20" stroke={wireStroke} strokeWidth="1.2" />

              {/* Stage 3: Interference Amplification */}
              <rect x="124" y="5" width="45" height="30" rx="4" fill={fillBg} stroke={baseStroke} strokeWidth="1.2" />
              <text x="146" y="20" textAnchor="middle" fill={baseStroke} fontSize="9" fontFamily="monospace" fontWeight="bold">
                Diffuser
              </text>
              <text x="146" y="30" textAnchor="middle" fill={isDark ? '#64748b' : '#64748b'} fontSize="7" fontFamily="sans-serif">
                Amplify
              </text>

              {/* Arrow */}
              <path d="M 172 20 L 180 20" stroke={wireStroke} strokeWidth="1.2" />

              {/* Outcome Peak Histogram Bar */}
              <g transform="translate(186, 0)">
                <line x1="0" y1="36" x2="26" y2="36" stroke={wireStroke} strokeWidth="1" />
                <rect x="2" y="24" width="4" height="12" fill={wireStroke} />
                <rect x="9" y="8" width="8" height="28" fill={baseStroke} rx="1.5" />
                <rect x="20" y="28" width="4" height="8" fill={wireStroke} />
                <text x="13" y="44" textAnchor="middle" fill={baseStroke} fontSize="6" fontFamily="monospace">
                  |target⟩
                </text>
              </g>
            </g>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
