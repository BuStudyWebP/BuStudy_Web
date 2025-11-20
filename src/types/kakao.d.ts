/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */
declare namespace kakao {
  namespace maps {
    interface MapOptions {
      center: LatLng;
      level?: number;
    }

    interface MarkerOptions {
      position: LatLng;
    }

    interface InfoWindowOptions {
      content: string;
    }

    class Map {
      constructor(container: HTMLElement, opts?: MapOptions);
      setBounds(bounds: LatLngBounds): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    class LatLngBounds {
      extend(latlng: LatLng): void;
    }

    class InfoWindow {
      constructor(opts: InfoWindowOptions);
      open(map: Map, marker: Marker): void;
    }

    function load(callback: () => void): void;

    namespace event {
      function addListener(
        target: Marker,
        type: string,
        handler: () => void
      ): void;
    }

    namespace services {
      class Geocoder {
        addressSearch(
          address: string,
          callback: (result: AddressSearchResult[], status: string) => void
        ): void;
      }

      class Places {
        keywordSearch(
          keyword: string,
          callback: (result: PlaceSearchResult[], status: string) => void
        ): void;
      }

      const Status: {
        OK: string;
        ZERO_RESULT: string;
        ERROR: string;
      };

      interface AddressSearchResult {
        x: string;
        y: string;
      }

      interface PlaceSearchResult {
        x: string;
        y: string;
        place_name: string;
        address_name: string;
      }
    }
  }
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export {};
