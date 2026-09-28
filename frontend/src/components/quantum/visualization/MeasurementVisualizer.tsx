import React, { useState, useMemo } from 'react';
import { simulateQuantumCircuit } from '../../../services/quantumSimulator';
import { Circuit, SimulationResult } from '../../../types/quantum';
import { BarChart3, Sliders, Play, Info, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button';

interface MeasurementVisualizerProps {
  className?: string;
  circuit?: Circuit;
  initialShots?: number;
}

const PRESET_CIRCUITS: { id: string; label: string; gates: { gateId: string; targetQubit: number; position: number }[] }[] = [
  {
    id: 'superposition',
    label: 'Balanced Superposition (H)',
    gates: [
      { gateId: 'H', targetQubit: 0, position: 0 },
      { gateId: 'M', targetQubit: 0, position: 1 }
    ]
  },
  {
    id: 'ground',
    label: 'Ground State |0⟩ (No Gates)',
    gates: [
      { gateId: 'M', targetQubit: 0, position: 0 }
    ]
  },
  {
    id: 'bitflip',
    label: 'Excited State |1⟩ (X Gate)',
    gates: [
      { gateId: 'X', targetQubit: 0, position: 0 },
      { gateId: 'M', targetQubit: 0, position: 1 }
    ]
  },
  {
    id: 'interference',
    label: 'Wave Interference (H → H)',
    gates: [
      { gateId: 'H', targetQubit: 0, position: 0 },
      { gateId: 'H', targetQubit: 0, position: 1 },
      { gateId: 'M', targetQubit: 0, position: 2 }
    ]
  }
];

const SHOT_OPTIONS = [10, 50, 200, 1024, 4096];

export const MeasurementVisualizer: React.FC<MeasurementVisualizerProps> = ({
  className = '',
  circuit: externalCircuit,
  initialShots = 1024
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('superposition');
  const [shots, setShots] = useState<number>(initialShots);
  const [isSampling, setIsSampling] = useState<boolean>(false);

  // Active circuit
  const activeCircuit = useMemo<Circuit>(() => {
    if (externalCircuit) return externalCircuit;
    const preset = PRESET_CIRCUITS.find((p) => p.id === selectedPresetId) || PRESET_CIRCUITS[0];
    return {
      id: `meas-${preset.id}`,
      name: preset.label,
      numberOfQubits: 1,
      gates: preset.gates.map((g, idx) => ({ ...g, id: `g-${idx}` })),
      measurements: [0]
    };
  }, [externalCircuit, selectedPresetId]);

  // Simulation result with requested shots
  const [simResult, setSimResult] = useState<SimulationResult>(() => {
    return simulateQuantumCircuit(activeCircuit, initialShots);
  });

  const handleResample = (numShots: number = shots) => {
    setIsSampling(true);
    setTimeout(() => {
      const res = simulateQuantumCircuit(activeCircuit, numShots);
      setSimResult(res);
      setIsSampling(false);
    }, 200);
  };

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const preset = PRESET_CIRCUITS.find((p) => p.id === id) || PRESET_CIRCUITS[0];
    const newCircuit: Circuit = {
      id: `meas-${preset.id}`,
      name: preset.label,
      numberOfQubits: 1,
      gates: preset.gates.map((g, idx) => ({ ...g, id: `g-${idx}` })),
      measurements: [0]
    };
    const res = simulateQuantumCircuit(newCircuit, shots);
    setSimResult(res);
  };

  const basisStates = Object.keys(simResult.counts).sort();
  const theoreticalProbs = simResult.theoreticalProbabilities || {};
  const measuredProbs = simResult.probabilities || {};

  return (
    <div
      className={`p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-5 ${className}`}
      data-testid="measurement-visualizer"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-card)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sciteal-500/15 text-sciteal-600 dark:text-sciteal-400 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
              Theoretical Probability vs. Simulated Measurement Shots
            </h4>
            <p className="text-xs text-[var(--fg-muted)]">
              Observe how finite shot sampling produces statistical variance around theoretical statevector probabilities.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-300">
          Projective Measurement
        </span>
      </div>

      {/* Preset Circuits & Shots Controls */}
      {!externalCircuit && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-[var(--fg-muted)] uppercase tracking-wider block">
            Select Quantum State to Measure:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            {PRESET_CIRCUITS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  selectedPresetId === p.id
                    ? 'bg-sciteal-500/20 border-sciteal-500 text-[var(--fg-main)] font-bold shadow-sm'
                    : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)] hover:border-sciteal-500/40 hover:text-[var(--fg-main)]'
                }`}
              >
                <div className="truncate">{p.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shots Selector & Resample Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Sliders className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <span className="text-[var(--fg-muted)]">Sample Shots:</span>
          <div className="flex items-center gap-1">
            {SHOT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setShots(opt);
                  handleResample(opt);
                }}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  shots === opt
                    ? 'bg-sciteal-600 text-white font-bold'
                    : 'bg-[var(--surface-sunken)] text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="quantum"
          size="sm"
          onClick={() => handleResample(shots)}
          disabled={isSampling}
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
        >
          {isSampling ? 'Sampling...' : `Re-Sample (${shots} Shots)`}
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1: Theoretical Amplitudes */}
          <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2">
              <span className="text-xs font-mono font-bold text-sciteal-700 dark:text-sciteal-300">
                1. Exact Theoretical Probability
              </span>
              <span className="text-[10px] font-mono text-[var(--fg-muted)]">P(|x⟩) = |⟨x|ψ⟩|²</span>
            </div>

            <div className="space-y-3">
              {basisStates.map((state) => {
                const prob = (theoreticalProbs[state] ?? 0) * 100;
                return (
                  <div key={state} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-[var(--fg-main)]">State |{state}⟩</span>
                      <span className="text-sciteal-700 dark:text-sciteal-300 font-bold">{prob.toFixed(2)}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[var(--surface-sunken)] overflow-hidden border border-[var(--border-card)]">
                      <div
                        className="h-full bg-sciteal-600 dark:bg-sciteal-500 rounded-full transition-all duration-300"
                        style={{ width: `${prob}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed pt-1">
              Deterministic mathematical value calculated from the statevector complex amplitude coefficients before measurement.
            </p>
          </div>

          {/* Column 2: Simulated Sampled Counts */}
          <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2">
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                2. Simulated Measured Frequency
              </span>
              <span className="text-[10px] font-mono text-[var(--fg-muted)]">{shots} Shots Sampled</span>
            </div>

            <div className="space-y-3">
              {basisStates.map((state) => {
                const count = simResult.counts[state] || 0;
                const measuredPct = (count / shots) * 100;
                const theoreticalPct = (theoreticalProbs[state] ?? 0) * 100;
                const deviation = Math.abs(measuredPct - theoreticalPct);

                return (
                  <div key={state} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-[var(--fg-main)]">
                        |{state}⟩: {count} counts
                      </span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">
                        {measuredPct.toFixed(2)}% (Δ {deviation.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[var(--surface-sunken)] overflow-hidden border border-[var(--border-card)]">
                      <div
                        className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${measuredPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed pt-1">
              Simulated outcomes with stochastic shot noise. Notice that as shot count increases, measured frequency converges to theoretical probability.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Positioning & Technical Accuracy Banner */}
      <div className="p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] flex items-start gap-2.5 text-xs text-[var(--fg-muted)]">
        <Info className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[var(--fg-main)] font-mono text-[11px] block">
            Simulation Architecture Transparency Note
          </span>
          <p className="leading-relaxed">
            All measurement counts displayed above are generated by QuLearn AI's local TypeScript state-vector simulation engine via projective inverse transform sampling over the cumulative amplitude distribution. No physical quantum processor is being operated.
          </p>
        </div>
      </div>
    </div>
  );
};
