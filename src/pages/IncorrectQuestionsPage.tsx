import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Trash2, 
  Sparkles,
  Award
} from 'lucide-react';
import { getUserProgress, removeIncorrectQuestion } from '../engine/persistence/attemptStorage';
import { getQuestionById } from '../data/questions';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { QuestionView } from '../components/exam/QuestionView';
import { saveActiveExamSession } from '../engine/persistence/attemptStorage';

export const IncorrectQuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(() => getUserProgress());
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [practiceResponses, setPracticeResponses] = useState<Record<string, any>>({});

  const incorrectEntries = useMemo(() => {
    return Object.values(progress.incorrectQuestions).sort((a, b) => b.timestamp - a.timestamp);
  }, [progress.incorrectQuestions]);

  const handleResolve = (questionId: string) => {
    removeIncorrectQuestion(questionId);
    setProgress(getUserProgress());
  };

  // Launch timed test on all missed questions
  const handleDrillAll = () => {
    const wrongIds = incorrectEntries.map(e => e.questionId);
    if (wrongIds.length === 0) return;

    const testId = `error-drill-${Date.now()}`;
    const durationMinutes = Math.max(10, Math.ceil(wrongIds.length * 2.5));

    saveActiveExamSession({
      testId,
      testTitle: `Targeted Mistake Drill (${wrongIds.length} Questions)`,
      attemptId: `attempt-err-${Date.now()}`,
      startTime: Date.now(),
      deadlineTimestamp: Date.now() + durationMinutes * 60 * 1000,
      durationMinutes,
      currentQuestionIndex: 0,
      activeSectionId: 'sec-drill',
      questionIds: wrongIds,
      responses: {},
      paletteStates: wrongIds.reduce((acc, id, idx) => {
        acc[id] = idx === 0 ? 'not_answered' : 'not_visited';
        return acc;
      }, {} as any),
      timeSpentSeconds: {},
      isSubmitted: false
    });

    navigate(`/exam/${testId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">In [Errors]:</span>
              <Badge variant="danger">{incorrectEntries.length} Questions Missed</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Mistake Analysis & Error Drill
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Questions answered incorrectly in mock tests or practice sessions are automatically collected here. Review the step-by-step logic and re-attempt until mastery.
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={handleDrillAll}
            disabled={incorrectEntries.length === 0}
            icon={<Clock className="w-3.5 h-3.5" />}
          >
            Timed Error Drill ({incorrectEntries.length} Qs)
          </Button>
        </div>
      </div>

      {/* List of Incorrect Questions */}
      <div className="space-y-4">
        {incorrectEntries.length === 0 ? (
          <div className="notebook-cell p-10 text-center bg-white dark:bg-slate-900 rounded-lg">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Zero Pending Mistakes!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              You currently have no unmastered incorrect questions. Keep taking mock tests and practice sets to identify areas for improvement.
            </p>
            <Button size="sm" variant="primary" onClick={() => navigate('/mocks')}>
              Explore Mock Tests
            </Button>
          </div>
        ) : (
          incorrectEntries.map((entry, idx) => {
            const q = getQuestionById(entry.questionId);
            if (!q) return null;

            const isRevealed = revealedSolutions[q.question_id] || false;
            const userResp = practiceResponses[q.question_id] ?? entry.incorrectResponse;

            return (
              <div
                key={q.question_id}
                className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-l-rose-500"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="danger" size="sm">
                      Failed {entry.failCount} {entry.failCount > 1 ? 'times' : 'time'}
                    </Badge>
                    <span className="text-slate-400 text-[11px] font-mono">
                      Last Attempt: {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleResolve(q.question_id)}
                    className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    title="Remove from incorrect list"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Mastered</span>
                  </button>
                </div>

                <QuestionView
                  question={q}
                  questionNumber={idx + 1}
                  userResponse={userResp}
                  onResponseChange={newResp => {
                    setPracticeResponses(prev => ({ ...prev, [q.question_id]: newResp }));
                  }}
                  mode={isRevealed ? 'review' : 'practice'}
                />

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 text-[11px]">
                    {q.subject} • {q.chapter}
                  </span>

                  <div className="flex items-center gap-2">
                    {!isRevealed ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setRevealedSolutions(prev => ({ ...prev, [q.question_id]: true }));
                        }}
                      >
                        Check Solution
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRevealedSolutions(prev => ({ ...prev, [q.question_id]: false }));
                          setPracticeResponses(prev => {
                            const n = { ...prev };
                            delete n[q.question_id];
                            return n;
                          });
                        }}
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
