import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Play, 
  RotateCcw,
  Bookmark,
  AlertCircle,
  HelpCircle,
  BrainCircuit,
  Percent,
  Grid3X3,
  TrendingUp,
  Code,
  Database,
  Cpu,
  Sparkles,
  Layers
} from 'lucide-react';
import { GATE_DA_SYLLABUS, getSubjectById } from '../data/syllabus';
import { getAllQuestions, filterQuestions } from '../data/questions';
import { Question, QuestionFilter, QuestionType, QuestionDifficulty } from '../types/question';
import { getUserProgress, isBookmarked, toggleBookmark } from '../engine/persistence/attemptStorage';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { QuestionView } from '../components/exam/QuestionView';
import { saveActiveExamSession } from '../engine/persistence/attemptStorage';

export const SubjectPracticePage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId?: string }>();
  const navigate = useNavigate();
  const progress = getUserProgress();

  const selectedSubject = useMemo(() => {
    if (!subjectId) return null;
    return getSubjectById(subjectId);
  }, [subjectId]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<QuestionDifficulty[]>([]);
  const [selectedSources, setSelectedSources] = useState<('DA' | 'CS' | 'original')[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [attemptFilter, setAttemptFilter] = useState<'all' | 'attempted' | 'unattempted' | 'bookmarked' | 'incorrect'>('all');

  // Practice Mode state for inline question practice
  const [practicingQuestionId, setPracticingQuestionId] = useState<string | null>(null);
  const [practiceResponses, setPracticeResponses] = useState<Record<string, any>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const allQuestions = useMemo(() => getAllQuestions(), []);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    let base = allQuestions;
    if (selectedSubject) {
      base = base.filter(q => q.subject.toLowerCase() === selectedSubject.name.toLowerCase());
    }

    const filter: QuestionFilter = {
      searchQuery,
      chapters: selectedChapter !== 'all' ? [selectedChapter] : undefined,
      questionTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
      difficulties: selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
      sources: selectedSources.length > 0 ? selectedSources : undefined,
      verifiedOnly,
      attemptStatus: attemptFilter
    };

    return filterQuestions(base, filter, {
      bookmarkedIds: progress.bookmarks,
      incorrectIds: Object.keys(progress.incorrectQuestions),
      attemptedIds: Object.keys(progress.questionAttempts)
    });
  }, [allQuestions, selectedSubject, searchQuery, selectedChapter, selectedTypes, selectedDifficulties, selectedSources, verifiedOnly, attemptFilter, progress]);

  // Start timed practice test with current filtered questions
  const handleStartTimedPractice = () => {
    if (filteredQuestions.length === 0) {
      alert('No questions match current filters to build a timed test.');
      return;
    }

    const testId = `timed-practice-${Date.now()}`;
    const questionIds = filteredQuestions.map(q => q.question_id);
    const durationMins = Math.max(10, Math.ceil(questionIds.length * 2.5));

    saveActiveExamSession({
      testId,
      testTitle: `${selectedSubject ? selectedSubject.name : 'Targeted'} Practice Session (${questionIds.length} Qs)`,
      attemptId: `attempt-${Date.now()}`,
      startTime: Date.now(),
      deadlineTimestamp: Date.now() + durationMins * 60 * 1000,
      durationMinutes: durationMins,
      currentQuestionIndex: 0,
      activeSectionId: 'sec-practice',
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
      default: return <BookOpen className="w-5 h-5 text-slate-500" />;
    }
  };

  // If no subject selected, render directory of all 8 subjects
  if (!selectedSubject) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">In [Syllabus]:</span>
            <Badge variant="primary">GATE DA Verified Modules</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Subject-Wise Practice Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore and practice questions organized strictly according to the official GATE DA syllabus taxonomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GATE_DA_SYLLABUS.map(sub => {
            const count = allQuestions.filter(q => q.subject === sub.name).length;
            return (
              <div key={sub.id} className="notebook-cell p-5 hover:border-sky-300 dark:hover:border-sky-700 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800">
                        {getSubjectIcon(sub.icon)}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                          {sub.name}
                        </h2>
                        <span className="text-[11px] text-slate-400 font-mono">Code: {sub.code}</span>
                      </div>
                    </div>
                    <Badge variant={sub.isGeneralAptitude ? "secondary" : "primary"}>
                      {sub.weightageApprox}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {sub.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Key Chapters ({sub.chapters.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sub.chapters.map(c => (
                        <span
                          key={c.id}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/exam/subject-test-${sub.id}`)}
                    icon={<Play className="w-3 h-3 text-sky-600" />}
                  >
                    Subject Mock
                  </Button>
                  <Link
                    to={`/subjects/${sub.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700"
                  >
                    <span>Open Subject ({count} Qs)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Subject-specific practice page with deep chapter filters and question cards
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Subject Header */}
      <div className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/subjects" className="text-xs text-slate-400 hover:text-sky-600">
                Subjects
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">{selectedSubject.code}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {selectedSubject.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {selectedSubject.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/exam/subject-test-${selectedSubject.id}`)}
              icon={<Play className="w-3.5 h-3.5" />}
            >
              Full Subject Mock
            </Button>
            {selectedChapter !== 'all' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const chap = selectedSubject.chapters.find(c => c.name === selectedChapter);
                  if (chap) navigate(`/exam/ch-test-${chap.id}`);
                }}
                icon={<Layers className="w-3.5 h-3.5" />}
              >
                Chapter Drill Test
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartTimedPractice}
              icon={<Clock className="w-3.5 h-3.5" />}
            >
              Timed Drill ({filteredQuestions.length} Qs)
            </Button>
          </div>
        </div>

        {/* Chapter Quick Chips */}
        <div className="pt-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setSelectedChapter('all')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
              selectedChapter === 'all'
                ? 'bg-sky-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Chapters
          </button>
          {selectedSubject.chapters.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedChapter(c.name)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition ${
                selectedChapter === c.name
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search questions by keywords, formulas, or topics..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1 text-xs shrink-0">
            {(['MCQ', 'MSQ', 'NAT'] as QuestionType[]).map(type => {
              const active = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedTypes(prev => active ? prev.filter(t => t !== type) : [...prev, type]);
                  }}
                  className={`px-2 py-1 rounded border text-xs font-mono font-medium transition ${
                    active 
                      ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-400' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* Source filters */}
          <div className="flex items-center gap-1 text-xs shrink-0">
            <button
              onClick={() => {
                const isSelected = selectedSources.includes('DA');
                setSelectedSources(prev => isSelected ? prev.filter(s => s !== 'DA') : [...prev, 'DA']);
              }}
              className={`px-2 py-1 rounded border text-xs font-medium transition ${
                selectedSources.includes('DA')
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              DA PYQs
            </button>
            <button
              onClick={() => {
                const isSelected = selectedSources.includes('CS');
                setSelectedSources(prev => isSelected ? prev.filter(s => s !== 'CS') : [...prev, 'CS']);
              }}
              className={`px-2 py-1 rounded border text-xs font-medium transition ${
                selectedSources.includes('CS')
                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              CSE Overlap
            </button>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Attempt Status:</span>
            {(['all', 'unattempted', 'attempted', 'bookmarked', 'incorrect'] as const).map(st => (
              <button
                key={st}
                onClick={() => setAttemptFilter(st)}
                className={`capitalize px-2 py-0.5 rounded transition ${
                  attemptFilter === st 
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-semibold' 
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Verified Only</span>
            </label>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {filteredQuestions.length} Questions Found
            </span>
          </div>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="notebook-cell p-8 text-center bg-white dark:bg-slate-900 rounded-lg">
            <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No questions matched your current filter criteria.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try clearing filters or search term to view all available questions for {selectedSubject.name}.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedChapter('all');
                setSelectedTypes([]);
                setSelectedSources([]);
                setVerifiedOnly(false);
                setAttemptFilter('all');
              }}
              className="mt-3"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredQuestions.map((q, qIdx) => {
            const isRevealed = revealedSolutions[q.question_id] || false;
            const userResp = practiceResponses[q.question_id] ?? null;
            const bookmarked = isBookmarked(q.question_id);

            return (
              <div
                key={q.question_id}
                className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg transition"
              >
                <QuestionView
                  question={q}
                  questionNumber={qIdx + 1}
                  userResponse={userResp}
                  onResponseChange={newResp => {
                    setPracticeResponses(prev => ({ ...prev, [q.question_id]: newResp }));
                  }}
                  mode={isRevealed ? 'review' : 'practice'}
                  isBookmarked={bookmarked}
                  onToggleBookmark={() => toggleBookmark(q.question_id)}
                />

                {/* Practice Mode Control Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[11px]">
                      Topic: {q.topic}
                    </span>
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
                        Submit & View Solution
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
