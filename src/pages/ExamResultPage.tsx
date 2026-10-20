import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  RotateCcw, 
  AlertTriangle, 
  BookOpen, 
  Bookmark, 
  Filter,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Share2
} from 'lucide-react';
import { ExamResult, SectionScore } from '../types/exam';
import { getUserProgress, toggleBookmark, isBookmarked } from '../engine/persistence/attemptStorage';
import { getQuestionById } from '../data/questions';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { QuestionView } from '../components/exam/QuestionView';
import { saveActiveExamSession } from '../engine/persistence/attemptStorage';

export const ExamResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState<ExamResult | null>(() => {
    if (location.state?.result) return location.state.result;
    const progress = getUserProgress();
    return progress.completedTests.find(t => t.attemptId === attemptId) || null;
  });

  const [selectedReviewFilter, setSelectedReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Trigger celebration confetti for good scores
  useEffect(() => {
    if (result && result.percentage >= 50) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Exam Result Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md">
          The requested attempt result could not be located in your local storage.
        </p>
        <Button variant="primary" onClick={() => navigate('/history')}>
          View Attempt History
        </Button>
      </div>
    );
  }

  // Format time display
  const formatTimeUsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Filter review questions
  const questionIds = Object.keys(result.questionEvaluations);
  const filteredQuestionIds = questionIds.filter(qId => {
    const evalRes = result.questionEvaluations[qId];
    if (selectedReviewFilter === 'correct') return evalRes.isCorrect;
    if (selectedReviewFilter === 'incorrect') return evalRes.isAttempted && !evalRes.isCorrect;
    if (selectedReviewFilter === 'unattempted') return !evalRes.isAttempted;
    return true;
  });

  const activeQuestionId = filteredQuestionIds[activeQuestionIndex] || filteredQuestionIds[0];
  const activeQuestion = activeQuestionId ? getQuestionById(activeQuestionId) : null;
  const activeEval = activeQuestionId ? result.questionEvaluations[activeQuestionId] : null;

  // Launch a new targeted practice session with only the incorrect questions
  const handlePracticeIncorrect = () => {
    const wrongIds = questionIds.filter(id => {
      const ev = result.questionEvaluations[id];
      return ev.isAttempted && !ev.isCorrect;
    });

    if (wrongIds.length === 0) {
      alert('Congratulations! You had zero incorrect answers in this test.');
      return;
    }

    const customSession = {
      testId: `retry-errors-${Date.now()}`,
      testTitle: `Error Drill: ${result.testTitle}`,
      attemptId: `attempt-retry-${Date.now()}`,
      startTime: Date.now(),
      deadlineTimestamp: Date.now() + wrongIds.length * 2 * 60 * 1000,
      durationMinutes: wrongIds.length * 2,
      currentQuestionIndex: 0,
      activeSectionId: 'sec-errors',
      questionIds: wrongIds,
      responses: {},
      paletteStates: wrongIds.reduce((acc, id, idx) => {
        acc[id] = idx === 0 ? 'not_answered' : 'not_visited';
        return acc;
      }, {} as any),
      timeSpentSeconds: {},
      isSubmitted: false
    };

    saveActiveExamSession(customSession);
    navigate(`/exam/${customSession.testId}`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header Card */}
      <div className="notebook-cell p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">Out [Evaluation]:</span>
              <Badge variant="primary">GATE Scoring Rules Applied</Badge>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(result.timestamp).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {result.testTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Time Used: <strong className="text-slate-700 dark:text-slate-300">{formatTimeUsed(result.timeUsedSeconds)}</strong> • Total Questions: {result.totalQuestions}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/exam/${result.testId}`)}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retake Test
            </Button>
            {result.incorrectCount > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={handlePracticeIncorrect}
                icon={<AlertTriangle className="w-3.5 h-3.5" />}
              >
                Practice Incorrect ({result.incorrectCount})
              </Button>
            )}
          </div>
        </div>

        {/* 4 Primary Summary Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Final Marks
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-sky-600 dark:text-sky-400">
              {result.totalMarksObtained} <span className="text-base text-slate-400 font-normal">/ {result.maxMarks}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono mt-1 block">
              Percentage: {result.percentage}%
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Accuracy
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {result.accuracy}%
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              {result.correctCount} of {result.correctCount + result.incorrectCount} attempted
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Correct / Wrong
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">{result.correctCount}</span>
              <span className="text-slate-400 mx-1.5">/</span>
              <span className="text-rose-600 dark:text-rose-400">{result.incorrectCount}</span>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Unattempted: {result.unattemptedCount}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Avg Pace
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-800 dark:text-slate-200">
              {result.totalQuestions > 0 ? Math.round(result.timeUsedSeconds / result.totalQuestions) : 0}s
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Per question average
            </span>
          </div>
        </div>
      </div>

      {/* Performance Breakdowns Grid: Sections, Question Types, Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections Performance */}
        <div className="notebook-cell p-5 bg-white dark:bg-slate-900 rounded-lg">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-600" />
            <span>Section Breakdown</span>
          </h3>
          <div className="space-y-3">
            {result.sectionScores.map((sec: SectionScore) => (
              <div key={sec.sectionId} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex justify-between items-center font-semibold mb-1">
                  <span className="text-slate-900 dark:text-slate-100">{sec.sectionName}</span>
                  <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">
                    {sec.marksObtained} / {sec.maxMarks}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Correct: {sec.correct}</span>
                  <span>Wrong: {sec.incorrect}</span>
                  <span>Skipped: {sec.unattempted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Type Breakdown */}
        <div className="notebook-cell p-5 bg-white dark:bg-slate-900 rounded-lg">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Question Type Breakdown</span>
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {(['MCQ', 'MSQ', 'NAT'] as const).map(type => {
              const data = result.questionTypeBreakdown[type];
              if (!data || data.total === 0) return null;
              return (
                <div key={type} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1 font-bold">
                    <span className="font-sans text-slate-800 dark:text-slate-200">{type}</span>
                    <span className="text-sky-600 dark:text-sky-400">{data.marks} pts</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{data.correct}/{data.total} Correct</span>
                    <span>{data.incorrect} Incorrect</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject-Wise Performance */}
        <div className="notebook-cell p-5 bg-white dark:bg-slate-900 rounded-lg">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-600" />
            <span>Subject-Wise Performance</span>
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto text-xs pr-1">
            {Object.entries(result.subjectBreakdown).map(([subName, subData]: [string, any]) => (
              <div key={subName} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="truncate max-w-[140px] font-medium text-slate-700 dark:text-slate-300" title={subName}>
                  {subName}
                </span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-500 text-[11px]">{subData.correct}/{subData.total}</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">{subData.marks}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Question Solution Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Question-by-Question Solution Review
            </h2>
            <p className="text-xs text-slate-500">
              Inspect your chosen response, correct answers, and mathematical explanations
            </p>
          </div>

          {/* Review Filter Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: `All (${questionIds.length})` },
              { id: 'correct', label: `Correct (${result.correctCount})` },
              { id: 'incorrect', label: `Incorrect (${result.incorrectCount})` },
              { id: 'unattempted', label: `Skipped (${result.unattemptedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedReviewFilter(tab.id as any);
                  setActiveQuestionIndex(0);
                }}
                className={`px-2.5 py-1 rounded transition text-xs font-medium ${
                  selectedReviewFilter === tab.id
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Selector Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          {filteredQuestionIds.map((qId, idx) => {
            const ev = result.questionEvaluations[qId];
            const isCurrent = idx === activeQuestionIndex;
            let statusColor = 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            if (ev?.isCorrect) statusColor = 'bg-emerald-600 text-white';
            else if (ev?.isAttempted) statusColor = 'bg-rose-600 text-white';

            return (
              <button
                key={qId}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`w-8 h-8 rounded shrink-0 font-mono text-xs font-bold transition flex items-center justify-center ${statusColor} ${
                  isCurrent ? 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' : ''
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Active Question Solution Canvas */}
        {activeQuestion && activeEval ? (
          <div className="notebook-cell p-5 sm:p-7 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
            {/* Question Score Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm">
                  Reviewing Question {activeQuestionIndex + 1} of {filteredQuestionIds.length}
                </span>
                {activeEval.isCorrect ? (
                  <Badge variant="success">Correct (+{activeEval.marksAwarded} Marks)</Badge>
                ) : activeEval.isAttempted ? (
                  <Badge variant="danger">
                    Incorrect ({activeEval.negativeMarksDeducted > 0 ? `-${activeEval.negativeMarksDeducted}` : '0'} Marks)
                  </Badge>
                ) : (
                  <Badge variant="secondary">Unattempted (0 Marks)</Badge>
                )}
              </div>

              {activeEval.timeSpentSeconds > 0 && (
                <div className="text-slate-500 font-mono text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time Spent: {activeEval.timeSpentSeconds}s</span>
                </div>
              )}
            </div>

            <QuestionView
              question={activeQuestion}
              questionNumber={activeQuestionIndex + 1}
              userResponse={activeEval.userResponse}
              mode="review"
              isBookmarked={isBookmarked(activeQuestion.question_id)}
              onToggleBookmark={() => toggleBookmark(activeQuestion.question_id)}
            />

            {/* Pagination Controls for Solution Review */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={activeQuestionIndex === 0}
              >
                Previous Solution
              </Button>
              <span className="font-mono text-xs text-slate-500">
                {activeQuestionIndex + 1} / {filteredQuestionIds.length}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveQuestionIndex(prev => Math.min(filteredQuestionIds.length - 1, prev + 1))}
                disabled={activeQuestionIndex === filteredQuestionIds.length - 1}
              >
                Next Solution
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            No questions matching the selected filter ({selectedReviewFilter}).
          </div>
        )}
      </div>
    </div>
  );
};
