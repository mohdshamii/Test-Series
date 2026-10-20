# GATE DA Test Series Platform

> A production-ready, client-side online examination and test series platform built exclusively for **GATE Data Science and Artificial Intelligence (DA)**, featuring mapped previous-year questions from **GATE DA** and relevant overlapping topics from **GATE CSE**.


[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)

---

##  Table of Contents
1. [Overview & Architecture](#overview--architecture)
2. [Reference Platform Analysis](#reference-platform-analysis)
3. [Official GATE DA Syllabus Coverage](#official-gate-da-syllabus-coverage)
4. [Mock Examination Catalogue (100 Tests)](#mock-examination-catalogue-100-tests)
5. [CBT Examination Engine & Scoring Rules](#cbt-examination-engine--scoring-rules)
6. [Structured JSON Question Bank](#structured-json-question-bank)
7. [How to Add New Questions & Tests](#how-to-add-new-questions--tests)
8. [Client Persistence & Local Storage](#client-persistence--local-storage)
9. [Development & Validation](#development--validation)
10. [GitHub Pages Deployment Guide](#github-pages-deployment-guide)

---

## 1. Overview & Architecture

This platform provides an authentic Computer Based Test (CBT) simulation matching the exact IIT GATE online examination interface:
- **Zero Paid Server Backend**: Runs 100% statically in any modern desktop or mobile browser.
- **HashRouter Navigation**: Eliminates 404 routing errors on static GitHub Pages hosting.
- **Jupyter Notebook-Inspired Aesthetic**: Clean technical UI with code cells (`In [x]:` / `Out [x]:`), KaTeX mathematical equation rendering (`$ ... $` and `$$ ... $$`), and responsive dark/light themes.
- **GATE Virtual Scientific Calculator**: Full on-screen calculator supporting trigonometric, inverse trigonometric, logarithmic, exponential, square root, power, and memory functions.
- **Complete Test Series**:
  - **25 Full-Length Mock Exams** (20 All-India Grand Mocks + 2 Official GATE DA Papers + 3 CSE Overlap Mocks)
  - **75 Subject-Wise & Chapter-Wise Mock Tests** covering every chapter across all 8 syllabus subjects.

---

## 2. Reference Platform Analysis

| Platform | Features Studied | Architectural Decisions Taken in this Platform |
| :--- | :--- | :--- |
| **bijzlitestseries.netlify.app** | CBT test interface, 5-state color question palette, timer, on-screen scientific calculator, submit modal. | Implemented authentic 5-state palette (`not_visited`, `not_answered`, `answered`, `marked_for_review`, `answered_marked_for_review`), countdown timer surviving page reloads, and dedicated modal submit verification. |
| **practicepaper.in** | Multi-topic tests with solutions; heavy ad clutter and slow PHP/WordPress backend. | Completely ad-free, 100% client-side React 19 architecture with instant sub-millisecond route transitions. |
| **questions.examside.com** | Fast client-side routing, Inter typography, dark mode, dedicated GATE DA subject filters. | Designed a Jupyter-inspired technical interface, Inter + JetBrains Mono typography, KaTeX formula parsing, and comprehensive question filters. |

---

## 3. Official GATE DA Syllabus Coverage

The platform covers 100% of the official GATE DA examination syllabus across 8 core subjects and 41 chapters:

1. **General Aptitude (GA)** — 15% Weightage
   - Verbal Aptitude (Grammar, Vocabulary, Sentence Completion, Reading Comprehension)
   - Quantitative Aptitude (Percentages, Ratios, Permutations & Combinations, Data Interpretation)
   - Analytical Aptitude (Deductive/Inductive Logic, Syllogism, Sequences)
   - Spatial Aptitude (2D & 3D Transformations, Mirroring, Paper Folding)
2. **Probability and Statistics (PS)** — 12-15% Weightage
   - Counting and Combinatorics
   - Probability and Conditional Probability
   - Bayes' Theorem
   - Random Variables and Distributions (Uniform, Binomial, Poisson, Normal, Exponential)
   - Expectation, Variance, and Covariance (Chebyshev Inequality)
   - Joint Distributions (Joint PMF/PDF, Marginal, Conditional Expectation)
   - Sampling and Statistical Inference (CLT, Hypothesis Testing, z-test, t-test, Chi-square)
3. **Linear Algebra (LA)** — 10-12% Weightage
   - Vector Spaces and Vectors (Span, Basis, Dimension, Linear Independence)
   - Matrices and Linear Systems (Gaussian Elimination, Rank-Nullity, Consistency)
   - Determinants and Rank
   - Eigenvalues and Eigenvectors (Characteristic Equation, Diagonalization, Cayley-Hamilton)
   - Orthogonality and Projections (Gram-Schmidt, Projection Matrices)
   - Matrix Decompositions and SVD (Singular Values, Low-Rank Approximations)
4. **Calculus and Optimization (CO)** — 8-10% Weightage
   - Limits and Continuity
   - Differentiation and Gradients (Directional Derivatives, Jacobians)
   - Hessian Matrix and Taylor Series
   - Maxima, Minima and Optimization (Saddle Points, Gradient Descent, Lagrange Multipliers)
5. **Programming, Data Structures & Algorithms (DSA)** — 14-16% Weightage
   - Python Fundamentals & Data Structures (Lists, Tuples, Dicts, Comprehensions)
   - Stacks, Queues, and Linked Lists
   - Searching and Sorting Algorithms (Binary Search, QuickSort, MergeSort)
   - Trees and Graphs (BST, BFS, DFS, Dijkstra, Topological Sort)
   - Hashing and Asymptotic Complexity (Big-O, Master Theorem)
6. **Database Management and Warehousing (DB)** — 10-12% Weightage
   - Relational Model and Relational Algebra (Select, Project, Join, Division)
   - SQL Queries and Integrity Constraints (GROUP BY, HAVING, Correlated Subqueries)
   - Functional Dependencies and Normalization (Closure, 3NF, BCNF)
   - Indexing and Storage (B-Trees, B+ Trees)
   - Data Warehousing and OLAP (Star Schema, Snowflake, Roll-up, Drill-down, Slice, Dice)
7. **Machine Learning (ML)** — 18-20% Weightage
   - Linear and Logistic Regression (OLS, Sigmoid, Binary Cross-Entropy)
   - Classification Algorithms (k-NN, Naive Bayes, Decision Trees, SVM)
   - Multi-Layer Perceptrons and Neural Networks (Activations, Backpropagation)
   - Loss Functions, Regularization and Optimization (L1 Lasso, L2 Ridge, Bias-Variance)
   - Model Evaluation and Validation (Confusion Matrix, Precision/Recall, F1, ROC-AUC)
   - Clustering and Dimensionality Reduction (k-Means, Hierarchical, PCA)
8. **Artificial Intelligence (AI)** — 10-12% Weightage
   - Search Algorithms and Heuristics (BFS, DFS, Uniform Cost, A* Search)
   - Adversarial Search (Minimax, Alpha-Beta Pruning)
   - Propositional and Predicate Logic (Truth Tables, CNF, Resolution Refutation)
   - Bayesian Networks and Probabilistic Reasoning (d-Separation, Variable Elimination)

---

## 4. Mock Examination Catalogue (100 Tests)

### A. Full-Length & Major Examinations (25 Tests)
- **GATE DA All-India Grand Mocks (1 to 20)**: Complete 65-question, 100-mark, 180-minute simulations with Section 1 (General Aptitude, 15 marks) and Section 2 (Core Technical, 85 marks).
- **GATE DA 2024 Official Paper**: Complete paper conducted by IISc Bangalore.
- **GATE DA 2025 Official Paper**: Complete paper conducted by IIT Roorkee.
- **3 GATE CSE Overlap Special Mocks**:
  - Test 1: Discrete Mathematics, Linear Algebra & Graph Theory
  - Test 2: Data Structures, Searching, Sorting & Asymptotic Analysis
  - Test 3: Relational Algebra, SQL, Normalization & Indexing

### B. Subject-Wise & Chapter-Wise Mock Tests (75 Tests)
- **8 Comprehensive Subject Sectional Tests**: 1 full sectional test for each of the 8 syllabus subjects (45-60 min).
- **41 Chapter Drill Tests (Test 1)**: 1 focused foundational test for every single chapter in the syllabus (30 min, 20 marks).
- **26 Chapter Advanced & PYQ Deep Dive Tests (Test 2)**: Rigorous multi-step problem tests on high-weightage chapters (45 min, 25 marks).

---

## 5. CBT Examination Engine & Scoring Rules

The evaluation engine strictly implements the official GATE scoring blueprint:

| Question Type | Choice Format | Marking Rule | Negative Marking | Partial Credit |
| :--- | :--- | :--- | :--- | :--- |
| **MCQ** (Multiple Choice) | 4 options, 1 correct | +1 or +2 marks | -0.33 (for 1-mark)<br>-0.66 (for 2-mark) | None |
| **MSQ** (Multiple Select) | 4 options, $\ge 1$ correct | +1 or +2 marks | **0.00** (Zero) | None (All correct and no wrong choices required) |
| **NAT** (Numerical Answer) | Real number input | +1 or +2 marks | **0.00** (Zero) | Awarded if answer falls within $[\text{min}, \text{max}]$ |

### CBT State Machine & Keyboard Shortcuts
- **Question Palette States**:
  - `not_visited` (Grey): Question not yet visited
  - `not_answered` (Red): Question visited but no option chosen
  - `answered` (Green): Question answered and saved
  - `marked_for_review` (Purple): Flagged for review without an answer
  - `answered_marked_for_review` (Purple with Green Dot): Answered and flagged for review (evaluated in score)
- **Keyboard Shortcuts**:
  - `Alt + S` / `Option + S`: Save & Next
  - `Alt + R` / `Option + R`: Mark for Review & Next
  - `Alt + P` / `Option + P`: Previous Question
  - `Alt + C` / `Option + C`: Clear Response

---

## 6. Structured JSON Question Bank

All questions are organized into clean, structured `.json` files inside [`src/data/questions/json/`](file:///d:/GATE/TestSeries/src/data/questions/json/):

```
src/data/questions/json/
├── general-aptitude.json          # Verbal, Quantitative, Analytical & Spatial questions
├── probability-statistics.json    # Combinatorics, distributions, Bayes, CLT, inference
├── linear-algebra.json            # Vectors, systems, rank, eigenvalues, SVD, Gram-Schmidt
├── calculus-optimization.json     # Limits, gradients, Hessians, Taylor, Lagrange
├── programming-dsa.json           # Python built-ins, stacks, trees, sorting, Dijkstra
├── dbms-warehousing.json          # Relational algebra, SQL, BCNF, B+ trees, OLAP
├── machine-learning.json          # Regression, SVM, Decision trees, neural nets, PCA
├── artificial-intelligence.json   # A*, Minimax, Alpha-Beta, Logic, Bayes Nets
├── gate-da-pyqs.json              # Authentic GATE DA 2024 & 2025 question papers
└── gate-cse-pyqs.json             # Verified GATE CSE 2015-2023 overlapping questions
```

### Question Schema Reference
```json
{
  "question_id": "ML-CH-01",
  "exam": "GATE",
  "paper": "DA",
  "subject": "Machine Learning",
  "chapter": "Classification Algorithms (k-NN, Naive Bayes, Decision Trees, SVM)",
  "topic": "Support Vector Machines (Margins & Kernels)",
  "question_type": "NAT",
  "question_text": "In a hard-margin linear SVM, the separating hyperplane is given by $w^T x + b = 0$, where $\\|w\\|_2 = 4$. What is the geometric margin width $\\frac{2}{\\|w\\|}$?",
  "correct_answer": 0.5,
  "tolerance": { "min": 0.49, "max": 0.51 },
  "explanation": "The total margin width is $M = \\frac{2}{\\|w\\|} = \\frac{2}{4} = 0.5$.",
  "marks": 1,
  "negative_marks": 0,
  "difficulty": "easy",
  "source_type": "original",
  "da_relevance": "direct",
  "verification_status": "verified",
  "tags": ["SVM", "Margin", "Machine Learning"]
}
```

---

## 7. How to Add New Questions & Tests

### Adding a Question
1. Open the appropriate JSON file in `src/data/questions/json/` (e.g. `linear-algebra.json`).
2. Add a new JSON object adhering to the schema above.
3. Run the schema validation command:
   ```bash
   npm run validate:questions
   ```
4. If valid, the new question is immediately available in the Question Bank, Subject Directory, Practice Drills, Custom Test Builder, and Mock Examinations!

### Adding a New Chapter or Test
1. In [`src/data/mockTests/chapterTests.ts`](file:///d:/GATE/TestSeries/src/data/mockTests/chapterTests.ts), define a new `TestConfig` object specifying `id`, `title`, `durationMinutes`, `sections`, and `questionIds`.
2. Re-run `npm run build` to confirm type checking.

---

## 8. Client Persistence & Local Storage

All state persists client-side in `localStorage` under namespaced keys:
- `gate_da_user_progress`: Test history, scores, accuracy, bookmarks, and incorrect question log.
- `gate_da_active_session`: Active CBT examination session (preserves answers, palette state, and absolute `deadlineTimestamp` during browser refreshes).
- `gate_da_theme`: Light / Dark mode preference.

### Data Portability
Students can export their full test history, bookmarks, and mistake logs as a JSON file or import previously exported logs from the **Settings** page (`#/settings`).

---

## 9. Development & Validation

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Available Commands
```bash
# Install dependencies
npm install

# Start local development server (with HMR)
npm run dev

# Run scoring engine unit tests (Vitest)
npm run test

# Run question bank schema and syllabus audit
npm run validate:questions

# Build production bundle for static hosting
npm run build
```

---

## 10. GitHub Pages Deployment Guide

The platform is pre-configured for automated deployment to GitHub Pages via GitHub Actions:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of GATE DA Test Series Platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. **Configure GitHub Pages in Repository Settings**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. **Automated CI/CD Pipeline**:
   - The workflow in [`.github/workflows/deploy.yml`](file:///d:/GATE/TestSeries/.github/workflows/deploy.yml) automatically runs on every push to `main`:
     - Checks out code
     - Installs dependencies
     - Runs unit tests (`npm run test`)
     - Audits questions (`npm run validate:questions`)
     - Builds production bundle (`npm run build`)
     - Deploys static build to GitHub Pages.
4. **Access your live site**:
   - Your site will be published at: `https://<your-username>.github.io/<your-repo-name>/`.
   - Because `HashRouter` is used, direct URLs (e.g. `#/mocks`, `#/exam/gate-da-full-mock-1`) work out of the box with zero 404 errors!

---

## 📄 License
MIT License. Open source for student preparation and education.
