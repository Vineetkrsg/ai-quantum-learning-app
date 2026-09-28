import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LESSONS_DATA } from '../mock/lessonsData';
import { useProgress } from '../context/ProgressContext';
import { LessonHeader } from '../components/learning/LessonHeader';
import { MiniLessonStepper } from '../components/learning/MiniLessonStepper';
import { InteractiveTryIt } from '../components/learning/InteractiveTryIt';
import { CircuitPractice } from '../components/learning/CircuitPractice';
import { CodeConnection } from '../components/learning/CodeConnection';
import { CodingPractice } from '../components/learning/CodingPractice';
import { KnowledgeCheck } from '../components/learning/KnowledgeCheck';
import { LessonTutor } from '../components/learning/LessonTutor';
import { PracticeChallenge } from '../components/learning/PracticeChallenge';
import { LessonNavigation } from '../components/learning/LessonNavigation';
import { VisualExplanation } from '../components/learning/VisualExplanation';
import { LessonCompletionSummary } from '../components/learning/LessonCompletionSummary';
import { AdaptiveContentCard } from '../components/learning/AdaptiveContentCard';
import { AdaptiveExplanation } from '../components/learning/AdaptiveExplanation';
import { evaluateAdaptiveProfile } from '../services/adaptiveEngine';
import { VisualizationSelector } from '../components/quantum/visualization';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  Lightbulb, 
  CheckCircle2
} from 'lucide-react';

