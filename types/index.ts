// 타입 re-export
export * from './test';

// 질문/답변 관련 타입 정의

export interface Question {
  id: string;
  text: string;
  options: Option[];
  category: string;
}

export interface Option {
  id: string;
  text: string;
  value: number;
}

export interface TestResult {
  testId: string;
  userId?: string;
  answers: Answer[];
  scores: CategoryScore[];
  completedAt: string;
}

export interface Answer {
  questionId: string;
  selectedOptionId: string;
  value: number;
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

/** 검사 상세 정보 (질문 포함) */
export interface TestDetail {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  categories: string[];
}
