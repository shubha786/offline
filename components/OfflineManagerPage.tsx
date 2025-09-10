
import React, { useState } from 'react';
import { useOfflineMaps } from '../hooks/useOfflineMaps';
import { DownloadIcon, TrashIcon } from './Icons';
import type { MapRegion } from '../types';

const RegionItem: React.FC<{
  region: MapRegion;
  isDownloaded: boolean;
  onDownload: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
}> = ({ region, isDownloaded, onDownload, onDelete }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    await onDownload(region.id);
    setIsDownloading(false);
  };

  return (
    <li className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div>
        <h3 className="font-semibold text-white">{region.name}</h3>
        <p className="text-sm text-gray-400">{region.size} MB</p>
      </div>
      {isDownloaded ? (
        <button
          onClick={() => onDelete(region.id)}
          className="p-2 rounded-full text-red-400 hover:bg-red-900/50 transition-colors"
          aria-label={`Delete ${region.name}`}
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      ) : (
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="p-2 rounded-full text-cyan-400 hover:bg-cyan-900/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          aria-label={`Download ${region.name}`}
        >
          {isDownloading ? (
            <div className="w-6 h-6 border-2 border-gray-500 border-t-cyan-400 rounded-full animate-spin"></div>
          ) : (
            <DownloadIcon className="h-6 w-6" />
          )}
        </button>
      )}
    </li>
  );
};

export const OfflineManagerPage: React.FC = () => {
  const { allRegions, downloadedRegionIds, downloadRegion, deleteRegion, storageUsage } = useOfflineMaps();

  return (
    <div className="h-full bg-gray-900 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-2 text-cyan-400">Offline Maps</h1>
      <p className="text-gray-400 mb-6">Download regions to use the app without an internet connection.</p>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-300">Storage Used</span>
              <span className="font-semibold text-white">{storageUsage.toFixed(1)} MB / 5000.0 MB</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-cyan-500 h-2.5 rounded-full" style={{width: `${(storageUsage / 5000) * 100}%`}}></div>
          </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-3">
          {allRegions.map(region => (
            <RegionItem
              key={region.id}
              region={region}
              isDownloaded={downloadedRegionIds.includes(region.id)}
              onDownload={downloadRegion}
              onDelete={deleteRegion}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
