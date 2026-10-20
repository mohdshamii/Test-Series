import { Question, QuestionType, NatTolerance } from '../../types/question';
import { 
  UserQuestionResponse, 
  QuestionEvaluationResult, 
  SectionScore, 
  ExamResult, 
  ExamSection 
} from '../../types/exam';

export interface ScoringOptions {
  allowMsqPartialScoring?: boolean;
}

/**
 * Normalizes floating point numbers to 2 decimal places to avoid IEEE 754 precision issues
 */
export function roundScore(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Evaluates whether a user's NAT input falls within acceptable boundaries
 */
export function isNatCorrect(userValue: number, correct: number | NatTolerance, tolerance?: NatTolerance): boolean {
  if (isNaN(userValue)) return false;

  const tol: NatTolerance | undefined = tolerance || (typeof correct === 'object' && 'min' in correct ? correct : undefined);

  if (tol) {
    const epsilon = 1e-7;
    return userValue >= tol.min - epsilon && userValue <= tol.max + epsilon;
  }

  if (typeof correct === 'number') {
    return Math.abs(userValue - correct) < 0.001;
  }

  return false;
}

/**
 * Evaluates a single question response
 */
export function evaluateQuestion(
  question: Question,
  userResponse: UserQuestionResponse,
  timeSpentSeconds: number = 0,
  options: ScoringOptions = {}
): QuestionEvaluationResult {
  const isAttempted = userResponse !== null && userResponse !== undefined && userResponse !== '' && 
    (!Array.isArray(userResponse) || userResponse.length > 0);

  if (!isAttempted) {
    return {
      questionId: question.question_id,
      userResponse: null,
      correctAnswer: question.correct_answer,
      isCorrect: false,
      isAttempted: false,
      marksAwarded: 0,
      negativeMarksDeducted: 0,
      netMarks: 0,
      questionType: question.question_type,
      subject: question.subject,
      chapter: question.chapter,
      timeSpentSeconds
    };
  }

  let isCorrect = false;
  let marksAwarded = 0;
  let negativeDeducted = 0;

  switch (question.question_type) {
    case 'MCQ': {
      const correctStr = String(question.correct_answer).trim().toUpperCase();
      const userStr = String(userResponse).trim().toUpperCase();
      isCorrect = userStr === correctStr;

      if (isCorrect) {
        marksAwarded = question.marks;
      } else {
        // Apply negative marking for MCQ
        negativeDeducted = question.negative_marks ?? (question.marks === 1 ? 0.33 : 0.66);
      }
      break;
    }

    case 'MSQ': {
      // User response and correct answer should be sets of option letters
      const correctOptions = Array.isArray(question.correct_answer)
        ? question.correct_answer.map(o => String(o).trim().toUpperCase()).sort()
        : [String(question.correct_answer).trim().toUpperCase()];

      const userOptions = Array.isArray(userResponse)
        ? userResponse.map(o => String(o).trim().toUpperCase()).sort()
        : [String(userResponse).trim().toUpperCase()];

      const isExactMatch = 
        correctOptions.length === userOptions.length &&
        correctOptions.every((val, idx) => val === userOptions[idx]);

      if (isExactMatch) {
        isCorrect = true;
        marksAwarded = question.marks;
      } else if (options.allowMsqPartialScoring) {
        // Optional non-standard partial scoring
        const correctSelected = userOptions.filter(o => correctOptions.includes(o)).length;
        const incorrectSelected = userOptions.filter(o => !correctOptions.includes(o)).length;
        if (incorrectSelected === 0 && correctSelected > 0) {
          marksAwarded = roundScore((correctSelected / correctOptions.length) * question.marks);
        }
      }
      // Official GATE policy: No negative marks for MSQ
      negativeDeducted = 0;
      break;
    }

    case 'NAT': {
      const numVal = typeof userResponse === 'number' 
        ? userResponse 
        : parseFloat(String(userResponse).trim());

      isCorrect = isNatCorrect(numVal, question.correct_answer as (number | NatTolerance), question.tolerance);

      if (isCorrect) {
        marksAwarded = question.marks;
      }
      // Official GATE policy: No negative marks for NAT
      negativeDeducted = 0;
      break;
    }
  }

  const netMarks = roundScore(marksAwarded - negativeDeducted);

  return {
    questionId: question.question_id,
    userResponse,
    correctAnswer: question.correct_answer,
    isCorrect,
    isAttempted: true,
    marksAwarded: roundScore(marksAwarded),
    negativeMarksDeducted: roundScore(negativeDeducted),
    netMarks,
    questionType: question.question_type,
    subject: question.subject,
    chapter: question.chapter,
    timeSpentSeconds
  };
}

/**
 * Calculates complete test score results across sections, subjects, chapters, and question types
 */
export function calculateExamResult(
  testId: string,
  testTitle: string,
  attemptId: string,
  questions: Question[],
  sections: ExamSection[],
  responses: Record<string, UserQuestionResponse>,
  timeSpentSeconds: Record<string, number> = {},
  durationMinutes: number = 180,
  timeUsedSeconds: number = 0,
  reviewMarkedCount: number = 0
): ExamResult {
  const questionMap = new Map<string, Question>();
  questions.forEach(q => questionMap.set(q.question_id, q));

  const questionEvaluations: Record<string, QuestionEvaluationResult> = {};
  let totalMarksObtained = 0;
  let maxMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  const subjectBreakdown: Record<string, { total: number; correct: number; incorrect: number; marks: number }> = {};
  const chapterBreakdown: Record<string, { total: number; correct: number; incorrect: number; marks: number }> = {};
  const questionTypeBreakdown: Record<QuestionType, { total: number; correct: number; incorrect: number; marks: number }> = {
    MCQ: { total: 0, correct: 0, incorrect: 0, marks: 0 },
    MSQ: { total: 0, correct: 0, incorrect: 0, marks: 0 },
    NAT: { total: 0, correct: 0, incorrect: 0, marks: 0 }
  };

  // Evaluate every question
  for (const q of questions) {
    maxMarks += q.marks;
    const response = responses[q.question_id] ?? null;
    const timeSpent = timeSpentSeconds[q.question_id] ?? 0;
    const evaluation = evaluateQuestion(q, response, timeSpent);
    questionEvaluations[q.question_id] = evaluation;

    totalMarksObtained += evaluation.netMarks;

    if (!evaluation.isAttempted) {
      unattemptedCount++;
    } else if (evaluation.isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }

    // Subject breakdown
    if (!subjectBreakdown[q.subject]) {
      subjectBreakdown[q.subject] = { total: 0, correct: 0, incorrect: 0, marks: 0 };
    }
    subjectBreakdown[q.subject].total++;
    if (evaluation.isCorrect) subjectBreakdown[q.subject].correct++;
    else if (evaluation.isAttempted) subjectBreakdown[q.subject].incorrect++;
    subjectBreakdown[q.subject].marks = roundScore(subjectBreakdown[q.subject].marks + evaluation.netMarks);

    // Chapter breakdown
    if (!chapterBreakdown[q.chapter]) {
      chapterBreakdown[q.chapter] = { total: 0, correct: 0, incorrect: 0, marks: 0 };
    }
    chapterBreakdown[q.chapter].total++;
    if (evaluation.isCorrect) chapterBreakdown[q.chapter].correct++;
    else if (evaluation.isAttempted) chapterBreakdown[q.chapter].incorrect++;
    chapterBreakdown[q.chapter].marks = roundScore(chapterBreakdown[q.chapter].marks + evaluation.netMarks);

    // Question type breakdown
    questionTypeBreakdown[q.question_type].total++;
    if (evaluation.isCorrect) questionTypeBreakdown[q.question_type].correct++;
    else if (evaluation.isAttempted) questionTypeBreakdown[q.question_type].incorrect++;
    questionTypeBreakdown[q.question_type].marks = roundScore(questionTypeBreakdown[q.question_type].marks + evaluation.netMarks);
  }

  // Section scores
  const sectionScores: SectionScore[] = sections.map(section => {
    let secMarksObtained = 0;
    let secMaxMarks = 0;
    let secAttempted = 0;
    let secCorrect = 0;
    let secIncorrect = 0;
    let secUnattempted = 0;

    for (const qId of section.questionIds) {
      const q = questionMap.get(qId);
      const evalRes = questionEvaluations[qId];
      if (q && evalRes) {
        secMaxMarks += q.marks;
        secMarksObtained += evalRes.netMarks;
        if (evalRes.isAttempted) {
          secAttempted++;
          if (evalRes.isCorrect) secCorrect++;
          else secIncorrect++;
        } else {
          secUnattempted++;
        }
      }
    }

    return {
      sectionId: section.id,
      sectionName: section.name,
      marksObtained: roundScore(secMarksObtained),
      maxMarks: secMaxMarks,
      attempted: secAttempted,
      correct: secCorrect,
      incorrect: secIncorrect,
      unattempted: secUnattempted
    };
  });

  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount > 0 ? roundScore((correctCount / attemptedCount) * 100) : 0;
  const percentage = maxMarks > 0 ? roundScore((totalMarksObtained / maxMarks) * 100) : 0;

  return {
    testId,
    testTitle,
    attemptId,
    timestamp: Date.now(),
    durationMinutes,
    timeUsedSeconds,
    totalMarksObtained: roundScore(totalMarksObtained),
    maxMarks: roundScore(maxMarks),
    percentage,
    accuracy,
    totalQuestions: questions.length,
    correctCount,
    incorrectCount,
    unattemptedCount,
    reviewMarkedCount,
    sectionScores,
    subjectBreakdown,
    chapterBreakdown,
    questionTypeBreakdown,
    questionEvaluations
  };
}
