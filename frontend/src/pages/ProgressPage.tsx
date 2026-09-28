import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { MasteryMeter } from '../components/progress/MasteryMeter';
import { QuizStatsCard } from '../components/progress/QuizStatsCard';
import { RecommendedLessonCard } from '../components/dashboard/RecommendedLessonCard';
import { LEARNING_MODULES } from '../mock/modulesData';
import { TrendingUp, CheckCircle2, Clock, Award, BookOpen } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { QuantumOrbitJourney } from '../components/progress/QuantumOrbitJourney';
import { QuantumBackground } from '../components/quantum/visual/QuantumBackground';

export const ProgressPage: React.FC = () => {
  const { overallProgress, xp, moduleProgress } = useProgress();

  const masteredCount = Object.values(moduleProgress).filter((p) => p === 100).length;

  return (
    <div className="space-y-6 relative" data-tour="progress-analytics">
      {/* Background ambient quantum traces */}
      <QuantumBackground variant="subtle" />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-sunken)] text-sciteal-700 dark:text-sciteal-300 border border-[var(--border-card)] font-mono font-semibold">
            Analytics & Skill Tree
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--fg-main)] tracking-tight">
          Learning Progress & Concept Mastery
        </h2>
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1">
          Track your progression across all quantum mechanics domains, assessment scores, and circuit certifications.
        </p>
      </div>

      {/* Overall Progress Hero Card */}
      <Card variant="default" className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[var(--fg-main)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sciteal-600 dark:text-sciteal-400" />
                  <span>Overall Curriculum Mastery</span>
                </h3>
                <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                  Aggregated across reading materials, circuit laboratories, and quizzes.
                </p>
              </div>
              <span className="text-2xl font-extrabold font-mono text-sciteal-700 dark:text-sciteal-400">
                {overallProgress}%
              </span>
            </div>

            <ProgressBar value={overallProgress} size="lg" variant="cyan" />

            <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--fg-muted)] pt-2 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>{masteredCount} of 7 Modules Mastered</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
                <span>{xp > 0 ? `${(xp * 0.05).toFixed(1)} Hours Logged` : '0 Hours Logged'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{xp} XP Earned</span>
              </span>
            </div>
          </div>

          {/* Mini Milestone card */}
          <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-2">
            <div className="text-xs font-semibold text-[var(--fg-main)]">Next Milestone:</div>
            <div className="text-xs font-mono text-sciteal-700 dark:text-sciteal-400 font-bold">
              {overallProgress === 0 ? 'First Qubit State Initialized' : 'Bell State Certified'}
            </div>
            <p className="text-[11px] text-[var(--fg-muted)] leading-snug">
              {overallProgress === 0 
                ? 'Complete your first interactive mini-lesson in Quantum Computing Fundamentals.' 
                : 'Complete the Entanglement lab to unlock Quantum Key Distribution (QKD) topics.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Dynamic Quantum Learning Orbit Journey */}
      <QuantumOrbitJourney />

      {/* Two-Column Grid: Left is Module Completion List, Right is Concept Mastery & Quiz Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Module Completion Breakdown (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="default">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                <BookOpen className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
                <span>Module Completion Matrix</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              {LEARNING_MODULES.map((mod, idx) => {
                const currentModProgress = moduleProgress[mod.slug] ?? 0;
                const isComplete = currentModProgress === 100;
                return (
                  <div
                    key={mod.id}
                    className="p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-2 hover:border-[var(--border-highlight)] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[var(--surface-subtle)] border border-[var(--border-card)] text-[10px] font-mono flex items-center justify-center text-[var(--fg-muted)]">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs font-semibold text-[var(--fg-main)]">{mod.title}</h5>
                      </div>
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <Badge variant="emerald">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </Badge>
                        ) : (
                          <span className="text-xs font-mono text-sciteal-700 dark:text-sciteal-400 font-medium">
                            {currentModProgress}%
                          </span>
                        )}
                      </div>
                    </div>
                    <ProgressBar
                      value={currentModProgress}
                      size="sm"
                      variant={isComplete ? 'emerald' : 'cyan'}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recommended Next Step */}
          <RecommendedLessonCard />
        </div>

        {/* Right Column: Concept Mastery & Quiz Stats (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <MasteryMeter />
          <QuizStatsCard />
        </div>
      </div>
    </div>
  );
};
