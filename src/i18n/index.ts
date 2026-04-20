import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from './de'
import en from './en'

const savedLng = typeof window !== 'undefined' ? localStorage.getItem('i18n-language') : null
const browserLng =
  typeof window !== 'undefined' && navigator.language.startsWith('de') ? 'de' : 'en'

i18next.use(initReactI18next).init({
  lng: savedLng ?? browserLng,
  fallbackLng: 'en',
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  interpolation: { escapeValue: false },
})

i18next.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18n-language', lng)
  }
})

export default i18next
