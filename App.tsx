import React, { useState, useEffect, useCallback } from 'react';
import { LoginPage } from './components/LoginPage';
import { MapPage } from './components/MapPage';
import { OfflineManagerPage } from './components/OfflineManagerPage';
import { ProfilePage } from './components/ProfilePage';
import { SavedPlacesPage } from './components/SavedPlacesPage';
import { MapIcon, DownloadIcon, UserIcon, BookmarkIcon } from './components/Icons';
import type { User } from './types';
import { View } from './types';


const BottomNavBar: React.FC<{
  activeView: View;
  onNavigate: (view: View) => void;
}> = ({ activeView, onNavigate }) => {
  const navItems = [
    { view: View.MAP, icon: MapIcon, label: 'Map' },
    { view: View.SAVED_PLACES, icon: BookmarkIcon, label: 'Saved' },
    { view: View.OFFLINE, icon: DownloadIcon, label: 'Offline' },
    { view: View.PROFILE, icon: UserIcon, label: 'Profile' },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-gray-800/70 border-t border-gray-700 backdrop-blur-sm shadow-lg">
      <div className="max-w-md mx-auto flex justify-around p-2">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-all duration-200 ${
                isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <item.icon className={`h-6 w-6 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);

  useEffect(() => {
    // Check for persisted user session
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      handleLogin(savedEmail);
    }
  }, []);

  const handleLogin = useCallback((email: string) => {
    const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const newUser: User = {
      email,
      name,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
    setUser(newUser);
    setCurrentView(View.MAP);
    localStorage.setItem('userEmail', email);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentView(View.LOGIN);
    localStorage.removeItem('userEmail');
  }, []);

  const renderContent = () => {
    if (!user) {
      return <LoginPage onLogin={handleLogin} />;
    }

    const PADDING_BOTTOM = '80px';

    // Main app UI container
    return (
      <div className="h-screen w-screen flex flex-col bg-gray-900">
        <main className="flex-grow h-full overflow-hidden" style={{ paddingBottom: PADDING_BOTTOM }}>
          {currentView === View.MAP && <MapPage onNavigate={setCurrentView} />}
          {currentView === View.OFFLINE && <OfflineManagerPage />}
          {currentView === View.PROFILE && <ProfilePage user={user} onLogout={handleLogout} />}
          {currentView === View.SAVED_PLACES && <SavedPlacesPage />}
        </main>
        <BottomNavBar activeView={currentView} onNavigate={setCurrentView} />
      </div>
    );
  };
  
  return <div className="h-screen w-screen">{renderContent()}</div>;
};

export default App;