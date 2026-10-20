import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { ALL_QUESTIONS } from '../data/questions';
import { Question } from '../types/question';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { QuestionView } from '../components/exam/QuestionView';
import { isBookmarked, toggleBookmark, saveActiveExamSession } from '../engine/persistence/attemptStorage';

export const PreviousYearsPage: React.FC = () => {
  const navigate = useNavigate();

  // Tab: 'da' vs 'cse' vs 'all'
  const [activeTab, setActiveTab] = useState<'all' | 'da' | 'cse'>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Solution reveal toggle in practice
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [practiceResponses, setPracticeResponses] = useState<Record<string, any>>({});

  // Filter PYQ questions
  const pyqQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter(q => {
      // Must be official PYQ
      if (q.source_type !== 'official_pyq') return false;

      // Filter by paper tab
      if (activeTab === 'da' && (q.paper !== 'DA' || q.original_paper === 'CS')) return false;
      if (activeTab === 'cse' && q.original_paper !== 'CS' && q.paper !== 'CS') return false;

      // Filter by year
      if (selectedYear !== 'all' && q.exam_year !== selectedYear) return false;

      // Filter by subject
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const match = 
          q.question_text.toLowerCase().includes(query) ||
          q.subject.toLowerCase().includes(query) ||
          q.chapter.toLowerCase().includes(query) ||
          q.topic.toLowerCase().includes(query);
        if (!match) return false;
      }

      return true;
    });
  }, [activeTab, selectedYear, selectedSubject, searchQuery]);

  // Distinct available years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    ALL_QUESTIONS.forEach(q => {
      if (q.source_type === 'official_pyq' && q.exam_year) {
        years.add(q.exam_year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, []);

  // Distinct subjects
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    ALL_QUESTIONS.forEach(q => {
      if (q.source_type === 'official_pyq') {
        subjects.add(q.subject);
      }
    });
    return Array.from(subjects).sort();
  }, []);

  // Start timed test with these PYQs
  const handleStartPyqTest = () => {
    if (pyqQuestions.length === 0) return;
    const testId = `pyq-timed-${Date.now()}`;
    const questionIds = pyqQuestions.map(q => q.question_id);
    const durationMinutes = Math.max(15, Math.ceil(questionIds.length * 2.5));

    saveActiveExamSession({
      testId,
      testTitle: `Official PYQ Practice Test (${questionIds.length} Questions)`,
      attemptId: `attempt-pyq-${Date.now()}`,
      startTime: Date.now(),
      deadlineTimestamp: Date.now() + durationMinutes * 60 * 1000,
      durationMinutes,
      currentQuestionIndex: 0,
      activeSectionId: 'sec-pyq',
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
      {/* Header Banner */}
      <div className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">In [PYQ]:</span>
              <Badge variant="success">Verified Answer Keys</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Official Previous-Year Questions (PYQs)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Authentic GATE DA (2024, 2025) questions and carefully mapped GATE CSE questions testing overlapping syllabus concepts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartPyqTest}
              disabled={pyqQuestions.length === 0}
              icon={<Clock className="w-3.5 h-3.5" />}
            >
              Start Timed PYQ Test ({pyqQuestions.length} Qs)
            </Button>
          </div>
        </div>

        {/* Paper Source Tabs */}
        <div className="pt-4 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'all'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All PYQs
          </button>
          <button
            onClick={() => setActiveTab('da')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'da'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official GATE DA Only</span>
          </button>
          <button
            onClick={() => setActiveTab('cse')}
            className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'cse'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>GATE CSE Overlap PYQs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search PYQ text, algorithms, matrices, equations..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold">Year:</span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Years</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Subject selector */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold">Subject:</span>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 max-w-[160px]"
            >
              <option value="all">All Subjects</option>
              {availableSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span>Displaying verified exam questions with complete provenance</span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
            {pyqQuestions.length} Questions
          </span>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {pyqQuestions.length === 0 ? (
          <div className="notebook-cell p-8 text-center bg-white dark:bg-slate-900 rounded-lg">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No previous year questions match the chosen filters.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveTab('all');
                setSelectedYear('all');
                setSelectedSubject('all');
                setSearchQuery('');
              }}
              className="mt-3"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          pyqQuestions.map((q, idx) => {
            const isRevealed = revealedSolutions[q.question_id] || false;
            const userResp = practiceResponses[q.question_id] ?? null;
            const bookmarked = isBookmarked(q.question_id);

            return (
              <div
                key={q.question_id}
                className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg"
              >
                {/* Provenance Box for CSE Questions */}
                {q.original_paper === 'CS' && (
                  <div className="mb-3 p-2.5 rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-300 flex items-center justify-between">
                    <div>
                      <strong>GATE CSE {q.exam_year} Overlap:</strong> Originally tested in CSE under <em>{q.original_subject}</em>, directly relevant to GATE DA <em>{q.subject} → {q.chapter}</em>.
                    </div>
                    <Badge variant="purple" size="sm">Direct DA Relevance</Badge>
                  </div>
                )}

                <QuestionView
                  question={q}
                  questionNumber={idx + 1}
                  userResponse={userResp}
                  onResponseChange={newResp => {
                    setPracticeResponses(prev => ({ ...prev, [q.question_id]: newResp }));
                  }}
                  mode={isRevealed ? 'review' : 'practice'}
                  isBookmarked={bookmarked}
                  onToggleBookmark={() => toggleBookmark(q.question_id)}
                />

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="font-mono text-slate-400 text-[11px]">
                    Year: {q.exam_year} • Paper: {q.paper} • {q.topic}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isRevealed ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setRevealedSolutions(prev => ({ ...prev, [q.question_id]: true }));
                        }}
                      >
                        Check Answer & Solution
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
                        Reset Question
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
