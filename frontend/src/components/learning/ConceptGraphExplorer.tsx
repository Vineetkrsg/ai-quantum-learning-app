import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEARNING_MODULES } from '../../mock/modulesData';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, ChevronRight, Sparkles, Network, ArrowDown, GitFork } from 'lucide-react';

interface ConceptNode {
  slug: string;
  title: string;
  math: string;
  level: number;
  col: number;
  branch?: 'left' | 'right' | 'center';
  relationshipReason: string;
  antecedents: string[];
  descendants: string[];
}

const CONCEPT_NODES: ConceptNode[] = [
  {
    slug: 'fundamentals',
    title: 'Fundamentals',
    math: '0/1 → |ψ⟩',
    level: 0,
    col: 2,
    branch: 'center',
    relationshipReason: 'Establishes discrete binary limits and motivates the transition from classical bits to complex amplitudes.',
    antecedents: [],
    descendants: ['qubits', 'superposition']
  },
  {
    slug: 'qubits',
    title: 'Qubits & States',
    math: 'α|0⟩ + β|1⟩',
    level: 1,
    col: 2,
    branch: 'center',
    relationshipReason: 'Defines the 2D Hilbert state vector space and Bloch coordinate geometry required for single-qubit mechanics.',
    antecedents: ['fundamentals'],
    descendants: ['superposition', 'gates']
  },
  {
    slug: 'superposition',
    title: 'Superposition',
    math: 'H|0⟩ = |+⟩',
    level: 2,
    col: 2,
    branch: 'center',
    relationshipReason: 'Enables continuous probability amplitudes before measurement, foundational for all quantum parallelisms.',
    antecedents: ['fundamentals', 'qubits'],
    descendants: ['gates', 'circuits', 'algorithms']
  },
  {
    slug: 'gates',
    title: 'Quantum Gates',
    math: 'U†U = I',
    level: 3,
    col: 2,
    branch: 'center',
    relationshipReason: 'Provides the reversible unitary operations (X, H, Z, CNOT) to steer state vectors across quantum wires.',
    antecedents: ['qubits', 'superposition'],
    descendants: ['circuits', 'entanglement', 'algorithms']
  },
  {
    slug: 'circuits',
    title: 'Quantum Circuits',
    math: 'q[n] ─[U]─',
    level: 4,
    col: 2,
    branch: 'center',
    relationshipReason: 'Composes temporal sequences of single and multi-qubit unitaries that feed into entanglement and algorithm oracles.',
    antecedents: ['gates'],
    descendants: ['entanglement', 'algorithms']
  },
  {
    slug: 'entanglement',
    title: 'Entanglement',
    math: '(|00⟩+|11⟩)/√2',
    level: 5,
    col: 1,
    branch: 'left',
    relationshipReason: 'Branches from multi-qubit circuit compositions (H + CNOT) creating non-separable Bell correlations.',
    antecedents: ['circuits', 'gates'],
    descendants: []
  },
  {
    slug: 'algorithms',
    title: 'Algorithms',
    math: 'Oracle & Diffuse',
    level: 5,
    col: 3,
    branch: 'right',
    relationshipReason: 'Synthesizes superposition, phase kickback, and interference to amplify correct solutions in Deutsch-Jozsa and Grover.',
    antecedents: ['circuits', 'superposition', 'gates'],
    descendants: []
  }
];

