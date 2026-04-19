import { describe, it, expect } from 'vitest'
import { recommendationService } from '@/services/recommendations'
import { TrainingEntry, MUSCLE_GROUPS, WEEKLY_GOALS } from '@/types'

const ALL = MUSCLE_GROUPS.length

// Helper: create a TrainingEntry N days ago
function daysAgo(n: number): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function makeEntry(date: string, muscleGroups: string[]): TrainingEntry {
  return { id: date, date, muscleGroups: muscleGroups as any, createdAt: date }
}

// ─── generateRecommendations ──────────────────────────────────────────────────

describe('recommendationService.generateRecommendations', () => {
  it('returns top 3 by default', () => {
    const trainings = [makeEntry(daysAgo(1), ['Brust', 'Rücken', 'Schulter'])]
    const result = recommendationService.generateRecommendations(trainings)
    expect(result).toHaveLength(3)
  })

  it('respects topN parameter', () => {
    const trainings = [makeEntry(daysAgo(1), ['Brust'])]
    expect(recommendationService.generateRecommendations(trainings, 5)).toHaveLength(5)
  })

  it('never-trained groups get score 999 and come first', () => {
    // Train every group except Eisbaden
    const trained = MUSCLE_GROUPS.filter((g) => g !== 'Eisbaden')
    const trainings = [makeEntry(daysAgo(0), trained)]
    const recs = recommendationService.generateRecommendations(trainings, ALL)
    expect(recs[0].muscleGroup).toBe('Eisbaden')
    expect(recs[0].score).toBe(999)
    expect(recs[0].daysSinceLast).toBe(-1)
    expect(recs[0].reason).toBe('Noch nie trainiert')
  })

  it('most overdue group ranks highest', () => {
    // Train ALL groups today except Brust (10 days ago) and Rücken (1 day ago)
    const allExceptBrustRücken = MUSCLE_GROUPS.filter((g) => g !== 'Brust' && g !== 'Rücken')
    const trainings = [
      makeEntry(daysAgo(10), ['Brust']),
      makeEntry(daysAgo(1), ['Rücken']),
      makeEntry(daysAgo(0), allExceptBrustRücken),
    ]
    const recs = recommendationService.generateRecommendations(trainings, 2)
    // Brust: 10 days ago, weeklyGoal 2 → score = 10 / 3.5 ≈ 2.86
    // Rücken: 1 day ago, weeklyGoal 2 → score = 1 / 3.5 ≈ 0.29
    expect(recs[0].muscleGroup).toBe('Brust')
    expect(recs[1].muscleGroup).toBe('Rücken')
  })

  it('score = daysSinceLast / (7 / weeklyGoal)', () => {
    // Train every group today except Brust (7 days ago), so Brust is the only overdue group
    const allExceptBrust = MUSCLE_GROUPS.filter((g) => g !== 'Brust')
    const trainings = [
      makeEntry(daysAgo(7), ['Brust']),
      makeEntry(daysAgo(0), allExceptBrust),
    ]
    const recs = recommendationService.generateRecommendations(trainings, ALL)
    const brust = recs.find((r) => r.muscleGroup === 'Brust')!
    const expected = 7 / (7 / WEEKLY_GOALS['Brust'])
    expect(brust.score).toBeCloseTo(expected)
    expect(brust.daysSinceLast).toBe(7)
  })

  it('trained today shows daysSinceLast = 0 and correct reason', () => {
    // Train every group today so Bizeps is in the result set
    const trainings = [makeEntry(daysAgo(0), MUSCLE_GROUPS as unknown as string[])]
    const recs = recommendationService.generateRecommendations(trainings, ALL)
    const bizeps = recs.find((r) => r.muscleGroup === 'Bizeps')!
    expect(bizeps.daysSinceLast).toBe(0)
    expect(bizeps.reason).toBe('Heute trainiert')
  })

  it('trained yesterday shows correct reason', () => {
    // Train every group yesterday so Beine is in the result set
    const trainings = [makeEntry(daysAgo(1), MUSCLE_GROUPS as unknown as string[])]
    const recs = recommendationService.generateRecommendations(trainings, ALL)
    const beine = recs.find((r) => r.muscleGroup === 'Beine')!
    expect(beine.reason).toMatch(/Gestern/)
  })

  it('trainedThisWeek counts only Mon–today entries', () => {
    // Train Mobility today + yesterday + long ago
    const trainings = [
      makeEntry(daysAgo(0), ['Mobility']),
      makeEntry(daysAgo(1), ['Mobility']),
      makeEntry(daysAgo(30), ['Mobility']),
    ]
    const recs = recommendationService.generateRecommendations(trainings, ALL)
    const mob = recs.find((r) => r.muscleGroup === 'Mobility')!
    expect(mob.trainedThisWeek).toBeGreaterThanOrEqual(1)
    expect(mob.weeklyGoal).toBe(3)
  })

  it('repeat entries (same group twice in one entry) count toward trainedThisWeek', () => {
    const trainings = [makeEntry(daysAgo(0), ['Brust', 'Brust'])]
    const recs = recommendationService.generateRecommendations(trainings, ALL)
    const brust = recs.find((r) => r.muscleGroup === 'Brust')!
    expect(brust.trainedThisWeek).toBe(2)
    expect(brust.daysSinceLast).toBe(0)
  })

  it('each recommendation has all required fields', () => {
    const trainings = [makeEntry(daysAgo(3), ['Brust'])]
    const recs = recommendationService.generateRecommendations(trainings)
    recs.forEach((rec) => {
      expect(rec).toHaveProperty('muscleGroup')
      expect(rec).toHaveProperty('score')
      expect(rec).toHaveProperty('daysSinceLast')
      expect(rec).toHaveProperty('weeklyGoal')
      expect(rec).toHaveProperty('trainedThisWeek')
      expect(rec).toHaveProperty('reason')
    })
  })

  it('works with empty trainings array — all groups score 999', () => {
    const recs = recommendationService.generateRecommendations([], ALL)
    recs.forEach((rec) => {
      expect(rec.score).toBe(999)
      expect(rec.daysSinceLast).toBe(-1)
    })
  })
})

