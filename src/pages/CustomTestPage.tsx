import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sliders, 
  Zap, 
  BookOpen, 
  Award, 
  GraduationCap, 
  Play, 
  Clock, 
  CheckSquare, 
  AlertCircle,
  HelpCircle,
  Filter
} from 'lucide-react';
import { GATE_DA_SYLLABUS } from '../data/syllabus';
import { ALL_QUESTIONS } from '../data/questions';
import { QuestionType, QuestionDifficulty } from '../types/question';
import { buildCustomTest, CUSTOM_PRESETS, PresetTestDef } from '../lib/customTestBuilder';
import { saveActiveExamSession } from '../engine/persistence/attemptStorage';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const CustomTestPage: React.FC = () => {
  const navigate = useNavigate();

  // Test Params State
  const [testTitle, setTestTitle] = useState('My Custom Practice Test');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['MCQ', 'MSQ', 'NAT']);
  const [selectedDifficulties, setSelectedDifficulties] = useState<QuestionDifficulty[]>(['easy', 'medium', 'hard']);
  const [selectedSources, setSelectedSources] = useState<('DA' | 'CS' | 'original')[]>(['DA', 'CS', 'original']);
  const [questionCount, setQuestionCount] = useState(15);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Compute eligible questions live
  const eligibleQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter(q => {
      if (selectedSubjects.length > 0 && !selectedSubjects.includes(q.subject)) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(q.question_type)) return false;
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(q.difficulty)) return false;

      if (selectedSources.length > 0) {
        const match = selectedSources.some(s => {
          if (s === 'DA') return q.paper === 'DA' && q.source_type === 'official_pyq';
          if (s === 'CS') return q.paper === 'CS' || q.original_paper === 'CS';
          if (s === 'original') return q.source_type === 'original';
          return false;
        });
        if (!match) return false;
      }

      if (verifiedOnly && q.verification_status !== 'verified') return false;

      return true;
    });
  }, [selectedSubjects, selectedTypes, selectedDifficulties, selectedSources, verifiedOnly]);

  // Apply a preset
  const handleApplyPreset = (preset: PresetTestDef) => {
    setQuestionCount(preset.count);
    setDurationMinutes(preset.durationMinutes);
    setTestTitle(preset.name);
  };

  // Launch the customized test
  const handleGenerateAndStart = () => {
    if (eligibleQuestions.length === 0) {
      alert('No eligible questions found with your criteria. Please relax some filters.');
      return;
    }

    const result = buildCustomTest({
      title: testTitle,
      subjects: selectedSubjects.length > 0 ? selectedSubjects : undefined,
      questionTypes: selectedTypes,
      difficulties: selectedDifficulties,
      sources: selectedSources,
      verifiedOnly,
      questionCount,
      durationMinutes
    });

    if (!result.success || !result.testConfig) {
      alert(result.error || 'Failed to generate test.');
      return;
    }

    const config = result.testConfig;

    // Initialize session and navigate to exam
    saveActiveExamSession({
      testId: config.id,
      testTitle: config.title,
      attemptId: `attempt-custom-${Date.now()}`,
      startTime: Date.now(),
      deadlineTimestamp: Date.now() + config.durationMinutes * 60 * 1000,
      durationMinutes: config.durationMinutes,
      currentQuestionIndex: 0,
      activeSectionId: config.sections[0]?.id || 'sec-main',
      questionIds: config.questionIds,
      responses: {},
      paletteStates: config.questionIds.reduce((acc, id, idx) => {
        acc[id] = idx === 0 ? 'not_answered' : 'not_visited';
        return acc;
      }, {} as any),
      timeSpentSeconds: {},
      isSubmitted: false
    });

    navigate(`/exam/${config.id}`);
  };

  const getPresetIcon = (icon: string) => {
    switch (icon) {
      case 'Zap': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-sky-500" />;
      case 'Award': return <Award className="w-4 h-4 text-purple-500" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      default: return <Sliders className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">In [Builder]:</span>
          <Badge variant="primary">Custom Test Generator</Badge>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Build Your Own Practice Examination
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tailor questions by subject, difficulty, sources, and timing to focus exactly on your weak areas.
        </p>
      </div>

      {/* Preset Quick Chooser */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Start Presets:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CUSTOM_PRESETS.map(p => (
            <div
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className="notebook-cell p-3.5 cursor-pointer hover:border-sky-400 dark:hover:border-sky-600 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {getPresetIcon(p.icon)}
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                  {p.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{p.count} Questions</span>
                <span>{p.durationMinutes} Mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Builder Configuration Form */}
      <div className="notebook-cell p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-lg space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Test Title:
          </label>
          <input
            type="text"
            value={testTitle}
            onChange={e => setTestTitle(e.target.value)}
            className="w-full max-w-md px-3 py-2 text-xs sm:text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Subjects Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Target Subjects (leave all unchecked for full syllabus):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {GATE_DA_SYLLABUS.map(sub => {
              const checked = selectedSubjects.includes(sub.name);
              return (
                <label
                  key={sub.id}
                  className={`flex items-center gap-2 p-2.5 rounded-md border text-xs cursor-pointer transition select-none ${
                    checked 
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-900 dark:text-sky-200' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelectedSubjects(prev => 
                        checked ? prev.filter(s => s !== sub.name) : [...prev, sub.name]
                      );
                    }}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="truncate">{sub.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Question Types & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Question Types:
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {(['MCQ', 'MSQ', 'NAT'] as QuestionType[]).map(type => {
                const checked = selectedTypes.includes(type);
                return (
                  <label
                    key={type}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer select-none ${
                      checked 
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-900 dark:text-sky-200' 
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedTypes(prev => checked ? prev.filter(t => t !== type) : [...prev, type]);
                      }}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="font-mono font-bold">{type}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Difficulty Levels:
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {(['easy', 'medium', 'hard'] as QuestionDifficulty[]).map(diff => {
                const checked = selectedDifficulties.includes(diff);
                return (
                  <label
                    key={diff}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer select-none capitalize ${
                      checked 
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-900 dark:text-sky-200' 
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedDifficulties(prev => checked ? prev.filter(d => d !== diff) : [...prev, diff]);
                      }}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>{diff}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Source & Verified Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Question Sources:
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: 'DA', label: 'Official GATE DA' },
                { id: 'CS', label: 'Relevant GATE CSE Overlap' },
                { id: 'original', label: 'Original Practice Bank' }
              ].map(s => {
                const checked = selectedSources.includes(s.id as any);
                return (
                  <label
                    key={s.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer select-none ${
                      checked 
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-900 dark:text-sky-200' 
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedSources(prev => 
                          checked ? prev.filter(x => x !== s.id) : [...prev, s.id as any]
                        );
                      }}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>{s.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Include verified official answer keys only</span>
            </label>
          </div>
        </div>

        {/* Question Count & Duration Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <span>Question Count:</span>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{questionCount} Qs</span>
            </div>
            <input
              type="range"
              min="5"
              max={Math.max(10, Math.min(65, eligibleQuestions.length))}
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>5 Qs</span>
              <span>Available in bank: {eligibleQuestions.length}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <span>Duration (Minutes):</span>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{durationMinutes} Mins</span>
            </div>
            <input
              type="range"
              min="10"
              max="180"
              step="5"
              value={durationMinutes}
              onChange={e => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>10 min (Sprint)</span>
              <span>180 min (Full Exam)</span>
            </div>
          </div>
        </div>

        {/* Eligible Questions Summary and Launch Action */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-900 dark:text-white font-mono">{eligibleQuestions.length}</span> questions match your configuration criteria.
            {eligibleQuestions.length < questionCount && (
              <span className="text-amber-600 dark:text-amber-400 block sm:inline sm:ml-2">
                (Test will include all {eligibleQuestions.length} matching questions).
              </span>
            )}
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={handleGenerateAndStart}
            disabled={eligibleQuestions.length === 0}
            icon={<Play className="w-4 h-4" />}
          >
            Generate & Launch Custom Test
          </Button>
        </div>
      </div>
    </div>
  );
};
