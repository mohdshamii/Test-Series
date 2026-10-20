import React from 'react';
import { Question } from '../../types/question';
import { UserQuestionResponse } from '../../types/exam';
import { MathText } from '../common/MathText';
import { CodeBlock } from '../notebook/CodeBlock';
import { Badge } from '../common/Badge';
import { CheckCircle2, XCircle, Bookmark, BookmarkCheck, AlertCircle } from 'lucide-react';

interface QuestionViewProps {
  question: Question;
  questionNumber: number;
  userResponse: UserQuestionResponse;
  onResponseChange?: (newResponse: UserQuestionResponse) => void;
  mode?: 'exam' | 'practice' | 'review';
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  questionNumber,
  userResponse,
  onResponseChange,
  mode = 'exam',
  isBookmarked = false,
  onToggleBookmark
}) => {
  const isReadOnly = mode === 'review';

  const handleMcqSelect = (optId: string) => {
    if (isReadOnly || !onResponseChange) return;
    onResponseChange(optId);
  };

  const handleMsqToggle = (optId: string) => {
    if (isReadOnly || !onResponseChange) return;
    const current = Array.isArray(userResponse) ? [...userResponse] : [];
    if (current.includes(optId)) {
      onResponseChange(current.filter(id => id !== optId));
    } else {
      onResponseChange([...current, optId]);
    }
  };

  const handleNatInput = (val: string) => {
    if (isReadOnly || !onResponseChange) return;
    onResponseChange(val);
  };

  // Type badge helper
  const renderTypeBadge = () => {
    switch (question.question_type) {
      case 'MCQ':
        return <Badge variant="primary">MCQ (Single Choice)</Badge>;
      case 'MSQ':
        return <Badge variant="purple">MSQ (Multiple Choice)</Badge>;
      case 'NAT':
        return <Badge variant="warning">NAT (Numerical Answer)</Badge>;
    }
  };

  return (
    <div className="w-full">
      {/* Question Metadata Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
            Q.{questionNumber}
          </span>
          {renderTypeBadge()}
          <Badge variant="slate">
            {question.marks} Mark{question.marks > 1 ? 's' : ''}
            {question.negative_marks > 0 ? ` (Negative: -${question.negative_marks})` : ' (No Negative)'}
          </Badge>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="text-slate-500 font-medium hidden sm:inline">{question.subject}</span>
        </div>

        <div className="flex items-center gap-2">
          {question.source_type === 'official_pyq' && (
            <Badge variant="success" size="sm">
              {question.original_paper === 'CS' 
                ? `GATE CSE ${question.exam_year ?? ''} PYQ` 
                : `Official GATE DA ${question.exam_year ?? ''}`}
            </Badge>
          )}

          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`p-1.5 rounded transition ${
                isBookmarked 
                  ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/50' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Question Text with KaTeX */}
      <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal mb-6">
        <MathText text={question.question_text} />
      </div>

      {/* Code Snippet if present */}
      {question.code_snippet && (
        <CodeBlock 
          code={question.code_snippet.code} 
          language={question.code_snippet.language} 
        />
      )}

      {/* Options / Input Form Area */}
      <div className="mt-6 space-y-3">
        {/* MCQ: Single Choice Radio List */}
        {question.question_type === 'MCQ' && question.options && (
          <div className="space-y-2.5">
            {question.options.map(opt => {
              const isSelected = String(userResponse).trim().toUpperCase() === opt.id.toUpperCase();
              const isCorrectOpt = String(question.correct_answer).trim().toUpperCase() === opt.id.toUpperCase();

              let optClasses = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900';
              if (isSelected && mode !== 'review') {
                optClasses = 'border-sky-500 dark:border-sky-500 bg-sky-50/70 dark:bg-sky-950/50 ring-1 ring-sky-500';
              } else if (mode === 'review') {
                if (isCorrectOpt) {
                  optClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectOpt) {
                  optClasses = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
                }
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleMcqSelect(opt.id)}
                  className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-lg border transition-all cursor-pointer select-none ${optClasses}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border mt-0.5 text-xs font-mono font-bold transition ${
                    isSelected 
                      ? 'border-sky-600 bg-sky-600 text-white' 
                      : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}>
                    {opt.id}
                  </div>
                  <div className="flex-1 text-sm text-slate-800 dark:text-slate-200">
                    <MathText text={opt.text} inline />
                  </div>
                  {mode === 'review' && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {mode === 'review' && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MSQ: Multiple Select Checkbox List */}
        {question.question_type === 'MSQ' && question.options && (
          <div className="space-y-2.5">
            <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-md border border-amber-200 dark:border-amber-800/80 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Multiple options can be correct. Exact set selection is required. No negative marking.</span>
            </div>

            {question.options.map(opt => {
              const selectedArray = Array.isArray(userResponse) ? userResponse : [];
              const isSelected = selectedArray.includes(opt.id);
              const correctArray = Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer];
              const isCorrectOpt = correctArray.includes(opt.id);

              let optClasses = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900';
              if (isSelected && mode !== 'review') {
                optClasses = 'border-purple-500 dark:border-purple-500 bg-purple-50/70 dark:bg-purple-950/50 ring-1 ring-purple-500';
              } else if (mode === 'review') {
                if (isCorrectOpt) {
                  optClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectOpt) {
                  optClasses = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
                }
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleMsqToggle(opt.id)}
                  className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-lg border transition-all cursor-pointer select-none ${optClasses}`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border mt-0.5 text-xs font-mono font-bold transition ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-600 text-white' 
                      : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}>
                    {isSelected ? '✓' : opt.id}
                  </div>
                  <div className="flex-1 text-sm text-slate-800 dark:text-slate-200">
                    <MathText text={opt.text} inline />
                  </div>
                  {mode === 'review' && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {mode === 'review' && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* NAT: Numerical Answer Input & Virtual Numeric Keypad */}
        {question.question_type === 'NAT' && (
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 max-w-md">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Enter Numerical Answer:
            </label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={userResponse !== null && userResponse !== undefined ? String(userResponse) : ''}
                onChange={e => handleNatInput(e.target.value)}
                disabled={isReadOnly}
                placeholder="Type or click keypad below"
                className="w-full px-3 py-2 text-base font-mono font-bold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleNatInput('')}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Virtual Keypad for CBT Realism */}
            {!isReadOnly && (
              <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-200/60 dark:bg-slate-800/60 rounded-md">
                {['7', '8', '9', '⌫', '4', '5', '6', '-', '1', '2', '3', '.', '0'].map(key => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      const cur = String(userResponse || '');
                      if (key === '⌫') {
                        handleNatInput(cur.slice(0, -1));
                      } else if (key === '-') {
                        if (!cur.startsWith('-')) handleNatInput('-' + cur);
                        else handleNatInput(cur.slice(1));
                      } else if (key === '.') {
                        if (!cur.includes('.')) handleNatInput(cur + '.');
                      } else {
                        handleNatInput(cur + key);
                      }
                    }}
                    className={`py-2 rounded font-mono font-bold text-xs sm:text-sm transition ${
                      key === '⌫' 
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300' 
                        : 'bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Mode: Detailed Explanation and Solution */}
      {mode === 'review' && (
        <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4 sm:p-5 rounded-lg border">
          <div className="flex items-center gap-2 font-mono font-semibold text-xs sm:text-sm text-sky-700 dark:text-sky-300 mb-2">
            <span>Out [Solution]:</span>
            <span className="text-slate-500 font-normal">
              Correct Answer:{' '}
              <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                {Array.isArray(question.correct_answer)
                  ? question.correct_answer.join(', ')
                  : typeof question.correct_answer === 'object' && 'min' in question.correct_answer
                  ? `${question.correct_answer.min} to ${question.correct_answer.max}`
                  : String(question.correct_answer)}
              </strong>
            </span>
          </div>

          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <MathText text={question.explanation} />
          </div>

          {question.solution_steps && question.solution_steps.length > 0 && (
            <div className="mt-4 space-y-1.5 pl-3 border-l-2 border-sky-400 dark:border-sky-600">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Step-by-Step Derivation:
              </span>
              {question.solution_steps.map((step, sIdx) => (
                <div key={sIdx} className="text-xs text-slate-600 dark:text-slate-400">
                  <MathText text={step} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
