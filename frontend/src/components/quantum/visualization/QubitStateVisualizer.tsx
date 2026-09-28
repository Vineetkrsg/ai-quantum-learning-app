import React, { useState, useMemo } from 'react';
import { simulateQuantumCircuit } from '../../../services/quantumSimulator';
import { Circuit, SimulationResult } from '../../../types/quantum';
import { InteractiveBlochSphere } from './InteractiveBlochSphere';
import { WaveAmplitudeVisualizer } from './WaveAmplitudeVisualizer';
import { Eye, BarChart2, Compass, Layers, Sparkles, RefreshCw, Zap, Sliders, Activity } from 'lucide-react';
import { Button } from '../../ui/Button';

interface QubitStateVisualizerProps {
  className?: string;
  initialPreset?: '0' | '1' | '+' | '-' | 'i';
  title?: string;
}

type ViewMode = 'bloch' | 'probability' | 'amplitude' | 'wave';

interface PresetState {
  id: string;
  name: string;
  dirac: string;
  gates: { gateId: string; targetQubit: number; position: number }[];
  description: string;
  theta: number; // radians
  phi: number;   // radians
}

const PRESET_STATES: PresetState[] = [
  {
    id: '0',
    name: 'Ground State |0⟩',
    dirac: '|0⟩',
    gates: [],
    description: 'The computational zero basis state. The statevector points directly to the North Pole.',
    theta: 0,
    phi: 0
  },
  {
    id: '1',
    name: 'Excited State |1⟩',
    dirac: '|1⟩',
    gates: [{ gateId: 'X', targetQubit: 0, position: 0 }],
    description: 'The computational one basis state. Inverted from |0⟩ via Pauli-X bit-flip (South Pole).',
    theta: Math.PI,
    phi: 0
  },
  {
    id: '+',
    name: 'Equal Superposition |+⟩',
    dirac: '(|0⟩ + |1⟩)/√2',
    gates: [{ gateId: 'H', targetQubit: 0, position: 0 }],
    description: 'Balanced superposition created by Hadamard gate. Points along the positive X-axis on the equator.',
    theta: Math.PI / 2,
    phi: 0
  },
  {
    id: '-',
    name: 'Phase Superposition |-⟩',
    dirac: '(|0⟩ - |1⟩)/√2',
    gates: [
      { gateId: 'H', targetQubit: 0, position: 0 },
      { gateId: 'Z', targetQubit: 0, position: 1 }
    ],
    description: 'Relative phase π between |0⟩ and |1⟩ components. Points along the negative X-axis on the equator.',
    theta: Math.PI / 2,
    phi: Math.PI
  },
  {
    id: 'i',
    name: 'Circular State |i⟩',
    dirac: '(|0⟩ + i|1⟩)/√2',
    gates: [
      { gateId: 'H', targetQubit: 0, position: 0 },
      { gateId: 'S', targetQubit: 0, position: 1 }
    ],
    description: 'Imaginary phase +i introduced via Phase-S gate. Points along the positive Y-axis.',
    theta: Math.PI / 2,
    phi: Math.PI / 2
  }
];

