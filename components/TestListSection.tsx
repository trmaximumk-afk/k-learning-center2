'use client';

import { useState, useMemo } from 'react';
import { Test } from '@/types/test';
import { TestCard } from './TestCard';

interface TestListSectionProps {
  tests: Test[];
}

type FilterTab = '전체' | 'NEW' | '인기';

export function TestListSection({ tests }: TestListSectionProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = useMemo(() => {
    let result = tests;

    // Tab filter
    if (activeTab === 'NEW') {
      result = result.filter((test) => test.isNew);
    } else if (activeTab === '인기') {
      result = result.filter((test) => test.tags.includes('인기') || test.tags.includes('BEST'));
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (test) =>
          test.title.toLowerCase().includes(query) ||
          test.shortDesc.toLowerCase().includes(query) ||
          test.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [tests, activeTab, searchQuery]);

  const tabs: FilterTab[] = ['전체', 'NEW', '인기'];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">전체 검사</h2>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 sm:max-w-xs">
            <div className="relative">
              <input
                type="text"
                placeholder="검사 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {filteredTests.length}개의 검사
        </p>

        {/* Test List */}
        {filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </section>
  );
}
