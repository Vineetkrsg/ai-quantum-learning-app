import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useOnboarding } from '../../context/OnboardingContext';
import { Compass, Sparkles, ArrowRight, Play } from 'lucide-react';

export const NewUserOnboardingCard: React.FC = () => {
  const { startTour, startDemo, tour, demo } = useOnboarding();

  return (
    <Card variant="default" className="p-5 border-sciteal-500/30 bg-gradient-to-r from-sciteal-500/5 via-transparent to-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 font-bold border border-sciteal-500/30">
              New to QuLearn AI?
            </span>
            {tour.isCompleted && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                Tour Completed ✓
              </span>
            )}
            {demo.isCompleted && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                Demo Completed ✓
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
            Explore the Platform or Try Your First Quantum Experiment
          </h3>
          <p className="text-xs text-[var(--fg-muted)] leading-relaxed max-w-xl">
            Take a quick 2-minute tour to see how QuLearn AI works, or jump into a zero-prerequisite interactive demonstration of quantum superposition.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => startTour(0)}
            leftIcon={<Compass className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />}
          >
            {tour.isCompleted ? 'Restart Guided Tour' : 'Start Guided Tour'}
          </Button>

          <Button
            variant="quantum"
            size="sm"
            onClick={() => startDemo(0)}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="font-bold"
          >
            {demo.isCompleted ? 'Replay Demo' : 'Try Interactive Demo'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
