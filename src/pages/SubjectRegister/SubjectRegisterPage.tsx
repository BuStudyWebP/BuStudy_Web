import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useSubjects } from "../../hooks/Subject/useSubjects";
import type { Subject } from "../../hooks/Subject/useSubjects";
import { useTranslation } from "react-i18next";

const SubjectRegisterPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setRegisteredSubject } = useAppContext();
  const {
    subjects,
    loading: listLoading,
    error: listError,
    createSubject,
    updateSubject,
    deleteSubject,
  } = useSubjects();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemLoadingId, setItemLoadingId] = useState<string | null>(null);
  const { t } = useTranslation();

  const onCancel = () => {
    setTitle("");
    setDescription("");
    setError(null);
  };

  const onSubmit = async () => {
    setError(null);
    if (!title.trim()) {
      setError(t("subject.error.noTitle"));
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        setItemLoadingId(editingId);
        await updateSubject(editingId, {
          title: title.trim(),
          description: description.trim(),
        });
        alert(t("subject.updated"));
      } else {
        setLoading(true);
        await createSubject({
          title: title.trim(),
          description: description.trim(),
        });
        try {
          setRegisteredSubject(title.trim());
        } catch (e) {
          console.log(e);
        }
        alert(t("subject.success"));
        navigate("/solve");
      }
      setTitle("");
      setDescription("");
      setEditingId(null);
      setItemLoadingId(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : String(err) || t("subject.error.register");
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (s: Subject) => {
    setEditingId(s.id);
    setTitle(s.title || "");
    setDescription(s.description || "");
    setError(null);
  };

  const onDelete = async (id: string) => {
    const ok = confirm(t("subject.confirmDelete"));
    if (!ok) return;
    setError(null);
    setItemLoadingId(id);
    try {
      await deleteSubject(id);
      alert(t("subject.deleted"));
      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setDescription("");
      }
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : String(e) || t("subject.error.delete");
      setError(msg);
      alert(msg);
    } finally {
      setItemLoadingId(null);
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
                style={{ backgroundColor: "#FF7413" }}
                className={`px-4 py-2 text-white bg-primary rounded ${
                  loading ? "opacity-60" : ""
                }`}
              >
                {loading
                  ? editingId
                    ? t("subject.updating")
                    : t("subject.registering")
                  : editingId
                  ? t("subject.edit")
                  : t("subject.register")}
              </button>
            </div>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <section className="max-w-3xl p-4 mx-auto mt-6 bg-white rounded shadow-sm">
          <h3 className="mb-3 text-lg font-medium">{t("subject.listTitle")}</h3>
          {listLoading && (
            <p className="text-sm text-gray-600">{t("subject.loadingList")}</p>
          )}
          {listError && <p className="text-sm text-red-600">{listError}</p>}
          {!listLoading && subjects.length === 0 && (
            <p className="text-sm text-gray-600">{t("subject.noSubjects")}</p>
          )}
          <ul className="space-y-2">
            {subjects.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <div className="font-medium">{s.title}</div>
                  {s.description && (
                    <div className="text-sm text-gray-500">{s.description}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      try {
                        setRegisteredSubject(s.title);
                      } catch (e) {
                        console.log(e);
                      }
                      navigate("/solve");
                    }}
                    style={{ backgroundColor: "#FF7413" }}
                    className="px-3 py-1 text-sm text-white rounded bg-primary"
                    disabled={itemLoadingId === s.id}
                  >
                    {t("subject.learn")}
                  </button>
                  <button
                    onClick={() => onEdit(s)}
                    className="px-3 py-1 text-sm border rounded"
                    disabled={itemLoadingId === s.id}
                  >
                    {t("subject.edit")}
                  </button>
                  <button
                    onClick={() => onDelete(s.id)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded"
                    disabled={itemLoadingId === s.id}
                  >
                    {itemLoadingId === s.id
                      ? t("subject.deleting")
                      : t("subject.delete")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
export default SubjectRegisterPage;
