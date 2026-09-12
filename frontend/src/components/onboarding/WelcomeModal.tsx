import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';
import { Atom, Compass, ArrowRight, X, Sparkles } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { tour, startTour, skipTour, dismissWelcome, startDemo } = useOnboarding();

  // Show only if user hasn't seen welcome yet and tour isn't currently running
  if (tour.hasSeenWelcome || tour.isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        className="w-full max-w-lg bg-[var(--surface-card)] border border-[var(--border-card)] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-[var(--fg-main)] relative"
      >
        {/* Close / Maybe Later button */}
        <button
          type="button"
          onClick={dismissWelcome}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg-main)] hover:bg-[var(--surface-sunken)] transition-colors"
          aria-label="Close welcome modal"
          title="Maybe later"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sciteal-500/15 border border-sciteal-500/30 flex items-center justify-center text-sciteal-600 dark:text-sciteal-400 flex-shrink-0">
            <Atom className="w-6 h-6" />
          </div>

          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sciteal-500/10 text-sciteal-700 dark:text-sciteal-300 font-semibold border border-sciteal-500/20">
                Welcome to QuLearn AI
              </span>
            </div>
            <h2 id="welcome-modal-title" className="text-xl font-bold text-[var(--fg-main)] tracking-tight">
              Interactive Quantum Learning Platform
            </h2>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
          Welcome to QuLearn AI — an interactive way to learn quantum computing by understanding concepts, building circuits, running experiments, visualizing results, and practicing what you learn.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] text-xs space-y-1">
            <div className="font-semibold text-[var(--fg-main)] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
              <span>Guided Learning Tour</span>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)] leading-tight">
              2-minute overview of dashboard, curriculum, and Quantum Lab 2.0.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] text-xs space-y-1">
            <div className="font-semibold text-[var(--fg-main)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Interactive Demo</span>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)] leading-tight">
              Hands-on beginner experiment to experience quantum superposition.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={skipTour}
              className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-main)] hover:underline cursor-pointer"
            >
              Skip for now
            </button>
            <span className="text-[var(--border-card)] hidden sm:inline">|</span>
            <button
              type="button"
              onClick={() => {
                dismissWelcome();
                startDemo();
              }}
              className="text-xs text-sciteal-700 dark:text-sciteal-400 hover:underline font-semibold cursor-pointer"
            >
              Try Interactive Demo
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => startTour(0)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Start Guided Tour
          </Button>
        </div>
      </div>
    </div>
  );
};
