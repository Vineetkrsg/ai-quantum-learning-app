import React, { useState } from 'react';
import { GuidedExperiment, SimulationResult } from '../../types/quantum';
import { GUIDED_EXPERIMENTS } from '../../mock/experimentsData';
import { simulateQuantumCircuit } from '../../services/quantumSimulator';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  GitCompare, 
  ArrowRight, 
  Sparkles, 
  Lightbulb, 
  Layers, 
  BarChart2,
  RefreshCw
} from 'lucide-react';

interface ExperimentComparisonProps {
  currentExperiment: GuidedExperiment;
}

export const ExperimentComparison: React.FC<ExperimentComparisonProps> = ({ currentExperiment }) => {
  // Target experiment to compare with (defaults to currentExperiment.comparisonWith or next)
  const defaultTargetId = currentExperiment.comparisonWith || currentExperiment.nextExperimentId || (currentExperiment.id === GUIDED_EXPERIMENTS[0].id ? GUIDED_EXPERIMENTS[1].id : GUIDED_EXPERIMENTS[0].id);

  const [compareTargetId, setCompareTargetId] = useState<string>(defaultTargetId);

  const expA = currentExperiment;
  const expB = GUIDED_EXPERIMENTS.find(e => e.id === compareTargetId) || GUIDED_EXPERIMENTS[0];

  // Run simulation for both circuits
  const resultA: SimulationResult = React.useMemo(() => {
    return simulateQuantumCircuit(expA.initialCircuit, 1024);
  }, [expA]);

  const resultB: SimulationResult = React.useMemo(() => {
    return simulateQuantumCircuit(expB.initialCircuit, 1024);
  }, [expB]);

  // Determine conceptual differences
  const getConceptualComparison = (): string => {
    if (expA.id === 'exp-h-gate' && expB.id === 'exp-h-twice') {
      return 'While a single Hadamard gate splits probability amplitudes equally into a 50/50 superposition, a second Hadamard gate causes destructive wave interference, cancelling the |1⟩ amplitude back to ground state |0⟩ (H · H = I).';
    }
    if (expA.id === 'exp-x-gate' && expB.id === 'exp-h-gate') {
      return 'The Pauli-X gate performs a deterministic bit-flip (rotating 180° around X to |1⟩ with 100% certainty), whereas the Hadamard gate creates quantum superposition (rotating 90° around Y to an equal 50/50 probability distribution).';
    }
    if (expA.id === 'exp-cnot' && expB.id === 'exp-bell-state') {
      return 'In the CNOT circuit with a deterministic control qubit, the target flips conditionally without entanglement. In the Bell State circuit, placing the control qubit into superposition (H) before CNOT creates genuine quantum entanglement (|00⟩ + |11⟩)/√2.';
    }
    return `Experiment A (${expA.title}) uses [${expA.initialCircuit.gates.map(g => g.gateId).join(' → ')}] on ${expA.initialCircuit.numberOfQubits} qubit(s), while Experiment B (${expB.title}) uses [${expB.initialCircuit.gates.map(g => g.gateId).join(' → ')}] on ${expB.initialCircuit.numberOfQubits} qubit(s). Comparing them highlights how gate choices alter probability amplitudes.`;
  };

  return (
    <Card variant="default" className="overflow-hidden" data-testid="experiment-comparison">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <CardTitle className="text-sm sm:text-base">
            Compare Experiments (Side-by-Side)
          </CardTitle>
        </div>

        {/* Experiment B Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--fg-muted)]">Compare with:</span>
          <select
            value={compareTargetId}
            onChange={(e) => setCompareTargetId(e.target.value)}
            className="bg-[var(--surface-sunken)] border border-[var(--border-card)] text-[var(--fg-main)] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sciteal-500 font-medium"
          >
            {GUIDED_EXPERIMENTS.filter(e => e.id !== expA.id).map(e => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.categoryTitle})
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Conceptual Difference Banner */}
        <div className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 text-xs space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-sciteal-800 dark:text-sciteal-300 font-mono">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Conceptual Comparison:</span>
          </div>
          <p className="text-[var(--fg-main)] leading-relaxed">
            {getConceptualComparison()}
          </p>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Circuit A Column */}
          <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3 flex flex-col justify-between">
            <div className="border-b border-[var(--border-card)] pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400 font-bold uppercase">
                  Circuit A (Current)
                </span>
                <h4 className="text-xs font-bold text-[var(--fg-main)] mt-0.5">
                  {expA.title}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[var(--fg-muted)]">
                {expA.initialCircuit.numberOfQubits}Q · {expA.initialCircuit.gates.length} Gates
              </span>
            </div>

            {/* Gates Sequence */}
            <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] flex items-center gap-1.5 flex-wrap font-mono text-xs">
              <span className="text-[var(--fg-muted)]">Sequence:</span>
              {expA.initialCircuit.gates.map((g, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-sciteal-500/15 text-sciteal-800 dark:text-sciteal-200 border border-sciteal-500/30 font-bold"
                >
                  {g.gateId}
                </span>
              ))}
            </div>

            {/* Probability Bars */}
            <div className="space-y-2 pt-1">
              <div className="text-[10px] font-mono text-[var(--fg-muted)] uppercase">
                Measurement Distribution (1024 Shots):
              </div>
              {Object.entries(resultA.probabilities).map(([st, p]) => (
                <div key={st} className="space-y-1 text-xs">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="font-bold text-[var(--fg-main)]">|{st}⟩</span>
                    <span className="text-[var(--fg-muted)]">{(p * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                    <div
                      className="h-full bg-sciteal-600 rounded-full"
                      style={{ width: `${p * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Circuit B Column */}
          <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3 flex flex-col justify-between">
            <div className="border-b border-[var(--border-card)] pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">
                  Circuit B (Comparison)
                </span>
                <h4 className="text-xs font-bold text-[var(--fg-main)] mt-0.5">
                  {expB.title}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[var(--fg-muted)]">
                {expB.initialCircuit.numberOfQubits}Q · {expB.initialCircuit.gates.length} Gates
              </span>
            </div>

            {/* Gates Sequence */}
            <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] flex items-center gap-1.5 flex-wrap font-mono text-xs">
              <span className="text-[var(--fg-muted)]">Sequence:</span>
              {expB.initialCircuit.gates.map((g, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/30 font-bold"
                >
                  {g.gateId}
                </span>
              ))}
            </div>

            {/* Probability Bars */}
            <div className="space-y-2 pt-1">
              <div className="text-[10px] font-mono text-[var(--fg-muted)] uppercase">
                Measurement Distribution (1024 Shots):
              </div>
              {Object.entries(resultB.probabilities).map(([st, p]) => (
                <div key={st} className="space-y-1 text-xs">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="font-bold text-[var(--fg-main)]">|{st}⟩</span>
                    <span className="text-[var(--fg-muted)]">{(p * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full"
                      style={{ width: `${p * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
