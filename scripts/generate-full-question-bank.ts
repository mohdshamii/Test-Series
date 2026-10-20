import fs from 'fs';
import path from 'path';
import { Question } from '../src/types/question';

// Import existing seed questions
import { GENERAL_APTITUDE_QUESTIONS } from '../src/data/questions/general-aptitude';
import { PROBABILITY_STATISTICS_QUESTIONS } from '../src/data/questions/probability-statistics';
import { LINEAR_ALGEBRA_QUESTIONS } from '../src/data/questions/linear-algebra';
import { CALCULUS_OPTIMIZATION_QUESTIONS } from '../src/data/questions/calculus-optimization';
import { PROGRAMMING_DSA_QUESTIONS } from '../src/data/questions/programming-dsa';
import { DBMS_WAREHOUSING_QUESTIONS } from '../src/data/questions/dbms-warehousing';
import { MACHINE_LEARNING_QUESTIONS } from '../src/data/questions/machine-learning';
import { ARTIFICIAL_INTELLIGENCE_QUESTIONS } from '../src/data/questions/artificial-intelligence';
import { GATE_DA_OFFICIAL_PYQS } from '../src/data/questions/gate-da-pyqs';
import { GATE_CSE_RELEVANT_PYQS } from '../src/data/questions/gate-cse-pyqs';

const JSON_DIR = path.resolve(process.cwd(), 'src/data/questions/json');

if (!fs.existsSync(JSON_DIR)) {
  fs.mkdirSync(JSON_DIR, { recursive: true });
}

// -------------------------------------------------------------
// COMPREHENSIVE EXPANDED QUESTION BANK COVERING ALL 41 CHAPTERS
// -------------------------------------------------------------

const EXTRA_GA_QUESTIONS: Question[] = [
  {
    question_id: 'GA-ORIG-101',
    exam: 'GATE',
    paper: 'DA',
    subject: 'General Aptitude',
    chapter: 'Verbal Aptitude',
    topic: 'Sentence Completion',
    question_type: 'MCQ',
    question_text: 'Choose the word that best completes the sentence:\n\n"The research team\'s findings were so ________ that even the most skeptical scientists were compelled to re-examine their long-held hypotheses."',
    options: [
      { id: 'A', text: 'ambiguous' },
      { id: 'B', text: 'persuasive' },
      { id: 'C', text: 'dubious' },
      { id: 'D', text: 'inconsequential' }
    ],
    correct_answer: 'B',
    explanation: '"Persuasive" (or compelling) logically fits the consequence that skeptics were forced to reconsider their long-held hypotheses.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Verbal', 'Vocabulary', 'Sentence Completion']
  },
  {
    question_id: 'GA-ORIG-102',
    exam: 'GATE',
    paper: 'DA',
    subject: 'General Aptitude',
    chapter: 'Quantitative Aptitude',
    topic: 'Permutations & Combinations',
    question_type: 'NAT',
    question_text: 'In how many different ways can a committee of 4 data scientists be selected from a pool of 6 machine learning engineers and 5 data analysts such that the committee contains at least 2 machine learning engineers?',
    correct_answer: 265,
    tolerance: { min: 265, max: 265 },
    explanation: 'Total ways = (2 ML & 2 Analysts) + (3 ML & 1 Analyst) + (4 ML & 0 Analysts)\n\n$$ = \\binom{6}{2}\\binom{5}{2} + \\binom{6}{3}\\binom{5}{1} + \\binom{6}{4}\\binom{5}{0} $$\n$$ = (15 \\times 10) + (20 \\times 5) + (15 \\times 1) = 150 + 100 + 15 = 265. $$',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Combinatorics', 'Quantitative Aptitude']
  },
  {
    question_id: 'GA-ORIG-103',
    exam: 'GATE',
    paper: 'DA',
    subject: 'General Aptitude',
    chapter: 'Analytical Aptitude',
    topic: 'Syllogism',
    question_type: 'MCQ',
    question_text: 'Consider the following statements:\n1. All algorithms are procedures.\n2. Some procedures are recursive.\n\nWhich of the following conclusions logically follows with certainty?',
    options: [
      { id: 'A', text: 'All algorithms are recursive.' },
      { id: 'B', text: 'Some algorithms are recursive.' },
      { id: 'C', text: 'No algorithm is recursive.' },
      { id: 'D', text: 'None of the above conclusions necessarily follows.' }
    ],
    correct_answer: 'D',
    explanation: 'Since "procedures" is an undistributed middle term between algorithms and recursive entities, no definite relationship can be asserted between algorithms and recursive procedures with absolute certainty.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Analytical Aptitude', 'Syllogism', 'Logic']
  },
  {
    question_id: 'GA-ORIG-104',
    exam: 'GATE',
    paper: 'DA',
    subject: 'General Aptitude',
    chapter: 'Spatial Aptitude',
    topic: 'Paper Folding & Cutting',
    question_type: 'MCQ',
    question_text: 'A square sheet of paper is folded in half diagonally, then folded in half again to form a smaller triangle, and a circular hole is punched through the center. When completely unfolded, how many circular holes will appear on the paper?',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '4' },
      { id: 'C', text: '8' },
      { id: 'D', text: '16' }
    ],
    correct_answer: 'B',
    explanation: 'The paper is folded twice, creating 4 layers of thickness ($2^2 = 4$). A single punch through all layers results in exactly 4 holes when unfolded.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Spatial Aptitude', 'Paper Folding']
  },
  {
    question_id: 'GA-ORIG-105',
    exam: 'GATE',
    paper: 'DA',
    subject: 'General Aptitude',
    chapter: 'Verbal Aptitude',
    topic: 'Reading Comprehension',
    question_type: 'MCQ',
    question_text: 'Read the following excerpt:\n"While artificial intelligence has dramatically augmented pattern recognition in high-dimensional datasets, its opacity presents formidable challenges for clinical diagnostics where interpretable causality is non-negotiable."\n\nWhich statement is best supported by the passage?',
    options: [
      { id: 'A', text: 'High-dimensional datasets cannot be processed by artificial intelligence.' },
      { id: 'B', text: 'Pattern recognition is unimportant in medical diagnostics.' },
      { id: 'C', text: 'Clinical diagnostics requires transparent causal reasoning that black-box AI often lacks.' },
      { id: 'D', text: 'Artificial intelligence has replaced medical practitioners in clinical diagnostics.' }
    ],
    correct_answer: 'C',
    explanation: 'The passage highlights that while AI excels at pattern recognition, its "opacity" (black-box nature) conflicts with clinical requirements where "interpretable causality is non-negotiable".',
    marks: 2,
    negative_marks: 0.66,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Verbal Aptitude', 'Reading Comprehension']
  },
  {
    question_id: 'GA-ORIG-106',
    exam: 'GATE',
    paper: 'DA',
    subject: 'General Aptitude',
    chapter: 'Quantitative Aptitude',
    topic: 'Percentages & Ratios',
    question_type: 'NAT',
    question_text: 'In an engineering cohort, the ratio of computer science to data science students was $5 : 3$. If 20 new data science students join and 10 computer science students leave, the ratio becomes $1 : 1$. What was the original total number of students in the cohort?',
    correct_answer: 120,
    tolerance: { min: 120, max: 120 },
    explanation: 'Let original numbers be $5x$ and $3x$.\n$$ \\frac{5x - 10}{3x + 20} = 1 \\implies 5x - 10 = 3x + 20 \\implies 2x = 30 \\implies x = 15. $$\nOriginal total = $5x + 3x = 8x = 8(15) = 120$.',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Quantitative Aptitude', 'Ratios']
  }
];

