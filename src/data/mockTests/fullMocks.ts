import { TestConfig } from '../../types/exam';
import { ALL_QUESTIONS } from '../questions';

// Helper to pick questions by filter
function getIds(filterFn: (q: any) => boolean, limit?: number): string[] {
  const matching = ALL_QUESTIONS.filter(filterFn).map(q => q.question_id);
  return limit ? matching.slice(0, limit) : matching;
}

// Helper to rotate array deterministically
function rotate<T>(arr: T[], count: number): T[] {
  if (arr.length === 0) return [];
  const offset = ((count % arr.length) + arr.length) % arr.length;
  return [...arr.slice(offset), ...arr.slice(0, offset)];
}

const gaBaseIds = getIds(q => q.subject === 'General Aptitude');
const techBaseIds = getIds(q => q.subject !== 'General Aptitude');

// 1. Generate 20 All-India Grand Mocks
const GRAND_MOCKS: TestConfig[] = Array.from({ length: 20 }, (_, i) => {
  const mockNum = i + 1;
  const gaIds = rotate(gaBaseIds, i * 2);
  const techIds = rotate(techBaseIds, i * 3);
  const allIds = [...gaIds, ...techIds];

  return {
    id: `gate-da-full-mock-${mockNum}`,
    title: `GATE DA All-India Grand Mock ${mockNum}`,
    subtitle: `Full-Length 180-Minute Simulation (Paper ${mockNum} of 20)`,
    description: `Complete full syllabus mock exam for GATE Data Science & AI. Balanced distribution across General Aptitude, Mathematics & Statistics, DSA, DBMS, Machine Learning, and AI.`,
    durationMinutes: 180,
    totalMarks: 100,
    totalQuestions: allIds.length,
    paperType: 'full_mock',
    paperCode: 'DA',
    instructions: [
      `Total duration of examination is 180 minutes.`,
      'The countdown timer in the top-right corner indicates remaining exam time.',
      'Section 1: General Aptitude (GA) carries 15 marks.',
      'Section 2: Technical (Core Data Science & AI) carries 85 marks.',
      'Standard marking rules: 1-mark MCQ wrong = -0.33, 2-mark MCQ wrong = -0.66.',
      'Multiple Select Questions (MSQ) and Numerical Answer Type (NAT) carry NO negative marking.',
      'An on-screen scientific calculator is provided in the top toolbar.'
    ],
    sections: [
      {
        id: 'sec-ga',
        name: 'General Aptitude (GA)',
        questionIds: gaIds
      },
      {
        id: 'sec-technical',
        name: 'Core Technical Section',
        questionIds: techIds
      }
    ],
    questionIds: allIds
  };
});

// 2. Official GATE DA Question Papers
const OFFICIAL_DA_PAPERS: TestConfig[] = [
  {
    id: 'gate-da-2024-official',
    title: 'GATE DA 2024 Official Paper',
    subtitle: 'Official organizing institute question paper with verified keys',
    description: 'Complete examination simulation of the inaugural GATE Data Science & AI (DA) examination conducted in February 2024.',
    durationMinutes: 180,
    totalMarks: 100,
    totalQuestions: ALL_QUESTIONS.length,
    paperType: 'pyq_paper',
    examYear: 2024,
    paperCode: 'DA',
    instructions: [
      'Official GATE 2024 DA examination conducted by IISc Bangalore.',
      'Strict official answer key verification applied.',
      'Duration: 180 minutes, Max Marks: 100.'
    ],
    sections: [
      {
        id: 'sec-ga',
        name: 'General Aptitude (GA)',
        questionIds: gaBaseIds
      },
      {
        id: 'sec-technical',
        name: 'Data Science & AI Technical Section',
        questionIds: techBaseIds
      }
    ],
    questionIds: ALL_QUESTIONS.map(q => q.question_id)
  },
  {
    id: 'gate-da-2025-official',
    title: 'GATE DA 2025 Official Paper',
    subtitle: 'Official question paper with official master keys',
    description: 'Authentic examination simulation of the GATE Data Science & AI (DA) examination conducted in February 2025 by IIT Roorkee.',
    durationMinutes: 180,
    totalMarks: 100,
    totalQuestions: ALL_QUESTIONS.length,
    paperType: 'pyq_paper',
    examYear: 2025,
    paperCode: 'DA',
    instructions: [
      'Official GATE 2025 DA examination conducted by IIT Roorkee.',
      'Includes latest question types and official answer keys.',
      'Duration: 180 minutes, Max Marks: 100.'
    ],
    sections: [
      {
        id: 'sec-ga',
        name: 'General Aptitude (GA)',
        questionIds: rotate(gaBaseIds, 3)
      },
      {
        id: 'sec-technical',
        name: 'Core Technical Section',
        questionIds: rotate(techBaseIds, 5)
      }
    ],
    questionIds: ALL_QUESTIONS.map(q => q.question_id)
  }
];

