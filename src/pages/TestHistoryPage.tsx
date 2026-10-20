import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Clock, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { getUserProgress } from '../engine/persistence/attemptStorage';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const TestHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const progress = getUserProgress();
  const completed = progress.completedTests;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">In [History]:</span>
          <Badge variant="primary">{completed.length} Completed Tests</Badge>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Examination History & Logs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review all your past mock test attempts, scores, and complete solution evaluations.
        </p>
      </div>

      {completed.length === 0 ? (
        <div className="notebook-cell p-10 text-center bg-white dark:bg-slate-900 rounded-lg">
          <History className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Tests Completed Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Take your first full-length mock or sectional test to start tracking scores and review histories.
          </p>
          <Button size="sm" variant="primary" onClick={() => navigate('/mocks')}>
            Browse Mock Tests
          </Button>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Test Title</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3">Correct / Wrong</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {completed.map(attempt => (
                  <tr key={attempt.attemptId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-900 dark:text-slate-100">
                      <div>{attempt.testTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {attempt.attemptId}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {new Date(attempt.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {formatTime(attempt.timeUsedSeconds)}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-sky-600 dark:text-sky-400">
                      {attempt.totalMarksObtained} / {attempt.maxMarks}
                      <span className="text-[10px] text-slate-400 ml-1">({attempt.percentage}%)</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {attempt.accuracy}%
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{attempt.correctCount}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">{attempt.incorrectCount}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/result/${attempt.attemptId}`, { state: { result: attempt } })}
                        >
                          Review Solutions
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