export const LessonPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const progress = useProgress();
  const navigate = useNavigate();

  const lessonContent = slug ? LESSONS_DATA[slug] : undefined;

  // Active mini-lesson ID state (defaults to first lesson if not set or invalid)
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  // Scroll to top on slug or active lesson change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, selectedLessonId]);

  if (!lessonContent) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lesson Not Found</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The requested learning module "{slug}" does not exist or is currently being authored.
        </p>
        <Link to="/learn">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Return to Curriculum
          </Button>
        </Link>
      </div>
    );
  }

  const activeLessonIndex = (() => {
    const idx = lessonContent.miniLessons.findIndex((l) => l.id === selectedLessonId);
    return idx >= 0 ? idx : 0;
  })();
  const activeLesson = lessonContent.miniLessons[activeLessonIndex] || lessonContent.miniLessons[0];
  const isLastLesson = activeLessonIndex === lessonContent.miniLessons.length - 1;

  const modulePercent = slug ? (progress.moduleProgress[slug] || 0) : 0;
  const isModuleComplete = modulePercent === 100;
  const isCurrentLessonComplete = progress.completedLessons.includes(activeLesson.id);
  const completedLessonsInModule = slug ? (progress.completedLessonsByModule[slug] || []).length : 0;

  const handleCompleteCurrentMiniLesson = () => {
    if (slug) {
      progress.completeLesson(
        slug,
        activeLesson.id,
        activeLesson.title,
        lessonContent.miniLessons.length
      );
    }

    // Advance to next mini-lesson if available
    if (!isLastLesson) {
      setSelectedLessonId(lessonContent.miniLessons[activeLessonIndex + 1].id);
    }
  };

  // Evaluate explainable adaptive profile based on learner performance signals
  const adaptiveProfile = evaluateAdaptiveProfile(
    slug || 'fundamentals',
    activeLesson.id,
    progress.getAdaptiveRecord(slug || 'fundamentals')
  );


  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Module Header */}
      <LessonHeader
        title={lessonContent.title}
        subtitle={lessonContent.subtitle}
        difficulty={lessonContent.difficulty}
        estimatedTime={lessonContent.estimatedTime}
        isCompleted={isModuleComplete}
        progress={modulePercent}
      />

      {/* 2. Mini-Lesson Stepper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[var(--fg-muted)] px-1">
          <span className="font-semibold text-[var(--fg-main)]">
            Module Lessons ({activeLessonIndex + 1} of {lessonContent.miniLessons.length})
          </span>
          <span className="font-mono text-sciteal-700 dark:text-sciteal-400 font-semibold">
            {completedLessonsInModule} of {lessonContent.miniLessons.length} Completed
          </span>
        </div>
        <MiniLessonStepper
          lessons={lessonContent.miniLessons}
          activeLessonId={activeLesson.id}
          completedLessonIds={progress.completedLessons}
          onSelectLesson={(id) => setSelectedLessonId(id)}
        />
      </div>

      {/* 3. Active Mini-Lesson Body */}
      <div className="space-y-6 animate-in fade-in duration-200" data-tour="lesson-pattern">
        {/* Adaptive Learning Recommendation Card */}
        <AdaptiveContentCard
          evaluation={adaptiveProfile}
          moduleId={slug}
          lessonId={activeLesson.id}
        />

        {/* Core Lesson Card with Dynamic Adaptive Explanation */}
        <AdaptiveExplanation
          moduleSlug={slug || 'fundamentals'}
          lessonId={activeLesson.id}
          lessonTitle={activeLesson.title}
          defaultExplanation={activeLesson.conceptExplanation}
          defaultAnalogy={activeLesson.analogy}
          defaultVisualNote={activeLesson.visualNote}
        />

        {/* Concept-Specific 2D/3D Interactive Visualization Layer */}
        <VisualizationSelector
          key={`${slug}-${activeLesson.id}-selector`}
          moduleId={slug || 'fundamentals'}
          lessonId={activeLesson.id}
          conceptId={slug}
          title={activeLesson.title}
          onExploreInLab={() => navigate(`/lab?moduleId=${slug || 'fundamentals'}&lessonId=${activeLesson.id}`)}
        />

        {/* Visual Explanation if defined for this lesson */}
        {activeLesson.visualExplanation && (
          <VisualExplanation
            title={activeLesson.visualExplanation.title}
            description={activeLesson.visualExplanation.description}
            steps={activeLesson.visualExplanation.steps}
          />
        )}

        {/* 4. Interactive "Try It Yourself" Prediction Activity if present */}
        {activeLesson.interactiveTry && (
          <InteractiveTryIt
            key={`${slug}-${activeLesson.id}-interactive-try`}
            moduleId={slug}
            lessonId={activeLesson.id}
            activityId="interactive-try-1"
            data={activeLesson.interactiveTry}
            onRunSuccess={() => {
              progress.recordCircuitRun(activeLesson.interactiveTry?.title || 'Mini-Lesson Simulation');
            }}
          />
        )}

        {/* 5. Interactive Circuit Practice (only when educationally relevant) */}
        {(activeLesson.hasCircuitPractice || (activeLesson.initialCircuit && activeLesson.initialCircuit.length > 0) || activeLesson.practiceObjective) && (
          <CircuitPractice
            key={`${slug}-${activeLesson.id}-circuit-practice`}
            moduleId={slug || 'module'}
            lessonId={activeLesson.id}
            activityId="circuit-practice-1"
            title={`${activeLesson.title} — Circuit Practice`}
            instruction={activeLesson.practiceObjective || `Interactive circuit wire for ${activeLesson.title}. Add gates (e.g. [H Gate]) or arrange operations on the wire to observe how the state evolves.`}
            initialCircuit={activeLesson.initialCircuit || []}
            availableGates={activeLesson.availableGates || ['H', 'X', 'Y', 'Z', 'M']}
            targetOutcome={activeLesson.targetOutcome}
            onComplete={() => {
              progress.recordCircuitRun(`${activeLesson.title} Circuit Practice`);
            }}
          />
        )}

        {/* 6. Code Connection: Theory & Circuit to Quantum Code */}
        {activeLesson.codeConnection && (
          <CodeConnection
            key={`${slug}-${activeLesson.id}-code-connection`}
            moduleId={slug || 'module'}
            lessonId={activeLesson.id}
            activityId="code-connection-1"
            data={activeLesson.codeConnection}
          />
        )}

        {/* 7. Hands-on Coding Practice */}
        {activeLesson.codingPractice && (
          <CodingPractice
            key={`${slug}-${activeLesson.id}-coding-practice`}
            moduleId={slug || 'module'}
            lessonId={activeLesson.id}
            activityId="coding-practice-1"
            data={activeLesson.codingPractice}
            onComplete={() => {
              progress.recordCircuitRun(`${activeLesson.title} Coding Practice`);
            }}
          />
        )}

        {/* 8. Self-Check Quiz Question if present (Reusable KnowledgeCheck Component) */}
        {activeLesson.selfCheck && (
          <KnowledgeCheck
            key={`${slug}-${activeLesson.id}-knowledge-check`}
            moduleId={slug}
            lessonId={activeLesson.id}
            activityId="knowledge-check-1"
            data={activeLesson.selfCheck}
            onComplete={(isCorrect) => {
              if (isCorrect) {
                progress.recordQuizResult(activeLesson.title, 1, 1);
                if (slug) {
                  progress.completeLesson(
                    slug,
                    activeLesson.id,
                    activeLesson.title,
                    lessonContent.miniLessons.length
                  );
                }
              }
            }}
            onContinue={() => {
              if (!isLastLesson) {
                setSelectedLessonId(lessonContent.miniLessons[activeLessonIndex + 1].id);
              } else {
                const practiceElem = document.getElementById('practice-task');
                practiceElem?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        )}

        {/* 7. Mini-Lesson Action / Step Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[var(--surface-sunken)] rounded-xl border border-[var(--border-card)]">
          <Button
            variant="outline"
            size="sm"
            disabled={activeLessonIndex === 0}
            onClick={() => setSelectedLessonId(lessonContent.miniLessons[activeLessonIndex - 1].id)}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Previous Topic
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={isCurrentLessonComplete ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                if (slug) {
                  progress.completeLesson(
                    slug,
                    activeLesson.id,
                    activeLesson.title,
                    lessonContent.miniLessons.length
                  );
                }
              }}
              leftIcon={isCurrentLessonComplete ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : undefined}
            >
              {isCurrentLessonComplete ? 'Topic Completed' : 'Mark Topic Complete'}
            </Button>

            <Button
              variant="quantum"
              size="sm"
              onClick={handleCompleteCurrentMiniLesson}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {isLastLesson ? 'Complete & Start Practice' : 'Next Topic →'}
            </Button>
          </div>
        </div>

        {/* Lesson Completion Summary when active topic is completed */}
        {isCurrentLessonComplete && (
          <LessonCompletionSummary
            moduleTitle={lessonContent.title}
            moduleSlug={slug || 'module'}
            lessonTitle={activeLesson.title}
            learnedConcepts={[
              activeLesson.title,
              'Probability amplitudes & state transformations',
              'Quantum gate semantics & reversible logic'
            ]}
            practicedItems={[
              activeLesson.interactiveTry ? 'Interactive Prediction Simulator' : undefined,
              (activeLesson.hasCircuitPractice || (activeLesson.initialCircuit && activeLesson.initialCircuit.length > 0) || activeLesson.practiceObjective) ? 'Circuit Wire Construction' : undefined,
              activeLesson.codeConnection ? 'Qiskit Python Code Mapping' : undefined,
              activeLesson.codingPractice ? 'Hands-on Code Practice' : undefined,
              activeLesson.selfCheck ? 'Knowledge Check Self-Assessment' : undefined
            ].filter(Boolean) as string[]}
            canNowSkills={[
              'Reason confidently about state evolution through quantum operations',
              'Validate circuits against expected output distributions',
              'Translate visual circuit wire layouts directly into Qiskit Python'
            ]}
            nextLesson={!isLastLesson ? {
              slug: slug || 'module',
              title: lessonContent.miniLessons[activeLessonIndex + 1].title
            } : lessonContent.nextLesson}
            labPresetId={lessonContent.labPresetId}
            lessonId={activeLesson.id}
            onReviewAgain={() => setSelectedLessonId(lessonContent.miniLessons[0].id)}
          />
        )}
      </div>

      {/* 8. Practice Challenge */}
      <section id="practice-task" className="pt-4">
        <PracticeChallenge
          key={`${slug}-${activeLesson.id}-practice-task`}
          moduleId={slug}
          lessonId={activeLesson.id}
          activityId="practice-task-1"
          practiceData={lessonContent.practice}
          onComplete={() => {
            progress.recordChallengeComplete(`chal-${slug}`, 50);
          }}
        />
      </section>

      {/* 8. AI Tutor Section */}
      <section id="ai-tutor" className="pt-4">
        <LessonTutor
          lessonContext={lessonContent.tutorSection.lessonContext}
          exampleContext={lessonContent.tutorSection.exampleContext}
          suggestedQuestions={lessonContent.tutorSection.suggestedQuestions}
        />
      </section>

      {/* 9. Open in Circuit Lab CTA & Module Navigation */}
      <section id="lesson-navigation" className="pt-4">
        <LessonNavigation
          labPresetId={lessonContent.labPresetId}
          moduleId={slug}
          lessonId={activeLesson.id}
          isCompleted={isModuleComplete}
          onToggleComplete={() => {
            if (slug) {
              lessonContent.miniLessons.forEach((l) => {
                progress.completeLesson(slug, l.id, l.title, lessonContent.miniLessons.length);
              });
            }
          }}
          prevLesson={lessonContent.prevLesson}
          nextLesson={lessonContent.nextLesson}
        />
      </section>
    </div>
  );
};
