/**
 * Tests for the WeeklyActivitySummary data logic.
 * Spec: Dashboard tab → "Letzte 7 Tage" — 7 Tageskarten, ältester links, heute rechts.
 * Today column highlighted. Trainings must appear on the correct local weekday.
 */
import { describe, it, expect } from 'vitest'
import { TrainingEntry } from '@/types'

// Mirror the local-date helper from WeeklyActivitySummary
function toLocalStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildDays(now: Date) {
  const base = new Date(now)
  base.setHours(0, 0, 0, 0)
  const todayStr = toLocalStr(base)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setDate(d.getDate() - (6 - i))
    return { str: toLocalStr(d), date: d }
  })
  return { days, todayStr }
}

function buildGroupsByDay(
  days: { str: string }[],
  trainings: TrainingEntry[],
): Record<string, string[]> {
  const groupsByDay: Record<string, string[]> = {}
  days.forEach(({ str }) => { groupsByDay[str] = [] })
  trainings.forEach((t) => {
    if (groupsByDay[t.date] !== undefined) {
      t.muscleGroups.forEach((g) => {
        if (!groupsByDay[t.date].includes(g)) groupsByDay[t.date].push(g)
      })
    }
  })
  return groupsByDay
}

function makeEntry(date: string, muscleGroups: string[]): TrainingEntry {
  return { id: date, date, muscleGroups: muscleGroups as any, createdAt: date }
}

// ─── local date string helper ─────────────────────────────────────────────────

describe('toLocalStr (timezone-safe date string)', () => {
  it('returns correct format YYYY-MM-DD', () => {
    const d = new Date(2024, 3, 6) // April 6 2024 local
    expect(toLocalStr(d)).toBe('2024-04-06')
  })

  it('pads month and day with leading zero', () => {
    const d = new Date(2024, 0, 5) // Jan 5
    expect(toLocalStr(d)).toBe('2024-01-05')
  })

  it('does NOT shift date due to UTC offset (unlike toISOString)', () => {
    // Simulate midnight local — toISOString would give the previous day in UTC+X
    const d = new Date(2024, 3, 6, 0, 0, 0, 0)
    expect(toLocalStr(d)).toBe('2024-04-06') // must still be the 6th
  })
})

// ─── buildDays ────────────────────────────────────────────────────────────────

describe('buildDays', () => {
  it('always produces exactly 7 days', () => {
    const { days } = buildDays(new Date())
    expect(days).toHaveLength(7)
  })

  it('last element is today', () => {
    const now = new Date()
    const { days, todayStr } = buildDays(now)
    expect(days[6].str).toBe(todayStr)
  })

  it('first element is 6 days ago', () => {
    const now = new Date()
    now.setHours(12, 0, 0, 0)
    const { days } = buildDays(now)
    const sixAgo = new Date(now)
    sixAgo.setDate(sixAgo.getDate() - 6)
    expect(days[0].str).toBe(toLocalStr(sixAgo))
  })

  it('days are in ascending chronological order', () => {
    const { days } = buildDays(new Date())
    for (let i = 1; i < days.length; i++) {
      expect(days[i].str > days[i - 1].str).toBe(true)
    }
  })

  it('getDay() returns local weekday (not UTC-shifted)', () => {
    // April 6 2024 is a Saturday (day 6)
    const saturday = new Date(2024, 3, 6, 0, 0, 0, 0)
    const { days } = buildDays(saturday)
    const today = days[6]
    expect(today.date.getDay()).toBe(6) // Saturday
  })
})

// ─── buildGroupsByDay ─────────────────────────────────────────────────────────

describe('buildGroupsByDay', () => {
  it('all days start empty', () => {
    const { days } = buildDays(new Date())
    const result = buildGroupsByDay(days, [])
    days.forEach(({ str }) => expect(result[str]).toEqual([]))
  })

  it('training on today appears in today slot', () => {
    const now = new Date()
    const { days, todayStr } = buildDays(now)
    const trainings = [makeEntry(todayStr, ['Brust', 'Rücken'])]
    const result = buildGroupsByDay(days, trainings)
    expect(result[todayStr]).toContain('Brust')
    expect(result[todayStr]).toContain('Rücken')
  })

  it('training older than 7 days is ignored', () => {
    const now = new Date()
    const { days } = buildDays(now)
    const old = new Date(now)
    old.setDate(old.getDate() - 10)
    const trainings = [makeEntry(toLocalStr(old), ['Bizeps'])]
    const result = buildGroupsByDay(days, trainings)
    const total = Object.values(result).flat().length
    expect(total).toBe(0)
  })

  it('duplicate muscle groups on same day are deduplicated', () => {
    const now = new Date()
    const { days, todayStr } = buildDays(now)
    const trainings = [
      makeEntry(todayStr, ['Brust']),
      makeEntry(todayStr, ['Brust']),
    ]
    const result = buildGroupsByDay(days, trainings)
    expect(result[todayStr].filter((g) => g === 'Brust')).toHaveLength(1)
  })

  it('active day count matches spec summary ("X von 7 Tagen aktiv")', () => {
    const now = new Date()
    const { days, todayStr } = buildDays(now)
    const yesterday = days[5].str
    const trainings = [
      makeEntry(todayStr, ['Brust']),
      makeEntry(yesterday, ['Rücken']),
    ]
    const result = buildGroupsByDay(days, trainings)
    const activeDays = days.filter(({ str }) => result[str].length > 0).length
    expect(activeDays).toBe(2)
  })
})
