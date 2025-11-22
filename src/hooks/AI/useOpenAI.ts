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
      subjectName: string,
      estimatedTimeMinutes?: number
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

      const count =
        typeof estimatedTimeMinutes === "number"
          ? Math.max(1, Math.min(10, Math.round(estimatedTimeMinutes / 2)))
          : 5;

      const prompt = `당신은 객관식 문제 생성기입니다. 출력은 JSON 배열(추가 텍스트 금지)만 하세요. 과목명 "${subjectName}"에 대해 아래 규칙을 엄격히 지켜 정확히 ${count}개의 객관식 문제를 생성하세요. 각 문제 항목은 다음 키를 가집니다: question (문제 문장은 반드시 한국어), options (서로 다른 4개의 문자열로 이루어진 배열), answer (정답으로 options 중 하나의 문자열), explanation (간단한 해설, 한국어). 난이도는 '중간'을 기본으로 하되, 사용자가 주어진 시간(${
        estimatedTimeMinutes ?? "미지정"
      } 분) 안에 풀 수 있도록 문제 수(${count})와 난이도를 적절히 조정하세요. 문제당 소요시간은 평균 약 2분을 가정하세요.
출력 예시:
[
  {"question":"...","options":["가","나","다","라"],"answer":"나","explanation":"..."},
  ...
]
JSON만 반환하고 따로 설명문을 섞지 마세요.`;

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

        const validated: MCQ[] = parsed.slice(0, count).map((it: any) => ({
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
