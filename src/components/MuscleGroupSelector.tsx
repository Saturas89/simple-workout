import { useState, useEffect } from 'react'
import { MUSCLE_GROUPS, MuscleGroup } from '@/types'
import { useWorkoutStore } from '@/store/workoutStore'

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  Brust: 'bg-red-500',
  Rücken: 'bg-blue-500',
  Schulter: 'bg-purple-500',
  Bizeps: 'bg-orange-500',
  Trizeps: 'bg-pink-500',
  Beine: 'bg-green-500',
  Mobility: 'bg-yellow-500',
  Ausdauer: 'bg-cyan-500',
  Eisbaden: 'bg-indigo-500',
}

export default function MuscleGroupSelector() {
  const [selected, setSelected] = useState<MuscleGroup[]>([])
  const { saveTodaySelection, todaySelection } = useWorkoutStore()

  useEffect(() => {
    if (todaySelection) {
      setSelected(todaySelection.muscleGroups)
    }
  }, [todaySelection])

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setSelected((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    )
  }

  const handleSave = async () => {
    if (selected.length > 0) {
      await saveTodaySelection(selected)
      alert('Trainings-Auswahl gespeichert! 💪')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MUSCLE_GROUPS.map((group) => (
          <button
            key={group}
            onClick={() => toggleMuscleGroup(group)}
            className={`p-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              selected.includes(group)
                ? `${MUSCLE_COLORS[group]} scale-105 shadow-lg`
                : `${MUSCLE_COLORS[group]} opacity-50 hover:opacity-75`
            }`}
            title={`Toggle ${group}`}
          >
            {group}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-700 font-medium">
            Heute: <span className="font-bold">{selected.join(', ')}</span>
          </p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={selected.length === 0}
        className="w-full bg-primary-700 text-white py-3 rounded-lg font-bold hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Auswahl speichern 💾
      </button>
    </div>
  )
}
