import { ExamResult } from './exam';

export interface IncorrectQuestionRecord {
  questionId: string;
  incorrectResponse: any;
  timestamp: number;
  failCount: number;
  subject: string;
  chapter: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  autoSaveIntervalSeconds: number;
  confirmBeforeSubmit: boolean;
  virtualCalculatorOpen: boolean;
  fontSize: 'normal' | 'large';
}

export interface UserProgressData {
  version: number;
  bookmarks: string[]; // List of question IDs
  incorrectQuestions: Record<string, IncorrectQuestionRecord>;
  completedTests: ExamResult[];
  questionAttempts: Record<string, {
    userResponse: any;
    isCorrect: boolean;
    timestamp: number;
    timeSpentSeconds: number;
  }>;
  preferences: UserPreferences;
  lastActiveTimestamp: number;
}
