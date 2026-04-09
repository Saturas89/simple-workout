export type MuscleGroup =
  | 'Brust'
  | 'Rücken'
  | 'Schulter'
  | 'Bizeps'
  | 'Trizeps'
  | 'Beine'
  | 'Mobility'
  | 'Ausdauer'
  | 'Eisbaden'
  | 'Sauna'
  | 'Bauch'
  | 'Sex'

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Brust',
  'Rücken',
  'Schulter',
  'Bizeps',
  'Trizeps',
  'Beine',
  'Mobility',
  'Ausdauer',
  'Eisbaden',
  'Sauna',
  'Bauch',
  'Sex',
]

/** Legacy: used for analytics/stats (per 10 days) */
export const IDEAL_FREQUENCIES: Record<MuscleGroup, number> = {
  Brust: 2,
  Rücken: 2,
  Schulter: 2,
  Bizeps: 1,
  Trizeps: 1,
  Beine: 2,
  Mobility: 3,
  Ausdauer: 2,
  Eisbaden: 3,
  Sauna: 2,
  Bauch: 3,
  Sex: 3,
}

/** Weekly training goals — used by the recommendation engine */
export const WEEKLY_GOALS: Record<MuscleGroup, number> = {
  Brust: 2,
  Rücken: 2,
  Schulter: 2,
  Bizeps: 1,
  Trizeps: 1,
  Beine: 2,
  Mobility: 3,
  Ausdauer: 2,
  Eisbaden: 3,
  Sauna: 2,
  Bauch: 3,
  Sex: 3,
}

export interface TrainingEntry {
  id: string
  date: string        // ISO date string YYYY-MM-DD
  muscleGroups: MuscleGroup[]
  createdAt: string   // ISO datetime — used to show time for multiple entries/day
  notes?: string
}

export interface DailySelection {
  date: string
  muscleGroups: MuscleGroup[]
}

export interface RecommendationItem {
  muscleGroup: MuscleGroup
  /** Overdue score: daysSinceLast / (7 / weeklyGoal). Higher = more urgent. */
  score: number
  /** Days since last training of this group. -1 = never trained. */
  daysSinceLast: number
  weeklyGoal: number
  trainedThisWeek: number
  reason: string
}

export interface WorkoutStats {
  totalTrainings: number
  average: number
  topMuscleGroup: MuscleGroup | null
  muscleGroupFrequency: Record<MuscleGroup, number>
}
