import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Circuit, SimulationResult } from '../types/quantum';
import { simulateQuantumCircuit } from '../services/quantumSimulator';

export interface TourState {
  isActive: boolean;
  currentStep: number;
  isCompleted: boolean;
  isSkipped: boolean;
  hasSeenWelcome: boolean;
}

export interface DemoState {
  isActive: boolean;
  currentStep: number; // 0: Intro, 1: Predict H, 2: Build H, 3: Run & Visualize, 4: H->H Interference, 5: Mini Challenge, 6: Completion
  isCompleted: boolean;
  prediction1: string | null;
  prediction2: string | null;
  circuit: Circuit;
  simulationResult: SimulationResult | null;
  challengeCircuit: Circuit;
  challengeResult: SimulationResult | null;
  challengePassed: boolean;
}

interface OnboardingContextType {
  // Tour State & Actions
  tour: TourState;
  startTour: (step?: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  skipTour: () => void;
  restartTour: () => void;
  closeTour: () => void;
  dismissWelcome: () => void;

  // Demo State & Actions
  demo: DemoState;
  startDemo: (step?: number) => void;
  setDemoStep: (step: number) => void;
  setPrediction1: (optId: string) => void;
  setPrediction2: (optId: string) => void;
  setDemoCircuit: (circuit: Circuit) => void;
  runDemoSimulation: () => SimulationResult;
  runInterferenceSimulation: () => SimulationResult;
  setChallengeCircuit: (circuit: Circuit) => void;
  runChallengeSimulation: () => { isCorrect: boolean; feedback: string; result: SimulationResult };
  completeDemo: () => void;
  restartDemo: () => void;
  closeDemo: () => void;
}

const TOUR_STORAGE_KEY = 'qulearn_guided_tour_v1';
const DEMO_STORAGE_KEY = 'qulearn_demo_mode_v1';

export const INITIAL_DEMO_CIRCUIT_H: Circuit = {
  id: 'demo-circuit-superposition',
  name: 'Superposition (H Gate)',
  numberOfQubits: 1,
  gates: [
    { id: 'demo-gate-h', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'demo-gate-m', gateId: 'M', targetQubit: 0, position: 1 }
  ],
  measurements: [0]
};

export const INITIAL_INTERFERENCE_CIRCUIT: Circuit = {
  id: 'demo-circuit-interference',
  name: 'Interference (H → H)',
  numberOfQubits: 1,
  gates: [
    { id: 'demo-gate-hh-1', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'demo-gate-hh-2', gateId: 'H', targetQubit: 0, position: 1 },
    { id: 'demo-gate-hh-m', gateId: 'M', targetQubit: 0, position: 2 }
  ],
  measurements: [0]
};

export const INITIAL_CHALLENGE_CIRCUIT: Circuit = {
  id: 'demo-circuit-challenge',
  name: 'X Gate Challenge',
  numberOfQubits: 1,
  gates: [
    { id: 'demo-gate-ch-m', gateId: 'M', targetQubit: 0, position: 1 }
  ],
  measurements: [0]
};

const DEFAULT_TOUR_STATE: TourState = {
  isActive: false,
  currentStep: 0,
  isCompleted: false,
  isSkipped: false,
  hasSeenWelcome: false
};

const DEFAULT_DEMO_STATE: DemoState = {
  isActive: false,
  currentStep: 0,
  isCompleted: false,
  prediction1: null,
  prediction2: null,
  circuit: INITIAL_DEMO_CIRCUIT_H,
  simulationResult: null,
  challengeCircuit: INITIAL_CHALLENGE_CIRCUIT,
  challengeResult: null,
  challengePassed: false
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Tour state initialized from localStorage
  const [tour, setTour] = useState<TourState>(() => {
    try {
      const saved = localStorage.getItem(TOUR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_TOUR_STATE,
          ...parsed,
          isActive: false // Do not automatically force open on full reload unless triggered
        };
      }
    } catch (e) {
      console.warn('Failed to parse tour state from localStorage', e);
    }
    return DEFAULT_TOUR_STATE;
  });

