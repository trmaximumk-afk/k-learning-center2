export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-center mb-4">
        K-Learning Center
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
        학생과 학부모를 위한 학습 진단 검사 플랫폼
      </p>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          검사 시작하기
        </button>
        <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          더 알아보기
        </button>
      </div>
    </main>
  );
}
