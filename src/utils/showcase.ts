import { TrainingEntry, MuscleGroup } from '@/types'

export function filterShowcaseTrainings(trainings: TrainingEntry[]): TrainingEntry[] {
  return trainings
    .map((t) => ({
      ...t,
      muscleGroups: t.muscleGroups.filter((g): g is MuscleGroup => g !== 'Sex'),
    }))
    .filter((t) => t.muscleGroups.length > 0)
}
