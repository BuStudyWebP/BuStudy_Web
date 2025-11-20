import { useEffect, useRef, useState } from "react";
import { useBusStop, type BusStop } from "../../hooks/Home/getBusStop";
import {
  useEstimatedTime,
  formatDuration,
  formatDistance,
} from "../../hooks/Home/getEstimatedTime";

// Kakao Maps 타입 정의
type KakaoMap = {
  setBounds: (bounds: unknown) => void;
  setCenter: (latlng: unknown) => void;
};

type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void;
};

const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY || "YOUR_KAKAO_APP_KEY";

const HomeViewPage = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  
  // UI 상태
  const [showPanel, setShowPanel] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [estimated, setEstimated] = useState<string | null>(null);
  
  // 정류장 검색 상태
  const [selectedFromStop, setSelectedFromStop] = useState<BusStop | null>(null);
  const [selectedToStop, setSelectedToStop] = useState<BusStop | null>(null);
  
  // 정류장 검색 훅
  const fromStops = useBusStop();
  const toStops = useBusStop();
  
  // 예상 시간 계산 훅
  const estimatedTime = useEstimatedTime();
  
  // 지도 로딩 상태
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 지도 객체 관리
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const currentLocationMarkerRef = useRef<KakaoMarker | null>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const scriptId = "kakao-map-sdk";
    
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        setMapError(true);
        return;
      }

      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        // 기본 위치 (서울)
        const defaultLat = 37.5665;
        const defaultLng = 126.978;

        const options = {
          center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
          level:4,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstanceRef.current = map as KakaoMap;
        setMapLoaded(true);

        // 현재 위치 가져오기
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const locPosition = new window.kakao.maps.LatLng(lat, lng);

              // 지도 중심을 현재 위치로 이동
              (map as KakaoMap).setCenter(locPosition);

              // 현재 위치 마커 생성
              const marker = new window.kakao.maps.Marker({
                position: locPosition,
              }) as KakaoMarker;

              marker.setMap(map as KakaoMap);
              currentLocationMarkerRef.current = marker;
            },
            (error) => {
              console.warn("위치 정보를 가져올 수 없습니다:", error);
              // 위치 정보를 가져오지 못해도 기본 위치로 지도 표시
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        }
      });
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
    }

    const handleLoad = () => initMap();
    const handleError = () => setMapError(true);

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, []);

  function clearMarkers() {
    markersRef.current.forEach((m) => {
      try {
        m.setMap(null);
      } catch (e) {
        console.error(e);
      }
    });
    markersRef.current = [];
  }

  function addMarker(latlng: unknown, title: string) {
    if (!window.kakao || !mapInstanceRef.current) return;
    
    const marker = new window.kakao.maps.Marker({ position: latlng as never }) as KakaoMarker;
    marker.setMap(mapInstanceRef.current as KakaoMap);
    
    const infoContent = `<div style="padding:5px; font-size:12px; color:#000;">${title}</div>`;
    const info = new window.kakao.maps.InfoWindow({
      content: infoContent,
    });

    window.kakao.maps.event.addListener(marker, "click", () => {
      if (mapInstanceRef.current) {
        info.open(mapInstanceRef.current as KakaoMap, marker);
      }
    });

    markersRef.current.push(marker);
  }

  async function estimateTime() {
    if (!window.kakao || !mapInstanceRef.current) return;
    
    if (!selectedFromStop || !selectedToStop) {
      alert("출발 정류장과 도착 정류장을 선택해주세요.");
      return;
    }

    try {
      const fromLat = Number(selectedFromStop.gpslati);
      const fromLng = Number(selectedFromStop.gpslong);
      const toLat = Number(selectedToStop.gpslati);
      const toLng = Number(selectedToStop.gpslong);

      clearMarkers();

      const fromLatLng = new window.kakao.maps.LatLng(fromLat, fromLng);
      const toLatLng = new window.kakao.maps.LatLng(toLat, toLng);

      addMarker(fromLatLng, "출발: " + selectedFromStop.nodenm);
      addMarker(toLatLng, "도착: " + selectedToStop.nodenm);

      const bounds = new window.kakao.maps.LatLngBounds();
      bounds.extend(fromLatLng);
      bounds.extend(toLatLng);
      (mapInstanceRef.current as KakaoMap).setBounds(bounds);

      // 카카오 모빌리티 API로 예상 시간 계산
      const result = await estimatedTime.calculateRoute(fromLat, fromLng, toLat, toLng);

      if (result) {
        const distance = formatDistance(result.distance);
        const duration = formatDuration(result.duration);
        setEstimated(`🚌 거리 ${distance} · 예상 소요시간 ${duration}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류";
      setEstimated(`오류: ${message}`);
    }
  }

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 64px)" }}>
      {/* 상단 패널 */}
      {showPanel && (
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-white/95 backdrop-blur shadow-md transition-all">
          <div className="grid items-end max-w-5xl grid-cols-1 gap-3 mx-auto sm:grid-cols-[1fr_1fr_auto]">
            <div className="flex flex-col gap-1 relative">
              <label className="text-xs font-semibold text-gray-600">출발지</label>
              <input
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setSelectedFromStop(null);
                  fromStops.reset();
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && from && window.kakao) {
                    const places = new window.kakao.maps.services.Places();
                    places.keywordSearch(from, (result: Array<{x: string; y: string}>, status: string) => {
                      if (status === window.kakao.maps.services.Status.OK && result[0]) {
                        const lat = Number(result[0].y);
                        const lng = Number(result[0].x);
                        fromStops.searchNearbyStops(lat, lng);
                      } else {
                        // 키워드 검색 실패 시 주소 검색 시도
                        const geocoder = new window.kakao.maps.services.Geocoder();
                        geocoder.addressSearch(
                          from,
                          (result2: Array<{x: string; y: string}>, status2: string) => {
                            if (status2 === window.kakao.maps.services.Status.OK && result2[0]) {
                              const lat = Number(result2[0].y);
                              const lng = Number(result2[0].x);
                              fromStops.searchNearbyStops(lat, lng);
                            }
                          }
                        );
                      }
                    });
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                placeholder="예: 강남역 (Enter로 정류장 검색)"
              />
              
              {/* 출발지 정류장 목록 */}
              {from && (fromStops.isLoading || fromStops.busStops.length > 0 || fromStops.error) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto z-30">
                  {fromStops.isLoading && (
                    <div className="p-3 text-center">
                      <div className="inline-block w-4 h-4 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                      <p className="text-sm text-gray-600 mt-2">정류장 검색 중...</p>
                    </div>
                  )}
                  
                  {fromStops.error && (
                    <div className="p-3 text-center text-red-500 text-sm">
                      {fromStops.error}
                    </div>
                  )}
                  
                  {!fromStops.isLoading && fromStops.busStops.length > 0 && (
                    <div>
                      <div className="p-2 bg-gray-50 border-b text-xs font-semibold text-gray-700">
                        근처 정류장 ({fromStops.busStops.length}개)
                      </div>
                      {fromStops.busStops.map((stop) => (
                        <button
                          key={stop.nodeid}
                          onClick={() => {
                            setSelectedFromStop(stop);
                            setFrom(stop.nodenm);
                            fromStops.reset();
                          }}
                          className="w-full p-3 text-left hover:bg-orange-50 border-b last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-sm text-gray-900">{stop.nodenm}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            정류소ID: {stop.nodeid} | 도시코드: {stop.citycode}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 relative">
              <label className="text-xs font-semibold text-gray-600">도착지</label>
              <input
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setSelectedToStop(null);
                  toStops.reset();
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && to && window.kakao) {
                    const places = new window.kakao.maps.services.Places();
                    places.keywordSearch(to, (result: Array<{x: string; y: string}>, status: string) => {
                      if (status === window.kakao.maps.services.Status.OK && result[0]) {
                        const lat = Number(result[0].y);
                        const lng = Number(result[0].x);
                        toStops.searchNearbyStops(lat, lng);
                      } else {
                        // 키워드 검색 실패 시 주소 검색 시도
                        const geocoder = new window.kakao.maps.services.Geocoder();
                        geocoder.addressSearch(
                          to,
                          (result2: Array<{x: string; y: string}>, status2: string) => {
                            if (status2 === window.kakao.maps.services.Status.OK && result2[0]) {
                              const lat = Number(result2[0].y);
                              const lng = Number(result2[0].x);
                              toStops.searchNearbyStops(lat, lng);
                            }
                          }
                        );
                      }
                    });
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                placeholder="예: 판교역 (Enter로 정류장 검색)"
              />
              
              {/* 도착지 정류장 목록 */}
              {to && (toStops.isLoading || toStops.busStops.length > 0 || toStops.error) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto z-30">
                  {toStops.isLoading && (
                    <div className="p-3 text-center">
                      <div className="inline-block w-4 h-4 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                      <p className="text-sm text-gray-600 mt-2">정류장 검색 중...</p>
                    </div>
                  )}
                  
                  {toStops.error && (
                    <div className="p-3 text-center text-red-500 text-sm">
                      {toStops.error}
                    </div>
                  )}
                  
                  {!toStops.isLoading && toStops.busStops.length > 0 && (
                    <div>
                      <div className="p-2 bg-gray-50 border-b text-xs font-semibold text-gray-700">
                        근처 정류장 ({toStops.busStops.length}개)
                      </div>
                      {toStops.busStops.map((stop) => (
                        <button
                          key={stop.nodeid}
                          onClick={() => {
                            setSelectedToStop(stop);
                            setTo(stop.nodenm);
                            toStops.reset();
                          }}
                          className="w-full p-3 text-left hover:bg-orange-50 border-b last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-sm text-gray-900">{stop.nodenm}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            정류소ID: {stop.nodeid} | 도시코드: {stop.citycode}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={estimateTime}
                className="px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded hover:bg-orange-600 active:bg-orange-700"
              >
                계산하기
              </button>
              <button
                onClick={() => {
                  setShowPanel(false);
                  setEstimated(null);
                  clearMarkers();
                  setFrom("");
                  setTo("");
                  setSelectedFromStop(null);
                  setSelectedToStop(null);
                  fromStops.reset();
                  toStops.reset();
                  estimatedTime.reset();
                }}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 border rounded hover:bg-gray-200"
              >
                닫기
              </button>
            </div>
          </div>

          {estimated && (
            <div className="max-w-5xl mx-auto mt-4 p-3 bg-orange-50 border border-orange-100 rounded text-center sm:text-left">
              <span className="font-bold text-orange-800">🚗 결과: </span>
              <span className="text-gray-800">{estimated}</span>
            </div>
          )}
        </div>
      )}

      {/* 지도 영역 */}
      <div ref={mapRef} className="w-full h-full bg-gray-100" />

      {/* 하단 플로팅 버튼 */}
      <div className="absolute right-4 bottom-8 z-10">
        <button
          onClick={() => setShowPanel((s) => !s)}
          className="flex items-center justify-center px-6 py-3 font-bold text-white transition-transform bg-orange-500 rounded-full shadow-xl hover:bg-orange-600 hover:scale-105 active:scale-95"
        >
          {showPanel ? "패널 숨기기" : "공부 시작하기"}
        </button>
      </div>

      {/* 로딩 및 에러 상태 표시 */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-0">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-orange-500 rounded-full border-t-transparent animate-spin mb-2"></div>
            <p className="text-gray-500">지도를 불러오는 중입니다...</p>
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-0 p-4">
          <div className="text-center text-red-500">
            <p className="font-bold text-lg">지도를 로드할 수 없습니다.</p>
            <p className="text-sm mt-2 text-gray-600">
              1. Kakao Developers에서 <b>사이트 도메인</b> 설정을 확인하세요.<br />
              (현재 주소: {window.location.origin})
            </p>
            <p className="text-sm mt-1 text-gray-600">
              2. <b>API KEY</b>가 올바른지 확인하세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeViewPage;