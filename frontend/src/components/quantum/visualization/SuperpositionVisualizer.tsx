import React, { useState } from 'react';
import { simulateQuantumCircuit } from '../../../services/quantumSimulator';
import { Circuit, SimulationResult } from '../../../types/quantum';
import { Play, RotateCcw, ArrowRight, Sparkles, BarChart2, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '../../ui/Button';

interface SuperpositionVisualizerProps {
  className?: string;
  onExploreInLab?: () => void;
}

export const SuperpositionVisualizer: React.FC<SuperpositionVisualizerProps> = ({
  className = '',
  onExploreInLab
}) => {
  // Step in transformation: 0: Ground |0>, 1: Apply H, 2: Superposition |+>, 3: Simulated Measurement
  const [step, setStep] = useState<number>(0);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [includeSecondH, setIncludeSecondH] = useState(false);

  // Run simulation using the real TypeScript state-vector simulator
  const runLiveSimulation = (hasDoubleH: boolean = includeSecondH) => {
    setIsSimulating(true);

    const testCircuit: Circuit = {
      id: hasDoubleH ? 'sim-h-to-h' : 'sim-single-h',
      name: hasDoubleH ? 'Wave Interference (H → H)' : 'Superposition (H)',
      numberOfQubits: 1,
      gates: hasDoubleH
        ? [
            { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
            { id: 'g1', gateId: 'H', targetQubit: 0, position: 1 },
            { id: 'm0', gateId: 'M', targetQubit: 0, position: 2 }
          ]
        : [
            { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
            { id: 'm0', gateId: 'M', targetQubit: 0, position: 1 }
          ],
      measurements: [0]
    };

    setTimeout(() => {
      const res = simulateQuantumCircuit(testCircuit, 1024);
      setSimResult(res);
      setIsSimulating(false);
      setStep(3);
    }, 350);
  };

  const handleReset = () => {
    setStep(0);
    setSimResult(null);
    setIncludeSecondH(false);
  };

  const handleNextStep = () => {
    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2) runLiveSimulation();
  };

  // State calculations based on current step
  const getDisplayState = () => {
    if (step === 0) {
      return {
        label: '|0⟩ Ground State',
        dirac: '|ψ⟩ = 1.00|0⟩ + 0.00|1⟩',
        thetaDeg: 0,
        prob0: 100,
        prob1: 0,
        description: 'Qubit is initialized at the North Pole with 100% certainty of measuring 0.'
      };
    }
    if (step === 1) {
      return {
        label: 'Applying Hadamard Unitary H',
        dirac: 'H|0⟩ = (|0⟩ + |1⟩) / √2',
        thetaDeg: 45,
        prob0: 75,
        prob1: 25,
        description: 'The H gate performs a 90° rotation around the Y-axis followed by a 180° rotation around X, mapping basis states into equal linear combinations.'
      };
    }
    if (step === 2) {
      return {
        label: includeSecondH ? 'Wave Interference: Second H Applied' : '|+⟩ Balanced Superposition',
        dirac: includeSecondH ? 'H · H|0⟩ = I|0⟩ = |0⟩' : '|ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩',
        thetaDeg: includeSecondH ? 0 : 90,
        prob0: includeSecondH ? 100 : 50,
        prob1: includeSecondH ? 0 : 50,
        description: includeSecondH
          ? 'Phase amplitudes constructively interfere back to |0⟩ and destructively cancel at |1⟩.'
          : 'The state vector rests on the equator. Amplitudes α = β = 1/√2 yield exactly 50% probability each.'
      };
    }
    // Step 3: Measured
    const p0 = simResult ? (simResult.counts['0'] || 0) / 1024 * 100 : (includeSecondH ? 100 : 50);
    const p1 = simResult ? (simResult.counts['1'] || 0) / 1024 * 100 : (includeSecondH ? 0 : 50);
    return {
      label: 'Post-Measurement State Collapse',
      dirac: includeSecondH ? 'Measured: 100% |0⟩' : `Measured: ${p0.toFixed(1)}% |0⟩, ${p1.toFixed(1)}% |1⟩`,
      thetaDeg: includeSecondH ? 0 : 90,
      prob0: p0,
      prob1: p1,
      description: `Projective measurement collapsed the superposition over 1,024 simulated shots. Notice the realistic quantum statistical shot noise.`
    };
  };

  const currentDisplay = getDisplayState();

  return (
    <div
      className={`p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-5 ${className}`}
      data-testid="superposition-visualizer"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-card)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
              Interactive Superposition Explorer
            </h4>
            <p className="text-xs text-[var(--fg-muted)]">
              Follow the journey: Gate → State Vector Transformation → Born Rule Probability → Measurement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-300">
            Step {step + 1} of 4
          </span>
        </div>
      </div>

      {/* Interactive Step Stepper */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono">
        {[
          { idx: 0, label: '1. Initial |0⟩' },
          { idx: 1, label: '2. Apply H' },
          { idx: 2, label: '3. |+⟩ State' },
          { idx: 3, label: '4. Measure' }
        ].map((s) => (
          <button
            key={s.idx}
            type="button"
            onClick={() => {
              setStep(s.idx);
              if (s.idx === 3 && !simResult) runLiveSimulation();
            }}
            className={`p-2 rounded-lg border text-center transition-all ${
              step === s.idx
                ? 'bg-sciteal-500/20 border-sciteal-500 text-[var(--fg-main)] font-bold shadow-sm'
                : step > s.idx
                ? 'bg-[var(--surface-card)] border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)] hover:border-sciteal-500/40'
            }`}
          >
            <div className="truncate">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Main Visual Representation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: 2D Bloch Cross-Section with Animated Vector */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 rounded-full border-2 border-dashed border-sciteal-500/40 flex items-center justify-center bg-[var(--surface-card)] shadow-inner">
            {/* Z-Axis & Equator */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-[var(--border-strong)]" />
            <div className="absolute left-0 right-0 h-[1px] bg-[var(--border-strong)]" />

            {/* Equator ring */}
            <div className="absolute w-full h-14 rounded-full border border-teal-500/30 border-dashed" />

            {/* Labels */}
            <span className="absolute -top-3 text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-[var(--surface-card)] px-1 rounded border border-[var(--border-card)]">
              |0⟩ (North Pole)
            </span>
            <span className="absolute -bottom-3 text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-[var(--surface-card)] px-1 rounded border border-[var(--border-card)]">
              |1⟩ (South Pole)
            </span>
            <span className="absolute -right-3 text-[10px] font-mono text-[var(--fg-muted)] bg-[var(--surface-card)] px-1 rounded border border-[var(--border-card)]">
              |+⟩
            </span>

            {/* Vector pointer */}
            <div
              className="absolute w-1.5 h-20 bg-teal-600 dark:bg-teal-400 rounded-full origin-bottom transition-all duration-700 shadow-md"
              style={{
                bottom: '50%',
                transform: `rotate(${currentDisplay.thetaDeg}deg)`
              }}
            />
            <div className="w-3 h-3 rounded-full bg-teal-700 dark:bg-teal-300 z-10" />
          </div>

          <span className="text-[11px] font-mono text-[var(--fg-muted)] mt-2">
            Bloch angle: θ = {currentDisplay.thetaDeg}°
          </span>
        </div>

        {/* Right: State Amplitudes & Probabilities */}
        <div className="md:col-span-7 space-y-3">
          <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1">
            <span className="text-[10px] text-[var(--fg-muted)] font-mono uppercase tracking-wider block">
              {currentDisplay.label}
            </span>
            <div className="text-sm font-bold text-sciteal-700 dark:text-sciteal-300 font-mono">
              {currentDisplay.dirac}
            </div>
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed pt-1">
              {currentDisplay.description}
            </p>
          </div>

          {/* Probability Bars */}
          <div className="space-y-2 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-teal-700 dark:text-teal-400">
                  {step === 3 ? 'Measured |0⟩ Frequency' : 'Theoretical Prob(|0⟩)'}
                </span>
                <span className="font-bold text-[var(--fg-main)]">
                  {currentDisplay.prob0.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                <div
                  className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentDisplay.prob0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {step === 3 ? 'Measured |1⟩ Frequency' : 'Theoretical Prob(|1⟩)'}
                </span>
                <span className="font-bold text-[var(--fg-main)]">
                  {currentDisplay.prob1.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                <div
                  className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentDisplay.prob1}%` }}
                />
              </div>
            </div>
          </div>

          {/* Wave Interference Experiment Option */}
          <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[var(--fg-main)]">
              <input
                type="checkbox"
                checked={includeSecondH}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIncludeSecondH(checked);
                  if (step >= 2) {
                    runLiveSimulation(checked);
                  }
                }}
                className="rounded accent-teal-600"
              />
              <span className="font-mono text-[11px]">Test Wave Interference (Apply 2nd H gate)</span>
            </label>

            {includeSecondH && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                H · H = I (Identity)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-card)]">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Demonstration
        </Button>

        <div className="flex items-center gap-2">
          {step < 3 ? (
            <Button
              variant="quantum"
              size="sm"
              onClick={handleNextStep}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {step === 2 ? 'Run 1,024 Measurement Shots' : 'Next Transformation Step →'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => runLiveSimulation()}
              disabled={isSimulating}
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            >
              {isSimulating ? 'Sampling Shots...' : 'Re-Sample 1,024 Shots'}
            </Button>
          )}

          {onExploreInLab && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExploreInLab}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open in Circuit Lab
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
