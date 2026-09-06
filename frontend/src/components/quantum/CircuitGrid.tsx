import React from 'react';
import { Circuit, GateOperation, QuantumGate } from '../../types/quantum';
import { QUANTUM_GATES } from '../../mock/gatesData';
import { Trash2 } from 'lucide-react';

interface CircuitGridProps {
  circuit: Circuit;
  selectedGate: QuantumGate | null;
  onPlaceGate: (qubitIndex: number, position: number) => void;
  onRemoveGate: (operationId: string) => void;
  totalSteps?: number;
}

export const CircuitGrid: React.FC<CircuitGridProps> = ({
  circuit,
  selectedGate,
  onPlaceGate,
  onRemoveGate,
  totalSteps = 6,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i);
  const qubits = Array.from({ length: circuit.numberOfQubits }, (_, i) => i);

  // Helper to find gate operation at a specific qubit and step
  const getGateAt = (qubitIndex: number, stepIndex: number): GateOperation | undefined => {
    return circuit.gates.find(
      (g) => g.position === stepIndex && (g.targetQubit === qubitIndex || g.controlQubit === qubitIndex)
    );
  };

  return (
    <div className="overflow-x-auto p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-300 dark:border-slate-800 shadow-inner">
      {/* Time Step Header */}
      <div className="flex items-center mb-2 pl-24">
        {steps.map((step) => (
          <div
            key={step}
            className="w-16 text-center font-mono text-[10px] text-slate-600 dark:text-slate-500 font-semibold"
          >
            t = {step}
          </div>
        ))}
      </div>

      {/* Qubit Wires */}
      <div className="space-y-4">
        {qubits.map((qubitIndex) => (
          <div key={qubitIndex} className="flex items-center group relative">
            {/* Qubit Label & Initial State */}
            <div className="w-24 flex items-center gap-2 pr-3 select-none flex-shrink-0">
              <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400">q[{qubitIndex}]</span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-semibold">
                |0⟩
              </span>
            </div>

            {/* Wire Line with Slots */}
            <div className="relative flex items-center">
              {/* Continuous horizontal circuit wire */}
              <div 
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-600 dark:bg-slate-700 pointer-events-none"
                style={{ width: `${totalSteps * 64}px` }}
              />

              {/* Slot grid */}
              <div className="flex items-center">
                {steps.map((stepIndex) => {
                  const operation = getGateAt(qubitIndex, stepIndex);
                  const gateDef = operation ? QUANTUM_GATES.find((g) => g.id === operation.gateId) : null;
                  const isControl = operation?.controlQubit === qubitIndex;
                  const isTarget = operation?.targetQubit === qubitIndex;

                  return (
                    <div
                      key={stepIndex}
                      className="w-16 h-14 flex items-center justify-center relative z-10"
                    >
                      {operation ? (
                        <div className="relative group/gate">
                          {isControl ? (
                            /* CNOT Control dot */
                            <div className="w-4 h-4 rounded-full bg-purple-500 dark:bg-purple-400 border-2 border-slate-950 flex items-center justify-center shadow-md">
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                          ) : (
                            /* Target gate or single gate */
                            <button
                              onClick={() => onRemoveGate(operation.id)}
                              title={`Click to remove ${gateDef?.name || operation.gateId}`}
                              className={`
                                w-10 h-10 rounded-lg font-mono font-bold text-xs border flex items-center justify-center shadow-lg transition-transform hover:scale-105
                                ${gateDef?.color || 'bg-slate-800 text-white border-slate-700'}
                              `}
                            >
                              {gateDef?.symbol || operation.gateId}
                            </button>
                          )}

                          {/* Remove button on hover */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveGate(operation.id);
                            }}
                            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover/gate:opacity-100 transition-opacity shadow"
                            title="Remove gate"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        /* Empty Wire Slot */
                        <button
                          onClick={() => onPlaceGate(qubitIndex, stepIndex)}
                          title={selectedGate ? `Place ${selectedGate.name} here` : 'Click with selected gate to place'}
                          className={`
                            w-10 h-10 rounded-lg border border-dashed transition-all duration-150 flex items-center justify-center
                            ${selectedGate 
                              ? 'border-cyan-500/60 hover:border-cyan-500 hover:bg-cyan-500/10 cursor-pointer' 
                              : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/40 cursor-default'}
                          `}
                        >
                          <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">+</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
