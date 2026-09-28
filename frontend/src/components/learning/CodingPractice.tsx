import React, { useState } from 'react';
import { CodingPracticeData } from '../../types/learning';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  BarChart3,
  Bot,
  Bug,
  Eye,
  BookOpen
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { askAITutor } from '../../services/api';

export interface CodingPracticeState {
  code: string;
  isSubmitted: boolean;
  isPassed: boolean;
  attempts: number;
  showHint: boolean;
  hintLevel: number;
  showSolution: boolean;
  validationFeedback?: {
    isValid: boolean;
    message: string;
  } | null;
  aiExplanation?: string;
  aiDebugFeedback?: string;
}

export interface CodingPracticeProps {
  moduleId?: string;
  lessonId?: string;
  activityId?: string;
  scopedKey?: string;
  practiceData?: CodingPracticeData;
  data?: CodingPracticeData;
  onComplete?: () => void;
}

export const CodingPractice: React.FC<CodingPracticeProps> = ({
  moduleId,
  lessonId,
  activityId = 'coding-practice-1',
  scopedKey,
  practiceData: propPracticeData,
  data: propData,
  onComplete
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [isAiDebugging, setIsAiDebugging] = useState(false);

  const practiceData = propPracticeData || propData;
  const progress = useProgress();
  const effectiveKey = scopedKey || `${moduleId || 'module'}/${lessonId || 'lesson'}/${activityId}`;

  if (!practiceData) return null;

  const defaultState: CodingPracticeState = {
    code: practiceData.starterCode,
    isSubmitted: false,
    isPassed: false,
    attempts: 0,
    showHint: false,
    hintLevel: 1,
    showSolution: false,
    validationFeedback: null
  };

  const currentState = progress.getActivityState<CodingPracticeState>(effectiveKey, defaultState);
  const code = currentState.code !== undefined ? currentState.code : practiceData.starterCode;
  const isSubmitted = currentState.isSubmitted;
  const isPassed = currentState.isPassed;
  const attempts = currentState.attempts || 0;
  const showHint = currentState.showHint;
  const hintLevel = currentState.hintLevel || 1;
  const showSolution = currentState.showSolution;
  const feedback = currentState.validationFeedback;

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedCode = e.target.value;
    progress.setActivityState<CodingPracticeState>(effectiveKey, {
      ...currentState,
      code: updatedCode,
      // Clear previous validation if user modifies code
      isSubmitted: false,
      validationFeedback: null
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key to insert 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);

      progress.setActivityState<CodingPracticeState>(effectiveKey, {
        ...currentState,
        code: newCode
      });

      // Maintain cursor position after Tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const validateCode = (studentCode: string): { isValid: boolean; message: string } => {
    const rules = practiceData.validationRules;
    const normalized = studentCode.toLowerCase().replace(/\s+/g, '');

    // 1. Check required operations flexibly (allowing variations in qubit notation)
    if (rules.requiredOperations && rules.requiredOperations.length > 0) {
      for (const op of rules.requiredOperations) {
        const normOp = op.toLowerCase().replace(/\s+/g, '');
        // Check if operation exists
        if (!normalized.includes(normOp)) {
          // Allow simplified forms: e.g. "qc.h(0)" or "h(0)"
          const bareOp = normOp.replace(/^qc\./, '');
          if (!normalized.includes(bareOp)) {
            return {
              isValid: false,
              message: rules.failureHint || `Missing required operation: ${op}`
            };
          }
        }
      }
    }

    // 2. Check forbidden operations if any
    if (rules.forbiddenOperations && rules.forbiddenOperations.length > 0) {
      for (const op of rules.forbiddenOperations) {
        const normOp = op.toLowerCase().replace(/\s+/g, '');
        if (normalized.includes(normOp)) {
          return {
            isValid: false,
            message: `Unexpected operation detected: "${op}". Please use only the concepts covered in this lesson.`
          };
        }
      }
    }

    return {
      isValid: true,
      message: rules.successMessage || 'Excellent work! Your quantum code correctly implements the circuit and satisfies all validation conditions.'
    };
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      const result = validateCode(code);
      const newAttempts = attempts + 1;

      progress.setActivityState<CodingPracticeState>(effectiveKey, {
        ...currentState,
        isSubmitted: true,
        isPassed: result.isValid,
        attempts: newAttempts,
        validationFeedback: result
      });

      if (result.isValid && onComplete) {
        onComplete();
      }
    }, 450);
  };

  const handleReset = () => {
    progress.setActivityState<CodingPracticeState>(effectiveKey, {
      code: practiceData.starterCode,
      isSubmitted: false,
      isPassed: false,
      attempts: 0,
      showHint: false,
      hintLevel: 1,
      showSolution: false,
      validationFeedback: null,
      aiExplanation: undefined,
      aiDebugFeedback: undefined
    });
  };

  const handleToggleHint = () => {
    progress.setActivityState<CodingPracticeState>(effectiveKey, {
      ...currentState,
      showHint: !showHint
    });
  };

  const handleNextHintTier = () => {
    const nextLevel = Math.min(hintLevel + 1, 3);
    progress.setActivityState<CodingPracticeState>(effectiveKey, {
      ...currentState,
      showHint: true,
      hintLevel: nextLevel
    });
  };

  const handleExplainCode = async () => {
    setIsAiExplaining(true);
    try {
      const res = await askAITutor({
        action: 'explain_code',
        codeContext: {
          code,
          taskDescription: practiceData.taskDescription
        },
        lessonContext: {
          moduleId: moduleId || 'module',
          lessonId: lessonId || 'lesson',
          currentTopic: practiceData.title
        }
      });

      progress.setActivityState<CodingPracticeState>(effectiveKey, {
        ...currentState,
        aiExplanation: res.reply
      });
    } catch (e) {
      console.warn('AI code explanation failed', e);
    } finally {
      setIsAiExplaining(false);
    }
  };

  const handleDebugCode = async () => {
    setIsAiDebugging(true);
    try {
      const res = await askAITutor({
        action: 'debug_code',
        codeContext: {
          code,
          taskDescription: practiceData.taskDescription
        },
        lessonContext: {
          moduleId: moduleId || 'module',
          lessonId: lessonId || 'lesson',
          currentTopic: practiceData.title
        }
      });

      progress.setActivityState<CodingPracticeState>(effectiveKey, {
        ...currentState,
        aiDebugFeedback: res.reply
      });
    } catch (e) {
      console.warn('AI debug code failed', e);
    } finally {
      setIsAiDebugging(false);
    }
  };

  const handleRevealSolution = () => {
    progress.setActivityState<CodingPracticeState>(effectiveKey, {
      ...currentState,
      showSolution: true
    });
  };

  const getActiveHintText = (): string => {
    if (hintLevel === 1) {
      return practiceData.hint || 'Review what quantum gate is needed to achieve the target transformation.';
    }
    if (hintLevel === 2) {
      return `Look at the validation hint: ${practiceData.validationRules.failureHint || 'Check your method names and qubit arguments.'}`;
    }
    return `Near-solution: Make sure to declare your circuit, apply the required gate (e.g. qc.h(0)), and measure with qc.measure(0, 0).`;
  };

  const lineCount = code.split('\n').length;

  return (
    <Card variant="default" className="overflow-hidden" data-testid="coding-practice-card">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <CardTitle className="text-sm sm:text-base">
            {practiceData.title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isPassed ? "emerald" : "amber"} size="sm">
            {isPassed ? "Practice Completed" : "Coding Challenge"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Task Objective */}
        <div className="space-y-1">
          <div className="text-xs font-bold text-[var(--fg-main)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Challenge Objective:</span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
            {practiceData.taskDescription}
          </p>
        </div>

        {/* Code Editor Container */}
        <div className="rounded-xl border border-[var(--border-card)] overflow-hidden bg-[var(--surface-sunken)] shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-card)] bg-[var(--surface-subtle)] text-[11px] font-mono text-[var(--fg-muted)]">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-1 text-[var(--fg-main)] font-bold">quantum_solution.py</span>
            </span>
            <span>Lines: {lineCount}</span>
          </div>

          <div className="relative flex">
            {/* Line numbers gutter */}
            <div className="select-none py-3 px-2 bg-[var(--surface-subtle)]/50 border-r border-[var(--border-card)] text-right font-mono text-xs text-[var(--fg-muted)] leading-relaxed min-w-[34px]">
              {Array.from({ length: Math.max(lineCount, 6) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code area */}
            <textarea
              data-testid="code-editor-textarea"
              aria-label="Quantum Python Code Editor"
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              rows={Math.max(lineCount, 7)}
              spellCheck={false}
              className="w-full p-3 font-mono text-xs sm:text-sm bg-transparent text-[var(--fg-main)] focus:outline-none resize-y leading-relaxed"
              placeholder="# Write your quantum code here..."
            />
          </div>
        </div>

        {/* Controls & Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              data-testid="run-code-btn"
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              {isRunning ? 'Validating & Simulating...' : 'Run & Check Code'}
            </Button>

            {/* AI Action: Explain This Code */}
            <Button
              variant="secondary"
              size="sm"
              data-testid="explain-code-btn"
              onClick={handleExplainCode}
              disabled={isAiExplaining || !code.trim()}
              leftIcon={<BookOpen className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />}
            >
              {isAiExplaining ? 'Explaining...' : 'Explain This Code'}
            </Button>

            {/* AI Action: Debug My Code */}
            <Button
              variant="secondary"
              size="sm"
              data-testid="debug-code-btn"
              onClick={handleDebugCode}
              disabled={isAiDebugging || !code.trim()}
              leftIcon={<Bug className="w-3.5 h-3.5 text-amber-500" />}
            >
              {isAiDebugging ? 'Inspecting...' : 'Debug My Code'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              data-testid="reset-code-btn"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Starter Code
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="hint-toggle-btn"
              onClick={handleToggleHint}
              className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-main)] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
              <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
            </button>
          </div>
        </div>

        {/* 3-Tier Hint Accordion */}
        {showHint && (
          <div 
            data-testid="hint-box" 
            className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 text-xs text-[var(--fg-main)] leading-relaxed space-y-2 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-sciteal-800 dark:text-sciteal-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3 h-3" />
                <span>Pedagogical Hint Tier {hintLevel} of 3</span>
              </span>
              {hintLevel < 3 && (
                <button
                  type="button"
                  onClick={handleNextHintTier}
                  className="text-xs text-sciteal-700 dark:text-sciteal-300 hover:underline font-semibold cursor-pointer"
                >
                  Need more help? (Tier {hintLevel + 1}) →
                </button>
              )}
            </div>

            <p>{getActiveHintText()}</p>

            {hintLevel >= 2 && !showSolution && practiceData.solutionCode && (
              <div className="pt-2 border-t border-sciteal-500/20 flex justify-end">
                <button
                  type="button"
                  onClick={handleRevealSolution}
                  className="text-[11px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg-main)] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Reveal Reference Solution</span>
                </button>
              </div>
            )}

            {showSolution && practiceData.solutionCode && (
              <div className="p-3 rounded-lg bg-[var(--surface-card)] border border-sciteal-500/30 font-mono text-xs text-[var(--fg-main)] overflow-x-auto whitespace-pre">
                {practiceData.solutionCode}
              </div>
            )}
          </div>
        )}

        {/* AI Code Explanation Box */}
        {currentState.aiExplanation && (
          <div 
            data-testid="ai-code-explanation-box"
            className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-sciteal-500/40 space-y-2 animate-in fade-in duration-200 shadow-sm"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-sciteal-800 dark:text-sciteal-300 font-mono">
              <Bot className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
              <span>AI Quantum Tutor — Code Line Breakdown</span>
            </div>
            <div className="text-xs text-[var(--fg-main)] leading-relaxed whitespace-pre-wrap">
              {currentState.aiExplanation}
            </div>
          </div>
        )}

        {/* AI Debugger Box */}
        {currentState.aiDebugFeedback && (
          <div 
            data-testid="ai-code-debugger-box"
            className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-amber-500/40 space-y-2 animate-in fade-in duration-200 shadow-sm"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 font-mono">
              <Bug className="w-4 h-4 text-amber-500" />
              <span>AI Quantum Tutor — Debugging Inspection</span>
            </div>
            <div className="text-xs text-[var(--fg-main)] leading-relaxed whitespace-pre-wrap">
              {currentState.aiDebugFeedback}
            </div>
          </div>
        )}

        {/* Validation Feedback & Simulated Execution Results */}
        {isSubmitted && feedback && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Feedback Banner */}
            <div 
              data-testid="validation-feedback"
              className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 shadow-sm ${
                feedback.isValid
                  ? 'bg-emerald-500/15 border-emerald-600 dark:border-emerald-500 text-[var(--fg-main)]'
                  : 'bg-rose-500/15 border-rose-600 dark:border-rose-500 text-[var(--fg-main)]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {feedback.isValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Correct Circuit Implementation!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Check Your Circuit Operations</span>
                  </>
                )}
              </div>
              <p className="text-xs">{feedback.message}</p>
            </div>

            {/* Simulated Execution Histogram if valid */}
            {feedback.isValid && practiceData.simulatedRun && (
              <div 
                data-testid="simulated-run-output" 
                className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--fg-main)] flex items-center gap-1.5 font-mono">
                    <BarChart3 className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                    <span>Statevector Simulation Run (1,024 Shots)</span>
                  </span>
                  <Badge variant="teal" size="sm">
                    {practiceData.simulatedRun.expectedState}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {Object.entries(practiceData.simulatedRun.counts).map(([state, count]) => {
                    const pct = Math.round((count / 1024) * 100);
                    return (
                      <div key={state} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold">|{state}⟩</span>
                          <span className="text-[var(--fg-muted)]">{count} shots ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--surface-card)] overflow-hidden border border-[var(--border-card)]">
                          <div 
                            className="h-full bg-sciteal-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-[var(--fg-muted)] leading-relaxed italic border-t border-[var(--border-card)] pt-2">
                  {practiceData.simulatedRun.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer Identity */}
        <div className="text-[11px] font-mono text-[var(--fg-muted)] flex items-center justify-between pt-1 border-t border-[var(--border-card)]">
          <span>Targeted Coding Activity (Attempts: {attempts})</span>
          <span data-testid="scoped-activity-key" className="text-sciteal-700 dark:text-sciteal-400 font-bold">{effectiveKey}</span>
        </div>
      </CardContent>
    </Card>
  );
};
