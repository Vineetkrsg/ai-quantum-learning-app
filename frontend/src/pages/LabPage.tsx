import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Circuit, QuantumGate, GateOperation, SimulationResult } from '../types/quantum';
import { QUANTUM_GATES } from '../mock/gatesData';
import { SAMPLE_CIRCUITS } from '../mock/sampleCircuits';
import { GatePalette } from '../components/quantum/GatePalette';
import { CircuitGrid } from '../components/quantum/CircuitGrid';
import { CircuitControls } from '../components/quantum/CircuitControls';
import { ResultCard } from '../components/quantum/ResultCard';
import { CodeViewer } from '../components/quantum/CodeViewer';
import { TutorPanel } from '../components/tutor/TutorPanel';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { 
  Cpu, 
  Code, 
  BarChart2, 
  Bot, 
  Sliders, 
  Sparkles, 
  Maximize2, 
  ChevronRight, 
  ChevronLeft,
  Atom,
  HelpCircle
} from 'lucide-react';

export const LabPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Active circuit state (defaults to Bell State or URL preset)
  const defaultCircuit = SAMPLE_CIRCUITS.find(c => c.id === 'bell-state') || SAMPLE_CIRCUITS[0];
  const [circuit, setCircuit] = useState<Circuit>(defaultCircuit);
  const [selectedGate, setSelectedGate] = useState<QuantumGate | null>(QUANTUM_GATES[0]);
  const [shots, setShots] = useState(1024);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'canvas' | 'code' | 'visualization'>('canvas');
  const [isTutorOpen, setIsTutorOpen] = useState(true);

  // Check and apply URL preset on mount or query change
  useEffect(() => {
    const presetId = searchParams.get('preset');
    if (presetId) {
      const found = SAMPLE_CIRCUITS.find((c) => c.id === presetId);
      if (found) {
        setCircuit(found);
        handleRunSimulation(found);
      }
    }
  }, [searchParams]);

  // Initial simulation result for Bell State
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>({
    circuitId: 'bell-state',
    counts: { '00': 518, '11': 506 },
    probabilities: { '00': 0.5059, '11': 0.4941 },
    executionTimeMs: 42.8,
    shots: 1024
  });

  // Handle gate placement on circuit wire
  const handlePlaceGate = (qubitIndex: number, position: number) => {
    if (!selectedGate) return;

    const newOp: GateOperation = {
      id: `gate-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      gateId: selectedGate.id,
      targetQubit: qubitIndex,
      controlQubit: selectedGate.numberOfQubits > 1 ? (qubitIndex === 0 ? 1 : 0) : undefined,
      position: position,
    };

    setCircuit((prev) => ({
      ...prev,
      gates: [...prev.gates.filter((g) => !(g.targetQubit === qubitIndex && g.position === position)), newOp]
    }));
  };

  // Handle gate removal
  const handleRemoveGate = (operationId: string) => {
    setCircuit((prev) => ({
      ...prev,
      gates: prev.gates.filter((g) => g.id !== operationId)
    }));
  };

  // Clear all gates
  const handleClearCircuit = () => {
    setCircuit((prev) => ({
      ...prev,
      gates: []
    }));
    setSimulationResult(null);
  };

  // Add / remove qubit wire
  const handleAddQubit = () => {
    if (circuit.numberOfQubits < 5) {
      setCircuit((prev) => ({
        ...prev,
        numberOfQubits: prev.numberOfQubits + 1
      }));
    }
  };

  const handleRemoveQubit = () => {
    if (circuit.numberOfQubits > 1) {
      const newCount = circuit.numberOfQubits - 1;
      setCircuit((prev) => ({
        ...prev,
        numberOfQubits: newCount,
        gates: prev.gates.filter((g) => g.targetQubit < newCount && (g.controlQubit === undefined || g.controlQubit < newCount))
      }));
    }
  };

  // Load sample circuit presets
  const handleLoadPreset = (presetId: string) => {
    const preset = SAMPLE_CIRCUITS.find((c) => c.id === presetId);
    if (preset) {
      setCircuit(preset);
      handleRunSimulation(preset);
    }
  };

  // Run simulation calculation (mocking Qiskit Aer behavior)
  const handleRunSimulation = (circuitToRun: Circuit = circuit) => {
    setIsRunning(true);

    setTimeout(() => {
      const nQubits = circuitToRun.numberOfQubits;
      const gates = circuitToRun.gates;
      const counts: Record<string, number> = {};
      const probs: Record<string, number> = {};

      const hasH = gates.some((g) => g.gateId.toUpperCase() === 'H');
      const hasCX = gates.some((g) => g.gateId.toUpperCase() === 'CNOT' || g.gateId.toUpperCase() === 'CX');

      if (gates.length === 0) {
        const zeroState = '0'.repeat(nQubits);
        counts[zeroState] = shots;
        probs[zeroState] = 1.0;
      } else if (hasH && hasCX && nQubits >= 2) {
        // Bell state distribution
        const s0 = '0'.repeat(nQubits);
        const s1 = '11' + '0'.repeat(nQubits - 2);
        const noise = Math.floor(Math.random() * 20) - 10;
        const c0 = Math.round(shots / 2) + noise;
        const c1 = shots - c0;
        counts[s0] = c0;
        counts[s1] = c1;
        probs[s0] = Number((c0 / shots).toFixed(4));
        probs[s1] = Number((c1 / shots).toFixed(4));
      } else if (hasH) {
        // Equal superposition across basic states
        const totalStates = Math.min(4, Math.pow(2, nQubits));
        let allocated = 0;
        for (let i = 0; i < totalStates; i++) {
          const binStr = i.toString(2).padStart(nQubits, '0');
          const isLast = i === totalStates - 1;
          const c = isLast ? shots - allocated : Math.round(shots / totalStates) + (Math.floor(Math.random() * 10) - 5);
          allocated += c;
          counts[binStr] = Math.max(0, c);
          probs[binStr] = Number((counts[binStr] / shots).toFixed(4));
        }
      } else {
        // Deterministic basis state
        const targetState = '1' + '0'.repeat(nQubits - 1);
        counts[targetState] = shots;
        probs[targetState] = 1.0;
      }

      setSimulationResult({
        circuitId: circuitToRun.id,
        counts,
        probabilities: probs,
        executionTimeMs: Number((35 + Math.random() * 15).toFixed(1)),
        shots
      });

      setIsRunning(false);
    }, 600);
  };

  const viewTabs = [
    { id: 'canvas', label: 'Circuit Canvas', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Code Mode (Qiskit / QASM)', icon: <Code className="w-3.5 h-3.5" /> },
    { id: 'visualization', label: 'State Probabilities', icon: <BarChart2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-sunken)] text-sciteal-700 dark:text-sciteal-300 border border-[var(--border-card)] font-mono font-semibold">
              Qiskit Aer Simulator
            </span>
            <span className="text-xs text-[var(--fg-muted)] font-mono">
              {circuit.numberOfQubits} Qubits • {circuit.gates.length} Gates
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--fg-main)] tracking-tight flex items-center gap-2">
            <Atom className="w-6 h-6 text-sciteal-600 dark:text-sciteal-400" />
            <span>Quantum Circuit Studio</span>
          </h2>
        </div>

        {/* Tutor Drawer Toggle Button */}
        <div className="flex items-center gap-2">
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

      {/* Main Studio Grid: Left Studio Canvas & Right Collapsible AI Tutor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Studio Area (Span 8 or 12 depending on tutor visibility) */}
        <div className={`space-y-6 transition-all duration-300 ${isTutorOpen ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
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

            {/* Circuit Toolbar Actions */}
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

          {/* Conditional View Content: Canvas / Code / Visualization */}
          {activeTab === 'canvas' && (
            <div className="space-y-6">
              <Card variant="default" className="p-4">
                <div className="flex items-center justify-between mb-3 text-xs text-[var(--fg-muted)]">
                  <span>Interactive Qubit Wires (Click wire slot to place selected {selectedGate?.symbol} gate)</span>
                  <span className="font-mono text-sciteal-700 dark:text-sciteal-400 font-semibold">{circuit.gates.length} Operations Placed</span>
                </div>
                <CircuitGrid
                  circuit={circuit}
                  selectedGate={selectedGate}
                  onPlaceGate={handlePlaceGate}
                  onRemoveGate={handleRemoveGate}
                  totalSteps={7}
                />
              </Card>

              {/* Simulation Result Area */}
              <ResultCard result={simulationResult} isLoading={isRunning} />
            </div>
          )}

          {activeTab === 'code' && (
            <CodeViewer circuit={circuit} />
          )}

          {activeTab === 'visualization' && (
            <ResultCard result={simulationResult} isLoading={isRunning} />
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
                activeLessonTitle: 'Circuit Synthesis & Measurement'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
