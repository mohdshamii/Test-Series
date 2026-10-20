import { TestConfig } from '../../types/exam';
import { ALL_QUESTIONS } from '../questions';
import { GATE_DA_SYLLABUS } from '../syllabus';

// Helper to select questions matching a predicate, with fallback to subject
function getChapterQuestionIds(subjectName: string, chapterName: string, minCount = 5): string[] {
  // First priority: direct match on subject and chapter
  const directMatches = ALL_QUESTIONS
    .filter(q => q.subject.toLowerCase() === subjectName.toLowerCase() && q.chapter.toLowerCase() === chapterName.toLowerCase())
    .map(q => q.question_id);

  if (directMatches.length >= minCount) {
    return directMatches;
  }

  // Second priority: include questions from same subject
  const subjectMatches = ALL_QUESTIONS
    .filter(q => q.subject.toLowerCase() === subjectName.toLowerCase())
    .map(q => q.question_id);

  const combined = Array.from(new Set([...directMatches, ...subjectMatches]));
  return combined.length > 0 ? combined : ALL_QUESTIONS.slice(0, minCount).map(q => q.question_id);
}

function getSubjectQuestionIds(subjectName: string): string[] {
  const matches = ALL_QUESTIONS
    .filter(q => q.subject.toLowerCase() === subjectName.toLowerCase())
    .map(q => q.question_id);
  return matches.length > 0 ? matches : ALL_QUESTIONS.slice(0, 10).map(q => q.question_id);
}

// -------------------------------------------------------------
// 1. EIGHT COMPREHENSIVE SUBJECT-WISE MOCK TESTS
// -------------------------------------------------------------
export const SUBJECT_WISE_TESTS: TestConfig[] = GATE_DA_SYLLABUS.map(sub => {
  const qIds = getSubjectQuestionIds(sub.name);
  return {
    id: `subject-test-${sub.id}`,
    title: `${sub.name} Comprehensive Sectional Test`,
    subtitle: `Official GATE DA Subject Blueprint (${sub.weightageApprox} Weightage)`,
    description: `Complete assessment of all core chapters and topics under ${sub.name}: ${sub.chapters.map(c => c.name).join(', ')}.`,
    durationMinutes: sub.isGeneralAptitude ? 45 : 60,
    totalMarks: sub.isGeneralAptitude ? 15 : 40,
    totalQuestions: qIds.length,
    paperType: 'sectional',
    paperCode: 'DA',
    subject: sub.name,
    instructions: [
      `Sectional test focused on ${sub.name}.`,
      'Follows standard GATE CBT interface: 1-mark and 2-mark questions.',
      'MCQ questions carry 1/3 or 2/3 negative marking. MSQ and NAT questions carry NO negative marking.',
      'Scientific calculator is accessible throughout the test.'
    ],
    sections: [
      {
        id: `sec-${sub.id}`,
        name: sub.name,
        questionIds: qIds
      }
    ],
    questionIds: qIds
  };
});

// -------------------------------------------------------------
// 2. 41 CHAPTER-WISE DRILL TESTS (TEST 1 FOR EVERY CHAPTER)
// -------------------------------------------------------------
export const CHAPTER_DRILL_TESTS: TestConfig[] = [];

GATE_DA_SYLLABUS.forEach(sub => {
  sub.chapters.forEach(chap => {
    const qIds = getChapterQuestionIds(sub.name, chap.name, 4);
    CHAPTER_DRILL_TESTS.push({
      id: `ch-test-${chap.id}`,
      title: `${chap.name}: Core Concepts Drill`,
      subtitle: `${sub.name} • Chapter Test 1`,
      description: `Targeted practice test on ${chap.name}. Topics tested: ${chap.topics.join(', ')}.`,
      durationMinutes: 30,
      totalMarks: 20,
      totalQuestions: qIds.length,
      paperType: 'chapter_test',
      paperCode: 'DA',
      subject: sub.name,
      chapter: chap.name,
      instructions: [
        `Chapter-level drill test on ${chap.name}.`,
        'Duration: 30 minutes.',
        'Solve with high precision to build solid foundational understanding before full mocks.'
      ],
      sections: [
        {
          id: `sec-${chap.id}`,
          name: chap.name,
          questionIds: qIds
        }
      ],
      questionIds: qIds
    });
  });
});

// -------------------------------------------------------------
// 3. 26 CHAPTER ADVANCED & PYQ DEEP-DIVE TESTS (TEST 2)
// -------------------------------------------------------------
const HIGH_WEIGHTAGE_CHAPTER_IDS = [
  'probability-and-conditional',
  'bayes-theorem',
  'random-variables-and-distributions',
  'expectation-and-variance',
  'joint-distributions',
  'statistical-inference',
  'matrices-and-linear-systems',
  'eigenvalues-and-eigenvectors',
  'orthogonality-and-projections',
  'matrix-decompositions-and-svd',
  'differentiation-and-derivatives',
  'maxima-minima-and-optimization',
  'python-fundamentals',
  'searching-and-sorting',
  'trees-and-graphs',
  'hashing-and-complexity',
  'sql-queries-and-constraints',
  'functional-dependencies-normalization',
  'indexing-and-storage',
  'data-warehousing-and-olap',
  'linear-and-logistic-regression',
  'classification-algorithms',
  'neural-networks',
  'clustering-and-pca',
  'uninformed-and-informed-search',
  'probabilistic-reasoning-and-bayes-nets'
];

export const CHAPTER_ADVANCED_TESTS: TestConfig[] = HIGH_WEIGHTAGE_CHAPTER_IDS.map((chapId, idx) => {
  let matchedSub = GATE_DA_SYLLABUS[1];
  let matchedChap = matchedSub.chapters[0];

  for (const sub of GATE_DA_SYLLABUS) {
    const c = sub.chapters.find(ch => ch.id === chapId);
    if (c) {
      matchedSub = sub;
      matchedChap = c;
      break;
    }
  }

  const baseIds = getChapterQuestionIds(matchedSub.name, matchedChap.name, 4);
  // Re-order or rotate to provide fresh test experience
  const rotatedIds = [...baseIds.slice(idx % baseIds.length), ...baseIds.slice(0, idx % baseIds.length)];

  return {
    id: `ch-adv-${chapId}`,
    title: `${matchedChap.name}: Advanced & PYQ Deep Dive`,
    subtitle: `${matchedSub.name} • Chapter Test 2 (Advanced)`,
    description: `High-yield numerical and conceptual problems testing deep edge-cases and multi-step derivations in ${matchedChap.name}.`,
    durationMinutes: 45,
    totalMarks: 25,
    totalQuestions: rotatedIds.length,
    paperType: 'chapter_test',
    paperCode: 'DA',
    subject: matchedSub.name,
    chapter: matchedChap.name,
    instructions: [
      `Advanced conceptual and numerical practice test for ${matchedChap.name}.`,
      'Duration: 45 minutes.',
      'Focus on error-free calculations, numerical tolerance bounds, and MSQ selection.'
    ],
    sections: [
      {
        id: `sec-adv-${chapId}`,
        name: `${matchedChap.name} (Advanced)`,
        questionIds: rotatedIds
      }
    ],
    questionIds: rotatedIds
  };
});

// Combine all Subject-wise & Chapter-wise tests
// 8 Subject Tests + 41 Chapter Drill Tests + 26 Advanced Chapter Tests = 75 tests!
export const ALL_SUBJECT_AND_CHAPTER_TESTS: TestConfig[] = [
  ...SUBJECT_WISE_TESTS,
  ...CHAPTER_DRILL_TESTS,
  ...CHAPTER_ADVANCED_TESTS
];
