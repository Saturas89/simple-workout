import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Platform = 'ios' | 'android' | 'other'

function getPlatform(): Platform {
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

export default function InstallPrompt() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState<Platform>('other')
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Already installed as PWA — don't show
    if (isStandalone()) return
    // Already dismissed by user
    if (localStorage.getItem('install-dismissed') === '1') return

    const p = getPlatform()
    setPlatform(p)

    if (p === 'android') {
      // Intercept Chrome install prompt
      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShow(true)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }

    if (p === 'ios') {
      // iOS Safari has no programmatic prompt — show manual instructions
      // Only show after 2 visits to avoid being annoying on first open
      const visits = parseInt(localStorage.getItem('visit-count') || '0') + 1
      localStorage.setItem('visit-count', String(visits))
      if (visits >= 2) setShow(true)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShow(false)
        setDeferredPrompt(null)
      }
    }
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('install-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-sm mx-auto">
      <div className="bg-app-card border border-app-border/10 rounded-2xl p-4 shadow-2xl shadow-black/30">
        <div className="flex items-start gap-3">
          {/* App icon */}
          <div className="w-12 h-12 rounded-xl bg-app-primary flex items-center justify-center shrink-0 shadow-md shadow-app-primary/30">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none">
              {/* Dumbbell */}
              <rect x="8" y="11" width="8" height="2.5" rx="0.5" fill="white" />
              <rect x="5" y="8.5" width="2.5" height="7" rx="0.8" fill="white" />
              <rect x="16.5" y="8.5" width="2.5" height="7" rx="0.8" fill="white" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-app-text">{t('install.title')}</p>

            {platform === 'android' && (
              <p className="text-xs text-app-text-2 mt-0.5 leading-relaxed">
                {t('install.androidDesc')}
              </p>
            )}

            {platform === 'ios' && (
              <p className="text-xs text-app-text-2 mt-0.5 leading-relaxed">
                Tap{' '}
                <span className="inline-flex items-center gap-0.5 font-semibold text-app-text">
                  <ShareIcon />
                </span>{' '}
                and then{' '}
                <span className="font-semibold text-app-text">{t('install.iosHomeScreen')}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 text-app-text-3 hover:text-app-text-2 transition-colors shrink-0"
            aria-label={t('install.close')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {platform === 'android' && deferredPrompt && (
          <button
            onClick={handleInstall}
            className="mt-3 w-full bg-app-primary text-white text-xs font-bold py-2.5 rounded-xl hover:bg-app-primary/90 transition-colors"
          >
            {t('install.install')}
          </button>
        )}
      </div>
    </div>
  )
}

function ShareIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}
