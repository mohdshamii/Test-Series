import { Question, QuestionFilter, QuestionType, QuestionDifficulty } from '../types/question';
import { TestConfig } from '../types/exam';
import { ALL_QUESTIONS, filterQuestions } from '../data/questions';

export interface CustomTestParams {
  title?: string;
  subjects?: string[];
  chapters?: string[];
  questionTypes?: QuestionType[];
  difficulties?: QuestionDifficulty[];
  sources?: ('DA' | 'CS' | 'original')[];
  years?: number[];
  verifiedOnly?: boolean;
  questionCount: number;
  durationMinutes: number;
}

export interface CustomTestBuildResult {
  success: boolean;
  testConfig?: TestConfig;
  error?: string;
  eligibleCount: number;
  requestedCount: number;
}

/**
 * Builds a custom TestConfig from user selected filters and question count
 */
export function buildCustomTest(params: CustomTestParams): CustomTestBuildResult {
  const filter: QuestionFilter = {
    subjects: params.subjects,
    chapters: params.chapters,
    questionTypes: params.questionTypes,
    difficulties: params.difficulties,
    sources: params.sources,
    years: params.years,
    verifiedOnly: params.verifiedOnly
  };

  const eligibleQuestions = filterQuestions(ALL_QUESTIONS, filter);

  if (eligibleQuestions.length === 0) {
    return {
      success: false,
      error: 'No questions matched your selected filter criteria. Please broaden your selection.',
      eligibleCount: 0,
      requestedCount: params.questionCount
    };
  }

  // Shuffle eligible questions randomly without duplicates
  const shuffled = [...eligibleQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(params.questionCount, shuffled.length));

  const totalMarks = selected.reduce((sum, q) => sum + q.marks, 0);
  const testId = `custom-test-${Date.now()}`;
  const title = params.title || `Custom Test (${selected.length} Questions)`;

  // Split into GA and Technical if GA questions are present, else single section
  const gaQuestions = selected.filter(q => q.subject === 'General Aptitude');
  const techQuestions = selected.filter(q => q.subject !== 'General Aptitude');

  const sections = [];
  if (gaQuestions.length > 0 && techQuestions.length > 0) {
    sections.push({
      id: 'sec-ga',
      name: 'General Aptitude',
      questionIds: gaQuestions.map(q => q.question_id)
    });
    sections.push({
      id: 'sec-tech',
      name: 'Technical Section',
      questionIds: techQuestions.map(q => q.question_id)
    });
  } else {
    sections.push({
      id: 'sec-main',
      name: 'Practice Questions',
      questionIds: selected.map(q => q.question_id)
    });
  }

  const testConfig: TestConfig = {
    id: testId,
    title,
    subtitle: `Custom practice test generated on ${new Date().toLocaleDateString()}`,
    description: `Targeted practice session with ${selected.length} questions across ${params.subjects?.join(', ') || 'selected topics'}.`,
    durationMinutes: params.durationMinutes,
    totalMarks,
    totalQuestions: selected.length,
    sections,
    questionIds: selected.map(q => q.question_id),
    paperType: 'custom',
    instructions: [
      `Custom examination with ${selected.length} questions.`,
      `Configured duration: ${params.durationMinutes} minutes.`,
      'Standard marking scheme applies: MCQ (-1/3 or -2/3), MSQ (exact set match, no negative), NAT (tolerance range, no negative).'
    ]
  };

  return {
    success: true,
    testConfig,
    eligibleCount: eligibleQuestions.length,
    requestedCount: params.questionCount
  };
}

export interface PresetTestDef {
  id: string;
  name: string;
  description: string;
  count: number;
  durationMinutes: number;
  icon: string;
}

export const CUSTOM_PRESETS: PresetTestDef[] = [
  {
    id: 'quick-10',
    name: '10-Question Quick Drill',
    description: 'Fast 15-minute diagnostic quiz to test recall and speed on mixed topics.',
    count: 10,
    durationMinutes: 15,
    icon: 'Zap'
  },
  {
    id: 'chapter-20',
    name: '20-Question Subject Deep Dive',
    description: 'Focused 40-minute practice on selected technical chapters with in-depth solutions.',
    count: 20,
    durationMinutes: 40,
    icon: 'BookOpen'
  },
  {
    id: 'sectional-30',
    name: '30-Question Sectional Test',
    description: '60-minute sectional mock exam simulating official section weightage.',
    count: 30,
    durationMinutes: 60,
    icon: 'Award'
  },
  {
    id: 'full-mock',
    name: 'Full-Length 65-Question Mock',
    description: '180-minute comprehensive simulation with 10 General Aptitude + 55 Technical questions.',
    count: 65,
    durationMinutes: 180,
    icon: 'GraduationCap'
  }
];
