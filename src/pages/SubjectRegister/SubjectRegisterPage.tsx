import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useTranslation } from "react-i18next";

const SubjectRegisterPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setRegisteredSubject } = useAppContext();
  const { t } = useTranslation();

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
      setError(t("subject.error.noTitle"));
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
        console.log(e);
      }
      setSuccess(t("subject.success"));
      setTitle("");
      setDescription("");
      navigate("/solve");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : String(err) || t("subject.error.register");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl p-4 mx-auto sm:p-6 lg:p-8">
        <h2 className="mb-2 text-2xl font-bold">{t("subject.title")}</h2>
        <p className="mb-4 text-sm text-gray-600">{t("subject.subtitle")}</p>

        <div className="p-4 space-y-3 bg-white rounded shadow-sm">
          <label className="text-xs text-gray-600">
            {t("subject.nameLabel")}
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder={t("subject.namePlaceholder")}
          />

          <label className="text-xs text-gray-600">
            {t("subject.descLabel")}
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder={t("subject.descPlaceholder")}
          />

          <div className="flex items-center">
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                {t("subject.cancel")}
              </button>

              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className={`px-4 py-2 text-white bg-orange-500 rounded ${
                  loading ? "opacity-60" : ""
                }`}
              >
                {loading ? t("subject.registering") : t("subject.register")}
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
