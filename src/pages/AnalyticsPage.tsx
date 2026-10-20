import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  BrainCircuit, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { getUserProgress } from '../engine/persistence/attemptStorage';
import { GATE_DA_SYLLABUS } from '../data/syllabus';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const AnalyticsPage: React.FC = () => {
  const progress = getUserProgress();
  const tests = progress.completedTests;

  // Aggregate Subject Statistics across all completed tests
  const subjectStats = useMemo(() => {
    const stats: Record<string, { total: number; correct: number; incorrect: number; marks: number }> = {};

    GATE_DA_SYLLABUS.forEach(s => {
      stats[s.name] = { total: 0, correct: 0, incorrect: 0, marks: 0 };
    });

    for (const test of tests) {
      for (const [sub, data] of Object.entries(test.subjectBreakdown)) {
        if (!stats[sub]) {
          stats[sub] = { total: 0, correct: 0, incorrect: 0, marks: 0 };
        }
        stats[sub].total += data.total;
        stats[sub].correct += data.correct;
        stats[sub].incorrect += data.incorrect;
        stats[sub].marks += data.marks;
      }
    }

    return stats;
  }, [tests]);

  // Aggregate Question Type Statistics
  const typeStats = useMemo(() => {
    const stats = {
      MCQ: { total: 0, correct: 0, incorrect: 0 },
      MSQ: { total: 0, correct: 0, incorrect: 0 },
      NAT: { total: 0, correct: 0, incorrect: 0 }
    };

    for (const test of tests) {
      for (const type of ['MCQ', 'MSQ', 'NAT'] as const) {
        const d = test.questionTypeBreakdown[type];
        if (d) {
          stats[type].total += d.total;
          stats[type].correct += d.correct;
          stats[type].incorrect += d.incorrect;
        }
      }
    }

    return stats;
  }, [tests]);

  // Overall performance aggregates
  const overall = useMemo(() => {
    if (tests.length === 0) return { totalQuestions: 0, accuracy: 0, totalMarks: 0, avgScore: 0 };
    const totalQ = tests.reduce((sum, t) => sum + t.totalQuestions, 0);
    const totalCorrect = tests.reduce((sum, t) => sum + t.correctCount, 0);
    const totalAttempted = tests.reduce((sum, t) => sum + (t.correctCount + t.incorrectCount), 0);
    const totalMarks = tests.reduce((sum, t) => sum + t.totalMarksObtained, 0);

    return {
      totalQuestions: totalQ,
      accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
      totalMarks: Number(totalMarks.toFixed(1)),
      avgScore: Number((totalMarks / tests.length).toFixed(1))
    };
  }, [tests]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">In [Analytics]:</span>
          <Badge variant="primary">Real Performance Telemetry</Badge>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Progress & Readiness Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Empirical accuracy and subject mastery derived exclusively from your local examination attempts.
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="notebook-cell p-10 text-center bg-white dark:bg-slate-900 rounded-lg">
          <BarChart3 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Analytics Available Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Take at least one mock examination to generate subject mastery charts and pace breakdowns.
          </p>
          <Link to="/mocks">
            <Button size="sm" variant="primary">
              Take a Mock Test
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="notebook-cell p-4 bg-white dark:bg-slate-900 rounded-lg">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Total Evaluated
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white">
                {overall.totalQuestions}
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 block">Questions tested</span>
            </div>

            <div className="notebook-cell p-4 bg-white dark:bg-slate-900 rounded-lg">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Composite Accuracy
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {overall.accuracy}%
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Across all attempted</span>
            </div>

            <div className="notebook-cell p-4 bg-white dark:bg-slate-900 rounded-lg">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Average Test Score
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-sky-600 dark:text-sky-400">
                {overall.avgScore}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Marks per test attempt</span>
            </div>

            <div className="notebook-cell p-4 bg-white dark:bg-slate-900 rounded-lg">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Total Test Papers
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-600 dark:text-purple-400">
                {tests.length}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Completed & reviewed</span>
            </div>
          </div>

          {/* Subject Mastery Progress Bars */}
          <div className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-sky-600" />
              <span>Subject Accuracy & Mastery</span>
            </h2>
            <div className="space-y-3.5">
              {Object.entries(subjectStats).map(([subName, data]) => {
                const attempted = data.correct + data.incorrect;
                const acc = attempted > 0 ? Math.round((data.correct / attempted) * 100) : 0;

                return (
                  <div key={subName} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {subName}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-slate-500 text-[11px]">
                        <span>{data.correct}/{attempted} correct</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{acc}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          acc >= 70 ? 'bg-emerald-500' : acc >= 40 ? 'bg-sky-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${attempted > 0 ? acc : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Type Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['MCQ', 'MSQ', 'NAT'] as const).map(type => {
              const d = typeStats[type];
              const att = d.correct + d.incorrect;
              const acc = att > 0 ? Math.round((d.correct / att) * 100) : 0;

              return (
                <div key={type} className="notebook-cell p-4 bg-white dark:bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{type}</span>
                    <Badge variant={type === 'MCQ' ? 'primary' : type === 'MSQ' ? 'purple' : 'warning'}>
                      {acc}% Accuracy
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 font-mono space-y-1">
                    <div>Tested: <strong className="text-slate-700 dark:text-slate-300">{d.total}</strong></div>
                    <div>Correct: <strong className="text-emerald-600 dark:text-emerald-400">{d.correct}</strong></div>
                    <div>Incorrect: <strong className="text-rose-600 dark:text-rose-400">{d.incorrect}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
