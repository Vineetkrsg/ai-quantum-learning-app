import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Circuit, CircuitStepState } from '../../../types/quantum';
import { simulateCircuitSteps } from '../../../services/quantumSimulator';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Activity, ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { Button } from '../../ui/Button';

interface CircuitPropagationVisualizerProps {
  circuit?: Circuit;
  className?: string;
  onExploreInLab?: () => void;
}

const DEFAULT_SAMPLE_CIRCUITS: { id: string; name: string; circuit: Circuit }[] = [
  {
    id: 'h-x-seq',
    name: 'Superposition & Flip (H → X → M)',
    circuit: {
      id: 'demo-h-x',
      name: 'Hadamard then Pauli-X',
      numberOfQubits: 1,
      gates: [
        { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'g1', gateId: 'X', targetQubit: 0, position: 1 },
        { id: 'm0', gateId: 'M', targetQubit: 0, position: 2 }
      ],
      measurements: [0]
    }
  },
  {
    id: 'bell-seq',
    name: 'Bell State Synthesis (H → CNOT)',
    circuit: {
      id: 'demo-bell',
      name: 'Entanglement Bell State',
      numberOfQubits: 2,
      gates: [
        { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'g1', gateId: 'CNOT', controlQubit: 0, targetQubit: 1, position: 1 },
        { id: 'm0', gateId: 'M', targetQubit: 0, position: 2 },
        { id: 'm1', gateId: 'M', targetQubit: 1, position: 2 }
      ],
      measurements: [0, 1]
    }
  },
  {
    id: 'phase-seq',
    name: 'Phase Evolution (H → Z → H)',
    circuit: {
      id: 'demo-phase',
      name: 'Hadamard-Z-Hadamard (Bit Flip via Phase)',
      numberOfQubits: 1,
      gates: [
        { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'g1', gateId: 'Z', targetQubit: 0, position: 1 },
        { id: 'g2', gateId: 'H', targetQubit: 0, position: 2 },
        { id: 'm0', gateId: 'M', targetQubit: 0, position: 3 }
      ],
      measurements: [0]
    }
  }
];

