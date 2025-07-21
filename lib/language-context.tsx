"use client"

import { createContext, useContext, type ReactNode } from "react"
import { es } from "@/languages/es"
import { en } from "@/languages/en"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  t: (key: string) => string
}

const translations = { es, en }

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children, initialLanguage }: { children: ReactNode, initialLanguage: Language }) {
  const t = (key: string): string => {
    const value = translations[initialLanguage][key as keyof typeof es];
    return typeof value === 'string' ? value : key;
  }

  return (
    <LanguageContext.Provider value={{ 
      language: initialLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
