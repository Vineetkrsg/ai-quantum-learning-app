import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LEARNING_MODULES } from '../../mock/modulesData';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, ArrowRight, Play, Sparkles, BookOpen, Atom } from 'lucide-react';

export const QuantumLearningPath: React.FC = () => {
  const { moduleProgress, completedLessonsByModule } = useProgress();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Find active module
  const activeModuleIndex = LEARNING_MODULES.findIndex(
    (m) => (moduleProgress[m.slug] || 0) < 100
  );
  const currentIndex = activeModuleIndex >= 0 ? activeModuleIndex : LEARNING_MODULES.length - 1;

  // Active / hovered milestone for interactive sequential inspection
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Default inspection targets current active module if no hover
  const inspectedIdx = hoveredIdx !== null ? hoveredIdx : currentIndex;
  const inspectedModule = LEARNING_MODULES[inspectedIdx];
  const inspectedProgress = moduleProgress[inspectedModule.slug] || 0;
  const inspectedDone = inspectedProgress === 100;
  const isInspectedCurrent = inspectedIdx === currentIndex && !inspectedDone;

  const conceptExplanations: Record<string, { summary: string; milestone: string; keyIdea: string }> = {
    fundamentals: {
      summary: 'Explore classical bits vs quantum states, Dirac bra-ket notations, and basis postulates.',
      milestone: 'Binary to Qubit Postulate',
      keyIdea: '|0⟩ and |1⟩ state vector foundations'
    },
    qubits: {
      summary: 'Map single-qubit states onto the 3D Bloch sphere with spherical angles θ and φ.',
      milestone: 'Bloch Coordinates & Pauli-X',
      keyIdea: 'Pure states on sphere surface: |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩'
    },
    superposition: {
      summary: 'Explore how a qubit can represent multiple possible states simultaneously until measurement.',
      milestone: 'Hadamard Wave Branching',
      keyIdea: 'H|0⟩ = (|0⟩ + |1⟩)/√2 (Equal 50% probability amplitudes)'
    },
    gates: {
      summary: 'Apply unitary transformation matrices to rotate and manipulate quantum vectors reversibly.',
      milestone: 'Unitary Reversible Operators',
      keyIdea: 'U†U = I preserves total probability amplitude norm'
    },
    circuits: {
      summary: 'Sequence multi-qubit wires, quantum operations, and terminal projective measurement collapse.',
      milestone: 'Multi-Wire Gate Sequencing',
      keyIdea: 'Circuit depth, timing, and irreversible wave collapse'
    },
    entanglement: {
      summary: 'Synthesize Bell states (|Φ⁺⟩) where two qubits share inseparable quantum correlations.',
      milestone: 'Bell State (|Φ⁺⟩) Synthesis',
      keyIdea: 'Non-separable state: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2'
    },
    algorithms: {
      summary: 'Harness constructive and destructive quantum interference to amplify correct computational results.',
      milestone: 'Interference Amplification',
      keyIdea: 'Phase kickback in Deutsch-Jozsa & Grover amplitude amplification'
    }
  };

  const inspectedInfo = conceptExplanations[inspectedModule.slug] || {
    summary: inspectedModule.description,
    milestone: inspectedModule.title,
    keyIdea: 'Quantum computing concept'
  };

  // Actual completed count
  const completedCount = LEARNING_MODULES.filter(
    (m) => (moduleProgress[m.slug] || 0) === 100
  ).length;

  return (
    <Card variant="default" className="p-6 relative overflow-hidden" data-tour="dashboard-learning-path">
      {/* Background subtle quantum circuit traces */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--circuit-wire)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Header with truthful live metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="teal" dot>
              Interactive Learning Pathway
            </Badge>
            <span className="text-xs font-mono text-[var(--fg-muted)]">
              Curriculum Map
            </span>
          </div>
          <h3 className="text-lg font-bold text-[var(--fg-main)] flex items-center gap-2">
            <span>Your Quantum Journey</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-card)] font-mono text-sciteal-700 dark:text-sciteal-400 font-semibold">
              {completedCount} / 7 Completed
            </span>
          </h3>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            Move pointer across nodes to inspect module relationships and curriculum milestones.
          </p>
        </div>

        <Link
          to={`/learn/${LEARNING_MODULES[currentIndex].slug}`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sciteal-700 hover:bg-sciteal-600 dark:bg-sciteal-600 dark:hover:bg-sciteal-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Resume Module {currentIndex + 1}</span>
        </Link>
      </div>

      {/* Connected Pathway Track */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
          {LEARNING_MODULES.map((mod, idx) => {
            const progress = moduleProgress[mod.slug] || 0;
            const isCompleted = progress === 100;
            const isCurrent = idx === currentIndex && !isCompleted;
            const isHovered = hoveredIdx === idx;
            const isPastInspected = idx <= inspectedIdx;

            // Hover status text required by prompt Section 9
            const statusLabel = isCompleted
              ? 'Completed'
              : isCurrent
              ? 'Current learning focus'
              : 'Coming next';

            const milestone = conceptExplanations[mod.slug]?.milestone || mod.title;

            return (
              <div
                key={mod.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => navigate(`/learn/${mod.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/learn/${mod.slug}`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Module ${idx + 1}: ${mod.title} - ${statusLabel}`}
                className={`relative flex flex-col justify-between p-3 rounded-xl transition-all duration-200 border cursor-pointer outline-none focus:ring-2 focus:ring-sciteal-500 ${
                  isHovered
                    ? 'scale-[1.03] shadow-md border-sciteal-500 bg-sciteal-500/15 ring-2 ring-sciteal-500/20'
                    : isCompleted
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 shadow-sm'
                    : isCurrent
                    ? 'bg-sciteal-500/10 dark:bg-sciteal-950/30 border-sciteal-500 ring-1 ring-sciteal-500/30 shadow-sm'
                    : isPastInspected
                    ? 'bg-[var(--surface-sunken)] border-sciteal-500/30 opacity-95'
                    : 'bg-[var(--surface-sunken)] border-[var(--border-card)] hover:border-[var(--border-strong)] opacity-80'
                }`}
              >
                {/* Node Top Indicator */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono font-bold text-[var(--fg-muted)]">
                    0{idx + 1}
                  </span>

                  {isCompleted ? (
                    <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : isCurrent ? (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sciteal-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sciteal-500" />
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[var(--border-card)]" />
                  )}
                </div>

                {/* Module Title */}
                <div>
                  <h4 className="text-xs font-bold text-[var(--fg-main)] line-clamp-1">
                    {mod.title}
                  </h4>
                  <p className="text-[10px] text-[var(--fg-muted)] mt-1 line-clamp-1 leading-snug">
                    {milestone}
                  </p>
                </div>

                {/* Status indicator on node */}
                <div className="mt-2.5 pt-2 border-t border-[var(--border-card)] flex items-center justify-between text-[10px] font-mono">
                  <span className={
                    isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : isCurrent
                      ? 'text-sciteal-700 dark:text-sciteal-400 font-semibold'
                      : 'text-[var(--fg-muted)]'
                  }>
                    {progress}%
                  </span>

                  <span className="text-[9px] text-[var(--fg-muted)] font-sans">
                    {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Next'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Progress Path Inspection Panel (Prompt Section 9 & 10) */}
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-sciteal-500/30 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sciteal-500/15 border border-sciteal-500/30 flex items-center justify-center shrink-0">
                <Atom className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[var(--fg-main)]">
                    Module 0{inspectedIdx + 1}: {inspectedModule.title}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                    inspectedDone
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : isInspectedCurrent
                      ? 'bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border-sciteal-500/30'
                      : 'bg-[var(--surface-card)] text-[var(--fg-muted)] border-[var(--border-card)]'
                  }`}>
                    {inspectedDone
                      ? 'Completed'
                      : isInspectedCurrent
                      ? 'Current learning focus'
                      : 'Coming next'}
                  </span>
                </div>
                <p className="text-xs text-[var(--fg-muted)] mt-0.5 leading-relaxed">
                  {inspectedInfo.summary}
                </p>
                <div className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400 mt-1">
                  Key Concept: {inspectedInfo.keyIdea}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center shrink-0">
              <Link
                to={`/learn/${inspectedModule.slug}`}
                className="text-xs px-3 py-1.5 rounded-lg bg-sciteal-600 dark:bg-sciteal-600 hover:bg-sciteal-500 text-white font-medium inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{inspectedDone ? 'Review Module' : isInspectedCurrent ? 'Continue Learning' : 'Preview Concepts'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

