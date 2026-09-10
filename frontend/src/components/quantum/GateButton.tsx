import React from 'react';
import { QuantumGate } from '../../types/quantum';

interface GateButtonProps {
  gate: QuantumGate;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export const GateButton: React.FC<GateButtonProps> = ({
  gate,
  isSelected = false,
  onClick,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' 
    ? 'w-9 h-9 text-xs' 
    : 'w-11 h-11 text-sm';

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        type="button"
        title={`${gate.name} (${gate.symbol})`}
        className={`
          ${sizeClasses} rounded-lg font-mono font-bold border transition-all duration-150 flex flex-col items-center justify-center
          ${gate.color}
          ${isSelected ? 'ring-2 ring-teal-600 dark:ring-teal-400 scale-105 shadow-sm' : 'opacity-90 hover:opacity-100 hover:scale-105 active:scale-95'}
        `}
      >
        <span>{gate.symbol}</span>
      </button>

      {/* Mini hover tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 pointer-events-none w-48 p-2.5 rounded-lg bg-white dark:bg-[#151e2b] border border-slate-300 dark:border-[#2b3a4f] shadow-xl text-[11px] text-slate-700 dark:text-slate-300">
        <div className="font-semibold text-slate-900 dark:text-[#e6edf4] flex items-center justify-between">
          <span>{gate.name}</span>
          <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">{gate.numberOfQubits}Q</span>
        </div>
        <p className="mt-1 text-slate-600 dark:text-slate-400 leading-snug">{gate.description}</p>
        {gate.matrixLabel && (
          <div className="mt-1.5 p-1 rounded bg-slate-100 dark:bg-[#111823] font-mono text-[10px] text-teal-800 dark:text-teal-300 border border-slate-200 dark:border-[#223043]">
            {gate.matrixLabel}
          </div>
        )}
      </div>
    </div>
  );
};

