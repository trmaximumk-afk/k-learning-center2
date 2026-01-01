'use client';

import { useState } from 'react';
import { TestResultData } from '@/types/test';

// Kakao SDK 타입 선언
declare global {
  interface Window {
    Kakao?: {
      Share?: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: { mobileWebUrl: string; webUrl: string };
          };
          buttons: Array<{
            title: string;
            link: { mobileWebUrl: string; webUrl: string };
          }>;
        }) => void;
      };
    };
  }
}

interface ResultDisplayProps {
  result: TestResultData;
  onRetry: () => void;
  onHome: () => void;
}

export function ResultDisplay({ result, onRetry, onHome }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const percentage = Math.round((result.totalScore / result.maxTotalScore) * 100);

  // 링크 복사
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 카카오톡 공유
  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao?.Share) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${result.typeEmoji} ${result.typeName}`,
          description: result.typeDescription,
          imageUrl: '', // 이미지 URL 추가 가능
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '나도 검사하기',
            link: {
              mobileWebUrl: window.location.origin,
              webUrl: window.location.origin,
            },
          },
        ],
      });
    } else {
      alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-blue-200 text-sm mb-2">{result.testTitle} 결과</p>

          {/* Type Emoji */}
          <div className="text-7xl mb-4 animate-bounce">{result.typeEmoji}</div>

          {/* Type Name */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{result.typeName}</h1>

          {/* Type Description */}
          <p className="text-lg text-blue-100 leading-relaxed max-w-md mx-auto">
            {result.typeDescription}
          </p>

          {/* Score Badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-yellow-300">⭐</span>
            <span className="font-medium">
              총점 {result.totalScore}/{result.maxTotalScore}점 ({percentage}%)
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Scale Scores Chart */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span> 척도별 점수
          </h2>
          <div className="space-y-4">
            {result.scaleScores.map((scale, index) => {
              const scalePercent = Math.round((scale.score / scale.maxScore) * 100);
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{scale.name}</span>
                    <span className="text-sm text-gray-500">
                      {scale.score}/{scale.maxScore}점
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${scalePercent}%`,
                        background: `linear-gradient(90deg,
                          ${scalePercent >= 80 ? '#22c55e' : scalePercent >= 60 ? '#3b82f6' : scalePercent >= 40 ? '#f59e0b' : '#ef4444'} 0%,
                          ${scalePercent >= 80 ? '#16a34a' : scalePercent >= 60 ? '#2563eb' : scalePercent >= 40 ? '#d97706' : '#dc2626'} 100%)`,
                      }}
                    />
                  </div>
                  {scale.description && (
                    <p className="text-xs text-gray-500 mt-1">{scale.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Strengths */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💪</span> 나의 강점
          </h2>
          <ul className="space-y-3">
            {result.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tips */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💡</span> 학습 팁
          </h2>
          <ul className="space-y-3">
            {result.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </span>
                <span className="text-gray-700 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cautions */}
        {result.cautions && result.cautions.length > 0 && (
          <section className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
              <span>⚠️</span> 주의사항
            </h2>
            <ul className="space-y-2">
              {result.cautions.map((caution, index) => (
                <li key={index} className="flex items-start gap-2 text-amber-700">
                  <span className="flex-shrink-0">•</span>
                  <span className="leading-relaxed">{caution}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Premium CTA */}
        {result.premium?.available && (
          <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                💎
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-1">프리미엄 리포트</h2>
                <p className="text-purple-200 text-sm mb-3">
                  더 자세한 분석과 맞춤 학습 전략을 확인하세요
                </p>
                {result.premium.features && (
                  <ul className="text-sm text-purple-100 space-y-1 mb-4">
                    {result.premium.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span>✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <button className="w-full sm:w-auto px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors">
                  {result.premium.price?.toLocaleString()}원으로 구매하기
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Share Buttons */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔗</span> 결과 공유하기
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Kakao Share */}
            <button
              onClick={handleKakaoShare}
              className="flex items-center gap-2 px-4 py-3 bg-[#FEE500] text-[#391B1B] rounded-xl font-medium hover:bg-[#F5DC00] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.87 5.33 4.67 6.77l-.77 2.86c-.08.3.23.55.5.4l3.42-2.29c.69.11 1.42.16 2.18.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
              </svg>
              카카오톡
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  복사됨!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  링크 복사
                </>
              )}
            </button>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onRetry}
            className="flex-1 py-4 px-6 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            🔄 다시 검사하기
          </button>
          <button
            onClick={onHome}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            🏠 홈으로 가기
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 pt-8 pb-4">
          <p>검사일: {new Date(result.completedAt).toLocaleDateString('ko-KR')}</p>
          <p className="mt-1">© K-Learning Center</p>
        </footer>
      </div>
    </div>
  );
}
