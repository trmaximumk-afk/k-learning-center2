import { Answer } from '@/types';

/**
 * 검사 결과의 총점을 계산합니다.
 */
export function calculateTotalScore(answers: Answer[]): number {
  return answers.reduce((total, answer) => total + answer.score, 0);
}

/**
 * 클래스 이름을 조건부로 결합합니다.
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 날짜를 한국어 형식으로 포맷합니다.
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
