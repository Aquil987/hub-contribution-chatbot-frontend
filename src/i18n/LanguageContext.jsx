import { useEffect, useMemo, useState } from 'react'

import { LanguageContext } from './contextStore'
import { DEFAULT_LOCALE, SUPPORTED_LANGUAGES, translations } from './translations'

const STORAGE_KEY = 'softage-chat-locale'
const supportedLocales = new Set(SUPPORTED_LANGUAGES.map(({ locale }) => locale))

const getSavedLocale = () => {
  try {
    const savedLocale = window.localStorage.getItem(STORAGE_KEY)
    return supportedLocales.has(savedLocale) ? savedLocale : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(getSavedLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // The UI remains usable when storage is blocked by the browser.
    }
  }, [locale])

  const value = useMemo(
    () => ({ locale, setLocale, languages: SUPPORTED_LANGUAGES, text: translations[locale] }),
    [locale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
