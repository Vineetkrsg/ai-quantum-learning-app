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
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100/90 dark:bg-[#151e2b] rounded-xl border border-slate-200 dark:border-[#223043]">
      {/* Left: Circuit modifications & Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-white dark:bg-[#0c111a] px-2 py-1 rounded-lg border border-slate-300 dark:border-[#223043] text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-mono">Qubits:</span>
          <span className="font-bold text-slate-900 dark:text-slate-100 font-mono px-1">{qubitCount}</span>
          <button
            onClick={onRemoveQubit}
            disabled={qubitCount <= 1}
            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2636]"
            title="Remove Qubit wire"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={onAddQubit}
            disabled={qubitCount >= 5}
            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1b2636]"
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
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1b2636] hover:bg-slate-50 dark:hover:bg-[#223145] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#2b3a4f] transition-colors flex items-center gap-1 font-medium"
          >
            <Wand2 className="w-3 h-3 text-teal-700 dark:text-teal-400" />
            <span>Bell State</span>
          </button>
          <button
            onClick={() => onLoadPreset('superposition-demo')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1b2636] hover:bg-slate-50 dark:hover:bg-[#223145] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#2b3a4f] transition-colors font-medium"
          >
            Superposition
          </button>
        </div>
      </div>

      {/* Right: Shots & Execution */}
      <div className="flex items-center gap-3">
        {/* Shots selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="hidden sm:inline">Shots:</span>
          <select
            value={shots}
            onChange={(e) => onShotsChange(Number(e.target.value))}
            className="bg-white dark:bg-[#0c111a] border border-slate-300 dark:border-[#223043] text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-teal-500 font-mono font-medium"
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
          leftIcon={<Play className="w-4 h-4 fill-current" />}
        >
          Run Circuit
        </Button>
      </div>
    </div>
  );
};

