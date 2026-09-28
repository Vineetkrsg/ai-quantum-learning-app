import React, { useState } from 'react';
import { SimulationResult } from '../../../types/quantum';
import { Button } from '../../ui/Button';
import { GitCompare, Play, CheckCircle2, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { InteractiveBlochSphere } from '../../quantum/visualization/InteractiveBlochSphere';

interface DemoComparisonProps {
  onRunSimulation: () => SimulationResult;
  onProceedToChallenge: () => void;
}

const PREDICTION_OPTIONS = [
  {
    id: 'p-zero',
    label: 'Returns strictly to 0 (100% |0⟩)',
    isExpected: true,
    feedback: 'Spot on! The second H gate undoes the first via wave interference, returning the qubit back to |0⟩.'
  },
  {
    id: 'p-random',
    label: 'Even more random (50/50)',
    isExpected: false,
    feedback: 'Intuitive guess, but quantum operations are coherent waves, not random dice rolls! They interfere.'
  },
  {
    id: 'p-one',
    label: 'Flips to 1 (100% |1⟩)',
    isExpected: false,
    feedback: 'Not quite. Applying H twice returns the state to its initial starting point (|0⟩).'
  },
  {
    id: 'p-unsure',
    label: "I'm not sure yet",
    isExpected: false,
    feedback: 'Let us run the simulation to see quantum wave interference in action!'
  }
];

export const DemoComparison: React.FC<DemoComparisonProps> = ({
  onRunSimulation,
  onProceedToChallenge
}) => {
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const selectedOpt = PREDICTION_OPTIONS.find((p) => p.id === selectedPrediction);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = onRunSimulation();
      setSimResult(res);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Experiment 2 Overview Header */}
      <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-sciteal-700 dark:text-sciteal-300 font-mono">
          <GitCompare className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <span>Experiment 2: Hadamard Reversibility (H → H)</span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
          What happens when we apply <strong>two Hadamard gates in a row</strong> before measuring?
          In classical computing, doing two random coin flips produces random noise. Let's see how quantum physics behaves!
        </p>
      </div>

      {/* Circuit Diagram */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-sciteal-400 font-bold">q[0] |0⟩</span>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-6 bg-slate-700" />
            <div className="w-9 h-9 rounded-lg bg-teal-600 border border-teal-400 text-white font-mono font-bold text-xs flex items-center justify-center">
              H
            </div>
            <span className="h-[2px] w-6 bg-slate-700" />
            <div className="w-9 h-9 rounded-lg bg-teal-600 border border-teal-400 text-white font-mono font-bold text-xs flex items-center justify-center">
              H
            </div>
            <span className="h-[2px] w-6 bg-slate-700" />
            <div className="w-9 h-9 rounded-lg bg-amber-600 border border-amber-400 text-white font-mono font-bold text-xs flex items-center justify-center">
              M
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Sequence: H at t=0, H at t=1, M at t=2</span>
      </div>

      {/* Prediction Step */}
      {!simResult && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <h4 className="text-xs sm:text-sm font-bold text-[var(--fg-main)]">
              What do you predict will happen after applying H twice?
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PREDICTION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedPrediction(opt.id)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  selectedPrediction === opt.id
                    ? 'bg-sciteal-500/15 border-sciteal-600 dark:border-sciteal-400 text-sciteal-900 dark:text-sciteal-100 font-bold ring-2 ring-sciteal-500/30'
                    : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-main)] hover:border-sciteal-500/50 hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <span>{opt.label}</span>
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    selectedPrediction === opt.id ? 'border-sciteal-600 bg-sciteal-600 text-white' : 'border-[var(--border-card)]'
                  }`}
                >
                  {selectedPrediction === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>

          {selectedOpt && (
            <div className="p-3.5 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 space-y-2 animate-in fade-in">
              <p className="text-xs text-[var(--fg-main)]">
                {selectedOpt.feedback}
              </p>
              <Button
                variant="quantum"
                size="sm"
                onClick={handleRun}
                isLoading={isRunning}
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                Run H → H Simulation
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Side-by-side Experiment Comparison after running */}
      {simResult && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Experiment 1 Summary */}
            <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold">
                Experiment 1: Single H
              </span>
              <h5 className="text-xs font-bold text-[var(--fg-main)]">Superposition State</h5>
              <div className="text-xs font-mono text-[var(--fg-muted)]">
                Measured: ~50% |0⟩ / ~50% |1⟩
              </div>
              <p className="text-[11px] text-[var(--fg-muted)]">
                Equal probability amplitudes split across both 0 and 1.
              </p>
            </div>

            {/* Experiment 2 Summary */}
            <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-sciteal-500/50 space-y-2 ring-1 ring-sciteal-500/20">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                Experiment 2: H → H
              </span>
              <h5 className="text-xs font-bold text-[var(--fg-main)]">Destructive Interference</h5>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                Measured: 100.0% |0⟩ / 0.0% |1⟩
              </div>
              <p className="text-[11px] text-[var(--fg-muted)]">
                The second H gate completely cancelled out the 1 state!
              </p>
            </div>
          </div>

          {/* Interactive Statevector Visualizer: Return to Ground State */}
          <InteractiveBlochSphere
            coordinates={simResult.blochCoordinates}
            initialTheta={0}
            initialPhi={0}
            showControls={false}
            showPresets={false}
            title="Interactive Statevector: Wave Interference Returns State to |0⟩ (North Pole)"
            size={220}
          />

          {/* Key Insight Box */}
          <div className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sciteal-800 dark:text-sciteal-200">
              <Sparkles className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
              <span>Key Discovery: Quantum Waves Interfere!</span>
            </div>
            <p className="text-xs text-[var(--fg-main)] leading-relaxed">
              Applying the Hadamard gate twice cancels out: <code>H · H = Identity</code>.
              Unlike classical randomness, quantum amplitudes behave like waves with positive and negative crests that destructively cancel each other out. Changing the circuit changes the physics!
            </p>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={onProceedToChallenge}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Proceed to Mini Challenge
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
