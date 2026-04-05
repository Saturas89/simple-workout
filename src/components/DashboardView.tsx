import { useState, useEffect } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { recommendationService } from '@/services/recommendations'
import { RecommendationItem, WorkoutStats } from '@/types'
import AddPastTraining from '@/components/AddPastTraining'
import SwipeableEntry from '@/components/SwipeableEntry'
import ClearDataButton from '@/components/ClearDataButton'

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
      <div>
        <div className="py-8 text-center">
          <p className="text-3xl mb-3">🏋️</p>
          <p className="text-app-text-2 text-sm">Noch keine Trainings gespeichert.</p>
          <p className="text-app-text-3 text-xs mt-1">Wähle oben deine Muskelgruppen aus.</p>
        </div>
        <AddPastTraining />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
            <p className="text-2xl font-black text-app-text leading-none">{stats.totalTrainings}</p>
            <p className="text-app-text-2 text-xs mt-2 leading-tight">Trainings</p>
          </div>
          <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
            <p className="text-2xl font-black text-app-text leading-none">{stats.average}</p>
            <p className="text-app-text-2 text-xs mt-2 leading-tight">Ø pro Gruppe</p>
          </div>
          <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px] overflow-hidden">
            <p className="text-sm font-black text-app-text leading-tight truncate">
              {stats.topMuscleGroup || '–'}
            </p>
            <p className="text-app-text-2 text-xs mt-2 leading-tight">Top Gruppe</p>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-3">
            Nächstes Training
          </p>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={rec.muscleGroup} className="bg-app-inner rounded-xl p-4 flex items-center gap-4">
                <div className="w-7 h-7 rounded-lg bg-app-primary/20 text-app-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-app-text text-sm">{rec.muscleGroup}</p>
                  <p className="text-app-text-3 text-xs truncate">{rec.reason}</p>
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
        <p className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-3">
          Letzte 10 Tage
        </p>
        <div className="space-y-2">
          {last10Days
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((training) => (
              <SwipeableEntry key={training.id} training={training} />
            ))}
        </div>
        <AddPastTraining />
      </div>
      <ClearDataButton />
    </div>
  )
}
