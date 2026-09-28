import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Trophy, 
  TrendingUp, 
  ArrowRight,
  Flame,
  Sparkles
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { QuickLabCard } from '../components/dashboard/QuickLabCard';
import { RecommendedLessonCard } from '../components/dashboard/RecommendedLessonCard';
import { RecentActivityCard } from '../components/dashboard/RecentActivityCard';
import { NewUserOnboardingCard } from '../components/dashboard/NewUserOnboardingCard';
import { TutorPanel } from '../components/tutor/TutorPanel';
import { CircuitLabIcon } from '../components/quantum/CircuitLabIcon';
import { USER_OVERVIEW } from '../mock/progressData';
import { LEARNING_MODULES } from '../mock/modulesData';
import { useProgress } from '../context/ProgressContext';
import { QuantumLearningPath } from '../components/dashboard/QuantumLearningPath';
import { QuantumBackground } from '../components/quantum/visual/QuantumBackground';

export const DashboardPage: React.FC = () => {
  const { overallProgress, circuitsRun, xp, streakDays, moduleProgress, quizStats } = useProgress();

  // Find the first module that isn't 100% complete, default to module 0
  const activeModuleIndex = LEARNING_MODULES.findIndex(
    (m) => (moduleProgress[m.slug] || 0) < 100
  );
  const currentModule = LEARNING_MODULES[activeModuleIndex >= 0 ? activeModuleIndex : 0];
  const currentModuleProgress = moduleProgress[currentModule.slug] || 0;

  const userRank = xp === 0 
    ? 'Novice Quantum Explorer' 
    : xp < 200 
    ? 'Level 1 Qubit Apprentice' 
    : xp < 500 
    ? 'Level 2 Circuit Builder' 
    : 'Level 3 Qubit Engineer';

  const quizAverage = quizStats.length > 0 
    ? `${Math.round(quizStats.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) / quizStats.length)}%` 
    : '0.0%';

  return (
    <div className="space-y-6 relative" data-tour="dashboard-overview">
      {/* Background ambient quantum traces */}
      <QuantumBackground variant="subtle" />

      {/* Onboarding / Demo Launch Card */}
      <NewUserOnboardingCard />

      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[var(--fg-main)] tracking-tight">
              Welcome back, {USER_OVERVIEW.name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-sunken)] text-sciteal-700 dark:text-sciteal-300 border border-[var(--border-card)] font-mono font-semibold">
              {userRank}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1">
            Pick up right where you left off in your quantum mechanics and circuit journey.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/lab">
            <Button variant="quantum" size="sm" leftIcon={<CircuitLabIcon className="w-4 h-4" />}>
              Open Circuit Lab
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Overall Progress"
          value={`${overallProgress}%`}
          change={overallProgress > 0 ? `+${overallProgress}% this week` : 'Ready to start'}
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
          description="Across 7 core modules"
        />
        <StatCard
          label="Circuits Simulated"
          value={circuitsRun}
          change="Simulator Ready"
          changeType="positive"
          icon={<Cpu className="w-5 h-5" />}
          description="1024 shots default"
        />
        <StatCard
          label="Quiz Average"
          value={quizAverage}
          change={quizStats.length > 0 ? `${quizStats.length} Quizzes` : '0 Quizzes'}
          changeType="positive"
          icon={<Trophy className="w-5 h-5" />}
          description={quizStats.length > 0 ? `${quizStats.length} assessments completed` : 'Complete a lesson self-check'}
        />
        <StatCard
          label="Learning Streak"
          value={`${streakDays} Days`}
          change={`${xp} XP`}
          changeType="positive"
          icon={<Flame className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
          description={streakDays > 0 ? 'Keep up the momentum' : 'Complete 1 lesson today'}
        />
      </div>

      {/* Connected Quantum Learning Pathway (Living Environment) */}
      <QuantumLearningPath />

      {/* Primary 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Active Module, Lab Card, Recommended Lesson */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Active Module Card */}
          <Card variant="default" className="p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="teal" dot>Active Module</Badge>
                  <span className="text-xs text-[var(--fg-muted)] font-mono">
                    Module {(activeModuleIndex >= 0 ? activeModuleIndex : 0) + 1} of 7
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--fg-main)]">
                  {currentModule.title}
                </h3>
              </div>
              <Link to={`/learn/${currentModule.slug}`}>
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  {currentModuleProgress > 0 ? 'Resume Module' : 'Start Module'}
                </Button>
              </Link>
            </div>

            <p className="text-xs text-[var(--fg-muted)] leading-relaxed max-w-2xl mb-4">
              {currentModule.description}
            </p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[var(--fg-muted)]">Current Progress</span>
                <span className="text-sciteal-700 dark:text-sciteal-400 font-bold">{currentModuleProgress}% Completed</span>
              </div>
              <ProgressBar value={currentModuleProgress} variant="cyan" size="md" />
            </div>

            {/* Next lesson teaser */}
            <div className="mt-5 pt-4 border-t border-[var(--border-card)] flex items-center justify-between text-xs">
              <span className="text-[var(--fg-muted)]">
                Up next: <span className="text-[var(--fg-main)] font-medium">{currentModule.lessons[0]?.title || 'Introduction'}</span>
              </span>
              <span className="text-[var(--fg-muted)] font-mono">{currentModule.estimatedTime}</span>
            </div>
          </Card>

          {/* Quick Lab & Recommended Lesson Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickLabCard />
            <RecommendedLessonCard className="h-full justify-between" />
          </div>

          {/* Recent Activity Card */}
          <RecentActivityCard />
        </div>

        {/* Right Column: AI Quantum Tutor Widget */}
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
