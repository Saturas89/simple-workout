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
        setRecommendations(recommendationService.generateRecommendations(trainings, 3))
        setStats(recommendationService.getWorkoutStats(trainings))
      }
    }
    loadData()
  }, [allTrainings, getTrainingsFromLastDays])

  if (last10Days.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-3xl mb-3">🏋️</p>
        <p className="text-gray-400 text-sm">Noch keine Trainings gespeichert.</p>
        <p className="text-gray-600 text-xs mt-1">Wähle oben deine Muskelgruppen aus.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-2xl font-black text-white">{stats.totalTrainings}</p>
            <p className="text-gray-400 text-xs mt-1">Trainings</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-2xl font-black text-white">{stats.average}</p>
            <p className="text-gray-400 text-xs mt-1">Ø Muskelgruppen</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-lg font-black text-white truncate">{stats.topMuscleGroup || '–'}</p>
            <p className="text-gray-400 text-xs mt-1">Top Gruppe</p>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Nächstes Training
          </p>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={rec.muscleGroup} className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{rec.muscleGroup}</p>
                  <p className="text-gray-500 text-xs truncate">{rec.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500">
                    {rec.trainedInLast10Days}x / {rec.ideal}x
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Letzte 10 Tage
        </p>
        <div className="space-y-2">
          {last10Days
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((training) => (
              <div key={training.id} className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-violet-500 rounded-full shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {new Date(training.date).toLocaleDateString('de-DE', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  <p className="text-xs text-gray-500">{training.muscleGroups.join(', ')}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