  // 2. Demo state initialized from localStorage
  const [demo, setDemo] = useState<DemoState>(() => {
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_DEMO_STATE,
          ...parsed,
          circuit: parsed.circuit || INITIAL_DEMO_CIRCUIT_H,
          challengeCircuit: parsed.challengeCircuit || INITIAL_CHALLENGE_CIRCUIT,
          isActive: false
        };
      }
    } catch (e) {
      console.warn('Failed to parse demo state from localStorage', e);
    }
    return DEFAULT_DEMO_STATE;
  });

  // Sync Tour to localStorage
  useEffect(() => {
    try {
      const toPersist = {
        isCompleted: tour.isCompleted,
        isSkipped: tour.isSkipped,
        currentStep: tour.currentStep,
        hasSeenWelcome: tour.hasSeenWelcome
      };
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(toPersist));
    } catch (e) {
      console.warn('Failed to save tour state to localStorage', e);
    }
  }, [tour.isCompleted, tour.isSkipped, tour.currentStep, tour.hasSeenWelcome]);

  // Sync Demo to localStorage
  useEffect(() => {
    try {
      const toPersist = {
        isCompleted: demo.isCompleted,
        currentStep: demo.currentStep,
        prediction1: demo.prediction1,
        prediction2: demo.prediction2,
        challengePassed: demo.challengePassed
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(toPersist));
    } catch (e) {
      console.warn('Failed to save demo state to localStorage', e);
    }
  }, [demo.isCompleted, demo.currentStep, demo.prediction1, demo.prediction2, demo.challengePassed]);

  // Tour actions
  const startTour = (step = 0) => {
    setTour((prev) => ({
      ...prev,
      isActive: true,
      currentStep: step,
      hasSeenWelcome: true
    }));
  };

  const nextTourStep = () => {
    setTour((prev) => {
      const next = prev.currentStep + 1;
      return {
        ...prev,
        currentStep: next
      };
    });
  };

  const prevTourStep = () => {
    setTour((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  };

  const skipTour = () => {
    setTour((prev) => ({
      ...prev,
      isActive: false,
      isSkipped: true,
      hasSeenWelcome: true
    }));
  };

  const restartTour = () => {
    setTour({
      isActive: true,
      currentStep: 0,
      isCompleted: false,
      isSkipped: false,
      hasSeenWelcome: true
    });
  };

  const closeTour = () => {
    setTour((prev) => ({
      ...prev,
      isActive: false
    }));
  };

  const dismissWelcome = () => {
    setTour((prev) => ({
      ...prev,
      hasSeenWelcome: true
    }));
  };

  // Demo actions
  const startDemo = (step = 0) => {
    setDemo((prev) => ({
      ...prev,
      isActive: true,
      currentStep: step
    }));
  };

  const setDemoStep = (step: number) => {
    setDemo((prev) => ({
      ...prev,
      currentStep: step
    }));
  };

  const setPrediction1 = (optId: string) => {
    setDemo((prev) => ({
      ...prev,
      prediction1: optId
    }));
  };

  const setPrediction2 = (optId: string) => {
    setDemo((prev) => ({
      ...prev,
      prediction2: optId
    }));
  };

  const setDemoCircuit = (circuit: Circuit) => {
    setDemo((prev) => ({
      ...prev,
      circuit
    }));
  };

  const demoRef = React.useRef(demo);
  demoRef.current = demo;

  const runDemoSimulation = React.useCallback((): SimulationResult => {
    const result = simulateQuantumCircuit(demoRef.current.circuit, 1024);
    setDemo((prev) => ({
      ...prev,
      simulationResult: result
    }));
    return result;
  }, []);

  const runInterferenceSimulation = React.useCallback((): SimulationResult => {
    const result = simulateQuantumCircuit(INITIAL_INTERFERENCE_CIRCUIT, 1024);
    return result;
  }, []);

  const setChallengeCircuit = (circuit: Circuit) => {
    setDemo((prev) => ({
      ...prev,
      challengeCircuit: circuit
    }));
  };

  const runChallengeSimulation = React.useCallback(() => {
    const currentChallenge = demoRef.current.challengeCircuit;
    const result = simulateQuantumCircuit(currentChallenge, 1024);
    const hasX = currentChallenge.gates.some(
      (g) => g.gateId.toUpperCase() === 'X' && g.targetQubit === 0
    );
    const prob1 = result.probabilities['1'] || 0;
    const isCorrect = hasX && prob1 > 0.95;

    const feedback = isCorrect
      ? 'Great job! The Pauli-X gate flipped the qubit from |0⟩ to |1⟩, resulting in 100% measurement of state 1.'
      : 'Not quite. Place an X gate on the wire before the measurement (M) gate to invert the qubit state.';

    setDemo((prev) => ({
      ...prev,
      challengeResult: result,
      challengePassed: isCorrect,
      isCompleted: isCorrect ? true : prev.isCompleted
    }));

    return { isCorrect, feedback, result };
  }, []);

  const completeDemo = () => {
    setDemo((prev) => ({
      ...prev,
      isCompleted: true
    }));
  };

  const restartDemo = () => {
    setDemo({
      isActive: true,
      currentStep: 0,
      isCompleted: false,
      prediction1: null,
      prediction2: null,
      circuit: INITIAL_DEMO_CIRCUIT_H,
      simulationResult: null,
      challengeCircuit: INITIAL_CHALLENGE_CIRCUIT,
      challengeResult: null,
      challengePassed: false
    });
  };

  const closeDemo = () => {
    setDemo((prev) => ({
      ...prev,
      isActive: false
    }));
  };

  const value = useMemo(() => ({
    tour,
    startTour,
    nextTourStep,
    prevTourStep,
    skipTour,
    restartTour,
    closeTour,
    dismissWelcome,
    demo,
    startDemo,
    setDemoStep,
    setPrediction1,
    setPrediction2,
    setDemoCircuit,
    runDemoSimulation,
    runInterferenceSimulation,
    setChallengeCircuit,
    runChallengeSimulation,
    completeDemo,
    restartDemo,
    closeDemo
  }), [tour, demo, runDemoSimulation, runInterferenceSimulation, runChallengeSimulation]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
