import React, { useState, useMemo, useEffect } from 'react';
import { Circuit } from '../../../types/quantum';
import { simulateQuantumCircuit } from '../../../services/quantumSimulator';
import {
  InteractiveBlochSphere,
  SuperpositionVisualizer,
  GateExplorerVisualizer,
  MeasurementVisualizer,
  EntanglementVisualizer,
  WaveAmplitudeVisualizer
} from './index';
import { CircuitPropagationVisualizer } from './CircuitPropagationVisualizer';
import { QubitStateVisualizer } from './QubitStateVisualizer';
import { AlgorithmFlowVisualizer } from './AlgorithmFlowVisualizer';
import { Layers, Compass, Zap, BarChart3, Activity, Cpu, Sparkles } from 'lucide-react';

export type QuantumConcept =
  | 'qubits'
  | 'superposition'
  | 'measurement'
  | 'gates'
  | 'circuits'
  | 'entanglement'
  | 'algorithms'
  | 'fundamentals'
  | 'wave';

interface VisualizationSelectorProps {
  conceptId?: string;
  lessonId?: string;
  moduleId?: string;
  circuit?: Circuit;
  className?: string;
  onExploreInLab?: () => void;
  title?: string;
}

/**
 * Reusable concept-to-visualization resolver that maps any lesson or circuit state
 * to its pedagogically optimal 2D/3D visual model instead of repeatedly defaulting
 * to the Bloch sphere.
 */
export const VisualizationSelector: React.FC<VisualizationSelectorProps> = ({
  conceptId,
  lessonId,
  moduleId,
  circuit,
  className = '',
  onExploreInLab,
  title
}) => {
  // Infer normalized concept
  const inferredConcept: QuantumConcept = React.useMemo(() => {
    const raw = `${conceptId || ''} ${lessonId || ''} ${moduleId || ''}`.toLowerCase();
    if (raw.includes('wave') || raw.includes('amplitud') || raw.includes('wav-')) {
      return 'wave';
    }
    if (raw.includes('superpos') || raw.includes('hadamard') || raw.includes('h-gate') || raw.includes('sup-')) {
      return 'superposition';
    }
    if (raw.includes('entangle') || raw.includes('bell') || raw.includes('cnot') || raw.includes('ent-')) {
      return 'entanglement';
    }
    if (raw.includes('algo') || raw.includes('grover') || raw.includes('deutsch') || raw.includes('alg-')) {
      return 'algorithms';
    }
    if (raw.includes('propagat') || raw.includes('circuit') || raw.includes('cir-') || raw.includes('wire')) {
      return 'circuits';
    }
    if (raw.includes('measur') || raw.includes('shot') || raw.includes('born') || raw.includes('collapse')) {
      return 'measurement';
    }
    if (raw.includes('gate') || raw.includes('pauli') || raw.includes('unitary') || raw.includes('gat-')) {
      return 'gates';
    }
    if (raw.includes('qubit') || raw.includes('qub-') || raw.includes('state') || raw.includes('bloch')) {
      return 'qubits';
    }
    return 'fundamentals';
  }, [conceptId, lessonId, moduleId]);

  const [activeConcept, setActiveConcept] = useState<QuantumConcept>(inferredConcept);

  // Sync if prop changes
  React.useEffect(() => {
    setActiveConcept(inferredConcept);
  }, [inferredConcept]);

  const renderVisualizer = () => {
    switch (activeConcept) {
      case 'superposition':
        return (
          <SuperpositionVisualizer
            key="vis-superposition"
            className={className}
            onExploreInLab={onExploreInLab}
          />
        );

      case 'measurement':
        return (
          <MeasurementVisualizer
            key="vis-measurement"
            className={className}
            circuit={circuit}
          />
        );

      case 'gates':
        return (
          <GateExplorerVisualizer
            key="vis-gates"
            className={className}
            initialGate={circuit?.gates?.[0]?.gateId === 'X' ? 'X' : circuit?.gates?.[0]?.gateId === 'Z' ? 'Z' : 'H'}
          />
        );

      case 'circuits':
        return (
          <CircuitPropagationVisualizer
            key="vis-circuits"
            className={className}
            circuit={circuit}
            onExploreInLab={onExploreInLab}
          />
        );

      case 'entanglement':
        return (
          <EntanglementVisualizer
            key="vis-entanglement"
            className={className}
            onExploreInLab={onExploreInLab}
          />
        );

      case 'algorithms':
        return (
          <AlgorithmFlowVisualizer
            key="vis-algorithms"
            className={className}
            initialAlgorithm={lessonId?.includes('grover') ? 'grover' : 'grover'}
            onExploreInLab={onExploreInLab}
          />
        );

      case 'wave': {
        const targetCircuit: Circuit = circuit || {
          id: 'wave-default',
          name: title || 'Lesson State',
          numberOfQubits: 1,
          gates: [{ id: 'g0', gateId: 'H', targetQubit: 0, position: 0 }],
          measurements: [0]
        };
        const simRes = simulateQuantumCircuit(targetCircuit, 1024);
        return (
          <WaveAmplitudeVisualizer
            key="vis-wave"
            className={className}
            result={simRes}
            circuit={targetCircuit}
            title={title || 'Wave / Amplitude View'}
            onExploreInLab={onExploreInLab}
          />
        );
      }

      case 'qubits':
      case 'fundamentals':
      default:
        return (
          <QubitStateVisualizer
            key="vis-qubits"
            className={className}
            title={title || 'Qubit State Representation & Quantum Vectors'}
          />
        );
    }
  };

  return (
    <div className="space-y-2" data-testid="visualization-selector">
      {renderVisualizer()}
    </div>
  );
};
