import React, { useState } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { DemoHeader } from './DemoHeader';
import { DemoPrediction } from './DemoPrediction';
import { DemoCircuitCanvas } from './DemoCircuitCanvas';
import { DemoResultView } from './DemoResultView';
import { DemoComparison } from './DemoComparison';
import { DemoChallenge } from './DemoChallenge';
import { DemoCompletion } from './DemoCompletion';
import { Button } from '../../ui/Button';
import { Atom, Sparkles, ArrowRight } from 'lucide-react';

const PREDICTION_1_OPTIONS = [
  {
    id: 'p-0',
    label: 'Always 0 (100% chance)',
    isExpected: false,
    explanation: 'The qubit starts in |0⟩, but the H gate rotates it into an equal superposition of both 0 and 1.'
  },
  {
    id: 'p-1',
    label: 'Always 1 (100% chance)',
    isExpected: false,
    explanation: 'The H gate does not perform a pure bit-flip to 1 (that would be the Pauli-X gate); it splits the probability evenly.'
  },
  {
    id: 'p-50',
    label: 'Approximately equal chance of 0 and 1 (~50/50)',
    isExpected: true,
    explanation: 'Exactly! The Hadamard gate creates a balanced 50/50 superposition between 0 and 1.'
  },
  {
    id: 'p-unsure',
    label: "I'm not sure yet",
    isExpected: false,
    explanation: 'No problem at all! Let us build and simulate the circuit to see what happens.'
  }
];

export const DemoModal: React.FC = () => {
  const {
    demo,
    setDemoStep,
    setPrediction1,
    runDemoSimulation,
    runInterferenceSimulation,
    setChallengeCircuit,
    runChallengeSimulation,
    restartDemo,
    closeDemo
  } = useOnboarding();

  const [isSimulating, setIsSimulating] = useState(false);

  if (!demo.isActive) return null;

  const handleRunFirstExperiment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      runDemoSimulation();
      setIsSimulating(false);
      setDemoStep(3); // Go to results view
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-experiment-modal"
        className="w-full max-w-3xl my-8 bg-[var(--surface-card)] border border-[var(--border-card)] rounded-2xl shadow-2xl p-5 sm:p-7 space-y-5 text-[var(--fg-main)] max-h-[90vh] overflow-y-auto"
      >
        {/* Header with Step Tracker */}
        <DemoHeader
          currentStep={demo.currentStep}
          totalSteps={7}
          onRestart={restartDemo}
          onClose={closeDemo}
        />

        {/* STEP 0: Understand the Goal & Concepts */}
        {demo.currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-sciteal-700 dark:text-sciteal-300 font-mono">
                <Sparkles className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
                <span>Zero-Prerequisite Quantum Introduction</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[var(--fg-main)]">
                Goal: See What Happens When We Create a Superposition
              </h3>

              <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
                In classical computers (like your phone or laptop), a bit is always either a <strong>0</strong> or a <strong>1</strong>.
                In quantum computing, our basic unit of information is called a <strong>qubit</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] text-xs space-y-1">
                  <span className="font-bold text-sciteal-600 dark:text-sciteal-400">Starting State |0⟩</span>
                  <p className="text-[11px] text-[var(--fg-muted)]">
                    All quantum circuits start with the qubit in a known resting state written as <code>|0⟩</code>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] text-xs space-y-1">
                  <span className="font-bold text-teal-600 dark:text-teal-400">The H (Hadamard) Gate</span>
                  <p className="text-[11px] text-[var(--fg-muted)]">
                    A quantum operation that changes the qubit into a special blend called a <strong>superposition</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* What you'll do overview */}
            <div className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[var(--fg-main)]">Ready for Step 1?</span>
                <p className="text-[11px] text-[var(--fg-muted)]">
                  First, we'll ask you to form a prediction before running the circuit.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setDemoStep(1)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Make Your Prediction
              </Button>
            </div>
          </div>
        )}

        {/* STEP 1: Make a Prediction */}
        {demo.currentStep === 1 && (
          <DemoPrediction
            question="What do you think will happen when we apply an H gate to |0⟩ and measure it?"
            conceptIntro={{
              title: 'What is a Superposition?',
              description: 'Instead of being locked into a single fixed value, a qubit in superposition has probability amplitudes for both outcomes.',
              terms: [
                { term: 'Qubit', definition: 'A quantum bit capable of superposition.' },
                { term: 'H Gate', definition: 'Creates an equal mixture of 0 and 1.' }
              ]
            }}
            options={PREDICTION_1_OPTIONS}
            selectedOptionId={demo.prediction1}
            onSelectOption={setPrediction1}
            onProceed={() => setDemoStep(2)}
          />
        )}

        {/* STEP 2: Build & Inspect Circuit */}
        {demo.currentStep === 2 && (
          <DemoCircuitCanvas
            circuit={demo.circuit}
            onRunSimulation={handleRunFirstExperiment}
            isRunning={isSimulating}
          />
        )}

        {/* STEP 3: Visualize Results & Explanation */}
        {demo.currentStep === 3 && (
          <DemoResultView
            result={demo.simulationResult}
            userPrediction={demo.prediction1}
            onProceedToInterference={() => setDemoStep(4)}
          />
        )}

        {/* STEP 4: Experiment 2 - Wave Interference (H -> H) */}
        {demo.currentStep === 4 && (
          <DemoComparison
            onRunSimulation={runInterferenceSimulation}
            onProceedToChallenge={() => setDemoStep(5)}
          />
        )}

        {/* STEP 5: Mini Challenge - Pauli-X Bit-Flip */}
        {demo.currentStep === 5 && (
          <DemoChallenge
            challengeCircuit={demo.challengeCircuit}
            onUpdateCircuit={setChallengeCircuit}
            onRunValidation={runChallengeSimulation}
            onProceedToCompletion={() => setDemoStep(6)}
          />
        )}

        {/* STEP 6: Completion Summary */}
        {demo.currentStep === 6 && (
          <DemoCompletion
            onRestart={restartDemo}
            onClose={closeDemo}
          />
        )}
      </div>
    </div>
  );
};
