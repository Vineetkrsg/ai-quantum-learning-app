import React, { useState } from 'react';
import { PracticeTaskData } from '../../types/learning';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Zap, HelpCircle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface PracticeChallengeProps {
  practiceData: PracticeTaskData;
  onComplete?: () => void;
}

export const PracticeChallenge: React.FC<PracticeChallengeProps> = ({
  practiceData,
  onComplete
}) => {
  const [selectedGateSymbol, setSelectedGateSymbol] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const selectedGate = practiceData.availableGates.find((g) => g.symbol === selectedGateSymbol);
  const isCorrect = selectedGate?.isCorrect ?? false;

  const handleSelect = (symbol: string) => {
    setSelectedGateSymbol(symbol);
    const gate = practiceData.availableGates.find((g) => g.symbol === symbol);
    if (gate?.isCorrect && onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    setSelectedGateSymbol(null);
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-300/80 dark:border-slate-800/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-400" />
          <CardTitle className="text-sm sm:text-base">{practiceData.title}</CardTitle>
        </div>
        <Badge variant="indigo" size="sm">
          Hands-On Practice
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {practiceData.instruction}
        </p>

        {/* Mini Wire with Missing Slot */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 overflow-x-auto shadow-inner">
          <div className="flex items-center justify-center gap-2 min-w-[320px] font-mono text-xs">
            <span className="text-cyan-700 dark:text-cyan-400 font-bold">{practiceData.wireTemplate.qubitLabel}</span>
            <span className="text-slate-500 dark:text-slate-600">{practiceData.wireTemplate.beforeGate}</span>

            {/* The Target Slot */}
            <div className={`
              w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-200
              ${selectedGateSymbol 
                ? isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-md shadow-emerald-500/20'
                  : 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-300'
                : 'border-dashed border-cyan-500/60 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 animate-pulse'}
            `}>
              {selectedGateSymbol || '?'}
            </div>

            <span className="text-slate-700 dark:text-slate-400 font-semibold">{practiceData.wireTemplate.afterGate}</span>
          </div>
        </div>

        {/* Gate Selection Palette */}
        <div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2">
            Select a Gate to Place in the Circuit Wire:
          </div>
          <div className="flex flex-wrap gap-3">
            {practiceData.availableGates.map((gate) => {
              const isPicked = selectedGateSymbol === gate.symbol;
              return (
                <button
                  key={gate.symbol}
                  onClick={() => handleSelect(gate.symbol)}
                  className={`
                    px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all
                    ${isPicked
                      ? gate.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-500/30 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/50'
                        : 'bg-rose-50 dark:bg-rose-500/30 border-rose-500 text-rose-900 dark:text-rose-200'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500/50 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-slate-200 dark:hover:bg-slate-850'}
                  `}
                >
                  <span className="text-sm">{gate.symbol}</span>
                  <span className="text-[11px] font-sans text-slate-500 dark:text-slate-400">({gate.name})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Message */}
        {selectedGateSymbol && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-200 ${
            isCorrect 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/50 text-emerald-900 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/50 text-rose-900 dark:text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Success! Circuit Complete</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Incorrect Gate Placement</span>
                </>
              )}
            </div>
            <p>
              {isCorrect ? practiceData.successExplanation : 'That gate does not meet the challenge criteria. Review the hint below.'}
            </p>
          </div>
        )}

        {/* Hint Accordion */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{showHint ? 'Hide Hint' : 'Need a hint for this challenge?'}</span>
          </button>

          {selectedGateSymbol && !isCorrect && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3 h-3" />}
            >
              Reset Slot
            </Button>
          )}
        </div>

        {showHint && (
          <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-300 dark:border-cyan-500/30 text-xs text-cyan-950 dark:text-cyan-200 leading-relaxed animate-in fade-in duration-150">
            {practiceData.hint}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
