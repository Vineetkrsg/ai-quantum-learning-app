import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Circuit, QuantumGate, GateOperation, SimulationResult, ExperimentUserState, GuidedExperiment } from '../types/quantum';
import { QUANTUM_GATES } from '../mock/gatesData';
import { SAMPLE_CIRCUITS } from '../mock/sampleCircuits';
import { GUIDED_EXPERIMENTS } from '../mock/experimentsData';
import { simulateQuantumCircuit } from '../services/quantumSimulator';
import { useProgress } from '../context/ProgressContext';
import { useOnboarding } from '../context/OnboardingContext';
import { GatePalette } from '../components/quantum/GatePalette';
import { CircuitGrid } from '../components/quantum/CircuitGrid';
import { CircuitControls } from '../components/quantum/CircuitControls';
import { ResultCard } from '../components/quantum/ResultCard';
import { CodeViewer } from '../components/quantum/CodeViewer';
import { TutorPanel } from '../components/tutor/TutorPanel';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';

// Quantum Lab 2.0 Components
import { ExperimentSelector } from '../components/quantum/ExperimentSelector';
import { ExperimentGoalCard } from '../components/quantum/ExperimentGoalCard';
import { PredictionCard } from '../components/quantum/PredictionCard';
import { ExpectedVsActual } from '../components/quantum/ExpectedVsActual';
import { CircuitCodeConnection } from '../components/quantum/CircuitCodeConnection';
import { QuantumVisualizer } from '../components/quantum/QuantumVisualizer';
import { ExperimentComparison } from '../components/quantum/ExperimentComparison';
import { ExperimentChallengeCard } from '../components/quantum/ExperimentChallengeCard';
import { ExperimentCompletionBanner } from '../components/quantum/ExperimentCompletionBanner';
import { CircuitExplanationModal } from '../components/quantum/CircuitExplanationModal';

import { 
  Cpu, 
  Code, 
  BarChart2, 
  Bot, 
  Sliders, 
  Sparkles, 
  Atom, 
  ArrowLeft,
  GitCompare,
  Eye,
  Layers,
  HelpCircle
} from 'lucide-react';

