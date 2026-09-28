import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SuggestedPrompt, TutorContext, GeneratedQuestionModel } from '../../types/tutor';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Atom, 
  Lightbulb, 
  Code, 
  Cpu, 
  HelpCircle, 
  CheckCircle2, 
  XCircle,
  Zap,
  RotateCcw
} from 'lucide-react';
import { askAITutor } from '../../services/api';

interface TutorPanelProps {
  context?: TutorContext;
  compact?: boolean;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
  onTypingStateChange?: (isTyping: boolean) => void;
}

export const TutorPanel: React.FC<TutorPanelProps> = ({
  context,
  compact = false,
  externalPrompt = null,
  onClearExternalPrompt,
  onTypingStateChange
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'tutor',
      text: "Hello! I am your AI Quantum Tutor. I can help clarify quantum mechanics postulates, guide your circuit design, debug state vectors, or explain mathematical bra-ket formalism. What concept would you like to explore?",
      timestamp: 'Just now',
      referencedConcepts: ['Superposition', 'Bloch Sphere', 'Entanglement'],
      provider: 'mock'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastProvider, setLastProvider] = useState<'mock' | 'gemini'>('mock');
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, { selectedId: string; isCorrect: boolean }>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    onTypingStateChange?.(isTyping);
  }, [isTyping, onTypingStateChange]);


  const suggestedPrompts: SuggestedPrompt[] = [
    {
      id: 'sp-1',
      label: 'Explain Bell State',
      query: 'How do Hadamard and CNOT gates create the maximally entangled Bell state?',
      category: 'intuition'
    },
    {
      id: 'sp-2',
      label: 'What is Superposition?',
      query: 'What is the physical meaning of quantum superposition vs classical randomness?',
      category: 'intuition'
    },
    {
      id: 'sp-3',
      label: 'Bloch Sphere Angles',
      query: 'How are the theta and phi angles mapped on the Bloch sphere for state |+⟩?',
      category: 'math'
    },
    {
      id: 'sp-4',
      label: 'Phase Kickback',
      query: 'How does phase kickback work in the Deutsch-Jozsa and Grover algorithms?',
      category: 'circuit'
    }
  ];

  const handleSend = async (textToSend?: string, actionType: 'chat' | 'explain_circuit' | 'explain_code' | 'debug_code' | 'hint' | 'generate_question' = 'chat') => {
    const query = textToSend !== undefined ? textToSend : input;
    if (!query.trim() && actionType === 'chat') return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query || (actionType === 'explain_circuit' ? 'Explain this circuit' : actionType === 'explain_code' ? 'Explain this code' : actionType === 'debug_code' ? 'Debug my code' : actionType === 'generate_question' ? 'Give me a practice question' : 'Give me a hint'),
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (textToSend === undefined) setInput('');
    setIsTyping(true);

    try {
      const response = await askAITutor({
        message: query,
        action: actionType,
        circuitContext: context?.circuitContext || (context?.qubitCount ? {
          numberOfQubits: context.qubitCount,
          gateCount: context.gateCount || 0,
          circuitName: context.currentCircuitName,
          gates: context.gates
        } : undefined),
        codeContext: context?.codeContext || (context?.currentCode ? {
          code: context.currentCode,
          language: 'python'
        } : undefined),
        simulationResult: context?.simulationResult,
        lessonContext: context?.moduleId ? {
          moduleId: context.moduleId,
          moduleTitle: context.moduleTitle,
          lessonId: context.lessonId,
          lessonTitle: context.lessonTitle || context.activeLessonTitle,
          currentTopic: context.currentTopic,
          activityId: context.activityId
        } : (context?.activeLessonTitle ? {
          moduleId: 'module',
          lessonTitle: context.activeLessonTitle
        } : undefined),
        history: messages.slice(-4).map(m => ({
          id: m.id,
          sender: m.sender,
          text: m.text,
          timestamp: m.timestamp
        }))
      });

      setLastProvider(response.provider);

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'tutor',
        text: response.reply,
        timestamp: 'Just now',
        referencedConcepts: response.referencedConcepts,
        provider: response.provider,
        generatedQuestion: response.generatedQuestion,
        debugHints: response.debugHints
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'tutor',
        text: "I am ready to help you analyze your quantum circuit, state vectors, or bra-ket calculations.",
        timestamp: 'Just now',
        provider: 'mock'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      handleSend(externalPrompt, 'chat');
      onClearExternalPrompt?.();
    }
  }, [externalPrompt]);

  const handleAnswerOption = (questionId: string, optionId: string, isCorrect: boolean) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: { selectedId: optionId, isCorrect }
    }));
  };

  return (
    <Card variant="default" className={`flex flex-col ${compact ? 'h-[520px]' : 'h-[640px]'}`}>
      <CardHeader className="py-3 px-4 sm:px-5 border-b border-[var(--border-card)] bg-[var(--surface-sunken)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/30 flex items-center justify-center font-bold shrink-0">
            <Bot className="w-4 h-4 text-sciteal-700 dark:text-sciteal-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-sm font-semibold text-[var(--fg-main)]">AI Quantum Tutor</CardTitle>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border-sciteal-500/30 whitespace-nowrap shrink-0">
                Pedagogical Engine
              </span>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)] truncate">Pedagogical Assistant with Quantum Context</p>
          </div>
        </div>
      </CardHeader>

      {/* Quick Action Shortcuts */}
      <div className="px-4 py-2 bg-[var(--surface-card)] border-b border-[var(--border-card)] overflow-x-auto flex items-center gap-1.5 flex-nowrap">
        <span className="text-[10px] uppercase font-mono text-[var(--fg-muted)] flex items-center gap-1 flex-shrink-0 font-semibold mr-1">
          <Zap className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />
          Actions:
        </span>
        <button
          onClick={() => handleSend('Explain this circuit step-by-step.', 'explain_circuit')}
          className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface-sunken)] hover:bg-[var(--surface-subtle)] text-[var(--fg-main)] border border-[var(--border-card)] hover:border-sciteal-500/50 whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 font-medium"
        >
          <Atom className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />
          Explain Circuit
        </button>
        <button
          onClick={() => handleSend('Explain the Qiskit code.', 'explain_code')}
          className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface-sunken)] hover:bg-[var(--surface-subtle)] text-[var(--fg-main)] border border-[var(--border-card)] hover:border-sciteal-500/50 whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 font-medium"
        >
          <Code className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
          Explain Code
        </button>
        <button
          onClick={() => handleSend('Debug my code against the challenge requirements.', 'debug_code')}
          className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface-sunken)] hover:bg-[var(--surface-subtle)] text-[var(--fg-main)] border border-[var(--border-card)] hover:border-sciteal-500/50 whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 font-medium"
        >
          <HelpCircle className="w-3 h-3 text-amber-500 dark:text-amber-400" />
          Debug Code
        </button>
        <button
          onClick={() => handleSend('Give me a conceptual hint.', 'hint')}
          className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface-sunken)] hover:bg-[var(--surface-subtle)] text-[var(--fg-main)] border border-[var(--border-card)] hover:border-sciteal-500/50 whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 font-medium"
        >
          <Lightbulb className="w-3 h-3 text-amber-500 dark:text-amber-400" />
          Hint
        </button>
        <button
          onClick={() => handleSend('Generate a practice question for this topic.', 'generate_question')}
          className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface-sunken)] hover:bg-[var(--surface-subtle)] text-[var(--fg-main)] border border-[var(--border-card)] hover:border-sciteal-500/50 whitespace-nowrap transition-colors flex items-center gap-1.5 flex-shrink-0 font-medium"
        >
          <Sparkles className="w-3 h-3 text-purple-500 dark:text-purple-400" />
          Practice Question
        </button>
      </div>

      {/* Suggested prompts strip */}
      <div className="px-4 py-2 bg-[var(--surface-sunken)] border-b border-[var(--border-card)] overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono text-[var(--fg-muted)] flex items-center gap-1 flex-shrink-0 font-semibold">
          <Lightbulb className="w-3 h-3 text-amber-500 dark:text-amber-400" />
          Prompts:
        </span>
        {suggestedPrompts.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSend(p.query, 'chat')}
            className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] border border-[var(--border-card)] hover:border-[var(--border-highlight)] whitespace-nowrap transition-colors flex-shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const qState = msg.generatedQuestion ? questionAnswers[msg.generatedQuestion.id] : undefined;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`
                w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-semibold
                ${isUser ? 'bg-sciteal-600 text-white' : 'bg-[var(--surface-subtle)] text-sciteal-600 dark:text-sciteal-400 border border-[var(--border-card)]'}
              `}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`
                max-w-[88%] rounded-xl p-3 text-xs leading-relaxed
                ${isUser 
                  ? 'bg-sciteal-600 dark:bg-sciteal-700 text-white font-medium rounded-tr-none shadow-sm' 
                  : 'bg-[var(--surface-sunken)] border border-[var(--border-card)] text-[var(--fg-main)] rounded-tl-none shadow-sm'}
              `}>
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Interactive Generated Question Card */}
                {msg.generatedQuestion && (
                  <div className="mt-3 p-3 rounded-lg bg-[var(--surface-card)] border border-sciteal-500/30 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-sciteal-700 dark:text-sciteal-400">
                      <span>Interactive Assessment</span>
                      <Badge variant="teal">AI Generated</Badge>
                    </div>
                    <div className="text-xs font-bold text-[var(--fg-main)]">
                      {msg.generatedQuestion.question}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {msg.generatedQuestion.options.map((opt) => {
                        const isSelected = qState?.selectedId === opt.id;
                        let btnStyle = 'bg-[var(--surface-sunken)] border-[var(--border-card)] hover:border-sciteal-500/60';
                        if (qState) {
                          if (opt.isCorrect) {
                            btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold';
                          } else if (isSelected) {
                            btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleAnswerOption(msg.generatedQuestion!.id, opt.id, opt.isCorrect)}
                            disabled={!!qState}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt.text}</span>
                            {qState && opt.isCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            )}
                            {qState && isSelected && !opt.isCorrect && (
                              <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {qState && (
                      <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                        qState.isCorrect ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/30'
                      }`}>
                        <div className="font-semibold mb-0.5">
                          {qState.isCorrect ? '✓ Correct!' : 'Review Concept:'}
                        </div>
                        <p>{msg.generatedQuestion.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Concepts tags if tutor */}
                {msg.referencedConcepts && msg.referencedConcepts.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[var(--border-card)] flex flex-wrap gap-1">
                    {msg.referencedConcepts.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-card)] text-sciteal-700 dark:text-sciteal-400 border border-[var(--border-card)] font-semibold"
                      >
                        #{c}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`text-[9px] mt-1.5 font-mono ${isUser ? 'text-white/80 text-right' : 'text-[var(--fg-muted)]'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)] pl-9">
            <span className="w-2 h-2 rounded-full bg-sciteal-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-sciteal-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-sciteal-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] text-[var(--fg-muted)] font-mono">Tutor is synthesizing explanation...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input bar */}
      <div className="p-3 bg-[var(--surface-sunken)] border-t border-[var(--border-card)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about qubits, gates, circuits, or algorithms..."
            className="flex-1 bg-[var(--surface-card)] border border-[var(--border-card)] rounded-xl px-4 py-2.5 text-xs text-[var(--fg-main)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-sciteal-500 transition-colors shadow-sm"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!input.trim() || isTyping}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Ask
          </Button>
        </form>
      </div>
    </Card>
  );
};
