import React from 'react';
import { SimulationResult, GuidedExperiment } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { 
  Atom, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  Compass,
  Zap,
  TrendingUp
} from 'lucide-react';

interface QuantumVisualizerProps {
  result: SimulationResult | null;
  experiment?: GuidedExperiment | null;
}

export const QuantumVisualizer: React.FC<QuantumVisualizerProps> = ({
  result,
  experiment
}) => {
  if (!result) {
    return (
      <Card variant="default" className="p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
        <Atom className="w-10 h-10 text-[var(--fg-muted)] mb-2 opacity-50" />
        <p className="text-sm font-medium text-[var(--fg-main)]">Awaiting Simulation</p>
        <p className="text-xs text-[var(--fg-muted)] mt-1 max-w-sm">
          Run your circuit to generate the quantum state vector and visualize what is happening inside the quantum system.
        </p>
      </Card>
    );
  }

  const visType = experiment?.visualizationType || 'single-qubit';
  const bloch = result.blochCoordinates;
  const probs = result.probabilities;

  // Render Bloch Sphere intuition for single-qubit circuits
  const renderSingleQubitBloch = () => {
    const p0 = probs['0'] ?? 1.0;
    const p1 = probs['1'] ?? 0.0;
    const zVal = bloch ? bloch.z : (p0 - p1);
    const xVal = bloch ? bloch.x : 0;
    const thetaDeg = bloch ? ((bloch.theta * 180) / Math.PI).toFixed(0) : (p1 * 180).toFixed(0);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State Balance Dial */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 text-xs font-semibold text-[var(--fg-main)]">
            <span className="flex items-center gap-1.5 font-mono">
              <Compass className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
              <span>Bloch Vector Orientation</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--fg-muted)]">θ = {thetaDeg}°</span>
          </div>

          {/* 2D Projection Representation of Bloch Sphere */}
          <div className="relative w-40 h-40 mx-auto rounded-full border-2 border-dashed border-sciteal-500/40 flex items-center justify-center bg-[var(--surface-card)] shadow-inner">
            {/* Equator & Z-axis */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-[var(--border-card)]" />
            <div className="absolute left-0 right-0 h-[1px] bg-[var(--border-card)]" />

            {/* Ground State |0> (North Pole) */}
            <span className="absolute -top-2 text-[10px] font-mono font-bold text-sciteal-700 dark:text-sciteal-300">
              |0⟩
            </span>

            {/* Excited State |1> (South Pole) */}
            <span className="absolute -bottom-2 text-[10px] font-mono font-bold text-sciteal-700 dark:text-sciteal-300">
              |1⟩
            </span>

            {/* Superposition state |+> (East) */}
            <span className="absolute -right-3 text-[10px] font-mono text-[var(--fg-muted)]">
              |+⟩
            </span>

            {/* Superposition state |-> (West) */}
            <span className="absolute -left-3 text-[10px] font-mono text-[var(--fg-muted)]">
              |-⟩
            </span>

            {/* State vector pointer line */}
            <div
              className="absolute w-1.5 h-16 bg-sciteal-600 dark:bg-sciteal-400 rounded-full origin-bottom transition-transform duration-500 shadow-md"
              style={{
                bottom: '50%',
                transform: `rotate(${thetaDeg}deg)`
              }}
            />
            {/* Center origin dot */}
            <div className="w-3 h-3 rounded-full bg-sciteal-700 dark:text-sciteal-300 z-10" />
          </div>

          <p className="text-[11px] text-[var(--fg-muted)] text-center leading-relaxed">
            The vector points to North Pole |0⟩, South Pole |1⟩, or the Equator in Superposition.
          </p>
        </div>

        {/* State Amplitude Breakdown */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 text-xs font-semibold text-[var(--fg-main)]">
            <span className="flex items-center gap-1.5 font-mono">
              <Activity className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
              <span>Quantum State Amplitudes</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--fg-muted)]">Born Rule |α|² + |β|² = 1</span>
          </div>

          <div className="space-y-3">
            {/* |0> Amplitude */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-sciteal-700 dark:text-sciteal-300 font-bold">Amplitude α (|0⟩)</span>
                <span className="text-[var(--fg-main)]">{(p0 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                <div
                  className="h-full bg-sciteal-600 rounded-full transition-all duration-300"
                  style={{ width: `${p0 * 100}%` }}
                />
              </div>
            </div>

            {/* |1> Amplitude */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">Amplitude β (|1⟩)</span>
                <span className="text-[var(--fg-main)]">{(p1 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${p1 * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] text-[11px] text-[var(--fg-muted)] font-mono text-center">
            Final State: |ψ⟩ = {Math.sqrt(p0).toFixed(2)}|0⟩ + {Math.sqrt(p1).toFixed(2)}|1⟩
          </div>
        </div>
      </div>
    );
  };

  // Render Bell State & Entanglement Visualizer
  const renderEntanglementVisualizer = () => {
    const p00 = probs['00'] ?? 0;
    const p11 = probs['11'] ?? 0;
    const p01 = probs['01'] ?? 0;
    const p10 = probs['10'] ?? 0;

    const correlationAgreement = p00 + p11;
    const isCorrelated = correlationAgreement > 0.85;

    return (
      <div className="space-y-4">
        {/* Correlation Indicator Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
          isCorrelated
            ? 'bg-emerald-500/15 border-emerald-500/40 text-[var(--fg-main)]'
            : 'bg-sciteal-500/10 border-sciteal-500/30 text-[var(--fg-main)]'
        }`}>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold">
                {isCorrelated ? 'Strong Quantum Entanglement Detected' : 'Composite Quantum Register'}
              </div>
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                {isCorrelated
                  ? 'Qubits q[0] and q[1] exhibit 100% measurement correlation across all sampled shots.'
                  : 'Qubits behave independently or are in a non-entangled product state.'}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[10px] font-mono uppercase text-[var(--fg-muted)] block">Correlation:</span>
            <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-300">
              {(correlationAgreement * 100).toFixed(0)}% Match
            </span>
          </div>
        </div>

        {/* 2x2 Joint Outcome Matrix */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
          <div className="text-xs font-semibold text-[var(--fg-main)] flex items-center justify-between">
            <span>Two-Qubit Joint Measurement Coincidences:</span>
            <span className="text-[11px] font-mono text-[var(--fg-muted)]">q0 vs q1</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            {/* |00> */}
            <div className={`p-3 rounded-lg border text-center transition-all ${
              p00 > 0.1 ? 'bg-sciteal-500/20 border-sciteal-500 font-bold' : 'bg-[var(--surface-card)] border-[var(--border-card)] opacity-50'
            }`}>
              <div className="text-sciteal-700 dark:text-sciteal-300">|00⟩ Outcome</div>
              <div className="text-base sm:text-lg text-[var(--fg-main)] mt-1">{(p00 * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-[var(--fg-muted)]">Both qubits measure 0</div>
            </div>

            {/* |01> */}
            <div className={`p-3 rounded-lg border text-center transition-all ${
              p01 > 0.1 ? 'bg-amber-500/20 border-amber-500 font-bold' : 'bg-[var(--surface-card)] border-[var(--border-card)] opacity-50'
            }`}>
              <div className="text-amber-700 dark:text-amber-300">|01⟩ Outcome</div>
              <div className="text-base sm:text-lg text-[var(--fg-main)] mt-1">{(p01 * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-[var(--fg-muted)]">q0=0, q1=1</div>
            </div>

            {/* |10> */}
            <div className={`p-3 rounded-lg border text-center transition-all ${
              p10 > 0.1 ? 'bg-amber-500/20 border-amber-500 font-bold' : 'bg-[var(--surface-card)] border-[var(--border-card)] opacity-50'
            }`}>
              <div className="text-amber-700 dark:text-amber-300">|10⟩ Outcome</div>
              <div className="text-base sm:text-lg text-[var(--fg-main)] mt-1">{(p10 * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-[var(--fg-muted)]">q0=1, q1=0</div>
            </div>

            {/* |11> */}
            <div className={`p-3 rounded-lg border text-center transition-all ${
              p11 > 0.1 ? 'bg-sciteal-500/20 border-sciteal-500 font-bold' : 'bg-[var(--surface-card)] border-[var(--border-card)] opacity-50'
            }`}>
              <div className="text-sciteal-700 dark:text-sciteal-300">|11⟩ Outcome</div>
              <div className="text-base sm:text-lg text-[var(--fg-main)] mt-1">{(p11 * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-[var(--fg-muted)]">Both qubits measure 1</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card variant="default" className="overflow-hidden" data-testid="quantum-visualizer">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <CardTitle className="text-sm sm:text-base">
            Quantum State Visualizer
          </CardTitle>
        </div>
        <span className="text-[11px] font-mono text-[var(--fg-muted)]">
          {visType === 'bell-state' || visType === 'entanglement' ? 'Two-Qubit Joint System' : 'Single-Qubit Bloch Space'}
        </span>
      </CardHeader>

      <CardContent className="p-5">
        {visType === 'bell-state' || visType === 'entanglement'
          ? renderEntanglementVisualizer()
          : renderSingleQubitBloch()}
      </CardContent>
    </Card>
  );
};
