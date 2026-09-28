import React, { useState } from 'react';
import { Cpu, Play, Pause, SkipBack, SkipForward, RotateCcw, ArrowRight, Sparkles, CheckCircle2, BarChart2 } from 'lucide-react';
import { Button } from '../../ui/Button';

interface AlgorithmFlowVisualizerProps {
  className?: string;
  initialAlgorithm?: 'grover' | 'deutsch-jozsa' | 'teleportation';
  onExploreInLab?: () => void;
}

type AlgorithmType = 'grover' | 'deutsch-jozsa' | 'teleportation';

interface GroverStep {
  stepIndex: number;
  phaseTitle: string;
  badge: string;
  description: string;
  amplitudes: Record<string, number>; // state -> real amplitude (can be negative)
  probabilities: Record<string, number>; // state -> %
  meanAmplitude: number;
}

const GROVER_STEPS: GroverStep[] = [
  {
    stepIndex: 0,
    phaseTitle: 'Step 1: Ground State Initialization',
    badge: 'Initialization',
    description: 'The 2-qubit register starts in the computational ground state |00⟩. The target item (|11⟩) has zero probability.',
    amplitudes: { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 },
    probabilities: { '00': 100, '01': 0, '10': 0, '11': 0 },
    meanAmplitude: 0.25
  },
  {
    stepIndex: 1,
    phaseTitle: 'Step 2: Equal Superposition (H ⊗ H)',
    badge: 'Superposition',
    description: 'Hadamard gates applied to both wires create an equal superposition of all N=4 items. Each item has amplitude α = 1/√4 = +0.5 (25% probability).',
    amplitudes: { '00': 0.5, '01': 0.5, '10': 0.5, '11': 0.5 },
    probabilities: { '00': 25, '01': 25, '10': 25, '11': 25 },
    meanAmplitude: 0.5
  },
  {
    stepIndex: 2,
    phaseTitle: 'Step 3: Quantum Oracle Query (Phase Inversion)',
    badge: 'Oracle',
    description: 'The oracle marks target |11⟩ by inverting its sign: amplitude flips to -0.5. Notice: measurement probabilities remain 25% each! The difference is entirely in relative phase.',
    amplitudes: { '00': 0.5, '01': 0.5, '10': 0.5, '11': -0.5 },
    probabilities: { '00': 25, '01': 25, '10': 25, '11': 25 },
    meanAmplitude: 0.25
  },
  {
    stepIndex: 3,
    phaseTitle: 'Step 4: Amplitude Amplification (Diffusion Operator)',
    badge: 'Inversion about Mean',
    description: 'The Grover diffusion operator reflects all amplitudes about their mean (+0.25). The marked item reflects from -0.5 to +1.0, while non-targets reflect from +0.5 down to 0.0.',
    amplitudes: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
    probabilities: { '00': 0, '01': 0, '10': 0, '11': 100 },
    meanAmplitude: 0.25
  },
  {
    stepIndex: 4,
    phaseTitle: 'Step 5: Projective Measurement Readout',
    badge: 'Measurement',
    description: 'Measurement collapses the register. The marked item |11⟩ is found with 100% theoretical probability in just O(√N) iterations instead of O(N) classical steps.',
    amplitudes: { '00': 0.0, '01': 0.0, '10': 0.0, '11': 1.0 },
    probabilities: { '00': 0, '01': 0, '10': 0, '11': 100 },
    meanAmplitude: 0.25
  }
];

