import React from 'react';
import { Circuit } from '../../../types/quantum';
import { Button } from '../../ui/Button';
import { Play, Sparkles, HelpCircle, Layers } from 'lucide-react';

interface DemoCircuitCanvasProps {
  circuit: Circuit;
  onRunSimulation: () => void;
  isRunning: boolean;
  onInsertGate?: (gateId: string) => void;
}

export const DemoCircuitCanvas: React.FC<DemoCircuitCanvasProps> = ({
  circuit,
  onRunSimulation,
  isRunning
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Visual Explanation of Circuit Anatomy */}
      <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sciteal-700 dark:text-sciteal-300 uppercase tracking-wider font-mono">
          <Layers className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <span>Understanding Circuit Anatomy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1">
            <span className="font-mono font-bold text-sciteal-700 dark:text-sciteal-300">q[0] = Qubit Wire</span>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Our quantum information carrier. Initialized in the ground state |0⟩.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1">
            <span className="font-mono font-bold text-teal-700 dark:text-teal-300">[ H ] = Hadamard Gate</span>
            <p className="text-[11px] text-[var(--fg-muted)]">
              The operation we apply. Rotates |0⟩ into equal superposition (|0⟩ + |1⟩)/√2.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1">
            <span className="font-mono font-bold text-amber-700 dark:text-amber-300">[ M ] = Measurement</span>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Sensor that reads the final state, collapsing the wave into classical 0 or 1.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Circuit Canvas */}
      <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 border border-[var(--border-card)] shadow-inner space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">Live Circuit: {circuit.name}</span>
          <span className="font-mono text-sciteal-400">1 Qubit • 1,024 Shots</span>
        </div>

        {/* Qubit Wire Render */}
        <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-4 overflow-x-auto">
          {/* Qubit Label */}
          <div className="flex items-center gap-2 select-none flex-shrink-0">
            <span className="font-mono text-xs font-bold text-sciteal-400">q[0]</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-semibold">
              |0⟩
            </span>
          </div>

          {/* Wire with operations */}
          <div className="flex-1 relative flex items-center min-w-[280px]">
            {/* Horizontal circuit wire line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-700" />

            {/* Sequence of gates */}
            <div className="relative z-10 flex items-center justify-around w-full px-4">
              {/* Gate 1: H */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-xl bg-teal-600 border-2 border-teal-400 text-white font-mono font-bold text-sm flex items-center justify-center shadow-lg shadow-teal-500/20">
                  H
                </div>
                <span className="text-[10px] font-mono text-slate-400">t = 0</span>
              </div>

              {/* Arrow transition */}
              <div className="text-slate-600 text-xs font-mono">───►</div>

              {/* Gate 2: M */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-xl bg-amber-600 border-2 border-amber-400 text-white font-mono font-bold text-sm flex items-center justify-center shadow-lg shadow-amber-500/20">
                  M
                </div>
                <span className="text-[10px] font-mono text-slate-400">t = 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action: Run Experiment */}
      <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-[var(--fg-main)]">
            Ready to Simulate
          </h4>
          <p className="text-xs text-[var(--fg-muted)]">
            Execute the circuit using the exact custom state-vector simulator for 1,024 shots.
          </p>
        </div>

        <Button
          variant="quantum"
          size="md"
          onClick={onRunSimulation}
          isLoading={isRunning}
          leftIcon={<Play className="w-4 h-4 fill-current" />}
          className="font-bold whitespace-nowrap shadow-md"
        >
          Run Experiment
        </Button>
      </div>
    </div>
  );
};
