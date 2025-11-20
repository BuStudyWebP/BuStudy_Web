import { useState } from "react";

// API 서비스 키
const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 정류소 정보 타입 정의
export interface BusStop {
  nodeid: string; // 정류소ID
  nodenm: string; // 정류소명
  gpslati: string; // 위도
  gpslong: string; // 경도
  citycode: string; // 도시코드
}

// API 응답 타입
interface ApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: BusStop[] | BusStop;
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 훅 반환 타입
interface UseBusStopReturn {
  busStops: BusStop[];
  isLoading: boolean;
  error: string | null;
  searchNearbyStops: (latitude: number, longitude: number) => Promise<void>;
  reset: () => void;
}

/**
 * 좌표 기반으로 근처 정류장을 검색하는 커스텀 훅
 */
export const useBusStop = (): UseBusStopReturn => {
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 좌표 기반 근접 정류소 검색
   * @param latitude 위도 (WGS84)
   * @param longitude 경도 (WGS84)
   */
  const searchNearbyStops = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    setBusStops([]);

    try {
      // API 요청 URL 구성
      const params = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        gpsLati: latitude.toString(),
        gpsLong: longitude.toString(),
        _type: "json", // JSON 형식으로 응답 받기
      });

      const url = `${API_BASE_URL}/getCrdntPrxmtSttnList?${params.toString()}`;

      console.log("🚌 정류장 API 요청:", {
        url,
        latitude,
        longitude,
        serviceKey: SERVICE_KEY?.substring(0, 20) + "...",
      });

      const response = await fetch(url);

      console.log("📡 API 응답 상태:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API 오류 응답:", errorText);
        throw new Error(`HTTP 오류 ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      console.log("✅ API 응답 데이터:", data);

      // 응답 헤더 확인
      const { resultCode, resultMsg } = data.response.header;

      if (resultCode !== "00") {
        // 에러 코드에 따른 메시지 처리
        let errorMessage = resultMsg;

        switch (resultCode) {
          case "30":
            errorMessage = "등록되지 않은 서비스 키입니다.";
            break;
          case "31":
            errorMessage = "활용기간이 만료되었습니다.";
            break;
          case "32":
            errorMessage = "등록되지 않은 IP입니다.";
            break;
          case "22":
            errorMessage = "서비스 요청 한도를 초과했습니다.";
            break;
          case "99":
            errorMessage = "잘못된 요청 파라미터입니다.";
            break;
          default:
            errorMessage = `API 오류: ${resultMsg}`;
        }

        throw new Error(errorMessage);
      }

      // 응답 데이터 처리
      const items = data.response.body.items;

      if (!items || !items.item) {
        setBusStops([]);
        setError("근처에 정류장이 없습니다.");
        return;
      }

      // item이 배열이 아닌 경우 (결과가 1개일 때) 배열로 변환
      const stopList = Array.isArray(items.item) ? items.item : [items.item];

      setBusStops(stopList);

      if (stopList.length === 0) {
        setError("근처에 정류장이 없습니다.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "정류장 검색 중 오류가 발생했습니다.";
      setError(errorMessage);
      setBusStops([]);
      console.error("정류장 검색 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 상태 초기화
   */
  const reset = () => {
    setBusStops([]);
    setError(null);
    setIsLoading(false);
  };

  return {
    busStops,
    isLoading,
    error,
    searchNearbyStops,
    reset,
  };
};