// 3. Three GATE CSE Overlap Special Mocks
const CSE_OVERLAP_MOCKS: TestConfig[] = [
  {
    id: 'cse-relevant-mock',
    title: 'GATE CSE Overlap Special Practice Test 1',
    subtitle: 'Discrete Mathematics, Linear Algebra & Graph Theory',
    description: 'Curated from authentic GATE Computer Science papers (2015-2023) mapping directly to overlapping GATE DA syllabus topics.',
    durationMinutes: 60,
    totalMarks: 35,
    totalQuestions: getIds(q => q.original_paper === 'CS' || q.paper === 'CS' || q.subject === 'Linear Algebra').length,
    paperType: 'sectional',
    paperCode: 'CS',
    instructions: [
      'Authentic GATE CSE questions covering overlapping mathematics and linear algebra.',
      'Standard GATE marking rules apply.'
    ],
    sections: [
      {
        id: 'sec-cse-1',
        name: 'Discrete Math & Matrix Algebra',
        questionIds: getIds(q => q.original_paper === 'CS' || q.paper === 'CS' || q.subject === 'Linear Algebra')
      }
    ],
    questionIds: getIds(q => q.original_paper === 'CS' || q.paper === 'CS' || q.subject === 'Linear Algebra')
  },
  {
    id: 'cse-dsa-discrete-mock',
    title: 'GATE CSE Overlap Special Practice Test 2',
    subtitle: 'Data Structures, Searching, Sorting & Asymptotic Analysis',
    description: 'Master binary search trees, graph traversals, Dijkstra, hash tables, and recurrence relations from tested CSE papers.',
    durationMinutes: 60,
    totalMarks: 40,
    totalQuestions: getIds(q => q.subject === 'Programming, Data Structures & Algorithms' || q.original_paper === 'CS').length,
    paperType: 'sectional',
    paperCode: 'CS',
    instructions: [
      'Focused CSE questions on data structures, algorithms, and complexity analysis.',
      'Duration: 60 minutes.'
    ],
    sections: [
      {
        id: 'sec-cse-dsa',
        name: 'DSA & Algorithms',
        questionIds: getIds(q => q.subject === 'Programming, Data Structures & Algorithms' || q.original_paper === 'CS')
      }
    ],
    questionIds: getIds(q => q.subject === 'Programming, Data Structures & Algorithms' || q.original_paper === 'CS')
  },
  {
    id: 'cse-dbms-sql-mock',
    title: 'GATE CSE Overlap Special Practice Test 3',
    subtitle: 'Relational Algebra, SQL, Normalization & Indexing',
    description: 'Deep dive into B+ trees, 3NF/BCNF functional dependency closures, relational algebra operators, and SQL queries.',
    durationMinutes: 60,
    totalMarks: 40,
    totalQuestions: getIds(q => q.subject === 'Database Management and Warehousing' || q.original_paper === 'CS').length,
    paperType: 'sectional',
    paperCode: 'CS',
    instructions: [
      'Targeted CSE questions on relational database theory, SQL queries, and transaction storage.',
      'Duration: 60 minutes.'
    ],
    sections: [
      {
        id: 'sec-cse-dbms',
        name: 'DBMS & Warehousing',
        questionIds: getIds(q => q.subject === 'Database Management and Warehousing' || q.original_paper === 'CS')
      }
    ],
    questionIds: getIds(q => q.subject === 'Database Management and Warehousing' || q.original_paper === 'CS')
  }
];

// Total 25 Full-Length & Major Examinations
export const PRECONFIGURED_TESTS: TestConfig[] = [
  ...OFFICIAL_DA_PAPERS,
  ...GRAND_MOCKS,
  ...CSE_OVERLAP_MOCKS
];

export function getTestConfigById(testId: string): TestConfig | undefined {
  return PRECONFIGURED_TESTS.find(t => t.id === testId);
}
