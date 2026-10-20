import { ALL_QUESTIONS } from '../src/data/questions';
import { GATE_DA_SYLLABUS } from '../src/data/syllabus';

interface ValidationError {
  questionId: string;
  field: string;
  message: string;
}

export function validateQuestionBank(): { valid: boolean; errors: ValidationError[]; stats: any } {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();
  const seenTexts = new Map<string, string>();

  // Collect all valid syllabus subjects and chapters
  const validSubjects = new Set(GATE_DA_SYLLABUS.map(s => s.name.toLowerCase()));
  const validChapters = new Set<string>();
  GATE_DA_SYLLABUS.forEach(s => {
    s.chapters.forEach(c => validChapters.add(c.name.toLowerCase()));
  });

  const stats = {
    total: ALL_QUESTIONS.length,
    byType: { MCQ: 0, MSQ: 0, NAT: 0 } as Record<string, number>,
    byDifficulty: { easy: 0, medium: 0, hard: 0 } as Record<string, number>,
    bySubject: {} as Record<string, number>,
    bySource: { official_pyq: 0, original: 0, adapted: 0, third_party_pyq: 0, unverified: 0 } as Record<string, number>,
    verifiedCount: 0
  };

  for (const q of ALL_QUESTIONS) {
    // 1. Stable ID check
    if (!q.question_id || q.question_id.trim() === '') {
      errors.push({ questionId: 'UNKNOWN', field: 'question_id', message: 'Missing question_id' });
    } else if (seenIds.has(q.question_id)) {
      errors.push({ questionId: q.question_id, field: 'question_id', message: 'Duplicate question_id detected' });
    } else {
      seenIds.add(q.question_id);
    }

    // 2. Duplicate Text check
    const normalizedText = q.question_text.trim().toLowerCase();
    if (seenTexts.has(normalizedText)) {
      errors.push({
        questionId: q.question_id,
        field: 'question_text',
        message: `Potential duplicate question text with ${seenTexts.get(normalizedText)}`
      });
    } else {
      seenTexts.set(normalizedText, q.question_id);
    }

    // 3. Question Type & Option Validation
    if (!['MCQ', 'MSQ', 'NAT'].includes(q.question_type)) {
      errors.push({ questionId: q.question_id, field: 'question_type', message: `Invalid type: ${q.question_type}` });
    } else {
      stats.byType[q.question_type] = (stats.byType[q.question_type] || 0) + 1;
    }

    if (q.question_type === 'MCQ') {
      if (!q.options || q.options.length < 2) {
        errors.push({ questionId: q.question_id, field: 'options', message: 'MCQ must have at least 2 options' });
      } else {
        const optionIds = q.options.map(o => o.id);
        if (!optionIds.includes(String(q.correct_answer))) {
          errors.push({
            questionId: q.question_id,
            field: 'correct_answer',
            message: `MCQ correct_answer "${q.correct_answer}" not among options [${optionIds.join(', ')}]`
          });
        }
      }
    } else if (q.question_type === 'MSQ') {
      if (!q.options || q.options.length < 2) {
        errors.push({ questionId: q.question_id, field: 'options', message: 'MSQ must have at least 2 options' });
      } else {
        const optionIds = q.options.map(o => o.id);
        const correctList = Array.isArray(q.correct_answer) ? q.correct_answer : [q.correct_answer];
        if (correctList.length === 0) {
          errors.push({ questionId: q.question_id, field: 'correct_answer', message: 'MSQ must have at least one correct option' });
        }
        for (const ans of correctList) {
          if (!optionIds.includes(String(ans))) {
            errors.push({
              questionId: q.question_id,
              field: 'correct_answer',
              message: `MSQ correct answer option "${ans}" not in options`
            });
          }
        }
      }
    } else if (q.question_type === 'NAT') {
      if (typeof q.correct_answer !== 'number' && typeof q.correct_answer !== 'object') {
        errors.push({ questionId: q.question_id, field: 'correct_answer', message: 'NAT answer must be a number or tolerance object' });
      }
      if (q.tolerance) {
        if (q.tolerance.min > q.tolerance.max) {
          errors.push({ questionId: q.question_id, field: 'tolerance', message: 'NAT tolerance min cannot exceed max' });
        }
      }
    }

    // 4. Marks validation
    if (q.marks !== 1 && q.marks !== 2) {
      errors.push({ questionId: q.question_id, field: 'marks', message: `Invalid marks: ${q.marks}` });
    }

    // 5. Syllabus Mapping Validation
    if (!validSubjects.has(q.subject.toLowerCase())) {
      errors.push({ questionId: q.question_id, field: 'subject', message: `Subject "${q.subject}" not found in GATE DA syllabus` });
    } else {
      stats.bySubject[q.subject] = (stats.bySubject[q.subject] || 0) + 1;
    }

    // 6. Explanation presence
    if (!q.explanation || q.explanation.trim().length < 10) {
      errors.push({ questionId: q.question_id, field: 'explanation', message: 'Missing or inadequate explanation' });
    }

    // Stats accumulation
    if (['easy', 'medium', 'hard'].includes(q.difficulty)) {
      stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;
    }
    if (q.source_type) {
      stats.bySource[q.source_type] = (stats.bySource[q.source_type] || 0) + 1;
    }
    if (q.verification_status === 'verified') {
      stats.verifiedCount++;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    stats
  };
}

// Execution entry point
const result = validateQuestionBank();
console.log('==============================================');
console.log('   GATE DA QUESTION BANK VALIDATION AUDIT     ');
console.log('==============================================');
console.log(`Total Questions in Bank: ${result.stats.total}`);
console.log(`Verified Answer Keys:   ${result.stats.verifiedCount}`);
console.log('Breakdown by Type:      ', result.stats.byType);
console.log('Breakdown by Difficulty:', result.stats.byDifficulty);
console.log('Breakdown by Source:    ', result.stats.bySource);
console.log('Breakdown by Subject:   ', result.stats.bySubject);
console.log('----------------------------------------------');

if (!result.valid) {
  console.error(`VALIDATION FAILED with ${result.errors.length} errors:`);
  result.errors.forEach(err => {
    console.error(`- [${err.questionId}] ${err.field}: ${err.message}`);
  });
  process.exit(1);
} else {
  console.log('All questions passed schema and syllabus validation with 100% integrity.');
}