const EXTRA_PS_QUESTIONS: Question[] = [
  {
    question_id: 'PS-ORIG-101',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Probability and Statistics',
    chapter: 'Probability and Conditional Probability',
    topic: 'Independent Events',
    question_type: 'MCQ',
    question_text: 'Let $A$ and $B$ be two independent events with $P(A) = 0.4$ and $P(B) = 0.5$. What is $P(A \\cup B^c)$?',
    options: [
      { id: 'A', text: '0.6' },
      { id: 'B', text: '0.7' },
      { id: 'C', text: '0.8' },
      { id: 'D', text: '0.9' }
    ],
    correct_answer: 'B',
    explanation: '$$ P(A \\cup B^c) = P(A) + P(B^c) - P(A \\cap B^c) $$\nSince $A$ and $B$ are independent, $A$ and $B^c$ are also independent.\n$$ P(A \\cap B^c) = P(A) \\cdot P(B^c) = 0.4 \\times (1 - 0.5) = 0.20 $$\n$$ P(A \\cup B^c) = 0.4 + 0.5 - 0.20 = 0.70. $$',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Probability', 'Independent Events']
  },
  {
    question_id: 'PS-ORIG-102',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Probability and Statistics',
    chapter: 'Random Variables and Distributions',
    topic: 'Poisson Distribution',
    question_type: 'NAT',
    question_text: 'Server requests arrive according to a Poisson process at a rate of $\\lambda = 2$ requests per second. The probability that exactly 3 requests arrive in a 2-second interval is given by $k \\cdot e^{-4}$. What is the value of $k$ (rounded to 2 decimal places)?',
    correct_answer: 10.67,
    tolerance: { min: 10.6, max: 10.7 },
    explanation: 'For a time interval of $t = 2$ seconds, the mean rate is $\\mu = \\lambda t = 2 \\times 2 = 4$.\nBy the Poisson distribution:\n$$ P(X = 3) = \\frac{\\mu^3 e^{-\\mu}}{3!} = \\frac{4^3 e^{-4}}{6} = \\frac{64}{6} e^{-4} = \\frac{32}{3} e^{-4} \\approx 10.67 e^{-4}. $$',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Poisson Distribution', 'Probability']
  },
  {
    question_id: 'PS-ORIG-103',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Probability and Statistics',
    chapter: 'Sampling and Statistical Inference',
    topic: 'Central Limit Theorem (CLT)',
    question_type: 'MSQ',
    question_text: 'Which of the following statements about the Central Limit Theorem (CLT) and Hypothesis Testing are TRUE?',
    options: [
      { id: 'A', text: 'CLT states that the distribution of the sample mean approaches a Normal distribution as sample size $n \\to \\infty$, regardless of the underlying population distribution (provided finite variance).' },
      { id: 'B', text: 'A Type I error occurs when a true null hypothesis $H_0$ is rejected.' },
      { id: 'C', text: 'If the p-value is less than the significance level $\\alpha$, we fail to reject the null hypothesis.' },
      { id: 'D', text: 'The standard error of the sample mean scales inversely with $\\sqrt{n}$.' }
    ],
    correct_answer: ['A', 'B', 'D'],
    explanation: 'Options A, B, and D are standard correct statistical properties. Option C is false because when $p < \\alpha$, we REJECT the null hypothesis, not fail to reject it.',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['CLT', 'Hypothesis Testing', 'Inference']
  },
  {
    question_id: 'PS-ORIG-104',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Probability and Statistics',
    chapter: 'Joint Distributions',
    topic: 'Covariance & Correlation',
    question_type: 'NAT',
    question_text: 'Let $X$ and $Y$ be random variables with $\\text{Var}(X) = 9$, $\\text{Var}(Y) = 16$, and $\\text{Var}(2X - Y) = 28$. What is the Pearson correlation coefficient $\\rho(X, Y)$ between $X$ and $Y$?',
    correct_answer: 0.5,
    tolerance: { min: 0.49, max: 0.51 },
    explanation: '$$ \\text{Var}(2X - Y) = 4\\text{Var}(X) + \\text{Var}(Y) - 4\\text{Cov}(X, Y) $$\n$$ 28 = 4(9) + 16 - 4\\text{Cov}(X, Y) = 36 + 16 - 4\\text{Cov}(X, Y) = 52 - 4\\text{Cov}(X, Y) $$\n$$ 4\\text{Cov}(X, Y) = 52 - 28 = 24 \\implies \\text{Cov}(X, Y) = 6. $$\nNow compute correlation:\n$$ \\rho(X, Y) = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{6}{3 \\times 4} = \\frac{6}{12} = 0.5. $$',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Variance', 'Covariance', 'Correlation']
  },
  {
    question_id: 'PS-ORIG-105',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Probability and Statistics',
    chapter: 'Expectation, Variance and Covariance',
    topic: "Chebyshev's Inequality",
    question_type: 'NAT',
    question_text: 'Let $X$ be a random variable with mean $\\mu = 50$ and standard deviation $\\sigma = 5$. Using Chebyshev\'s inequality, what is the lower bound for the probability $P(35 < X < 65)$? (Enter decimal between 0 and 1)',
    correct_answer: 0.89,
    tolerance: { min: 0.88, max: 0.90 },
    explanation: 'The interval is $(50 - 15, 50 + 15) = (\\mu - k\\sigma, \\mu + k\\sigma)$, where $k\\sigma = 15 \\implies k = 15/5 = 3$.\nBy Chebyshev\'s inequality:\n$$ P(|X - \\mu| < k\\sigma) \\ge 1 - \\frac{1}{k^2} = 1 - \\frac{1}{9} = \\frac{8}{9} \\approx 0.8889 \\approx 0.89. $$',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Chebyshev', 'Expectation', 'Variance']
  },
  {
    question_id: 'PS-ORIG-106',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Probability and Statistics',
    chapter: 'Counting and Combinatorics',
    topic: 'Inclusion-Exclusion Principle',
    question_type: 'NAT',
    question_text: 'How many integers between 1 and 300 (inclusive) are divisible by neither 3 nor 5?',
    correct_answer: 160,
    tolerance: { min: 160, max: 160 },
    explanation: '$$ |A| = \\lfloor 300/3 \\rfloor = 100 $$\n$$ |B| = \\lfloor 300/5 \\rfloor = 60 $$\n$$ |A \\cap B| = \\lfloor 300/15 \\rfloor = 20 $$\n$$ |A \\cup B| = 100 + 60 - 20 = 140 $$\nNeither = $300 - 140 = 160$.',
    marks: 1,
    negative_marks: 0,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Combinatorics', 'Inclusion Exclusion']
  }
];

