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

export const IDEAL_FREQUENCIES: Record<MuscleGroup, number> = {
  Brust: 2,
  Rücken: 2,
  Schulter: 2,
  Bizeps: 1,
  Trizeps: 1,
  Beine: 2,
  Mobility: 4,
  Ausdauer: 2,
  Eisbaden: 3,
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
  score: number
  trainedInLast10Days: number
  ideal: number
  reason: string
}

export interface WorkoutStats {
  totalTrainings: number
  average: number
  topMuscleGroup: MuscleGroup | null
  muscleGroupFrequency: Record<MuscleGroup, number>
}
