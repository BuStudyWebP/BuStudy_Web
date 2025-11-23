import { useState } from "react";

interface RouteInfo {
  distance: number; 
  duration: number; 
  fare?: number; 
}

interface KakaoRouteResponse {
  routes: Array<{
    summary: {
      distance: number;
      duration: number;
      fare?: {
        taxi?: number;
        toll?: number;
      };
    };
  }>;
}

interface UseEstimatedTimeReturn {
  routeInfo: RouteInfo | null;
  isLoading: boolean;
  error: string | null;
  calculateRoute: (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ) => Promise<RouteInfo | null>;
  reset: () => void;
}

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_MOBILITY_API_URL = "https://apis-navi.kakaomobility.com/v1/directions";

export const useEstimatedTime = (): UseEstimatedTimeReturn => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ) => {
    setIsLoading(true);
    setError(null);
    setRouteInfo(null);

    try {
      const origin = `${startLng},${startLat}`;
      const destination = `${endLng},${endLat}`;
      
      const url = `${KAKAO_MOBILITY_API_URL}?origin=${origin}&destination=${destination}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `KakaoAK ${KAKAO_REST_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
      }

      const data: KakaoRouteResponse = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error("경로를 찾을 수 없습니다.");
      }

      const summary = data.routes[0].summary;
      
      const result: RouteInfo = {
        distance: summary.distance, 
        duration: summary.duration, 
        fare: summary.fare?.taxi || 0,
      };

      setRouteInfo(result);
      return result;

    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "경로 계산 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("카카오 모빌리티 API 오류:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setRouteInfo(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    routeInfo,
    isLoading,
    error,
    calculateRoute,
    reset,
  };
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}시간 ${remainingMinutes}분`;
  }
  return `${minutes}분`;
};

export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(meters)}m`;
};