const EXTRA_LA_QUESTIONS: Question[] = [
  {
    question_id: 'LA-ORIG-101',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Linear Algebra',
    chapter: 'Orthogonality and Projections',
    topic: 'Gram-Schmidt Process',
    question_type: 'MCQ',
    question_text: 'Let $v_1 = \\begin{bmatrix} 1 \\\\ 1 \\\\ 0 \\end{bmatrix}$ and $v_2 = \\begin{bmatrix} 1 \\\\ 0 \\\\ 1 \\end{bmatrix}$. Applying the Gram-Schmidt orthogonalization process with $u_1 = v_1$, the orthogonal vector $u_2$ is:',
    options: [
      { id: 'A', text: '[0.5, -0.5, 1]^T' },
      { id: 'B', text: '[0.5, 0.5, 1]^T' },
      { id: 'C', text: '[1, -1, 0]^T' },
      { id: 'D', text: '[0, 1, -1]^T' }
    ],
    correct_answer: 'A',
    explanation: '$$ u_2 = v_2 - \\frac{\\langle v_2, u_1 \\rangle}{\\|u_1\\|^2} u_1 $$\n$$ \\langle v_2, u_1 \\rangle = (1)(1) + (0)(1) + (1)(0) = 1 $$\n$$ \\|u_1\\|^2 = 1^2 + 1^2 + 0^2 = 2 $$\n$$ u_2 = \\begin{bmatrix} 1 \\\\ 0 \\\\ 1 \\end{bmatrix} - \\frac{1}{2} \\begin{bmatrix} 1 \\\\ 1 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} 0.5 \\\\ -0.5 \\\\ 1 \\end{bmatrix}. $$',
    marks: 2,
    negative_marks: 0.66,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Gram Schmidt', 'Orthogonality', 'Linear Algebra']
  },
  {
    question_id: 'LA-ORIG-102',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Linear Algebra',
    chapter: 'Matrix Decompositions and SVD',
    topic: 'Singular Value Decomposition (SVD)',
    question_type: 'NAT',
    question_text: 'Consider matrix $A = \\begin{bmatrix} 3 & 0 \\\\ 0 & -4 \\end{bmatrix}$. What is the largest singular value $\\sigma_1$ of matrix $A$?',
    correct_answer: 4,
    tolerance: { min: 4, max: 4 },
    explanation: 'Singular values of $A$ are the square roots of the eigenvalues of $A^T A$.\n$$ A^T A = \\begin{bmatrix} 3 & 0 \\\\ 0 & -4 \\end{bmatrix} \\begin{bmatrix} 3 & 0 \\\\ 0 & -4 \\end{bmatrix} = \\begin{bmatrix} 9 & 0 \\\\ 0 & 16 \\end{bmatrix} $$\nEigenvalues are $\\lambda_1 = 16, \\lambda_2 = 9$. Thus, singular values are $\\sigma_1 = \\sqrt{16} = 4$ and $\\sigma_2 = \\sqrt{9} = 3$. The largest is 4.',
    marks: 1,
    negative_marks: 0,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['SVD', 'Singular Values', 'Linear Algebra']
  },
  {
    question_id: 'LA-ORIG-103',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Linear Algebra',
    chapter: 'Vector Spaces and Vectors',
    topic: 'Rank-Nullity Theorem',
    question_type: 'NAT',
    question_text: 'Let $T: \\mathbb{R}^5 \\to \\mathbb{R}^3$ be a linear transformation whose null space (kernel) has dimension 2. What is the dimension of the range of $T$ (i.e., $\\text{rank}(T)$)?',
    correct_answer: 3,
    tolerance: { min: 3, max: 3 },
    explanation: 'By the Rank-Nullity Theorem:\n$$ \\dim(V) = \\text{rank}(T) + \\text{nullity}(T) $$\n$$ 5 = \\text{rank}(T) + 2 \\implies \\text{rank}(T) = 3. $$',
    marks: 1,
    negative_marks: 0,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Rank-Nullity', 'Vector Spaces']
  },
  {
    question_id: 'LA-ORIG-104',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Linear Algebra',
    chapter: 'Eigenvalues and Eigenvectors',
    topic: 'Cayley-Hamilton Theorem',
    question_type: 'MCQ',
    question_text: 'Let $A$ be a $2 \\times 2$ matrix with trace $\\text{Tr}(A) = 5$ and determinant $\\det(A) = 6$. By the Cayley-Hamilton theorem, $A^2$ can be expressed as:',
    options: [
      { id: 'A', text: '5A - 6I' },
      { id: 'B', text: '6A - 5I' },
      { id: 'C', text: '-5A + 6I' },
      { id: 'D', text: '5A + 6I' }
    ],
    correct_answer: 'A',
    explanation: 'The characteristic polynomial of a $2 \\times 2$ matrix is $\\lambda^2 - \\text{Tr}(A)\\lambda + \\det(A) = 0$.\nHere, $\\lambda^2 - 5\\lambda + 6 = 0$.\nBy Cayley-Hamilton theorem, $A^2 - 5A + 6I = 0 \\implies A^2 = 5A - 6I$.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Eigenvalues', 'Cayley Hamilton']
  }
];

