"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Add missing translations for the enhanced pages

const translations = {
  es: {
    // Header
    "nav.home": "Inicio",
    "nav.about": "Sobre Nosotros",
    "nav.contact": "Contacto",

    // Home page
    "home.title": "Easiful",
    "home.subtitle": "Organiza tu vida. Recupera tu tiempo.",
    "home.download": "Descargar ahora",
    "home.features.title": "Todo lo que necesitas para una vida organizada",
    "home.features.home": "Organización del hogar",
    "home.features.home.desc": "Mantén tu casa ordenada con listas inteligentes y recordatorios.",
    "home.features.travel": "Planificación de viajes",
    "home.features.travel.desc": "Prepara tus maletas y planifica cada detalle sin estrés.",
    "home.features.expenses": "Control de gastos",
    "home.features.expenses.desc": "Gestiona tus finanzas y gastos compartidos fácilmente.",
    "home.features.gamification": "Gamificación",
    "home.features.gamification.desc": "Convierte tus tareas en logros y mantente motivado.",
    "home.features.peace": "Tranquilidad mental",
    "home.features.peace.desc": "Reduce el estrés y encuentra paz en tu rutina diaria.",
    "home.uses.title": "Casos de uso reales",
    "home.uses.luggage": "Prepara maletas sin olvidar nada",
    "home.uses.expenses": "Gestiona gastos compartidos",
    "home.uses.planning": "Planifica tu semana en 5 minutos",
    "home.uses.home": "Mantén tu casa organizada sin estrés",

    // About page
    "about.title": "Sobre Easiful",
    "about.subtitle": "Nuestra misión es devolverte el tiempo y la tranquilidad",
    "about.content1":
      "En un mundo cada vez más acelerado, creemos que la organización no debería ser una fuente de estrés, sino de paz mental. Easiful nació de la necesidad de simplificar la vida diaria y recuperar esos momentos preciosos que se pierden en el caos cotidiano.",
    "about.content2":
      "Nuestra filosofía se basa en la idea de que una vida organizada es una vida más plena. No se trata solo de hacer listas o recordar tareas, sino de crear un espacio mental donde puedas respirar, reflexionar y disfrutar de lo que realmente importa.",
    "about.content3":
      "Con Easiful, transformamos la organización en una experiencia serena y motivadora. Cada función está diseñada para reducir la ansiedad, aumentar la productividad y, sobre todo, devolverte el control sobre tu tiempo y tu vida.",

    // Contact page
    "contact.title": "Contacto",
    "contact.subtitle": "Nos encantaría escucharte",
    "contact.name": "Nombre",
    "contact.email": "Email",
    "contact.message": "Mensaje",
    "contact.send": "Enviar mensaje",
    "contact.success": "¡Mensaje enviado con éxito!",
    "nav.login": "Acceder",

    // Footer
    "footer.rights": "Todos los derechos reservados.",
  },
  en: {
    // Header
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.contact": "Contact",

    // Home page
    "home.title": "Easiful",
    "home.subtitle": "Organize your life. Reclaim your time.",
    "home.download": "Download now",
    "home.features.title": "Everything you need for an organized life",
    "home.features.home": "Home organization",
    "home.features.home.desc": "Keep your house tidy with smart lists and reminders.",
    "home.features.travel": "Travel planning",
    "home.features.travel.desc": "Pack your bags and plan every detail stress-free.",
    "home.features.expenses": "Expense control",
    "home.features.expenses.desc": "Manage your finances and shared expenses easily.",
    "home.features.gamification": "Gamification",
    "home.features.gamification.desc": "Turn your tasks into achievements and stay motivated.",
    "home.features.peace": "Peace of mind",
    "home.features.peace.desc": "Reduce stress and find peace in your daily routine.",
    "home.uses.title": "Real use cases",
    "home.uses.luggage": "Pack luggage without forgetting anything",
    "home.uses.expenses": "Manage shared expenses",
    "home.uses.planning": "Plan your week in 5 minutes",
    "home.uses.home": "Keep your house organized stress-free",

    // About page
    "about.title": "About Easiful",
    "about.subtitle": "Our mission is to give you back time and tranquility",
    "about.content1":
      "In an increasingly fast-paced world, we believe that organization shouldn't be a source of stress, but of peace of mind. Easiful was born from the need to simplify daily life and recover those precious moments that are lost in everyday chaos.",
    "about.content2":
      "Our philosophy is based on the idea that an organized life is a fuller life. It's not just about making lists or remembering tasks, but about creating a mental space where you can breathe, reflect, and enjoy what really matters.",
    "about.content3":
      "With Easiful, we transform organization into a serene and motivating experience. Every feature is designed to reduce anxiety, increase productivity, and above all, give you back control over your time and your life.",

    // Contact page
    "contact.title": "Contact",
    "contact.subtitle": "We'd love to hear from you",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.send": "Send message",
    "contact.success": "Message sent successfully!",
    "nav.login": "Login",

    // Footer
    "footer.rights": "All rights reserved.",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children, initialLanguage }: { children: ReactNode, initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage)

  const t = (key: string): string => {
    if (!language || !translations[language]) return key;
    return translations[language][key as keyof (typeof translations)["es"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
