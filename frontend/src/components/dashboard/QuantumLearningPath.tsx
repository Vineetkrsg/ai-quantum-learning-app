import React, { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LEARNING_MODULES } from '../../mock/modulesData';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MiniModulePreview } from './MiniModulePreview';
import { 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Compass, 
  Atom, 
  Sparkles,
  GitBranch,
  Layers,
  Zap,
  BookOpen
} from 'lucide-react';

interface QuantumLearningPathProps {
  highlightedSlug?: string | null;
  onHighlightSlug?: (slug: string | null) => void;
}

const QuantumLearningPathComp: React.FC<QuantumLearningPathProps> = ({
  highlightedSlug,
  onHighlightSlug
}) => {
  const { moduleProgress, completedLessonsByModule } = useProgress();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Find active (first incomplete) module index
  const activeModuleIndex = LEARNING_MODULES.findIndex(
    (m) => (moduleProgress[m.slug] || 0) < 100
  );
  const currentIndex = activeModuleIndex >= 0 ? activeModuleIndex : LEARNING_MODULES.length - 1;

  // Local hover / selection state for milestone inspection
  const [internalHoveredSlug, setInternalHoveredSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string>(LEARNING_MODULES[currentIndex].slug);

  // Motion preference detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Effective inspected target: external highlight takes precedence if active, else internal hover, else selected
  const activeHoverSlug = highlightedSlug || internalHoveredSlug;
  const inspectedSlug = activeHoverSlug || selectedSlug;
  const inspectedModule = LEARNING_MODULES.find((m) => m.slug === inspectedSlug) || LEARNING_MODULES[currentIndex];
  const inspectedIdx = LEARNING_MODULES.findIndex((m) => m.slug === inspectedModule.slug);
  const inspectedProgress = moduleProgress[inspectedModule.slug] || 0;
  const inspectedDone = inspectedProgress === 100;
  const isInspectedCurrent = inspectedIdx === currentIndex && !inspectedDone;

  const handleMouseEnter = (slug: string) => {
    setInternalHoveredSlug(slug);
    if (onHighlightSlug) onHighlightSlug(slug);
  };

  const handleMouseLeave = () => {
    setInternalHoveredSlug(null);
    if (onHighlightSlug) onHighlightSlug(null);
  };

  const handleNodeClick = (slug: string) => {
    setSelectedSlug(slug);
  };

  const handleNodeDoubleClick = (slug: string) => {
    navigate(`/learn/${slug}`);
  };

  // Scientific milestone formulations for each quantum domain
  const conceptExplanations: Record<string, { summary: string; milestone: string; keyIdea: string; formula: string }> = {
    fundamentals: {
      summary: 'Explore classical bits vs quantum states, Dirac bra-ket notations, and physical state vectors.',
      milestone: 'Binary to Qubit Postulate',
      keyIdea: '|0⟩ and |1⟩ state vector foundations in 2D Hilbert space',
      formula: '|ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1'
    },
    qubits: {
      summary: 'Map single-qubit states onto the 3D Bloch sphere with spherical polar angles θ and φ.',
      milestone: 'Bloch Coordinates & Pauli-X',
      keyIdea: 'Pure states on sphere surface with unitary rotational degrees of freedom',
      formula: '|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩'
    },
    superposition: {
      summary: 'Explore how a qubit can represent simultaneous potential states until measurement collapse.',
      milestone: 'Hadamard Wave Branching',
      keyIdea: 'Hadamard operator produces balanced 50/50 probability amplitude vectors',
      formula: 'H|0⟩ = (|0⟩ + |1⟩)/√2 (Equal 50% probability)'
    },
    gates: {
      summary: 'Apply unitary transformation matrices to rotate and steer quantum vectors reversibly.',
      milestone: 'Unitary Reversible Operators',
      keyIdea: 'Norm-preserving matrix transformations that prevent loss of quantum information',
      formula: 'U†U = I (Reversible state evolution)'
    },
    circuits: {
      summary: 'Sequence multi-qubit wires, quantum operations, and terminal projective measurement collapse.',
      milestone: 'Multi-Wire Gate Sequencing',
      keyIdea: 'Circuit depth, wire ordering, temporal execution, and collapse dynamics',
      formula: '|ψ_final⟩ = (U_n · ... · U_2 · U_1)|ψ_0⟩'
    },
    entanglement: {
      summary: 'Synthesize Bell states (|Φ⁺⟩) where two qubits share non-separable quantum correlations.',
      milestone: 'Bell State (|Φ⁺⟩) Synthesis',
      keyIdea: 'Non-local state correlations with zero classical communication overhead',
      formula: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2'
    },
    algorithms: {
      summary: 'Harness constructive and destructive quantum interference to amplify correct computational results.',
      milestone: 'Interference Amplification',
      keyIdea: 'Phase kickback in Deutsch-Jozsa & Grover amplitude amplification routines',
      formula: 'G = (2|s⟩⟨s| - I) · O (Amplitude Amplification)'
    }
  };

  const inspectedInfo = conceptExplanations[inspectedModule.slug] || {
    summary: inspectedModule.description,
    milestone: inspectedModule.title,
    keyIdea: 'Quantum computing domain',
    formula: '|ψ⟩'
  };

  // Real completed module count
  const completedCount = LEARNING_MODULES.filter(
    (m) => (moduleProgress[m.slug] || 0) === 100
  ).length;

  const completedLessonsInInspected = (completedLessonsByModule[inspectedModule.slug] || []).length;
  const totalLessonsInInspected = inspectedModule.lessons.length;

  // Colors based on theme
  const isDark = theme === 'dark';
  const isHighContrast = theme === 'high-contrast';

  const conduitColorCompleted = isHighContrast ? '#000000' : '#10b981';
  const conduitColorActive = isHighContrast ? '#000000' : isDark ? '#2dd4bf' : '#0d9488';
  const conduitColorUpcoming = isHighContrast ? '#d2d9e2' : isDark ? '#223043' : '#cbd5e1';

  // Helper to determine status and connection for a module
  const getModuleState = (modSlug: string, index: number) => {
    const progress = moduleProgress[modSlug] || 0;
    const isDone = progress === 100;
    const isCur = index === currentIndex && !isDone;
    const isHighlighted = activeHoverSlug === modSlug;
    return { progress, isDone, isCur, isHighlighted };
  };

  return (
    <Card 
      variant="default" 
      className="p-5 sm:p-6 relative overflow-hidden transition-all duration-200 border-[var(--border-card)] shadow-sm" 
      data-tour="dashboard-learning-path"
    >
      {/* Background Subtle Waveguide Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="quantum-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="0.75" fill="var(--circuit-wire)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#quantum-grid-pattern)" />
        </svg>
      </div>

      {/* Control Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sciteal-500/10 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/25 text-[10px] font-mono font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-sciteal-500 animate-pulse" />
              Quantum Curriculum Topology
            </span>
            <span className="text-[11px] font-mono text-[var(--fg-muted)]">
              Interactive Learning Journey
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[var(--fg-main)] flex items-center gap-2 tracking-tight">
            <span>Quantum Learning Path</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-card)] font-mono text-sciteal-700 dark:text-sciteal-400 font-bold">
              {completedCount} of 7 Domains Mastered
            </span>
          </h3>

          <p className="text-xs text-[var(--fg-muted)] mt-1 max-w-2xl leading-relaxed">
            Non-linear conceptual sequence from single-qubit fundamentals to multi-wire circuits, entanglement correlations, and quantum algorithms. Hover or click any node to inspect.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/learn/${LEARNING_MODULES[currentIndex].slug}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sciteal-700 hover:bg-sciteal-600 dark:bg-sciteal-600 dark:hover:bg-sciteal-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 focus:ring-2 focus:ring-sciteal-400 focus:outline-none"
            title={`Resume Module ${currentIndex + 1}: ${LEARNING_MODULES[currentIndex].title}`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume Module {currentIndex + 1}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </Link>
        </div>
      </div>

      {/* 
        DESKTOP / WIDESCREEN TOPOLOGY VIEW (hidden on small screens < 1024px)
        Lattice structure:
        01 Fundamentals -> 02 Qubits -> 03 Superposition -> 04 Gates -> [05 Circuits / 06 Entanglement] -> 07 Algorithms
      */}
      <div className="hidden lg:block relative z-10 py-2">
        {/* SVG Waveguide Bus overlay */}
        <div className="relative w-full h-[184px]">
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none select-none" 
            viewBox="0 0 1000 184" 
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Wire 1: Fundamentals to Qubits */}
            {(() => {
              const m1Done = (moduleProgress['fundamentals'] || 0) === 100;
              const isLeadToCur = currentIndex === 1;
              const stroke = m1Done ? conduitColorCompleted : isLeadToCur ? conduitColorActive : conduitColorUpcoming;
              return (
                <line 
                  x1="125" y1="92" x2="195" y2="92" 
                  stroke={stroke} 
                  strokeWidth={m1Done || isLeadToCur ? "2.5" : "1.5"} 
                  strokeDasharray={isLeadToCur ? "6 8" : m1Done ? "none" : "4 4"}
                  strokeOpacity={m1Done ? "0.9" : isLeadToCur ? "1" : "0.5"}
                  className={isLeadToCur && !prefersReducedMotion ? "animate-waveguide-flow" : ""}
                />
              );
            })()}

            {/* Wire 2: Qubits to Superposition */}
            {(() => {
              const m2Done = (moduleProgress['qubits'] || 0) === 100;
              const isLeadToCur = currentIndex === 2;
              const stroke = m2Done ? conduitColorCompleted : isLeadToCur ? conduitColorActive : conduitColorUpcoming;
              return (
                <line 
                  x1="275" y1="92" x2="345" y2="92" 
                  stroke={stroke} 
                  strokeWidth={m2Done || isLeadToCur ? "2.5" : "1.5"} 
                  strokeDasharray={isLeadToCur ? "6 8" : m2Done ? "none" : "4 4"}
                  strokeOpacity={m2Done ? "0.9" : isLeadToCur ? "1" : "0.5"}
                  className={isLeadToCur && !prefersReducedMotion ? "animate-waveguide-flow" : ""}
                />
              );
            })()}

            {/* Wire 3: Superposition to Gates */}
            {(() => {
              const m3Done = (moduleProgress['superposition'] || 0) === 100;
              const isLeadToCur = currentIndex === 3;
              const stroke = m3Done ? conduitColorCompleted : isLeadToCur ? conduitColorActive : conduitColorUpcoming;
              return (
                <line 
                  x1="425" y1="92" x2="495" y2="92" 
                  stroke={stroke} 
                  strokeWidth={m3Done || isLeadToCur ? "2.5" : "1.5"} 
                  strokeDasharray={isLeadToCur ? "6 8" : m3Done ? "none" : "4 4"}
                  strokeOpacity={m3Done ? "0.9" : isLeadToCur ? "1" : "0.5"}
                  className={isLeadToCur && !prefersReducedMotion ? "animate-waveguide-flow" : ""}
                />
              );
            })()}

            {/* Wire 4a: Gates -> Upper Branch: Circuits */}
            {(() => {
              const m4Done = (moduleProgress['gates'] || 0) === 100;
              const isCircuitsCur = currentIndex === 4;
              const stroke = m4Done ? conduitColorCompleted : isCircuitsCur ? conduitColorActive : conduitColorUpcoming;
              return (
                <path 
                  d="M 575 92 C 625 92, 635 44, 665 44" 
                  fill="none" 
                  stroke={stroke} 
                  strokeWidth={m4Done || isCircuitsCur ? "2.2" : "1.5"} 
                  strokeDasharray={isCircuitsCur ? "6 8" : m4Done ? "none" : "4 4"}
                  strokeOpacity={m4Done ? "0.9" : isCircuitsCur ? "1" : "0.5"}
                  className={isCircuitsCur && !prefersReducedMotion ? "animate-waveguide-flow" : ""}
                />
              );
            })()}

            {/* Wire 4b: Gates -> Lower Branch: Entanglement */}
            {(() => {
              const m4Done = (moduleProgress['gates'] || 0) === 100;
              const isEntangleCur = currentIndex === 5;
              const stroke = m4Done ? conduitColorCompleted : isEntangleCur ? conduitColorActive : conduitColorUpcoming;
              return (
                <path 
                  d="M 575 92 C 625 92, 635 140, 665 140" 
                  fill="none" 
                  stroke={stroke} 
                  strokeWidth={m4Done || isEntangleCur ? "2.2" : "1.5"} 
                  strokeDasharray={isEntangleCur ? "6 8" : m4Done ? "none" : "4 4"}
                  strokeOpacity={m4Done ? "0.9" : isEntangleCur ? "1" : "0.5"}
                  className={isEntangleCur && !prefersReducedMotion ? "animate-waveguide-flow" : ""}
                />
              );
            })()}

            {/* Wire 5a: Circuits -> Algorithms */}
            {(() => {
              const m5Done = (moduleProgress['circuits'] || 0) === 100;
              const isAlgoCur = currentIndex === 6;
              const stroke = m5Done ? conduitColorCompleted : isAlgoCur ? conduitColorActive : conduitColorUpcoming;
              return (
                <path 
                  d="M 755 44 C 795 44, 805 92, 845 92" 
                  fill="none" 
                  stroke={stroke} 
                  strokeWidth={m5Done || isAlgoCur ? "2.2" : "1.5"} 
                  strokeDasharray={isAlgoCur ? "6 8" : m5Done ? "none" : "4 4"}
                  strokeOpacity={m5Done ? "0.9" : isAlgoCur ? "1" : "0.5"}
                  className={isAlgoCur && !prefersReducedMotion ? "animate-waveguide-flow" : ""}
                />
              );
            })()}

            {/* Wire 5b: Entanglement -> Algorithms */}
            {(() => {
              const m6Done = (moduleProgress['entanglement'] || 0) === 100;
              const isAlgoCur = currentIndex === 6;
              const stroke = m6Done ? conduitColorCompleted : isAlgoCur ? conduitColorActive : conduitColorUpcoming;
              return (
                <path 
                  d="M 755 140 C 795 140, 805 92, 845 92" 
                  fill="none" 
                  stroke={stroke} 
                  strokeWidth={m6Done || isAlgoCur ? "2.2" : "1.5"} 
                  strokeDasharray={isAlgoCur ? "6 8" : m6Done ? "none" : "4 4"}
                  strokeOpacity={m6Done ? "0.9" : isAlgoCur ? "1" : "0.5"}
                  className={isAlgoCur && !prefersReducedMotion ? "animate-waveguide-flow" : ""}
                />
              );
            })()}
          </svg>

          {/* Interactive Node Pods Positioned Absolute on the Lattice */}
          {/* Node 1: Fundamentals (Left 2% to 14%, Center Y) */}
          <div className="absolute left-[0%] top-[24px] w-[14%]">
            {renderDesktopNode(LEARNING_MODULES[0], 0)}
          </div>

          {/* Node 2: Qubits (Left 16% to 30%, Center Y) */}
          <div className="absolute left-[15.5%] top-[24px] w-[14%]">
            {renderDesktopNode(LEARNING_MODULES[1], 1)}
          </div>

          {/* Node 3: Superposition (Left 31.5% to 45.5%, Center Y) */}
          <div className="absolute left-[31%] top-[24px] w-[14%]">
            {renderDesktopNode(LEARNING_MODULES[2], 2)}
          </div>

          {/* Node 4: Gates (Left 47% to 61%, Center Y) */}
          <div className="absolute left-[46.5%] top-[24px] w-[14%]">
            {renderDesktopNode(LEARNING_MODULES[3], 3)}
          </div>

          {/* Node 5: Circuits (Upper Branch, Left 64.5%, Top 0) */}
          <div className="absolute left-[63.5%] top-[0px] w-[15%]">
            {renderDesktopBranchNode(LEARNING_MODULES[4], 4, 'Circuits')}
          </div>

          {/* Node 6: Entanglement (Lower Branch, Left 64.5%, Bottom 0) */}
          <div className="absolute left-[63.5%] bottom-[0px] w-[15%]">
            {renderDesktopBranchNode(LEARNING_MODULES[5], 5, 'Entanglement')}
          </div>

          {/* Node 7: Algorithms (Convergence, Left 84% to 98%, Center Y) */}
          <div className="absolute left-[82.5%] top-[24px] w-[17.5%]">
            {renderDesktopNode(LEARNING_MODULES[6], 6)}
          </div>
        </div>
      </div>

      {/* 
        MOBILE & TABLET RESPONSIVE VIEW (< 1024px)
        Vertical connected quantum rail with clean parallel branching for Circuits & Entanglement
      */}
      <div className="block lg:hidden relative z-10 space-y-3 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {LEARNING_MODULES.map((mod, idx) => {
            const { progress, isDone, isCur, isHighlighted } = getModuleState(mod.slug, idx);
            const isInspected = inspectedSlug === mod.slug;

            return (
              <div
                key={mod.id}
                role="button"
                tabIndex={0}
                aria-label={`Module ${idx + 1}: ${mod.title} - ${isDone ? 'Completed' : isCur ? 'Active Focus' : 'Upcoming'} (${progress}%)`}
                onClick={() => handleNodeClick(mod.slug)}
                onDoubleClick={() => handleNodeDoubleClick(mod.slug)}
                onMouseEnter={() => handleMouseEnter(mod.slug)}
                onMouseLeave={handleMouseLeave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNodeClick(mod.slug);
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer outline-none ${
                  isHighlighted || isInspected
                    ? 'bg-sciteal-500/15 border-sciteal-500 ring-2 ring-sciteal-500/25 shadow-sm'
                    : isDone
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70'
                    : isCur
                    ? 'bg-sciteal-500/10 dark:bg-sciteal-950/30 border-sciteal-500 ring-1 ring-sciteal-500/30'
                    : 'bg-[var(--surface-sunken)] border-[var(--border-card)] hover:border-[var(--border-strong)] opacity-85'
                }`}
              >
                {/* Node Mini Preview */}
                <div className="w-10 h-9 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] flex items-center justify-center shrink-0 p-1">
                  <MiniModulePreview
                    slug={mod.slug}
                    isCompleted={isDone}
                    isActive={isCur}
                    isHovered={isHighlighted || isInspected}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-mono font-bold text-[var(--fg-muted)]">
                      0{idx + 1}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold ${
                      isDone
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isCur
                        ? 'text-sciteal-700 dark:text-sciteal-400'
                        : 'text-[var(--fg-muted)]'
                    }`}>
                      {progress}%
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--fg-main)] truncate">
                    {mod.title}
                  </h4>
                  <p className="text-[10px] text-[var(--fg-muted)] truncate">
                    {conceptExplanations[mod.slug]?.milestone || mod.title}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="shrink-0">
                  {isDone ? (
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 inline-flex">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : isCur ? (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-gentle-pulse absolute inline-flex h-full w-full rounded-full bg-sciteal-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sciteal-500" />
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[var(--border-card)] inline-block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        MISSION CONTROL NODE INSPECTION CONSOLE
        Interactive deep-dive into the currently inspected milestone node
      */}
      <div className="mt-4 p-4 rounded-xl bg-[var(--surface-sunken)] border border-sciteal-500/35 transition-all duration-200 shadow-sm relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Visual Icon / Preview */}
            <div className="w-12 h-12 rounded-xl bg-[var(--surface-card)] border border-sciteal-500/30 flex items-center justify-center shrink-0 p-1.5 shadow-sm">
              <MiniModulePreview
                slug={inspectedModule.slug}
                isCompleted={inspectedDone}
                isActive={isInspectedCurrent}
                isHovered={true}
              />
            </div>

            {/* Core Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-[var(--fg-muted)]">
                  Module 0{inspectedIdx + 1}
                </span>
                <span className="text-sm font-bold text-[var(--fg-main)] truncate">
                  {inspectedModule.title}
                </span>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                  inspectedDone
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : isInspectedCurrent
                    ? 'bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border-sciteal-500/30 animate-pulse'
                    : 'bg-[var(--surface-card)] text-[var(--fg-muted)] border-[var(--border-card)]'
                }`}>
                  {inspectedDone
                    ? 'Completed ✓'
                    : isInspectedCurrent
                    ? 'Current Learning Focus'
                    : 'Upcoming Concept'}
                </span>

                <span className="text-xs font-mono font-bold text-sciteal-700 dark:text-sciteal-400">
                  {inspectedProgress}% Mastered
                </span>
              </div>

              <p className="text-xs text-[var(--fg-muted)] mt-1 leading-relaxed">
                {inspectedInfo.summary}
              </p>

              {/* Milestone & Physical Principle */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] font-mono">
                <span className="text-[var(--fg-muted)]">
                  Verified Progress: <strong className="text-[var(--fg-main)]">{completedLessonsInInspected} / {totalLessonsInInspected} Lessons</strong>
                </span>
                <span className="text-sciteal-700 dark:text-sciteal-400 font-semibold">
                  Key Formulation: <span className="text-[var(--fg-main)]">{inspectedInfo.formula}</span>
                </span>
                <span className="text-[var(--fg-muted)]">
                  Duration: {inspectedModule.estimatedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            <Link
              to={`/learn/${inspectedModule.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sciteal-600 hover:bg-sciteal-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 focus:ring-2 focus:ring-sciteal-400 focus:outline-none"
            >
              <span>{inspectedDone ? 'Review Module' : isInspectedCurrent ? 'Continue Learning' : 'Preview Concepts'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );

  // Helper render for Desktop Linear Nodes (01, 02, 03, 04, 07)
  function renderDesktopNode(mod: typeof LEARNING_MODULES[0], index: number) {
    const { progress, isDone, isCur, isHighlighted } = getModuleState(mod.slug, index);
    const isInspected = inspectedSlug === mod.slug;

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`Module ${index + 1}: ${mod.title} - ${isDone ? 'Completed' : isCur ? 'Active Focus' : 'Upcoming'} (${progress}%)`}
        onClick={() => handleNodeClick(mod.slug)}
        onDoubleClick={() => handleNodeDoubleClick(mod.slug)}
        onMouseEnter={() => handleMouseEnter(mod.slug)}
        onMouseLeave={handleMouseLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleNodeClick(mod.slug);
          }
        }}
        className={`relative flex flex-col justify-between p-2.5 rounded-xl border transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-sciteal-500 h-[136px] ${
          isHighlighted || isInspected
            ? 'scale-[1.04] shadow-lg border-sciteal-500 bg-sciteal-500/15 ring-2 ring-sciteal-500/30 z-20'
            : isDone
            ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 shadow-sm'
            : isCur
            ? 'bg-sciteal-500/10 dark:bg-sciteal-950/30 border-sciteal-500 ring-1 ring-sciteal-500/30 shadow-sm z-10'
            : 'bg-[var(--surface-sunken)] border-[var(--border-card)] hover:border-[var(--border-strong)] opacity-85'
        }`}
      >
        {/* Node Header */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-mono font-bold text-[var(--fg-muted)]">
            0{index + 1}
          </span>

          {isDone ? (
            <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          ) : isCur ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-gentle-pulse absolute inline-flex h-full w-full rounded-full bg-sciteal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sciteal-500" />
            </span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-[var(--border-card)]" />
          )}
        </div>

        {/* Micro Visual Preview */}
        <div className="my-1 h-9 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] flex items-center justify-center p-1 overflow-hidden">
          <MiniModulePreview
            slug={mod.slug}
            isCompleted={isDone}
            isActive={isCur}
            isHovered={isHighlighted || isInspected}
          />
        </div>

        {/* Title */}
        <div>
          <h4 className="text-[11px] font-bold text-[var(--fg-main)] leading-tight line-clamp-1">
            {mod.title}
          </h4>
        </div>

        {/* Footer info */}
        <div className="pt-1 border-t border-[var(--border-card)] flex items-center justify-between text-[10px] font-mono">
          <span className={
            isDone
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : isCur
              ? 'text-sciteal-700 dark:text-sciteal-400 font-semibold'
              : 'text-[var(--fg-muted)]'
          }>
            {progress}%
          </span>
          <span className="text-[9px] text-[var(--fg-muted)]">
            {isDone ? 'Done' : isCur ? 'Active' : 'Next'}
          </span>
        </div>
      </div>
    );
  }

  // Helper render for Desktop Branched Nodes (05 Circuits - Top, 06 Entanglement - Bottom)
  function renderDesktopBranchNode(mod: typeof LEARNING_MODULES[0], index: number, branchTag: string) {
    const { progress, isDone, isCur, isHighlighted } = getModuleState(mod.slug, index);
    const isInspected = inspectedSlug === mod.slug;

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`Module ${index + 1}: ${mod.title} - ${isDone ? 'Completed' : isCur ? 'Active Focus' : 'Upcoming'} (${progress}%)`}
        onClick={() => handleNodeClick(mod.slug)}
        onDoubleClick={() => handleNodeDoubleClick(mod.slug)}
        onMouseEnter={() => handleMouseEnter(mod.slug)}
        onMouseLeave={handleMouseLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleNodeClick(mod.slug);
          }
        }}
        className={`relative flex items-center justify-between p-2 rounded-xl border transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-sciteal-500 h-[86px] ${
          isHighlighted || isInspected
            ? 'scale-[1.04] shadow-lg border-sciteal-500 bg-sciteal-500/15 ring-2 ring-sciteal-500/30 z-20'
            : isDone
            ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 shadow-sm'
            : isCur
            ? 'bg-sciteal-500/10 dark:bg-sciteal-950/30 border-sciteal-500 ring-1 ring-sciteal-500/30 shadow-sm z-10'
            : 'bg-[var(--surface-sunken)] border-[var(--border-card)] hover:border-[var(--border-strong)] opacity-85'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] flex items-center justify-center p-1 shrink-0">
            <MiniModulePreview
              slug={mod.slug}
              isCompleted={isDone}
              isActive={isCur}
              isHovered={isHighlighted || isInspected}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono font-bold text-[var(--fg-muted)]">
                0{index + 1}
              </span>
              <span className="text-[8px] font-mono uppercase px-1 py-0.2 rounded bg-sciteal-500/10 text-sciteal-700 dark:text-sciteal-300">
                {branchTag}
              </span>
            </div>
            <h4 className="text-[11px] font-bold text-[var(--fg-main)] truncate mt-0.5">
              {mod.title}
            </h4>
            <div className="text-[10px] font-mono text-[var(--fg-muted)]">
              {progress}%
            </div>
          </div>
        </div>

        <div className="shrink-0 pl-1">
          {isDone ? (
            <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 inline-block">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          ) : isCur ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-gentle-pulse absolute inline-flex h-full w-full rounded-full bg-sciteal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sciteal-500" />
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-card)] inline-block" />
          )}
        </div>
      </div>
    );
  }
};

export const QuantumLearningPath = memo(QuantumLearningPathComp);