const ConceptGraphExplorerComponent: React.FC = () => {
  const navigate = useNavigate();
  const { moduleProgress } = useProgress();
  const { theme } = useTheme();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = theme === 'dark';
  const isHighContrast = theme === 'high-contrast';

  const hoveredNode = CONCEPT_NODES.find((n) => n.slug === hoveredSlug);

  return (
    <Card variant="default" className="p-5 relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sciteal-500/10 text-sciteal-700 dark:text-sciteal-400 border border-sciteal-500/20">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--fg-main)]">
              Curriculum Concept Relationship Graph
            </h3>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Interactive topological roadmap showing how concepts build on each other (Hover to trace dependencies)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-mono text-sciteal-700 dark:text-sciteal-400 hover:underline px-2 py-1 rounded bg-[var(--surface-sunken)] border border-[var(--border-card)] transition-colors"
        >
          {isExpanded ? 'Hide Topology Map' : 'Show Topology Map'}
        </button>
      </div>

      {/* Interactive Concept Relationship Explanation Banner on Hover */}
      {isExpanded && hoveredNode && (
        <div className="mt-3 p-3 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 text-left transition-opacity duration-200">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-[var(--fg-main)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
              <span>Concept Connection: {hoveredNode.title}</span>
            </span>
            <span className="font-mono text-[10px] text-sciteal-700 dark:text-sciteal-400 font-semibold">
              {hoveredNode.math}
            </span>
          </div>
          <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">{hoveredNode.relationshipReason}</p>
        </div>
      )}

      {/* Interactive Concept Graph Topology */}
      {isExpanded && (
        <div className="pt-5 pb-2 relative">
          {/* Linear trunk: Fundamentals -> Qubits -> Superposition -> Gates -> Circuits */}
          <div className="max-w-2xl mx-auto flex flex-col items-center space-y-2">
            {CONCEPT_NODES.slice(0, 5).map((node, index) => {
              const progress = moduleProgress[node.slug] || 0;
              const isDone = progress === 100;
              const isHovered = hoveredSlug === node.slug;
              const isRelated = hoveredNode?.antecedents.includes(node.slug) || hoveredNode?.descendants.includes(node.slug);

              return (
                <React.Fragment key={node.slug}>
                  {/* Node Button Card */}
                  <div
                    onMouseEnter={() => setHoveredSlug(node.slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                    onClick={() => navigate(`/learn/${node.slug}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/learn/${node.slug}`);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Concept ${node.title}: ${node.relationshipReason}`}
                    className={`w-full max-w-md px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between outline-none focus:ring-2 focus:ring-sciteal-500 select-none ${
                      isHovered
                        ? 'scale-[1.02] shadow-md border-sciteal-500 bg-sciteal-500/15 ring-2 ring-sciteal-500/20'
                        : isRelated
                        ? 'border-sciteal-500/60 bg-sciteal-500/5'
                        : isDone
                        ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                        : progress > 0
                        ? 'bg-sciteal-500/10 dark:bg-sciteal-950/30 border-sciteal-500/40'
                        : 'bg-[var(--surface-sunken)] border-[var(--border-card)] hover:border-sciteal-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-[var(--fg-muted)] font-bold">
                        0{index + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[var(--fg-main)]">{node.title}</div>
                        <div className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400">
                          {node.math}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Mastered
                        </span>
                      ) : progress > 0 ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 font-semibold flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full bg-sciteal-500 ${prefersReducedMotion ? '' : 'animate-gentle-pulse'}`} />
                          {progress}%
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--fg-muted)]">
                          Ready
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
                    </div>
                  </div>

                  {/* Smooth Continuous Quantum Connection Conduit */}
                  <div className="h-5 relative flex items-center justify-center my-0.5">
                    {/* Conduit Trunk Line */}
                    <div 
                      className={`w-0.5 h-full transition-colors duration-300 ${
                        isRelated || isHovered 
                          ? 'bg-sciteal-500' 
                          : 'bg-[var(--circuit-wire)] opacity-60'
                      }`} 
                    />
                    
                    {/* Continuous Smooth Downward Energy Packet (Compositor only, zero layout recalculation) */}
                    {!prefersReducedMotion && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full absolute -left-[2px] transition-colors duration-300 pointer-events-none animate-topology-flow ${
                          isRelated || isHovered 
                            ? 'bg-sciteal-400 shadow-sm' 
                            : 'bg-sciteal-500/75'
                        }`}
                        style={{
                          animationDelay: `${index * 0.38}s`
                        }}
                      />
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {/* Fork to 2 branches: Entanglement & Algorithms */}
            <div className="w-full max-w-md flex flex-col items-center pt-1">
              {/* Branching Junction Indicator with Continuous Photon */}
              <div className="h-4 relative flex items-center justify-center mb-1">
                <div className="w-0.5 h-full bg-[var(--circuit-wire)] opacity-60" />
                {!prefersReducedMotion && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-sciteal-500/80 absolute -left-[2px] pointer-events-none animate-topology-flow"
                    style={{ animationDelay: '1.5s' }}
                  />
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--fg-muted)] pb-2.5">
                <GitFork className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                <span>Multi-Qubit Branching (Entanglement & Interference)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {CONCEPT_NODES.slice(5).map((node, index) => {
                  const progress = moduleProgress[node.slug] || 0;
                  const isDone = progress === 100;
                  const isHovered = hoveredSlug === node.slug;
                  const isRelated = hoveredNode?.antecedents.includes(node.slug) || hoveredNode?.descendants.includes(node.slug);

                  return (
                    <div
                      key={node.slug}
                      onMouseEnter={() => setHoveredSlug(node.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      onClick={() => navigate(`/learn/${node.slug}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/learn/${node.slug}`);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Concept ${node.title}: ${node.relationshipReason}`}
                      className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between outline-none focus:ring-2 focus:ring-sciteal-500 select-none ${
                        isHovered
                          ? 'scale-[1.02] shadow-md border-sciteal-500 bg-sciteal-500/15 ring-2 ring-sciteal-500/20'
                          : isRelated
                          ? 'border-sciteal-500/60 bg-sciteal-500/5'
                          : isDone
                          ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                          : progress > 0
                          ? 'bg-sciteal-500/10 dark:bg-sciteal-950/30 border-sciteal-500/40'
                          : 'bg-[var(--surface-sunken)] border-[var(--border-card)] hover:border-sciteal-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-[var(--fg-muted)]">
                          0{index + 6}
                        </span>
                        {isDone ? (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400 font-semibold flex items-center gap-1.5">
                            {progress > 0 && (
                              <span className={`w-1.5 h-1.5 rounded-full bg-sciteal-500 ${prefersReducedMotion ? '' : 'animate-gentle-pulse'}`} />
                            )}
                            {progress > 0 ? `${progress}%` : 'Upcoming'}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-[var(--fg-main)]">{node.title}</div>
                      <div className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400 mt-0.5">
                        {node.math}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export const ConceptGraphExplorer = memo(ConceptGraphExplorerComponent);
