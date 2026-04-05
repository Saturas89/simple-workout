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
}

/** Weekly training goals — used by the recommendation engine */
export const WEEKLY_GOALS: Record<MuscleGroup, number> = {
  Brust: 2,
  Rücken: 2,
  Schulter: 2,
  Bizeps: 1,
  Trizeps: 1,
  Beine: 2,
  Mobility: 3,  // 3× per week
  Ausdauer: 2,
  Eisbaden: 3,  // 3× per week
}

export interface TrainingEntry {
  id: string
  date: string // ISO date string
  muscleGroups: MuscleGroup[]
  createdAt: string // ISO datetime
  notes?: string
}

export interface DailySelection {
  date: string // ISO date string
  muscleGroups: MuscleGroup[]
}

export interface RecommendationItem {
  muscleGroup: MuscleGroup
  /** Overdue score: daysSinceLast / (7 / weeklyGoal). Higher = more urgent. */
  score: number
  /** Days since last training of this group. -1 = never trained. */
  daysSinceLast: number
  /** Weekly goal for this group */
  weeklyGoal: number
  /** How many times trained in the current Mon–Sun week */
  trainedThisWeek: number
  reason: string
}

export interface WorkoutStats {
  totalTrainings: number
  average: number
  topMuscleGroup: MuscleGroup | null
  muscleGroupFrequency: Record<MuscleGroup, number>
}