const EXTRA_CO_QUESTIONS: Question[] = [
  {
    question_id: 'CO-ORIG-101',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Calculus and Optimization',
    chapter: 'Hessian Matrix and Taylor Series',
    topic: 'Hessian Matrix',
    question_type: 'MCQ',
    question_text: 'For the multivariable function $f(x, y) = 2x^2 + 3y^2 - 4xy + 5x$, the Hessian matrix $H(x, y)$ is:',
    options: [
      { id: 'A', text: '[[4, -4], [-4, 6]]' },
      { id: 'B', text: '[[4, -2], [-2, 6]]' },
      { id: 'C', text: '[[2, -4], [-4, 3]]' },
      { id: 'D', text: '[[4, 0], [0, 6]]' }
    ],
    correct_answer: 'A',
    explanation: 'First derivatives:\n$$ f_x = 4x - 4y + 5, \\quad f_y = 6y - 4x $$\nSecond derivatives:\n$$ f_{xx} = 4, \\quad f_{xy} = -4, \\quad f_{yx} = -4, \\quad f_{yy} = 6 $$\nThus, $H = \\begin{bmatrix} 4 & -4 \\\\ -4 & 6 \\end{bmatrix}$.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Hessian', 'Multivariate Calculus']
  },
  {
    question_id: 'CO-ORIG-102',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Calculus and Optimization',
    chapter: 'Maxima, Minima and Optimization',
    topic: 'Critical Points & Second Derivative Test',
    question_type: 'MCQ',
    question_text: 'For a function $f(x, y)$, a critical point has Hessian determinant $\\det(H) = -5$. Which of the following is true about this critical point?',
    options: [
      { id: 'A', text: 'It is a local minimum.' },
      { id: 'B', text: 'It is a local maximum.' },
      { id: 'C', text: 'It is a saddle point.' },
      { id: 'D', text: 'The second derivative test is inconclusive.' }
    ],
    correct_answer: 'C',
    explanation: 'By the multivariable second derivative test, if $\\det(H) < 0$ at a critical point, the Hessian matrix has eigenvalues of opposite signs, which definitively characterizes a saddle point.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Optimization', 'Saddle Point']
  },
  {
    question_id: 'CO-ORIG-103',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Calculus and Optimization',
    chapter: 'Differentiation and Gradients',
    topic: 'Directional Derivatives',
    question_type: 'NAT',
    question_text: 'Find the directional derivative of $f(x, y) = x^2 y$ at the point $(1, 2)$ in the direction of unit vector $\\mathbf{u} = \\frac{1}{\\sqrt{5}}\\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}$. (Round answer to 2 decimal places)',
    correct_answer: 4.02,
    tolerance: { min: 4.0, max: 4.05 },
    explanation: 'Gradient vector:\n$$ \\nabla f = \\begin{bmatrix} 2xy \\\\ x^2 \\end{bmatrix} $$\nAt point $(1, 2)$:\n$$ \\nabla f(1, 2) = \\begin{bmatrix} 2(1)(2) \\\\ 1^2 \\end{bmatrix} = \\begin{bmatrix} 4 \\\\ 1 \\end{bmatrix} $$\nDirectional derivative:\n$$ D_\\mathbf{u} f = \\nabla f \\cdot \\mathbf{u} = 4\\left(\\frac{2}{\\sqrt{5}}\\right) + 1\\left(\\frac{1}{\\sqrt{5}}\\right) = \\frac{9}{\\sqrt{5}} \\approx \\frac{9}{2.23606} \\approx 4.02. $$',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Directional Derivative', 'Gradient']
  },
  {
    question_id: 'CO-ORIG-104',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Calculus and Optimization',
    chapter: 'Limits and Continuity',
    topic: 'Multivariate Limits',
    question_type: 'NAT',
    question_text: 'Evaluate the limit $\\lim_{(x, y) \\to (0, 0)} \\frac{3x^2 + 3y^2}{\\sqrt{x^2 + y^2 + 1} - 1}$.',
    correct_answer: 6,
    tolerance: { min: 6, max: 6 },
    explanation: 'Convert to polar coordinates $r = \\sqrt{x^2 + y^2}$. As $(x, y) \\to (0,0)$, $r \\to 0^+$.\n$$ \\lim_{r \\to 0} \\frac{3r^2}{\\sqrt{r^2 + 1} - 1} = \\lim_{r \\to 0} \\frac{3r^2 (\\sqrt{r^2 + 1} + 1)}{(r^2 + 1) - 1} = \\lim_{r \\to 0} 3(\\sqrt{r^2 + 1} + 1) = 3(1 + 1) = 6. $$',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Calculus', 'Limits']
  }
];

