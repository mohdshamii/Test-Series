import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Trash2, RotateCcw, HelpCircle, ArrowRight } from 'lucide-react';
import { getUserProgress, toggleBookmark } from '../engine/persistence/attemptStorage';
import { getQuestionById } from '../data/questions';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { QuestionView } from '../components/exam/QuestionView';
import { saveActiveExamSession } from '../engine/persistence/attemptStorage';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(() => getUserProgress());
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [practiceResponses, setPracticeResponses] = useState<Record<string, any>>({});

  const bookmarkedQuestions = useMemo(() => {
    return progress.bookmarks
      .map(id => getQuestionById(id))
      .filter((q): q is NonNullable<typeof q> => q !== undefined);
  }, [progress.bookmarks]);

  const handleToggle = (id: string) => {
    toggleBookmark(id);
    setProgress(getUserProgress());
  };

  const handlePracticeAll = () => {
    if (bookmarkedQuestions.length === 0) return;
    const testId = `bookmarks-test-${Date.now()}`;
    const questionIds = bookmarkedQuestions.map(q => q.question_id);
    const durationMinutes = Math.max(10, Math.ceil(questionIds.length * 2.5));

    saveActiveExamSession({
      testId,
      testTitle: `Saved Bookmarks Practice (${questionIds.length} Questions)`,
      attemptId: `attempt-bm-${Date.now()}`,
      startTime: Date.now(),
      deadlineTimestamp: Date.now() + durationMinutes * 60 * 1000,
      durationMinutes,
      currentQuestionIndex: 0,
      activeSectionId: 'sec-bookmarks',
      questionIds,
      responses: {},
      paletteStates: questionIds.reduce((acc, id, idx) => {
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
      <div className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">In [Bookmarks]:</span>
              <Badge variant="warning">{bookmarkedQuestions.length} Questions Saved</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Bookmarked Questions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Questions you have marked for later revision. Stored locally in your browser.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePracticeAll}
            disabled={bookmarkedQuestions.length === 0}
            icon={<Clock className="w-3.5 h-3.5" />}
          >
            Practice All Bookmarks
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {bookmarkedQuestions.length === 0 ? (
          <div className="notebook-cell p-10 text-center bg-white dark:bg-slate-900 rounded-lg">
            <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Bookmarks Saved Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              When reviewing questions or taking mock tests, click the bookmark icon on any question to save it here for fast revision.
            </p>
            <Button size="sm" variant="outline" onClick={() => navigate('/subjects')}>
              Explore Questions
            </Button>
          </div>
        ) : (
          bookmarkedQuestions.map((q, idx) => {
            const isRevealed = revealedSolutions[q.question_id] || false;
            const userResp = practiceResponses[q.question_id] ?? null;

            return (
              <div
                key={q.question_id}
                className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg"
              >
                <QuestionView
                  question={q}
                  questionNumber={idx + 1}
                  userResponse={userResp}
                  onResponseChange={newResp => {
                    setPracticeResponses(prev => ({ ...prev, [q.question_id]: newResp }));
                  }}
                  mode={isRevealed ? 'review' : 'practice'}
                  isBookmarked={true}
                  onToggleBookmark={() => handleToggle(q.question_id)}
                />

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 text-[11px]">
                    {q.subject} • {q.chapter}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggle(q.question_id)}
                      icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                    >
                      Remove
                    </Button>

                    {!isRevealed ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setRevealedSolutions(prev => ({ ...prev, [q.question_id]: true }));
                        }}
                      >
                        Show Solution
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
