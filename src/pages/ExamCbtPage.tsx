import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestConfigById } from '../data/mockTests';
import { getAllQuestions, getQuestionById } from '../data/questions';
import { Question } from '../types/question';
import { 
  PaletteState, 
  UserQuestionResponse, 
  ActiveExamSession, 
  TestConfig,
  ExamResult
} from '../types/exam';
import { calculateExamResult } from '../engine/scoring/scoringEngine';
import { 
  getActiveExamSession, 
  saveActiveExamSession, 
  clearActiveExamSession,
  saveCompletedTest,
  isBookmarked,
  toggleBookmark
} from '../engine/persistence/attemptStorage';
import { ExamHeader } from '../components/exam/ExamHeader';
import { ExamPalette } from '../components/exam/ExamPalette';
import { QuestionView } from '../components/exam/QuestionView';
import { QuestionControls } from '../components/exam/QuestionControls';
import { SubmitConfirmModal } from '../components/exam/SubmitConfirmModal';
import { VirtualCalculator } from '../components/common/VirtualCalculator';

export const ExamCbtPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  // Test Configuration
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('');

  // Responses & Palette States
  const [responses, setResponses] = useState<Record<string, UserQuestionResponse>>({});
  const [paletteStates, setPaletteStates] = useState<Record<string, PaletteState>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});

  // Timer: Absolute deadline timestamp
  const [deadlineTimestamp, setDeadlineTimestamp] = useState<number>(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load and initialize test session
  useEffect(() => {
    if (!testId) {
      navigate('/mocks');
      return;
    }

    // Try preconfigured or custom test from storage
    let config = getTestConfigById(testId);
    if (!config) {
      // Check if custom test was saved in active session
      const active = getActiveExamSession();
      if (active && active.testId === testId) {
        // Build fallback config from active session
        config = {
          id: active.testId,
          title: active.testTitle,
          description: 'Custom Test Session',
          durationMinutes: active.durationMinutes,
          totalMarks: active.questionIds.length * 1.5,
          totalQuestions: active.questionIds.length,
          sections: [{ id: 'sec-main', name: 'Questions', questionIds: active.questionIds }],
          questionIds: active.questionIds,
          instructions: ['Standard practice instructions.'],
          paperType: 'custom'
        };
      }
    }

    if (!config) {
      alert('Test configuration not found.');
      navigate('/mocks');
      return;
    }

    setTestConfig(config);

    // Resolve question objects
    const resolvedQuestions: Question[] = [];
    for (const qId of config.questionIds) {
      const q = getQuestionById(qId);
      if (q) resolvedQuestions.push(q);
    }
    setQuestions(resolvedQuestions);

    // Check for existing active session to restore
    const savedSession = getActiveExamSession();
    if (savedSession && savedSession.testId === testId && !savedSession.isSubmitted) {
      // Restore saved session
      setResponses(savedSession.responses || {});
      setPaletteStates(savedSession.paletteStates || {});
      setTimeSpent(savedSession.timeSpentSeconds || {});
      setCurrentIndex(savedSession.currentQuestionIndex || 0);
      setActiveSectionId(savedSession.activeSectionId || config.sections[0]?.id || '');
      setDeadlineTimestamp(savedSession.deadlineTimestamp);

      const rem = Math.max(0, Math.floor((savedSession.deadlineTimestamp - Date.now()) / 1000));
      setTimeRemainingSeconds(rem);
    } else {
      // Initialize fresh exam session
      const initialPalette: Record<string, PaletteState> = {};
      config.questionIds.forEach((id, idx) => {
        initialPalette[id] = idx === 0 ? 'not_answered' : 'not_visited';
      });

      const deadline = Date.now() + config.durationMinutes * 60 * 1000;
      const initialSection = config.sections[0]?.id || 'default';

      setResponses({});
      setPaletteStates(initialPalette);
      setTimeSpent({});
      setCurrentIndex(0);
      setActiveSectionId(initialSection);
      setDeadlineTimestamp(deadline);
      setTimeRemainingSeconds(config.durationMinutes * 60);

      // Save initial active session
      saveActiveExamSession({
        testId: config.id,
        testTitle: config.title,
        attemptId: `attempt-${Date.now()}`,
        startTime: Date.now(),
        deadlineTimestamp: deadline,
        durationMinutes: config.durationMinutes,
        currentQuestionIndex: 0,
        activeSectionId: initialSection,
        questionIds: config.questionIds,
        responses: {},
        paletteStates: initialPalette,
        timeSpentSeconds: {},
        isSubmitted: false
      });
    }
  }, [testId, navigate]);

  // Periodic Timer & Auto-submission
  useEffect(() => {
    if (!deadlineTimestamp || isSubmitted) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((deadlineTimestamp - now) / 1000));
      setTimeRemainingSeconds(remaining);

      // Increment time spent on current question
      if (questions[currentIndex]) {
        const qId = questions[currentIndex].question_id;
        setTimeSpent(prev => ({
          ...prev,
          [qId]: (prev[qId] || 0) + 1
        }));
      }

      if (remaining <= 0) {
        clearInterval(timer);
        handleFinalSubmit(); // Auto-submit when time expires
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadlineTimestamp, isSubmitted, currentIndex, questions]);

  // Autosave active session on meaningful changes
  useEffect(() => {
    if (!testConfig || isSubmitted || !deadlineTimestamp) return;

    saveActiveExamSession({
      testId: testConfig.id,
      testTitle: testConfig.title,
      attemptId: getActiveExamSession()?.attemptId || `attempt-${Date.now()}`,
      startTime: getActiveExamSession()?.startTime || Date.now(),
      deadlineTimestamp,
      durationMinutes: testConfig.durationMinutes,
      currentQuestionIndex: currentIndex,
      activeSectionId,
      questionIds: testConfig.questionIds,
      responses,
      paletteStates,
      timeSpentSeconds: timeSpent,
      isSubmitted: false
    });
  }, [responses, paletteStates, currentIndex, activeSectionId, testConfig, deadlineTimestamp, isSubmitted, timeSpent]);

  const currentQuestion = questions[currentIndex];

  // Response change handler
  const handleResponseChange = (newResp: UserQuestionResponse) => {
    if (!currentQuestion) return;
    const qId = currentQuestion.question_id;
    setResponses(prev => ({
      ...prev,
      [qId]: newResp
    }));
  };

  // Helper to determine if question is answered
  const hasAnswer = (resp: UserQuestionResponse) => {
    if (resp === null || resp === undefined || resp === '') return false;
    if (Array.isArray(resp) && resp.length === 0) return false;
    return true;
  };

  // Move to question by index with palette state updates
  const navigateToQuestion = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    // Update section if needed
    const targetQ = questions[targetIndex];
    if (targetQ && testConfig) {
      for (const sec of testConfig.sections) {
        if (sec.questionIds.includes(targetQ.question_id)) {
          setActiveSectionId(sec.id);
          break;
        }
      }
    }

    // Mark current question state before moving
    if (currentQuestion) {
      const qId = currentQuestion.question_id;
      const resp = responses[qId];
      const currentState = paletteStates[qId];

      if (hasAnswer(resp)) {
        if (currentState === 'marked_for_review' || currentState === 'answered_marked_for_review') {
          setPaletteStates(prev => ({ ...prev, [qId]: 'answered_marked_for_review' }));
        } else {
          setPaletteStates(prev => ({ ...prev, [qId]: 'answered' }));
        }
      } else {
        if (currentState !== 'marked_for_review') {
          setPaletteStates(prev => ({ ...prev, [qId]: 'not_answered' }));
        }
      }
    }

    // Mark target question as visited / not_answered if it was not_visited
    const targetQId = questions[targetIndex].question_id;
    if (!paletteStates[targetQId] || paletteStates[targetQId] === 'not_visited') {
      setPaletteStates(prev => ({ ...prev, [targetQId]: 'not_answered' }));
    }

    setCurrentIndex(targetIndex);
  };

  // Examination Controls
  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.question_id;
    const resp = responses[qId];

    if (hasAnswer(resp)) {
      setPaletteStates(prev => ({ ...prev, [qId]: 'answered' }));
    } else {
      setPaletteStates(prev => ({ ...prev, [qId]: 'not_answered' }));
    }

    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.question_id;
    setResponses(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setPaletteStates(prev => ({ ...prev, [qId]: 'not_answered' }));
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.question_id;
    const resp = responses[qId];

    if (hasAnswer(resp)) {
      setPaletteStates(prev => ({ ...prev, [qId]: 'answered_marked_for_review' }));
    } else {
      setPaletteStates(prev => ({ ...prev, [qId]: 'marked_for_review' }));
    }

    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const sec = testConfig?.sections.find(s => s.id === sectionId);
    if (sec && sec.questionIds.length > 0) {
      const targetQId = sec.questionIds[0];
      const targetIdx = questions.findIndex(q => q.question_id === targetQId);
      if (targetIdx !== -1) {
        navigateToQuestion(targetIdx);
      }
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + S: Save & Next
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSaveAndNext();
      }
      // Alt + R: Mark for Review & Next
      if (e.altKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        handleMarkForReviewAndNext();
      }
      // Alt + P: Previous
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        if (currentIndex > 0) navigateToQuestion(currentIndex - 1);
      }
      // Alt + C: Calculator
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setIsCalculatorOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Final Submission Evaluation
  const handleFinalSubmit = useCallback(() => {
    if (!testConfig || isSubmitted) return;
    setIsSubmitted(true);
    setIsSubmitModalOpen(false);

    const activeSession = getActiveExamSession();
    const attemptId = activeSession?.attemptId || `attempt-${Date.now()}`;
    const timeUsed = (testConfig.durationMinutes * 60) - timeRemainingSeconds;

    const reviewCount = Object.values(paletteStates).filter(
      s => s === 'marked_for_review' || s === 'answered_marked_for_review'
    ).length;

    // Calculate score using the scoring engine
    const result: ExamResult = calculateExamResult(
      testConfig.id,
      testConfig.title,
      attemptId,
      questions,
      testConfig.sections,
      responses,
      timeSpent,
      testConfig.durationMinutes,
      timeUsed,
      reviewCount
    );

    // Save completed test attempt
    saveCompletedTest(result);
    clearActiveExamSession();

    // Navigate to results
    navigate(`/result/${attemptId}`, { state: { result } });
  }, [testConfig, isSubmitted, timeRemainingSeconds, paletteStates, questions, responses, timeSpent, navigate]);

  if (!testConfig || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs text-slate-500 animate-pulse">
          Loading Examination Session...
        </div>
      </div>
    );
  }

  const currentQId = currentQuestion?.question_id || '';
  const currentResponse = responses[currentQId] ?? null;
  const currentBookmarked = isBookmarked(currentQId);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans">
      {/* Exam Top Header */}
      <ExamHeader
        title={testConfig.title}
        timeRemainingSeconds={timeRemainingSeconds}
        sections={testConfig.sections}
        activeSectionId={activeSectionId}
        onSelectSection={handleSectionSelect}
        onOpenCalculator={() => setIsCalculatorOpen(prev => !prev)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
      />

      {/* Main Examination Viewport: Question + Palette */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto shadow-sm">
        {/* Left Side: Question Canvas and Bottom Controls */}
        <main className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
          {/* Question Presentation Container */}
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {currentQuestion ? (
              <QuestionView
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                userResponse={currentResponse}
                onResponseChange={handleResponseChange}
                mode="exam"
                isBookmarked={currentBookmarked}
                onToggleBookmark={() => toggleBookmark(currentQId)}
              />
            ) : (
              <div>No question selected</div>
            )}
          </div>

          {/* Persistent Bottom Action Controls */}
          <QuestionControls
            onPrevious={() => navigateToQuestion(currentIndex - 1)}
            onSaveAndNext={handleSaveAndNext}
            onClearResponse={handleClearResponse}
            onMarkForReviewAndNext={handleMarkForReviewAndNext}
            isFirst={currentIndex === 0}
            isLast={currentIndex === questions.length - 1}
            hasResponse={hasAnswer(currentResponse)}
          />
        </main>

        {/* Right Side: Official Question Palette Grid */}
        <ExamPalette
          questionIds={questions.map(q => q.question_id)}
          currentIndex={currentIndex}
          paletteStates={paletteStates}
          onSelectQuestion={navigateToQuestion}
          sectionName={testConfig.sections.find(s => s.id === activeSectionId)?.name}
        />
      </div>

      {/* On-Screen Virtual Scientific Calculator */}
      <VirtualCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Final Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleFinalSubmit}
        totalQuestions={questions.length}
        paletteStates={paletteStates}
        timeRemainingSeconds={timeRemainingSeconds}
      />
    </div>
  );
};
