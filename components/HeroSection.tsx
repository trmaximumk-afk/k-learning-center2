'use client';

interface HeroSectionProps {
  totalParticipants: number;
}

export function HeroSection({ totalParticipants }: HeroSectionProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>{formatNumber(totalParticipants)}명이 참여했어요</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            나를 알면
            <br className="md:hidden" />
            <span className="text-yellow-300"> 공부가 쉬워진다</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-md mx-auto">
            학습 성향 진단으로 나에게 딱 맞는
            <br />
            공부법을 찾아보세요
          </p>

          {/* CTA Button */}
          <button className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            지금 바로 검사하기 →
          </button>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">32+</div>
              <div className="text-sm text-blue-200">검사 종류</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">5분</div>
              <div className="text-sm text-blue-200">평균 소요시간</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">무료</div>
              <div className="text-sm text-blue-200">기본 리포트</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
