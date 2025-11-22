import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useOpenAI } from "../../hooks/AI/useOpenAI";
import { useTranslation } from "react-i18next";

type MCQ = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

const SolveProblemPage = () => {
  const { registeredSubject, estimatedTime } = useAppContext();
  const { loading, generateFiveMCQ } = useOpenAI();
  const { t } = useTranslation();
  const [problems, setProblems] = useState<MCQ[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchIfSubject = async () => {
      if (!registeredSubject) return;
      const res = await generateFiveMCQ(
        registeredSubject,
        estimatedTime ?? undefined
      );
      if (res.success && res.data) setProblems(res.data);
    };
    fetchIfSubject();
  }, [registeredSubject, generateFiveMCQ]);

  const handleGenerate = async () => {
    if (!registeredSubject) return;
    const res = await generateFiveMCQ(
      registeredSubject,
      estimatedTime ?? undefined
    );
    if (res.success && res.data) setProblems(res.data);
    setScore(0);
    setAttempted(0);
    setShowSummary(false);
  };

  const handleSelect = (i: number) => {
    if (submitted) return;
    setSelectedIndex(i);
  };

  const handleSubmitAnswer = () => {
    if (!problems) return;
    const p = problems[currentIndex];
    if (selectedIndex === null) return;
    const chosen = p.options[selectedIndex];
    const correct =
      String(p.answer).trim().toLowerCase() ===
      String(chosen).trim().toLowerCase();
    setIsCorrect(correct);
    setSubmitted(true);
    setAttempted((v) => v + 1);
    if (correct) setScore((v) => v + 1);
  };

  const handleNext = () => {
    if (!problems) return;
    const next = currentIndex + 1;
    if (next >= problems.length) {
      setProblems(null);
      setCurrentIndex(0);
      setSelectedIndex(null);
      setSubmitted(false);
      setIsCorrect(null);
      setShowSummary(true);
      return;
    }
    setCurrentIndex(next);
    setSelectedIndex(null);
    setSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl p-4 mx-auto sm:p-6 lg:p-8">
        <h2 className="mb-2 text-2xl font-bold">{t("solve.title")}</h2>
        <p className="mb-4 text-sm text-gray-600">{t("solve.subtitle")}</p>

        <div className="space-y-4">
          {loading ? (
            <article className="p-4 bg-white rounded shadow-sm">
              <h3 className="font-semibold">{t("solve.generatingTitle")}</h3>
              <p className="mt-2 text-sm text-gray-700">
                {t("solve.generatingMsg")}
              </p>
            </article>
          ) : problems && problems.length > 0 ? (
            (() => {
              const p = problems[currentIndex];
              return (
                <article className="p-4 bg-white rounded shadow-sm">
                  <h3 className="font-semibold">
                    {t("solve.questionCounter", {
                      current: currentIndex + 1,
                      total: problems.length,
                    })}
                  </h3>
                  <div className="mt-3">
                    <div className="font-medium text-gray-800">
                      {p.question}
                    </div>

                    <div className="grid gap-2 mt-3">
                      {p.options.map((opt, i) => {
                        const selected = selectedIndex === i;
                        const correctOption =
                          submitted &&
                          String(opt).trim().toLowerCase() ===
                            String(p.answer).trim().toLowerCase();
                        return (
                          <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={`text-left px-3 py-2 border rounded ${
                              selected ? "bg-orange-100 border-orange-400" : ""
                            } ${
                              submitted && correctOption
                                ? "bg-green-100 border-green-400"
                                : ""
                            }`}
                          >
                            <strong className="mr-2">
                              {String.fromCharCode(65 + i)}.
                            </strong>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        className={`px-4 py-2 text-white bg-orange-500 rounded ${
                          submitted || selectedIndex === null
                            ? "opacity-60"
                            : ""
                        }`}
                        onClick={handleSubmitAnswer}
                        disabled={submitted || selectedIndex === null}
                      >
                        {t("solve.submit")}
                      </button>

                      <button
                        className="px-4 py-2 border rounded"
                        onClick={handleNext}
                      >
                        {t("solve.next")}
                      </button>
                    </div>

                    {submitted && (
                      <div className="p-3 mt-3 border rounded bg-gray-50">
                        {isCorrect ? (
                          <p className="text-green-600">{t("solve.correct")}</p>
                        ) : (
                          <p className="text-red-600">
                            {t("solve.incorrect", { answer: p.answer })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })()
          ) : showSummary ? (
            <article className="p-4 bg-white rounded shadow-sm">
              <h3 className="font-semibold">{t("solve.exampleTitle")}</h3>
              <p className="mt-2 text-sm text-gray-700">
                {t("solve.summary", { attempted, score })}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  className="px-4 py-2 text-white bg-orange-500 rounded"
                  onClick={handleGenerate}
                  disabled={loading || !registeredSubject}
                >
                  {t("solve.regenerate")}
                </button>
              </div>
            </article>
          ) : (
            <></>
          )}
        </div>
      </main>
    </div>
  );
};

export default SolveProblemPage;
