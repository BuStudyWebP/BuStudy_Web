import React from "react";

export default function SubjectRegister() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-2">과목 등록</h2>
        <p className="text-sm text-gray-600 mb-4">
          사용자가 공부할 내용을 사전에 등록합니다.
        </p>

        <div className="bg-white p-4 rounded shadow-sm space-y-3">
          <label className="text-xs text-gray-600">과목명</label>
          <input
            className="w-full p-2 border rounded"
            placeholder="예: 수학, 영어"
          />

          <label className="text-xs text-gray-600">설명 (선택)</label>
          <input
            className="w-full p-2 border rounded"
            placeholder="간단한 설명을 입력하세요"
          />

          <div className="flex gap-2">
            <button className="bg-orange-500 text-white px-4 py-2 rounded">
              등록
            </button>
            <button className="px-4 py-2 border rounded">취소</button>
          </div>
        </div>
      </main>
    </div>
  );
}
