import React from 'react';
import { Button } from '../ui/Button';
import { Play, RotateCcw, Plus, Minus, Wand2 } from 'lucide-react';

interface CircuitControlsProps {
  onRun: () => void;
  onClear: () => void;
  onAddQubit: () => void;
  onRemoveQubit: () => void;
  onLoadPreset: (presetId: string) => void;
  qubitCount: number;
  isRunning: boolean;
  shots: number;
  onShotsChange: (shots: number) => void;
}

export const CircuitControls: React.FC<CircuitControlsProps> = ({
  onRun,
  onClear,
  onAddQubit,
  onRemoveQubit,
  onLoadPreset,
  qubitCount,
  isRunning,
  shots,
  onShotsChange
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
      {/* Left: Circuit modifications & Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 font-mono">Qubits:</span>
          <span className="font-bold text-white font-mono px-1">{qubitCount}</span>
          <button
            onClick={onRemoveQubit}
            disabled={qubitCount <= 1}
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-800"
            title="Remove Qubit wire"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={onAddQubit}
            disabled={qubitCount >= 5}
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-800"
            title="Add Qubit wire"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Presets dropdown / buttons */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-500 text-[11px] hidden sm:inline">Presets:</span>
          <button
            onClick={() => onLoadPreset('bell-state')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1"
          >
            <Wand2 className="w-3 h-3 text-cyan-400" />
            <span>Bell State</span>
          </button>
          <button
            onClick={() => onLoadPreset('superposition-demo')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            Superposition
          </button>
        </div>
      </div>

      {/* Right: Shots & Execution */}
      <div className="flex items-center gap-3">
        {/* Shots selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hidden sm:inline">Shots:</span>
          <select
            value={shots}
            onChange={(e) => onShotsChange(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value={256}>256</option>
            <option value={1024}>1024</option>
            <option value={4096}>4096</option>
          </select>
        </div>

        {/* Clear Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Clear
        </Button>

        {/* Run Circuit Button */}
        <Button
          variant="quantum"
          size="sm"
          onClick={onRun}
          isLoading={isRunning}
          leftIcon={<Play className="w-4 h-4 fill-slate-950" />}
        >
          Run Circuit
        </Button>
      </div>
    </div>
  );
};
