import i18next from 'i18next'
import {
  RecommendationItem,
  TrainingEntry,
  MuscleGroup,
  MUSCLE_GROUPS,
  IDEAL_FREQUENCIES,
  WEEKLY_GOALS,
} from '@/types'

/** Returns Monday of the week containing `date` as a YYYY-MM-DD string */
function getMondayOf(date: Date): string {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sun
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

export const recommendationService = {
  generateRecommendations(
    trainings: TrainingEntry[],
    topN: number = 3,
  ): RecommendationItem[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]
    const mondayStr = getMondayOf(today)

    // Last training date and this-week count per group
    const lastDate: Record<MuscleGroup, string | null> = {} as any
    const thisWeekCount: Record<MuscleGroup, number> = {} as any
    MUSCLE_GROUPS.forEach((g) => {
      lastDate[g] = null
      thisWeekCount[g] = 0
    })

    trainings.forEach((t) => {
      t.muscleGroups.forEach((g) => {
        if (!lastDate[g] || t.date > lastDate[g]!) lastDate[g] = t.date
        if (t.date >= mondayStr && t.date <= todayStr) thisWeekCount[g]++
      })
    })

    const items: RecommendationItem[] = MUSCLE_GROUPS.map((group) => {
      const last = lastDate[group]
      const weeklyGoal = WEEKLY_GOALS[group]
      const cycleDays = 7 / weeklyGoal // ideal interval between sessions

      let daysSinceLast: number
      let score: number

      if (!last) {
        daysSinceLast = -1
        score = 999 // never trained → always highest priority
      } else {
        const lastMs = new Date(last).getTime()
        daysSinceLast = Math.floor((today.getTime() - lastMs) / (1000 * 60 * 60 * 24))
        score = daysSinceLast / cycleDays
      }

      return {
        muscleGroup: group,
        score,
        daysSinceLast,
        weeklyGoal,
        trainedThisWeek: thisWeekCount[group],
        reason: buildReason(group, daysSinceLast, weeklyGoal, thisWeekCount[group]),
      }
    })

    // Sort by score descending (most overdue first), then take topN
    return items.sort((a, b) => b.score - a.score).slice(0, topN)
  },

  getWorkoutStats(trainings: TrainingEntry[]) {
    const frequencies: Record<string, number> = {}
    let totalTrainings = 0

    MUSCLE_GROUPS.forEach((group) => { frequencies[group] = 0 })

    trainings.forEach((training) => {
      training.muscleGroups.forEach((group) => { frequencies[group]++ })
      totalTrainings++
    })

    const topMuscleGroup = Object.entries(frequencies).reduce((a, b) =>
      a[1] > b[1] ? a : b,
    )[0]

    const average = totalTrainings > 0 ? totalTrainings / MUSCLE_GROUPS.length : 0

    return {
      totalTrainings,
      average: parseFloat(average.toFixed(1)),
      topMuscleGroup: (topMuscleGroup as MuscleGroup) || null,
      muscleGroupFrequency: frequencies as Record<MuscleGroup, number>,
    }
  },
}

function buildReason(
  _group: MuscleGroup,
  daysSinceLast: number,
  weeklyGoal: number,
  trainedThisWeek: number,
): string {
  const t = i18next.t.bind(i18next)
  if (daysSinceLast === -1) return t('recommendations.neverTrained')
  if (daysSinceLast === 0) return t('recommendations.trainedToday')
  if (daysSinceLast === 1) return t('recommendations.yesterday', { count: trainedThisWeek, goal: weeklyGoal })
  return t('recommendations.daysAgo', { days: daysSinceLast, count: trainedThisWeek, goal: weeklyGoal })
}

// Keep old export name for any direct imports
export { IDEAL_FREQUENCIES }
