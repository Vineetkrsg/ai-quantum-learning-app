import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Cpu, ArrowRight, Play, Layers } from 'lucide-react';

export const QuickLabCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card variant="interactive" className="h-full flex flex-col justify-between overflow-hidden relative">
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Interactive Quantum Lab</span>
          </CardTitle>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
            Studio
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-slate-400 leading-relaxed">
          Design multi-qubit quantum circuits with drag-and-drop gates, inspect Qiskit Python code, and observe probability collapses.
        </p>

        {/* Mini Wire Preview Art */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 w-10">q[0] ─</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px]">H</span>
            <span className="text-slate-600">───────●───────</span>
            <span className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px]">⊚</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 w-10">q[1] ─</span>
            <span className="text-slate-600">───────</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px]">⊕</span>
            <span className="text-slate-600">───────</span>
            <span className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px]">⊚</span>
          </div>
        </div>
      </CardContent>

      <div className="p-4 bg-slate-950/40 border-t border-slate-800/60 rounded-b-xl flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono">Bell State Loaded</span>
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
