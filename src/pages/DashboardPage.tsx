import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Layers, 
  FileText, 
  Bookmark, 
  AlertCircle, 
  Award, 
  Clock, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Grid3X3,
  Percent,
  Code,
  Database,
  Cpu,
  Sparkles,
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { GATE_DA_SYLLABUS } from '../data/syllabus';
import { getQuestionBankStats, getAllQuestions } from '../data/questions';
import { getUserProgress, getActiveExamSession } from '../engine/persistence/attemptStorage';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const progress = getUserProgress();
  const activeSession = getActiveExamSession();
  const stats = useMemo(() => getQuestionBankStats(), []);
  const allQuestions = useMemo(() => getAllQuestions(), []);

  // Compute actual completed test statistics
  const testStats = useMemo(() => {
    const tests = progress.completedTests;
    if (tests.length === 0) {
      return { totalTests: 0, avgAccuracy: 0, avgScore: 0, bestScore: 0 };
    }
    const totalAccuracy = tests.reduce((sum, t) => sum + t.accuracy, 0);
    const totalScore = tests.reduce((sum, t) => sum + t.totalMarksObtained, 0);
    const bestScore = Math.max(...tests.map(t => t.totalMarksObtained));

    return {
      totalTests: tests.length,
      avgAccuracy: Math.round(totalAccuracy / tests.length),
      avgScore: Number((totalScore / tests.length).toFixed(1)),
      bestScore
    };
  }, [progress.completedTests]);

  // Subject icon mapping helper
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5 text-indigo-500" />;
      case 'Percent': return <Percent className="w-5 h-5 text-emerald-500" />;
      case 'Grid3X3': return <Grid3X3 className="w-5 h-5 text-sky-500" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'Code': return <Code className="w-5 h-5 text-amber-500" />;
      case 'Database': return <Database className="w-5 h-5 text-teal-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-rose-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-500" />;
      default: return <HelpCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Active Session Resume Banner if an active exam exists */}
      {activeSession && !activeSession.isSubmitted && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                Unfinished Test in Progress
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {activeSession.testTitle}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/exam/${activeSession.testId}`)}
            icon={<Play className="w-3.5 h-3.5" />}
          >
            Resume Test
          </Button>
        </div>
      )}

      {/* Hero Welcome Card: Notebook Prompt In [1] */}
      <div className="notebook-cell p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-lg border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sky-400 text-xs font-semibold">In [1]:</span>
              <Badge variant="primary" size="sm">GATE DA 2026</Badge>
              <Badge variant="success" size="sm">Static Client Architecture</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Data Science & Artificial Intelligence Test Series
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete, rigorous test platform dedicated exclusively to GATE DA with syllabus-mapped GATE CSE previous year questions. 
              Zero servers, 100% offline-ready, with LaTeX equations, scientific calculator, and local attempt analytics.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/mocks')}
              icon={<Play className="w-4 h-4" />}
            >
              Start Full Mock Test
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/custom-test')}
              icon={<PlusCircle className="w-4 h-4" />}
              className="text-white border-slate-600 hover:bg-slate-800"
            >
              Build Custom Test
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row: 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Bank */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Question Bank
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
            {stats.totalQuestions}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-sky-600 dark:text-sky-400">{stats.totalVerifiedPyqs} Verified</span>
            <span>•</span>
            <span>{stats.totalOriginalPractice} Practice</span>
          </div>
        </div>

        {/* Metric 2: Completed Tests */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Tests Attempted
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
            {testStats.totalTests}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Avg Score: <span className="font-semibold text-slate-700 dark:text-slate-300">{testStats.avgScore}</span> (Best: {testStats.bestScore})
          </div>
        </div>

        {/* Metric 3: Accuracy */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Overall Accuracy
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
            {testStats.avgAccuracy}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Based on completed evaluations
          </div>
        </div>

        {/* Metric 4: Bookmarks & Errors */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Review Queue
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 font-mono">
              {progress.bookmarks.length}
            </span>
            <span className="text-xs text-slate-400">Saved</span>
            <span className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400 font-mono">
              {Object.keys(progress.incorrectQuestions).length}
            </span>
            <span className="text-xs text-slate-400">Errors</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            <Link to="/incorrect" className="text-rose-600 dark:text-rose-400 hover:underline font-medium">
              Retry errors →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link
          to="/mocks"
          className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-sky-600 transition" />
          </div>
          <div className="font-semibold text-sm text-slate-900 dark:text-white">Mock Examinations</div>
          <div className="text-xs text-slate-500 mt-1">100 CBT papers: 25 Full Mocks + 75 Chapter & Subject Tests</div>
        </Link>

        <Link
          to="/pyqs"
          className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition" />
          </div>
          <div className="font-semibold text-sm text-slate-900 dark:text-white">Previous-Year Papers</div>
          <div className="text-xs text-slate-500 mt-1">Official GATE DA (2024, 2025) & GATE CSE PYQs</div>
        </Link>

        <Link
          to="/subjects"
          className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-600 transition" />
          </div>
          <div className="font-semibold text-sm text-slate-900 dark:text-white">Subject-wise Practice</div>
          <div className="text-xs text-slate-500 mt-1">Deep practice by syllabus modules & chapters</div>
        </Link>

        <Link
          to="/custom-test"
          className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition" />
          </div>
          <div className="font-semibold text-sm text-slate-900 dark:text-white">Custom Test Builder</div>
          <div className="text-xs text-slate-500 mt-1">Build targeted tests with custom timer & filters</div>
        </Link>
      </div>

      {/* Syllabus Mastery Grid: All 8 Subjects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Syllabus Breakdown & Subject Mastery
            </h2>
            <p className="text-xs text-slate-500">
              Official GATE DA technical syllabus chapters and verified questions
            </p>
          </div>
          <Link to="/subjects" className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline">
            View all subjects →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {GATE_DA_SYLLABUS.map(sub => {
            const subQuestions = allQuestions.filter(q => q.subject === sub.name);
            return (
              <div
                key={sub.id}
                className="notebook-cell p-4 hover:border-sky-300 dark:hover:border-sky-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800">
                      {getSubjectIcon(sub.icon)}
                    </div>
                    <Badge variant={sub.isGeneralAptitude ? "secondary" : "primary"}>
                      Weight: {sub.weightageApprox}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight mb-1">
                    {sub.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-600 dark:text-slate-400">
                    {subQuestions.length} Questions
                  </span>
                  <Link
                    to={`/subjects/${sub.id}`}
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 font-medium flex items-center gap-1"
                  >
                    <span>Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Test History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Recent Test Attempts
            </h2>
            <p className="text-xs text-slate-500">
              Past performance evaluated according to GATE scoring rules
            </p>
          </div>
          {progress.completedTests.length > 0 && (
            <Link to="/history" className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline">
              Full history ({progress.completedTests.length}) →
            </Link>
          )}
        </div>

        {progress.completedTests.length === 0 ? (
          <div className="notebook-cell p-8 text-center bg-white dark:bg-slate-900 rounded-lg">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No test attempts recorded yet.</p>
            <p className="text-xs text-slate-500 mt-1">Take a full mock or quick sectional test to generate performance analytics.</p>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/mocks')}
              className="mt-4"
              icon={<Play className="w-3.5 h-3.5" />}
            >
              Start First Mock Test
            </Button>
          </div>
        ) : (
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Test Title</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Correct / Wrong</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {progress.completedTests.slice(0, 5).map(attempt => (
                    <tr key={attempt.attemptId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-slate-100">
                        {attempt.testTitle}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {new Date(attempt.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-bold text-sky-600 dark:text-sky-400">
                        {attempt.totalMarksObtained} / {attempt.maxMarks}
                        <span className="text-[10px] text-slate-400 ml-1">({attempt.percentage}%)</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {attempt.accuracy}%
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{attempt.correctCount}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">{attempt.incorrectCount}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/result/${attempt.attemptId}`, { state: { result: attempt } })}
                        >
                          Review Solution
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
