import { useState, useEffect } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'
import { useThemeStore } from '@/store/themeStore'
import { recommendationService } from '@/services/recommendations'
import { RecommendationItem, WorkoutStats, TrainingEntry, MuscleGroup } from '@/types'
import AddPastTraining from '@/components/AddPastTraining'
import SwipeableEntry from '@/components/SwipeableEntry'
import ClearDataButton from '@/components/ClearDataButton'

function applyShowcaseFilter(trainings: TrainingEntry[]): TrainingEntry[] {
  return trainings
    .map((t) => ({ ...t, muscleGroups: t.muscleGroups.filter((g) => g !== 'Sex') as MuscleGroup[] }))
    .filter((t) => t.muscleGroups.length > 0)
}

export default function DashboardView() {
  const { allTrainings, getTrainingsFromLastDays } = useWorkoutStore()
  const showcaseMode = useThemeStore((s) => s.showcaseMode)
  const [last10Days, setLast10Days] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [stats, setStats] = useState<WorkoutStats | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const recent = await getTrainingsFromLastDays(10)
      const filteredRecent = showcaseMode ? applyShowcaseFilter(recent) : recent
      const filteredAll = showcaseMode ? applyShowcaseFilter(allTrainings) : allTrainings

      setLast10Days(filteredRecent)

      if (filteredAll.length > 0) {
        // Use unfiltered all-time data for dates, but filter Sex from the results
        const rawRecs = recommendationService.generateRecommendations(allTrainings, showcaseMode ? 4 : 3)
        const recs = showcaseMode
          ? rawRecs.filter((r) => r.muscleGroup !== 'Sex').slice(0, 3)
          : rawRecs
        setRecommendations(recs)
        setStats(recommendationService.getWorkoutStats(filteredRecent))
      } else {
        setRecommendations([])
        setStats(null)
      }
    }
    loadData()
  }, [allTrainings, getTrainingsFromLastDays, showcaseMode])

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
            {recommendations.map((rec) => {
              const weekProgress = Math.min(rec.trainedThisWeek / rec.weeklyGoal, 1)
              return (
                <div key={rec.muscleGroup} className="bg-app-inner rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-app-text text-sm">{rec.muscleGroup}</p>
                      <p className="text-app-text-3 text-xs mt-0.5">{rec.reason}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold text-app-text">
                        {rec.trainedThisWeek}
                        <span className="text-app-text-3 font-normal">/{rec.weeklyGoal}×</span>
                      </p>
                      <p className="text-[10px] text-app-text-3">diese Woche</p>
                    </div>
                  </div>
                  {/* Weekly progress bar */}
                  <div className="h-1 bg-app-border/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${weekProgress * 100}%`,
                        backgroundColor: weekProgress >= 1
                          ? 'rgb(var(--app-primary))'
                          : weekProgress >= 0.5
                            ? 'rgb(var(--app-primary) / 0.7)'
                            : 'rgb(var(--app-primary) / 0.4)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
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