const EXTRA_DSA_QUESTIONS: Question[] = [
  {
    question_id: 'DSA-ORIG-101',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Programming, Data Structures & Algorithms',
    chapter: 'Python Fundamentals & Data Structures',
    topic: 'Time Complexity of Python Built-ins',
    question_type: 'MSQ',
    question_text: 'Which of the following operations in standard CPython have average time complexity $O(1)$?',
    options: [
      { id: 'A', text: 'Checking key membership in a dictionary: `key in dict`' },
      { id: 'B', text: 'Appending an element to the end of a list: `list.append(x)`' },
      { id: 'C', text: 'Inserting an element at the beginning of a list: `list.insert(0, x)`' },
      { id: 'D', text: 'Popping the last element from a list: `list.pop()`' }
    ],
    correct_answer: ['A', 'B', 'D'],
    explanation: 'Dictionary lookup/membership is $O(1)$ average via hash table. `append` and `pop()` at the end of a dynamic array list are amortized $O(1)$. Inserting at index 0 requires shifting all $n$ elements, which takes $O(n)$ time.',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Python', 'Time Complexity', 'Data Structures']
  },
  {
    question_id: 'DSA-ORIG-102',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Programming, Data Structures & Algorithms',
    chapter: 'Trees and Graphs',
    topic: "Dijkstra's Shortest Path",
    question_type: 'MCQ',
    question_text: 'Dijkstra\'s single-source shortest path algorithm implemented with a Min-Heap (priority queue) on a graph with $V$ vertices and $E$ edges runs with which time complexity?',
    options: [
      { id: 'A', text: 'O(V^2)' },
      { id: 'B', text: 'O((V + E) log V)' },
      { id: 'C', text: 'O(V E)' },
      { id: 'D', text: 'O(E log E + V)' }
    ],
    correct_answer: 'B',
    explanation: 'Using a binary min-heap, extracting min takes $O(\\log V)$ for $V$ vertices, and decrease-key / edge relaxation takes $O(\\log V)$ for $E$ edges, yielding total time $O((V + E) \\log V)$.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Graph Algorithms', 'Dijkstra', 'Complexity']
  },
  {
    question_id: 'DSA-ORIG-103',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Programming, Data Structures & Algorithms',
    chapter: 'Searching and Sorting Algorithms',
    topic: 'QuickSort Partitioning',
    question_type: 'NAT',
    question_text: 'What is the minimum number of comparisons needed in the worst-case to sort an array of 4 elements using a comparison-based sorting algorithm? (Hint: Information theoretic lower bound $\\lceil \\log_2(4!) \\rceil$)',
    correct_answer: 5,
    tolerance: { min: 5, max: 5 },
    explanation: 'For $n = 4$ elements, $n! = 24$.\n$$ \\lceil \\log_2(24) \\rceil = 5 $$\nThus, any comparison-based sort requires at least 5 comparisons in the worst case.',
    marks: 1,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Sorting', 'Comparison Lower Bound']
  },
  {
    question_id: 'DSA-ORIG-104',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Programming, Data Structures & Algorithms',
    chapter: 'Stacks, Queues, and Linked Lists',
    topic: 'Stack Operations & Applications',
    question_type: 'MCQ',
    question_text: 'Which of the following data structures is most suited for evaluating a postfix (Reverse Polish) expression in linear time?',
    options: [
      { id: 'A', text: 'Queue' },
      { id: 'B', text: 'Stack' },
      { id: 'C', text: 'Binary Search Tree' },
      { id: 'D', text: 'Hash Table' }
    ],
    correct_answer: 'B',
    explanation: 'Evaluating a postfix expression requires pushing operands and popping the top two operands whenever an operator is encountered, which exactly follows LIFO semantics managed by a Stack.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Stack', 'Postfix Evaluation']
  }
];

