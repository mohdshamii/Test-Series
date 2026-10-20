import { Question, QuestionFilter } from '../../types/question';
import generalAptitudeJson from './json/general-aptitude.json';
import probabilityStatisticsJson from './json/probability-statistics.json';
import linearAlgebraJson from './json/linear-algebra.json';
import calculusOptimizationJson from './json/calculus-optimization.json';
import programmingDsaJson from './json/programming-dsa.json';
import dbmsWarehousingJson from './json/dbms-warehousing.json';
import machineLearningJson from './json/machine-learning.json';
import artificialIntelligenceJson from './json/artificial-intelligence.json';
import gateDaPyqsJson from './json/gate-da-pyqs.json';
import gateCsePyqsJson from './json/gate-cse-pyqs.json';

const ALL_QUESTIONS_RAW: Question[] = [
  ...(generalAptitudeJson as unknown as Question[]),
  ...(probabilityStatisticsJson as unknown as Question[]),
  ...(linearAlgebraJson as unknown as Question[]),
  ...(calculusOptimizationJson as unknown as Question[]),
  ...(programmingDsaJson as unknown as Question[]),
  ...(dbmsWarehousingJson as unknown as Question[]),
  ...(machineLearningJson as unknown as Question[]),
  ...(artificialIntelligenceJson as unknown as Question[]),
  ...(gateDaPyqsJson as unknown as Question[]),
  ...(gateCsePyqsJson as unknown as Question[])
];

// Deduplicate questions by question_id
const QUESTION_MAP = new Map<string, Question>();
for (const q of ALL_QUESTIONS_RAW) {
  if (!QUESTION_MAP.has(q.question_id)) {
    QUESTION_MAP.set(q.question_id, q);
  }
}

export const ALL_QUESTIONS: Question[] = Array.from(QUESTION_MAP.values());

export function getAllQuestions(): Question[] {
  return ALL_QUESTIONS;
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTION_MAP.get(id);
}

export function getQuestionsBySubject(subjectName: string): Question[] {
  const norm = subjectName.trim().toLowerCase();
  return ALL_QUESTIONS.filter(q => q.subject.trim().toLowerCase() === norm);
}

export function getQuestionsByChapter(chapterName: string): Question[] {
  const norm = chapterName.trim().toLowerCase();
  return ALL_QUESTIONS.filter(q => q.chapter.trim().toLowerCase() === norm);
}

export function filterQuestions(
  questions: Question[], 
  filter: QuestionFilter, 
  extraContext?: {
    bookmarkedIds?: string[];
    incorrectIds?: string[];
    attemptedIds?: string[];
  }
): Question[] {
  return questions.filter(q => {
    // Search query across question text, subject, chapter, topic, tags
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const query = filter.searchQuery.toLowerCase().trim();
      const match = 
        q.question_text.toLowerCase().includes(query) ||
        q.subject.toLowerCase().includes(query) ||
        q.chapter.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query) ||
        q.tags.some(t => t.toLowerCase().includes(query));
      if (!match) return false;
    }

    // Subjects
    if (filter.subjects && filter.subjects.length > 0) {
      if (!filter.subjects.includes(q.subject)) return false;
    }

    // Chapters
    if (filter.chapters && filter.chapters.length > 0) {
      if (!filter.chapters.includes(q.chapter)) return false;
    }

    // Question Types (MCQ, MSQ, NAT)
    if (filter.questionTypes && filter.questionTypes.length > 0) {
      if (!filter.questionTypes.includes(q.question_type)) return false;
    }

    // Difficulties
    if (filter.difficulties && filter.difficulties.length > 0) {
      if (!filter.difficulties.includes(q.difficulty)) return false;
    }

    // Source (DA vs CS vs original)
    if (filter.sources && filter.sources.length > 0) {
      const matchSource = filter.sources.some(s => {
        if (s === 'DA') return q.paper === 'DA' && q.source_type === 'official_pyq';
        if (s === 'CS') return q.paper === 'CS' || q.original_paper === 'CS';
        if (s === 'original') return q.source_type === 'original' || q.source_type === 'adapted';
        return false;
      });
      if (!matchSource) return false;
    }

    // Source Types
    if (filter.sourceTypes && filter.sourceTypes.length > 0) {
      if (!filter.sourceTypes.includes(q.source_type)) return false;
    }

    // Years
    if (filter.years && filter.years.length > 0) {
      if (!q.exam_year || !filter.years.includes(q.exam_year)) return false;
    }

    // Verified only
    if (filter.verifiedOnly) {
      if (q.verification_status !== 'verified') return false;
    }

    // Marks (1 vs 2)
    if (filter.marks && filter.marks.length > 0) {
      if (!filter.marks.includes(q.marks)) return false;
    }

    // Attempt status
    if (filter.attemptStatus && extraContext) {
      const { bookmarkedIds = [], incorrectIds = [], attemptedIds = [] } = extraContext;
      if (filter.attemptStatus === 'bookmarked' && !bookmarkedIds.includes(q.question_id)) return false;
      if (filter.attemptStatus === 'incorrect' && !incorrectIds.includes(q.question_id)) return false;
      if (filter.attemptStatus === 'attempted' && !attemptedIds.includes(q.question_id)) return false;
      if (filter.attemptStatus === 'unattempted' && attemptedIds.includes(q.question_id)) return false;
    }

    return true;
  });
}

export interface QuestionBankStatistics {
  totalQuestions: number;
  totalVerifiedPyqs: number;
  totalDaPyqs: number;
  totalCsePyqs: number;
  totalOriginalPractice: number;
  byType: Record<string, number>;
  byDifficulty: Record<string, number>;
  bySubject: Record<string, number>;
  byYear: Record<number, number>;
}

export function getQuestionBankStats(): QuestionBankStatistics {
  const stats: QuestionBankStatistics = {
    totalQuestions: ALL_QUESTIONS.length,
    totalVerifiedPyqs: 0,
    totalDaPyqs: 0,
    totalCsePyqs: 0,
    totalOriginalPractice: 0,
    byType: { MCQ: 0, MSQ: 0, NAT: 0 },
    byDifficulty: { easy: 0, medium: 0, hard: 0 },
    bySubject: {},
    byYear: {}
  };

  for (const q of ALL_QUESTIONS) {
    if (q.source_type === 'official_pyq') {
      stats.totalVerifiedPyqs++;
      if (q.paper === 'DA') stats.totalDaPyqs++;
      if (q.paper === 'CS' || q.original_paper === 'CS') stats.totalCsePyqs++;
    } else {
      stats.totalOriginalPractice++;
    }

    stats.byType[q.question_type] = (stats.byType[q.question_type] || 0) + 1;
    stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;
    stats.bySubject[q.subject] = (stats.bySubject[q.subject] || 0) + 1;
    if (q.exam_year) {
      stats.byYear[q.exam_year] = (stats.byYear[q.exam_year] || 0) + 1;
    }
  }

  return stats;
}