export const CircuitPropagationVisualizer: React.FC<CircuitPropagationVisualizerProps> = ({
  circuit: externalCircuit,
  className = '',
  onExploreInLab
}) => {
  const [selectedDemoId, setSelectedDemoId] = useState<string>('h-x-seq');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<number | null>(null);

  const activeCircuit = useMemo<Circuit>(() => {
    if (externalCircuit) return externalCircuit;
    const found = DEFAULT_SAMPLE_CIRCUITS.find((s) => s.id === selectedDemoId);
    return found ? found.circuit : DEFAULT_SAMPLE_CIRCUITS[0].circuit;
  }, [externalCircuit, selectedDemoId]);

  // Compute exact intermediate states after each gate
  const steps: CircuitStepState[] = useMemo(() => {
    return simulateCircuitSteps(activeCircuit);
  }, [activeCircuit]);

  // Ensure current step stays in bounds
  const clampedStepIndex = Math.min(currentStepIndex, Math.max(0, steps.length - 1));
  const currentStep = steps[clampedStepIndex] || steps[0];

  // Auto-play interval
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, steps.length]);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const togglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-5 ${className}`}
      data-testid="circuit-propagation-visualizer"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-card)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sciteal-500/15 text-sciteal-600 dark:text-sciteal-400 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
              State Propagation Through Circuit
            </h4>
            <p className="text-xs text-[var(--fg-muted)]">
              Step through gates chronologically to observe how the quantum state evolves at each temporal slice.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-300">
            Step {clampedStepIndex} of {steps.length - 1}
          </span>
          {onExploreInLab && (
            <Button variant="ghost" size="sm" onClick={onExploreInLab} className="text-xs py-1 h-7">
              Lab Mode <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Demo Selector (only when no external circuit provided) */}
      {!externalCircuit && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-[var(--fg-muted)] uppercase tracking-wider block">
            Select Circuit Sequence to Step Through:
          </span>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SAMPLE_CIRCUITS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => {
                  setSelectedDemoId(demo.id);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                  selectedDemoId === demo.id
                    ? 'bg-sciteal-500/15 border-sciteal-500/40 text-sciteal-800 dark:text-sciteal-200 font-bold'
                    : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
                }`}
              >
                {demo.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stepper Timeline Bar */}
      <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--fg-muted)]">
          <span className="font-semibold text-[var(--fg-main)]">Circuit Step Timeline</span>
          <span className="font-mono text-[11px]">
            {clampedStepIndex === 0 ? 'State: Initial |0...0⟩' : `Active Gate: ${currentStep.stepLabel}`}
          </span>
        </div>

        {/* Timeline Pills */}
        <div className="grid grid-cols-2 sm:grid-flex sm:flex sm:items-center gap-2">
          {steps.map((s, idx) => {
            const isCurrent = idx === clampedStepIndex;
            const isPast = idx < clampedStepIndex;
            return (
              <button
                key={`step-pill-${idx}`}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`flex-1 min-w-[70px] p-2 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'bg-sciteal-500/15 border-sciteal-500 text-sciteal-900 dark:text-sciteal-100 ring-1 ring-sciteal-500/30'
                    : isPast
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-muted)] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold">
                    {idx === 0 ? 'START' : `STEP ${idx}`}
                  </span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-sciteal-500 animate-pulse" />}
                  {isPast && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </div>
                <div className="text-xs font-mono font-semibold truncate mt-0.5">
                  {idx === 0 ? '|0...0⟩' : s.gate?.gateId || 'Gate'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-card)]">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={clampedStepIndex === 0}
              className="h-8 px-2.5"
              aria-label="Previous step"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={isPlaying ? 'primary' : 'outline'}
              size="sm"
              onClick={togglePlay}
              className="h-8 px-3 font-mono text-xs flex items-center gap-1.5"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> {clampedStepIndex >= steps.length - 1 ? 'Replay' : 'Play'}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={clampedStepIndex >= steps.length - 1}
              className="h-8 px-2.5"
              aria-label="Next step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs font-mono text-[var(--fg-muted)] hover:text-[var(--fg-main)]"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Reset to |0⟩
          </Button>
        </div>
      </div>

      {/* Step Description & Educational Context */}
      <div className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/25 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-sciteal-800 dark:text-sciteal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentStep.stepLabel}</span>
          </div>
          {currentStep.isEntangled && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30">
              Entangled State
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
          {currentStep.description}
        </p>
      </div>

      {/* State & Probability Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basis State Probabilities */}
        <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--fg-main)]">
              Theoretical Basis Probabilities
            </span>
            <span className="text-[10px] font-mono text-[var(--fg-muted)]">
              Born Rule |α|²
            </span>
          </div>

          <div className="space-y-2">
            {Object.entries(currentStep.theoreticalProbabilities).map(([basis, prob]) => {
              const pct = (prob * 100).toFixed(1);
              const isNonZero = prob > 0.001;
              return (
                <div key={basis} className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className={`font-bold ${isNonZero ? 'text-sciteal-700 dark:text-sciteal-300' : 'text-[var(--fg-muted)]'}`}>
                      |{basis}⟩
                    </span>
                    <span className="text-[var(--fg-muted)]">
                      {prob.toFixed(3)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-card)] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isNonZero
                          ? 'bg-gradient-to-r from-sciteal-600 to-teal-400'
                          : 'bg-slate-300 dark:bg-slate-700 opacity-20'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* State Vector Amplitudes */}
        <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--fg-main)]">
              Complex State Amplitudes
            </span>
            <span className="text-[10px] font-mono text-[var(--fg-muted)]">
              |ψ⟩ = ∑ αᵢ|i⟩
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {currentStep.stateVector.map((elem) => {
              const sign = elem.imag >= 0 ? '+' : '-';
              const absImag = Math.abs(elem.imag);
              const isZero = elem.real === 0 && elem.imag === 0;
              return (
                <div
                  key={elem.state}
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    !isZero
                      ? 'bg-[var(--surface-sunken)] border-sciteal-500/30 text-[var(--fg-main)] font-semibold'
                      : 'bg-transparent border-transparent text-[var(--fg-muted)] opacity-50'
                  }`}
                >
                  <span className="text-sciteal-700 dark:text-sciteal-300">
                    |{elem.state}⟩
                  </span>
                  <span>
                    {elem.real.toFixed(3)} {sign} {absImag.toFixed(3)}i
                  </span>
                </div>
              );
            })}
          </div>

          {currentStep.blochCoordinates && (
            <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between text-[11px] font-mono text-[var(--fg-muted)]">
              <span>θ: {(currentStep.blochCoordinates.theta * 180 / Math.PI).toFixed(0)}°</span>
              <span>φ: {(currentStep.blochCoordinates.phi * 180 / Math.PI).toFixed(0)}°</span>
              <span>z: {currentStep.blochCoordinates.z.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
