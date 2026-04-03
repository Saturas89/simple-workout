import { supabase } from '@/services/supabase'
import { TrainingEntry } from '@/types'

export const cloudStorageService = {
  async addTraining(training: TrainingEntry): Promise<string> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase.from('trainings').insert({
      id: training.id,
      user_id: user.id,
      date: training.date,
      muscle_groups: training.muscleGroups,
      created_at: training.createdAt,
      notes: training.notes ?? null,
    })
    if (error) throw error
    return training.id
  },

  async getAllTrainings(): Promise<TrainingEntry[]> {
    const { data, error } = await supabase.from('trainings').select('*')
    if (error) throw error

    return (data ?? []).map((row) => ({
      id: row.id,
      date: row.date,
      muscleGroups: row.muscle_groups as TrainingEntry['muscleGroups'],
      createdAt: row.created_at,
      notes: row.notes ?? undefined,
    }))
  },

  async deleteTraining(id: string): Promise<void> {
    const { error } = await supabase.from('trainings').delete().eq('id', id)
    if (error) throw error
  },
}
