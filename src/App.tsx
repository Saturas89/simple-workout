import { useEffect, useState } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { useAuthStore } from '@/store/authStore'
import DashboardView from '@/components/DashboardView'
import MuscleGroupSelector from '@/components/MuscleGroupSelector'
import AnalyticsView from '@/components/AnalyticsView'
import AuthView from '@/components/AuthView'
import './App.css'

type Tab = 'heute' | 'verlauf'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('heute')
  const { initialize: initWorkout } = useWorkoutStore()
  const { user, isLoading: authLoading, initialize: initAuth, signOut } = useAuthStore()

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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <AuthView />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center text-sm font-black">
              SW
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Simple Workout</h1>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Abmelden
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-6 pb-24">
        {activeTab === 'heute' && (
          <>
            <section className="bg-gray-900 rounded-2xl p-5 border border-white/5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Heute trainieren
              </h2>
              <MuscleGroupSelector />
            </section>

            <section className="bg-gray-900 rounded-2xl p-5 border border-white/5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Übersicht
              </h2>
              <DashboardView />
            </section>
          </>
        )}

        {activeTab === 'verlauf' && (
          <section className="bg-gray-900 rounded-2xl p-5 border border-white/5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Trainingsverlauf
            </h2>
            <AnalyticsView />
          </section>
        )}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/5 z-50">
        <div className="max-w-2xl mx-auto grid grid-cols-2">
          <button
            onClick={() => setActiveTab('heute')}
            className={`py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              activeTab === 'heute' ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-lg leading-none">🏋️</span>
            Heute
          </button>
          <button
            onClick={() => setActiveTab('verlauf')}
            className={`py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              activeTab === 'verlauf' ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-lg leading-none">📊</span>
            Verlauf
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
