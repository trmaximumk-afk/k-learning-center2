'use client';

import { Test, TestTag } from '@/types/test';

interface TestCardProps {
  test: Test;
  variant?: 'default' | 'compact' | 'horizontal';
}

const tagStyles: Record<TestTag, string> = {
  NEW: 'bg-red-500 text-white',
  BEST: 'bg-yellow-500 text-white',
  '인기': 'bg-blue-500 text-white',
  '추천': 'bg-green-500 text-white',
  '무료': 'bg-gray-500 text-white',
  '프리미엄': 'bg-purple-500 text-white',
};

export function TestCard({ test, variant = 'default' }: TestCardProps) {
  const formatParticipants = (count: number) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}만명`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}천명`;
    return `${count}명`;
  };

  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-3xl">
          {test.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {test.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${tagStyles[tag]}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-semibold text-gray-900 truncate">{test.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{test.shortDesc}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span>📝 {test.questionCount}문항</span>
            <span>⏱️ {test.timeMinutes}분</span>
            <span>👥 {formatParticipants(test.participants)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex-shrink-0 w-48 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
        <div className="text-3xl mb-2">{test.emoji}</div>
        <div className="flex items-center gap-1 mb-1">
          {test.isNew && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-red-500 text-white">
              NEW
            </span>
          )}
        </div>
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{test.title}</h3>
        <p className="text-xs text-gray-400 mt-1">
          {test.questionCount}문항 · {test.timeMinutes}분
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-3xl">
          {test.emoji}
        </div>
        <div className="flex gap-1">
          {test.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-1 text-xs font-medium rounded-full ${tagStyles[tag]}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-1">{test.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{test.shortDesc}</p>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span>📝 {test.questionCount}문항</span>
          <span>⏱️ {test.timeMinutes}분</span>
        </div>
        <span className="text-blue-500 font-medium">
          👥 {formatParticipants(test.participants)}
        </span>
      </div>
      {test.premium.available && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-purple-600 font-medium">
            💎 프리미엄 리포트 제공
          </span>
        </div>
      )}
    </div>
  );
}
