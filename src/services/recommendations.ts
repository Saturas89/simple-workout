import { RecommendationItem, TrainingEntry, MUSCLE_GROUPS, IDEAL_FREQUENCIES } from '@/types'

export const recommendationService = {
  generateRecommendations(trainings: TrainingEntry[], topN: number = 3): RecommendationItem[] {
    // Count frequency of each muscle group in the last 10 days
    const frequencies: Record<string, number> = {}

    MUSCLE_GROUPS.forEach((group) => {
      frequencies[group] = 0
    })

    trainings.forEach((training) => {
      training.muscleGroups.forEach((group) => {
        frequencies[group]++
      })
    })

    // Calculate scores based on ideal frequencies
    const scores = MUSCLE_GROUPS.map((group) => {
      const trained = frequencies[group] || 0
      const ideal = IDEAL_FREQUENCIES[group]
      const score = (trained / ideal) * 10

      return {
        muscleGroup: group,
        score,
        trainedInLast10Days: trained,
        ideal,
        reason: this.getReason(group, trained, ideal),
      }
    })

    // Sort by score (lowest first = most needed)
    return scores
      .sort((a, b) => a.score - b.score)
      .slice(0, topN)
  },

  getReason(group: string, trained: number, ideal: number): string {
    const percentage = Math.round((trained / ideal) * 100)

    if (percentage === 0) {
      return `${group} brauchte definitiv Arbeit!`
    } else if (percentage < 50) {
      return `${group} brauchte noch viel mehr Trainieren!`
    } else if (percentage < 100) {
      return `${group} brauchte noch etwas mehr Aufmerksamkeit!`
    } else {
      return `${group} ist gut im Plan!`
    }
  },

  getWorkoutStats(trainings: TrainingEntry[]) {
    const frequencies: Record<string, number> = {}
    let totalTrainings = 0

    MUSCLE_GROUPS.forEach((group) => {
      frequencies[group] = 0
    })

    trainings.forEach((training) => {
      training.muscleGroups.forEach((group) => {
        frequencies[group]++
      })
      totalTrainings++
    })

    const topMuscleGroup = Object.entries(frequencies).reduce((a, b) =>
      a[1] > b[1] ? a : b,
    )[0]

    const average = totalTrainings > 0 ? totalTrainings / MUSCLE_GROUPS.length : 0

    return {
      totalTrainings,
      average: parseFloat(average.toFixed(1)),
      topMuscleGroup: (topMuscleGroup as any) || null,
      muscleGroupFrequency: frequencies,
    }
  },
}
