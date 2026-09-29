import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { LEARNING_MODULES } from '../../mock/modulesData';
import { 
  TrendingUp, 
  Cpu, 
  Trophy, 
  Flame, 
  Sparkles, 
  ChevronRight,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Card } from '../ui/Card';

interface TelemetryStatsBarProps {
  onHoverProgress?: () => void;
}

export const TelemetryStatsBar: React.FC<TelemetryStatsBarProps> = ({ onHoverProgress }) => {
  const { overallProgress, circuitsRun, xp, streakDays, moduleProgress, quizStats } = useProgress();
  const { theme } = useTheme();

  // Active hover inspection on a stat
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  // Real lesson totals
  const totalLessons = LEARNING_MODULES.reduce((acc, m) => acc + m.lessons.length, 0); // 39
  const completedLessonsCount = LEARNING_MODULES.reduce((acc, m) => {
    const p = moduleProgress[m.slug] || 0;
    // Estimate or count completed lessons
    return acc + Math.round((p / 100) * m.lessons.length);
  }, 0);

  const completedModulesCount = LEARNING_MODULES.filter(
    (m) => (moduleProgress[m.slug] || 0) === 100
  ).length;

  // Rank and XP Tier
  const xpThresholds = [
    { rank: 'Novice Quantum Explorer', min: 0, max: 200 },
    { rank: 'Level 1 Qubit Apprentice', min: 200, max: 500 },
    { rank: 'Level 2 Circuit Builder', min: 500, max: 1000 },
    { rank: 'Level 3 Qubit Engineer', min: 1000, max: 2000 }
  ];

  const currentTier = xpThresholds.find((t) => xp < t.max) || xpThresholds[xpThresholds.length - 1];
  const tierProgress = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentTier.min) / (currentTier.max - currentTier.min)) * 100))
  );

  const quizAverage = quizStats.length > 0 
    ? `${Math.round(quizStats.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) / quizStats.length)}%` 
    : '0.0%';

  // 7-day activity timeline: real active days based on streakDays
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeCount = Math.min(7, streakDays);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: Overall Progress */}
        <Card
          variant="interactive"
          className={`p-4 relative transition-all duration-200 cursor-pointer ${
            hoveredStat === 'progress' ? 'border-sciteal-500 shadow-md ring-1 ring-sciteal-500/20' : ''
          }`}
          onMouseEnter={() => {
            setHoveredStat('progress');
            if (onHoverProgress) onHoverProgress();
          }}
          onMouseLeave={() => setHoveredStat(null)}
          tabIndex={0}
          role="button"
          aria-label={`Overall Progress: ${overallProgress}%. ${completedModulesCount} of 7 modules completed.`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-semibold text-[var(--fg-muted)] tracking-wider block">
                Overall Progress
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[var(--fg-main)]">
                  {overallProgress}%
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  {completedModulesCount}/7 Done
                </span>
              </div>
              <p className="text-[11px] text-[var(--fg-muted)] mt-1 font-mono">
                {completedLessonsCount} / {totalLessons} Lessons
              </p>
            </div>

            {/* Circular Mini Gauge */}
            <div className="relative w-10 h-10 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border-card)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeDasharray="88"
                  strokeDashoffset={88 * (1 - overallProgress / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sciteal-600 dark:text-sciteal-400">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-full bg-[var(--surface-sunken)] h-1.5 rounded-full overflow-hidden mt-3 border border-[var(--border-card)]">
            <div
              className="bg-sciteal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </Card>

        {/* STAT 2: Circuits Simulated */}
        <Card
          variant="interactive"
          className={`p-4 relative transition-all duration-200 cursor-pointer ${
            hoveredStat === 'circuits' ? 'border-sciteal-500 shadow-md ring-1 ring-sciteal-500/20' : ''
          }`}
          onMouseEnter={() => setHoveredStat('circuits')}
          onMouseLeave={() => setHoveredStat(null)}
          tabIndex={0}
          role="button"
          aria-label={`Circuits Simulated: ${circuitsRun}. 1024 shots default.`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-semibold text-[var(--fg-muted)] tracking-wider block">
                Circuits Simulated
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[var(--fg-main)]">
                  {circuitsRun}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sciteal-500/10 text-sciteal-700 dark:text-sciteal-300 font-semibold border border-sciteal-500/20">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-[var(--fg-muted)] mt-1 font-mono">
                1024 Shots Default
              </p>
            </div>

            {/* Mini Circuit Pulse Icon */}
            <div className="w-10 h-10 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 flex items-center justify-center text-sciteal-600 dark:text-sciteal-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          {/* Mini Wire Graphic */}
          <div className="mt-3 pt-2 border-t border-[var(--border-card)] flex items-center justify-between text-[10px] font-mono text-[var(--fg-muted)]">
            <span>q[0] ──[ H ]──●──</span>
            <span className="text-sciteal-700 dark:text-sciteal-400 font-bold">Statevector</span>
          </div>
        </Card>

        {/* STAT 3: Quiz Assessment Index */}
        <Card
          variant="interactive"
          className={`p-4 relative transition-all duration-200 cursor-pointer ${
            hoveredStat === 'quiz' ? 'border-sciteal-500 shadow-md ring-1 ring-sciteal-500/20' : ''
          }`}
          onMouseEnter={() => setHoveredStat('quiz')}
          onMouseLeave={() => setHoveredStat(null)}
          tabIndex={0}
          role="button"
          aria-label={`Assessment Average: ${quizAverage}. ${quizStats.length} assessments completed.`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-semibold text-[var(--fg-muted)] tracking-wider block">
                Quiz Evaluation
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[var(--fg-main)]">
                  {quizAverage}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
                  {quizStats.length} Quizzes
                </span>
              </div>
              <p className="text-[11px] text-[var(--fg-muted)] mt-1 font-mono">
                {quizStats.length > 0 ? `${quizStats.length} assessments completed` : 'Self-checks awaiting'}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
          </div>

          {/* Evaluation Status */}
          <div className="mt-3 pt-2 border-t border-[var(--border-card)] flex items-center justify-between text-[10px] font-mono text-[var(--fg-muted)]">
            <span>Accuracy Index</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {quizStats.length > 0 ? 'Calibrated' : 'Pending Test'}
            </span>
          </div>
        </Card>

        {/* STAT 4: Research Cadence & XP Tier */}
        <Card
          variant="interactive"
          className={`p-4 relative transition-all duration-200 cursor-pointer ${
            hoveredStat === 'cadence' ? 'border-sciteal-500 shadow-md ring-1 ring-sciteal-500/20' : ''
          }`}
          onMouseEnter={() => setHoveredStat('cadence')}
          onMouseLeave={() => setHoveredStat(null)}
          tabIndex={0}
          role="button"
          aria-label={`Learning Streak: ${streakDays} days. ${xp} total XP.`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-semibold text-[var(--fg-muted)] tracking-wider block">
                Research Streak & XP
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[var(--fg-main)]">
                  {streakDays}d
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
                  {xp} XP
                </span>
              </div>
              <p className="text-[11px] text-[var(--fg-muted)] mt-1 font-mono truncate max-w-[140px]">
                {currentTier.rank}
              </p>
            </div>

            {/* Circular XP Progress Indicator */}
            <div className="relative w-10 h-10 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border-card)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="88"
                  strokeDashoffset={88 * (1 - tierProgress / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-amber-500">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* 7-Day Activity Timeline Dots */}
          <div className="mt-3 pt-2 border-t border-[var(--border-card)] flex items-center justify-between">
            <span className="text-[9px] font-mono text-[var(--fg-muted)] uppercase">Past 7 Days:</span>
            <div className="flex items-center gap-1">
              {daysOfWeek.map((day, idx) => {
                const isActiveDay = idx >= 7 - activeCount;
                return (
                  <span
                    key={idx}
                    title={`Day ${day}: ${isActiveDay ? 'Active Study Logged' : 'No Study'}`}
                    className={`w-2 h-2 rounded-full transition-all ${
                      isActiveDay
                        ? 'bg-amber-500 dark:bg-amber-400 ring-1 ring-amber-500/30'
                        : 'bg-[var(--border-card)]'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Contextual Telemetry Explanation (Section 16) */}
      {hoveredStat && (
        <div className="px-4 py-2 rounded-xl bg-[var(--surface-sunken)] border border-sciteal-500/30 text-xs flex items-center justify-between text-[var(--fg-muted)] animate-fadeIn">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400 shrink-0" />
            <span>
              {hoveredStat === 'progress' && (
                <>
                  <strong className="text-[var(--fg-main)]">Curriculum Progress: </strong>
                  Calculated from verified lesson completions across 7 progressive domains (Fundamentals to Algorithms).
                </>
              )}
              {hoveredStat === 'circuits' && (
                <>
                  <strong className="text-[var(--fg-main)]">Simulation Telemetry: </strong>
                  Total quantum circuit runs executed in the local matrix simulator with projective measurement collapse.
                </>
              )}
              {hoveredStat === 'quiz' && (
                <>
                  <strong className="text-[var(--fg-main)]">Knowledge Assessments: </strong>
                  Cumulative score average from interactive mini-lesson checkups and conceptual diagnostic quizzes.
                </>
              )}
              {hoveredStat === 'cadence' && (
                <>
                  <strong className="text-[var(--fg-main)]">Learning Metric: </strong>
                  Study continuity streak and experience points earned through completed lessons, challenges, and circuit labs.
                </>
              )}
            </span>
          </div>
          <span className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400 shrink-0 ml-2">
            Live Metric
          </span>
        </div>
      )}
    </div>
  );
};
