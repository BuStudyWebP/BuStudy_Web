import React from "react";

export default function SearchStation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-2">정류장 검색</h2>
        <p className="text-sm text-gray-600 mb-4">
          출발/도착 정류장을 검색하고 지도에서 확인합니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-xs text-gray-600">출발지</label>
            <input
              className="w-full p-2 rounded border"
              placeholder="출발지를 입력하세요"
            />
            <label className="text-xs text-gray-600">도착지</label>
            <input
              className="w-full p-2 rounded border"
              placeholder="도착지를 입력하세요"
            />
            <button className="mt-2 w-full bg-orange-500 text-white py-2 rounded">
              검색
            </button>
          </div>

          <div className="h-64 bg-white rounded shadow-sm flex items-center justify-center text-gray-400">
            지도 뷰 (KaKao Map 등 연동 자리)
          </div>
        </div>
      </main>
    </div>
  );
}
