export interface User {
  email: string;
  name: string;
  avatar: string;
}

export interface MapRegion {
  id: string;
  name: string;
  size: number; // in MB
  // A pseudo bounding box for simulation
  bounds: {
    lat: [number, number];
    lng: [number, number];
  };
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SavedPlace {
  id: string;
  name: string;
  notes?: string;
  coordinates: Coordinates;
}

export enum View {
  LOGIN,
  MAP,
  OFFLINE,
  PROFILE,
  SAVED_PLACES,
}