export const LabPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const progress = useProgress();
  const { startDemo } = useOnboarding();

  // Route queries: origin lesson & experiment
  const originModuleId = searchParams.get('moduleId');
  const originLessonId = searchParams.get('lessonId');
  const queryExperimentId = searchParams.get('experiment');
  const presetId = searchParams.get('preset');

  // Mode: 'experiment' (Guided experiments) vs 'freeform' (Open circuit playground)
  const [mode, setMode] = useState<'experiment' | 'freeform'>('experiment');

  // Active guided experiment
  const [selectedExpId, setSelectedExpId] = useState<string>(() => {
    if (queryExperimentId) {
      const found = GUIDED_EXPERIMENTS.find(e => e.id === queryExperimentId);
      if (found) return found.id;
    }
    if (presetId) {
      // Map legacy presets to closest experiment if applicable
      if (presetId === 'bell-state') return 'exp-bell-state';
      if (presetId === 'single-qubit-h' || presetId === 'superposition-demo') return 'exp-h-gate';
      if (presetId === 'single-qubit-x') return 'exp-x-gate';
    }
    return GUIDED_EXPERIMENTS[0].id;
  });

  const activeExperiment = useMemo(() => {
    return GUIDED_EXPERIMENTS.find(e => e.id === selectedExpId) || GUIDED_EXPERIMENTS[0];
  }, [selectedExpId]);

  // Scoped key for state isolation (Section 6 & 7)
  const scopedKey = useMemo(() => {
    if (originModuleId && originLessonId) {
      return `${originModuleId}/${originLessonId}/quantum-lab/${activeExperiment.id}`;
    }
    return `lab/experiment/${activeExperiment.id}`;
  }, [originModuleId, originLessonId, activeExperiment.id]);

  // Initial experiment state
  const defaultExperimentState: ExperimentUserState = useMemo(() => ({
    circuit: activeExperiment.initialCircuit,
    prediction: null,
    predictionSubmitted: false,
    simulationResult: null,
    isCompleted: false,
    challengeSubmitted: false,
    challengePassed: false,
    challengeFeedback: undefined,
    hintLevel: 1,
    showSolution: false
  }), [activeExperiment]);

  // Scoped experiment state loaded from ProgressContext
  const currentExpState = progress.getActivityState<ExperimentUserState>(scopedKey, defaultExperimentState);

  // Freeform standalone circuit state (fallback for open playground)
  const defaultFreeformCircuit = SAMPLE_CIRCUITS.find(c => c.id === 'bell-state') || SAMPLE_CIRCUITS[0];
  const [freeformCircuit, setFreeformCircuit] = useState<Circuit>(defaultFreeformCircuit);
  const [freeformResult, setFreeformResult] = useState<SimulationResult | null>(null);

  // Current circuit on canvas
  const circuit = mode === 'experiment' ? (currentExpState.circuit || activeExperiment.initialCircuit) : freeformCircuit;
  const simulationResult = mode === 'experiment' ? currentExpState.simulationResult : freeformResult;

  const [selectedGate, setSelectedGate] = useState<QuantumGate | null>(QUANTUM_GATES[0]);
  const [shots, setShots] = useState(1024);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'canvas' | 'code' | 'visualization' | 'compare'>('canvas');
  const [isTutorOpen, setIsTutorOpen] = useState(true);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);

  // Synchronize when URL queries change
  useEffect(() => {
    const qExp = searchParams.get('experiment');
    if (qExp && qExp !== selectedExpId) {
      const found = GUIDED_EXPERIMENTS.find(e => e.id === qExp);
      if (found) {
        setSelectedExpId(found.id);
        setMode('experiment');
      }
    } else if (searchParams.get('preset')) {
      const pId = searchParams.get('preset');
      const foundPreset = SAMPLE_CIRCUITS.find(c => c.id === pId);
      if (foundPreset) {
        setFreeformCircuit(foundPreset);
      }
    }
  }, [searchParams]);

  // Update experiment state helper
  const updateExpState = (updater: (prev: ExperimentUserState) => ExperimentUserState) => {
    progress.setActivityState<ExperimentUserState>(scopedKey, (prev) => {
      const safePrev = prev || defaultExperimentState;
      return updater(safePrev);
    });
  };

  // Place gate on circuit wire
  const handlePlaceGate = (qubitIndex: number, position: number) => {
    if (!selectedGate) return;

    const newOp: GateOperation = {
      id: `gate-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      gateId: selectedGate.id,
      targetQubit: qubitIndex,
      controlQubit: selectedGate.numberOfQubits > 1 ? (qubitIndex === 0 ? 1 : 0) : undefined,
      position: position,
    };

    const newGates = [
      ...circuit.gates.filter((g) => !(g.targetQubit === qubitIndex && g.position === position)),
      newOp
    ];

    if (mode === 'experiment') {
      updateExpState(prev => ({
        ...prev,
        circuit: {
          ...prev.circuit,
          gates: newGates
        },
        challengeSubmitted: false
      }));
    } else {
      setFreeformCircuit(prev => ({
        ...prev,
        gates: newGates
      }));
    }
  };

  // Remove gate
  const handleRemoveGate = (operationId: string) => {
    const updatedGates = circuit.gates.filter(g => g.id !== operationId);
    if (mode === 'experiment') {
      updateExpState(prev => ({
        ...prev,
        circuit: {
          ...prev.circuit,
          gates: updatedGates
        },
        challengeSubmitted: false
      }));
    } else {
      setFreeformCircuit(prev => ({
        ...prev,
        gates: updatedGates
      }));
    }
  };

  // Clear all gates
  const handleClearCircuit = () => {
    if (mode === 'experiment') {
      updateExpState(prev => ({
        ...prev,
        circuit: {
          ...prev.circuit,
          gates: []
        },
        simulationResult: null,
        challengeSubmitted: false
      }));
    } else {
      setFreeformCircuit(prev => ({
        ...prev,
        gates: []
      }));
      setFreeformResult(null);
    }
  };

  // Add qubit wire
  const handleAddQubit = () => {
    if (circuit.numberOfQubits < 5) {
      const updatedCount = circuit.numberOfQubits + 1;
      if (mode === 'experiment') {
        updateExpState(prev => ({
          ...prev,
          circuit: { ...prev.circuit, numberOfQubits: updatedCount }
        }));
      } else {
        setFreeformCircuit(prev => ({ ...prev, numberOfQubits: updatedCount }));
      }
    }
  };

  // Remove qubit wire
  const handleRemoveQubit = () => {
    if (circuit.numberOfQubits > 1) {
      const updatedCount = circuit.numberOfQubits - 1;
      const filteredGates = circuit.gates.filter(
        g => g.targetQubit < updatedCount && (g.controlQubit === undefined || g.controlQubit < updatedCount)
      );

      if (mode === 'experiment') {
        updateExpState(prev => ({
          ...prev,
          circuit: {
            ...prev.circuit,
            numberOfQubits: updatedCount,
            gates: filteredGates
          }
        }));
      } else {
        setFreeformCircuit(prev => ({
          ...prev,
          numberOfQubits: updatedCount,
          gates: filteredGates
        }));
      }
    }
  };

  // Reset experiment (Section 8: restores experiment starting state only)
  const handleResetExperiment = () => {
    if (mode === 'experiment') {
      progress.setActivityState<ExperimentUserState>(scopedKey, {
        circuit: activeExperiment.initialCircuit,
        prediction: null,
        predictionSubmitted: false,
        simulationResult: null,
        isCompleted: false,
        challengeSubmitted: false,
        challengePassed: false,
        challengeFeedback: undefined,
        hintLevel: 1,
        showSolution: false
      });
    } else {
      setFreeformCircuit(defaultFreeformCircuit);
      setFreeformResult(null);
    }
  };

  // Run simulation calculation (Exact statevector engine)
  const handleRunSimulation = (circuitToRun: Circuit = circuit) => {
    setIsRunning(true);

    setTimeout(() => {
      const result = simulateQuantumCircuit(circuitToRun, shots);

      if (mode === 'experiment') {
        // Record prediction if one was made
        if (currentExpState.prediction) {
          const opt = activeExperiment.prediction.options.find(o => o.id === currentExpState.prediction);
          if (opt && !currentExpState.predictionSubmitted) {
            progress.recordPredictionMade(opt.isExpected);
          }
        }

        updateExpState(prev => ({
          ...prev,
          simulationResult: result,
          predictionSubmitted: true
        }));
      } else {
        setFreeformResult(result);
      }

      progress.recordCircuitRun(circuitToRun.name || 'Custom Circuit');
      setIsRunning(false);
    }, 450);
  };

  // Handle prediction selection
  const handleSelectPrediction = (optionId: string) => {
    if (mode === 'experiment') {
      updateExpState(prev => ({
        ...prev,
        prediction: optionId
      }));
    }
  };

  // Handle challenge submission & validation
  const handleSubmitChallenge = () => {
    setIsRunning(true);
    setTimeout(() => {
      const simResult = simulateQuantumCircuit(circuit, shots);
      const validation = activeExperiment.challenge.validator(circuit, simResult);

      updateExpState(prev => ({
        ...prev,
        simulationResult: simResult,
        challengeSubmitted: true,
        challengePassed: validation.isCorrect,
        challengeFeedback: validation.feedback,
        isCompleted: validation.isCorrect ? true : prev.isCompleted
      }));

      if (validation.isCorrect) {
        progress.recordExperimentComplete(activeExperiment.id, activeExperiment.title);
      }

      setIsRunning(false);
    }, 450);
  };

  // Handle next hint tier
  const handleNextHintTier = () => {
    updateExpState(prev => ({
      ...prev,
      hintLevel: Math.min(prev.hintLevel + 1, activeExperiment.challenge.hints.length)
    }));
  };

  // Handle reveal solution
  const handleRevealSolution = () => {
    updateExpState(prev => ({
      ...prev,
      showSolution: true
    }));
  };

  // Switch to next experiment in curriculum
  const handleNavigateNextExperiment = () => {
    if (activeExperiment.nextExperimentId) {
      const nextExp = GUIDED_EXPERIMENTS.find(e => e.id === activeExperiment.nextExperimentId);
      if (nextExp) {
        setSelectedExpId(nextExp.id);
        setSearchParams(prev => {
          const nextParams = new URLSearchParams(prev);
          nextParams.set('experiment', nextExp.id);
          return nextParams;
        });
      }
    }
  };

  // Preset loading for freeform
  const handleLoadPreset = (pId: string) => {
    const preset = SAMPLE_CIRCUITS.find((c) => c.id === pId);
    if (preset) {
      setFreeformCircuit(preset);
      handleRunSimulation(preset);
    }
  };

  const nextExperiment = activeExperiment.nextExperimentId 
    ? GUIDED_EXPERIMENTS.find(e => e.id === activeExperiment.nextExperimentId) 
    : null;

  const viewTabs = [
    { id: 'canvas', label: 'Circuit Canvas', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Circuit ↔ Code (Qiskit / QASM)', icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'visualization', label: 'State Visualizer', icon: <Atom className="w-3.5 h-3.5" /> },
    { id: 'compare', label: 'Compare Circuits', icon: <GitCompare className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Return to Origin Lesson Banner if opened from a Lesson */}
      {originModuleId && (
        <div className="p-3.5 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span className="text-[var(--fg-main)]">
              Launched from Curriculum: <span className="font-semibold">{originModuleId}</span> {originLessonId ? `· ${originLessonId}` : ''}
            </span>
          </div>
          <Link
            to={originLessonId ? `/learn/${originModuleId}/${originLessonId}` : `/learn/${originModuleId}`}
            className="flex items-center gap-1 font-semibold text-sciteal-700 dark:text-sciteal-300 hover:underline cursor-pointer"
          >
            <span>← Return to Lesson</span>
          </Link>
        </div>
      )}

      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2" data-tour="lab-studio">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-sunken)] text-sciteal-700 dark:text-sciteal-300 border border-[var(--border-card)] font-mono font-semibold">
              Aer Statevector Simulator
            </span>
            <span className="text-xs text-[var(--fg-muted)] font-mono">
              {circuit.numberOfQubits} Qubits • {circuit.gates.length} Gates
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--fg-main)] tracking-tight flex items-center gap-2">
            <Atom className="w-6 h-6 text-sciteal-600 dark:text-sciteal-400" />
            <span>Quantum Circuit Studio 2.0</span>
          </h2>
        </div>

        {/* Studio Actions: Demo, Explain Circuit & AI Tutor Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="quantum"
            size="sm"
            onClick={() => startDemo(0)}
            leftIcon={<Sparkles className="w-3.5 h-3.5 fill-current" />}
          >
            Try Interactive Demo
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExplanationModalOpen(true)}
            leftIcon={<Layers className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />}
          >
            Explain Circuit
          </Button>

          <Button
            variant={isTutorOpen ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setIsTutorOpen(!isTutorOpen)}
            leftIcon={<Bot className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />}
          >
            {isTutorOpen ? 'Hide AI Tutor' : 'Open AI Tutor'}
          </Button>
        </div>
      </div>

      {/* Guided Experiments Selector */}
      <ExperimentSelector
        currentExperimentId={selectedExpId}
        mode={mode}
        onSelectExperiment={(id) => {
          setSelectedExpId(id);
          setMode('experiment');
          setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('experiment', id);
            return next;
          });
        }}
        onSelectFreeform={() => setMode('freeform')}
      />

      {/* Main Studio Grid: Left Canvas (8 cols) & Right AI Tutor (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Area */}
        <div className={`space-y-6 transition-all duration-300 ${isTutorOpen ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {/* In Guided Experiment Mode: Experiment Goal & Objective Header */}
          {mode === 'experiment' && (
            <ExperimentGoalCard
              experiment={activeExperiment}
              onResetExperiment={handleResetExperiment}
              isCompleted={currentExpState.isCompleted}
            />
          )}

          {/* Gate Palette Component */}
          <GatePalette
            gates={QUANTUM_GATES}
            selectedGate={selectedGate}
            onSelectGate={setSelectedGate}
          />

          {/* View Switcher Tabs & Circuit Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Tabs
                tabs={viewTabs}
                activeTab={activeTab}
                onChange={(id) => setActiveTab(id as any)}
              />
            </div>

            {/* Circuit Toolbar Controls */}
            <CircuitControls
              onRun={() => handleRunSimulation(circuit)}
              onClear={handleClearCircuit}
              onAddQubit={handleAddQubit}
              onRemoveQubit={handleRemoveQubit}
              onLoadPreset={handleLoadPreset}
              qubitCount={circuit.numberOfQubits}
              isRunning={isRunning}
              shots={shots}
              onShotsChange={setShots}
            />
          </div>

          {/* TAB 1: CIRCUIT CANVAS & EXPERIMENTATION */}
          {activeTab === 'canvas' && (
            <div className="space-y-6">
              {/* Step 1: Predict Before Running in Experiment Mode */}
              {mode === 'experiment' && (
                <PredictionCard
                  experiment={activeExperiment}
                  selectedOptionId={currentExpState.prediction}
                  onSelectOption={handleSelectPrediction}
                  simulationResult={simulationResult}
                />
              )}

              {/* Interactive Circuit Grid Canvas */}
              <Card variant="default" className="p-4" data-tour="circuit-building">
                <div className="flex items-center justify-between mb-3 text-xs text-[var(--fg-muted)]">
                  <span>Interactive Qubit Wires (Click slot to place selected {selectedGate?.symbol} gate)</span>
                  <span className="font-mono text-sciteal-700 dark:text-sciteal-400 font-semibold">
                    {circuit.gates.length} Operations Placed
                  </span>
                </div>
                <CircuitGrid
                  circuit={circuit}
                  selectedGate={selectedGate}
                  onPlaceGate={handlePlaceGate}
                  onRemoveGate={handleRemoveGate}
                  totalSteps={Math.max(7, ...circuit.gates.map(g => g.position + 2))}
                />
              </Card>

              {/* Simulation Result: Expected vs Actual & Measurement Histogram */}
              <div data-tour="lab-visualization">
                <ExpectedVsActual
                  result={simulationResult}
                  experiment={mode === 'experiment' ? activeExperiment : undefined}
                  circuit={circuit}
                  isLoading={isRunning}
                  onExplainWhy={() => setIsTutorOpen(true)}
                  onExplainCircuit={() => setIsExplanationModalOpen(true)}
                />
              </div>

              {/* Step 2: Experiment Challenge & Scaffolded Hints */}
              {mode === 'experiment' && (
                <ExperimentChallengeCard
                  challenge={activeExperiment.challenge}
                  circuit={circuit}
                  simulationResult={simulationResult}
                  isPassed={currentExpState.challengePassed}
                  isSubmitted={currentExpState.challengeSubmitted}
                  feedback={currentExpState.challengeFeedback}
                  hintLevel={currentExpState.hintLevel}
                  showSolution={currentExpState.showSolution}
                  onSubmitChallenge={handleSubmitChallenge}
                  onNextHint={handleNextHintTier}
                  onRevealSolution={handleRevealSolution}
                  isRunning={isRunning}
                />
              )}

              {/* Experiment Completion Summary Banner */}
              {mode === 'experiment' && currentExpState.isCompleted && (
                <ExperimentCompletionBanner
                  experiment={activeExperiment}
                  onNextExperiment={handleNavigateNextExperiment}
                  nextExperiment={nextExperiment}
                />
              )}
            </div>
          )}

          {/* TAB 2: CIRCUIT ↔ CODE CONNECTION */}
          {activeTab === 'code' && (
            <div data-tour="lab-code">
              <CircuitCodeConnection circuit={circuit} />
            </div>
          )}

          {/* TAB 3: QUANTUM STATE VISUALIZER */}
          {activeTab === 'visualization' && (
            <QuantumVisualizer
              result={simulationResult}
              experiment={mode === 'experiment' ? activeExperiment : undefined}
            />
          )}

          {/* TAB 4: EXPERIMENT COMPARISON */}
          {activeTab === 'compare' && (
            <ExperimentComparison
              currentExperiment={activeExperiment}
            />
          )}
        </div>

        {/* Right Collapsible AI Tutor Panel */}
        {isTutorOpen && (
          <div className="lg:col-span-4 space-y-6">
            <TutorPanel
              context={{
                currentCircuitName: circuit.name,
                qubitCount: circuit.numberOfQubits,
                gateCount: circuit.gates.length,
                activeLessonTitle: mode === 'experiment' ? activeExperiment.title : 'Quantum Circuit Studio',
                gates: circuit.gates,
                circuitContext: {
                  numberOfQubits: circuit.numberOfQubits,
                  gateCount: circuit.gates.length,
                  circuitName: circuit.name,
                  gates: circuit.gates
                },
                simulationResult: simulationResult ? {
                  counts: simulationResult.counts,
                  probabilities: simulationResult.probabilities,
                  shots: simulationResult.shots,
                  executionTimeMs: simulationResult.executionTimeMs
                } : undefined
              }}
            />
          </div>
        )}
      </div>

      {/* Circuit Explanation Breakdown Modal */}
      {isExplanationModalOpen && (
        <CircuitExplanationModal
          circuit={circuit}
          simulationResult={simulationResult}
          onClose={() => setIsExplanationModalOpen(false)}
          onOpenAITutor={() => {
            setIsTutorOpen(true);
            setIsExplanationModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
