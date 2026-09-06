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
          ${isSelected ? 'ring-2 ring-cyan-400 scale-105 shadow-md shadow-cyan-500/30' : 'opacity-90 hover:opacity-100 hover:scale-105 active:scale-95'}
        `}
      >
        <span>{gate.symbol}</span>
      </button>

      {/* Mini hover tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 pointer-events-none w-48 p-2 rounded-lg bg-slate-950 border border-slate-700/80 shadow-2xl text-[11px] text-slate-300">
        <div className="font-semibold text-white flex items-center justify-between">
          <span>{gate.name}</span>
          <span className="text-[10px] text-cyan-400 font-mono">{gate.numberOfQubits}Q</span>
        </div>
        <p className="mt-1 text-slate-400 leading-snug">{gate.description}</p>
        {gate.matrixLabel && (
          <div className="mt-1.5 p-1 rounded bg-slate-900 font-mono text-[10px] text-cyan-300 border border-slate-800">
            {gate.matrixLabel}
          </div>
        )}
      </div>
    </div>
  );
};
