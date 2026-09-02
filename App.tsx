import React, { useState } from 'react';
import { LocalizationProvider, useLocalization } from './context/LocalizationContext';
import HomeScreen from './components/screens/HomeScreen';
import SearchScreen from './components/screens/SearchScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import JournalScreen from './components/screens/JournalScreen';
import MethodDetailScreen from './components/screens/MethodDetailScreen';
import { BrewingMethod } from './types';
import { BREWING_METHODS } from './constants';
import { BookOpen } from 'lucide-react';

type View = 'home' | 'search' | 'journal' | 'profile';

const AppLogo: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 109.27 162.26" fill="currentColor">
        <g>
            <path d="M85.74,16.47c17.77,14.87,28.61,42.13,21.13,64.83-1.11,3.38-3.7,9.51-7.34,9.72-6.01.35-19.78-12.26-23.92-16.95-15.06-17.04-15.71-37.48-34.88-54.6-2.67-2.38-14.31-9.79-14.67-11.94C24.9.45,37.57.08,42.58,0c16.1-.25,31,6.28,43.16,16.46Z"/>
            <path d="M75.81,148.36c3.96,7.25-2.47,16.09-10.42,13.4-1.53-.52-2.91-1.46-3.28-4.18-.82-6,.19-12.59,7.52-12.64,2.88-.02,5.34,1.89,6.18,3.42Z"/>
            <path d="M31.66,142.53c-4.86-4.94-1.22-13.79,5.99-13.57,13.18.4,5.48,25.23-5.99,13.57Z"/>
        </g>
        <path d="M8.67,66.53c9.5,8.89,17.72,8.92,20.77,17.08,1.52,4.06,3.08,14.27.67,20.96-2.38,6.59-2.6,17.57,8.53,16.57,7.77-.69,3.98-11.58,10.49-14.57,5.05-2.32,11.99,1.83,12.94,7.03,1.17,6.43-3.46,23.65,6.62,24.48,10.93.9,6.33-19.65,7.86-26.1,1.32-5.57,8.61-7.22,8.57-10.41-.05-3.5-14.05-12.81-17.51-16.51-19.64-20.96-19.66-50.08-48.6-65.4-6.3-3.34-9.74-4.58-13.28,2.49-5.42,10.82-10.78,31.53,2.94,44.37Z"/>
    </svg>
);

const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <MainApp />
    </LocalizationProvider>
  );
};

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedMethod, setSelectedMethod] = useState<BrewingMethod | null>(null);
  const { t, language } = useLocalization();

  const handleSelectMethod = (methodId: string) => {
    const method = BREWING_METHODS.find(m => m.id === methodId);
    if (method) {
      setSelectedMethod(method);
    }
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  const renderContent = () => {
    if (selectedMethod) {
      return <MethodDetailScreen method={selectedMethod} onBack={handleBack} />;
    }
    switch (currentView) {
      case 'home':
        return <HomeScreen onSelectMethod={handleSelectMethod} />;
      case 'search':
        return <SearchScreen onSelectMethod={handleSelectMethod} />;
      case 'journal':
        return <JournalScreen onNavigateHome={() => setCurrentView('home')} />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onSelectMethod={handleSelectMethod} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto shadow-2xl shadow-[var(--shadow-color)]">
      <header className="p-4 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-color)]/80 backdrop-blur-sm z-10 flex flex-col items-center">
        <div className="w-8 h-8 mb-1">
            <AppLogo className="w-full h-full text-[var(--primary-color)]" />
        </div>
        <h1 className="text-2xl font-display text-center text-[var(--heading-color)] whitespace-nowrap">
          {selectedMethod ? selectedMethod[`name_${language}`] : t('appName')}
        </h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto bg-[var(--bg-color)]">
        {renderContent()}
      </main>

      {!selectedMethod && (
        <nav className="sticky bottom-0 bg-[var(--bg-color)]/80 backdrop-blur-sm border-t border-[var(--border-color)] grid grid-cols-4 gap-1 p-2">
          <NavButton icon={HomeIcon} label={t('home')} isActive={currentView === 'home'} onClick={() => setCurrentView('home')} />
          <NavButton icon={SearchIcon} label={t('search')} isActive={currentView === 'search'} onClick={() => setCurrentView('search')} />
          <NavButton icon={JournalIcon} label={t('journal')} isActive={currentView === 'journal'} onClick={() => setCurrentView('journal')} />
          <NavButton icon={ProfileIcon} label={t('settings')} isActive={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
        </nav>
      )}
    </div>
  );
};

interface NavButtonProps {
    icon: React.FC<{className: string}>;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-[var(--border-color)] ${isActive ? 'text-[var(--primary-color)]' : 'text-gray-400'}`}
    >
        <Icon className="w-5 h-5 mb-1" />
        <span className="text-[11px] font-medium truncate">{label}</span>
    </button>
);

const HomeIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const SearchIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const JournalIcon: React.FC<{className: string}> = ({className}) => (
    <BookOpen className={className} />
);

const ProfileIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default App;
