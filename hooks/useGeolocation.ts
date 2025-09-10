
import { useState, useEffect } from 'react';
import type { Coordinates } from '../types';

interface GeolocationState {
  coordinates: Coordinates | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      // Geolocation is not supported by this browser.
      // We can't set an error here as it's not a PositionError.
      // We could add a different error type to the state.
      setState(prevState => ({ ...prevState, isLoading: false }));
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        setState({
          coordinates: null,
          error: error,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return state;
};