export const AlgorithmFlowVisualizer: React.FC<AlgorithmFlowVisualizerProps> = ({
  className = '',
  initialAlgorithm = 'grover',
  onExploreInLab
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>(initialAlgorithm);
  const [groverStepIdx, setGroverStepIdx] = useState<number>(1);
  const [djType, setDjType] = useState<'constant' | 'balanced'>('balanced');
  const [djStepIdx, setDjStepIdx] = useState<number>(2);

  const currentGroverStep = GROVER_STEPS[groverStepIdx] || GROVER_STEPS[0];

  return (
    <div
      className={`p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-5 ${className}`}
      data-testid="algorithm-flow-visualizer"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-card)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sciteal-500/15 text-sciteal-600 dark:text-sciteal-400 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
              Quantum Algorithm State & Interference Visualizer
            </h4>
            <p className="text-xs text-[var(--fg-muted)]">
              Observe how quantum algorithms steer continuous probability amplitudes and destructive interference toward target solutions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onExploreInLab && (
            <Button variant="ghost" size="sm" onClick={onExploreInLab} className="text-xs py-1 h-7">
              Lab Mode <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedAlgo('grover')}
          className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all ${
            selectedAlgo === 'grover'
              ? 'bg-sciteal-500/15 border-sciteal-500 text-sciteal-900 dark:text-sciteal-100 font-bold ring-1 ring-sciteal-500/30'
              : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
          }`}
        >
          Grover Search (Amplitude Amplification)
        </button>

        <button
          type="button"
          onClick={() => setSelectedAlgo('deutsch-jozsa')}
          className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all ${
            selectedAlgo === 'deutsch-jozsa'
              ? 'bg-sciteal-500/15 border-sciteal-500 text-sciteal-900 dark:text-sciteal-100 font-bold ring-1 ring-sciteal-500/30'
              : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
          }`}
        >
          Deutsch-Jozsa (Phase Kickback & Oracle)
        </button>
      </div>

      {/* GROVER ALGORITHM FLOW */}
      {selectedAlgo === 'grover' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Timeline Step Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
            {GROVER_STEPS.map((s, idx) => (
              <button
                key={`grover-step-${idx}`}
                type="button"
                onClick={() => setGroverStepIdx(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  groverStepIdx === idx
                    ? 'bg-sciteal-500/15 border-sciteal-500 text-sciteal-900 dark:text-sciteal-100 font-bold ring-1 ring-sciteal-500/30'
                    : idx < groverStepIdx
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span>STEP {idx + 1}</span>
                  {groverStepIdx === idx && <span className="w-1.5 h-1.5 rounded-full bg-sciteal-500 animate-pulse" />}
                  {idx < groverStepIdx && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </div>
                <div className="truncate font-semibold mt-0.5 text-[11px] text-[var(--fg-main)]">
                  {s.badge}
                </div>
              </button>
            ))}
          </div>

          {/* Educational Step Card */}
          <div className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-sciteal-800 dark:text-sciteal-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {currentGroverStep.phaseTitle}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-card)] text-[var(--fg-muted)]">
                Target Item: |11⟩
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
              {currentGroverStep.description}
            </p>
          </div>

          {/* Probability & Amplitude Landscapes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Probability Distribution */}
            <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 text-xs">
                <span className="font-bold text-[var(--fg-main)]">Measurement Probabilities</span>
                <span className="font-mono text-[var(--fg-muted)]">Target = |11⟩</span>
              </div>

              <div className="space-y-2">
                {Object.entries(currentGroverStep.probabilities).map(([state, prob]) => {
                  const isTarget = state === '11';
                  return (
                    <div key={state} className="space-y-1">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className={`font-bold ${isTarget ? 'text-emerald-700 dark:text-emerald-300' : 'text-[var(--fg-muted)]'}`}>
                          |{state}⟩ {isTarget && '★ Target'}
                        </span>
                        <span className="font-bold text-[var(--fg-main)]">
                          {prob.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-card)] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isTarget
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-400'
                              : 'bg-sciteal-500/40'
                          }`}
                          style={{ width: `${prob}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Signed Amplitudes (Showing Inversion about Mean) */}
            <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 text-xs">
                <span className="font-bold text-[var(--fg-main)]">Signed Amplitudes αᵢ</span>
                <span className="font-mono text-[10px] text-sciteal-700 dark:text-sciteal-300">
                  Mean = {currentGroverStep.meanAmplitude.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {Object.entries(currentGroverStep.amplitudes).map(([state, amp]) => {
                  const isNegative = amp < 0;
                  const isTarget = state === '11';
                  return (
                    <div
                      key={state}
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        isTarget
                          ? 'bg-emerald-500/10 border-emerald-500/40 font-bold text-emerald-900 dark:text-emerald-200'
                          : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-main)]'
                      }`}
                    >
                      <span>|{state}⟩</span>
                      <span className={isNegative ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
                        {amp >= 0 ? `+${amp.toFixed(2)}` : amp.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] text-[11px] text-[var(--fg-muted)]">
                Inversion Formula: α_new = 2 · (Mean) - α_old. When Mean = 0.25 and α_target = -0.5: 2(0.25) - (-0.5) = +1.0!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEUTSCH-JOZSA FLOW */}
      {selectedAlgo === 'deutsch-jozsa' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Oracle Type Switcher */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] text-xs">
            <span className="font-bold text-[var(--fg-main)]">Select Black-Box Oracle:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDjType('constant')}
                className={`px-3 py-1 rounded-lg font-mono transition-all ${
                  djType === 'constant'
                    ? 'bg-sciteal-500/20 text-sciteal-900 dark:text-sciteal-100 font-bold border border-sciteal-500/30'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
                }`}
              >
                Constant Function [f(x) = 0]
              </button>
              <button
                type="button"
                onClick={() => setDjType('balanced')}
                className={`px-3 py-1 rounded-lg font-mono transition-all ${
                  djType === 'balanced'
                    ? 'bg-sciteal-500/20 text-sciteal-900 dark:text-sciteal-100 font-bold border border-sciteal-500/30'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
                }`}
              >
                Balanced Function [f(x) = x]
              </button>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/20 space-y-2 text-xs sm:text-sm text-[var(--fg-main)]">
            <div className="font-bold font-mono text-sciteal-800 dark:text-sciteal-300">
              {djType === 'constant' ? 'Constant Oracle: Returns 0 for all inputs' : 'Balanced Oracle: Returns 0 for half, 1 for half'}
            </div>
            <p className="leading-relaxed">
              Classical computers must query the oracle at least <strong>2^(n-1) + 1</strong> times in the worst case to determine whether f(x) is constant or balanced. The Deutsch-Jozsa quantum algorithm solves this in <strong>exactly ONE query</strong> using quantum interference!
            </p>
          </div>

          {/* Result Outcome Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-2">
              <div className="text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider">
                Input Qubit Final Readout
              </div>
              <div className="text-2xl font-mono font-bold text-sciteal-700 dark:text-sciteal-300">
                {djType === 'constant' ? '|0⟩ (Constructive Interference)' : '|1⟩ (Destructive Interference)'}
              </div>
              <p className="text-xs text-[var(--fg-muted)]">
                {djType === 'constant'
                  ? 'Zero phase difference: amplitudes constructively interfere at |0⟩ with 100% certainty.'
                  : 'Relative π phase difference: amplitudes destructively cancel at |0⟩ and constructively interfere at |1⟩.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-2">
              <div className="text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider">
                Quantum Speedup Comparison
              </div>
              <div className="text-xs font-mono space-y-1">
                <div className="flex justify-between p-2 rounded bg-[var(--surface-sunken)]">
                  <span>Classical Queries (n=1):</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">2 queries</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-[var(--surface-sunken)]">
                  <span>Quantum Queries:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">1 query (100% deterministic)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
