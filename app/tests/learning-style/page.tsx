'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TestEngine } from '@/components/TestEngine';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Question } from '@/types';
import { TestResultData, ScaleScore } from '@/types/test';

import configData from '@/data/tests/learning-style/config.json';
import questionsData from '@/data/tests/learning-style/questions.json';
import resultsData from '@/data/tests/learning-style/results.json';

type TestPhase = 'intro' | 'test' | 'result';

interface LearningStyleQuestion {
  id: string;
  text: string;
  scale: string;
  pole: string;
  order: number;
}

interface TypeResult {
  code: string;
  name: string;
  emoji: string;
  temperament: string;
  keywords: string[];
  shortDesc: string;
  description: string;
  strengths: string[];
  tips: string[];
  cautions: string[];
  bestEnvironment: string;
  recommendedTeacher: string;
}

export default function LearningStyleTestPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [, setAnswers] = useState<Record<string, number>>({});
  const [resultData, setResultData] = useState<TestResultData | null>(null);

  // 문항 데이터를 TestEngine 형식으로 변환
  const questions: Question[] = useMemo(() => {
    return (questionsData.questions as LearningStyleQuestion[]).map((q) => ({
      id: q.id,
      text: q.text,
      options: [],
      category: q.scale,
    }));
  }, []);

  // 채점 로직
  const calculateResult = (answers: Record<string, number>) => {
    const scaleScores: Record<string, { first: number; second: number }> = {
      EI: { first: 0, second: 0 }, // E, I
      SN: { first: 0, second: 0 }, // S, N
      TF: { first: 0, second: 0 }, // T, F
      JP: { first: 0, second: 0 }, // J, P
    };

    // 각 척도별 점수 합산
    (questionsData.questions as LearningStyleQuestion[]).forEach((q) => {
      const answer = answers[q.id];
      if (answer !== undefined) {
        const scale = q.scale;
        const pole = q.pole;

        // E, S, T, J는 first에, I, N, F, P는 second에
        if (pole === 'E' || pole === 'S' || pole === 'T' || pole === 'J') {
          scaleScores[scale].first += answer;
        } else {
          scaleScores[scale].second += answer;
        }
      }
    });

    // 유형 결정
    const typeCode =
      (scaleScores.EI.first >= scaleScores.EI.second ? 'E' : 'I') +
      (scaleScores.SN.first >= scaleScores.SN.second ? 'S' : 'N') +
      (scaleScores.TF.first >= scaleScores.TF.second ? 'T' : 'F') +
      (scaleScores.JP.first >= scaleScores.JP.second ? 'J' : 'P');

    const typeResult = (resultsData.types as Record<string, TypeResult>)[typeCode];

    const scaleScoresForDisplay: ScaleScore[] = [
      {
        name: `${scaleScores.EI.first >= scaleScores.EI.second ? '외향(E)' : '내향(I)'}`,
        score: Math.max(scaleScores.EI.first, scaleScores.EI.second),
        maxScore: scaleScores.EI.first + scaleScores.EI.second,
        description: scaleScores.EI.first >= scaleScores.EI.second
          ? '사람들과 함께할 때 에너지를 얻어요'
          : '혼자 있을 때 에너지를 충전해요',
      },
      {
        name: `${scaleScores.SN.first >= scaleScores.SN.second ? '감각(S)' : '직관(N)'}`,
        score: Math.max(scaleScores.SN.first, scaleScores.SN.second),
        maxScore: scaleScores.SN.first + scaleScores.SN.second,
        description: scaleScores.SN.first >= scaleScores.SN.second
          ? '구체적이고 실제적인 정보를 선호해요'
          : '개념과 가능성을 탐구해요',
      },
      {
        name: `${scaleScores.TF.first >= scaleScores.TF.second ? '사고(T)' : '감정(F)'}`,
        score: Math.max(scaleScores.TF.first, scaleScores.TF.second),
        maxScore: scaleScores.TF.first + scaleScores.TF.second,
        description: scaleScores.TF.first >= scaleScores.TF.second
          ? '논리와 분석으로 결정해요'
          : '가치와 감정을 고려해요',
      },
      {
        name: `${scaleScores.JP.first >= scaleScores.JP.second ? '판단(J)' : '인식(P)'}`,
        score: Math.max(scaleScores.JP.first, scaleScores.JP.second),
        maxScore: scaleScores.JP.first + scaleScores.JP.second,
        description: scaleScores.JP.first >= scaleScores.JP.second
          ? '계획적이고 체계적으로 공부해요'
          : '유연하고 자유롭게 공부해요',
      },
    ];

    // 총점 계산
    const totalScore = Object.values(scaleScores).reduce(
      (sum, s) => sum + Math.max(s.first, s.second),
      0
    );
    const maxTotalScore = Object.values(scaleScores).reduce(
      (sum, s) => sum + s.first + s.second,
      0
    );

    // 과목별 팁 가져오기
    const temperament = typeResult.temperament as keyof typeof resultsData.subjectTips;
    const subjectTips = resultsData.subjectTips[temperament];

    const result: TestResultData = {
      testId: configData.id,
      testTitle: configData.title,
      completedAt: new Date().toISOString(),
      typeName: `${typeCode} - ${typeResult.name}`,
      typeEmoji: typeResult.emoji,
      typeDescription: typeResult.description,
      totalScore,
      maxTotalScore,
      scaleScores: scaleScoresForDisplay,
      strengths: typeResult.strengths,
      tips: [
        ...typeResult.tips,
        `📚 국어: ${subjectTips.korean}`,
        `🔢 수학: ${subjectTips.math}`,
        `🔤 영어: ${subjectTips.english}`,
      ],
      cautions: typeResult.cautions,
      premium: configData.premium,
    };

    return result;
  };

  // 검사 완료 핸들러
  const handleComplete = (answers: Record<string, number>) => {
    setAnswers(answers);
    const result = calculateResult(answers);
    setResultData(result);
    setPhase('result');
  };

  // 다시 검사하기
  const handleRetry = () => {
    setAnswers({});
    setResultData(null);
    setPhase('intro');
  };

  // 홈으로
  const handleHome = () => {
    router.push('/');
  };

  // 검사 시작
  const handleStart = () => {
    setPhase('test');
  };

  // 인트로 화면
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <button
              onClick={handleHome}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>홈으로</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">{configData.emoji}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{configData.title}</h1>
            <p className="text-gray-600">{configData.shortDesc}</p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-lg font-bold text-gray-900">{configData.questionCount}문항</div>
              <div className="text-xs text-gray-500">질문 수</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-lg font-bold text-gray-900">{configData.timeMinutes}분</div>
              <div className="text-xs text-gray-500">예상 소요시간</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-lg font-bold text-gray-900">16유형</div>
              <div className="text-xs text-gray-500">결과 유형</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="font-bold text-gray-900 mb-3">이 검사는...</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{configData.description}</p>

            <h3 className="font-bold text-gray-900 mb-2">4가지 척도</h3>
            <div className="space-y-2">
              {configData.scales.map((scale) => (
                <div key={scale.id} className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-blue-600">{scale.name}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">
                    {scale.poles[0].name} vs {scale.poles[1].name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-sm text-gray-500">대상:</span>
            {configData.targetAudience.map((target) => (
              <span
                key={target}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {target}
              </span>
            ))}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            검사 시작하기 →
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            모든 문항에 솔직하게 답변해주세요
          </p>
        </main>
      </div>
    );
  }

  // 검사 진행 화면
  if (phase === 'test') {
    return (
      <TestEngine
        questions={questions}
        onComplete={handleComplete}
        onBack={() => setPhase('intro')}
        title={configData.title}
      />
    );
  }

  // 결과 화면
  if (phase === 'result' && resultData) {
    return (
      <ResultDisplay
        result={resultData}
        onRetry={handleRetry}
        onHome={handleHome}
      />
    );
  }

  return null;
}
