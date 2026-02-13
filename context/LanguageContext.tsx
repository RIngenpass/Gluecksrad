import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

export type Language = 'DE' | 'EN' | 'TH';

type ContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export const LanguageContext = createContext<ContextType>({
  language: 'DE',
  setLanguage: () => {},
});

const STORAGE_KEY = 'APP_LANGUAGE';

export const LanguageProvider = ({ children }: any) => {
  const [language, setLang] = useState<Language>('DE');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (!saved) return;

      const normalized = saved.toUpperCase();

      if (
        normalized === 'DE' ||
        normalized === 'EN' ||
        normalized === 'TH'
      ) {
        setLang(normalized as Language);
      } else {
        setLang('DE');
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    const normalized = lang.toUpperCase() as Language;
    setLang(normalized);
    AsyncStorage.setItem(STORAGE_KEY, normalized);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
