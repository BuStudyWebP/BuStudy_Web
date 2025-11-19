
const SolveProblemPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl p-4 mx-auto sm:p-6 lg:p-8">
        <h2 className="mb-2 text-2xl font-bold">문제 풀기</h2>
        <p className="mb-4 text-sm text-gray-600">
          생성된 문제를 풀고 정답/해설을 확인하세요.
        </p>

        <div className="space-y-4">
          <article className="p-4 bg-white rounded shadow-sm">
            <h3 className="font-semibold">문제 예시</h3>
            <p className="mt-2 text-sm text-gray-700">
              여기에 문제 내용이 표시됩니다.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button className="px-3 py-1 border rounded">선택지 A</button>
              <button className="px-3 py-1 border rounded">선택지 B</button>
              <button className="px-3 py-1 border rounded">선택지 C</button>
            </div>
          </article>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-white bg-orange-500 rounded">
              제출
            </button>
            <button className="px-4 py-2 border rounded">다음 문제</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SolveProblemPage;