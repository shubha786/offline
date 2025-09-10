
import { useState, useCallback, useEffect } from 'react';
import type { MapRegion } from '../types';

const MOCK_REGIONS: MapRegion[] = [
    { id: 'sf', name: 'San Francisco', size: 120, bounds: { lat: [37.7, 37.8], lng: [-122.5, -122.3] } },
    { id: 'tokyo', name: 'Tokyo', size: 250, bounds: { lat: [35.6, 35.8], lng: [139.6, 139.9] } },
    { id: 'london', name: 'London', size: 180, bounds: { lat: [51.4, 51.6], lng: [-0.2, 0.0] } },
    { id: 'paris', name: 'Paris', size: 150, bounds: { lat: [48.8, 48.9], lng: [2.2, 2.4] } },
    { id: 'sydney', name: 'Sydney', size: 190, bounds: { lat: [-33.9, -33.8], lng: [151.1, 151.3] } },
];

const STORAGE_KEY = 'offlineMapsData';

interface OfflineMapsData {
  downloaded: string[]; // array of region IDs
}

export const useOfflineMaps = () => {
  const [downloadedRegions, setDownloadedRegions] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData: OfflineMapsData = JSON.parse(storedData);
        setDownloadedRegions(parsedData.downloaded || []);
      }
    } catch (error) {
      console.error("Failed to load offline maps data:", error);
    }
    setIsInitialized(true);
  }, []);

  const saveData = useCallback((data: OfflineMapsData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save offline maps data:", error);
    }
  }, []);

  const downloadRegion = useCallback((regionId: string) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => { // Simulate network delay
            setDownloadedRegions(prev => {
                if (prev.includes(regionId)) {
                    resolve();
                    return prev;
                }
                const newDownloaded = [...prev, regionId];
                saveData({ downloaded: newDownloaded });
                resolve();
                return newDownloaded;
            });
        }, 1500);
    });
  }, [saveData]);

  const deleteRegion = useCallback((regionId: string) => {
    setDownloadedRegions(prev => {
        const newDownloaded = prev.filter(id => id !== regionId);
        saveData({ downloaded: newDownloaded });
        return newDownloaded;
    });
  }, [saveData]);

  const allRegions = MOCK_REGIONS;

  const getStorageUsage = () => {
    return downloadedRegions.reduce((total, regionId) => {
        const region = allRegions.find(r => r.id === regionId);
        return total + (region?.size || 0);
    }, 0);
  };

  return {
    allRegions,
    downloadedRegionIds: downloadedRegions,
    downloadRegion,
    deleteRegion,
    isInitialized,
    storageUsage: getStorageUsage(),
  };
};
