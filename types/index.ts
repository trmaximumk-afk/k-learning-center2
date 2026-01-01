// 검사 관련 타입 정의

export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export interface Option {
  id: string;
  text: string;
  score: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface TestResult {
  testId: string;
  answers: Answer[];
  totalScore: number;
  completedAt: string;
}

export interface Answer {
  questionId: string;
  selectedOptionId: string;
  score: number;
}
