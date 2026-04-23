import { describe, it, expect } from 'vitest'
import { filterShowcaseTrainings } from '@/utils/showcase'
import { TrainingEntry } from '@/types'

function makeEntry(date: string, muscleGroups: string[]): TrainingEntry {
  return { id: date, date, muscleGroups: muscleGroups as any, createdAt: date }
}

describe('filterShowcaseTrainings', () => {
  it('removes Sex from muscleGroups within a mixed entry', () => {
    const trainings = [makeEntry('2024-01-01', ['Brust', 'Sex', 'Rücken'])]
    const result = filterShowcaseTrainings(trainings)
    expect(result).toHaveLength(1)
    expect(result[0].muscleGroups).toEqual(['Brust', 'Rücken'])
    expect(result[0].muscleGroups).not.toContain('Sex')
  })

  it('removes entries that only contain Sex', () => {
    const trainings = [makeEntry('2024-01-01', ['Sex'])]
    const result = filterShowcaseTrainings(trainings)
    expect(result).toHaveLength(0)
  })

  it('keeps entries without Sex unchanged', () => {
    const trainings = [
      makeEntry('2024-01-01', ['Brust', 'Rücken']),
      makeEntry('2024-01-02', ['Mobility']),
    ]
    const result = filterShowcaseTrainings(trainings)
    expect(result).toHaveLength(2)
    expect(result[0].muscleGroups).toEqual(['Brust', 'Rücken'])
    expect(result[1].muscleGroups).toEqual(['Mobility'])
  })

  it('handles empty array', () => {
    expect(filterShowcaseTrainings([])).toEqual([])
  })

  it('filters across multiple trainings with mixed content', () => {
    const trainings = [
      makeEntry('2024-01-01', ['Sex']),           // only Sex → removed
      makeEntry('2024-01-02', ['Brust', 'Sex']),  // mixed → Sex stripped
      makeEntry('2024-01-03', ['Beine']),         // no Sex → unchanged
    ]
    const result = filterShowcaseTrainings(trainings)
    expect(result).toHaveLength(2)
    expect(result[0].muscleGroups).toEqual(['Brust'])
    expect(result[1].muscleGroups).toEqual(['Beine'])
  })

  it('does not mutate the original trainings array', () => {
    const original = [makeEntry('2024-01-01', ['Brust', 'Sex'])]
    filterShowcaseTrainings(original)
    expect(original[0].muscleGroups).toContain('Sex')
  })

  it('preserves all other entry fields (id, date, createdAt, notes)', () => {
    const entry: TrainingEntry = {
      id: 'abc123',
      date: '2024-06-15',
      muscleGroups: ['Schulter', 'Sex'] as any,
      createdAt: '2024-06-15T10:30:00Z',
      notes: 'Hartes Training',
    }
    const result = filterShowcaseTrainings([entry])
    expect(result[0].id).toBe('abc123')
    expect(result[0].date).toBe('2024-06-15')
    expect(result[0].createdAt).toBe('2024-06-15T10:30:00Z')
    expect(result[0].notes).toBe('Hartes Training')
    expect(result[0].muscleGroups).toEqual(['Schulter'])
  })
})
