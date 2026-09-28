import React, { useState, useMemo } from 'react';
import { simulateQuantumCircuit } from '../../../services/quantumSimulator';
import { Circuit, QuantumGate, SimulationResult } from '../../../types/quantum';
import { QUANTUM_GATES } from '../../../mock/gatesData';
import { Zap, ArrowRight, RotateCw, CheckCircle2, Sliders } from 'lucide-react';
import { Button } from '../../ui/Button';

interface GateExplorerVisualizerProps {
  className?: string;
  initialGate?: string;
  onSelectGate?: (gateId: string) => void;
}

const INPUT_STATES = [
  { id: 'zero', label: '|0⟩ Ground', prepGates: [], theta: 0, phi: 0 },
  { id: 'one', label: '|1⟩ Excited', prepGates: ['X'], theta: Math.PI, phi: 0 },
  { id: 'plus', label: '|+⟩ Superpos', prepGates: ['H'], theta: Math.PI / 2, phi: 0 },
  { id: 'minus', label: '|-⟩ Superpos', prepGates: ['X', 'H'], theta: Math.PI / 2, phi: Math.PI },
  { id: 'plusi', label: '|+i⟩ Phase', prepGates: ['H', 'S'], theta: Math.PI / 2, phi: Math.PI / 2 }
];

const EXPLORER_GATES = ['H', 'X', 'Y', 'Z', 'S', 'T'];

