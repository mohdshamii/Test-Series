import { UserProgressData, UserPreferences, IncorrectQuestionRecord } from '../../types/user';
import { ActiveExamSession, ExamResult } from '../../types/exam';

const STORAGE_KEY_PROGRESS = 'gate_da_user_progress_v1';
const STORAGE_KEY_ACTIVE_EXAM = 'gate_da_active_exam_session_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  autoSaveIntervalSeconds: 5,
  confirmBeforeSubmit: true,
  virtualCalculatorOpen: false,
  fontSize: 'normal'
};

const DEFAULT_PROGRESS: UserProgressData = {
  version: 1,
  bookmarks: [],
  incorrectQuestions: {},
  completedTests: [],
  questionAttempts: {},
  preferences: DEFAULT_PREFERENCES,
  lastActiveTimestamp: Date.now()
};

/**
 * Retrieves user progress from local storage safely
 */
export function getUserProgress(): UserProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...(parsed.preferences || {})
      }
    };
  } catch (err) {
    console.error('Failed to read user progress from localStorage:', err);
    return { ...DEFAULT_PROGRESS };
  }
}

/**
 * Saves user progress to local storage
 */
export function saveUserProgress(progress: UserProgressData): void {
  try {
    progress.lastActiveTimestamp = Date.now();
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save user progress to localStorage:', err);
  }
}

/**
 * Toggles bookmark status for a question ID
 */
export function toggleBookmark(questionId: string): boolean {
  const progress = getUserProgress();
  const exists = progress.bookmarks.includes(questionId);
  if (exists) {
    progress.bookmarks = progress.bookmarks.filter(id => id !== questionId);
  } else {
    progress.bookmarks.push(questionId);
  }
  saveUserProgress(progress);
  return !exists;
}

export function isBookmarked(questionId: string): boolean {
  const progress = getUserProgress();
  return progress.bookmarks.includes(questionId);
}

/**
 * Records an incorrect question for review/practice
 */
export function recordIncorrectQuestion(
  questionId: string, 
  userResponse: any,
  subject: string,
  chapter: string
): void {
  const progress = getUserProgress();
  const existing = progress.incorrectQuestions[questionId];
  const failCount = existing ? existing.failCount + 1 : 1;

  progress.incorrectQuestions[questionId] = {
    questionId,
    incorrectResponse: userResponse,
    timestamp: Date.now(),
    failCount,
    subject,
    chapter
  };
  saveUserProgress(progress);
}

/**
 * Removes an incorrect question once mastered
 */
export function removeIncorrectQuestion(questionId: string): void {
  const progress = getUserProgress();
  if (progress.incorrectQuestions[questionId]) {
    delete progress.incorrectQuestions[questionId];
    saveUserProgress(progress);
  }
}

/**
 * Records single question practice attempt
 */
export function recordQuestionAttempt(
  questionId: string, 
  userResponse: any, 
  isCorrect: boolean,
  timeSpentSeconds: number = 0,
  subject: string = '',
  chapter: string = ''
): void {
  const progress = getUserProgress();
  progress.questionAttempts[questionId] = {
    userResponse,
    isCorrect,
    timestamp: Date.now(),
    timeSpentSeconds
  };

  if (!isCorrect) {
    recordIncorrectQuestion(questionId, userResponse, subject, chapter);
  } else {
    // If answered correctly in practice, remove from incorrect list
    if (progress.incorrectQuestions[questionId]) {
      delete progress.incorrectQuestions[questionId];
    }
  }

  saveUserProgress(progress);
}

/**
 * Saves a completed test attempt result
 */
export function saveCompletedTest(result: ExamResult): void {
  const progress = getUserProgress();
  progress.completedTests = [result, ...progress.completedTests.filter(t => t.attemptId !== result.attemptId)];

  // Also record any questions answered incorrectly in this test
  for (const [qId, qEval] of Object.entries(result.questionEvaluations)) {
    if (qEval.isAttempted) {
      if (qEval.isCorrect) {
        if (progress.incorrectQuestions[qId]) {
          delete progress.incorrectQuestions[qId];
        }
      } else {
        const existing = progress.incorrectQuestions[qId];
        progress.incorrectQuestions[qId] = {
          questionId: qId,
          incorrectResponse: qEval.userResponse,
          timestamp: Date.now(),
          failCount: existing ? existing.failCount + 1 : 1,
          subject: qEval.subject,
          chapter: qEval.chapter
        };
      }
    }
  }

  saveUserProgress(progress);
}

/**
 * Active Examination Session persistence for browser refresh / accidental closure recovery
 */
export function getActiveExamSession(): ActiveExamSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_EXAM);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveExamSession;
  } catch (err) {
    console.error('Failed to load active exam session:', err);
    return null;
  }
}

export function saveActiveExamSession(session: ActiveExamSession): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_EXAM, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save active exam session:', err);
  }
}

export function clearActiveExamSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_EXAM);
  } catch (err) {
    console.error('Failed to clear active exam session:', err);
  }
}

/**
 * Updates preferences
 */
export function updateUserPreferences(updates: Partial<UserPreferences>): UserPreferences {
  const progress = getUserProgress();
  progress.preferences = {
    ...progress.preferences,
    ...updates
  };
  saveUserProgress(progress);

  // Apply theme to document element
  if (updates.theme) {
    applyTheme(updates.theme);
  }

  return progress.preferences;
}

export function applyTheme(theme: 'light' | 'dark' | 'system'): void {
  const root = document.documentElement;
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Export and Import progress as JSON
 */
export function exportProgressAsJson(): string {
  const progress = getUserProgress();
  return JSON.stringify(progress, null, 2);
}

export function importProgressFromJson(jsonString: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON format' };
    }
    if (!Array.isArray(parsed.bookmarks)) {
      return { success: false, error: 'Malformed backup: missing bookmarks array' };
    }
    const validated: UserProgressData = {
      version: parsed.version || 1,
      bookmarks: parsed.bookmarks || [],
      incorrectQuestions: parsed.incorrectQuestions || {},
      completedTests: parsed.completedTests || [],
      questionAttempts: parsed.questionAttempts || {},
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...(parsed.preferences || {})
      },
      lastActiveTimestamp: Date.now()
    };
    saveUserProgress(validated);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to parse JSON backup' };
  }
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEY_PROGRESS);
  localStorage.removeItem(STORAGE_KEY_ACTIVE_EXAM);
  saveUserProgress({ ...DEFAULT_PROGRESS });
}
