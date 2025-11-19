declare namespace kakao {
  namespace maps {
    class Map {
      constructor(container: HTMLElement, opts?: any);
      setBounds(bounds: LatLngBounds): void;
    }

    class Marker {
      constructor(opts?: any);
      setMap(map: Map | null): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    class LatLngBounds {
      extend(latlng: LatLng): void;
    }

    class InfoWindow {
      constructor(opts: any);
      open(map: Map, marker: Marker): void;
    }

    namespace services {
      class Geocoder {
        addressSearch(
          address: string,
          callback: (result: AddressSearchResult[], status: string) => void
        ): void;
      }

      var Status: any;
    }

    interface AddressSearchResult {
      x: string;
      y: string;
    }
  }
}

declare global {
  interface Window {
    kakao: any;
  }
}

export {};
