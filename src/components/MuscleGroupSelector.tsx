import { useState, useEffect } from 'react'
import { MUSCLE_GROUPS, MuscleGroup } from '@/types'
import { useWorkoutStore } from '@/store/workoutStore'

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  Brust: 'bg-red-500/20 text-red-300 border-red-500/30 data-[active=true]:bg-red-500 data-[active=true]:text-white data-[active=true]:border-red-500',
  Rücken:
    'bg-blue-500/20 text-blue-300 border-blue-500/30 data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500',
  Schulter:
    'bg-violet-500/20 text-violet-300 border-violet-500/30 data-[active=true]:bg-violet-500 data-[active=true]:text-white data-[active=true]:border-violet-500',
  Bizeps:
    'bg-orange-500/20 text-orange-300 border-orange-500/30 data-[active=true]:bg-orange-500 data-[active=true]:text-white data-[active=true]:border-orange-500',
  Trizeps:
    'bg-pink-500/20 text-pink-300 border-pink-500/30 data-[active=true]:bg-pink-500 data-[active=true]:text-white data-[active=true]:border-pink-500',
  Beine:
    'bg-green-500/20 text-green-300 border-green-500/30 data-[active=true]:bg-green-500 data-[active=true]:text-white data-[active=true]:border-green-500',
  Mobility:
    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 data-[active=true]:bg-yellow-500 data-[active=true]:text-white data-[active=true]:border-yellow-500',
  Ausdauer:
    'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 data-[active=true]:bg-cyan-500 data-[active=true]:text-white data-[active=true]:border-cyan-500',
  Eisbaden:
    'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 data-[active=true]:bg-indigo-500 data-[active=true]:text-white data-[active=true]:border-indigo-500',
}

export default function MuscleGroupSelector() {
  const [selected, setSelected] = useState<MuscleGroup[]>([])
  const [saved, setSaved] = useState(false)
  const { saveTodaySelection, todaySelection } = useWorkoutStore()

  useEffect(() => {
    if (todaySelection) {
      setSelected(todaySelection.muscleGroups)
    }
  }, [todaySelection])

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setSaved(false)
    setSelected((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    )
  }

  const handleSave = async () => {
    if (selected.length === 0) return
    await saveTodaySelection(selected)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {MUSCLE_GROUPS.map((group) => (
          <button
            key={group}
            onClick={() => toggleMuscleGroup(group)}
            data-active={selected.includes(group)}
            className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${MUSCLE_COLORS[group]}`}
          >
            {group}
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={selected.length === 0}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200
          ${
            saved
              ? 'bg-green-500 text-white'
              : selected.length > 0
                ? 'bg-violet-500 hover:bg-violet-400 text-white'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }`}
      >
        {saved ? 'Gespeichert ✓' : 'Auswahl speichern'}
      </button>
    </div>
  )
}
