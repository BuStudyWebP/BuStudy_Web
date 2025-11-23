import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export type Subject = {
  id: string;
  title: string;
  description?: string;
  createdAt?: any;
};

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "subjects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Subject[] = snap.docs.map((d) => ({
          id: d.id,
          title: d.data().title,
          description: d.data().description,
          createdAt: d.data().createdAt,
        }));
        setSubjects(items);
        setLoading(false);
      },
      (e) => {
        setError(e.message || String(e));
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const createSubject = async (payload: {
    title: string;
    description?: string;
  }) => {
    const ref = await addDoc(collection(db, "subjects"), {
      title: payload.title,
      description: payload.description || "",
      createdAt: serverTimestamp(),
    });
    return ref.id;
  };

  const updateSubject = async (
    id: string,
    payload: { title: string; description?: string }
  ) => {
    const previousSubjects = subjects.slice();
    setSubjects((prevList) =>
      prevList.map((p) =>
        p.id === id
          ? {
              ...p,
              title: payload.title,
              description: payload.description || "",
            }
          : p
      )
    );
    try {
      const d = doc(db, "subjects", id);
      await updateDoc(d, {
        title: payload.title,
        description: payload.description || "",
      });
    } catch (e: unknown) {
      setSubjects(previousSubjects);
      throw e;
    }
  };

  const deleteSubject = async (id: string) => {
    const previousSubjects = subjects.slice();
    setSubjects((prevList) => prevList.filter((p) => p.id !== id));
    try {
      const d = doc(db, "subjects", id);
      await deleteDoc(d);
    } catch (e: unknown) {
      setSubjects(previousSubjects);
      throw e;
    }
  };

  return {
    subjects,
    loading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};
