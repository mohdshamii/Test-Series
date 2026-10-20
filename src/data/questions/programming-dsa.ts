import { Question } from '../../types/question';

export const PROGRAMMING_DSA_QUESTIONS: Question[] = [
  {
    question_id: 'dsa-pyq-2024-01',
    exam: 'GATE',
    paper: 'DA',
    exam_year: 2024,
    subject: 'Programming, Data Structures & Algorithms',
    chapter: 'Python Fundamentals & Data Structures',
    topic: 'Python Control Flow',
    question_type: 'NAT',
    question_text: 'Consider the following Python code fragment:\n```python\ndef mystery(n):\n    val = 0\n    for i in range(1, n + 1):\n        for j in range(1, i + 1):\n            val += 1\n    return val\n\nprint(mystery(10))\n```\nWhat integer value is printed by this program?',
    correct_answer: 55,
    tolerance: { min: 55, max: 55, exactValue: 55 },
    marks: 1,
    negative_marks: 0,
    difficulty: 'easy',
    source_type: 'official_pyq',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['python', 'loops', 'summation'],
    code_snippet: {
      language: 'python',
      code: 'def mystery(n):\n    val = 0\n    for i in range(1, n + 1):\n        for j in range(1, i + 1):\n            val += 1\n    return val\n\nprint(mystery(10))'
    },
    explanation: 'The nested loop increments `val` $1 + 2 + 3 + \\dots + 10$ times.\nThe sum of first 10 positive integers is $\\frac{10 \\times 11}{2} = 55$.'
  },
  {
    question_id: 'dsa-pyq-2024-02',
    exam: 'GATE',
    paper: 'DA',
    exam_year: 2024,
    subject: 'Programming, Data Structures & Algorithms',
    chapter: 'Trees and Graphs',
    topic: 'Binary Search Trees (BST)',
    question_type: 'MCQ',
    question_text: 'Keys $10, 5, 20, 15, 30, 25$ are inserted into an initially empty Binary Search Tree (BST) in the given order. Which of the following represents the preorder traversal sequence of the resulting BST?',
    options: [
      { id: 'A', text: '10, 5, 20, 15, 30, 25' },
      { id: 'B', text: '5, 10, 15, 20, 25, 30' },
      { id: 'C', text: '10, 5, 20, 30, 15, 25' },
      { id: 'D', text: '10, 20, 30, 25, 15, 5' }
    ],
    correct_answer: 'A',
    marks: 2,
    negative_marks: 0.66,
    difficulty: 'medium',
    source_type: 'official_pyq',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['bst', 'tree-traversal', 'preorder'],
    explanation: 'Constructing BST step-by-step:\n- Insert 10: Root is 10.\n- Insert 5: Left child of 10.\n- Insert 20: Right child of 10.\n- Insert 15: Left child of 20.\n- Insert 30: Right child of 20.\n- Insert 25: Left child of 30.\nPreorder Traversal (Root, Left, Right):\n1. Visit 10.\n2. Visit left subtree of 10: 5.\n3. Visit right subtree of 10: Root 20, left child 15, right child 30 (whose left child is 25).\nSequence: 10, 5, 20, 15, 30, 25.'
  },
  {
    question_id: 'dsa-prac-msq-01',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Programming, Data Structures & Algorithms',
    chapter: 'Hashing and Asymptotic Complexity',
    topic: 'Time Complexity of Python Built-ins',
    question_type: 'MSQ',
    question_text: 'Which of the following operations have an average-case time complexity of $\\mathcal{O}(1)$ in standard Python (CPython implementation)?',
    options: [
      { id: 'A', text: 'Checking key membership in a dictionary: `key in my_dict`' },
      { id: 'B', text: 'Appending an element to the end of a list: `my_list.append(item)`' },
      { id: 'C', text: 'Deleting an element from the beginning of a list: `my_list.pop(0)`' },
      { id: 'D', text: 'Adding an element to a hash set: `my_set.add(elem)`' }
    ],
    correct_answer: ['A', 'B', 'D'],
    marks: 2,
    negative_marks: 0,
    difficulty: 'medium',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['python-internals', 'complexity', 'hash-table'],
    explanation: '- (A) `key in my_dict`: Average $\\mathcal{O}(1)$ via hash lookup.\n- (B) `my_list.append(item)`: Amortized $\\mathcal{O}(1)$ dynamic array append.\n- (C) `my_list.pop(0)`: $\\mathcal{O}(n)$ because all subsequent elements must shift left by 1 position.\n- (D) `my_set.add(elem)`: Average $\\mathcal{O}(1)$ hash set insertion.'
  },
  {
    question_id: 'dsa-prac-mcq-04',
    exam: 'GATE',
    paper: 'DA',
    subject: 'Programming, Data Structures & Algorithms',
    chapter: 'Trees and Graphs',
    topic: "Dijkstra's Shortest Path",
    question_type: 'MCQ',
    question_text: "Dijkstra's single-source shortest path algorithm is executed on a directed weighted graph $G = (V, E)$ with non-negative edge weights. Using a min-priority queue implemented with a binary min-heap, what is the tight asymptotic time complexity of the algorithm?",
    options: [
      { id: 'A', text: '$\\mathcal{O}((|V| + |E|) \\log |V|)$' },
      { id: 'B', text: '$\\mathcal{O}(|V|^2)$' },
      { id: 'C', text: '$\\mathcal{O}(|V| |E|)$' },
      { id: 'D', text: '$\\mathcal{O}(|E| \\log |E| + |V|)$' }
    ],
    correct_answer: 'A',
    marks: 1,
    negative_marks: 0.33,
    difficulty: 'easy',
    source_type: 'original',
    da_relevance: 'direct',
    verification_status: 'verified',
    tags: ['dijkstra', 'graph-algorithms', 'heap'],
    explanation: "Dijkstra's algorithm performs $|V|$ `extract-min` operations (each $\\mathcal{O}(\\log |V|)$) and up to $|E|$ `decrease-key` operations (each $\\mathcal{O}(\\log |V|)$) using a binary heap, giving overall running time $\\mathcal{O}((|V| + |E|) \\log |V|)$."
  }
];
