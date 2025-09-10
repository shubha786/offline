import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSavedPlaces } from '../hooks/useSavedPlaces';
import { AlertTriangleIcon, BookmarkIcon, PencilIcon, TrashIcon, XIcon } from './Icons';
import { type SavedPlace, View } from '../types';

interface MapPageProps {
    onNavigate: (view: View) => void;
}

const InfoWindow: React.FC<{
    place: SavedPlace;
    onClose: () => void;
    onInitiateDelete: (place: SavedPlace) => void;
    onNavigate: (view: View) => void;
}> = ({ place, onClose, onInitiateDelete, onNavigate }) => {
    
    const handleNavigate = () => {
        onNavigate(View.SAVED_PLACES);
    };

    return (
        <div 
            className="absolute z-20 w-64 bg-gray-800/70 backdrop-blur-md rounded-lg shadow-xl text-white p-3 ring-1 ring-white/10"
            onClick={e => e.stopPropagation()} // Prevent map click from closing it
        >
            {/* Arrow */}
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-gray-800/70 rotate-45 ring-1 ring-white/10"></div>
            
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-cyan-400 break-words pr-2">{place.name}</h3>
                <button onClick={onClose} className="p-1 -mt-1 -mr-1 rounded-full hover:bg-gray-700 transition-colors">
                    <XIcon className="h-4 w-4 text-gray-400" />
                </button>
            </div>
            {place.notes && <p className="text-sm text-gray-300 mt-1 max-h-20 overflow-y-auto">{place.notes}</p>}
            <div className="border-t border-gray-700 my-2"></div>
            <div className="flex justify-end space-x-2">
                 <button 
                    onClick={handleNavigate}
                    className="flex items-center space-x-2 text-xs bg-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-600 transition-colors"
                >
                    <PencilIcon className="h-3 w-3" />
                    <span>Details</span>
                </button>
                <button 
                    onClick={() => onInitiateDelete(place)}
                    className="flex items-center space-x-2 text-xs bg-red-900/70 text-red-300 px-3 py-1.5 rounded-md hover:bg-red-900 transition-colors"
                >
                    <TrashIcon className="h-3 w-3" />
                    <span>Remove</span>
                </button>
            </div>
        </div>
    );
};

const ConfirmationModal: React.FC<{
    placeName: string;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ placeName, onConfirm, onCancel }) => (
    <div className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-gray-800 rounded-xl shadow-lg p-6 ring-1 ring-white/10">
            <div className="flex items-start space-x-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
                        Delete Place
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-400">
                            Are you sure you want to delete <span className="font-bold text-gray-300">"{placeName}"</span>? This action cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 sm:w-auto sm:text-sm transition-colors"
                    onClick={onConfirm}
                >
                    Delete
                </button>
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-800 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);


