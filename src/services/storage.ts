import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { TrainingEntry } from '@/types'

interface SimpleWorkoutDB extends DBSchema {
  trainings: {
    key: string
    value: TrainingEntry
    indexes: { 'by-date': string }
  }
}

let db: IDBPDatabase<SimpleWorkoutDB> | null = null

const getDB = async (): Promise<IDBPDatabase<SimpleWorkoutDB>> => {
  if (db) return db

  db = await openDB<SimpleWorkoutDB>('simple-workout', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('trainings')) {
        const store = db.createObjectStore('trainings', { keyPath: 'id' })
        store.createIndex('by-date', 'date')
      }
    },
  })

  return db
}

export const storageService = {
  async addTraining(training: TrainingEntry): Promise<string> {
    const db = await getDB()
    return db.add('trainings', training)
  },

  async getTraining(id: string): Promise<TrainingEntry | undefined> {
    const db = await getDB()
    return db.get('trainings', id)
  },

  async getAllTrainings(): Promise<TrainingEntry[]> {
    const db = await getDB()
    return db.getAll('trainings')
  },

  async getTrainingsByDate(date: string): Promise<TrainingEntry[]> {
    const db = await getDB()
    return db.getAllFromIndex('trainings', 'by-date', date)
  },

  async getTrainingsInRange(startDate: string, endDate: string): Promise<TrainingEntry[]> {
    const db = await getDB()
    const allTrainings = await db.getAll('trainings')
    return allTrainings.filter((t) => t.date >= startDate && t.date <= endDate)
  },

  async deleteTraining(id: string): Promise<void> {
    const db = await getDB()
    await db.delete('trainings', id)
  },

  async updateTraining(training: TrainingEntry): Promise<string> {
    const db = await getDB()
    return db.put('trainings', training)
  },

  async clearAllTrainings(): Promise<void> {
    const db = await getDB()
    await db.clear('trainings')
  },
}
