"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { IntlProvider } from "react-intl"
import enMessages from "@/locales/en.json"
import esMessages from "@/locales/es.json"

type Locale = "en" | "es"
type Messages = Record<string, Record<string, string>>

const messages: Messages = {
  en: enMessages,
  es: esMessages,
}

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  useEffect(() => {
    // Detectar idioma del navegador
    const browserLang = navigator.language.split("-")[0]
    if (browserLang === "es") {
      setLocale("es")
    }

    // O recuperar de localStorage
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
      setLocale(savedLocale)
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
