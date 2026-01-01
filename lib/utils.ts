import { Answer, CategoryScore, Question } from "@/types";

/**
 * 카테고리별 점수 계산
 */
export function calculateCategoryScores(
  questions: Question[],
  answers: Answer[]
): CategoryScore[] {
  const categoryMap = new Map<string, { score: number; maxScore: number }>();

  // 카테고리별 점수 집계
  questions.forEach((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    const maxOptionValue = Math.max(...question.options.map((o) => o.value));

    if (!categoryMap.has(question.category)) {
      categoryMap.set(question.category, { score: 0, maxScore: 0 });
    }

    const categoryData = categoryMap.get(question.category)!;
    categoryData.maxScore += maxOptionValue;

    if (answer) {
      categoryData.score += answer.value;
    }
  });

  // CategoryScore 배열로 변환
  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    score: data.score,
    maxScore: data.maxScore,
    percentage: data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0,
  }));
}

/**
 * 클래스명 병합 유틸리티
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
