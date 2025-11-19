import React from "react";

export default function TravelTimeCalc() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-2">이동 시간 계산</h2>
        <p className="text-sm text-gray-600 mb-4">
          출발지/도착지를 입력하면 AI가 예상 이동 시간을 계산합니다.
        </p>

        <div className="bg-white p-4 rounded shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">출발지</label>
            <input
              className="w-full p-2 rounded border"
              placeholder="출발지를 입력하세요"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">도착지</label>
            <input
              className="w-full p-2 rounded border"
              placeholder="도착지를 입력하세요"
            />
          </div>
          <div className="sm:col-span-2">
            <button className="w-full bg-orange-500 text-white py-2 rounded">
              예상 시간 계산
            </button>
          </div>
          <div className="sm:col-span-2 bg-gray-50 p-3 rounded text-gray-600">
            예상 소요 시간: — (결과는 여기에 표시됩니다)
          </div>
        </div>
      </main>
    </div>
  );
}
