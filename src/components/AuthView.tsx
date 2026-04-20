import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'

export default function AuthView() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signUp, signInWithGoogle, isLoading, error, clearError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') await signIn(email, password)
    else await signUp(email, password)
  }

  const toggleMode = () => {
    clearError()
    setMode((m) => (m === 'login' ? 'register' : 'login'))
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-violet-500 rounded-2xl flex items-center justify-center text-base font-black mx-auto mb-4">
            SW
          </div>
          <h1 className="text-xl font-bold text-white">Simple Workout</h1>
          <p className="text-gray-400 text-sm mt-1">{t('auth.tagline')}</p>
        </div>

        <div className="space-y-3">
          {/* Google Login */}
          <button
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t('auth.signInGoogle')}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs">{t('auth.or')}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* E-Mail Login */}
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-5 space-y-3 border border-white/5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {mode === 'login' ? t('auth.signInEmail') : t('auth.createAccount')}
            </h2>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email')}
              required
              className="w-full bg-gray-800 text-white text-sm rounded-xl px-4 py-3 border border-white/5 outline-none focus:border-violet-500 transition-colors placeholder-gray-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.password')}
              required
              minLength={6}
              className="w-full bg-gray-800 text-white text-sm rounded-xl px-4 py-3 border border-white/5 outline-none focus:border-violet-500 transition-colors placeholder-gray-500"
            />

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-500 hover:bg-violet-400 text-white text-sm font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('auth.loading') : mode === 'login' ? t('auth.signIn') : t('auth.register')}
            </button>
          </form>

          <button
            onClick={toggleMode}
            className="w-full text-center text-gray-500 text-xs hover:text-gray-300 transition-colors py-2"
          >
            {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}
          </button>
        </div>
      </div>
    </div>
  )
}
