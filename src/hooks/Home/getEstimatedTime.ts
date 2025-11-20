import { useState } from "react";

// 경로 정보 타입
interface RouteInfo {
  distance: number; // 거리 (미터)
  duration: number; // 소요 시간 (초)
  fare?: number; // 요금
}

// 훅 반환 타입
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

/**
 * 카카오 모빌리티 API를 사용하여 예상 소요 시간을 계산하는 훅
 */
export const useEstimatedTime = (): UseEstimatedTimeReturn => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 경로 계산
   * @param startLat 출발지 위도
   * @param startLng 출발지 경도
   * @param endLat 도착지 위도
   * @param endLng 도착지 경도
   */
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
      // 하버사인 공식으로 직선 거리 계산
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371; // 지구 반경 (km)
      const dLat = toRad(endLat - startLat);
      const dLng = toRad(endLng - startLng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(startLat)) *
          Math.cos(toRad(endLat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightDistance = R * c; // km

      // 실제 도로 거리는 직선거리의 1.3배 정도로 추정
      const roadDistance = straightDistance * 1.3;
      const distanceInMeters = Math.round(roadDistance * 1000);

      // 버스 평균 속도: 시내 20km/h, 시외 40km/h
      // 거리에 따라 속도 조정
      const avgSpeed = straightDistance > 10 ? 35 : 20; // km/h
      const durationInSeconds = Math.round((roadDistance / avgSpeed) * 3600);

      console.log("🚌 버스 경로 계산:", {
        직선거리: `${straightDistance.toFixed(2)}km`,
        도로거리추정: `${roadDistance.toFixed(2)}km`,
        평균속도: `${avgSpeed}km/h`,
        예상시간: `${Math.round(durationInSeconds / 60)}분`,
      });

      setRouteInfo({
        distance: distanceInMeters,
        duration: durationInSeconds,
        fare: 0,
      });

      return {
        distance: distanceInMeters,
        duration: durationInSeconds,
        fare: 0,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "경로 계산 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("경로 계산 오류:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 상태 초기화
   */
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

/**
 * 시간을 보기 좋게 포맷팅
 * @param seconds 초
 * @returns 포맷팅된 문자열 (예: "1시간 30분")
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}시간 ${remainingMinutes}분`
      : `${hours}시간`;
  }

  return `${minutes}분`;
};

/**
 * 거리를 보기 좋게 포맷팅
 * @param meters 미터
 * @returns 포맷팅된 문자열 (예: "1.5km" 또는 "500m")
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(meters)}m`;
};
