import React from 'react';
import { Circuit, SimulationResult } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Layers, 
  X, 
  Bot, 
  Sparkles, 
  Atom, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface CircuitExplanationModalProps {
  circuit: Circuit;
  simulationResult: SimulationResult | null;
  onClose: () => void;
  onOpenAITutor?: () => void;
}

export const CircuitExplanationModal: React.FC<CircuitExplanationModalProps> = ({
  circuit,
  simulationResult,
  onClose,
  onOpenAITutor
}) => {
  const n = circuit.numberOfQubits;
  const gates = circuit.gates;
  const sortedGates = [...gates].sort((a, b) => a.position - b.position || a.targetQubit - b.targetQubit);

  // Analyze circuit breakdown
  const hasH = gates.some(g => g.gateId.toUpperCase() === 'H');
  const hasCX = gates.some(g => g.gateId.toUpperCase() === 'CNOT' || g.gateId.toUpperCase() === 'CX');
  const hasX = gates.some(g => g.gateId.toUpperCase() === 'X');

  const getConceptualDescription = (): string => {
    if (gates.length === 0) {
      return 'The circuit contains no gate operations. The register remains in the computational ground state |0...0⟩.';
    }
    if (hasH && hasCX && n >= 2) {
      return 'The combination of Hadamard superposition and CNOT conditional bit-flip synthesizes an entangled Bell State (|00⟩ + |11⟩)/√2.';
    }
    if (hasH) {
      return 'The Hadamard gate creates quantum superposition, distributing probability amplitude across the computational basis states.';
    }
    if (hasX) {
      return 'The Pauli-X gate inverts the qubit state, flipping amplitude from |0⟩ to |1⟩.';
    }
    return `The sequence of ${gates.length} unitary operations rotates the state vector across the Bloch sphere.`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card variant="default" className="w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl border-[var(--border-card)]">
        <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between sticky top-0 bg-[var(--surface-card)] z-10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <CardTitle className="text-base">
              Circuit Pedagogical Explanation
            </CardTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg-main)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </CardHeader>

        <CardContent className="p-5 space-y-5 text-xs">
          {/* Step 1: Qubit Register Allocation */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-1">
            <div className="font-bold text-[var(--fg-main)] flex items-center gap-1.5 font-mono">
              <span>1. Qubit Register Allocation:</span>
            </div>
            <p className="text-[var(--fg-muted)] leading-relaxed">
              This circuit uses <span className="font-bold text-[var(--fg-main)]">{n} qubit wire{n > 1 ? 's' : ''}</span>. All quantum wires begin physically initialized in the computational ground state |0⟩.
            </p>
          </div>

          {/* Step 2: Gate Sequence */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-2">
            <div className="font-bold text-[var(--fg-main)] flex items-center gap-1.5 font-mono">
              <span>2. Gate Sequence & Chronological Order:</span>
            </div>
            {sortedGates.length === 0 ? (
              <p className="text-[var(--fg-muted)] italic">No gates placed yet.</p>
            ) : (
              <div className="space-y-1.5">
                {sortedGates.map((g, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-300 font-bold">
                      t={g.position}
                    </span>
                    <span className="text-[var(--fg-main)] font-semibold">
                      [{g.gateId} Gate]
                    </span>
                    <span className="text-[var(--fg-muted)]">
                      {g.controlQubit !== undefined ? `Control q[${g.controlQubit}] → Target q[${g.targetQubit}]` : `Target q[${g.targetQubit}]`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: Expected Conceptual State */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-1">
            <div className="font-bold text-[var(--fg-main)] flex items-center gap-1.5 font-mono">
              <span>3. Expected Conceptual State:</span>
            </div>
            <p className="text-[var(--fg-muted)] leading-relaxed">
              {getConceptualDescription()}
            </p>
          </div>

          {/* Step 4: Measurement Meaning */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-1">
            <div className="font-bold text-[var(--fg-main)] flex items-center gap-1.5 font-mono">
              <span>4. Measurement Mechanism:</span>
            </div>
            <p className="text-[var(--fg-muted)] leading-relaxed">
              Measurement collapses the continuous superposition of complex probability amplitudes into definite classical bits (0 or 1) according to Born's rule $P(k) = |c_k|^2$.
            </p>
          </div>

          {/* Actual Simulation Result if available */}
          {simulationResult && (
            <div className="p-3.5 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 space-y-1.5">
              <div className="font-bold text-sciteal-800 dark:text-sciteal-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulation Verification ({simulationResult.shots} Shots):</span>
              </div>
              <p className="text-[var(--fg-main)] leading-relaxed font-mono text-[11px]">
                {Object.entries(simulationResult.counts)
                  .map(([st, c]) => `|${st}⟩: ${c} counts (${Math.round((c / simulationResult.shots) * 100)}%)`)
                  .join(' · ')}
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-card)]">
            {onOpenAITutor ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenAITutor();
                }}
                leftIcon={<Bot className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />}
                className="text-xs"
              >
                Deep-Dive with AI Tutor
              </Button>
            ) : <div />}

            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close Breakdown
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
