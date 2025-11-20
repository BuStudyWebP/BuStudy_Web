import { useCallback, useState } from "react";

type MCQ = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

const OPENAI_KEY = (import.meta.env.VITE_OPEN_AI_API_KEY as string) || "";

export const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFiveMCQ = useCallback(
    async (
      subjectName: string
    ): Promise<{
      success: boolean;
      data?: MCQ[];
      error?: string;
      raw?: any;
    }> => {
      setLoading(true);
      setError(null);

      if (!OPENAI_KEY) {
        const err = "OpenAI API key not configured";
        setError(err);
        setLoading(false);
        return { success: false, error: err };
      }

      const prompt = `You are a multiple-choice question generator. Produce JSON output only (no extra text). For the subject "${subjectName}", generate an array of exactly 5 multiple-choice questions. Each item must be an object with keys: question (string), options (array of 4 unique strings), answer (one of the options), explanation (a short explanation string). Difficulty: medium. Output example:
[
  {"question":"...","options":["a","b","c","d"],"answer":"b","explanation":"..."},
  ...
]
Make sure JSON is valid.`;

      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You generate multiple-choice questions in JSON only.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.6,
            max_tokens: 900,
          }),
        });

        if (!res.ok) {
          const txt = await res.text();
          const errMsg = `OpenAI error ${res.status}: ${txt}`;
          setError(errMsg);
          setLoading(false);
          return { success: false, error: errMsg };
        }

        const data = await res.json();
        const msg =
          data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text;

        let parsed: any = null;
        try {
          parsed = JSON.parse(msg);
        } catch (e) {
          const m = msg && msg.match(/\[[\s\S]*\]/);
          if (m) {
            try {
              parsed = JSON.parse(m[0]);
            } catch (e2) {
              parsed = null;
            }
          }
        }

        if (!parsed || !Array.isArray(parsed)) {
          const errMsg = "Failed to parse OpenAI response as JSON array";
          setError(errMsg);
          setLoading(false);
          return { success: false, error: errMsg, raw: msg };
        }

        const validated: MCQ[] = parsed.slice(0, 5).map((it: any) => ({
          question: String(it.question ?? ""),
          options: Array.isArray(it.options)
            ? it.options.slice(0, 4).map(String)
            : [],
          answer: String(it.answer ?? ""),
          explanation: it.explanation ? String(it.explanation) : undefined,
        }));

        setLoading(false);
        return { success: true, data: validated, raw: data };
      } catch (err: any) {
        const m = err?.message ?? String(err);
        setError(m);
        setLoading(false);
        return { success: false, error: m };
      }
    },
    []
  );

  return { loading, error, generateFiveMCQ };
};

export default useOpenAI;