// ─── getWorkoutStats ───────────────────────────────────────────────────────────

describe('recommendationService.getWorkoutStats', () => {
  it('returns zero stats for empty array', () => {
    const stats = recommendationService.getWorkoutStats([])
    expect(stats.totalTrainings).toBe(0)
    expect(stats.average).toBe(0)
  })

  it('counts total trainings correctly', () => {
    const trainings = [
      makeEntry(daysAgo(0), ['Brust']),
      makeEntry(daysAgo(1), ['Rücken', 'Schulter']),
    ]
    const stats = recommendationService.getWorkoutStats(trainings)
    expect(stats.totalTrainings).toBe(2)
  })

  it('identifies top muscle group', () => {
    const trainings = [
      makeEntry(daysAgo(0), ['Bizeps']),
      makeEntry(daysAgo(1), ['Bizeps']),
      makeEntry(daysAgo(2), ['Brust']),
    ]
    const stats = recommendationService.getWorkoutStats(trainings)
    expect(stats.topMuscleGroup).toBe('Bizeps')
  })

  it('muscleGroupFrequency counts per group correctly', () => {
    const trainings = [
      makeEntry(daysAgo(0), ['Brust', 'Rücken']),
      makeEntry(daysAgo(1), ['Brust']),
    ]
    const stats = recommendationService.getWorkoutStats(trainings)
    expect(stats.muscleGroupFrequency['Brust']).toBe(2)
    expect(stats.muscleGroupFrequency['Rücken']).toBe(1)
    expect(stats.muscleGroupFrequency['Schulter']).toBe(0)
  })

  it('muscleGroupFrequency counts duplicates within a single entry', () => {
    const trainings = [makeEntry(daysAgo(0), ['Brust', 'Brust', 'Rücken'])]
    const stats = recommendationService.getWorkoutStats(trainings)
    expect(stats.muscleGroupFrequency['Brust']).toBe(2)
    expect(stats.muscleGroupFrequency['Rücken']).toBe(1)
  })
})
