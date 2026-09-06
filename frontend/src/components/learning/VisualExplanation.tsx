import React from 'react';
import { VisualStep } from '../../types/learning';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';

interface VisualExplanationProps {
  title: string;
  description: string;
  steps: VisualStep[];
}

export const VisualExplanation: React.FC<VisualExplanationProps> = ({
  title,
  description,
  steps
}) => {
  const colorMap = {
    slate: 'bg-slate-900/90 border-slate-800 text-slate-300',
    cyan: 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300',
    indigo: 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300',
    emerald: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
    purple: 'bg-purple-950/40 border-purple-500/40 text-purple-300',
    amber: 'bg-amber-950/40 border-amber-500/40 text-amber-300',
  };

  const badgeColorMap = {
    slate: 'bg-slate-800 text-slate-400',
    cyan: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{title}</span>
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-500">Visual Intuition</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col justify-between">
              {/* Step Card */}
              <div className={`p-4 rounded-xl border flex-1 space-y-3 transition-all duration-200 hover:scale-[1.02] ${colorMap[step.colorVariant]}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {step.label}
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${badgeColorMap[step.colorVariant]}`}>
                    Step {idx + 1}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
                    {step.stateNotation}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting arrow on desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 items-center justify-center text-slate-400 shadow-md">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
