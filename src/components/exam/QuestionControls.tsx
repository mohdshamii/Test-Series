import React from 'react';
import { Button } from '../common/Button';
import { ChevronLeft, ChevronRight, Bookmark, RotateCcw, Check } from 'lucide-react';

interface QuestionControlsProps {
  onPrevious: () => void;
  onSaveAndNext: () => void;
  onClearResponse: () => void;
  onMarkForReviewAndNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  hasResponse: boolean;
}

export const QuestionControls: React.FC<QuestionControlsProps> = ({
  onPrevious,
  onSaveAndNext,
  onClearResponse,
  onMarkForReviewAndNext,
  isFirst,
  isLast,
  hasResponse
}) => {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-2.5">
      {/* Left Action Buttons: Clear & Mark for Review */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onClearResponse}
          disabled={!hasResponse}
          icon={<RotateCcw className="w-3.5 h-3.5 text-rose-500" />}
          title="Clear selected option"
        >
          Clear Response
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onMarkForReviewAndNext}
          icon={<Bookmark className="w-3.5 h-3.5 text-purple-500" />}
          className="border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50"
        >
          Mark for Review & Next
        </Button>
      </div>

      {/* Right Action Buttons: Previous & Save & Next */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <Button
          size="sm"
          variant="primary"
          onClick={onSaveAndNext}
          icon={<Check className="w-4 h-4" />}
          iconPosition="right"
        >
          {isLast ? 'Save & Review' : 'Save & Next'}
        </Button>
      </div>
    </div>
  );
};
