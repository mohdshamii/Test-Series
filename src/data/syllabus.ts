export interface SyllabusChapter {
  id: string;
  name: string;
  description: string;
  topics: string[];
  cseOverlap?: boolean; // Indicates concept overlaps with GATE CSE syllabus
}

export interface SyllabusSubject {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
  weightageApprox: string; // e.g. "12-15%"
  isGeneralAptitude?: boolean;
  chapters: SyllabusChapter[];
}

export const GATE_DA_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'general-aptitude',
    name: 'General Aptitude',
    code: 'GA',
    icon: 'BrainCircuit',
    description: 'Verbal, quantitative, analytical, and spatial reasoning skills essential for engineering graduates.',
    weightageApprox: '15%',
    isGeneralAptitude: true,
    chapters: [
      {
        id: 'verbal-aptitude',
        name: 'Verbal Aptitude',
        description: 'Basic English grammar, vocabulary, reading comprehension, narrative sequencing.',
        topics: ['Grammar & Parts of Speech', 'Vocabulary in Context', 'Sentence Completion', 'Critical Reasoning', 'Reading Comprehension'],
        cseOverlap: true
      },
      {
        id: 'quantitative-aptitude',
        name: 'Quantitative Aptitude',
        description: 'Numerical computation, percentages, ratios, elementary statistics, permutations and combinations.',
        topics: ['Numerical Computation', 'Percentages & Ratios', 'Permutations & Combinations', 'Data Interpretation (Charts/Graphs)', 'Geometry & Mensuration'],
        cseOverlap: true
      },
      {
        id: 'analytical-aptitude',
        name: 'Analytical Aptitude',
        description: 'Logic deduction, induction, syllogism, relational puzzles, analogy.',
        topics: ['Deductive & Inductive Reasoning', 'Syllogism', 'Relational Sequences', 'Analogies & Truth Values'],
        cseOverlap: true
      },
      {
        id: 'spatial-aptitude',
        name: 'Spatial Aptitude',
        description: 'Transformation of 2D and 3D shapes, translation, rotation, mirroring, paper folding.',
        topics: ['Shape Assembly', 'Paper Folding & Cutting', 'Mirroring & Reflections', '2D & 3D Projections'],
        cseOverlap: true
      }
    ]
  },
  {
    id: 'probability-and-statistics',
    name: 'Probability and Statistics',
    code: 'PS',
    icon: 'Percent',
    description: 'Foundations of uncertainty, discrete/continuous distributions, expectation, hypothesis testing, sampling.',
    weightageApprox: '12-15%',
    chapters: [
      {
        id: 'counting-and-combinatorics',
        name: 'Counting and Combinatorics',
        description: 'Permutations, combinations, pigeonhole principle, binomial coefficients.',
        topics: ['Permutations & Combinations', 'Inclusion-Exclusion Principle', 'Pigeonhole Principle', 'Binomial Coefficients'],
        cseOverlap: true
      },
      {
        id: 'probability-and-conditional',
        name: 'Probability and Conditional Probability',
        description: 'Sample spaces, axioms of probability, independent events, conditional probability.',
        topics: ['Axioms of Probability', 'Independent Events', 'Conditional Probability', 'Multiplication Rule'],
        cseOverlap: true
      },
      {
        id: 'bayes-theorem',
        name: "Bayes' Theorem",
        description: 'Law of total probability, Bayes rule, prior and posterior distributions.',
        topics: ['Total Probability Rule', "Bayes' Inversion Rule", 'Prior & Posterior Probabilities'],
        cseOverlap: true
      },
      {
        id: 'random-variables-and-distributions',
        name: 'Random Variables and Distributions',
        description: 'Discrete & continuous RVs, PMF, PDF, CDF, uniform, binomial, Poisson, normal, exponential.',
        topics: ['Discrete RVs (PMF)', 'Continuous RVs (PDF, CDF)', 'Uniform & Normal Distributions', 'Binomial & Poisson Distributions', 'Exponential Distribution'],
        cseOverlap: true
      },
      {
        id: 'expectation-and-variance',
        name: 'Expectation, Variance and Covariance',
        description: 'Moments, variance, covariance, correlation coefficient, Chebyshev inequality.',
        topics: ['Expected Value Properties', 'Variance & Standard Deviation', 'Covariance & Correlation', "Chebyshev's Inequality"],
        cseOverlap: true
      },
      {
        id: 'joint-distributions',
        name: 'Joint Distributions',
        description: 'Joint PMF/PDF, marginal distributions, conditional expectation, independence.',
        topics: ['Joint PMF & PDF', 'Marginal Distributions', 'Conditional Expectation', 'Bivariate Normal'],
        cseOverlap: false
      },
      {
        id: 'statistical-inference',
        name: 'Sampling and Statistical Inference',
        description: 'Central Limit Theorem, confidence intervals, hypothesis testing, z-test, t-test, chi-square.',
        topics: ['Law of Large Numbers', 'Central Limit Theorem (CLT)', 'Hypothesis Testing (p-value)', 'z-test & t-test', 'Chi-square & ANOVA'],
        cseOverlap: false
      }
    ]
  },
  {
    id: 'linear-algebra',
    name: 'Linear Algebra',
    code: 'LA',
    icon: 'Grid3X3',
    description: 'Vector spaces, matrix operations, rank, linear systems, eigenvalues, projections, SVD.',
    weightageApprox: '10-12%',
    chapters: [
      {
        id: 'vector-spaces',
        name: 'Vector Spaces and Vectors',
        description: 'Subspaces, linear combinations, span, basis, dimension, linear independence.',
        topics: ['Vector Spaces & Subspaces', 'Linear Independence', 'Basis & Dimension', 'Span of Vectors'],
        cseOverlap: true
      },
      {
        id: 'matrices-and-linear-systems',
        name: 'Matrices and Linear Systems',
        description: 'Matrix multiplication, inverse, row reduction, echelon form, consistency of Ax = b.',
        topics: ['Matrix Arithmetic', 'Gaussian Elimination', 'Rank-Nullity Theorem', 'System of Linear Equations (Consistency)'],
        cseOverlap: true
      },
      {
        id: 'determinants-and-rank',
        name: 'Determinants and Rank',
        description: 'Properties of determinants, minors, cofactors, rank computation.',
        topics: ['Determinant Properties', 'Invertibility & Rank', 'Cramer Rule', 'Block Matrices'],
        cseOverlap: true
      },
      {
        id: 'eigenvalues-and-eigenvectors',
        name: 'Eigenvalues and Eigenvectors',
        description: 'Characteristic polynomials, spectral theorem, diagonalization, Cayley-Hamilton theorem.',
        topics: ['Characteristic Equation', 'Eigenvalues & Eigenvectors', 'Diagonalization', 'Cayley-Hamilton Theorem'],
        cseOverlap: true
      },
      {
        id: 'orthogonality-and-projections',
        name: 'Orthogonality and Projections',
        description: 'Inner product, orthogonal vectors, Gram-Schmidt process, orthogonal projection.',
        topics: ['Dot Product & Norms', 'Orthogonal & Orthonormal Sets', 'Gram-Schmidt Process', 'Projection Matrix'],
        cseOverlap: false
      },
      {
        id: 'matrix-decompositions-and-svd',
        name: 'Matrix Decompositions and SVD',
        description: 'Spectral decomposition, singular values, SVD formulation and low-rank approximation.',
        topics: ['Spectral Decomposition', 'Singular Value Decomposition (SVD)', 'Pseudo-inverse', 'Low-Rank Matrix Approximations'],
        cseOverlap: false
      }
    ]
  },
  {
    id: 'calculus-and-optimization',
    name: 'Calculus and Optimization',
    code: 'CO',
    icon: 'TrendingUp',
    description: 'Multivariate calculus, gradients, Hessians, Taylor series, unconstrained and constrained optimization.',
    weightageApprox: '8-10%',
    chapters: [
      {
        id: 'limits-and-continuity',
        name: 'Limits and Continuity',
        description: 'Limits of single and multi-variable functions, continuity, differentiability.',
        topics: ['Single-variable Limits', 'Multivariate Limits', 'Continuity & Discontinuities', 'Differentiability'],
        cseOverlap: true
      },
      {
        id: 'differentiation-and-derivatives',
        name: 'Differentiation and Gradients',
        description: 'Partial derivatives, chain rule, directional derivatives, gradient vectors, Jacobians.',
        topics: ['Partial Derivatives', 'Chain Rule for Multi-variables', 'Directional Derivatives', 'Gradient & Jacobian'],
        cseOverlap: false
      },
      {
        id: 'higher-order-derivatives-and-taylor',
        name: 'Hessian Matrix and Taylor Series',
        description: 'Second-order partial derivatives, Hessian matrix, Taylor polynomial approximations.',
        topics: ['Hessian Matrix', 'Taylor Series Expansion (1D & 2D)', 'Quadratic Forms & Definiteness'],
        cseOverlap: false
      },
      {
        id: 'maxima-minima-and-optimization',
        name: 'Maxima, Minima and Optimization',
        description: 'Critical points, saddle points, unconstrained optimization, gradient descent, Lagrange multipliers.',
        topics: ['Critical Points & Second Derivative Test', 'Saddle Points', 'Gradient Descent Algorithm', 'Lagrange Multipliers'],
        cseOverlap: false
      }
    ]
  },
  {
    id: 'programming-dsa',
    name: 'Programming, Data Structures & Algorithms',
    code: 'DSA',
    icon: 'Code',
    description: 'Python programming constructs, linear and non-linear data structures, searching, sorting, graph algorithms, asymptotic analysis.',
    weightageApprox: '14-16%',
    chapters: [
      {
        id: 'python-fundamentals',
        name: 'Python Fundamentals & Data Structures',
        description: 'Python syntax, control flow, functions, recursion, lists, tuples, dictionaries, sets.',
        topics: ['Python Control Flow', 'Functions & Recursion', 'Lists, Tuples & Sets', 'Dictionaries & Comprehensions', 'Time Complexity of Python Built-ins'],
        cseOverlap: false
      },
      {
        id: 'linear-data-structures',
        name: 'Stacks, Queues, and Linked Lists',
        description: 'Array and node-based implementations, push/pop, queue operations, linked list manipulation.',
        topics: ['Singly & Doubly Linked Lists', 'Stack Operations & Applications', 'Queues & Circular Queues', 'Priority Queues'],
        cseOverlap: true
      },
      {
        id: 'searching-and-sorting',
        name: 'Searching and Sorting Algorithms',
        description: 'Linear search, binary search, bubble sort, insertion sort, merge sort, quicksort, heapsort.',
        topics: ['Binary Search & Variants', 'Merge Sort & Divide-and-Conquer', 'QuickSort Partitioning', 'Comparison-Based Sorting Bounds'],
        cseOverlap: true
      },
      {
        id: 'trees-and-graphs',
        name: 'Trees and Graphs',
        description: 'Binary trees, BST, BFS, DFS, shortest path (Dijkstra), minimum spanning trees.',
        topics: ['Binary Search Trees (BST)', 'Tree Traversals (In/Pre/Post)', 'BFS & DFS Traversals', "Dijkstra's Shortest Path", 'Topological Sort'],
        cseOverlap: true
      },
      {
        id: 'hashing-and-complexity',
        name: 'Hashing and Asymptotic Complexity',
        description: 'Hash functions, collision resolution, Big-O, Theta, Omega notations, recurrence relations.',
        topics: ['Asymptotic Notations (O, Ω, Θ)', 'Master Theorem & Recurrences', 'Hash Functions & Collisions', 'Chaining & Open Addressing'],
        cseOverlap: true
      }
    ]
  },
  {
    id: 'dbms-and-warehousing',
    name: 'Database Management and Warehousing',
    code: 'DB',
    icon: 'Database',
    description: 'Relational model, SQL queries, normalization, indexing, data warehousing, OLAP, star/snowflake schemas.',
    weightageApprox: '10-12%',
    chapters: [
      {
        id: 'relational-model-and-algebra',
        name: 'Relational Model and Relational Algebra',
        description: 'Relations, tuples, selection, projection, joins, set operations, division.',
        topics: ['Relational Model Concepts', 'Relational Algebra (Select, Project, Join)', 'Relational Calculus Basics'],
        cseOverlap: true
      },
      {
        id: 'sql-queries-and-constraints',
        name: 'SQL Queries and Integrity Constraints',
        description: 'SELECT, GROUP BY, HAVING, subqueries, correlated subqueries, primary/foreign keys.',
        topics: ['SQL Joins (Inner, Left, Right, Full)', 'Aggregate Functions & GROUP BY', 'Correlated Subqueries', 'Integrity Constraints & Keys'],
        cseOverlap: true
      },
      {
        id: 'functional-dependencies-normalization',
        name: 'Functional Dependencies and Normalization',
        description: 'Closure of attributes, candidate keys, 1NF, 2NF, 3NF, BCNF, lossless join decomposition.',
        topics: ['Attribute Closure', 'Minimal Cover', 'Candidate Key Computation', 'Normal Forms (3NF, BCNF)', 'Lossless Join & Dependency Preservation'],
        cseOverlap: true
      },
      {
        id: 'indexing-and-storage',
        name: 'Indexing and Storage',
        description: 'B-tree and B+ tree indexing, dense vs sparse index, hashing in databases.',
        topics: ['B-Trees & B+ Trees Structure', 'Search & Insertion in B+ Trees', 'Clustered vs Non-Clustered Indexes'],
        cseOverlap: true
      },
      {
        id: 'data-warehousing-and-olap',
        name: 'Data Warehousing and OLAP',
        description: 'Data warehouse architecture, star schema, snowflake schema, fact/dimension tables, OLAP operations (slice, dice, drill-down).',
        topics: ['Star Schema & Snowflake Schema', 'Fact & Dimension Tables', 'OLAP Operations (Roll-up, Drill-down, Slice, Dice)', 'ETL Pipeline Concepts'],
        cseOverlap: false
      }
    ]
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    code: 'ML',
    icon: 'Cpu',
    description: 'Supervised and unsupervised learning, regression, classification, neural nets, clustering, PCA, model evaluation.',
    weightageApprox: '18-20%',
    chapters: [
      {
        id: 'linear-and-logistic-regression',
        name: 'Linear and Logistic Regression',
        description: 'Ordinary least squares, gradient descent, cost functions, odds ratio, sigmoid function, cross-entropy.',
        topics: ['Ordinary Least Squares (OLS)', 'Gradient Descent for Regression', 'Logistic Regression & Sigmoid', 'Binary Cross-Entropy Loss'],
        cseOverlap: false
      },
      {
        id: 'classification-algorithms',
        name: 'Classification Algorithms (k-NN, Naive Bayes, Decision Trees, SVM)',
        description: 'Distance metrics, curse of dimensionality, prior/posterior probabilities, Gini impurity, information gain, hyperplanes, kernels.',
        topics: ['k-Nearest Neighbours (k-NN)', 'Naive Bayes Classifier', 'Decision Trees (Entropy & Information Gain)', 'Support Vector Machines (Margins & Kernels)'],
        cseOverlap: false
      },
      {
        id: 'neural-networks',
        name: 'Multi-Layer Perceptrons and Neural Networks',
        description: 'Perceptrons, activation functions (ReLU, Sigmoid, Tanh, Softmax), forward propagation, backpropagation.',
        topics: ['Single Perceptron & XOR Problem', 'Activation Functions', 'Multi-Layer Perceptron Architecture', 'Backpropagation & Chain Rule'],
        cseOverlap: false
      },
      {
        id: 'regularization-and-optimization',
        name: 'Loss Functions, Regularization and Optimization',
        description: 'L1 (Lasso) vs L2 (Ridge) regularization, bias-variance tradeoff, learning rate, momentum.',
        topics: ['Bias-Variance Tradeoff', 'L1 (Lasso) Regularization (Sparsity)', 'L2 (Ridge) Regularization', 'Learning Rate & Convergence'],
        cseOverlap: false
      },
      {
        id: 'model-evaluation',
        name: 'Model Evaluation and Validation',
        description: 'Confusion matrix, precision, recall, F1-score, ROC-AUC, k-fold cross-validation.',
        topics: ['Confusion Matrix & Precision/Recall', 'F1-Score & Harmonic Mean', 'ROC Curves & AUC', 'k-fold Cross-Validation'],
        cseOverlap: false
      },
      {
        id: 'clustering-and-pca',
        name: 'Clustering and Dimensionality Reduction (PCA)',
        description: 'k-means clustering, elbow method, hierarchical clustering, dendrograms, PCA formulation and eigenvalues.',
        topics: ['k-Means Clustering Algorithm', 'Elbow Method & Silhouette Score', 'Hierarchical Clustering (Single/Complete Linkage)', 'PCA (Covariance Eigenvectors)'],
        cseOverlap: false
      }
    ]
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    code: 'AI',
    icon: 'Sparkles',
    description: 'Problem-solving as search, heuristic search (A*), adversarial games (Minimax, Alpha-Beta), propositional/predicate logic, Bayesian networks.',
    weightageApprox: '10-12%',
    chapters: [
      {
        id: 'uninformed-and-informed-search',
        name: 'Search Algorithms and Heuristics (BFS, DFS, A*)',
        description: 'State space representation, BFS, DFS, uniform cost search, greedy best-first, A* algorithm, admissibility, consistency.',
        topics: ['State Space Search', 'Uniform Cost Search', 'A* Search Algorithm', 'Admissible & Consistent Heuristics'],
        cseOverlap: false
      },
      {
        id: 'adversarial-search',
        name: 'Adversarial Search (Minimax, Alpha-Beta Pruning)',
        description: 'Game trees, zero-sum games, minimax value, alpha-beta pruning rules and efficiency.',
        topics: ['Game Trees & Minimax Algorithm', 'Alpha-Beta Pruning Cutoffs', 'Evaluation Functions in Games'],
        cseOverlap: false
      },
      {
        id: 'logic-and-knowledge-representation',
        name: 'Propositional and Predicate Logic',
        description: 'Syntax and semantics, truth tables, tautologies, entailment, resolution refutation, first-order logic, unification.',
        topics: ['Propositional Logic Connectives & Equivalence', 'First-Order Predicate Logic (Quantifiers)', 'Conjunctive Normal Form (CNF)', 'Resolution Refutation'],
        cseOverlap: true
      },
      {
        id: 'probabilistic-reasoning-and-bayes-nets',
        name: 'Bayesian Networks and Probabilistic Reasoning',
        description: 'Directed acyclic graphs, conditional independence, d-separation, joint probability factorization, inference by variable elimination.',
        topics: ['Bayesian Network Topology', 'Factorization of Joint Distribution', 'd-Separation & Conditional Independence', 'Variable Elimination Algorithm'],
        cseOverlap: false
      }
    ]
  }
];

export function getSubjectById(id: string): SyllabusSubject | undefined {
  return GATE_DA_SYLLABUS.find(s => s.id === id);
}

export function getChapterById(subjectId: string, chapterId: string): SyllabusChapter | undefined {
  const subject = getSubjectById(subjectId);
  return subject?.chapters.find(c => c.id === chapterId);
}
