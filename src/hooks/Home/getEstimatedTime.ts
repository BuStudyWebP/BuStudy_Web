import { useState } from "react";

interface RouteInfo {
  distance: number; 
  duration: number;
  fare?: number; 
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
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371; 
      const dLat = toRad(endLat - startLat);
      const dLng = toRad(endLng - startLng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(startLat)) *
          Math.cos(toRad(endLat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightDistance = R * c;

      const roadDistance = straightDistance * 1.3;
      const distanceInMeters = Math.round(roadDistance * 1000);

      const avgSpeed = straightDistance > 10 ? 35 : 20; 
      const durationInSeconds = Math.round((roadDistance / avgSpeed) * 3600);

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

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}시간 ${remainingMinutes}분`
      : `${hours}시간`;
  }

  return `${minutes}분`;
};


export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(meters)}m`;
};
