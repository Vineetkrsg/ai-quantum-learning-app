import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Bot, Sparkles, Cpu, Atom, Radio } from 'lucide-react';

interface TutorAtmosphereProps {
  isTyping?: boolean;
  onSelectPrompt?: (promptText: string) => void;
}

export const TutorAtmosphere: React.FC<TutorAtmosphereProps> = ({ isTyping = false, onSelectPrompt }) => {
  const { theme } = useTheme();
  const [isOrbActive, setIsOrbActive] = useState(false);

  const quickInquiries = [
    { label: 'Superposition vs Randomness', query: 'What is the physical difference between quantum superposition and classical probability distribution?' },
    { label: 'Bell State Collapse', query: 'How does measuring one qubit in a Bell pair instantaneously collapse the other qubit?' },
    { label: 'Pauli Gates Geometry', query: 'Explain how Pauli X, Y, and Z gates act as rotations around axes on the Bloch sphere.' }
  ];

  return (
    <div className="p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Living Quantum Assistant Orb */}
      <div className="flex items-center gap-3">
        <div
          className="relative flex items-center justify-center cursor-pointer select-none"
          onMouseEnter={() => setIsOrbActive(true)}
          onMouseLeave={() => setIsOrbActive(false)}
          onClick={() => setIsOrbActive((prev) => !prev)}
          title="Click to pulse quantum resonance"
          role="button"
          tabIndex={0}
          aria-label="Quantum Assistant Orb"
        >
          {/* Animated Quantum Resonance Halo */}
          <div className={`w-10 h-10 rounded-full bg-sciteal-500/20 border transition-all duration-300 flex items-center justify-center text-sciteal-700 dark:text-sciteal-300 ${
            isTyping
              ? 'border-sciteal-400 animate-pulse scale-105 ring-4 ring-sciteal-500/20'
              : isOrbActive
              ? 'border-sciteal-500 scale-110 shadow-lg shadow-sciteal-500/20 ring-2 ring-sciteal-500/30'
              : 'border-sciteal-500/40 hover:border-sciteal-400'
          }`}>
            <Bot className={`w-5 h-5 transition-transform duration-300 ${isOrbActive ? 'scale-110 text-sciteal-500' : 'text-sciteal-600 dark:text-sciteal-400'}`} />
          </div>

          {/* Active Status Beacon */}
          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--surface-sunken)] ${
            isTyping ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'
          }`} />

          {/* Subtle resonance pulse wave on hover */}
          {isOrbActive && (
            <span className="absolute inset-0 rounded-full border border-sciteal-400 animate-ping pointer-events-none opacity-40" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[var(--fg-main)]">QuBi AI Quantum Assistant</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/30 font-semibold">
              Pedagogical Engine
            </span>
          </div>
          <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">
            {isTyping
              ? 'Synthesizing pedagogical explanation from quantum state context...'
              : 'Active pedagogical engine with live circuit & state-vector context.'}
          </p>
        </div>
      </div>

      {/* Interactive Micro Circuit State & Inquiry Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {onSelectPrompt && quickInquiries.map((inq) => (
          <button
            key={inq.label}
            onClick={() => onSelectPrompt(inq.query)}
            className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[var(--surface-card)] hover:bg-[var(--surface-subtle)] text-[var(--fg-muted)] hover:text-sciteal-700 dark:hover:text-sciteal-300 border border-[var(--border-card)] hover:border-sciteal-500/40 transition-colors whitespace-nowrap cursor-pointer"
          >
            {inq.label}
          </button>
        ))}

        {/* State Vector Pill */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-[10px] text-sciteal-700 dark:text-sciteal-400 bg-[var(--surface-card)] px-2.5 py-1 rounded-lg border border-[var(--border-card)]">
          <Atom className="w-3.5 h-3.5" />
          <span>|ψ⟩ = α|0⟩ + β|1⟩</span>
        </div>
      </div>
    </div>
  );
};

