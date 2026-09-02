
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Language } from '../types';
import { translations } from '../localization';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations): string => {
    return translations[key][language];
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
