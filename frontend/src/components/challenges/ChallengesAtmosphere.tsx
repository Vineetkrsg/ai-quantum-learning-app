import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, Trophy, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

interface ChallengesAtmosphereProps {
  completedCount: number;
  totalCount: number;
}

export const ChallengesAtmosphere: React.FC<ChallengesAtmosphereProps> = ({
  completedCount,
  totalCount
}) => {
  const { theme } = useTheme();
  const [activeGate, setActiveGate] = useState<string | null>(null);

  const gates = [
    { symbol: 'H', name: 'Hadamard', desc: '50/50 superposition generator' },
    { symbol: 'X', name: 'Pauli-X', desc: 'Bit flip / NOT unitary' },
    { symbol: 'Z', name: 'Pauli-Z', desc: 'Relative phase inversion' },
    { symbol: '⊕', name: 'CNOT', desc: 'Two-qubit conditional entanglement' },
    { symbol: 'S', name: 'Phase S', desc: 'π/2 rotation around Z-axis' },
    { symbol: 'M', name: 'Measure', desc: 'Projective wave collapse' }
  ];

  const fidelityPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card variant="default" className="p-4 sm:p-5 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Atmospheric description & Gate Palette Pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-400">
              <Cpu className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-[var(--fg-main)]">
              Quantum Proving Grounds
            </span>
            <Badge variant="teal" size="sm">
              Strict Gate Budgets
            </Badge>
          </div>
          <p className="text-xs text-[var(--fg-muted)] max-w-xl leading-relaxed">
            Construct target quantum states with minimal circuit depth. Each challenge tests exact statevector fidelity against unitary constraints.
          </p>

          {/* Interactive Gate Symbol Chips */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] font-mono text-[var(--fg-muted)] mr-1">Available Operators:</span>
            {gates.map((g) => (
              <button
                key={g.symbol}
                onMouseEnter={() => setActiveGate(g.name + ': ' + g.desc)}
                onMouseLeave={() => setActiveGate(null)}
                className="w-6 h-6 rounded-md bg-[var(--surface-sunken)] hover:bg-sciteal-500/15 border border-[var(--border-card)] hover:border-sciteal-500/40 text-[10px] font-mono font-bold text-sciteal-700 dark:text-sciteal-400 transition-colors flex items-center justify-center cursor-help"
                title={`${g.name}: ${g.desc}`}
              >
                {g.symbol}
              </button>
            ))}
          </div>

          {activeGate && (
            <div className="text-[11px] font-mono text-sciteal-700 dark:text-sciteal-400 animate-fadeIn">
              ▸ {activeGate}
            </div>
          )}
        </div>

        {/* Right: Verification Status Meter */}
        <div className="flex items-center gap-4 sm:border-l sm:border-[var(--border-card)] sm:pl-6 shrink-0">
          <div className="space-y-1 text-right">
            <div className="text-[10px] font-mono text-[var(--fg-muted)] uppercase">
              Proving Ground Status
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-sm font-mono font-bold text-[var(--fg-main)]">
                {fidelityPercentage}% Certified
              </span>
            </div>
            <div className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400">
              {completedCount} of {totalCount} Circuits Solved
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
