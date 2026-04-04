import { create } from 'zustand'
import { TrainingEntry, DailySelection, MuscleGroup } from '@/types'
import { storageService } from '@/services/storage'
import { cloudStorageService } from '@/services/cloudStorage'
import { supabase } from '@/services/supabase'

interface WorkoutStore {
  allTrainings: TrainingEntry[]
  todaySelection: DailySelection | null
  isLoading: boolean

  initialize: () => Promise<void>
  saveTodaySelection: (muscleGroups: MuscleGroup[]) => Promise<void>
  addTrainingForDate: (date: string, muscleGroups: MuscleGroup[]) => Promise<void>
  getTrainingsFromLastDays: (days: number) => Promise<TrainingEntry[]>
  deleteTraining: (id: string) => Promise<void>
}

const getStorage = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user ? cloudStorageService : storageService
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  allTrainings: [],
  todaySelection: null,
  isLoading: false,

  initialize: async () => {
    set({ isLoading: true })
    try {
      const storage = await getStorage()
      const trainings = await storage.getAllTrainings()
      const today = new Date().toISOString().split('T')[0]
      const todayTraining = trainings.filter((t) => t.date === today).slice(-1)[0]

      set({
        allTrainings: trainings,
        todaySelection: todayTraining
          ? { date: todayTraining.date, muscleGroups: todayTraining.muscleGroups }
          : null,
        isLoading: false,
      })
    } catch (error) {
      console.error('Failed to initialize store:', error)
      set({ isLoading: false })
    }
  },

  saveTodaySelection: async (muscleGroups: MuscleGroup[]) => {
    const today = new Date().toISOString().split('T')[0]
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
}))
