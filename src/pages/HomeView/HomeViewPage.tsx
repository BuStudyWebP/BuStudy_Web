import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusStop, type BusStop } from "../../hooks/Home/getBusStop";
import {
  useEstimatedTime,
  formatDuration,
  formatDistance,
} from "../../hooks/Home/getEstimatedTime";
import { useAppContext } from "../../context/AppContext";
import { useTranslation } from "react-i18next";

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

  const [showPanel, setShowPanel] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [estimated, setEstimated] = useState<string | null>(null);

  const [selectedFromStop, setSelectedFromStop] = useState<BusStop | null>(
    null
  );
  const [selectedToStop, setSelectedToStop] = useState<BusStop | null>(null);

  const fromStops = useBusStop();
  const toStops = useBusStop();
  const estimatedTime = useEstimatedTime();
  const { t } = useTranslation();
  const { estimatedTime: contextEstimatedTime, setEstimatedTime } =
    useAppContext();
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const currentLocationMarkerRef = useRef<KakaoMarker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const navigate = useNavigate();

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

        const defaultLat = 37.5665;
        const defaultLng = 126.978;

        const options = {
          center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
          level: 4,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstanceRef.current = map as KakaoMap;
        setMapLoaded(true);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const locPosition = new window.kakao.maps.LatLng(lat, lng);

              (map as KakaoMap).setCenter(locPosition);

              const marker = new window.kakao.maps.Marker({
                position: locPosition,
              }) as KakaoMarker;

              marker.setMap(map as KakaoMap);
              currentLocationMarkerRef.current = marker;
            },
            (error) => {
              console.warn("Unable to access location information:", error);
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

    const marker = new window.kakao.maps.Marker({
      position: latlng as never,
    }) as KakaoMarker;
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
      alert(t("home.selectStopsAlert"));
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

      addMarker(fromLatLng, t("home.fromPrefix") + selectedFromStop.nodenm);
      addMarker(toLatLng, t("home.toPrefix") + selectedToStop.nodenm);

      const bounds = new window.kakao.maps.LatLngBounds();
      bounds.extend(fromLatLng);
      bounds.extend(toLatLng);
      (mapInstanceRef.current as KakaoMap).setBounds(bounds);

      const result = await estimatedTime.calculateRoute(
        fromLat,
        fromLng,
        toLat,
        toLng
      );

      if (result) {
        // store only travel time (minutes) in Context
        const timeInMinutes = Math.round(result.duration / 60);
        setEstimatedTime(timeInMinutes);
        const distance = formatDistance(result.distance);
        const duration = formatDuration(result.duration);
        setEstimated(
          `${t("home.resultLabel")} ${distance} · ${t(
            "home.estimatedSubtitle"
          )} ${duration}`
        );
      } else if (estimatedTime.error) {
        setEstimated(`${t("home.errorLabel")} ${estimatedTime.error}`);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("home.unknownError");
      setEstimated(`${t("home.errorLabel")} ${message}`);
    }
  }

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 64px)" }}>
      {/* top panel */}
      {showPanel && (
        <div className="absolute top-0 left-0 right-0 z-20 p-4 transition-all shadow-md bg-white/95 backdrop-blur">
          <div className="grid items-end max-w-5xl grid-cols-1 gap-3 mx-auto sm:grid-cols-[1fr_1fr_auto]">
            <div className="relative flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                {t("home.fromLabel")}
              </label>
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
                    places.keywordSearch(
                      from,
                      (
                        result: Array<{ x: string; y: string }>,
                        status: string
                      ) => {
                        if (
                          status === window.kakao.maps.services.Status.OK &&
                          result[0]
                        ) {
                          const lat = Number(result[0].y);
                          const lng = Number(result[0].x);
                          fromStops.searchNearbyStops(lat, lng);
                        } else {
                          // If keyword search fails, try address search
                          const geocoder =
                            new window.kakao.maps.services.Geocoder();
                          geocoder.addressSearch(
                            from,
                            (
                              result2: Array<{ x: string; y: string }>,
                              status2: string
                            ) => {
                              if (
                                status2 ===
                                  window.kakao.maps.services.Status.OK &&
                                result2[0]
                              ) {
                                const lat = Number(result2[0].y);
                                const lng = Number(result2[0].x);
                                fromStops.searchNearbyStops(lat, lng);
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                placeholder={t("home.fromPlaceholder")}
              />

              {from &&
                (fromStops.isLoading ||
                  fromStops.busStops.length > 0 ||
                  fromStops.error) && (
                  <div className="absolute left-0 right-0 z-30 mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg top-full max-h-60">
                    {fromStops.isLoading && (
                      <div className="p-3 text-center">
                        <div className="inline-block w-4 h-4 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                        <p className="mt-2 text-sm text-gray-600">
                          {t("home.searchingStops")}
                        </p>
                      </div>
                    )}

                    {fromStops.error && (
                      <div className="p-3 text-sm text-center text-red-500">
                        {t("stopSearchError")}{" "}
                        {fromStops.error ? `(${fromStops.error})` : null}
                      </div>
                    )}

                    {!fromStops.isLoading && fromStops.busStops.length > 0 && (
                      <div>
                        <div className="p-2 text-xs font-semibold text-gray-700 border-b bg-gray-50">
                          {t("home.nearbyStops", {
                            count: fromStops.busStops.length,
                          })}
                        </div>
                        {fromStops.busStops.map((stop) => (
                          <button
                            key={stop.nodeid}
                            onClick={() => {
                              setSelectedFromStop(stop);
                              setFrom(stop.nodenm);
                              fromStops.reset();
                            }}
                            className="w-full p-3 text-left transition-colors border-b hover:bg-orange-50 last:border-b-0"
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {stop.nodenm}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {t("home.stopIdLabel")} : {stop.nodeid} |{" "}
                              {t("home.cityCodeLabel")} : {stop.citycode}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>
            <div className="relative flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                {t("home.toLabel")}
              </label>
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
                    places.keywordSearch(
                      to,
                      (
                        result: Array<{ x: string; y: string }>,
                        status: string
                      ) => {
                        if (
                          status === window.kakao.maps.services.Status.OK &&
                          result[0]
                        ) {
                          const lat = Number(result[0].y);
                          const lng = Number(result[0].x);
                          toStops.searchNearbyStops(lat, lng);
                        } else {
                          const geocoder =
                            new window.kakao.maps.services.Geocoder();
                          geocoder.addressSearch(
                            to,
                            (
                              result2: Array<{ x: string; y: string }>,
                              status2: string
                            ) => {
                              if (
                                status2 ===
                                  window.kakao.maps.services.Status.OK &&
                                result2[0]
                              ) {
                                const lat = Number(result2[0].y);
                                const lng = Number(result2[0].x);
                                toStops.searchNearbyStops(lat, lng);
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
                placeholder={t("home.toPlaceholder")}
              />

              {to &&
                (toStops.isLoading ||
                  toStops.busStops.length > 0 ||
                  toStops.error) && (
                  <div className="absolute left-0 right-0 z-30 mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg top-full max-h-60">
                    {toStops.isLoading && (
                      <div className="p-3 text-center">
                        <div className="inline-block w-4 h-4 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                        <p className="mt-2 text-sm text-gray-600">
                          {t("home.searchingStops")}
                        </p>
                      </div>
                    )}

                    {toStops.error && (
                      <div className="p-3 text-sm text-center text-red-500">
                        {t("stopSearchError")}{" "}
                        {toStops.error ? `(${toStops.error})` : null}
                      </div>
                    )}

                    {!toStops.isLoading && toStops.busStops.length > 0 && (
                      <div>
                        <div className="p-2 text-xs font-semibold text-gray-700 border-b bg-gray-50">
                          {t("home.nearbyStops", {
                            count: toStops.busStops.length,
                          })}
                        </div>
                        {toStops.busStops.map((stop) => (
                          <button
                            key={stop.nodeid}
                            onClick={() => {
                              setSelectedToStop(stop);
                              setTo(stop.nodenm);
                              toStops.reset();
                            }}
                            className="w-full p-3 text-left transition-colors border-b hover:bg-orange-50 last:border-b-0"
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {stop.nodenm}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {t("home.stopIdLabel")} : {stop.nodeid} |{" "}
                              {t("home.cityCodeLabel")} : {stop.citycode}
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
                disabled={estimatedTime.isLoading}
                className={`px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded hover:bg-orange-600 active:bg-orange-700 ${
                  estimatedTime.isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {estimatedTime.isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="inline-block w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    {t("home.calculating")}
                  </span>
                ) : (
                  t("home.calculateButton")
                )}
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
                  setEstimatedTime(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 border rounded hover:bg-gray-200"
              >
                {t("home.closeButton")}
              </button>
            </div>
          </div>

          {/* show error message */}
          {estimatedTime.error && !estimated && (
            <div className="flex items-center gap-2 p-3 mx-auto mt-4 text-center text-red-500 border border-red-200 rounded bg-red-50">
              <span className="text-xl">⚠️</span>
              <span className="text-sm">{estimatedTime.error}</span>
            </div>
          )}

          {estimated && (
            <div className="flex flex-col items-center w-full gap-4 mt-4">
              <div
                className={`p-3 mx-auto mt-4 text-center border rounded w-max sm:text-left ${
                  estimated.startsWith(t("home.errorLabel"))
                    ? "bg-red-50 border-red-200"
                    : "bg-orange-50 border-orange-100"
                }`}
              >
                <span
                  className={`font-bold ${
                    estimated.startsWith(t("home.errorLabel"))
                      ? "text-red-800"
                      : "text-orange-800"
                  }`}
                >
                  {estimated.startsWith(t("home.errorLabel"))
                    ? `⚠️ ${t("home.errorLabel")}`
                    : `🚗 ${t("home.resultLabel")}`}
                </span>
                <span className="text-gray-800">
                  {estimated.replace(t("home.errorLabel"), "")}
                </span>
              </div>
              <button
                onClick={() => {
                  navigate("/subjects");
                }}
                className="p-4 py-2 text-sm font-bold text-white bg-orange-500 rounded hover:bg-orange-600 active:bg-orange-700"
              >
                {t("home.startLearningButton")}
              </button>
            </div>
          )}
        </div>
      )}

      <div ref={mapRef} className="w-full h-full bg-gray-100" />

      <div className="absolute z-10 flex flex-col items-end gap-3 right-4 bottom-8">
        {contextEstimatedTime && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🚌</span>
              <span className="font-bold text-gray-800">
                {t("home.estimatedTitle")}
              </span>
            </div>
            <div className="py-4 text-center">
              <div className="text-4xl font-bold text-orange-600">
                {t("estimatedMinutes", { minutes: contextEstimatedTime })}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {t("home.estimatedSubtitle")}
              </div>
            </div>
            {selectedFromStop && selectedToStop && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>📍</span>
                    <span className="truncate">{selectedFromStop.nodenm}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🎯</span>
                    <span className="truncate">{selectedToStop.nodenm}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setShowPanel((s) => !s)}
          className="flex items-center justify-center px-6 py-3 font-bold text-white transition-transform bg-orange-500 rounded-full shadow-xl hover:bg-orange-600 hover:scale-105 active:scale-95"
        >
          {showPanel ? t("home.panel.hide") : t("home.panel.open")}
        </button>
      </div>

      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 mb-2 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-500">{t("home.loadingMap")}</p>
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 z-0 flex items-center justify-center p-4 bg-gray-50">
          <div className="text-center text-red-500">
            <p className="text-lg font-bold">{t("home.loadError.title")}</p>
            <p className="mt-2 text-sm text-gray-600">
              {t("home.loadError.step1")} <br />({window.location.origin})
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {t("home.loadError.step2")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeViewPage;
