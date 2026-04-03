import { useEffect } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import DashboardView from '@/components/DashboardView'
import MuscleGroupSelector from '@/components/MuscleGroupSelector'
import './App.css'

function App() {
  const { initialize } = useWorkoutStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center text-sm font-black">
            SW
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Simple Workout</h1>
            <p className="text-gray-400 text-xs">Dein Training, dein Fortschritt</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-gray-900 rounded-2xl p-5 border border-white/5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Heute trainieren
          </h2>
          <MuscleGroupSelector />
        </section>

        <section className="bg-gray-900 rounded-2xl p-5 border border-white/5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Dashboard
          </h2>
          <DashboardView />
        </section>
      </main>

      <footer className="max-w-2xl mx-auto px-4 py-6 text-center text-gray-600 text-xs">
        Simple Workout v1.0.0
      </footer>
    </div>
  )
}

export default App
