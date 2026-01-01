'use client';

import { useState, useCallback, useEffect } from 'react';
import { Question } from '@/types';

interface TestEngineProps {
  questions: Question[];
  onComplete: (answers: Record<string, number>) => void;
  onBack: () => void;
  title?: string;
}

// 5점 리커트 척도
const LIKERT_SCALE = [
  { value: 1, label: '전혀\n그렇지 않다', shortLabel: '1' },
  { value: 2, label: '그렇지\n않다', shortLabel: '2' },
  { value: 3, label: '보통\n이다', shortLabel: '3' },
  { value: 4, label: '그렇다', shortLabel: '4' },
  { value: 5, label: '매우\n그렇다', shortLabel: '5' },
];

export function TestEngine({ questions, onComplete, onBack, title }: TestEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const canGoBack = currentIndex > 0;
  const hasAnswer = answers[currentQuestion?.id] !== undefined;

  // 선택지 클릭 핸들러
  const handleSelect = useCallback(
    (value: number) => {
      if (isAnimating) return;

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }));

      // 자동 다음 문항 이동 (0.3초 딜레이)
      if (!isLastQuestion) {
        setIsAnimating(true);
        setTimeout(() => {
          setDirection('next');
          setCurrentIndex((prev) => prev + 1);
          setIsAnimating(false);
        }, 300);
      }
    },
    [currentQuestion?.id, isAnimating, isLastQuestion]
  );

  // 이전 문항
  const handlePrev = useCallback(() => {
    if (canGoBack && !isAnimating) {
      setDirection('prev');
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canGoBack, isAnimating]);

  // 다음 문항
  const handleNext = useCallback(() => {
    if (hasAnswer && !isLastQuestion && !isAnimating) {
      setDirection('next');
      setCurrentIndex((prev) => prev + 1);
    }
  }, [hasAnswer, isLastQuestion, isAnimating]);

  // 완료
  const handleComplete = useCallback(() => {
    if (hasAnswer) {
      onComplete(answers);
    }
  }, [answers, hasAnswer, onComplete]);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5') {
        handleSelect(parseInt(e.key));
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight' && hasAnswer) {
        handleNext();
      } else if (e.key === 'Enter' && isLastQuestion && hasAnswer) {
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect, handlePrev, handleNext, handleComplete, hasAnswer, isLastQuestion]);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">나가기</span>
            </button>
            {title && (
              <h1 className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                {title}
              </h1>
            )}
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question Content */}
      <main className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-4 py-8">
        <div
          className={`transition-all duration-300 ${
            isAnimating
              ? direction === 'next'
                ? 'opacity-0 translate-x-8'
                : 'opacity-0 -translate-x-8'
              : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Question Number */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full text-lg font-bold">
              {currentIndex + 1}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-xl md:text-2xl font-medium text-gray-900 text-center mb-10 leading-relaxed">
            {currentQuestion.text}
          </h2>

          {/* Likert Scale Options */}
          <div className="space-y-3">
            {LIKERT_SCALE.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  disabled={isAnimating}
                  className={`w-full min-h-[56px] px-4 py-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  } ${isAnimating ? 'pointer-events-none' : ''}`}
                >
                  {/* Number Circle */}
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {option.value}
                  </span>
                  {/* Label */}
                  <span
                    className={`text-left whitespace-pre-line text-sm md:text-base transition-colors ${
                      isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option.label.replace('\n', ' ')}
                  </span>
                  {/* Check Icon */}
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-blue-500 ml-auto flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Keyboard Hint */}
          <p className="text-center text-xs text-gray-400 mt-6 hidden md:block">
            키보드 1~5 또는 ←→ 화살표로 이동할 수 있어요
          </p>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              disabled={!canGoBack || isAnimating}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                canGoBack
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">이전</span>
            </button>

            {/* Complete or Next Button */}
            {isLastQuestion ? (
              <button
                onClick={handleComplete}
                disabled={!hasAnswer || isAnimating}
                className={`flex-1 max-w-xs py-3 px-6 rounded-xl font-bold text-white transition-all ${
                  hasAnswer
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                결과 보기 🎉
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasAnswer || isAnimating}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  hasAnswer
                    ? 'text-blue-600 hover:bg-blue-50'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">다음</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
