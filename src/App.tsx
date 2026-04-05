import { useEffect, useState } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { useAuthStore } from '@/store/authStore'
import DashboardView from '@/components/DashboardView'
import MuscleGroupSelector from '@/components/MuscleGroupSelector'
import AnalyticsView from '@/components/AnalyticsView'
import AuthView from '@/components/AuthView'
import SettingsModal from '@/components/SettingsModal'
import InstallPrompt from '@/components/InstallPrompt'
import './App.css'

type Tab = 'heute' | 'verlauf'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('heute')
  const [showSettings, setShowSettings] = useState(false)
  const { initialize: initWorkout } = useWorkoutStore()
  const { user, isLoading: authLoading, initialize: initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    if (!authLoading) {
      initWorkout()
    }
  }, [user, authLoading, initWorkout])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <AuthView />
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-app-card/80 backdrop-blur border-b border-app-border/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-app-primary rounded-lg flex items-center justify-center text-sm font-black">
              SW
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-app-text">Simple Workout</h1>
              <p className="text-app-text-2 text-xs">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-app-border/5 rounded-lg transition-colors"
            title="Settings"
          >
            <svg
              className="w-5 h-5 text-app-text-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-6 pb-24">
        {activeTab === 'heute' && (
          <>
            <section className="bg-app-card rounded-2xl p-5 border border-app-border/5">
              <h2 className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-4">
                Heute trainieren
              </h2>
              <MuscleGroupSelector />
            </section>

            <section className="bg-app-card rounded-2xl p-5 border border-app-border/5">
              <h2 className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-4">
                Übersicht
              </h2>
              <DashboardView />
            </section>
          </>
        )}

        {activeTab === 'verlauf' && (
          <section className="bg-app-card rounded-2xl p-5 border border-app-border/5">
            <h2 className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-4">
              Trainingsverlauf
            </h2>
            <AnalyticsView />
          </section>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-app-card border-t border-app-border/5 z-50">
        <div className="max-w-2xl mx-auto grid grid-cols-2">
          <button
            onClick={() => setActiveTab('heute')}
            className={`py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              activeTab === 'heute' ? 'text-app-primary' : 'text-app-text-3 hover:text-app-text-2'
            }`}
          >
            <span className="text-lg leading-none">🏋️</span>
            Heute
          </button>
          <button
            onClick={() => setActiveTab('verlauf')}
            className={`py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              activeTab === 'verlauf' ? 'text-app-primary' : 'text-app-text-3 hover:text-app-text-2'
            }`}
          >
            <span className="text-lg leading-none">📊</span>
            Verlauf
          </button>
        </div>
      </nav>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <InstallPrompt />
    </div>
  )
}

export default App
