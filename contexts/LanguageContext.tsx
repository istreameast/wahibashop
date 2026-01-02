import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, CATEGORY_TRANSLATIONS } from '../constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['fr']) => string;
  tCategory: (cat: string) => string;
  isRTL: boolean;
  formatNumber: (num: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('ls_lang');
    if (stored === 'ar' || stored === 'fr') setLanguage(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('ls_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: keyof typeof TRANSLATIONS['fr']) => {
    return TRANSLATIONS[language][key] || key;
  };

  const tCategory = (cat: string) => {
    if (CATEGORY_TRANSLATIONS[cat]) {
      return CATEGORY_TRANSLATIONS[cat][language];
    }
    return cat;
  };

  // Force Latin digits even in Arabic
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      tCategory,
      isRTL: language === 'ar',
      formatNumber
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};