const EXTRA_DB_QUESTIONS: Question[] = [
  {
    question_id: 'DB-ORIG-101',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Database Management and Warehousing',
    chapter: 'Data Warehousing and OLAP',
    topic: 'OLAP Operations (Roll-up, Drill-down, Slice, Dice)',
    question_type: 'MCQ',
    question_text: 'In an OLAP data cube, moving from an analysis of sales by "Day" to sales by "Quarter" is an example of which operation?',
    options: [
      { id: 'A', text: 'Drill-down' },
      { id: 'B', text: 'Roll-up' },
      { id: 'C', text: 'Slice' },
      { id: 'D', text: 'Pivot' }
    ],
    correct_answer: 'B',
    explanation: 'Roll-up performs aggregation on a data cube by climbing up a concept hierarchy (from finer granularity "Day" to coarser granularity "Quarter") or by dimension reduction.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Data Warehousing', 'OLAP', 'Roll-up']
  },
  {
    question_id: 'DB-ORIG-102',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Database Management and Warehousing',
    chapter: 'Indexing and Storage',
    topic: 'B-Trees & B+ Trees Structure',
    question_type: 'NAT',
    question_text: 'A B+ tree index is constructed with search key size 12 bytes, block size 1024 bytes, and child block pointer size 8 bytes. What is the maximum order (fan-out $p$) of an internal node?',
    correct_answer: 51,
    tolerance: { min: 51, max: 51 },
    explanation: 'An internal node with $p$ block pointers contains $p - 1$ search keys.\n$$ p \\cdot P_b + (p - 1) \\cdot K \\le B $$\n$$ p(8) + (p - 1)(12) \\le 1024 $$\n$$ 8p + 12p - 12 \\le 1024 \\implies 20p \\le 1036 \\implies p \\le 51.8. $$\nSince order must be an integer, the maximum fan-out is $p = 51$.',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['B+ Tree', 'Indexing', 'Databases']
  },
  {
    question_id: 'DB-ORIG-103',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Database Management and Warehousing',
    chapter: 'Functional Dependencies and Normalization',
    topic: 'Normal Forms (3NF, BCNF)',
    question_type: 'MSQ',
    question_text: 'Which of the following statements regarding database normalization are TRUE?',
    options: [
      { id: 'A', text: 'Every relation in BCNF is also in 3NF.' },
      { id: 'B', text: 'Any relational schema can always be decomposed into BCNF while guaranteeing dependency preservation and lossless join.' },
      { id: 'C', text: 'Any relational schema can always be decomposed into 3NF guaranteeing both dependency preservation and lossless join.' },
      { id: 'D', text: 'In 3NF, for every functional dependency $X \\to Y$, either $X$ is a superkey or $Y$ is a prime attribute.' }
    ],
    correct_answer: ['A', 'C', 'D'],
    explanation: 'A, C, and D are standard database theory theorems. B is FALSE because BCNF decomposition cannot always preserve functional dependencies.',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Normalization', 'BCNF', '3NF']
  },
  {
    question_id: 'DB-ORIG-104',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Database Management and Warehousing',
    chapter: 'Relational Model and Relational Algebra',
    topic: 'Relational Algebra (Select, Project, Join)',
    question_type: 'MCQ',
    question_text: 'Which relational algebra operator is equivalent to the universal quantifier (i.e. finding entities related to ALL items in a subset)?',
    options: [
      { id: 'A', text: 'Cartesian Product' },
      { id: 'B', text: 'Natural Join' },
      { id: 'C', text: 'Division Operator (÷)' },
      { id: 'D', text: 'Theta Join' }
    ],
    correct_answer: 'C',
    explanation: 'The division operator ($R \\div S$) finds tuples in $R$ that are associated with every tuple in $S$, directly representing universal quantification.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Relational Algebra', 'Division Operator']
  }
];

