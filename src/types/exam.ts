import { QuestionType } from './question';

export type PaletteState = 
  | 'not_visited'
  | 'not_answered'
  | 'answered'
  | 'marked_for_review'
  | 'answered_marked_for_review';

export interface ExamSection {
  id: string;
  name: string;
  questionIds: string[];
}

export interface TestConfig {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  sections: ExamSection[];
  questionIds: string[];
  instructions: string[];
  paperType: 'full_mock' | 'sectional' | 'chapter_test' | 'pyq_paper' | 'custom';
  examYear?: number;
  paperCode?: 'DA' | 'CS';
  subject?: string;
  chapter?: string;
}

export type UserQuestionResponse = string | string[] | number | null;

export interface QuestionEvaluationResult {
  questionId: string;
  userResponse: UserQuestionResponse;
  correctAnswer: any;
  isCorrect: boolean;
  isAttempted: boolean;
  marksAwarded: number;
  negativeMarksDeducted: number;
  netMarks: number;
  questionType: QuestionType;
  subject: string;
  chapter: string;
  timeSpentSeconds: number;
}

export interface SectionScore {
  sectionId: string;
  sectionName: string;
  marksObtained: number;
  maxMarks: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
}

export interface ExamResult {
  testId: string;
  testTitle: string;
  attemptId: string;
  timestamp: number;
  durationMinutes: number;
  timeUsedSeconds: number;
  totalMarksObtained: number;
  maxMarks: number;
  percentage: number;
  accuracy: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  reviewMarkedCount: number;
  sectionScores: SectionScore[];
  subjectBreakdown: Record<string, { total: number; correct: number; incorrect: number; marks: number }>;
  chapterBreakdown: Record<string, { total: number; correct: number; incorrect: number; marks: number }>;
  questionTypeBreakdown: Record<QuestionType, { total: number; correct: number; incorrect: number; marks: number }>;
  questionEvaluations: Record<string, QuestionEvaluationResult>;
}

export interface ActiveExamSession {
  testId: string;
  testTitle: string;
  attemptId: string;
  startTime: number;
  deadlineTimestamp: number; // Absolute timestamp for tamper-resistant refresh
  durationMinutes: number;
  currentQuestionIndex: number;
  activeSectionId: string;
  questionIds: string[];
  responses: Record<string, UserQuestionResponse>;
  paletteStates: Record<string, PaletteState>;
  timeSpentSeconds: Record<string, number>;
  isSubmitted: boolean;
  result?: ExamResult;
}
