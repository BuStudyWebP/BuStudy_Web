const TravelTimeCalcPage =()=> {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
        <h2 className="mb-2 text-2xl font-bold">이동 시간 계산</h2>
        <p className="mb-4 text-sm text-gray-600">
          출발지/도착지를 입력하면 AI가 예상 이동 시간을 계산합니다.
        </p>

        <div className="grid grid-cols-1 gap-3 p-4 bg-white rounded shadow-sm sm:grid-cols-2">
          <div>
            <label className="text-xs text-gray-600">출발지</label>
            <input
              className="w-full p-2 border rounded"
              placeholder="출발지를 입력하세요"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">도착지</label>
            <input
              className="w-full p-2 border rounded"
              placeholder="도착지를 입력하세요"
            />
          </div>
          <div className="sm:col-span-2">
            <button className="w-full py-2 text-white bg-orange-500 rounded">
              예상 시간 계산
            </button>
          </div>
          <div className="p-3 text-gray-600 rounded sm:col-span-2 bg-gray-50">
            예상 소요 시간: — (결과는 여기에 표시됩니다)
          </div>
        </div>
      </main>
    </div>
  );
}
export default TravelTimeCalcPage;