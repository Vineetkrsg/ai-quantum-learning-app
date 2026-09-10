import React from 'react';
import { AssessmentData } from '../../types/learning';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Trophy, CheckCircle2, XCircle, HelpCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export interface QuickAssessmentState {
  selectedOptionId: string | null;
  isSubmitted: boolean;
  isCorrect: boolean;
}

const DEFAULT_STATE: QuickAssessmentState = {
  selectedOptionId: null,
  isSubmitted: false,
  isCorrect: false
};

interface QuickAssessmentProps {
  moduleId?: string;
  lessonId?: string;
  activityId?: string;
  scopedKey?: string;
  assessment: AssessmentData;
  onPass?: () => void;
}

export const QuickAssessment: React.FC<QuickAssessmentProps> = ({
  moduleId,
  lessonId,
  activityId = 'assessment-1',
  scopedKey,
  assessment,
  onPass
}) => {
  const progress = useProgress();
  const effectiveKey = scopedKey || `${moduleId || 'module'}/${lessonId || 'assessment'}/${activityId}`;
  const currentState = progress.getActivityState<QuickAssessmentState>(effectiveKey, DEFAULT_STATE);

  const selectedOptionId = currentState.selectedOptionId;
  const isSubmitted = currentState.isSubmitted;
  const isCorrect = selectedOptionId === assessment.correctOptionId;

  const setSelectedOptionId = (id: string | null) => {
    progress.setActivityState<QuickAssessmentState>(effectiveKey, {
      ...currentState,
      selectedOptionId: id
    });
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    const correct = selectedOptionId === assessment.correctOptionId;
    progress.setActivityState<QuickAssessmentState>(effectiveKey, {
      selectedOptionId,
      isSubmitted: true,
      isCorrect: correct
    });
    if (correct && onPass) {
      onPass();
    }
  };

  const handleReset = () => {
    progress.setActivityState<QuickAssessmentState>(effectiveKey, DEFAULT_STATE);
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <CardTitle className="text-sm sm:text-base">Quick Assessment</CardTitle>
        </div>
        <Badge variant="amber" size="sm">
          Test Your Understanding
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Question Prompt */}
        <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
          {assessment.question}
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {assessment.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let optionStyles = 'border-slate-800 bg-slate-900/70 text-slate-200 hover:border-slate-700 hover:bg-slate-850';

            if (isSubmitted) {
              if (opt.id === assessment.correctOptionId) {
                optionStyles = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200 font-medium';
              } else if (isSelected && !isCorrect) {
                optionStyles = 'border-rose-500/60 bg-rose-950/30 text-rose-200';
              }
            } else if (isSelected) {
              optionStyles = 'border-cyan-500 bg-cyan-950/40 text-cyan-200 font-medium shadow-sm shadow-cyan-500/10';
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all duration-150 flex items-center justify-between gap-3 ${optionStyles}`}
              >
                <span>{opt.text}</span>
                {isSubmitted && opt.id === assessment.correctOptionId && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isSubmitted && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 animate-in fade-in duration-200 ${
            isCorrect 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-rose-400" />
                  <span>Not Quite Right</span>
                </>
              )}
            </div>

            <p>
              {isCorrect 
                ? (assessment.explanationCorrect || assessment.explanation)
                : (selectedOptionId && assessment.explanationIncorrect && typeof assessment.explanationIncorrect === 'object' 
                    ? assessment.explanationIncorrect[selectedOptionId] 
                    : typeof assessment.explanationIncorrect === 'string' 
                    ? assessment.explanationIncorrect 
                    : assessment.explanation) || 'Review the explanation and try again!'}
            </p>
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          {!isSubmitted ? (
            <Button
              variant="quantum"
              size="sm"
              disabled={!selectedOptionId}
              onClick={handleSubmit}
            >
              Check Answer
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              {!isCorrect && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Try Again
                </Button>
              )}
              {isCorrect && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Assessment Passed (+50 XP)</span>
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