const EXTRA_ML_QUESTIONS: Question[] = [
  {
    question_id: 'ML-ORIG-101',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Machine Learning',
    chapter: 'Classification Algorithms (k-NN, Naive Bayes, Decision Trees, SVM)',
    topic: 'Support Vector Machines (Margins & Kernels)',
    question_type: 'NAT',
    question_text: 'In a hard-margin linear Support Vector Machine (SVM), the separating hyperplane is given by $w^T x + b = 0$, where $\\|w\\|_2 = 4$. What is the geometric margin (width of the margin corridor $\\frac{2}{\\|w\\|}$)?',
    correct_answer: 0.5,
    tolerance: { min: 0.49, max: 0.51 },
    explanation: 'The total margin width between the positive and negative bounding hyperplanes is:\n$$ M = \\frac{2}{\\|w\\|} = \\frac{2}{4} = 0.5. $$',
    marks: 1,
    negative_marks: 0,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['SVM', 'Margin', 'Machine Learning']
  },
  {
    question_id: 'ML-ORIG-102',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Machine Learning',
    chapter: 'Loss Functions, Regularization and Optimization',
    topic: 'L1 (Lasso) Regularization (Sparsity)',
    question_type: 'MCQ',
    question_text: 'Why does $L_1$ (Lasso) regularization induce sparsity in model weights compared to $L_2$ (Ridge) regularization?',
    options: [
      { id: 'A', text: 'Its circular constraint boundary leads to smooth shrinkage.' },
      { id: 'B', text: 'Its diamond-shaped $L_1$ ball has corners on coordinate axes where contours of the loss function frequently intersect first.' },
      { id: 'C', text: 'It computes the exact analytical pseudo-inverse.' },
      { id: 'D', text: 'It has higher gradient magnitude near the origin.' }
    ],
    correct_answer: 'B',
    explanation: 'The $L_1$ norm constraint contour is a polytope with sharp vertices/corners lying exactly on the coordinate axes ($w_i = 0$), causing the unconstrained loss contours to touch at vertices where one or more parameters equal zero.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Lasso', 'Regularization', 'Sparsity']
  },
  {
    question_id: 'ML-ORIG-103',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Machine Learning',
    chapter: 'Clustering and Dimensionality Reduction (PCA)',
    topic: 'PCA (Covariance Eigenvectors)',
    question_type: 'NAT',
    question_text: 'A centered dataset in $\\mathbb{R}^3$ has covariance matrix with eigenvalues $\\lambda_1 = 5.0$, $\\lambda_2 = 3.0$, and $\\lambda_3 = 2.0$. What percentage of total variance is explained by the first principal component? (Enter value between 0 and 100)',
    correct_answer: 50,
    tolerance: { min: 50, max: 50 },
    explanation: 'Total variance = $\\sum \\lambda_i = 5.0 + 3.0 + 2.0 = 10.0$.\nVariance explained by PC 1 = $\\frac{\\lambda_1}{\\sum \\lambda_i} \\times 100 = \\frac{5.0}{10.0} \\times 100 = 50\\%$.',
    marks: 1,
    negative_marks: 0,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['PCA', 'Eigenvalues', 'Variance Explained']
  },
  {
    question_id: 'ML-ORIG-104',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Machine Learning',
    chapter: 'Linear and Logistic Regression',
    topic: 'Binary Cross-Entropy Loss',
    question_type: 'MCQ',
    question_text: 'In logistic regression for binary classification, why is Binary Cross-Entropy (Log Loss) preferred over Mean Squared Error (MSE)?',
    options: [
      { id: 'A', text: 'MSE combined with sigmoid produces a non-convex loss surface with multiple local minima.' },
      { id: 'B', text: 'MSE cannot compute gradients for probabilities.' },
      { id: 'C', text: 'Binary Cross-Entropy does not require gradient descent.' },
      { id: 'D', text: 'MSE requires an infinite learning rate.' }
    ],
    correct_answer: 'A',
    explanation: 'When sigmoid $\\sigma(z)$ is coupled with squared error loss $(y - \\sigma(z))^2$, the resulting optimization objective is non-convex and prone to vanishing gradients when $\\sigma(z) \\approx 0$ or $1$. Binary Cross-Entropy yields a convex optimization landscape.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Logistic Regression', 'Cross Entropy', 'Convexity']
  }
];

