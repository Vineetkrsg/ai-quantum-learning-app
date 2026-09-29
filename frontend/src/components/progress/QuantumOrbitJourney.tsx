import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { LEARNING_MODULES } from '../../mock/modulesData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Compass, CheckCircle2, Play, CircleDot, ArrowRight, Sparkles, Atom, BookOpen, Award } from 'lucide-react';

export const QuantumOrbitJourney: React.FC = () => {
  const {
    overallProgress,
    moduleProgress,
    completedLessonsByModule,
    completedChallenges,
    circuitsRun,
    conceptMastery,
    xp
  } = useProgress();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === 'dark';
  const isHighContrast = theme === 'high-contrast';

  // Categorize modules into completed, current, and upcoming
  const completedModules = LEARNING_MODULES.filter(
    (m) => (moduleProgress[m.slug] || 0) === 100
  );

  const currentModuleIndex = LEARNING_MODULES.findIndex(
    (m) => (moduleProgress[m.slug] || 0) < 100
  );
  const activeIdx = currentModuleIndex >= 0 ? currentModuleIndex : LEARNING_MODULES.length - 1;

  // Selected or hovered module on the orbit
  const [selectedSlug, setSelectedSlug] = useState<string>(LEARNING_MODULES[activeIdx].slug);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeModuleSlug = hoveredSlug || selectedSlug;
  const activeModule = LEARNING_MODULES.find((m) => m.slug === activeModuleSlug) || LEARNING_MODULES[activeIdx];
  const activeModuleIdx = LEARNING_MODULES.findIndex((m) => m.slug === activeModule.slug);
  const activeProgress = moduleProgress[activeModule.slug] || 0;
  const isActiveDone = activeProgress === 100;
  const isActiveCurrent = activeModuleIdx === activeIdx && !isActiveDone;

  // Truthful concept mastery key mapping from ProgressContext
  const conceptKeyMap: Record<string, string> = {
    fundamentals: 'Qubit State Representation',
    qubits: 'Dirac Bra-Ket Notation',
    superposition: 'Superposition & Born Rule',
    gates: 'Pauli & Phase Gates',
    circuits: 'Bloch Sphere Coordinates',
    entanglement: 'Two-Qubit Entanglement',
    algorithms: 'Interference & Algorithms'
  };

  const activeMasteryKey = conceptKeyMap[activeModule.slug] || 'Quantum State';
  const activeMasteryScore = conceptMastery[activeMasteryKey] !== undefined
    ? conceptMastery[activeMasteryKey]
    : activeProgress;

  const completedLessonsCount = (completedLessonsByModule[activeModule.slug] || []).length;
  const totalLessonsCount = activeModule.lessons.length;

  // Practice count from real state: completed challenges + circuits run
  const practiceCount = completedChallenges.length + (circuitsRun > 0 ? Math.min(circuitsRun, 12) : 0);

  // SVG Orbit angle calculation (0 to 360 degrees)
  const radius = 64;
  const cx = 80;
  const cy = 80;

  const strokeTeal = isHighContrast ? '#000000' : isDark ? '#2dd4bf' : '#0d9488';
  const strokeTrack = isHighContrast ? '#000000' : isDark ? '#223043' : '#e2e8f0';

  // Calculate 7 node points along orbit circle for the 7 modules
  const moduleNodes = LEARNING_MODULES.map((m, i) => {
    // Distribute 7 nodes evenly from -90 deg (top) clockwise around 360 deg
    const nodeAngleDeg = -90 + (i / LEARNING_MODULES.length) * 360;
    const nodeRad = (nodeAngleDeg * Math.PI) / 180;
    const nx = cx + radius * Math.cos(nodeRad);
    const ny = cy + radius * Math.sin(nodeRad);
    const isDone = (moduleProgress[m.slug] || 0) === 100;
    const isCur = i === activeIdx && !isDone;
    const isTargeted = m.slug === activeModuleSlug;

    return {
      ...m,
      index: i,
      x: nx,
      y: ny,
      isDone,
      isCur,
      isTargeted
    };
  });

  return (
    <Card variant="default" className="p-6 relative overflow-hidden" data-tour="progress-orbit">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="teal" dot>
              Interactive State Trajectory
            </Badge>
            <span className="text-xs font-mono text-[var(--fg-muted)]">
              Dynamic Orbit Exploration
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--fg-main)] flex items-center gap-2">
            <Compass className="w-5 h-5 text-sciteal-600 dark:text-sciteal-400" />
            <span>Quantum Learning Orbit</span>
          </h3>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
            Click or hover any orbit milestone to inspect verified lesson counts, practice activities, and mastery metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-sciteal-700 dark:text-sciteal-400">
              {overallProgress}% Mastered
            </div>
            <div className="text-[10px] text-[var(--fg-muted)] font-mono">
              {completedModules.length} of 7 Domains
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Orbital SVG with 7 interactive milestone nodes (Span 5) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)]">
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 160 160">
              {/* Outer guide track circle */}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={strokeTrack}
                strokeWidth="4"
              />

              {/* Progress Arc */}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={strokeTeal}
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * radius}
                strokeDashoffset={2 * Math.PI * radius * (1 - overallProgress / 100)}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                className="transition-all duration-700 ease-out"
              />

              {/* 7 Interactive Milestone Nodes along the orbit */}
              {moduleNodes.map((n) => {
                const nodeColor = n.isDone
                  ? '#10b981'
                  : n.isCur
                  ? (isDark ? '#2dd4bf' : '#0d9488')
                  : strokeTrack;

                return (
                  <g
                    key={n.slug}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={() => setHoveredSlug(n.slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                    onClick={() => setSelectedSlug(n.slug)}
                  >
                    {/* Stable Halo ring highlight */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="9"
                      fill="none"
                      stroke={strokeTeal}
                      strokeWidth="1.5"
                      className="transition-opacity duration-300 animate-satellite-halo"
                      style={{ 
                        transformOrigin: `${n.x}px ${n.y}px`,
                        opacity: n.isTargeted ? 0.95 : 0,
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Node Core */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.isTargeted ? 6 : 4.5}
                      fill={nodeColor}
                      stroke="var(--surface-sunken)"
                      strokeWidth="1.5"
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Center Dynamic Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-3">
              <span className="text-xl font-extrabold font-mono text-[var(--fg-main)]">
                {activeProgress}%
              </span>
              <span className="text-[10px] font-mono font-semibold text-sciteal-700 dark:text-sciteal-400 truncate max-w-[120px]">
                {activeModule.title}
              </span>
              <span className="text-[9px] font-mono text-[var(--fg-muted)] mt-0.5">
                {isActiveDone ? 'Completed' : isActiveCurrent ? 'Active Focus' : 'Upcoming'}
              </span>
            </div>
          </div>

          <div className="mt-2 text-center text-[11px] text-[var(--fg-muted)] font-mono">
            Hover any orbit dot to inspect milestone metrics
          </div>
        </div>

        {/* Interactive Concept Inspection Card (Prompt Section 11) (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-4 rounded-xl border transition-all duration-200 ${
            isActiveDone
              ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40'
              : isActiveCurrent
              ? 'bg-sciteal-500/10 dark:bg-sciteal-950/30 border-sciteal-500'
              : 'bg-[var(--surface-sunken)] border-[var(--border-card)]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[var(--fg-muted)]">
                  Module 0{activeModuleIdx + 1}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                  isActiveDone
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : isActiveCurrent
                    ? 'bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border-sciteal-500/30'
                    : 'bg-[var(--surface-card)] text-[var(--fg-muted)] border-[var(--border-card)]'
                }`}>
                  {isActiveDone
                    ? 'Completed'
                    : isActiveCurrent
                    ? 'Current learning focus'
                    : 'Coming next'}
                </span>
              </div>

              <span className="text-xs font-mono font-bold text-sciteal-700 dark:text-sciteal-400">
                {activeProgress}%
              </span>
            </div>

            <h4 className="text-sm font-bold text-[var(--fg-main)]">{activeModule.title}</h4>
            <p className="text-xs text-[var(--fg-muted)] mt-1 leading-relaxed">
              {activeModule.description}
            </p>

            {/* Truthful Educational Stats Grid (Prompt Section 11) */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[var(--border-card)]">
              <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] text-center">
                <div className="text-[10px] font-mono uppercase text-[var(--fg-muted)] flex items-center justify-center gap-1">
                  <BookOpen className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />
                  <span>Lessons</span>
                </div>
                <div className="text-sm font-bold font-mono text-[var(--fg-main)] mt-0.5">
                  {completedLessonsCount} / {totalLessonsCount}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] text-center">
                <div className="text-[10px] font-mono uppercase text-[var(--fg-muted)] flex items-center justify-center gap-1">
                  <Atom className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                  <span>Practice</span>
                </div>
                <div className="text-sm font-bold font-mono text-[var(--fg-main)] mt-0.5">
                  {practiceCount}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] text-center">
                <div className="text-[10px] font-mono uppercase text-[var(--fg-muted)] flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Mastery</span>
                </div>
                <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {activeMasteryScore}%
                </div>
              </div>
            </div>

            {/* Direct App Link Button */}
            <div className="mt-4 pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[var(--fg-muted)] font-mono">
                {activeModule.estimatedTime} estimated
              </span>
              <button
                onClick={() => navigate(`/learn/${activeModule.slug}`)}
                className="text-xs px-3 py-1.5 rounded-lg bg-sciteal-600 hover:bg-sciteal-500 text-white font-medium inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{isActiveDone ? 'Review Module' : isActiveCurrent ? 'Resume Lesson' : 'Explore Concept'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

