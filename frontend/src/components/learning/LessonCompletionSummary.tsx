import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Atom, 
  Lightbulb, 
  Cpu, 
  Code,
  BookOpen
} from 'lucide-react';
import { CircuitLabIcon } from '../quantum/CircuitLabIcon';

interface LessonCompletionSummaryProps {
  moduleTitle: string;
  moduleSlug: string;
  lessonId?: string;
  lessonTitle?: string;
  learnedConcepts?: string[];
  practicedItems?: string[];
  canNowSkills?: string[];
  xpEarned?: number;
  nextLesson?: { slug: string; title: string };
  labPresetId?: string;
  onReviewAgain?: () => void;
}

export const LessonCompletionSummary: React.FC<LessonCompletionSummaryProps> = ({
  moduleTitle,
  moduleSlug,
  lessonTitle,
  learnedConcepts = [
    'Superposition & Probability Amplitudes',
    'Reversible Unitary Transformations',
    'Quantum State Measurement Collapse'
  ],
  practicedItems = [
    'Interactive Prediction & Probability Sampling',
    'Gate Placement on Quantum Circuit Wires',
    'Connecting Circuit Mechanics to Qiskit Code',
    'Knowledge Check Self-Assessment'
  ],
  canNowSkills = [
    'Construct valid single & multi-qubit circuits',
    'Calculate measurement probabilities using Born rule amplitudes',
    'Translate visual circuit wire layouts directly into Qiskit Python'
  ],
  xpEarned = 50,
  nextLesson,
  labPresetId,
  lessonId,
  onReviewAgain
}) => {
  const navigate = useNavigate();

  return (
    <Card 
      variant="default" 
      className="p-6 sm:p-8 relative overflow-hidden border-2 border-sciteal-500/30 bg-gradient-to-b from-sciteal-500/5 via-[var(--surface-card)] to-[var(--surface-card)] shadow-lg"
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sciteal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-card)] relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sciteal-500/20 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/40 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Trophy className="w-6 h-6 text-amber-500 dark:text-amber-400 animate-bounce [animation-iteration-count:3]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal" dot>Milestone Completed</Badge>
              <span className="text-xs font-mono text-[var(--fg-muted)]">Verified Mastery</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--fg-main)] tracking-tight">
              {lessonTitle ? `${lessonTitle} Completed!` : `${moduleTitle} Completed!`}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1">
              You have completed the theory, interactive prediction, circuit synthesis, and knowledge checks for this unit.
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 p-3 sm:p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)]">
          <span className="text-[10px] font-mono text-[var(--fg-muted)] uppercase tracking-wider">XP Awarded</span>
          <span className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            +{xpEarned} XP
          </span>
        </div>
      </div>

      {/* 3 Pillars Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-[var(--border-card)] relative z-10">
        {/* Pillar 1: What You Learned */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sciteal-700 dark:text-sciteal-400 uppercase font-mono tracking-wide">
            <BookOpen className="w-4 h-4" />
            <span>You Learned</span>
          </div>
          <ul className="space-y-2">
            {learnedConcepts.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--fg-main)] leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400 flex-shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 2: What You Practiced */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase font-mono tracking-wide">
            <Cpu className="w-4 h-4" />
            <span>You Practiced</span>
          </div>
          <ul className="space-y-2">
            {practicedItems.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--fg-main)] leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 3: What You Can Now Do */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono tracking-wide">
            <Lightbulb className="w-4 h-4" />
            <span>You Can Now</span>
          </div>
          <ul className="space-y-2">
            {canNowSkills.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--fg-main)] leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Step Recommendations & Actions */}
      <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2">
          {onReviewAgain && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReviewAgain}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Review Module Topics
            </Button>
          )}
          {labPresetId && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const map: Record<string, string> = {
                  'measurement-demo': 'exp-measurement',
                  'single-qubit-x': 'exp-x-gate',
                  'single-qubit-h': 'exp-h-gate',
                  'superposition-demo': 'exp-h-gate',
                  'phase-gate-demo': 'exp-phase-flip',
                  'circuit-order-demo': 'exp-gate-order',
                  'bell-state': 'exp-bell-state',
                  'deutsch-jozsa-intro': 'exp-deutsch-jozsa'
                };
                const expId = map[labPresetId] || 'exp-h-gate';
                let url = `/lab?experiment=${expId}&preset=${labPresetId}&moduleId=${moduleSlug}`;
                if (lessonId) url += `&lessonId=${lessonId}`;
                navigate(url);
              }}
              leftIcon={<CircuitLabIcon className="w-3.5 h-3.5" />}
            >
              Open in Circuit Lab
            </Button>
          )}
        </div>

        {nextLesson ? (
          <Button
            variant="quantum"
            size="md"
            onClick={() => navigate(`/learn/${nextLesson.slug}`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Next Lesson: {nextLesson.title}
          </Button>
        ) : (
          <Button
            variant="quantum"
            size="md"
            onClick={() => navigate('/dashboard')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Return to Dashboard
          </Button>
        )}
      </div>
    </Card>
  );
};
