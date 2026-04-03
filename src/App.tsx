import { useEffect } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import DashboardView from '@/components/DashboardView'
import MuscleGroupSelector from '@/components/MuscleGroupSelector'
import './App.css'

function App() {
  const { initialize } = useWorkoutStore()

  useEffect(() => {
    // Initialize store from IndexedDB on mount
    initialize()
  }, [initialize])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-primary-700">💪 Simple Workout</h1>
          <p className="text-gray-600 text-sm">Intelligent Training Management</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Heute trainieren</h2>
          <MuscleGroupSelector />
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
          <DashboardView />
        </section>
      </main>

      <footer className="mt-12 bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Simple Workout v1.0.0 • Progressive Web App</p>
        </div>
      </footer>
    </div>
  )
}

export default App
