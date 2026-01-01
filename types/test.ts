// 검사(Test) 관련 타입 정의

/** 대상 학년 */
export type TargetAudience = '초등' | '중등' | '고등' | '학부모' | '전체';

/** 태그 타입 */
export type TestTag = 'NEW' | 'BEST' | '인기' | '추천' | '무료' | '프리미엄';

/** 카테고리 */
export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  order: number;
}

/** 프리미엄 리포트 정보 */
export interface PremiumInfo {
  available: boolean;
  price?: number;
  features?: string[];
}

/** 검사 정보 */
export interface Test {
  id: string;
  title: string;
  emoji: string;
  shortDesc: string;

  // 분류
  category: string;
  tags: TestTag[];
  targetAudience: TargetAudience[];

  // 검사 정보
  questionCount: number;
  timeMinutes: number;
  participants: number;

  // 상태
  createdAt: string;
  isNew: boolean;
  isActive: boolean;

  // 연관 검사
  relatedTests: string[];

  // 프리미엄
  premium: PremiumInfo;
}

/** 검사 목록 응답 */
export interface TestsData {
  tests: Test[];
  updatedAt: string;
}

/** 카테고리 목록 응답 */
export interface CategoriesData {
  categories: Category[];
}

/** 검사 카드에 표시할 정보 (간략 버전) */
export type TestCard = Pick<
  Test,
  'id' | 'title' | 'emoji' | 'shortDesc' | 'category' | 'tags' | 'questionCount' | 'timeMinutes' | 'participants' | 'isNew'
>;
