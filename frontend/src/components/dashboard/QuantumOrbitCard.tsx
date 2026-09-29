import React, { useState, useEffect, memo } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { LEARNING_MODULES } from '../../mock/modulesData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Compass, 
  BookOpen, 
  Award, 
  Cpu, 
  Sparkles, 
  Flame, 
  ArrowRight,
  TrendingUp,
  FlaskConical
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuantumOrbitCardProps {
  className?: string;
}

type OrbitSector = 'lessons' | 'challenges' | 'experiments' | 'mastery';

const QuantumOrbitCardComponent: React.FC<QuantumOrbitCardProps> = ({ className = '' }) => {
  const {
    overallProgress,
    moduleProgress,
    completedLessonsByModule,
    completedChallenges,
    experimentsCompleted,
    circuitsRun,
    conceptMastery,
    xp
  } = useProgress();
  const { theme } = useTheme();

  // Active hovered sector
  const [hoveredSector, setHoveredSector] = useState<OrbitSector | null>(null);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Real lesson totals
  const totalLessons = LEARNING_MODULES.reduce((acc, m) => acc + m.lessons.length, 0); // 39
  const completedLessonsCount = Object.values(completedLessonsByModule).reduce(
    (acc, arr) => acc + (arr?.length || 0),
    0
  );

  const completedModulesCount = LEARNING_MODULES.filter(
    (m) => (moduleProgress[m.slug] || 0) === 100
  ).length;

  // Average concept mastery
  const masteryValues = Object.values(conceptMastery);
  const averageMastery = masteryValues.length > 0
    ? Math.round(masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length)
    : 0;

  const challengesCount = completedChallenges.length;
  const experimentsCount = experimentsCompleted.length;

  // Orbit Geometry
  const cx = 90;
  const cy = 90;
  const radius = 64;

  const isDark = theme === 'dark';
  const isHighContrast = theme === 'high-contrast';

  const strokeTrack = isHighContrast ? '#d2d9e2' : isDark ? '#223043' : '#e2e8f0';
  const strokeTeal = isHighContrast ? '#000000' : isDark ? '#2dd4bf' : '#0d9488';
  const strokeAmber = isHighContrast ? '#000000' : '#f59e0b';
  const strokePurple = isHighContrast ? '#000000' : '#8b5cf6';
  const strokeEmerald = isHighContrast ? '#000000' : '#10b981';

  // Perimeter
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - Math.min(overallProgress, 100) / 100);

  // Contextual telemetry descriptions for each sector
  const sectorData: Record<OrbitSector, { title: string; value: string; detail: string; color: string; icon: React.ReactNode }> = {
    lessons: {
      title: 'Curriculum Lessons',
      value: `${completedLessonsCount} / ${totalLessons}`,
      detail: 'Completed interactive lessons across 7 quantum mechanics domains',
      color: strokeTeal,
      icon: <BookOpen className="w-3.5 h-3.5" />
    },
    challenges: {
      title: 'Quantum Challenges',
      value: `${challengesCount} Completed`,
      detail: challengesCount > 0 ? 'Algorithmic state puzzles and gate constraint challenges solved' : 'Challenge puzzles ready to test your gate logic intuition',
      color: strokeAmber,
      icon: <Award className="w-3.5 h-3.5" />
    },
    experiments: {
      title: 'Lab Experiments & Runs',
      value: `${experimentsCount} Exp • ${circuitsRun} Runs`,
      detail: 'Executed in the 1024-shot statevector simulator',
      color: strokeEmerald,
      icon: <FlaskConical className="w-3.5 h-3.5" />
    },
    mastery: {
      title: 'Concept Index',
      value: `${averageMastery}% Mastery`,
      detail: 'Aggregated proficiency across Dirac notation, superposition, and algorithms',
      color: strokePurple,
      icon: <TrendingUp className="w-3.5 h-3.5" />
    }
  };

  const activeSectorInfo = hoveredSector ? sectorData[hoveredSector] : null;

  return (
    <Card variant="default" className={`p-5 relative overflow-hidden flex flex-col justify-between ${className}`.trim()}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-card)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sciteal-500/10 border border-sciteal-500/30 flex items-center justify-center text-sciteal-600 dark:text-sciteal-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--fg-main)] leading-none">
              Quantum Learning Orbit
            </h4>
            <span className="text-[10px] font-mono text-[var(--fg-muted)]">
              Multi-Domain Progression
            </span>
          </div>
        </div>

        <Badge variant="teal" dot>
          Live Telemetry
        </Badge>
      </div>

      {/* Orbit Visual Center */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 my-auto">
        {/* Orbital SVG Radar with Smooth Continuous Celestial Motion */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full select-none" viewBox="0 0 180 180" aria-hidden="true">
            {/* Background dashed grid circle - Smooth 42s continuous GPU rotation */}
            <g
              style={{ transformOrigin: '90px 90px' }}
              className={prefersReducedMotion ? '' : 'animate-orbit-spin'}
            >
              <circle
                cx={cx}
                cy={cy}
                r={radius + 12}
                fill="none"
                stroke={strokeTrack}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
            </g>

            {/* Inner track circle */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={strokeTrack}
              strokeWidth="5"
            />

            {/* Primary overall progress arc */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={strokeTeal}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />

            {/* Satellite 1: Top (Lessons) - (90, 26) */}
            <g
              className="cursor-pointer outline-none"
              onMouseEnter={() => setHoveredSector('lessons')}
              onMouseLeave={() => setHoveredSector(null)}
              tabIndex={0}
              role="button"
              aria-label="Lessons telemetry sector"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHoveredSector(hoveredSector === 'lessons' ? null : 'lessons');
                }
              }}
            >
              {/* Stable permanently-mounted halo breathing ring */}
              <circle
                cx="90"
                cy="26"
                r={hoveredSector === 'lessons' ? 10.5 : 8.5}
                fill="none"
                stroke={strokeTeal}
                strokeWidth="1.2"
                className={`transition-all duration-300 ${prefersReducedMotion ? '' : 'animate-satellite-halo'}`}
                style={{
                  transformOrigin: '90px 26px',
                  opacity: hoveredSector === 'lessons' ? 0.95 : completedLessonsCount > 0 ? 0.4 : 0.15
                }}
              />
              <circle
                cx="90"
                cy="26"
                r={hoveredSector === 'lessons' ? 7 : 5.5}
                fill={completedLessonsCount > 0 ? strokeTeal : strokeTrack}
                stroke="var(--surface-card)"
                strokeWidth="2"
                className="transition-all duration-200"
              />
            </g>

            {/* Satellite 2: Right (Challenges) - (154, 90) */}
            <g
              className="cursor-pointer outline-none"
              onMouseEnter={() => setHoveredSector('challenges')}
              onMouseLeave={() => setHoveredSector(null)}
              tabIndex={0}
              role="button"
              aria-label="Challenges telemetry sector"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHoveredSector(hoveredSector === 'challenges' ? null : 'challenges');
                }
              }}
            >
              {/* Stable permanently-mounted halo breathing ring */}
              <circle
                cx="154"
                cy="90"
                r={hoveredSector === 'challenges' ? 10.5 : 8.5}
                fill="none"
                stroke={strokeAmber}
                strokeWidth="1.2"
                className={`transition-all duration-300 ${prefersReducedMotion ? '' : 'animate-satellite-halo'}`}
                style={{
                  transformOrigin: '154px 90px',
                  opacity: hoveredSector === 'challenges' ? 0.95 : challengesCount > 0 ? 0.4 : 0.15
                }}
              />
              <circle
                cx="154"
                cy="90"
                r={hoveredSector === 'challenges' ? 7 : 5.5}
                fill={challengesCount > 0 ? strokeAmber : strokeTrack}
                stroke="var(--surface-card)"
                strokeWidth="2"
                className="transition-all duration-200"
              />
            </g>

            {/* Satellite 3: Bottom (Experiments & Circuits) - (90, 154) */}
            <g
              className="cursor-pointer outline-none"
              onMouseEnter={() => setHoveredSector('experiments')}
              onMouseLeave={() => setHoveredSector(null)}
              tabIndex={0}
              role="button"
              aria-label="Experiments telemetry sector"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHoveredSector(hoveredSector === 'experiments' ? null : 'experiments');
                }
              }}
            >
              {/* Stable permanently-mounted halo breathing ring */}
              <circle
                cx="90"
                cy="154"
                r={hoveredSector === 'experiments' ? 10.5 : 8.5}
                fill="none"
                stroke={strokeEmerald}
                strokeWidth="1.2"
                className={`transition-all duration-300 ${prefersReducedMotion ? '' : 'animate-satellite-halo'}`}
                style={{
                  transformOrigin: '90px 154px',
                  opacity: hoveredSector === 'experiments' ? 0.95 : (circuitsRun > 0 || experimentsCount > 0) ? 0.4 : 0.15
                }}
              />
              <circle
                cx="90"
                cy="154"
                r={hoveredSector === 'experiments' ? 7 : 5.5}
                fill={circuitsRun > 0 || experimentsCount > 0 ? strokeEmerald : strokeTrack}
                stroke="var(--surface-card)"
                strokeWidth="2"
                className="transition-all duration-200"
              />
            </g>

            {/* Satellite 4: Left (Mastery) - (26, 90) */}
            <g
              className="cursor-pointer outline-none"
              onMouseEnter={() => setHoveredSector('mastery')}
              onMouseLeave={() => setHoveredSector(null)}
              tabIndex={0}
              role="button"
              aria-label="Mastery telemetry sector"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHoveredSector(hoveredSector === 'mastery' ? null : 'mastery');
                }
              }}
            >
              {/* Stable permanently-mounted halo breathing ring */}
              <circle
                cx="26"
                cy="90"
                r={hoveredSector === 'mastery' ? 10.5 : 8.5}
                fill="none"
                stroke={strokePurple}
                strokeWidth="1.2"
                className={`transition-all duration-300 ${prefersReducedMotion ? '' : 'animate-satellite-halo'}`}
                style={{
                  transformOrigin: '26px 90px',
                  opacity: hoveredSector === 'mastery' ? 0.95 : averageMastery > 0 ? 0.4 : 0.15
                }}
              />
              <circle
                cx="26"
                cy="90"
                r={hoveredSector === 'mastery' ? 7 : 5.5}
                fill={averageMastery > 0 ? strokePurple : strokeTrack}
                stroke="var(--surface-card)"
                strokeWidth="2"
                className="transition-all duration-200"
              />
            </g>
          </svg>

          {/* Dynamic Center Telemetry HUD with Stable Fade Transition */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
            {activeSectorInfo ? (
              <div className="transition-opacity duration-200 ease-out">
                <span className="text-base font-extrabold font-mono text-[var(--fg-main)] block">
                  {activeSectorInfo.value}
                </span>
                <span className="text-[10px] font-mono uppercase text-sciteal-700 dark:text-sciteal-400 font-bold block truncate max-w-[100px]">
                  {activeSectorInfo.title}
                </span>
              </div>
            ) : (
              <div className="transition-opacity duration-200 ease-out">
                <span className="text-2xl font-extrabold font-mono text-[var(--fg-main)] tracking-tight block">
                  {overallProgress}%
                </span>
                <span className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400 font-semibold block">
                  Overall Mastered
                </span>
                <span className="text-[9px] text-[var(--fg-muted)] font-mono block">
                  {completedModulesCount}/7 Modules
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Contextual Readout Panel */}
        <div className="flex-1 min-w-0 space-y-2">
          {activeSectorInfo ? (
            <div className="p-3 rounded-xl bg-[var(--surface-sunken)] border border-sciteal-500/30 transition-all duration-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--fg-main)] mb-1">
                {activeSectorInfo.icon}
                <span>{activeSectorInfo.title}</span>
              </div>
              <div className="text-base font-mono font-bold text-sciteal-700 dark:text-sciteal-400">
                {activeSectorInfo.value}
              </div>
              <p className="text-[11px] text-[var(--fg-muted)] mt-1 leading-snug">
                {activeSectorInfo.detail}
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)]">
              <div className="text-xs font-semibold text-[var(--fg-main)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                <span>Quantum Learning Orbit</span>
              </div>
              <p className="text-[11px] text-[var(--fg-muted)] mt-1 leading-relaxed">
                Hover any node satellite to view verified lesson completions, lab simulations, challenge puzzles, and concept mastery metrics.
              </p>
            </div>
          )}

          {/* 4 Telemetry Sector Buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onMouseEnter={() => setHoveredSector('lessons')}
              onMouseLeave={() => setHoveredSector(null)}
              className={`p-2 rounded-lg text-left border transition-all text-[11px] font-mono ${
                hoveredSector === 'lessons'
                  ? 'bg-sciteal-500/15 border-sciteal-500 text-sciteal-700 dark:text-sciteal-300 font-bold'
                  : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              <div className="text-[9px] uppercase">Lessons</div>
              <div className="text-[11px] font-bold text-[var(--fg-main)]">{completedLessonsCount}/39</div>
            </button>

            <button
              onMouseEnter={() => setHoveredSector('challenges')}
              onMouseLeave={() => setHoveredSector(null)}
              className={`p-2 rounded-lg text-left border transition-all text-[11px] font-mono ${
                hoveredSector === 'challenges'
                  ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                  : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              <div className="text-[9px] uppercase">Challenges</div>
              <div className="text-[11px] font-bold text-[var(--fg-main)]">{challengesCount} Done</div>
            </button>

            <button
              onMouseEnter={() => setHoveredSector('experiments')}
              onMouseLeave={() => setHoveredSector(null)}
              className={`p-2 rounded-lg text-left border transition-all text-[11px] font-mono ${
                hoveredSector === 'experiments'
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              <div className="text-[9px] uppercase">Simulations</div>
              <div className="text-[11px] font-bold text-[var(--fg-main)]">{circuitsRun} Runs</div>
            </button>

            <button
              onMouseEnter={() => setHoveredSector('mastery')}
              onMouseLeave={() => setHoveredSector(null)}
              className={`p-2 rounded-lg text-left border transition-all text-[11px] font-mono ${
                hoveredSector === 'mastery'
                  ? 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                  : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)]'
              }`}
            >
              <div className="text-[9px] uppercase">Mastery Index</div>
              <div className="text-[11px] font-bold text-[var(--fg-main)]">{averageMastery}%</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Link to Full Analytics */}
      <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[var(--fg-muted)] font-mono">
          XP Level: {xp} Total XP
        </span>
        <Link 
          to="/progress" 
          className="text-[11px] text-sciteal-700 dark:text-sciteal-400 font-semibold hover:underline inline-flex items-center gap-1"
        >
          <span>Full Analytics & Skill Tree</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
};

export const QuantumOrbitCard = memo(QuantumOrbitCardComponent);
