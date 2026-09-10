import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Cpu, ArrowRight, Play, Layers } from 'lucide-react';

export const QuickLabCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card variant="interactive" className="h-full flex flex-col justify-between overflow-hidden relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            <Cpu className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span>Interactive Quantum Lab</span>
          </CardTitle>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-card)] text-[var(--fg-muted)] font-semibold">
            Studio
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
          Design multi-qubit quantum circuits with drag-and-drop gates, inspect Qiskit Python code, and observe probability collapses.
        </p>

        {/* Mini Wire Preview Art */}
        <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-2 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-sciteal-700 dark:text-sciteal-400 font-semibold w-10">q[0] ─</span>
            <span className="px-1.5 py-0.5 rounded bg-sciteal-500/20 text-sciteal-800 dark:text-sciteal-300 border border-sciteal-500/40 text-[10px] font-bold">H</span>
            <span className="text-[var(--circuit-wire)] opacity-70">───────●───────</span>
            <span className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[9px]">⊚</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sciteal-700 dark:text-sciteal-400 font-semibold w-10">q[1] ─</span>
            <span className="text-[var(--circuit-wire)] opacity-70">───────</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-500/20 text-[var(--fg-main)] border border-[var(--border-card)] text-[10px] font-bold">⊕</span>
            <span className="text-[var(--circuit-wire)] opacity-70">───────</span>
            <span className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[9px]">⊚</span>
          </div>
        </div>
      </CardContent>

      <div className="p-4 bg-[var(--surface-sunken)] border-t border-[var(--border-card)] rounded-b-xl flex items-center justify-between">
        <span className="text-[11px] text-[var(--fg-muted)] font-mono">Bell State Loaded</span>
        <Button
          variant="quantum"
          size="sm"
          onClick={() => navigate('/lab')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Open Circuit Studio
        </Button>
      </div>
    </Card>
  );
};
