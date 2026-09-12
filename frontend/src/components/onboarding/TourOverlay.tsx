import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { TOUR_STEPS } from './TourConstants';
import { TourCard } from './TourCard';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const TourOverlay: React.FC = () => {
  const { tour, nextTourStep, prevTourStep, skipTour, closeTour, startDemo } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const currentStep = TOUR_STEPS[tour.currentStep] || TOUR_STEPS[0];
  const isLastStep = tour.currentStep === TOUR_STEPS.length - 1;

  // Auto-navigate to step's route if different
  useEffect(() => {
    if (!tour.isActive) return;

    if (currentStep.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [tour.isActive, tour.currentStep, currentStep.route, location.pathname, navigate]);

  // Tab switching if requested by step definition (e.g. lab code tab)
  useEffect(() => {
    if (!tour.isActive || !currentStep.tabSwitch) return;

    const timer = setTimeout(() => {
      // Find tab button matching the ID and trigger click
      const tabBtn = document.querySelector(`button[data-tab-id="${currentStep.tabSwitch}"]`) as HTMLButtonElement | null;
      if (tabBtn) {
        tabBtn.click();
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [tour.isActive, tour.currentStep, currentStep.tabSwitch]);

  // Locate and measure target DOM element
  const measureTarget = useCallback(() => {
    if (!tour.isActive || currentStep.position === 'center') {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    } else {
      setTargetRect(null);
    }
  }, [tour.isActive, currentStep]);

  useEffect(() => {
    if (!tour.isActive) {
      setTargetRect(null);
      return;
    }

    const timer = setTimeout(measureTarget, 200);

    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [tour.isActive, tour.currentStep, measureTarget]);

  // Keyboard navigation
  useEffect(() => {
    if (!tour.isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTour();
      } else if (e.key === 'ArrowRight') {
        if (!isLastStep) {
          nextTourStep();
        }
      } else if (e.key === 'ArrowLeft') {
        prevTourStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tour.isActive, isLastStep, nextTourStep, prevTourStep, closeTour]);

  if (!tour.isActive) return null;

  // Calculate position for TourCard
  const getCardStyle = (): React.CSSProperties => {
    if (!targetRect || currentStep.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const padding = 16;
    const cardWidth = Math.min(450, window.innerWidth - 32);

    // Calculate vertical position
    let top = targetRect.top + targetRect.height + padding;
    if (top + 320 > window.innerHeight && targetRect.top > 340) {
      top = targetRect.top - 330;
    }

    // Keep top within screen boundaries
    top = Math.max(20, Math.min(top, window.innerHeight - 340));

    // Calculate horizontal position
    let left = targetRect.left;
    if (left + cardWidth > window.innerWidth - 20) {
      left = window.innerWidth - cardWidth - 20;
    }
    left = Math.max(20, left);

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`
    };
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* Target Spotlight Highlight */}
      {targetRect && (
        <div
          className="fixed transition-all duration-300 pointer-events-none rounded-xl ring-4 ring-sciteal-500/80 shadow-[0_0_0_9999px_rgba(10,15,22,0.72)] z-40"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`
          }}
        />
      )}

      {/* Fallback full backdrop if centered or no target measured */}
      {(!targetRect || currentStep.position === 'center') && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity z-40" 
          onClick={closeTour}
        />
      )}

      {/* Tour Step Popover Card */}
      <TourCard
        step={currentStep}
        currentStepIndex={tour.currentStep}
        totalSteps={TOUR_STEPS.length}
        onNext={nextTourStep}
        onPrev={prevTourStep}
        onSkip={skipTour}
        onClose={closeTour}
        onStartDemo={() => {
          closeTour();
          startDemo();
        }}
        onStartLearning={() => {
          closeTour();
          navigate('/learn');
        }}
        style={getCardStyle()}
      />
    </div>
  );
};
