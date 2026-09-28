import React, { useState } from 'react';
import { SimulationResult, GuidedExperiment, Circuit } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { 
  Atom, 
  Activity, 
  Share2, 
  Compass, 
  BarChart3, 
  Layers, 
  Sliders, 
  RotateCcw 
} from 'lucide-react';
import { InteractiveBlochSphere } from './visualization/InteractiveBlochSphere';
import { EntanglementVisualizer } from './visualization/EntanglementVisualizer';
import { MeasurementVisualizer } from './visualization/MeasurementVisualizer';
import { CircuitPropagationVisualizer } from './visualization/CircuitPropagationVisualizer';
import { WaveAmplitudeVisualizer } from './visualization/WaveAmplitudeVisualizer';

interface QuantumVisualizerProps {
  result: SimulationResult | null;
  experiment?: GuidedExperiment | null;
  circuit?: Circuit;
}

export const QuantumVisualizer: React.FC<QuantumVisualizerProps> = ({
  result,
  experiment,
  circuit
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'propagation' | 'bloch' | 'amplitudes' | 'wave' | 'measurement' | 'entanglement'>('amplitudes');

  if (!result) {
    return (
      <Card variant="default" className="p-8 text-center flex flex-col items-center justify-center min-h-[220px]" data-testid="quantum-visualizer">
        <Atom className="w-10 h-10 text-[var(--fg-muted)] mb-2 opacity-50" />
        <p className="text-sm font-medium text-[var(--fg-main)]">Awaiting Simulation</p>
        <p className="text-xs text-[var(--fg-muted)] mt-1 max-w-sm">
          Run your circuit to generate the quantum state vector and visualize what is happening inside the quantum system.
        </p>
      </Card>
    );
  }

  const visType = experiment?.visualizationType || 'single-qubit';
  const isMultiQubit = circuit ? circuit.numberOfQubits > 1 : Object.keys(result.probabilities).some(k => k.length > 1);
  const bloch = result.blochCoordinates;
  const probs = result.probabilities;

  return (
    <Card variant="default" className="overflow-hidden space-y-0" data-testid="quantum-visualizer">
      {/* Visualizer Header */}
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <CardTitle className="text-sm sm:text-base">
            Quantum State Visualizer
          </CardTitle>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-card)] text-[var(--fg-muted)]">
            {isMultiQubit ? 'Multi-Qubit Composite System' : 'Single-Qubit Hilbert Space'}
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] p-0.5 text-xs font-mono self-start sm:self-auto flex-wrap gap-1">
          {circuit && circuit.gates.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveSubTab('propagation')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeSubTab === 'propagation'
                  ? 'bg-sciteal-600 text-white font-bold'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              Step Propagation
            </button>
          )}

          {!isMultiQubit && (
            <button
              type="button"
              onClick={() => setActiveSubTab('bloch')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeSubTab === 'bloch'
                  ? 'bg-sciteal-600 text-white font-bold'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              Bloch Sphere
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveSubTab('amplitudes')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeSubTab === 'amplitudes'
                ? 'bg-sciteal-600 text-white font-bold'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            {isMultiQubit ? 'Basis Probability Map' : 'Amplitudes & State'}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('wave')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeSubTab === 'wave'
                ? 'bg-sciteal-600 text-white font-bold'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            Wave / Amplitude
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('measurement')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeSubTab === 'measurement'
                ? 'bg-sciteal-600 text-white font-bold'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            Shot Sampling
          </button>

          {isMultiQubit && (
            <button
              type="button"
              onClick={() => setActiveSubTab('entanglement')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeSubTab === 'entanglement'
                  ? 'bg-sciteal-600 text-white font-bold'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              Entanglement
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* SUB-TAB: CIRCUIT STEP PROPAGATION */}
        {activeSubTab === 'propagation' && circuit && (
          <CircuitPropagationVisualizer
            circuit={circuit}
          />
        )}

        {/* SUB-TAB 1: BLOCH SPHERE (Single-Qubit) */}
        {!isMultiQubit && activeSubTab === 'bloch' && (
          <InteractiveBlochSphere
            coordinates={bloch}
            initialTheta={bloch?.theta ?? 0}
            initialPhi={bloch?.phi ?? 0}
            isInteractive={true}
            title="Statevector on Bloch Sphere"
          />
        )}

        {/* SUB-TAB 2: STATE AMPLITUDES & DIRAC NOTATION */}
        {activeSubTab === 'amplitudes' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amplitude Table */}
              <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 text-xs font-mono font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                    <span>Statevector Amplitudes (Real & Imag)</span>
                  </span>
                  <span className="text-[10px] text-[var(--fg-muted)]">Σ |c_i|² = 1.0</span>
                </div>

                <div className="space-y-2 font-mono text-xs max-h-60 overflow-y-auto pr-1">
                  {result.stateVector && result.stateVector.length > 0 ? (
                    result.stateVector.map((el) => {
                      const probPct = (el.probability * 100).toFixed(1);
                      const sign = el.imag >= 0 ? '+' : '-';
                      const absImag = Math.abs(el.imag);

                      return (
                        <div
                          key={el.state}
                          className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                            el.probability > 0.001
                              ? 'bg-[var(--surface-card)] border-sciteal-500/40 text-[var(--fg-main)]'
                              : 'bg-[var(--surface-card)]/50 border-[var(--border-card)] text-[var(--fg-muted)] opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-card)] font-bold text-sciteal-700 dark:text-sciteal-300">
                              |{el.state}⟩
                            </span>
                            <span className="text-[11px] text-[var(--fg-muted)]">
                              c = {el.real.toFixed(3)} {sign} {absImag.toFixed(3)}i
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-sciteal-700 dark:text-sciteal-300">{probPct}%</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    Object.entries(result.probabilities).map(([state, prob]) => (
                      <div
                        key={state}
                        className="p-2.5 rounded-lg border bg-[var(--surface-card)] border-[var(--border-card)] flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-sciteal-700 dark:text-sciteal-300">|{state}⟩</span>
                        <span className="font-bold text-[var(--fg-main)]">{(prob * 100).toFixed(1)}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Graphical Probability Distribution Bars */}
              <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 text-xs font-mono font-semibold">
                  <span>Theoretical Probability Distribution</span>
                  <span className="text-[10px] text-[var(--fg-muted)]">{Object.keys(result.probabilities).length} Basis States</span>
                </div>

                <div className="space-y-3">
                  {Object.entries(result.probabilities).map(([state, prob]) => {
                    const probPct = (prob * 100).toFixed(1);
                    return (
                      <div key={state} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="font-bold text-[var(--fg-main)]">Basis State |{state}⟩</span>
                          <span className="text-sciteal-700 dark:text-sciteal-300 font-bold">{probPct}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                          <div
                            className="h-full bg-sciteal-600 dark:bg-sciteal-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(2, Number(probPct))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB: WAVE / AMPLITUDE VIEW */}
        {activeSubTab === 'wave' && (
          <WaveAmplitudeVisualizer
            result={result}
            circuit={circuit}
          />
        )}

        {/* SUB-TAB 3: SHOT SAMPLING */}
        {activeSubTab === 'measurement' && (
          <MeasurementVisualizer
            circuit={circuit}
            initialShots={result.shots || 1024}
          />
        )}

        {/* SUB-TAB 4: ENTANGLEMENT (Multi-Qubit) */}
        {isMultiQubit && (activeSubTab === 'entanglement' || activeSubTab === 'bloch') && (
          <EntanglementVisualizer />
        )}
      </CardContent>
    </Card>
  );
};
