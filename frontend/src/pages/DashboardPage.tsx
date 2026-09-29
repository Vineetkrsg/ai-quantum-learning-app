import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Trophy, 
  TrendingUp, 
  ArrowRight,
  Flame,
  Sparkles,
  Activity,
  Compass
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { QuickLabCard } from '../components/dashboard/QuickLabCard';
import { RecommendedLessonCard } from '../components/dashboard/RecommendedLessonCard';
import { RecentActivityCard } from '../components/dashboard/RecentActivityCard';
import { NewUserOnboardingCard } from '../components/dashboard/NewUserOnboardingCard';
import { QuantumLearningPath } from '../components/dashboard/QuantumLearningPath';
import { QuantumOrbitCard } from '../components/dashboard/QuantumOrbitCard';
import { TelemetryStatsBar } from '../components/dashboard/TelemetryStatsBar';
import { ActiveModuleControlCard } from '../components/dashboard/ActiveModuleControlCard';
import { TutorPanel } from '../components/tutor/TutorPanel';
import { CircuitLabIcon } from '../components/quantum/CircuitLabIcon';
import { USER_OVERVIEW } from '../mock/progressData';
import { LEARNING_MODULES } from '../mock/modulesData';
import { useProgress } from '../context/ProgressContext';
import { QuantumBackground } from '../components/quantum/visual/QuantumBackground';

export const DashboardPage: React.FC = () => {
  const { overallProgress, circuitsRun, xp, streakDays, moduleProgress, quizStats } = useProgress();

  // Coordinated cross-component highlight state (Prompt Section 11, 13)
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);

  // Active module detection
  const activeModuleIndex = LEARNING_MODULES.findIndex(
    (m) => (moduleProgress[m.slug] || 0) < 100
  );
  const currentModule = LEARNING_MODULES[activeModuleIndex >= 0 ? activeModuleIndex : 0];

  const userRank = xp === 0 
    ? 'Novice Quantum Explorer' 
    : xp < 200 
    ? 'Level 1 Qubit Apprentice' 
    : xp < 500 
    ? 'Level 2 Circuit Builder' 
    : 'Level 3 Qubit Engineer';

  return (
    <div className="space-y-6 relative" data-tour="dashboard-overview">
      {/* Background subtle ambient quantum particle & filament canvas */}
      <QuantumBackground variant="subtle" />

      {/* Onboarding / Guided Tour & Interactive Demo Card */}
      <NewUserOnboardingCard />

      {/* Mission Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--fg-main)] tracking-tight">
              Welcome back, {USER_OVERVIEW.name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-sunken)] text-sciteal-700 dark:text-sciteal-300 border border-[var(--border-card)] font-mono font-semibold">
              {userRank}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Simulator: READY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1">
            Quantum Learning Control Center • Resume your structured curriculum, explore multi-qubit circuits, and analyze statevectors.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/lab">
            <Button variant="quantum" size="sm" leftIcon={<CircuitLabIcon className="w-4 h-4" />}>
              Open Circuit Lab
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Telemetry Statistics Bar (Sections 16 & 17) */}
      <TelemetryStatsBar />

      {/* Connected Quantum Learning Pathway (Centerpiece - Sections 3, 4, 5, 6, 7, 10, 12, 13) */}
      <QuantumLearningPath
        highlightedSlug={highlightedSlug}
        onHighlightSlug={setHighlightedSlug}
      />

      {/* Primary 3-Column Control Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Active Module, Recommended Lesson & Orbit, Lab Card, Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Module Control Card */}
          <ActiveModuleControlCard
            highlightedSlug={highlightedSlug}
            onHighlightSlug={setHighlightedSlug}
          />

          {/* Interactive Progress Orbit & Recommended Next Lesson Row (Sections 8, 9, 11) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Recommended Next Lesson Card (Interactive with cross-highlighting) */}
            <RecommendedLessonCard
              className="h-full"
              highlightedSlug={highlightedSlug}
              onHighlightSlug={setHighlightedSlug}
            />

            {/* Quantum Learning Orbit Card (Secondary overall progress radar) */}
            <QuantumOrbitCard className="h-full" />
          </div>

          {/* Quick Lab Card & Recent Activity Stream */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <QuickLabCard />
            <RecentActivityCard />
          </div>
        </div>

        {/* Right Column: AI Quantum Tutor Mission Assistant */}
        <div className="space-y-6">
          <TutorPanel
            compact
            context={{
              activeLessonTitle: currentModule.title,
              currentCircuitName: 'Quantum State Explorer',
              qubitCount: 2,
              gateCount: 2
            }}
          />
        </div>
      </div>
    </div>
  );
};
