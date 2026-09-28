import React, { useState, useMemo } from 'react';
import { simulateQuantumCircuit } from '../../../services/quantumSimulator';
import { Circuit, SimulationResult } from '../../../types/quantum';
import { Share2, Zap, ArrowRight, Play, RotateCcw, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button';

interface EntanglementVisualizerProps {
  className?: string;
  onExploreInLab?: () => void;
}

export const EntanglementVisualizer: React.FC<EntanglementVisualizerProps> = ({
  className = '',
  onExploreInLab
}) => {
  // Mode: 'bell' (entangled) vs 'separable' (independent product state H x H)
  const [circuitType, setCircuitType] = useState<'bell' | 'separable'>('bell');
  const [collapsedState, setCollapsedState] = useState<'00' | '11' | '01' | '10' | null>(null);
  const [measuredQ0, setMeasuredQ0] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Construct circuit
  const circuit = useMemo<Circuit>(() => {
    if (circuitType === 'bell') {
      return {
        id: 'circuit-bell-entanglement',
        name: 'Bell State |Φ⁺⟩ Entangled Pair',
        numberOfQubits: 2,
        gates: [
          { id: 'h0', gateId: 'H', targetQubit: 0, position: 0 },
          { id: 'cx', gateId: 'CX', targetQubit: 1, controlQubit: 0, position: 1 },
          { id: 'm0', gateId: 'M', targetQubit: 0, position: 2 },
          { id: 'm1', gateId: 'M', targetQubit: 1, position: 2 }
        ],
        measurements: [0, 1]
      };
    }
    // Separable state: H on q0, H on q1 (no CNOT correlation)
    return {
      id: 'circuit-separable',
      name: 'Independent Product State (H ⊗ H)',
      numberOfQubits: 2,
      gates: [
        { id: 'h0', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'h1', gateId: 'H', targetQubit: 1, position: 0 },
        { id: 'm0', gateId: 'M', targetQubit: 0, position: 1 },
        { id: 'm1', gateId: 'M', targetQubit: 1, position: 1 }
      ],
      measurements: [0, 1]
    };
  }, [circuitType]);

  // Run simulation
  const simResult = useMemo<SimulationResult>(() => {
    return simulateQuantumCircuit(circuit, 1024);
  }, [circuit]);

  const p00 = (simResult.theoreticalProbabilities?.['00'] ?? 0) * 100;
  const p01 = (simResult.theoreticalProbabilities?.['01'] ?? 0) * 100;
  const p10 = (simResult.theoreticalProbabilities?.['10'] ?? 0) * 100;
  const p11 = (simResult.theoreticalProbabilities?.['11'] ?? 0) * 100;

  const isEntangled = circuitType === 'bell';
  const correlationPercentage = isEntangled ? p00 + p11 : 50;

  // Interactive single measurement trial (measuring q0 to watch q1 collapse)
  const handlePerformMeasurementTrial = () => {
    setIsMeasuring(true);
    setCollapsedState(null);
    setMeasuredQ0(null);

    setTimeout(() => {
      if (circuitType === 'bell') {
        // In Bell state, measuring q0 yields 0 or 1 with 50/50 probability,
        // and q1 ALWAYS collapses to the exact same value!
        const coin = Math.random() < 0.5 ? 0 : 1;
        setMeasuredQ0(coin);
        setCollapsedState(coin === 0 ? '00' : '11');
      } else {
        // In separable state, q0 and q1 are completely independent
        const b0 = Math.random() < 0.5 ? 0 : 1;
        const b1 = Math.random() < 0.5 ? 0 : 1;
        setMeasuredQ0(b0);
        setCollapsedState(`${b0}${b1}` as any);
      }
      setIsMeasuring(false);
    }, 300);
  };

  const handleResetTrial = () => {
    setCollapsedState(null);
    setMeasuredQ0(null);
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-5 ${className}`}
      data-testid="entanglement-visualizer"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-card)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sciteal-500/15 text-sciteal-600 dark:text-sciteal-400 flex items-center justify-center font-bold">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
              Two-Qubit Quantum Entanglement & Correlation
            </h4>
            <p className="text-xs text-[var(--fg-muted)]">
              Explore how entangling gates (H + CNOT) create joint states that cannot be factored into independent qubits.
            </p>
          </div>
        </div>

        <div className="flex items-center rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setCircuitType('bell');
              handleResetTrial();
            }}
            className={`px-2.5 py-1 rounded transition-all ${
              circuitType === 'bell'
                ? 'bg-sciteal-600 text-white font-bold'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            Bell State |Φ⁺⟩
          </button>
          <button
            type="button"
            onClick={() => {
              setCircuitType('separable');
              handleResetTrial();
            }}
            className={`px-2.5 py-1 rounded transition-all ${
              circuitType === 'separable'
                ? 'bg-sciteal-600 text-white font-bold'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            Separable (H ⊗ H)
          </button>
        </div>
      </div>

      {/* Circuit Schematic Diagram */}
      <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--fg-muted)]">
          <span className="font-semibold text-[var(--fg-main)]">Circuit Blueprint</span>
          <span className="text-sciteal-700 dark:text-sciteal-300 font-bold">
            {isEntangled ? '|Φ⁺⟩ = (|00⟩ + |11⟩) / √2' : '|ψ⟩ = (|00⟩+|01⟩+|10⟩+|11⟩) / 2'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] font-mono text-xs overflow-x-auto text-[var(--fg-main)] space-y-1">
          {circuitType === 'bell' ? (
            <>
              <div>q[0] ───[ H ]───●────────[ M ] ── (Outcome: {measuredQ0 !== null ? measuredQ0 : '?'})</div>
              <div className="text-[var(--fg-muted)] pl-16">│</div>
              <div>q[1] ───────────[ ⊕ ]──────[ M ] ── (Outcome: {collapsedState ? collapsedState[1] : '?'})</div>
            </>
          ) : (
            <>
              <div>q[0] ───[ H ]───[ M ] ── (Outcome: {measuredQ0 !== null ? measuredQ0 : '?'})</div>
              <div>q[1] ───[ H ]───[ M ] ── (Outcome: {collapsedState ? collapsedState[1] : '?'})</div>
            </>
          )}
        </div>
      </div>

      {/* 2x2 Joint Outcome Matrix */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--fg-main)]">
          <span>Joint Measurement Probability Matrix (q0 vs q1):</span>
          <span className="font-mono text-[11px] text-sciteal-700 dark:text-sciteal-300">
            Correlation: {correlationPercentage.toFixed(0)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          {/* |00> */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              collapsedState === '00'
                ? 'bg-emerald-500/25 border-emerald-500 ring-2 ring-emerald-500 font-bold shadow-md'
                : p00 > 10
                ? 'bg-sciteal-500/15 border-sciteal-500/60 font-semibold'
                : 'bg-[var(--surface-card)] border-[var(--border-card)] opacity-40'
            }`}
          >
            <div className="text-sciteal-700 dark:text-sciteal-300 font-bold">|00⟩ State</div>
            <div className="text-lg font-bold text-[var(--fg-main)] my-1">{p00.toFixed(1)}%</div>
            <div className="text-[10px] text-[var(--fg-muted)]">Both measure 0</div>
          </div>

          {/* |01> */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              collapsedState === '01'
                ? 'bg-amber-500/25 border-amber-500 ring-2 ring-amber-500 font-bold shadow-md'
                : p01 > 10
                ? 'bg-[var(--surface-card)] border-amber-500/40 font-semibold'
                : 'bg-[var(--surface-card)] border-[var(--border-card)] opacity-40'
            }`}
          >
            <div className="text-amber-700 dark:text-amber-400 font-bold">|01⟩ State</div>
            <div className="text-lg font-bold text-[var(--fg-main)] my-1">{p01.toFixed(1)}%</div>
            <div className="text-[10px] text-[var(--fg-muted)]">q0=0, q1=1</div>
          </div>

          {/* |10> */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              collapsedState === '10'
                ? 'bg-amber-500/25 border-amber-500 ring-2 ring-amber-500 font-bold shadow-md'
                : p10 > 10
                ? 'bg-[var(--surface-card)] border-amber-500/40 font-semibold'
                : 'bg-[var(--surface-card)] border-[var(--border-card)] opacity-40'
            }`}
          >
            <div className="text-amber-700 dark:text-amber-400 font-bold">|10⟩ State</div>
            <div className="text-lg font-bold text-[var(--fg-main)] my-1">{p10.toFixed(1)}%</div>
            <div className="text-[10px] text-[var(--fg-muted)]">q0=1, q1=0</div>
          </div>

          {/* |11> */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              collapsedState === '11'
                ? 'bg-emerald-500/25 border-emerald-500 ring-2 ring-emerald-500 font-bold shadow-md'
                : p11 > 10
                ? 'bg-sciteal-500/15 border-sciteal-500/60 font-semibold'
                : 'bg-[var(--surface-card)] border-[var(--border-card)] opacity-40'
            }`}
          >
            <div className="text-sciteal-700 dark:text-sciteal-300 font-bold">|11⟩ State</div>
            <div className="text-lg font-bold text-[var(--fg-main)] my-1">{p11.toFixed(1)}%</div>
            <div className="text-[10px] text-[var(--fg-muted)]">Both measure 1</div>
          </div>
        </div>
      </div>

      {/* Interactive Measurement Test Area */}
      <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[var(--fg-main)] block">
              Interactive Correlation Test: Measure Qubit q[0]
            </span>
            <p className="text-[11px] text-[var(--fg-muted)]">
              {isEntangled
                ? 'Even though measuring q[0] yields a random outcome, q[1] will instantaneously collapse to the matching state with 100% correlation!'
                : 'In a separable state, measuring q[0] provides zero correlation with q[1].'}
            </p>
          </div>

          <Button
            variant="quantum"
            size="sm"
            onClick={handlePerformMeasurementTrial}
            disabled={isMeasuring}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            {isMeasuring ? 'Measuring...' : 'Measure Qubit q[0]'}
          </Button>
        </div>

        {collapsedState && (
          <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-emerald-500/40 animate-in fade-in duration-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>
                Qubit <strong>q[0]</strong> collapsed to <strong>{measuredQ0}</strong> → Qubit <strong>q[1]</strong> collapsed to <strong>{collapsedState[1]}</strong>
              </span>
            </div>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
              Joint Outcome: |{collapsedState}⟩
            </span>
          </div>
        )}
      </div>

      {/* Footer explanation & Circuit Lab CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[var(--border-card)] text-xs text-[var(--fg-muted)]">
        <span>
          {isEntangled
            ? 'Entanglement creates non-local correlation: outcomes |01⟩ and |10⟩ have strictly 0% amplitude.'
            : 'Independent product state: measuring one qubit tells you nothing about the other.'}
        </span>

        {onExploreInLab && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExploreInLab}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Build in Circuit Lab
          </Button>
        )}
      </div>
    </div>
  );
};
