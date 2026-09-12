import React, { useState } from 'react';
import { Circuit, SimulationResult } from '../../../types/quantum';
import { Button } from '../../ui/Button';
import { Trophy, Play, CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface DemoChallengeProps {
  challengeCircuit: Circuit;
  onUpdateCircuit: (circuit: Circuit) => void;
  onRunValidation: () => { isCorrect: boolean; feedback: string; result: SimulationResult };
  onProceedToCompletion: () => void;
}

export const DemoChallenge: React.FC<DemoChallengeProps> = ({
  challengeCircuit,
  onUpdateCircuit,
  onRunValidation,
  onProceedToCompletion
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [validationState, setValidationState] = useState<{
    isSubmitted: boolean;
    isCorrect: boolean;
    feedback: string;
    result: SimulationResult | null;
  }>({
    isSubmitted: false,
    isCorrect: false,
    feedback: '',
    result: null
  });

  const hasXGate = challengeCircuit.gates.some(
    (g) => g.gateId.toUpperCase() === 'X' && g.targetQubit === 0
  );

  const toggleXGate = () => {
    if (hasXGate) {
      // Remove X gate
      onUpdateCircuit({
        ...challengeCircuit,
        gates: challengeCircuit.gates.filter((g) => g.gateId.toUpperCase() !== 'X')
      });
    } else {
      // Add X gate at t=0, move M to t=1
      onUpdateCircuit({
        ...challengeCircuit,
        gates: [
          { id: 'ch-x-gate', gateId: 'X', targetQubit: 0, position: 0 },
          { id: 'ch-m-gate', gateId: 'M', targetQubit: 0, position: 1 }
        ]
      });
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = onRunValidation();
      setValidationState({
        isSubmitted: true,
        isCorrect: res.isCorrect,
        feedback: res.feedback,
        result: res.result
      });
      setIsRunning(false);
    }, 450);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Challenge Objective Card */}
      <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 font-mono">
          <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>Mini Challenge: State Inversion (Quantum NOT)</span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
          Can you construct a circuit that begins in <code>|0⟩</code> and produces a <strong>100% measurement outcome of 1</strong>?
        </p>
        <p className="text-xs text-[var(--fg-muted)]">
          <strong>Hint:</strong> Use the <strong>Pauli-X</strong> gate, which acts as a quantum bit-flip operator: <code>X|0⟩ = |1⟩</code>.
        </p>
      </div>

      {/* Interactive Circuit Builder for Challenge */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 space-y-4 shadow-inner">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Click the button below to add or remove the X gate:</span>
          <span className="font-mono text-sciteal-400">Target: 100% |1⟩</span>
        </div>

        {/* Qubit Wire Render */}
        <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 select-none flex-shrink-0">
            <span className="font-mono text-xs font-bold text-sciteal-400">q[0]</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-semibold">
              |0⟩
            </span>
          </div>

          <div className="flex-1 relative flex items-center min-w-[280px]">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-700" />

            <div className="relative z-10 flex items-center justify-around w-full px-4">
              {/* Optional X Gate */}
              {hasXGate ? (
                <div className="flex flex-col items-center gap-1.5 animate-in zoom-in-90 duration-150">
                  <div className="w-12 h-12 rounded-xl bg-rose-600 border-2 border-rose-400 text-white font-mono font-bold text-sm flex items-center justify-center shadow-lg shadow-rose-500/20">
                    X
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">t = 0 (Bit-Flip)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleXGate}
                    className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-600 hover:border-sciteal-400 text-slate-500 hover:text-sciteal-300 font-mono text-xs flex items-center justify-center transition-colors cursor-pointer"
                  >
                    + X
                  </button>
                  <span className="text-[10px] font-mono text-slate-500">Empty Slot</span>
                </div>
              )}

              <div className="text-slate-600 text-xs font-mono">───►</div>

              {/* Measurement Gate */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-xl bg-amber-600 border-2 border-amber-400 text-white font-mono font-bold text-sm flex items-center justify-center shadow-lg shadow-amber-500/20">
                  M
                </div>
                <span className="text-[10px] font-mono text-slate-400">t = 1 (Readout)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gate insertion controls */}
        <div className="flex items-center justify-between pt-1">
          <Button
            variant={hasXGate ? 'outline' : 'secondary'}
            size="sm"
            onClick={toggleXGate}
          >
            {hasXGate ? 'Remove X Gate' : 'Insert X Gate into Wire'}
          </Button>

          <Button
            variant="quantum"
            size="sm"
            onClick={handleRun}
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Simulate & Test Circuit
          </Button>
        </div>
      </div>

      {/* Validation Result Banner */}
      {validationState.isSubmitted && (
        <div
          className={`p-4 rounded-xl border space-y-3 animate-in fade-in duration-200 ${
            validationState.isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-100'
              : 'bg-amber-500/10 border-amber-500/40 text-amber-950 dark:text-amber-100'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {validationState.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h5 className="text-xs sm:text-sm font-bold">
                {validationState.isCorrect ? 'Challenge Solved!' : 'Try Again'}
              </h5>
              <p className="text-xs leading-relaxed opacity-90">
                {validationState.feedback}
              </p>
            </div>
          </div>

          {validationState.result && (
            <div className="text-xs font-mono p-2 rounded bg-black/20 flex items-center justify-between">
              <span>Measured Probabilities:</span>
              <span className="font-bold">
                |0⟩: {((validationState.result.probabilities['0'] || 0) * 100).toFixed(0)}% • |1⟩: {((validationState.result.probabilities['1'] || 0) * 100).toFixed(0)}%
              </span>
            </div>
          )}

          {validationState.isCorrect && (
            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={onProceedToCompletion}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Complete Experiment & Summary
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
