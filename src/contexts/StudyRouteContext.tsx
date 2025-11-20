import React, { createContext, useContext, useState, type ReactNode } from "react";

// Context 타입
interface StudyRouteContextType {
  estimatedTime: number | null; // 예상 소요 시간 (분)
  setEstimatedTime: (time: number | null) => void;
}

// Context 생성
const StudyRouteContext = createContext<StudyRouteContextType | undefined>(
  undefined
);

// Provider Props
interface StudyRouteProviderProps {
  children: ReactNode;
}

// Provider 컴포넌트
export const StudyRouteProvider: React.FC<StudyRouteProviderProps> = ({
  children,
}) => {
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  return (
    <StudyRouteContext.Provider
      value={{
        estimatedTime,
        setEstimatedTime,
      }}
    >
      {children}
    </StudyRouteContext.Provider>
  );
};

// Custom Hook
export function UseStudyRoute(): StudyRouteContextType {
  const context = useContext(StudyRouteContext);
  if (!context) {
    throw new Error("useStudyRoute must be used within StudyRouteProvider");
  }
  return context;
}