export const QubitStateVisualizer: React.FC<QubitStateVisualizerProps> = ({
  className = '',
  initialPreset = '0',
  title = 'Qubit State Representation & Visualization'
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPreset);
  const [activeView, setActiveView] = useState<ViewMode>('probability');

  const selectedPreset = useMemo(() => {
    return PRESET_STATES.find((p) => p.id === selectedPresetId) || PRESET_STATES[0];
  }, [selectedPresetId]);

  // Simulate circuit to obtain exact theoretical and sampled state
  const simResult: SimulationResult = useMemo(() => {
    const circuit: Circuit = {
      id: `state-sim-${selectedPreset.id}`,
      name: selectedPreset.name,
      numberOfQubits: 1,
      gates: selectedPreset.gates.map((g, idx) => ({ ...g, id: `g-${idx}` })),
      measurements: [0]
    };
    return simulateQuantumCircuit(circuit, 1024);
  }, [selectedPreset]);

  const p0 = (simResult.theoreticalProbabilities?.['0'] ?? 1.0) * 100;
  const p1 = (simResult.theoreticalProbabilities?.['1'] ?? 0.0) * 100;

  const alpha = simResult.stateVector?.[0] || { real: 1, imag: 0, probability: 1 };
  const beta = simResult.stateVector?.[1] || { real: 0, imag: 0, probability: 0 };

  return (
    <div
      className={`p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-5 ${className}`}
      data-testid="qubit-state-visualizer"
    >
      {/* Header with View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-card)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sciteal-500/15 text-sciteal-600 dark:text-sciteal-400 flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
              {title}
            </h4>
            <p className="text-xs text-[var(--fg-muted)]">
              Switch seamlessly between Geometric 3D Sphere, Basis Probabilities, and Complex Amplitudes.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)]">
          <button
            type="button"
            onClick={() => setActiveView('probability')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              activeView === 'probability'
                ? 'bg-sciteal-500/20 text-sciteal-900 dark:text-sciteal-100 font-bold border border-sciteal-500/30'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Probability View</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('amplitude')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              activeView === 'amplitude'
                ? 'bg-sciteal-500/20 text-sciteal-900 dark:text-sciteal-100 font-bold border border-sciteal-500/30'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>State Amplitudes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('wave')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              activeView === 'wave'
                ? 'bg-sciteal-500/20 text-sciteal-900 dark:text-sciteal-100 font-bold border border-sciteal-500/30'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Wave / Amplitude</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('bloch')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              activeView === 'bloch'
                ? 'bg-sciteal-500/20 text-sciteal-900 dark:text-sciteal-100 font-bold border border-sciteal-500/30'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Bloch Sphere 3D</span>
          </button>
        </div>
      </div>

      {/* Preset State Selector Bar */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-[var(--fg-muted)] uppercase tracking-wider block">
          Select Physical State to Inspect:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
          {PRESET_STATES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPresetId(p.id)}
              className={`p-2 rounded-xl border text-left transition-all ${
                selectedPresetId === p.id
                  ? 'bg-sciteal-500/15 border-sciteal-500 text-sciteal-900 dark:text-sciteal-100 font-bold ring-1 ring-sciteal-500/30'
                  : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-sciteal-700 dark:text-sciteal-300">
                  {p.dirac}
                </span>
                {selectedPresetId === p.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sciteal-500" />
                )}
              </div>
              <div className="text-[11px] truncate mt-0.5 text-[var(--fg-main)]">
                {p.name.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* State Explanation Banner */}
      <div className="p-3.5 rounded-xl bg-sciteal-500/10 border border-sciteal-500/20 text-xs sm:text-sm text-[var(--fg-main)] flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold font-mono text-sciteal-800 dark:text-sciteal-300 mr-2">
            {selectedPreset.name}:
          </span>
          {selectedPreset.description}
        </div>
      </div>

      {/* Tab 1: Probability View */}
      {activeView === 'probability' && (
        <div className="p-5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-3">
            <div>
              <h5 className="text-sm font-bold text-[var(--fg-main)]">
                Measurement Probability Distribution
              </h5>
              <p className="text-xs text-[var(--fg-muted)] font-mono">
                Born Rule: P(0) = |α|², P(1) = |β|² (Total: 100%)
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-400 font-semibold">
              Exact Theoretical Calculation
            </span>
          </div>

          {/* Basis Probability Bars */}
          <div className="space-y-4">
            {/* |0> Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-sciteal-700 dark:text-sciteal-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-sciteal-500" />
                  |0⟩ Ground State
                </span>
                <span className="font-bold text-[var(--fg-main)]">
                  {p0.toFixed(1)}% (P = {(p0 / 100).toFixed(4)})
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-card)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sciteal-600 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${p0}%` }}
                />
              </div>
            </div>

            {/* |1> Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-cyan-500" />
                  |1⟩ Excited State
                </span>
                <span className="font-bold text-[var(--fg-main)]">
                  {p1.toFixed(1)}% (P = {(p1 / 100).toFixed(4)})
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-card)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-sky-400 rounded-full transition-all duration-300"
                  style={{ width: `${p1}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] text-xs text-[var(--fg-muted)]">
            <span className="font-bold text-[var(--fg-main)]">Scientific Interpretation: </span>
            {p0 === 100 && 'State is deterministic. Measuring this qubit will yield outcome 0 on 100% of trials.'}
            {p1 === 100 && 'State is deterministic. Measuring this qubit will yield outcome 1 on 100% of trials.'}
            {p0 > 0 && p1 > 0 && 'State is in quantum superposition. Single measurements will randomly yield 0 or 1, but over repeated trials the histogram will converge exactly to 50/50.'}
          </div>
        </div>
      )}

      {/* Tab 2: Complex State Amplitudes View */}
      {activeView === 'amplitude' && (
        <div className="p-5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-3">
            <div>
              <h5 className="text-sm font-bold text-[var(--fg-main)]">
                Complex State Amplitudes α and β
              </h5>
              <p className="text-xs text-[var(--fg-muted)] font-mono">
                Dirac Ket: |ψ⟩ = α|0⟩ + β|1⟩ with α, β ∈ ℂ
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-400 font-semibold">
              Hilbert Space ℂ²
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amplitude α */}
            <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-sciteal-700 dark:text-sciteal-300">
                  Amplitude α (State |0⟩)
                </span>
                <span className="text-[var(--fg-muted)]">
                  |α|² = {(p0 / 100).toFixed(4)}
                </span>
              </div>
              <div className="text-lg font-mono font-bold text-[var(--fg-main)]">
                {alpha.real.toFixed(3)} {alpha.imag >= 0 ? '+' : '-'} {Math.abs(alpha.imag).toFixed(3)}i
              </div>
              <div className="text-xs text-[var(--fg-muted)] space-y-0.5 font-mono">
                <div>Real Component (Re): {alpha.real.toFixed(4)}</div>
                <div>Imaginary Component (Im): {alpha.imag.toFixed(4)}</div>
                <div>Phase: {(Math.atan2(alpha.imag, alpha.real) * 180 / Math.PI).toFixed(0)}°</div>
              </div>
            </div>

            {/* Amplitude β */}
            <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  Amplitude β (State |1⟩)
                </span>
                <span className="text-[var(--fg-muted)]">
                  |β|² = {(p1 / 100).toFixed(4)}
                </span>
              </div>
              <div className="text-lg font-mono font-bold text-[var(--fg-main)]">
                {beta.real.toFixed(3)} {beta.imag >= 0 ? '+' : '-'} {Math.abs(beta.imag).toFixed(3)}i
              </div>
              <div className="text-xs text-[var(--fg-muted)] space-y-0.5 font-mono">
                <div>Real Component (Re): {beta.real.toFixed(4)}</div>
                <div>Imaginary Component (Im): {beta.imag.toFixed(4)}</div>
                <div>Phase: {(Math.atan2(beta.imag, beta.real) * 180 / Math.PI).toFixed(0)}°</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] text-xs text-[var(--fg-muted)] font-mono">
            <strong>Normalization Condition:</strong> |α|² + |β|² = {((alpha.real ** 2 + alpha.imag ** 2) + (beta.real ** 2 + beta.imag ** 2)).toFixed(4)} = 1.0000 (Unit Norm Preserved)
          </div>
        </div>
      )}

      {/* Tab 3: Bloch Sphere View */}
      {activeView === 'bloch' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <InteractiveBlochSphere
            key={`bloch-${selectedPreset.id}`}
            initialTheta={selectedPreset.theta}
            initialPhi={selectedPreset.phi}
            showControls={true}
            showPresets={false}
            title={`${selectedPreset.name} on the Bloch Sphere`}
          />
        </div>
      )}

      {/* Tab 4: Wave / Amplitude View */}
      {activeView === 'wave' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <WaveAmplitudeVisualizer
            result={simResult}
            circuit={{
              id: `circuit-${selectedPreset.id}`,
              name: selectedPreset.name,
              numberOfQubits: 1,
              gates: selectedPreset.gates.map((g, idx) => ({ ...g, id: `g-${idx}` })),
              measurements: [0]
            }}
            title={`Wave / Amplitude: ${selectedPreset.name}`}
          />
        </div>
      )}
    </div>
  );
};