const EXTRA_AI_QUESTIONS: Question[] = [
  {
    question_id: 'AI-ORIG-101',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Artificial Intelligence',
    chapter: 'Search Algorithms and Heuristics (BFS, DFS, A*)',
    topic: 'A* Search Algorithm',
    question_type: 'MSQ',
    question_text: 'Which of the following conditions guarantee that the A* search algorithm is optimal (i.e., finds the lowest-cost path to the goal)?',
    options: [
      { id: 'A', text: 'Heuristic $h(n)$ is admissible for Tree Search.' },
      { id: 'B', text: 'Heuristic $h(n)$ is consistent (monotonic) for Graph Search.' },
      { id: 'C', text: 'Heuristic $h(n) = 0$ for all nodes.' },
      { id: 'D', text: 'Heuristic $h(n) > h^*(n)$ for some nodes.' }
    ],
    correct_answer: ['A', 'B', 'C'],
    explanation: 'Admissibility guarantees optimality for tree search. Consistency guarantees optimality for graph search. $h(n) = 0$ is trivial Dijkstra search, which is always optimal. D is inadmissible and can prevent finding optimal paths.',
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['A* Search', 'Heuristics', 'AI']
  },
  {
    question_id: 'AI-ORIG-102',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Artificial Intelligence',
    chapter: 'Adversarial Search (Minimax, Alpha-Beta Pruning)',
    topic: 'Alpha-Beta Pruning Cutoffs',
    question_type: 'MCQ',
    question_text: 'In Alpha-Beta pruning, a branch is pruned at a MIN node when which condition is satisfied?',
    options: [
      { id: 'A', text: '$\\beta \\le \\alpha$' },
      { id: 'B', text: '$\\alpha \\le \\beta$' },
      { id: 'C', text: '$\\alpha = \\infty$' },
      { id: 'D', text: '$\\beta = -\\infty$' }
    ],
    correct_answer: 'A',
    explanation: '$\\alpha$ represents the best value MAX can guarantee, while $\\beta$ is the best value MIN can guarantee. Whenever $\\beta \\le \\alpha$, the parent MAX node will never pick this branch, so remaining children are pruned.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Alpha Beta Pruning', 'Minimax', 'AI']
  },
  {
    question_id: 'AI-ORIG-103',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Artificial Intelligence',
    chapter: 'Bayesian Networks and Probabilistic Reasoning',
    topic: 'd-Separation & Conditional Independence',
    question_type: 'MCQ',
    question_text: 'In a Bayesian Network with collider structure $X \\to Z \\leftarrow Y$, if $Z$ is NOT observed and none of its descendants are observed, what is the conditional independence relationship between $X$ and $Y$?',
    options: [
      { id: 'A', text: '$X$ and $Y$ are conditionally independent given nothing ($X \\perp Y$).' },
      { id: 'B', text: '$X$ and $Y$ are dependent.' },
      { id: 'C', text: '$X$ and $Y$ are conditionally dependent given $Z$.' },
      { id: 'D', text: 'No independence can be inferred.' }
    ],
    correct_answer: 'A',
    explanation: 'In a collider (v-structure) $X \\to Z \\leftarrow Y$, the path between $X$ and $Y$ is BLOCKED when $Z$ (and its descendants) are unobserved. Therefore, $X$ and $Y$ are marginally independent ($X \\perp Y$).',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Bayesian Networks', 'd-Separation']
  },
  {
    question_id: 'AI-ORIG-104',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Artificial Intelligence',
    chapter: 'Propositional and Predicate Logic',
    topic: 'Propositional Logic Connectives & Equivalence',
    question_type: 'MCQ',
    question_text: 'Which of the following propositional logic formulas is a valid TAUTOLOGY?',
    options: [
      { id: 'A', text: '$(P \\to Q) \\leftrightarrow (\\neg P \\lor Q)$' },
      { id: 'B', text: '$(P \\land Q) \\to \\neg P$' },
      { id: 'C', text: '$(P \\lor Q) \\to P$' },
      { id: 'D', text: '$(P \\to Q) \\leftrightarrow (Q \\to P)$' }
    ],
    correct_answer: 'A',
    explanation: 'Implication elimination states that $P \\to Q \\equiv \\neg P \\lor Q$. Thus $(P \\to Q) \\leftrightarrow (\\neg P \\lor Q)$ is true for all truth assignments, making it a tautology.',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['Logic', 'Tautology', 'Propositional Logic']
  }
];

// Combine all datasets
const ALL_GA = [...GENERAL_APTITUDE_QUESTIONS, ...EXTRA_GA_QUESTIONS];
const ALL_PS = [...PROBABILITY_STATISTICS_QUESTIONS, ...EXTRA_PS_QUESTIONS];
const ALL_LA = [...LINEAR_ALGEBRA_QUESTIONS, ...EXTRA_LA_QUESTIONS];
const ALL_CO = [...CALCULUS_OPTIMIZATION_QUESTIONS, ...EXTRA_CO_QUESTIONS];
const ALL_DSA = [...PROGRAMMING_DSA_QUESTIONS, ...EXTRA_DSA_QUESTIONS];
const ALL_DB = [...DBMS_WAREHOUSING_QUESTIONS, ...EXTRA_DB_QUESTIONS];
const ALL_ML = [...MACHINE_LEARNING_QUESTIONS, ...EXTRA_ML_QUESTIONS];
const ALL_AI = [...ARTIFICIAL_INTELLIGENCE_QUESTIONS, ...EXTRA_AI_QUESTIONS];
const ALL_DA_PYQS = [...GATE_DA_OFFICIAL_PYQS];
const ALL_CSE_PYQS = [...GATE_CSE_RELEVANT_PYQS];

// Write individual JSON files
const FILE_MAP: Record<string, Question[]> = {
  'general-aptitude.json': ALL_GA,
  'probability-statistics.json': ALL_PS,
  'linear-algebra.json': ALL_LA,
  'calculus-optimization.json': ALL_CO,
  'programming-dsa.json': ALL_DSA,
  'dbms-warehousing.json': ALL_DB,
  'machine-learning.json': ALL_ML,
  'artificial-intelligence.json': ALL_AI,
  'gate-da-pyqs.json': ALL_DA_PYQS,
  'gate-cse-pyqs.json': ALL_CSE_PYQS
};

let grandTotal = 0;
for (const [filename, questions] of Object.entries(FILE_MAP)) {
  const filePath = path.join(JSON_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');
  console.log(`Saved ${questions.length} questions -> ${filename}`);
  grandTotal += questions.length;
}

console.log(`\nSuccessfully created all structured JSON files. Total questions in bank: ${grandTotal}`);
