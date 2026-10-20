import { describe, it, expect } from 'vitest';
import { 
  evaluateQuestion, 
  calculateExamResult, 
  isNatCorrect, 
  roundScore 
} from './scoringEngine';
import { Question, NatTolerance } from '../../types/question';
import { ExamSection } from '../../types/exam';

describe('Scoring Engine - Unit Tests', () => {
  const baseMcq1: Question = {
    question_id: 'q-mcq-1',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Machine Learning',
    chapter: 'Linear and Logistic Regression',
    topic: 'Logistic Regression',
    question_type: 'MCQ',
    question_text: 'What is the range of sigmoid function?',
    options: [
      { id: 'A', text: '(-inf, +inf)' },
      { id: 'B', text: '(0, 1)' },
      { id: 'C', text: '[-1, 1]' },
      { id: 'D', text: '[0, 1]' }
    ],
    correct_answer: 'B',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['sigmoid', 'logistic-regression'],
    explanation: 'The sigmoid function output is strictly between 0 and 1.'
  };

  const baseMcq2: Question = {
    ...baseMcq1,
    question_id: 'q-mcq-2',
    marks: 2,
    negative_marks: 0.66,
    correct_answer: 'C'
  };

  const baseMsq: Question = {
    question_id: 'q-msq-1',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Linear Algebra',
    chapter: 'Eigenvalues and Eigenvectors',
    topic: 'Properties',
    question_type: 'MSQ',
    question_text: 'Which of the following statements are true for an orthogonal matrix Q?',
    options: [
      { id: 'A', text: 'det(Q) = +1 or -1' },
      { id: 'B', text: 'Q^T Q = I' },
      { id: 'C', text: 'Eigenvalues have absolute value 1' },
      { id: 'D', text: 'Trace is always 0' }
    ],
    correct_answer: ['A', 'B', 'C'],
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['matrix', 'orthogonal'],
    explanation: 'Properties of orthogonal matrices.'
  };

  const baseNat: Question = {
    question_id: 'q-nat-1',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Calculus and Optimization',
    chapter: 'Differentiation and Gradients',
    topic: 'Gradients',
    question_type: 'NAT',
    question_text: 'Calculate the minimum value of f(x) = x^2 - 4x + 7.',
    correct_answer: 3,
    tolerance: { min: 2.95, max: 3.05, exactValue: 3 },
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['minima'],
    explanation: 'f(2) = 4 - 8 + 7 = 3.'
  };

  describe('MCQ Evaluation', () => {
    it('awards full 1 mark for correct 1-mark MCQ', () => {
      const result = evaluateQuestion(baseMcq1, 'B');
      expect(result.isCorrect).toBe(true);
      expect(result.marksAwarded).toBe(1);
      expect(result.negativeMarksDeducted).toBe(0);
      expect(result.netMarks).toBe(1);
    });

    it('deducts 0.33 for incorrect 1-mark MCQ', () => {
      const result = evaluateQuestion(baseMcq1, 'A');
      expect(result.isCorrect).toBe(false);
      expect(result.marksAwarded).toBe(0);
      expect(result.negativeMarksDeducted).toBe(0.33);
      expect(result.netMarks).toBe(-0.33);
    });

    it('awards 2 marks for correct 2-mark MCQ and deducts 0.66 for incorrect', () => {
      const correctRes = evaluateQuestion(baseMcq2, 'C');
      expect(correctRes.isCorrect).toBe(true);
      expect(correctRes.netMarks).toBe(2);

      const wrongRes = evaluateQuestion(baseMcq2, 'D');
      expect(wrongRes.isCorrect).toBe(false);
      expect(wrongRes.negativeMarksDeducted).toBe(0.66);
      expect(wrongRes.netMarks).toBe(-0.66);
    });

    it('gives 0 marks and 0 negative for unattempted MCQ (null / empty)', () => {
      const result = evaluateQuestion(baseMcq1, null);
      expect(result.isAttempted).toBe(false);
      expect(result.isCorrect).toBe(false);
      expect(result.netMarks).toBe(0);
      expect(result.negativeMarksDeducted).toBe(0);
    });
  });

  describe('MSQ Evaluation (Exact-Set Matching, No Negative Marks)', () => {
    it('awards full marks when all correct options are selected and none other', () => {
      const result = evaluateQuestion(baseMsq, ['B', 'A', 'C']); // order shouldn't matter
      expect(result.isCorrect).toBe(true);
      expect(result.marksAwarded).toBe(2);
      expect(result.negativeMarksDeducted).toBe(0);
      expect(result.netMarks).toBe(2);
    });

    it('gives 0 marks and 0 penalty for partial MSQ selection (GATE exact-set rule)', () => {
      const partialRes = evaluateQuestion(baseMsq, ['A', 'B']); // missing C
      expect(partialRes.isCorrect).toBe(false);
      expect(partialRes.marksAwarded).toBe(0);
      expect(partialRes.negativeMarksDeducted).toBe(0);
      expect(partialRes.netMarks).toBe(0);
    });

    it('gives 0 marks and 0 penalty for incorrect MSQ selection with distractors', () => {
      const wrongRes = evaluateQuestion(baseMsq, ['A', 'B', 'D']);
      expect(wrongRes.isCorrect).toBe(false);
      expect(wrongRes.marksAwarded).toBe(0);
      expect(wrongRes.negativeMarksDeducted).toBe(0);
      expect(wrongRes.netMarks).toBe(0);
    });

    it('handles empty array as unattempted MSQ', () => {
      const emptyRes = evaluateQuestion(baseMsq, []);
      expect(emptyRes.isAttempted).toBe(false);
      expect(emptyRes.netMarks).toBe(0);
    });
  });

  describe('NAT Evaluation & Boundary Tolerances', () => {
    it('awards full marks for exact NAT value', () => {
      const result = evaluateQuestion(baseNat, 3);
      expect(result.isCorrect).toBe(true);
      expect(result.netMarks).toBe(2);
      expect(result.negativeMarksDeducted).toBe(0);
    });

    it('awards full marks for NAT value within tolerance boundaries', () => {
      expect(isNatCorrect(2.97, baseNat.correct_answer as number | NatTolerance, baseNat.tolerance)).toBe(true);
      expect(isNatCorrect(3.04, baseNat.correct_answer as number | NatTolerance, baseNat.tolerance)).toBe(true);
      expect(isNatCorrect(2.95, baseNat.correct_answer as number | NatTolerance, baseNat.tolerance)).toBe(true);
      expect(isNatCorrect(3.05, baseNat.correct_answer as number | NatTolerance, baseNat.tolerance)).toBe(true);

      const withinTolRes = evaluateQuestion(baseNat, '3.02');
      expect(withinTolRes.isCorrect).toBe(true);
      expect(withinTolRes.netMarks).toBe(2);
    });

    it('gives 0 marks and NO negative deduction for NAT outside tolerance boundaries', () => {
      expect(isNatCorrect(2.90, baseNat.correct_answer as number | NatTolerance, baseNat.tolerance)).toBe(false);
      expect(isNatCorrect(3.10, baseNat.correct_answer as number | NatTolerance, baseNat.tolerance)).toBe(false);

      const outTolRes = evaluateQuestion(baseNat, 4.5);
      expect(outTolRes.isCorrect).toBe(false);
      expect(outTolRes.negativeMarksDeducted).toBe(0);
      expect(outTolRes.netMarks).toBe(0);
    });

    it('handles unattempted NAT properly', () => {
      const unattempted = evaluateQuestion(baseNat, '');
      expect(unattempted.isAttempted).toBe(false);
      expect(unattempted.netMarks).toBe(0);
    });
  });

  describe('Decimal Score Handling and Section Totals', () => {
    it('accurately rounds floating point values', () => {
      expect(roundScore(2 - 0.66)).toBe(1.34);
      expect(roundScore(1 - 0.33)).toBe(0.67);
      expect(roundScore(0.3333333333)).toBe(0.33);
    });

    it('calculates comprehensive test results across mixed question types and sections', () => {
      const questions = [baseMcq1, baseMcq2, baseMsq, baseNat];
      const sections: ExamSection[] = [
        { id: 'sec-1', name: 'General & ML', questionIds: ['q-mcq-1', 'q-mcq-2'] },
        { id: 'sec-2', name: 'Math & Stats', questionIds: ['q-msq-1', 'q-nat-1'] }
      ];

      // User answers:
      // q-mcq-1: 'B' (correct => +1)
      // q-mcq-2: 'A' (incorrect => -0.66)
      // q-msq-1: ['A', 'B', 'C'] (correct => +2)
      // q-nat-1: unattempted (null => 0)
      const responses = {
        'q-mcq-1': 'B',
        'q-mcq-2': 'A',
        'q-msq-1': ['A', 'B', 'C'],
        'q-nat-1': null
      };

      const result = calculateExamResult(
        'mock-test-1',
        'Full Mock 1',
        'attempt-101',
        questions,
        sections,
        responses,
        { 'q-mcq-1': 45, 'q-mcq-2': 60, 'q-msq-1': 110, 'q-nat-1': 0 },
        180,
        215,
        1
      );

      // Total marks: 1 - 0.66 + 2 + 0 = 2.34
      expect(result.totalMarksObtained).toBe(2.34);
      // Max marks: 1 + 2 + 2 + 2 = 7
      expect(result.maxMarks).toBe(7);
      expect(result.correctCount).toBe(2);
      expect(result.incorrectCount).toBe(1);
      expect(result.unattemptedCount).toBe(1);
      // Accuracy = 2 / 3 attempted * 100 = 66.67%
      expect(result.accuracy).toBe(66.67);
      // Percentage = 2.34 / 7 * 100 = 33.43%
      expect(result.percentage).toBe(33.43);

      // Section scores verification
      expect(result.sectionScores.length).toBe(2);
      expect(result.sectionScores[0].marksObtained).toBe(0.34); // 1 - 0.66
      expect(result.sectionScores[0].maxMarks).toBe(3);
      expect(result.sectionScores[1].marksObtained).toBe(2);
      expect(result.sectionScores[1].maxMarks).toBe(4);
    });
  });
});
