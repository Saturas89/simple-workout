import { describe, it, expect } from 'vitest'
import { analyticsService } from '@/services/analyticsService'
import { TrainingEntry } from '@/types'

function localDateStr(daysOffset: number): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - daysOffset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function makeEntry(date: string, muscleGroups: string[]): TrainingEntry {
  return { id: date, date, muscleGroups: muscleGroups as any, createdAt: date }
}

// ─── getWeeklyActivity ────────────────────────────────────────────────────────

describe('analyticsService.getWeeklyActivity', () => {
  it('returns 8 weeks by default', () => {
    const result = analyticsService.getWeeklyActivity([])
    expect(result).toHaveLength(8)
  })

  it('respects custom weeks parameter', () => {
    const result = analyticsService.getWeeklyActivity([], 4)
    expect(result).toHaveLength(4)
  })

  it('counts trainings across the last 8 weeks', () => {
    const trainings = [
      makeEntry(localDateStr(0), ['Brust']),
      makeEntry(localDateStr(1), ['Rücken']),
    ]
    // Use 8 weeks so entries from today/yesterday are always included
    const result = analyticsService.getWeeklyActivity(trainings, 8)
    const total = result.reduce((sum, w) => sum + w.count, 0)
    expect(total).toBeGreaterThanOrEqual(1)
  })

  it('each bar has week label and count', () => {
    const result = analyticsService.getWeeklyActivity([])
    result.forEach((bar) => {
      expect(bar).toHaveProperty('week')
      expect(bar).toHaveProperty('count')
      expect(typeof bar.count).toBe('number')
    })
  })

  it('week labels follow KW format', () => {
    const result = analyticsService.getWeeklyActivity([])
    result.forEach((bar) => {
      expect(bar.week).toMatch(/^KW \d+$/)
    })
  })

  it('zero count for weeks with no trainings', () => {
    const result = analyticsService.getWeeklyActivity([])
    result.forEach((bar) => expect(bar.count).toBe(0))
  })
})

// ─── getMuscleGroupDistribution ───────────────────────────────────────────────

describe('analyticsService.getMuscleGroupDistribution', () => {
  it('returns an entry for all 12 muscle groups', () => {
    const result = analyticsService.getMuscleGroupDistribution([])
    expect(result).toHaveLength(12)
  })

  it('counts frequencies correctly', () => {
    const trainings = [
      makeEntry(localDateStr(0), ['Brust', 'Rücken']),
      makeEntry(localDateStr(1), ['Brust']),
    ]
    const result = analyticsService.getMuscleGroupDistribution(trainings)
    const brust = result.find((b) => b.group === 'Brust')!
    const rücken = result.find((b) => b.group === 'Rücken')!
    expect(brust.count).toBe(2)
    expect(rücken.count).toBe(1)
  })

  it('counts duplicate muscle groups within a single entry', () => {
    const trainings = [makeEntry(localDateStr(0), ['Brust', 'Brust', 'Rücken'])]
    const result = analyticsService.getMuscleGroupDistribution(trainings)
    const brust = result.find((b) => b.group === 'Brust')!
    const rücken = result.find((b) => b.group === 'Rücken')!
    expect(brust.count).toBe(2)
    expect(rücken.count).toBe(1)
  })

  it('is sorted descending by count', () => {
    const trainings = [
      makeEntry(localDateStr(0), ['Trizeps']),
      makeEntry(localDateStr(1), ['Trizeps']),
      makeEntry(localDateStr(2), ['Brust']),
    ]
    const result = analyticsService.getMuscleGroupDistribution(trainings)
    expect(result[0].group).toBe('Trizeps')
    expect(result[0].count).toBe(2)
  })

  it('includes color for each group', () => {
    const result = analyticsService.getMuscleGroupDistribution([])
    result.forEach((bar) => {
      expect(bar.color).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })
})

// ─── getCurrentStreak ─────────────────────────────────────────────────────────

describe('analyticsService.getCurrentStreak', () => {
  it('returns 0 for no trainings', () => {
    expect(analyticsService.getCurrentStreak([])).toBe(0)
  })

  it('returns 1 for training only today', () => {
    const trainings = [makeEntry(localDateStr(0), ['Brust'])]
    expect(analyticsService.getCurrentStreak(trainings)).toBe(1)
  })

  it('counts consecutive days correctly', () => {
    const trainings = [
      makeEntry(localDateStr(0), ['Brust']),
      makeEntry(localDateStr(1), ['Rücken']),
      makeEntry(localDateStr(2), ['Schulter']),
    ]
    expect(analyticsService.getCurrentStreak(trainings)).toBe(3)
  })

  it('stops streak at a gap', () => {
    const trainings = [
      makeEntry(localDateStr(0), ['Brust']),
      makeEntry(localDateStr(1), ['Rücken']),
      // gap: day 2 missing
      makeEntry(localDateStr(3), ['Schulter']),
    ]
    expect(analyticsService.getCurrentStreak(trainings)).toBe(2)
  })

  it('returns 0 when last training was 2+ days ago', () => {
    const trainings = [makeEntry(localDateStr(2), ['Brust'])]
    expect(analyticsService.getCurrentStreak(trainings)).toBe(0)
  })

  it('multiple trainings on same day count as 1 streak day', () => {
    const trainings = [
      makeEntry(localDateStr(0), ['Brust']),
      makeEntry(localDateStr(0), ['Rücken']),
    ]
    expect(analyticsService.getCurrentStreak(trainings)).toBe(1)
  })
})

// ─── getFavoriteMuscleGroup ───────────────────────────────────────────────────

describe('analyticsService.getFavoriteMuscleGroup', () => {
  it('returns null for empty trainings', () => {
    expect(analyticsService.getFavoriteMuscleGroup([])).toBeNull()
  })

  it('returns most frequent group', () => {
    const trainings = [
      makeEntry(localDateStr(0), ['Beine']),
      makeEntry(localDateStr(1), ['Beine']),
      makeEntry(localDateStr(2), ['Brust']),
    ]
    expect(analyticsService.getFavoriteMuscleGroup(trainings)).toBe('Beine')
  })

  it('counts duplicate muscle groups within a single entry toward favorite', () => {
    const trainings = [makeEntry(localDateStr(0), ['Brust', 'Brust', 'Brust', 'Beine'])]
    expect(analyticsService.getFavoriteMuscleGroup(trainings)).toBe('Brust')
  })

  it('returns null when all groups have 0 count', () => {
    const trainings = [makeEntry(localDateStr(0), [])]
    expect(analyticsService.getFavoriteMuscleGroup(trainings)).toBeNull()
  })
})
