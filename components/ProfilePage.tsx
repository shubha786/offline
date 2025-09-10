import React from 'react';
import type { User } from '../types';
import { LogOutIcon } from './Icons';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  return (
    <div className="h-full bg-gray-900 p-4 flex flex-col text-white">
      <h1 className="text-2xl font-bold mb-8 text-cyan-400">Profile</h1>
      
      <div className="flex flex-col items-center space-y-4 flex-grow justify-center">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-32 h-32 rounded-full ring-4 ring-cyan-500/50 shadow-lg"
        />
        <h2 className="text-3xl font-bold">{user.name}</h2>
        <p className="text-gray-400">{user.email}</p>
      </div>

      <div className="w-full max-w-md mx-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-900/70 text-red-300 px-4 py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors"
        >
          <LogOutIcon className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
