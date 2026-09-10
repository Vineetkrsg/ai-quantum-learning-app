import React from 'react';
import { QuantumGate } from '../../types/quantum';
import { GateButton } from './GateButton';
import { Card } from '../ui/Card';

interface GatePaletteProps {
  gates: QuantumGate[];
  selectedGate: QuantumGate | null;
  onSelectGate: (gate: QuantumGate) => void;
}

export const GatePalette: React.FC<GatePaletteProps> = ({
  gates,
  selectedGate,
  onSelectGate,
}) => {
  const categories = [
    { id: 'single', label: 'Single Qubit' },
    { id: 'phase', label: 'Phase Rotations' },
    { id: 'two-qubit', label: 'Multi-Qubit' },
    { id: 'measure', label: 'Measurement' },
  ];

  return (
    <Card variant="default" className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Gate Palette
        </h4>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {selectedGate ? `Selected: ${selectedGate.name}` : 'Select a gate then click a wire slot'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const categoryGates = gates.filter((g) => g.category === cat.id);
          if (categoryGates.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                {cat.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryGates.map((gate) => (
                  <GateButton
                    key={gate.id}
                    gate={gate}
                    isSelected={selectedGate?.id === gate.id}
                    onClick={() => onSelectGate(gate)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>

  );
};
