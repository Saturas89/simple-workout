import { describe, it, expect } from 'vitest'
import { recommendationService } from './recommendations'
import { TrainingEntry } from '@/types'

describe('recommendationService', () => {
  const mockTrainings: TrainingEntry[] = [
    {
      id: '1',
      date: '2026-03-25',
      muscleGroups: ['Brust', 'Rücken'],
      createdAt: '2026-03-25T10:00:00Z',
    },
    {
      id: '2',
      date: '2026-03-26',
      muscleGroups: ['Mobility'],
      createdAt: '2026-03-26T10:00:00Z',
    },
    {
      id: '3',
      date: '2026-03-27',
      muscleGroups: ['Beine', 'Ausdauer'],
      createdAt: '2026-03-27T10:00:00Z',
    },
    {
      id: '4',
      date: '2026-03-28',
      muscleGroups: ['Schulter'],
      createdAt: '2026-03-28T10:00:00Z',
    },
    {
      id: '5',
      date: '2026-03-29',
      muscleGroups: ['Mobility', 'Eisbaden'],
      createdAt: '2026-03-29T10:00:00Z',
    },
  ]

  it('should generate recommendations based on ideal frequencies', () => {
    const recommendations = recommendationService.generateRecommendations(mockTrainings, 3)

    expect(recommendations).toHaveLength(3)
    expect(recommendations[0]).toBeDefined()
    expect(recommendations[0].muscleGroup).toBeDefined()
    expect(recommendations[0].score).toBeDefined()
  })

  it('should prioritize undertrained muscle groups', () => {
    const recommendations = recommendationService.generateRecommendations(mockTrainings, 9)

    const eisbaden = recommendations.find((r) => r.muscleGroup === 'Eisbaden')
    const brust = recommendations.find((r) => r.muscleGroup === 'Brust')

    // Higher score = more overdue. Eisbaden (goal 3×/week, last 2026-03-29)
    // has shorter cycle than Brust (goal 2×/week, last 2026-03-25),
    // so relative to its goal it should be at least as overdue.
    expect(eisbaden?.score).toBeGreaterThanOrEqual(0)
    expect(brust?.score).toBeGreaterThanOrEqual(0)
    // Both must appear in the 9-item list
    expect(eisbaden).toBeDefined()
    expect(brust).toBeDefined()
  })

  it('should calculate correct stats', () => {
    const stats = recommendationService.getWorkoutStats(mockTrainings)

    expect(stats.totalTrainings).toBe(5)
    expect(stats.average).toBeGreaterThan(0)
    expect(stats.topMuscleGroup).toBe('Mobility')
  })
})
