'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Language, type T } from './translations'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: T
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'pt',
  setLanguage: () => {},
  t: translations.pt,
})

const STORAGE_KEY = 'rp_ui_language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'pt'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'pt' || stored === 'en' || stored === 'es') return stored
  return 'pt'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt')

  // Hydrate from localStorage after mount
  useEffect(() => {
    setLanguageState(getInitialLanguage())
  }, [])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  return useContext(LanguageContext)
}
