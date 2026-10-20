import React from 'react';
import { Clock, Calculator, Send, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ExamSection } from '../../types/exam';

interface ExamHeaderProps {
  title: string;
  timeRemainingSeconds: number;
  sections: ExamSection[];
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  onOpenCalculator: () => void;
  onSubmitClick: () => void;
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  title,
  timeRemainingSeconds,
  sections,
  activeSectionId,
  onSelectSection,
  onOpenCalculator,
  onSubmitClick
}) => {
  const isUrgent = timeRemainingSeconds < 300 && timeRemainingSeconds > 0; // Less than 5 mins

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs sticky top-0 z-30 select-none">
      {/* Top Bar: Title, Timer, Submit */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Test Title & Details */}
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded bg-slate-900 dark:bg-sky-500 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
            DA
          </div>
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {title}
            </h1>
            <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
              Official CBT Pattern • Autosaved to Local Storage
            </p>
          </div>
        </div>

        {/* Right: Controls & Timer */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Virtual Calculator button */}
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCalculator}
            icon={<Calculator className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
            title="Open Scientific Calculator"
            className="hidden sm:inline-flex"
          >
            Calculator
          </Button>

          {/* Countdown Timer Display */}
          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs sm:text-sm font-bold border transition ${
              isUrgent 
                ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700'
            }`}
          >
            {isUrgent ? (
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            ) : (
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            )}
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          {/* Submit Test Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={onSubmitClick}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Submit Test
          </Button>
        </div>
      </div>

      {/* Bottom Bar: Section Tabs (if multi-section) */}
      {sections.length > 1 && (
        <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
              Sections:
            </span>
            {sections.map(sec => {
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => onSelectSection(sec.id)}
                  className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{sec.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-sky-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {sec.questionIds.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
