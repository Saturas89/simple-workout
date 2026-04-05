import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { THEMES, Theme } from '@/types/theme'

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { theme, profile, setTheme, updateProfile } = useThemeStore()
  const { user, signOut } = useAuthStore()
  const [name, setName] = useState(profile.name || user?.email?.split('@')[0] || '')

  useEffect(() => {
    setName(profile.name || user?.email?.split('@')[0] || '')
  }, [profile.name, user])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  const handleNameChange = () => {
    if (name.trim()) {
      updateProfile({ name: name.trim() })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameChange()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-app-card w-full md:w-96 rounded-t-2xl md:rounded-lg shadow-xl max-h-[90vh] overflow-y-auto border border-white/5">
        {/* Header */}
        <div className="sticky top-0 bg-app-card border-b border-app-border/5 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-app-text">⚙️ Einstellungen</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-app-border/5 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-app-text-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-8">
          {/* Profile Section */}
          <section>
            <h3 className="text-lg font-bold text-app-text mb-4">👤 Profil</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-app-text-2 block mb-2">Dein Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleNameChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Dein Name eingeben..."
                  className="w-full px-4 py-2 border border-app-border/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-primary text-app-text bg-app-inner"
                />
              </label>
              <p className="text-xs text-app-text-3">Email: {user?.email}</p>
            </div>
          </section>

          {/* Theme Selection */}
          <section>
            <h3 className="text-lg font-bold text-app-text mb-4">🎨 Design</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(THEMES).map(([themeKey, themeConfig]) => (
                <button
                  key={themeKey}
                  onClick={() => handleThemeChange(themeKey as Theme)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === themeKey
                      ? `border-app-primary bg-app-primary/10 shadow-lg scale-105`
                      : `border-app-border/10 hover:border-app-border/20`
                  }`}
                >
                  <div className="text-4xl mb-2">{themeConfig.icon}</div>
                  <div className="font-bold text-app-text text-sm">{themeConfig.label}</div>
                  {theme === themeKey && (
                    <div className="text-xs text-app-primary mt-1">✓ Aktiv</div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Storage Info */}
          <section className="border-t border-white/5 pt-6">
            <h3 className="text-sm font-medium text-app-text-3">
              ℹ️ Deine Einstellungen werden automatisch lokal gespeichert.
            </h3>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-app-card border-t border-app-border/5 px-6 py-4 space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-app-primary text-white py-3 rounded-lg font-bold hover:bg-app-primary/90 transition-colors"
          >
            Fertig ✓
          </button>
          <button
            onClick={signOut}
            className="w-full bg-red-600/20 text-red-400 py-3 rounded-lg font-bold hover:bg-red-600/30 transition-colors"
          >
            Abmelden
          </button>
        </div>
      </div>
    </div>
  )
}
