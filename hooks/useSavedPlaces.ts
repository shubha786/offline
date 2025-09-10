
import { useState, useCallback, useEffect } from 'react';
import type { SavedPlace } from '../types';

const STORAGE_KEY = 'savedPlacesData';

export const useSavedPlaces = () => {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setSavedPlaces(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load saved places:", error);
    }
  }, []);

  const saveData = useCallback((data: SavedPlace[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSavedPlaces(data);
    } catch (error) {
      console.error("Failed to save places:", error);
    }
  }, []);

  const addPlace = useCallback((place: Omit<SavedPlace, 'id'>) => {
    const newPlace: SavedPlace = {
      ...place,
      id: new Date().toISOString(),
    };
    const updatedPlaces = [...savedPlaces, newPlace];
    saveData(updatedPlaces);
  }, [savedPlaces, saveData]);

  const updatePlace = useCallback((id: string, updates: Partial<Omit<SavedPlace, 'id'>>) => {
    const updatedPlaces = savedPlaces.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    saveData(updatedPlaces);
  }, [savedPlaces, saveData]);
  
  const deletePlace = useCallback((id: string) => {
    const updatedPlaces = savedPlaces.filter(p => p.id !== id);
    saveData(updatedPlaces);
  }, [savedPlaces, saveData]);

  return {
    savedPlaces,
    addPlace,
    updatePlace,
    deletePlace,
  };
};
