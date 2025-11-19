
const SubjectRegisterPage =()=> {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
        <h2 className="mb-2 text-2xl font-bold">과목 등록</h2>
        <p className="mb-4 text-sm text-gray-600">
          사용자가 공부할 내용을 사전에 등록합니다.
        </p>

        <div className="p-4 space-y-3 bg-white rounded shadow-sm">
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
            <button className="px-4 py-2 text-white bg-orange-500 rounded">
              등록
            </button>
            <button className="px-4 py-2 border rounded">취소</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SubjectRegisterPage;