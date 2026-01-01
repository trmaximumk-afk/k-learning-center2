'use client';

import { useState, useMemo } from 'react';
import { Test, Category } from '@/types/test';
import { HeroSection } from './HeroSection';
import { TestCard } from './TestCard';
import { CategoryCard } from './CategoryCard';
import { TestListSection } from './TestListSection';

interface HomePageProps {
  tests: Test[];
  categories: Category[];
}

export function HomePage({ tests, categories }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 총 참여자 수
  const totalParticipants = useMemo(
    () => tests.reduce((sum, test) => sum + test.participants, 0),
    [tests]
  );

  // NEW 검사
  const newTests = useMemo(
    () => tests.filter((test) => test.isNew),
    [tests]
  );

  // 인기 검사 TOP 3
  const popularTests = useMemo(
    () => [...tests].sort((a, b) => b.participants - a.participants).slice(0, 3),
    [tests]
  );

  // 카테고리별 검사 수
  const categoryTestCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tests.forEach((test) => {
      counts[test.category] = (counts[test.category] || 0) + 1;
    });
    return counts;
  }, [tests]);

  // 카테고리 필터링된 검사
  const filteredByCategory = useMemo(() => {
    if (!selectedCategory) return tests;
    return tests.filter((test) => test.category === selectedCategory);
  }, [tests, selectedCategory]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 1. 히어로 섹션 */}
      <HeroSection totalParticipants={totalParticipants} />

      {/* 2. NEW 검사 섹션 */}
      {newTests.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">NEW</span>
              <h2 className="text-xl font-bold text-gray-900">새로 나온 검사</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {newTests.map((test) => (
                <TestCard key={test.id} test={test} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. 인기 검사 TOP 3 */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔥</span>
            <h2 className="text-xl font-bold text-gray-900">인기 검사 TOP 3</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularTests.map((test, index) => (
              <div key={test.id} className="relative">
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                  {index + 1}
                </div>
                <TestCard test={test} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 카테고리별 검사 */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">카테고리별 검사</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                testCount={categoryTestCounts[category.id] || 0}
                isSelected={selectedCategory === category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              />
            ))}
          </div>

          {/* 선택된 카테고리 검사 목록 */}
          {selectedCategory && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">
                  {categories.find((c) => c.id === selectedCategory)?.name} 검사
                </h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  전체 보기 ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredByCategory.map((test) => (
                  <TestCard key={test.id} test={test} variant="horizontal" />
                ))}
              </div>
              {filteredByCategory.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  해당 카테고리의 검사가 없습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 5. 검사 전체 목록 */}
      <TestListSection tests={tests} />

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">© 2024 K-Learning Center. All rights reserved.</p>
          <p className="text-xs mt-2">학생과 학부모를 위한 학습 진단 검사 플랫폼</p>
        </div>
      </footer>
    </main>
  );
}
