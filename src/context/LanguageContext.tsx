
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  // Simple translation function
  const t = (key: string): string => {
    const translations: Record<Language, Record<string, string>> = {
      en: {
        'home': 'Home',
        'experiences': 'Experiences',
        'about': 'About',
        'contact': 'Contact',
        'login': 'Login',
        'admin': 'Admin',
        'create': 'Create',
        'edit': 'Edit',
        'delete': 'Delete',
        'save': 'Save',
        'cancel': 'Cancel',
        'title': 'Title',
        'description': 'Description',
        'content': 'Content',
        'viewMore': 'View More',
        'bookNow': 'Book Now',
        'discover': 'Discover Amazing Experiences',
        'discoverSubtitle': 'Explore our curated selection of unforgettable adventures',
        'featuredExperiences': 'Featured Experiences',
        'englishTab': 'English',
        'italianTab': 'Italian',
        'basicInfo': 'Basic Information',
        'details': 'Details',
        'publish': 'Publish',
        'draft': 'Save as Draft',
        'manageExperiences': 'Manage Experiences',
        'createExperience': 'Create Experience',
        'editExperience': 'Edit Experience',
      },
      it: {
        'home': 'Home',
        'experiences': 'Esperienze',
        'about': 'Chi Siamo',
        'contact': 'Contatti',
        'login': 'Accedi',
        'admin': 'Amministrazione',
        'create': 'Crea',
        'edit': 'Modifica',
        'delete': 'Elimina',
        'save': 'Salva',
        'cancel': 'Annulla',
        'title': 'Titolo',
        'description': 'Descrizione',
        'content': 'Contenuto',
        'viewMore': 'Vedi di Più',
        'bookNow': 'Prenota Ora',
        'discover': 'Scopri Esperienze Straordinarie',
        'discoverSubtitle': 'Esplora la nostra selezione curata di avventure indimenticabili',
        'featuredExperiences': 'Esperienze in Evidenza',
        'englishTab': 'Inglese',
        'italianTab': 'Italiano',
        'basicInfo': 'Informazioni di Base',
        'details': 'Dettagli',
        'publish': 'Pubblica',
        'draft': 'Salva come Bozza',
        'manageExperiences': 'Gestisci Esperienze',
        'createExperience': 'Crea Esperienza',
        'editExperience': 'Modifica Esperienza',
      },
    };

    return translations[language][key] || key;
  };

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
