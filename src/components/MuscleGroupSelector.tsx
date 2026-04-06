import { useState, useEffect } from 'react'
import { MUSCLE_GROUPS, MuscleGroup } from '@/types'
import { useWorkoutStore } from '@/store/workoutStore'

const MUSCLE_CONFIG: Record<MuscleGroup, { base: string; active: string; emoji: string }> = {
  Brust:    { emoji: '🫁', base: 'bg-red-500/10 border-red-500/40 text-red-600',       active: 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30' },
  Rücken:   { emoji: '🔙', base: 'bg-blue-500/10 border-blue-500/40 text-blue-600',     active: 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30' },
  Schulter: { emoji: '🏋️', base: 'bg-violet-500/10 border-violet-500/40 text-violet-600', active: 'bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-500/30' },
  Bizeps:   { emoji: '💪', base: 'bg-orange-500/10 border-orange-500/40 text-orange-600', active: 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30' },
  Trizeps:  { emoji: '🦾', base: 'bg-pink-500/10 border-pink-500/40 text-pink-600',     active: 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30' },
  Beine:    { emoji: '🦵', base: 'bg-green-500/10 border-green-500/40 text-green-600',  active: 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30' },
  Mobility: { emoji: '🧘', base: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-600', active: 'bg-yellow-500 border-yellow-500 text-white shadow-lg shadow-yellow-500/30' },
  Ausdauer: { emoji: '🏃', base: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-700',     active: 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30' },
  Eisbaden: { emoji: '🧊', base: 'bg-indigo-500/10 border-indigo-500/40 text-indigo-600', active: 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' },
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
      <div className="grid grid-cols-3 gap-2.5">
        {MUSCLE_GROUPS.map((group) => {
          const isActive = selected.includes(group)
          const cfg = MUSCLE_CONFIG[group]
          return (
            <button
              key={group}
              onClick={() => toggleMuscleGroup(group)}
              className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-200 ${
                isActive ? cfg.active + ' scale-[1.03]' : cfg.base + ' hover:brightness-110'
              }`}
            >
              <span className="text-2xl leading-none">{cfg.emoji}</span>
              <span className="text-xs font-semibold leading-none text-center w-full px-1 truncate">
                {group}
              </span>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={selected.length === 0}
        className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
          saved
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
            : selected.length > 0
              ? 'bg-app-primary hover:bg-app-primary/90 text-white shadow-lg shadow-app-primary/25'
              : 'bg-app-border/8 text-app-text-3 cursor-not-allowed'
        }`}
      >
        {saved
          ? '✓ Gespeichert'
          : selected.length > 0
            ? `${selected.length} Gruppe${selected.length > 1 ? 'n' : ''} speichern`
            : 'Muskelgruppen auswählen'}
      </button>

    </div>
  )
}