export const GateExplorerVisualizer: React.FC<GateExplorerVisualizerProps> = ({
  className = '',
  initialGate = 'H',
  onSelectGate
}) => {
  const [selectedStateId, setSelectedStateId] = useState<string>('zero');
  const [selectedGateId, setSelectedGateId] = useState<string>(initialGate);

  const selectedInput = useMemo(
    () => INPUT_STATES.find((s) => s.id === selectedStateId) || INPUT_STATES[0],
    [selectedStateId]
  );

  const gateMeta = useMemo(
    () => QUANTUM_GATES.find((g) => g.id.toUpperCase() === selectedGateId.toUpperCase()) || QUANTUM_GATES[0],
    [selectedGateId]
  );

  // Compute BEFORE state using simulator
  const beforeResult = useMemo<SimulationResult>(() => {
    const prepCircuit: Circuit = {
      id: `prep-${selectedInput.id}`,
      name: `Input State ${selectedInput.label}`,
      numberOfQubits: 1,
      gates: selectedInput.prepGates.map((g, idx) => ({
        id: `pg-${idx}`,
        gateId: g,
        targetQubit: 0,
        position: idx
      })),
      measurements: [0]
    };
    return simulateQuantumCircuit(prepCircuit, 1024);
  }, [selectedInput]);

  // Compute AFTER state using simulator
  const afterResult = useMemo<SimulationResult>(() => {
    const fullCircuit: Circuit = {
      id: `after-${selectedInput.id}-${selectedGateId}`,
      name: `${selectedGateId} on ${selectedInput.label}`,
      numberOfQubits: 1,
      gates: [
        ...selectedInput.prepGates.map((g, idx) => ({
          id: `pg-${idx}`,
          gateId: g,
          targetQubit: 0,
          position: idx
        })),
        {
          id: `op-eval`,
          gateId: selectedGateId,
          targetQubit: 0,
          position: selectedInput.prepGates.length
        }
      ],
      measurements: [0]
    };
    return simulateQuantumCircuit(fullCircuit, 1024);
  }, [selectedInput, selectedGateId]);

  const beforeProb0 = (beforeResult.theoreticalProbabilities?.['0'] ?? 1.0) * 100;
  const beforeProb1 = (beforeResult.theoreticalProbabilities?.['1'] ?? 0.0) * 100;

  const afterProb0 = (afterResult.theoreticalProbabilities?.['0'] ?? 1.0) * 100;
  const afterProb1 = (afterResult.theoreticalProbabilities?.['1'] ?? 0.0) * 100;

  const beforeBloch = beforeResult.blochCoordinates;
  const afterBloch = afterResult.blochCoordinates;

  const beforeThetaDeg = beforeBloch ? Math.round((beforeBloch.theta * 180) / Math.PI) : 0;
  const afterThetaDeg = afterBloch ? Math.round((afterBloch.theta * 180) / Math.PI) : 0;

  const beforePhiDeg = beforeBloch ? Math.round((beforeBloch.phi * 180) / Math.PI) : 0;
  const afterPhiDeg = afterBloch ? Math.round((afterBloch.phi * 180) / Math.PI) : 0;

  const handleSelectGate = (id: string) => {
    setSelectedGateId(id);
    if (onSelectGate) onSelectGate(id);
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-5 ${className}`}
      data-testid="gate-explorer-visualizer"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-card)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sciteal-500/15 text-sciteal-600 dark:text-sciteal-400 flex items-center justify-center font-bold font-mono">
            U
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
              Quantum Gate State Transformation Explorer
            </h4>
            <p className="text-xs text-[var(--fg-muted)]">
              Select an initial quantum state and apply a unitary gate to observe exact statevector evolution.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-300">
          Unitary Evolution Engine
        </span>
      </div>

      {/* Selectors: Input State and Gate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Input State */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-[var(--fg-muted)] uppercase tracking-wider block">
            1. Select Initial Qubit State:
          </span>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
            {INPUT_STATES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStateId(s.id)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  selectedStateId === s.id
                    ? 'bg-sciteal-500/20 border-sciteal-500 text-[var(--fg-main)] font-bold shadow-sm'
                    : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)] hover:border-sciteal-500/40 hover:text-[var(--fg-main)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Gate to Apply */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-[var(--fg-muted)] uppercase tracking-wider block">
            2. Select Quantum Gate to Apply:
          </span>
          <div className="grid grid-cols-6 gap-1.5 font-mono text-xs">
            {EXPLORER_GATES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleSelectGate(g)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  selectedGateId === g
                    ? 'bg-sciteal-600 text-white font-bold border-sciteal-500 shadow-sm'
                    : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)] hover:border-sciteal-500/40 hover:text-[var(--fg-main)]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Before vs After Transformation Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
        {/* BEFORE STATE CARD (5 cols) */}
        <div className="md:col-span-5 p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 text-xs font-mono font-semibold">
            <span className="text-[var(--fg-muted)]">Before Gate Operation</span>
            <span className="text-sciteal-700 dark:text-sciteal-300">θ={beforeThetaDeg}°, φ={beforePhiDeg}°</span>
          </div>

          {/* Mini 2D Vector Representation */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-28 h-28 rounded-full border border-dashed border-teal-500/30 flex items-center justify-center bg-[var(--surface-sunken)]">
              <div className="absolute top-0 bottom-0 w-[1px] bg-[var(--border-strong)]" />
              <div className="absolute left-0 right-0 h-[1px] bg-[var(--border-strong)]" />
              <span className="absolute -top-2 text-[9px] font-mono text-[var(--fg-muted)]">|0⟩</span>
              <span className="absolute -bottom-2 text-[9px] font-mono text-[var(--fg-muted)]">|1⟩</span>
              <div
                className="absolute w-1 h-12 bg-sciteal-600 dark:bg-sciteal-400 rounded-full origin-bottom transition-transform duration-300"
                style={{
                  bottom: '50%',
                  transform: `rotate(${beforeThetaDeg}deg)`
                }}
              />
              <div className="w-2 h-2 rounded-full bg-sciteal-700 z-10" />
            </div>
          </div>

          {/* Probability Distribution */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[var(--fg-muted)]">Prob(|0⟩):</span>
              <span className="font-bold text-[var(--fg-main)]">{beforeProb0.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
              <div className="h-full bg-teal-600" style={{ width: `${beforeProb0}%` }} />
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-[var(--fg-muted)]">Prob(|1⟩):</span>
              <span className="font-bold text-[var(--fg-main)]">{beforeProb1.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
              <div className="h-full bg-amber-600" style={{ width: `${beforeProb1}%` }} />
            </div>
          </div>
        </div>

        {/* TRANSFORMATION OPERATOR ARROW (1 col) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-sciteal-500/15 border border-sciteal-500/40 text-sciteal-700 dark:text-sciteal-300 font-mono font-bold text-sm flex items-center justify-center shadow-sm">
            {selectedGateId}
          </div>
          <ArrowRight className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400 mt-1 hidden md:block" />
        </div>

        {/* AFTER STATE CARD (5 cols) */}
        <div className="md:col-span-5 p-4 rounded-xl bg-[var(--surface-card)] border border-sciteal-500/40 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 text-xs font-mono font-semibold">
            <span className="text-sciteal-700 dark:text-sciteal-400 font-bold">After Applying {selectedGateId} Gate</span>
            <span className="text-sciteal-700 dark:text-sciteal-300">θ={afterThetaDeg}°, φ={afterPhiDeg}°</span>
          </div>

          {/* Mini 2D Vector Representation */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-28 h-28 rounded-full border border-dashed border-teal-500/50 flex items-center justify-center bg-[var(--surface-sunken)]">
              <div className="absolute top-0 bottom-0 w-[1px] bg-[var(--border-strong)]" />
              <div className="absolute left-0 right-0 h-[1px] bg-[var(--border-strong)]" />
              <span className="absolute -top-2 text-[9px] font-mono text-[var(--fg-muted)]">|0⟩</span>
              <span className="absolute -bottom-2 text-[9px] font-mono text-[var(--fg-muted)]">|1⟩</span>
              <div
                className="absolute w-1 h-12 bg-teal-500 rounded-full origin-bottom transition-transform duration-500 shadow-sm"
                style={{
                  bottom: '50%',
                  transform: `rotate(${afterThetaDeg}deg)`
                }}
              />
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 z-10" />
            </div>
          </div>

          {/* Probability Distribution */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[var(--fg-muted)]">Prob(|0⟩):</span>
              <span className="font-bold text-[var(--fg-main)]">{afterProb0.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
              <div className="h-full bg-teal-500" style={{ width: `${afterProb0}%` }} />
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-[var(--fg-muted)]">Prob(|1⟩):</span>
              <span className="font-bold text-[var(--fg-main)]">{afterProb1.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${afterProb1}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Physical / Mathematical Transformation Note */}
      <div className="p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1 text-xs">
        <div className="flex items-center gap-1.5 font-mono font-bold text-sciteal-700 dark:text-sciteal-300">
          <Zap className="w-3.5 h-3.5" />
          <span>{gateMeta.name} ({gateMeta.symbol}) Semantics:</span>
        </div>
        <p className="text-[var(--fg-muted)] leading-relaxed">
          {gateMeta.description}
        </p>
      </div>
    </div>
  );
};
