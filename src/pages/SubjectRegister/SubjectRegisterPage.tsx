import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const SubjectRegisterPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setRegisteredSubject } = useAppContext();

  const onCancel = () => {
    setTitle("");
    setDescription("");
    setError(null);
    setSuccess(null);
  };

  const onSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!title.trim()) {
      setError("과목명을 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "subjects"), {
        title: title.trim(),
        description: description.trim(),
        createdAt: serverTimestamp(),
      });
      try {
        setRegisteredSubject(title.trim());
      } catch (e) {
        console.log(e)
      }
      setSuccess("과목이 등록되었습니다.");
      setTitle("");
      setDescription("");
      navigate("/solve");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : String(err) || "등록 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="예: 수학, 영어"
          />

          <label className="text-xs text-gray-600">설명 (선택)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="간단한 설명을 입력하세요"
          />

          <div className="flex items-center">
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                취소
              </button>

              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className={`px-4 py-2 text-white bg-orange-500 rounded ${
                  loading ? "opacity-60" : ""
                }`}
              >
                {loading ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
        </div>
      </main>
    </div>
  );
};
export default SubjectRegisterPage;
