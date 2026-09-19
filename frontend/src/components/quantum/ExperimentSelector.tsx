import React, { useState } from 'react';
import { GuidedExperiment } from '../../types/quantum';
import { GUIDED_EXPERIMENTS } from '../../mock/experimentsData';
import { useProgress } from '../../context/ProgressContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Compass, 
  Cpu, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { CircuitLabIcon } from './CircuitLabIcon';

interface ExperimentSelectorProps {
  currentExperimentId: string | null;
  mode: 'experiment' | 'freeform';
  onSelectExperiment: (experimentId: string) => void;
  onSelectFreeform: () => void;
}

export const ExperimentSelector: React.FC<ExperimentSelectorProps> = ({
  currentExperimentId,
  mode,
  onSelectExperiment,
  onSelectFreeform
}) => {
  const { experimentsCompleted } = useProgress();
  const { startDemo } = useOnboarding();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const levels = [
    { level: 1, label: 'Level 1: Single Qubit', short: 'L1: Single Qubit' },
    { level: 2, label: 'Level 2: Gates & Phase', short: 'L2: Phase' },
    { level: 3, label: 'Level 3: Entanglement', short: 'L3: Entangled' },
    { level: 4, label: 'Level 4: Algorithms', short: 'L4: Algorithms' },
  ];

  const currentLevelExperiments = GUIDED_EXPERIMENTS.filter(e => e.levelNumber === selectedLevel);
  const totalCompleted = GUIDED_EXPERIMENTS.filter(e => experimentsCompleted.includes(e.id)).length;

  return (
    <Card variant="default" className="p-4 space-y-4">
      {/* Top Header: Mode Switcher & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-card)]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <h3 className="text-sm font-bold text-[var(--fg-main)]">
            Interactive Quantum Experiments
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sciteal-500/10 text-sciteal-700 dark:text-sciteal-300 font-semibold border border-sciteal-500/30">
            {totalCompleted} / {GUIDED_EXPERIMENTS.length} Complete
          </span>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] text-xs">
          <button
            type="button"
            onClick={() => {
              if (mode !== 'experiment') {
                const firstExp = GUIDED_EXPERIMENTS[0].id;
                onSelectExperiment(currentExperimentId || firstExp);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'experiment'
                ? 'bg-[var(--surface-card)] text-sciteal-700 dark:text-sciteal-300 shadow-xs font-semibold border border-[var(--border-card)]'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Guided Experiments</span>
          </button>

          <button
            type="button"
            onClick={onSelectFreeform}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'freeform'
                ? 'bg-[var(--surface-card)] text-sciteal-700 dark:text-sciteal-300 shadow-xs font-semibold border border-[var(--border-card)]'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Freeform Lab</span>
          </button>
        </div>
      </div>

      {mode === 'experiment' && (
        <div className="space-y-3">
          {/* Beginner Interactive Demo Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-sciteal-500/10 via-sciteal-500/5 to-transparent border border-sciteal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sciteal-500/20 text-sciteal-700 dark:text-sciteal-300 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--fg-main)]">New to Quantum Computing?</span>
                <p className="text-[11px] text-[var(--fg-muted)]">
                  Start with a 3-minute guided demonstration of quantum superposition. No prior knowledge required!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => startDemo(0)}
              className="px-3 py-1.5 rounded-lg bg-sciteal-600 hover:bg-sciteal-700 text-white text-xs font-semibold whitespace-nowrap transition-all shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Try Interactive Demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Level Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {levels.map((lvl) => {
              const levelExperiments = GUIDED_EXPERIMENTS.filter(e => e.levelNumber === lvl.level);
              const levelDone = levelExperiments.filter(e => experimentsCompleted.includes(e.id)).length;
              const isSelected = selectedLevel === lvl.level;

              return (
                <button
                  key={lvl.level}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sciteal-500/15 border-sciteal-500/60 text-sciteal-800 dark:text-sciteal-200 font-bold shadow-xs'
                      : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] hover:border-[var(--border-highlight)]'
                  }`}
                >
                  <span>{lvl.label}</span>
                  <span className="text-[10px] font-mono opacity-80">
                    ({levelDone}/{levelExperiments.length})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Experiments List for current level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {currentLevelExperiments.map((exp) => {
              const isActive = currentExperimentId === exp.id;
              const isDone = experimentsCompleted.includes(exp.id);

              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => onSelectExperiment(exp.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                    isActive
                      ? 'bg-sciteal-500/15 border-sciteal-600 dark:border-sciteal-400 ring-2 ring-sciteal-500/30'
                      : 'bg-[var(--surface-sunken)] border-[var(--border-card)] hover:border-sciteal-500/50 hover:bg-[var(--surface-subtle)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-xs font-bold text-[var(--fg-main)] line-clamp-1">
                      {exp.title}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--fg-muted)] flex-shrink-0">
                        {exp.initialCircuit.numberOfQubits}Q
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[var(--fg-muted)] line-clamp-2 leading-relaxed">
                    {exp.objective}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border-card)]/60 text-[10px] font-mono text-[var(--fg-muted)]">
                    <span>{exp.initialCircuit.gates.length} Gates</span>
                    <span className="flex items-center gap-0.5 text-sciteal-700 dark:text-sciteal-400 font-semibold">
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'freeform' && (
        <div className="p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] flex items-center justify-between text-xs text-[var(--fg-muted)]">
          <div className="flex items-center gap-2">
            <CircuitLabIcon className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span>Freeform Circuit Lab mode active: place any gates, customize shots, and simulate freely.</span>
          </div>
          <button
            type="button"
            onClick={() => onSelectExperiment(GUIDED_EXPERIMENTS[0].id)}
            className="text-xs text-sciteal-700 dark:text-sciteal-400 hover:underline font-semibold whitespace-nowrap cursor-pointer"
          >
            ← Switch to Guided Experiments
          </button>
        </div>
      )}
    </Card>
  );
};
