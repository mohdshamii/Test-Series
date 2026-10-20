import React, { useState } from 'react';
import { PaletteState } from '../../types/exam';
import { ChevronDown, ChevronUp, Grid } from 'lucide-react';

interface ExamPaletteProps {
  questionIds: string[];
  currentIndex: number;
  paletteStates: Record<string, PaletteState>;
  onSelectQuestion: (index: number) => void;
  sectionName?: string;
}

export const ExamPalette: React.FC<ExamPaletteProps> = ({
  questionIds,
  currentIndex,
  paletteStates,
  onSelectQuestion,
  sectionName
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Compute counts for each of the 5 states
  let countNotVisited = 0;
  let countNotAnswered = 0;
  let countAnswered = 0;
  let countMarkedReview = 0;
  let countAnsweredMarkedReview = 0;

  for (const qId of questionIds) {
    const state = paletteStates[qId] || 'not_visited';
    switch (state) {
      case 'not_visited':
        countNotVisited++;
        break;
      case 'not_answered':
        countNotAnswered++;
        break;
      case 'answered':
        countAnswered++;
        break;
      case 'marked_for_review':
        countMarkedReview++;
        break;
      case 'answered_marked_for_review':
        countAnsweredMarkedReview++;
        break;
    }
  }

  const getButtonStyles = (state: PaletteState, isCurrent: boolean) => {
    let base = 'relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded font-mono text-xs font-bold transition-all shadow-xs ';

    if (isCurrent) {
      base += 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10 ';
    }

    switch (state) {
      case 'answered':
        return base + 'bg-emerald-600 hover:bg-emerald-500 text-white';
      case 'not_answered':
        return base + 'bg-rose-600 hover:bg-rose-500 text-white';
      case 'marked_for_review':
        return base + 'bg-purple-600 hover:bg-purple-500 text-white';
      case 'answered_marked_for_review':
        return base + 'bg-purple-700 hover:bg-purple-600 text-white';
      case 'not_visited':
      default:
        return base + 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 select-none">
      {/* Mobile Accordion Header */}
      <button
        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        className="lg:hidden px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300"
      >
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Question Palette ({countAnswered}/{questionIds.length} Answered)</span>
        </div>
        {isMobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Palette Body */}
      <div className={`p-4 flex-col gap-4 ${isMobileExpanded ? 'flex' : 'hidden lg:flex'}`}>
        {/* Section title if provided */}
        {sectionName && (
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {sectionName}
          </div>
        )}

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-mono text-[10px] font-bold">
              {countAnswered}
            </span>
            <span className="text-slate-600 dark:text-slate-400">Answered</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-rose-600 text-white flex items-center justify-center font-mono text-[10px] font-bold">
              {countNotAnswered}
            </span>
            <span className="text-slate-600 dark:text-slate-400">Not Answered</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center font-mono text-[10px] font-bold">
              {countMarkedReview}
            </span>
            <span className="text-slate-600 dark:text-slate-400">Marked for Review</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative w-5 h-5 rounded bg-purple-700 text-white flex items-center justify-center font-mono text-[10px] font-bold">
              {countAnsweredMarkedReview}
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
            </div>
            <span className="text-slate-600 dark:text-slate-400 leading-tight">Ans & Review</span>
          </div>

          <div className="flex items-center gap-1.5 col-span-2">
            <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-mono text-[10px] font-bold">
              {countNotVisited}
            </span>
            <span className="text-slate-600 dark:text-slate-400">Not Visited</span>
          </div>
        </div>

        {/* Question Grid Buttons */}
        <div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
            Choose a Question:
          </div>
          <div className="grid grid-cols-5 gap-2 max-h-72 lg:max-h-[50vh] overflow-y-auto p-1">
            {questionIds.map((qId, idx) => {
              const state = paletteStates[qId] || 'not_visited';
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={qId}
                  onClick={() => {
                    onSelectQuestion(idx);
                    setIsMobileExpanded(false);
                  }}
                  className={getButtonStyles(state, isCurrent)}
                  title={`Question ${idx + 1} (${state.replace(/_/g, ' ')})`}
                  aria-label={`Go to Question ${idx + 1}`}
                >
                  <span>{idx + 1}</span>
                  {state === 'answered_marked_for_review' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
