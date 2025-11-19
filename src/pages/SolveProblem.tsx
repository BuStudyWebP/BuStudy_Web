import React from "react";

export default function SolveProblem() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-2">문제 풀기</h2>
        <p className="text-sm text-gray-600 mb-4">
          생성된 문제를 풀고 정답/해설을 확인하세요.
        </p>

        <div className="space-y-4">
          <article className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-semibold">문제 예시</h3>
            <p className="text-sm text-gray-700 mt-2">
              여기에 문제 내용이 표시됩니다.
            </p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button className="px-3 py-1 rounded border">선택지 A</button>
              <button className="px-3 py-1 rounded border">선택지 B</button>
              <button className="px-3 py-1 rounded border">선택지 C</button>
            </div>
          </article>

          <div className="flex items-center gap-3">
            <button className="bg-orange-500 text-white px-4 py-2 rounded">
              제출
            </button>
            <button className="px-4 py-2 border rounded">다음 문제</button>
          </div>
        </div>
      </main>
    </div>
  );
}
