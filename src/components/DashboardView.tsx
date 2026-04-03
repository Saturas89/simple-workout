import { useState, useEffect } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { recommendationService } from '@/services/recommendations'
import { RecommendationItem, WorkoutStats } from '@/types'

export default function DashboardView() {
  const { allTrainings, getTrainingsFromLastDays } = useWorkoutStore()
  const [last10Days, setLast10Days] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [stats, setStats] = useState<WorkoutStats | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const trainings = await getTrainingsFromLastDays(10)
      setLast10Days(trainings)

      if (trainings.length > 0) {
        const recs = recommendationService.generateRecommendations(trainings, 3)
        setRecommendations(recs)

        const workoutStats = recommendationService.getWorkoutStats(trainings)
        setStats(workoutStats)
      }
    }

    loadData()
  }, [allTrainings, getTrainingsFromLastDays])

  return (
    <div className="space-y-8">
      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm">Diese Woche</p>
            <p className="text-3xl font-bold text-blue-700">{stats.totalTrainings}</p>
            <p className="text-gray-600 text-xs">Trainings</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm">Durchschnitt</p>
            <p className="text-3xl font-bold text-green-700">{stats.average}</p>
            <p className="text-gray-600 text-xs">pro Muskelgruppe</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <p className="text-gray-600 text-sm">Top Muskelgruppe</p>
            <p className="text-2xl font-bold text-purple-700">{stats.topMuscleGroup || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">🎯 Nächstes Training</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={rec.muscleGroup}
                className="bg-white p-4 rounded border-l-4 border-yellow-500"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-800">
                      {index + 1}. {rec.muscleGroup}
                    </p>
                    <p className="text-sm text-gray-600">
                      ⚠️ {rec.trainedInLast10Days}x in 10 Tagen (Ziel: {rec.ideal}x)
                    </p>
                    <p className="text-sm text-gray-700 italic mt-1">"{rec.reason}"</p>
                  </div>
                  <div className="bg-yellow-100 px-3 py-1 rounded">
                    <p className="text-xs font-bold text-yellow-800">
                      {Math.round(rec.score * 10) / 10}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training History */}
      {last10Days.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📅 Letzte 10 Tage</h3>
          <div className="space-y-2">
            {last10Days
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((training) => (
                <div
                  key={training.id}
                  className="bg-white p-3 rounded border-l-4 border-primary-600"
                >
                  <p className="font-semibold text-gray-800">
                    {new Date(training.date).toLocaleDateString('de-DE', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{training.muscleGroups.join(', ')}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {last10Days.length === 0 && (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 text-lg">Noch keine Trainings gespeichert.</p>
          <p className="text-gray-500 text-sm mt-2">
            Beginne oben mit der Auswahl deiner Muskelgruppen! 💪
          </p>
        </div>
      )}
    </div>
  )
}
