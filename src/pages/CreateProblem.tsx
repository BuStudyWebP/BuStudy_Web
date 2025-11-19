import React from "react";

export default function CreateProblem() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-2">문제 생성</h2>
        <p className="text-sm text-gray-600 mb-4">
          사용자가 입력한 공부 내용을 바탕으로 문제를 생성하거나 강의를
          추천합니다.
        </p>

        <div className="bg-white p-4 rounded shadow-sm space-y-3">
          <label className="text-xs text-gray-600">공부 내용</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={6}
            placeholder="학습 내용을 입력하세요"
          ></textarea>
          <div className="flex gap-2">
            <button className="bg-orange-500 text-white px-4 py-2 rounded">
              문제 생성
            </button>
            <button className="px-4 py-2 border rounded">
              유튜브 강의 추천
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
