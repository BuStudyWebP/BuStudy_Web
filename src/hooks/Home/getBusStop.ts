import { useState } from "react";

const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface BusStop {
  nodeid: string; 
  nodenm: string;
  gpslati: string; 
  gpslong: string;
  citycode: string; 
}

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

interface UseBusStopReturn {
  busStops: BusStop[];
  isLoading: boolean;
  error: string | null;
  searchNearbyStops: (latitude: number, longitude: number) => Promise<void>;
  reset: () => void;
}

export const useBusStop = (): UseBusStopReturn => {
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const searchNearbyStops = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    setBusStops([]);

    try {
      const params = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        gpsLati: latitude.toString(),
        gpsLong: longitude.toString(),
        _type: "json", 
      });

      const url = `${API_BASE_URL}/getCrdntPrxmtSttnList?${params.toString()}`;

      console.log("🚌 정류장 API 요청:", {
        url,
        latitude,
        longitude,
        serviceKey: SERVICE_KEY?.substring(0, 20) + "...",
      });

      const response = await fetch(url);

      console.log("API 응답 상태:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API 오류 응답:", errorText);
        throw new Error(`HTTP 오류 ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      console.log("API 응답 데이터:", data);

      const { resultCode, resultMsg } = data.response.header;

      if (resultCode !== "00") {
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

      const items = data.response.body.items;

      if (!items || !items.item) {
        setBusStops([]);
        setError("근처에 정류장이 없습니다.");
        return;
      }

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
