import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Search, 
  PlusCircle,
  FileCheck,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ALL_TESTS } from '../data/mockTests';
import { GATE_DA_SYLLABUS } from '../data/syllabus';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const FullMocksPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'all' | 'full_mock' | 'chapter_test' | 'sectional' | 'pyq_paper'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const filteredTests = useMemo(() => {
    return ALL_TESTS.filter(t => {
      if (filterType !== 'all' && t.paperType !== filterType) {
        return false;
      }
      if (selectedSubject !== 'all') {
        if (!t.subject || t.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
          // If it's a full mock and selectedSubject is not all, exclude unless GA/Math matches
          return false;
        }
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchSubtitle = t.subtitle?.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchSubject = t.subject?.toLowerCase().includes(q);
        const matchChapter = t.chapter?.toLowerCase().includes(q);
        if (!matchTitle && !matchSubtitle && !matchDesc && !matchSubject && !matchChapter) {
          return false;
        }
      }
      return true;
    });
  }, [filterType, selectedSubject, searchQuery]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterType, selectedSubject, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / PAGE_SIZE));
  const paginatedTests = filteredTests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const counts = useMemo(() => {
    return {
      all: ALL_TESTS.length,
      full_mock: ALL_TESTS.filter(t => t.paperType === 'full_mock').length,
      chapter_test: ALL_TESTS.filter(t => t.paperType === 'chapter_test').length,
      sectional: ALL_TESTS.filter(t => t.paperType === 'sectional').length,
      pyq_paper: ALL_TESTS.filter(t => t.paperType === 'pyq_paper').length
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">In [MockTests]:</span>
            <Badge variant="primary">Authentic CBT Examination Engine</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Full-Length, Subject-Wise & Chapter Mock Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse our comprehensive test series of 100 mock papers covering the complete official GATE DA syllabus with realistic CBT timer, virtual calculator, and detailed solutions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/custom-test')}
          icon={<PlusCircle className="w-4 h-4" />}
        >
          Build Custom Test
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All Tests (${counts.all})` },
            { id: 'full_mock', label: `Grand Mocks (${counts.full_mock})` },
            { id: 'chapter_test', label: `Chapter Tests (${counts.chapter_test})` },
            { id: 'sectional', label: `Subject Sectionals (${counts.sectional})` },
            { id: 'pyq_paper', label: `Official PYQ Papers (${counts.pyq_paper})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition ${
                filterType === tab.id
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Subject Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Subjects</option>
            {GATE_DA_SYLLABUS.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Showing {filteredTests.length} tests {filterType !== 'all' ? `in category` : ''}</span>
        {totalPages > 1 && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* Test Paper Cards Grid */}
      {paginatedTests.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No tests match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing search keywords or selecting "All Tests".</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => { setFilterType('all'); setSelectedSubject('all'); setSearchQuery(''); }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedTests.map(test => {
            return (
              <div
                key={test.id}
                className="notebook-cell p-5 flex flex-col justify-between hover:border-sky-300 dark:hover:border-sky-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge 
                        variant={
                          test.paperType === 'full_mock' 
                            ? 'primary' 
                            : test.paperType === 'pyq_paper' 
                            ? 'success' 
                            : test.paperType === 'chapter_test'
                            ? 'secondary'
                            : 'purple'
                        }
                      >
                        {test.paperType === 'full_mock' 
                          ? 'Grand Mock' 
                          : test.paperType === 'pyq_paper' 
                          ? 'Official Paper' 
                          : test.paperType === 'chapter_test'
                          ? 'Chapter Drill'
                          : 'Sectional Mock'}
                      </Badge>
                      {test.examYear && (
                        <Badge variant="slate">{test.examYear}</Badge>
                      )}
                      {test.subject && (
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {test.subject}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>{test.durationMinutes} min</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {test.title}
                  </h3>
                  {test.subtitle && (
                    <p className="text-xs font-medium text-sky-700 dark:text-sky-300 mb-2">
                      {test.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {test.description}
                  </p>

                  {/* Test Specs Bar */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700/60 text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Questions</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{test.totalQuestions}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Max Marks</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{test.totalMarks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Sections</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{test.sections.length}</span>
                    </div>
                  </div>

                  {/* Section breakdown tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {test.sections.map(sec => (
                      <span
                        key={sec.id}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                      >
                        {sec.name}: {sec.questionIds.length} Qs
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Standard GATE Marking Rules
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/exam/${test.id}`)}
                    icon={<Play className="w-3.5 h-3.5" />}
                  >
                    Start Test
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            icon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
