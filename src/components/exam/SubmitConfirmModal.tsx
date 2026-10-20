import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PaletteState } from '../../types/exam';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalQuestions: number;
  paletteStates: Record<string, PaletteState>;
  timeRemainingSeconds: number;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  paletteStates,
  timeRemainingSeconds
}) => {
  let answered = 0;
  let notAnswered = 0;
  let markedReview = 0;
  let answeredMarkedReview = 0;
  let notVisited = 0;

  for (const state of Object.values(paletteStates)) {
    if (state === 'answered') answered++;
    else if (state === 'not_answered') notAnswered++;
    else if (state === 'marked_for_review') markedReview++;
    else if (state === 'answered_marked_for_review') answeredMarkedReview++;
    else notVisited++;
  }

  // Any remaining questions in total that haven't been visited
  const accounted = answered + notAnswered + markedReview + answeredMarkedReview + notVisited;
  if (accounted < totalQuestions) {
    notVisited += (totalQuestions - accounted);
  }

  const formatRemaining = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Final Examination Submission"
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to Test
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirmSubmit}>
            Yes, Submit Exam
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Review your attempt status carefully.</span> Once submitted, your answers will be evaluated instantly according to GATE marking rules.
          </div>
        </div>

        {/* Remaining Time Alert */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-md">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>Time Remaining:</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{formatRemaining(timeRemainingSeconds)}</span>
        </div>

        {/* Detailed Summary Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
              <tr>
                <th className="py-2 px-3">Status Category</th>
                <th className="py-2 px-3 text-right">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Answered</td>
                <td className="py-2 px-3 text-right font-bold">{answered}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-rose-600 dark:text-rose-400 font-medium">Visited but Unanswered</td>
                <td className="py-2 px-3 text-right font-bold">{notAnswered}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-purple-600 dark:text-purple-400 font-medium">Marked for Review</td>
                <td className="py-2 px-3 text-right font-bold">{markedReview}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-purple-700 dark:text-purple-300 font-medium">Answered & Marked for Review</td>
                <td className="py-2 px-3 text-right font-bold">{answeredMarkedReview}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-500">Not Visited</td>
                <td className="py-2 px-3 text-right font-bold">{notVisited}</td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold">
                <td className="py-2 px-3 text-slate-900 dark:text-white">Total Questions</td>
                <td className="py-2 px-3 text-right text-slate-900 dark:text-white">{totalQuestions}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
