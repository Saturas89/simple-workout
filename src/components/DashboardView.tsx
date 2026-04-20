import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useWorkoutStore } from '@/store/workoutStore'
import { recommendationService } from '@/services/recommendations'
import { RecommendationItem, WorkoutStats } from '@/types'
import AddPastTraining from '@/components/AddPastTraining'
import SwipeableEntry from '@/components/SwipeableEntry'
import ClearDataButton from '@/components/ClearDataButton'

export default function DashboardView() {
  const { t } = useTranslation()
  const { allTrainings, getTrainingsFromLastDays } = useWorkoutStore()
  const [last10Days, setLast10Days] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [stats, setStats] = useState<WorkoutStats | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const recent = await getTrainingsFromLastDays(10)
      setLast10Days(recent)
      // Recommendations use all-time data to find "days since last trained"
      if (allTrainings.length > 0) {
        setRecommendations(recommendationService.generateRecommendations(allTrainings, 3))
        setStats(recommendationService.getWorkoutStats(recent))
      } else {
        setRecommendations([])
        setStats(null)
      }
    }
    loadData()
  }, [allTrainings, getTrainingsFromLastDays])

  if (last10Days.length === 0) {
    return (
      <div>
        <div className="py-8 text-center">
          <p className="text-3xl mb-3">🏋️</p>
          <p className="text-app-text-2 text-sm">{t('dashboard.noData')}</p>
          <p className="text-app-text-3 text-xs mt-1">{t('dashboard.selectMuscles')}</p>
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
            <p className="text-app-text-2 text-xs mt-2 leading-tight">{t('dashboard.workouts')}</p>
          </div>
          <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
            <p className="text-2xl font-black text-app-text leading-none">{stats.average}</p>
            <p className="text-app-text-2 text-xs mt-2 leading-tight">{t('dashboard.avgPerGroup')}</p>
          </div>
          <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px] overflow-hidden">
            <p className="text-sm font-black text-app-text leading-tight truncate">
              {stats.topMuscleGroup || '–'}
            </p>
            <p className="text-app-text-2 text-xs mt-2 leading-tight">{t('dashboard.topGroup')}</p>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-3">
            {t('dashboard.nextWorkout')}
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
                      <p className="text-[10px] text-app-text-3">{t('dashboard.thisWeek')}</p>
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
          {t('dashboard.last10Days')}
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
