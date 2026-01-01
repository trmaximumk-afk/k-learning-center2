'use client';

import { Category } from '@/types/test';

interface CategoryCardProps {
  category: Category;
  testCount: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CategoryCard({ category, testCount, isSelected, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
        isSelected
          ? 'bg-blue-500 text-white shadow-lg scale-105'
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
      }`}
    >
      <span className="text-3xl mb-2">{category.emoji}</span>
      <span className="font-semibold text-sm">{category.name}</span>
      <span className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
        {testCount}개 검사
      </span>
    </button>
  );
}
