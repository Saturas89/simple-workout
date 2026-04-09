import { create } from 'zustand'
import { TrainingEntry, DailySelection, MuscleGroup } from '@/types'
import { storageService } from '@/services/storage'
import { cloudStorageService } from '@/services/cloudStorage'
import { supabase } from '@/services/supabase'

interface WorkoutStore {
  allTrainings: TrainingEntry[]
  todaySelection: DailySelection | null
  todayTrainings: TrainingEntry[]   // all entries saved today (multiple allowed)
  isLoading: boolean

  initialize: () => Promise<void>
  saveTodaySelection: (muscleGroups: MuscleGroup[]) => Promise<void>
  addTrainingForDate: (date: string, muscleGroups: MuscleGroup[]) => Promise<void>
  getTrainingsFromLastDays: (days: number) => Promise<TrainingEntry[]>
  deleteTraining: (id: string) => Promise<void>
  clearAllTrainings: () => Promise<void>
}

const getStorage = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user ? cloudStorageService : storageService
}

function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  allTrainings: [],
  todaySelection: null,
  todayTrainings: [],
  isLoading: false,

  initialize: async () => {
    set({ isLoading: true })
    try {
      const storage = await getStorage()
      const trainings = await storage.getAllTrainings()
      const today = localToday()
      const todayEntries = trainings.filter((t) => t.date === today)
      const last = todayEntries.slice(-1)[0]

      set({
        allTrainings: trainings,
        todayTrainings: todayEntries,
        todaySelection: last
          ? { date: last.date, muscleGroups: last.muscleGroups }
          : null,
        isLoading: false,
      })
    } catch (error) {
      console.error('Failed to initialize store:', error)
      set({ isLoading: false })
    }
  },

  saveTodaySelection: async (muscleGroups: MuscleGroup[]) => {
    const today = localToday()
    const training: TrainingEntry = {
      id: `${Date.now()}`,
      date: today,
      muscleGroups,
      createdAt: new Date().toISOString(),
    }

    const storage = await getStorage()
    await storage.addTraining(training)

    set((state) => ({
      allTrainings: [...state.allTrainings, training],
      todayTrainings: [...state.todayTrainings, training],
      todaySelection: { date: today, muscleGroups },
    }))
  },

  addTrainingForDate: async (date: string, muscleGroups: MuscleGroup[]) => {
    const training: TrainingEntry = {
      id: `${Date.now()}`,
      date,
      muscleGroups,
      createdAt: new Date().toISOString(),
    }
    const storage = await getStorage()
    await storage.addTraining(training)
    set((state) => ({ allTrainings: [...state.allTrainings, training] }))
  },

  getTrainingsFromLastDays: async (days: number) => {
    const today = new Date()
    const startDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000)
    const storage = await getStorage()
    const trainings = await storage.getAllTrainings()

    return trainings.filter((t) => {
      const trainingDate = new Date(t.date)
      return trainingDate >= startDate && trainingDate <= today
    })
  },

  deleteTraining: async (id: string) => {
    const storage = await getStorage()
    await storage.deleteTraining(id)

    set((state) => ({
      allTrainings: state.allTrainings.filter((t) => t.id !== id),
    }))
  },

  clearAllTrainings: async () => {
    const storage = await getStorage()
    await storage.clearAllTrainings()

    set({ allTrainings: [], todayTrainings: [], todaySelection: null })
  },
}))
