import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function AuthView() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signUp, isLoading, error, clearError } = useAuthStore()

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
          <p className="text-gray-400 text-sm mt-1">Dein Training, dein Fortschritt</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-6 space-y-3 border border-white/5">
          <h2 className="text-sm font-semibold text-white mb-4">
            {mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
          </h2>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail"
            required
            className="w-full bg-gray-800 text-white text-sm rounded-xl px-4 py-3 border border-white/5 outline-none focus:border-violet-500 transition-colors placeholder-gray-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort (min. 6 Zeichen)"
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
            className="w-full bg-violet-500 hover:bg-violet-400 text-white text-sm font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Laden…' : mode === 'login' ? 'Anmelden' : 'Registrieren'}
          </button>
        </form>

        <button
          onClick={toggleMode}
          className="w-full text-center text-gray-500 text-xs mt-4 hover:text-gray-300 transition-colors py-2"
        >
          {mode === 'login' ? 'Noch kein Konto? Registrieren' : 'Bereits ein Konto? Anmelden'}
        </button>
      </div>
    </div>
  )
}
