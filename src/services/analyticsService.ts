import { TrainingEntry, MuscleGroup, MUSCLE_GROUPS } from '@/types'

export interface WeeklyBar {
  week: string
  count: number
}

export interface MuscleBar {
  group: MuscleGroup
  count: number
  color: string
}

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  Brust: '#ef4444',
  Rücken: '#3b82f6',
  Schulter: '#8b5cf6',
  Bizeps: '#f97316',
  Trizeps: '#ec4899',
  Beine: '#22c55e',
  Mobility: '#eab308',
  Ausdauer: '#06b6d4',
  Eisbaden: '#6366f1',
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function getWeekKey(date: Date): string {
  return `KW ${getISOWeek(date)}`
}

export const analyticsService = {
  getWeeklyActivity(trainings: TrainingEntry[], weeks: number = 8): WeeklyBar[] {
    const result: WeeklyBar[] = []
    const today = new Date()

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay() + 1 - i * 7)
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      const count = trainings.filter((t) => {
        const d = new Date(t.date)
        return d >= weekStart && d <= weekEnd
      }).length

      result.push({ week: getWeekKey(weekStart), count })
    }

    return result
  },

  getMuscleGroupDistribution(trainings: TrainingEntry[]): MuscleBar[] {
    const counts: Record<string, number> = {}
    MUSCLE_GROUPS.forEach((g) => (counts[g] = 0))

    trainings.forEach((t) => {
      t.muscleGroups.forEach((g) => {
        counts[g]++
      })
    })

    return MUSCLE_GROUPS.map((group) => ({
      group,
      count: counts[group],
      color: MUSCLE_COLORS[group],
    })).sort((a, b) => b.count - a.count)
  },

  getCurrentStreak(trainings: TrainingEntry[]): number {
    const dates = new Set(trainings.map((t) => t.date))
    let streak = 0
    const today = new Date()

    for (let i = 0; i <= 365; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().split('T')[0]
      if (dates.has(key)) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return streak
  },

  getFavoriteMuscleGroup(trainings: TrainingEntry[]): MuscleGroup | null {
    if (trainings.length === 0) return null
    const counts: Record<string, number> = {}
    MUSCLE_GROUPS.forEach((g) => (counts[g] = 0))
    trainings.forEach((t) => t.muscleGroups.forEach((g) => counts[g]++))
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top[1] > 0 ? (top[0] as MuscleGroup) : null
  },
}
