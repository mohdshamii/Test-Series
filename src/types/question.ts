export type QuestionType = 'MCQ' | 'MSQ' | 'NAT';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionSourceType = 
  | 'official_pyq'
  | 'third_party_pyq'
  | 'adapted'
  | 'original'
  | 'unverified';

export type DARelevance = 'direct' | 'partial' | 'extended';

export type VerificationStatus = 'verified' | 'unverified';

export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface NatTolerance {
  min: number;
  max: number;
  exactValue?: number;
}

export interface Question {
  question_id: string;
  exam: 'GATE';
  paper: 'DA' | 'CS';
  exam_year?: number;
  session?: string;
  subject: string;
  chapter: string;
  topic: string;
  question_type: QuestionType;
  question_text: string;
  options?: QuestionOption[];
  // For MCQ: 'A' | 'B' | 'C' | 'D'
  // For MSQ: string[] like ['A', 'C']
  // For NAT: number or NatTolerance
  correct_answer: string | string[] | number | NatTolerance;
  tolerance?: NatTolerance; // specifically for NAT
  explanation: string;
  solution_steps?: string[];
  marks: 1 | 2;
  negative_marks: number; // 0 for MSQ and NAT, 0.33 for 1-mark MCQ, 0.66 for 2-mark MCQ
  difficulty: QuestionDifficulty;
  source_type: QuestionSourceType;
  source_url?: string | null;
  source_question_id?: string | null;
  original_paper?: 'DA' | 'CS';
  original_subject?: string;
  da_relevance: DARelevance;
  verification_status: VerificationStatus;
  tags: string[];
  assets?: string[];
  code_snippet?: {
    language: 'python' | 'sql' | 'pseudocode';
    code: string;
  };
}

export interface QuestionFilter {
  searchQuery?: string;
  subjects?: string[];
  chapters?: string[];
  topics?: string[];
  questionTypes?: QuestionType[];
  difficulties?: QuestionDifficulty[];
  sources?: ('DA' | 'CS' | 'original')[];
  sourceTypes?: QuestionSourceType[];
  years?: number[];
  verifiedOnly?: boolean;
  marks?: (1 | 2)[];
  attemptStatus?: 'all' | 'attempted' | 'unattempted' | 'bookmarked' | 'incorrect';
}
