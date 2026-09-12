import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowRight, ArrowLeft, Cpu, CheckCircle2, BookOpen } from 'lucide-react';

interface LessonNavigationProps {
  labPresetId: string;
  moduleId?: string;
  lessonId?: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  prevLesson?: { slug: string; title: string };
  nextLesson?: { slug: string; title: string };
}

const PRESET_EXPERIMENT_MAP: Record<string, string> = {
  'measurement-demo': 'exp-measurement',
  'single-qubit-x': 'exp-x-gate',
  'single-qubit-h': 'exp-h-gate',
  'superposition-demo': 'exp-h-gate',
  'phase-gate-demo': 'exp-phase-flip',
  'circuit-order-demo': 'exp-gate-order',
  'bell-state': 'exp-bell-state',
  'deutsch-jozsa-intro': 'exp-deutsch-jozsa'
};

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  labPresetId,
  moduleId,
  lessonId,
  isCompleted,
  onToggleComplete,
  prevLesson,
  nextLesson
}) => {
  const navigate = useNavigate();

  const handleOpenInLab = () => {
    const expId = PRESET_EXPERIMENT_MAP[labPresetId] || 'exp-h-gate';
    let url = `/lab?experiment=${expId}&preset=${labPresetId}`;
    if (moduleId) url += `&moduleId=${moduleId}`;
    if (lessonId) url += `&lessonId=${lessonId}`;
    navigate(url);
  };

  return (
    <Card variant="default" className="p-6 space-y-6">
      {/* Top action: Open in Quantum Lab banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <h4 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
              Ready for Open-Ended Experimentation?
            </h4>
          </div>
          <p className="text-xs text-[var(--fg-muted)] mt-1 max-w-xl leading-relaxed">
            Transfer this example circuit directly into the full Quantum Circuit Studio to append gates, inspect Python Qiskit code, and run custom shots.
          </p>
        </div>

        <Button
          variant="quantum"
          size="md"
          onClick={handleOpenInLab}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="whitespace-nowrap flex-shrink-0"
        >
          Open in Quantum Lab
        </Button>
      </div>

      {/* Completion & Next/Prev Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[var(--border-card)]">
        {/* Mark complete toggle */}
        <button
          onClick={onToggleComplete}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isCompleted
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-800 dark:text-emerald-300'
              : 'bg-[var(--surface-subtle)] border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] hover:border-[var(--border-highlight)]'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--fg-muted)]'}`} />
          <span>{isCompleted ? 'Module Completed!' : 'Mark Module Complete'}</span>
        </button>

        {/* Previous and Next Lesson Links */}
        <div className="flex items-center gap-3">
          {prevLesson ? (
            <Link to={`/learn/${prevLesson.slug}`}>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                <span className="hidden sm:inline">Previous:</span> {prevLesson.title}
              </Button>
            </Link>
          ) : (
            <Link to="/learn">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              >
                All Modules
              </Button>
            </Link>
          )}

          {nextLesson ? (
            <Link to={`/learn/${nextLesson.slug}`}>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                <span className="hidden sm:inline">Next:</span> {nextLesson.title}
              </Button>
            </Link>
          ) : (
            <Link to="/learn">
              <Button
                variant="quantum"
                size="sm"
                rightIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Curriculum Complete!
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};
