import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { CheckCircle2, Sparkles, BookOpen, Cpu, RotateCcw } from 'lucide-react';

interface DemoCompletionProps {
  onRestart: () => void;
  onClose: () => void;
}

export const DemoCompletion: React.FC<DemoCompletionProps> = ({
  onRestart,
  onClose
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Hero Completion Header */}
      <div className="text-center py-4 space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="inline-block text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
          Experiment Complete
        </span>

        <h3 className="text-xl sm:text-2xl font-bold text-[var(--fg-main)] tracking-tight">
          You Just Ran Your First Quantum Experiment!
        </h3>

        <p className="text-xs sm:text-sm text-[var(--fg-muted)] max-w-lg mx-auto">
          In less than 5 minutes, you built, simulated, and understood fundamental quantum mechanical principles on real statevector physics.
        </p>
      </div>

      {/* Summary of What You Learned */}
      <div className="p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-sciteal-700 dark:text-sciteal-300 font-mono flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <span>What You Mastered</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1">
            <span className="font-bold text-[var(--fg-main)]">1. Qubits & Ground State</span>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Quantum information carriers initialize in state |0⟩ before operations are applied.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1">
            <span className="font-bold text-[var(--fg-main)]">2. Hadamard Gate (H)</span>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Creates equal superposition where probabilities split 50% / 50% upon measurement.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1">
            <span className="font-bold text-[var(--fg-main)]">3. Quantum Wave Interference</span>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Applying H twice cancels out completely (H · H = I), proving quantum gates are reversible.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1">
            <span className="font-bold text-[var(--fg-main)]">4. Pauli-X Bit-Flip</span>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Inverts states deterministically from |0⟩ to |1⟩, acting as the quantum NOT gate.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onRestart}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Try Again / Restart
        </Button>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<BookOpen className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />}
          onClick={() => {
            onClose();
            navigate('/learn/superposition');
          }}
        >
          Learn More About Superposition
        </Button>

        <Button
          variant="quantum"
          size="sm"
          leftIcon={<Cpu className="w-3.5 h-3.5" />}
          onClick={() => {
            onClose();
            navigate('/lab');
          }}
        >
          Explore Quantum Lab 2.0
        </Button>
      </div>
    </div>
  );
};
