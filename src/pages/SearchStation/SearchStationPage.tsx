
const SearchStationPage =()=> {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl p-4 mx-auto sm:p-6 lg:p-8">
        <h2 className="mb-2 text-2xl font-bold">정류장 검색</h2>
        <p className="mb-4 text-sm text-gray-600">
          출발/도착 정류장을 검색하고 지도에서 확인합니다.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <label className="text-xs text-gray-600">출발지</label>
            <input
              className="w-full p-2 border rounded"
              placeholder="출발지를 입력하세요"
            />
            <label className="text-xs text-gray-600">도착지</label>
            <input
              className="w-full p-2 border rounded"
              placeholder="도착지를 입력하세요"
            />
            <button className="w-full py-2 mt-2 text-white bg-orange-500 rounded">
              검색
            </button>
          </div>

          <div className="flex items-center justify-center h-64 text-gray-400 bg-white rounded shadow-sm">
            지도 뷰 (KaKao Map 등 연동 자리)
          </div>
        </div>
      </main>
    </div>
  );
}

export default SearchStationPage;