import { useEffect, useRef, useState } from "react";

// Use Vite env variable VITE_KAKAO_KEY or replace the string below.
const KAKAO_KEY =
  (import.meta.env.VITE_KAKAO_KEY as string) || "YOUR_KAKAO_APP_KEY";

export default function HomeView() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [estimated, setEstimated] = useState<string | null>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const scriptId = "kakao-map-sdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        loadKakaoMap();
      };
    } else if (window.kakao) {
      loadKakaoMap();
    }

    function loadKakaoMap() {
      if (!window.kakao) return;
      if (mapInstanceRef.current) return;

      window.kakao.maps.load(() => {
        const container = mapRef.current as HTMLDivElement;
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 5,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstanceRef.current = map;
      });
    }
  }, []);

  function clearMarkers() {
    markersRef.current.forEach((m) => {
      try {
        m.setMap(null);
      } catch {
        // ignore
      }
    });
    markersRef.current = [];
  }

  function addMarker(latlng: kakao.maps.LatLng, title: string) {
    if (!window.kakao || !mapInstanceRef.current) return;
    const marker = new window.kakao.maps.Marker({ position: latlng });
    marker.setMap(mapInstanceRef.current!);
    const info = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:6px;">${title}</div>`,
    });
    window.kakao.maps.event.addListener(marker, "click", () =>
      info.open(mapInstanceRef.current!, marker)
    );
    markersRef.current.push(marker);
  }

  function haversineDistance(a: [number, number], b: [number, number]) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);

    const aa =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  }

  async function estimateTime() {
    if (!window.kakao) return;
    const geocoder = new window.kakao.maps.services.Geocoder();

    function geocode(address: string): Promise<[number, number]> {
      return new Promise((resolve, reject) => {
        geocoder.addressSearch(
          address,
          (result: kakao.maps.AddressSearchResult[], status: string) => {
            if (
              status === window.kakao.maps.services.Status.OK &&
              result &&
              result[0]
            ) {
              resolve([Number(result[0].y), Number(result[0].x)]);
            } else {
              reject(new Error("주소를 찾을 수 없습니다."));
            }
          }
        );
      });
    }

    try {
      const fromCoord = await geocode(from);
      const toCoord = await geocode(to);

      clearMarkers();
      const fromLatLng = new window.kakao.maps.LatLng(
        fromCoord[0],
        fromCoord[1]
      );
      const toLatLng = new window.kakao.maps.LatLng(toCoord[0], toCoord[1]);
      addMarker(fromLatLng, "출발지");
      addMarker(toLatLng, "도착지");

      // Fit bounds
      const bounds = new window.kakao.maps.LatLngBounds();
      bounds.extend(fromLatLng);
      bounds.extend(toLatLng);
      try {
        mapInstanceRef.current?.setBounds(bounds);
      } catch {
        // ignore
      }

      const distKm = haversineDistance(
        [fromCoord[0], fromCoord[1]],
        [toCoord[0], toCoord[1]]
      );
      // markers already managed by clearMarkers(); nothing extra needed here
      // Simple estimation: assume average speed 30 km/h (can be adjusted)
      const avgSpeedKmh = 30;
      const hours = distKm / avgSpeedKmh;
      const minutes = Math.round(hours * 60);

      setEstimated(`${distKm.toFixed(2)} km · 약 ${minutes}분`);
    } catch (err: unknown) {
      const msg = (err as any)?.message || "주소를 확인해주세요.";
      setEstimated(`오류: ${msg}`);
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Top panel: appears when user clicks '공부 시작하기' */}
      {showPanel && (
        <div className="bg-white p-4 shadow z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-xs text-gray-600">출발지</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="출발지 주소 입력"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">도착지</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="도착지 주소 입력"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={estimateTime}
                className="bg-orange-500 text-white px-4 py-2 rounded"
              >
                예상 시간 계산
              </button>
              <button
                onClick={() => {
                  setShowPanel(false);
                  setEstimated(null);
                  clearMarkers();
                }}
                className="px-4 py-2 border rounded"
              >
                닫기
              </button>
            </div>
          </div>

          {estimated && (
            <div className="max-w-5xl mx-auto mt-3 text-sm text-gray-700">
              예상: {estimated}
            </div>
          )}
        </div>
      )}

      {/* Map area fills remaining space */}
      <div className="flex-1 relative">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

        {/* Floating '공부 시작하기' button on map */}
        <div className="absolute right-4 bottom-6">
          <button
            onClick={() => setShowPanel((s) => !s)}
            className="bg-orange-500 text-white px-4 py-3 rounded-full shadow-lg"
          >
            공부 시작하기
          </button>
        </div>

        {/* Notice about Kakao key if not set */}
        {KAKAO_KEY === "YOUR_KAKAO_APP_KEY" && (
          <div className="absolute left-4 bottom-6 bg-white p-2 rounded shadow text-xs text-red-600">
            Kakao API 키가 설정되어 있지 않습니다. `.env`에 `VITE_KAKAO_KEY`를
            추가하세요.
          </div>
        )}
      </div>
    </div>
  );
}
