
import React, { useState } from 'react';
import { useSavedPlaces } from '../hooks/useSavedPlaces';
import type { SavedPlace } from '../types';
import { PencilIcon, TrashIcon, SaveIcon, XIcon, BookmarkIcon } from './Icons';

const PlaceItem: React.FC<{
  place: SavedPlace;
  onUpdate: (id: string, updates: Partial<SavedPlace>) => void;
  onDelete: (id: string) => void;
}> = ({ place, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: place.name, notes: place.notes || '' });

  const handleSave = () => {
    if (!editData.name.trim()) {
        // Optionally show an error
        return;
    }
    onUpdate(place.id, { name: editData.name, notes: editData.notes });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
      setEditData({ name: place.name, notes: place.notes || '' });
      setIsEditing(false);
  }

  return (
    <li className="bg-gray-800 rounded-lg p-4 space-y-2 transition-shadow hover:shadow-cyan-500/10">
        {isEditing ? (
            <div className="space-y-3">
                <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full text-lg font-bold px-2 py-1 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                 <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={2}
                    className="w-full text-sm px-2 py-1 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Add notes..."
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={handleCancel} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 transition-colors"><XIcon className="h-5 w-5"/></button>
                    <button onClick={handleSave} className="p-2 rounded-full text-cyan-400 hover:bg-cyan-900/50 transition-colors"><SaveIcon className="h-5 w-5"/></button>
                </div>
            </div>
        ) : (
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-white">{place.name}</h3>
                    <div className="flex space-x-2">
                        <button onClick={() => setIsEditing(true)} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 transition-colors" aria-label={`Edit ${place.name}`}><PencilIcon className="h-5 w-5"/></button>
                        <button onClick={() => onDelete(place.id)} className="p-2 rounded-full text-red-400 hover:bg-red-900/50 transition-colors" aria-label={`Delete ${place.name}`}><TrashIcon className="h-5 w-5"/></button>
                    </div>
                </div>
                {place.notes && <p className="text-gray-400 text-sm">{place.notes}</p>}
                <p className="text-xs text-gray-500 font-mono mt-2">
                    {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
                </p>
            </div>
        )}
    </li>
  );
};


export const SavedPlacesPage: React.FC = () => {
    const { savedPlaces, updatePlace, deletePlace } = useSavedPlaces();

    return (
        <div className="h-full bg-gray-900 p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-2 text-cyan-400">Saved Places</h1>
            <p className="text-gray-400 mb-6">Your bookmarked locations for quick access.</p>

            {savedPlaces.length > 0 ? (
                <div className="flex-grow overflow-y-auto">
                    <ul className="space-y-3">
                        {savedPlaces.map(place => (
                            <PlaceItem 
                                key={place.id}
                                place={place}
                                onUpdate={updatePlace}
                                onDelete={deletePlace}
                            />
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
                    <BookmarkIcon className="h-16 w-16 mb-4"/>
                    <h2 className="text-xl font-semibold">No Saved Places Yet</h2>
                    <p className="max-w-xs mt-1">Go to the map and tap the bookmark icon to save your current location.</p>
                </div>
            )}
        </div>
    );
};
