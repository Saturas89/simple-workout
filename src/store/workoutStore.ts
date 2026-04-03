import { create } from 'zustand'
import { TrainingEntry, DailySelection, MuscleGroup } from '@/types'
import { storageService } from '@/services/storage'

interface WorkoutStore {
  // State
  allTrainings: TrainingEntry[]
  todaySelection: DailySelection | null
  isLoading: boolean

  // Actions
  initialize: () => Promise<void>
  getTodaySelection: () => Promise<DailySelection | null>
  saveTodaySelection: (muscleGroups: MuscleGroup[]) => Promise<void>
  addTraining: (muscleGroups: MuscleGroup[]) => Promise<void>
  getTrainingsFromLastDays: (days: number) => Promise<TrainingEntry[]>
  deleteTraining: (id: string) => Promise<void>
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  allTrainings: [],
  todaySelection: null,
  isLoading: false,

  initialize: async () => {
    set({ isLoading: true })
    try {
      const trainings = await storageService.getAllTrainings()
      const today = new Date().toISOString().split('T')[0]
      const todaySelection = trainings
        .filter((t) => t.date === today)
        .slice(-1)[0]

      set({
        allTrainings: trainings,
        todaySelection: todaySelection
          ? { date: todaySelection.date, muscleGroups: todaySelection.muscleGroups }
          : null,
        isLoading: false,
      })
    } catch (error) {
      console.error('Failed to initialize store:', error)
      set({ isLoading: false })
    }
  },

  getTodaySelection: async () => {
    const today = new Date().toISOString().split('T')[0]
    const trainings = await storageService.getAllTrainings()
    const todayTraining = trainings.find((t) => t.date === today)

    if (todayTraining) {
      return { date: todayTraining.date, muscleGroups: todayTraining.muscleGroups }
    }
    return null
  },

  saveTodaySelection: async (muscleGroups: MuscleGroup[]) => {
    const today = new Date().toISOString().split('T')[0]
    const training: TrainingEntry = {
      id: `${Date.now()}`,
      date: today,
      muscleGroups,
      createdAt: new Date().toISOString(),
    }

    await storageService.addTraining(training)

    set((state) => ({
      allTrainings: [...state.allTrainings, training],
      todaySelection: { date: today, muscleGroups },
    }))
  },

  addTraining: async (muscleGroups: MuscleGroup[]) => {
    const training: TrainingEntry = {
      id: `${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      muscleGroups,
      createdAt: new Date().toISOString(),
    }

    await storageService.addTraining(training)

    set((state) => ({
      allTrainings: [...state.allTrainings, training],
    }))
  },

  getTrainingsFromLastDays: async (days: number) => {
    const today = new Date()
    const startDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000)
    const trainings = await storageService.getAllTrainings()

    return trainings.filter((t) => {
      const trainingDate = new Date(t.date)
      return trainingDate >= startDate && trainingDate <= today
    })
  },

  deleteTraining: async (id: string) => {
    await storageService.deleteTraining(id)

    set((state) => ({
      allTrainings: state.allTrainings.filter((t) => t.id !== id),
    }))
  },
}))
