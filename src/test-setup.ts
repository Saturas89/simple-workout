import i18next from 'i18next'
import de from '@/i18n/de'

i18next.init({
  lng: 'de',
  fallbackLng: 'de',
  initImmediate: false,
  resources: { de: { translation: de } },
  interpolation: { escapeValue: false },
})