export const MapPage: React.FC<MapPageProps> = ({ onNavigate }) => {
  const { coordinates, error, isLoading } = useGeolocation();
  const { addPlace, savedPlaces, deletePlace } = useSavedPlaces();
  const [showToast, setShowToast] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [placeToConfirmDelete, setPlaceToConfirmDelete] = useState<SavedPlace | null>(null);

  const handleSavePlace = () => {
    if (coordinates) {
      addPlace({
        name: `Location @ ${new Date().toLocaleTimeString()}`,
        coordinates: coordinates,
        notes: 'Saved from map view.'
      });
      setShowToast(true);
    }
  };
  
  const handleConfirmDelete = () => {
      if (placeToConfirmDelete) {
          deletePlace(placeToConfirmDelete.id);
          setSelectedPlaceId(null);
          setPlaceToConfirmDelete(null);
      }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const renderMapContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><div className="text-center text-gray-400">Fetching your location...</div></div>;
    }

    if (error) {
      return <div className="flex items-center justify-center h-full"><div className="text-center text-red-400 p-4 bg-red-900/50 rounded-lg"><strong>Error:</strong> {error.message}</div></div>;
    }

    if (coordinates) {
      // Very simple scaling for saved places around the current location.
      const latScale = 500; // pixels per degree latitude
      const lngScale = 500; // pixels per degree longitude
      
      const selectedPlace = savedPlaces.find(p => p.id === selectedPlaceId);

      return (
        <div 
            className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
            onClick={() => setSelectedPlaceId(null)} // Close info window on map click
        >
          {/* Mock Map Background using a CSS gradient and a subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
          <style>{`.bg-map-pattern { background-image: radial-gradient(#4a5568 1px, transparent 1px); background-size: 15px 15px; }`}</style>
          <div className="absolute inset-0 bg-map-pattern opacity-20"></div>

          {/* User Location Marker (center of the map) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" title="Your Location">
             <div className="w-8 h-8 bg-cyan-500/20 rounded-full animate-ping"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow-lg"></div>
          </div>
          
          {/* Saved Places Markers */}
          {savedPlaces.map(place => {
            const latDiff = place.coordinates.lat - coordinates.lat;
            const lngDiff = place.coordinates.lng - coordinates.lng;

            const topOffset = -latDiff * latScale;
            const leftOffset = lngDiff * lngScale;

            const isSelected = place.id === selectedPlaceId;

            return (
              <button 
                   key={place.id} 
                   onClick={(e) => {
                       e.stopPropagation();
                       setSelectedPlaceId(place.id);
                   }}
                   className={`absolute top-1/2 left-1/2 text-yellow-400 transition-transform duration-500 z-10 ${isSelected ? 'scale-125 text-cyan-400' : 'hover:scale-110'}`}
                   style={{ 
                      transform: `translate(calc(-50% + ${leftOffset}px), calc(-50% + ${topOffset}px))`
                   }}
                   title={place.name}
              >
                <BookmarkIcon className="w-6 h-6 fill-current drop-shadow-lg" />
              </button>
            );
          })}

          {/* Info Window */}
          {selectedPlace && (() => {
               const latDiff = selectedPlace.coordinates.lat - coordinates.lat;
               const lngDiff = selectedPlace.coordinates.lng - coordinates.lng;
               const topOffset = -latDiff * latScale;
               const leftOffset = lngDiff * lngScale;
               return (
                   <div 
                       className="absolute top-1/2 left-1/2 transition-all duration-300 ease-in-out"
                       style={{
                           transform: `translate(calc(-50% + ${leftOffset}px), calc(-50% + ${topOffset}px - 40px))`
                       }}
                   >
                        <InfoWindow 
                            place={selectedPlace} 
                            onClose={() => setSelectedPlaceId(null)}
                            onInitiateDelete={setPlaceToConfirmDelete}
                            onNavigate={onNavigate}
                        />
                   </div>
               )
          })()}

        </div>
      );
    }

    return <div className="flex items-center justify-center h-full"><div className="text-center text-gray-400">Could not determine your location. Please enable location services.</div></div>;
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex justify-between items-center flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Map View</h1>
        <button
          onClick={handleSavePlace}
          disabled={!coordinates || isLoading}
          className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
        >
          <BookmarkIcon className="h-5 w-5" />
          <span>Save Location</span>
        </button>
      </div>

      <div className="flex-grow relative">
        {renderMapContent()}
        {placeToConfirmDelete && (
            <ConfirmationModal
                placeName={placeToConfirmDelete.name}
                onConfirm={handleConfirmDelete}
                onCancel={() => setPlaceToConfirmDelete(null)}
            />
        )}
        {coordinates && (
            <div className="absolute bottom-2 left-2 bg-gray-900/70 text-white text-xs p-2 rounded-md font-mono backdrop-blur-sm z-20">
                Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
            </div>
        )}
      </div>

      {showToast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce z-30">
          Location Saved!
        </div>
      )}
    </div>
  );
};