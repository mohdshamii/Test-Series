import { TestConfig } from '../../types/exam';
import { PRECONFIGURED_TESTS } from './fullMocks';
import { 
  ALL_SUBJECT_AND_CHAPTER_TESTS, 
  SUBJECT_WISE_TESTS, 
  CHAPTER_DRILL_TESTS, 
  CHAPTER_ADVANCED_TESTS 
} from './chapterTests';

// Combine all 100 tests (25 full-length/major mocks + 75 subject & chapter mocks)
export const ALL_TESTS: TestConfig[] = [
  ...PRECONFIGURED_TESTS,
  ...ALL_SUBJECT_AND_CHAPTER_TESTS
];

const TEST_MAP = new Map<string, TestConfig>();
for (const test of ALL_TESTS) {
  TEST_MAP.set(test.id, test);
}

export function getAllTests(): TestConfig[] {
  return ALL_TESTS;
}

export function getTestConfigById(testId: string): TestConfig | undefined {
  return TEST_MAP.get(testId);
}

export function getFullMocks(): TestConfig[] {
  return ALL_TESTS.filter(t => t.paperType === 'full_mock');
}

export function getSubjectWiseTests(): TestConfig[] {
  return SUBJECT_WISE_TESTS;
}

export function getChapterDrillTests(): TestConfig[] {
  return CHAPTER_DRILL_TESTS;
}

export function getChapterAdvancedTests(): TestConfig[] {
  return CHAPTER_ADVANCED_TESTS;
}

export function getPyqPapers(): TestConfig[] {
  return ALL_TESTS.filter(t => t.paperType === 'pyq_paper');
}

export function getTestsBySubject(subjectName: string): TestConfig[] {
  const norm = subjectName.trim().toLowerCase();
  return ALL_TESTS.filter(t => t.subject && t.subject.trim().toLowerCase() === norm);
}

export function getTestsByChapter(chapterName: string): TestConfig[] {
  const norm = chapterName.trim().toLowerCase();
  return ALL_TESTS.filter(t => t.chapter && t.chapter.trim().toLowerCase() === norm);
}

export { 
  PRECONFIGURED_TESTS, 
  SUBJECT_WISE_TESTS, 
  CHAPTER_DRILL_TESTS, 
  CHAPTER_ADVANCED_TESTS, 
  ALL_SUBJECT_AND_CHAPTER_TESTS 
};
