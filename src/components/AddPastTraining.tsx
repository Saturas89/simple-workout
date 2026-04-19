import { useState } from 'react'
import { MUSCLE_GROUPS, MuscleGroup } from '@/types'
import { useWorkoutStore } from '@/store/workoutStore'

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  Brust:    'bg-red-500/20 text-red-300 data-[active=true]:bg-red-500 data-[active=true]:text-white',
  Rücken:   'bg-blue-500/20 text-blue-300 data-[active=true]:bg-blue-500 data-[active=true]:text-white',
  Schulter: 'bg-violet-500/20 text-violet-300 data-[active=true]:bg-violet-500 data-[active=true]:text-white',
  Bizeps:   'bg-orange-500/20 text-orange-300 data-[active=true]:bg-orange-500 data-[active=true]:text-white',
  Trizeps:  'bg-pink-500/20 text-pink-300 data-[active=true]:bg-pink-500 data-[active=true]:text-white',
  Beine:    'bg-green-500/20 text-green-300 data-[active=true]:bg-green-500 data-[active=true]:text-white',
  Mobility: 'bg-yellow-500/20 text-yellow-300 data-[active=true]:bg-yellow-500 data-[active=true]:text-white',
  Ausdauer: 'bg-cyan-500/20 text-cyan-300 data-[active=true]:bg-cyan-500 data-[active=true]:text-white',
  Eisbaden: 'bg-indigo-500/20 text-indigo-300 data-[active=true]:bg-indigo-500 data-[active=true]:text-white',
  Sauna:    'bg-amber-500/20 text-amber-300 data-[active=true]:bg-amber-500 data-[active=true]:text-white',
  Bauch:    'bg-emerald-500/20 text-emerald-300 data-[active=true]:bg-emerald-500 data-[active=true]:text-white',
  Sex:      'bg-rose-500/20 text-rose-300 data-[active=true]:bg-rose-500 data-[active=true]:text-white',
}

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const maxDate = yesterday.toISOString().split('T')[0]

const MAX_COUNT = 5

export default function AddPastTraining() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(maxDate)
  const [counts, setCounts] = useState<Partial<Record<MuscleGroup, number>>>({})
  const [saved, setSaved] = useState(false)
  const { addTrainingForDate } = useWorkoutStore()

  const increment = (group: MuscleGroup) =>
    setCounts((prev) => {
      const current = prev[group] ?? 0
      const next = current >= MAX_COUNT ? 0 : current + 1
      if (next === 0) {
        const { [group]: _, ...rest } = prev
        return rest as Partial<Record<MuscleGroup, number>>
      }
      return { ...prev, [group]: next }
    })

  const totalSelected = Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0)

  const handleSave = async () => {
    if (!date || totalSelected === 0) return
    const muscleGroups = (Object.entries(counts) as [MuscleGroup, number][])
      .flatMap(([group, count]) => Array<MuscleGroup>(count).fill(group))
    await addTrainingForDate(date, muscleGroups)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setCounts({})
      setDate(maxDate)
      setOpen(false)
    }, 1500)
  }

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-app-text-3 hover:text-app-text-2 transition-colors flex items-center gap-1"
      >
        <span>{open ? '−' : '+'}</span>
        <span>Vergangenen Tag nachtragen</span>
      </button>

      {open && (
        <div className="mt-3 p-4 bg-app-inner/60 rounded-xl space-y-3 border border-app-border/5">
          <input
            type="date"
            value={date}
            max={maxDate}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-app-inner text-app-text text-sm rounded-lg px-3 py-2 border border-app-border/10 outline-none focus:border-app-primary transition-colors"
          />

          <div className="flex flex-wrap gap-1.5">
            {MUSCLE_GROUPS.map((group) => {
              const count = counts[group] ?? 0
              return (
                <button
                  key={group}
                  onClick={() => increment(group)}
                  data-active={count > 0}
                  className={`relative px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${MUSCLE_COLORS[group]}`}
                >
                  {group}
                  {count > 1 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-white text-gray-900 text-[10px] font-bold flex items-center justify-center leading-none">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleSave}
            disabled={totalSelected === 0 || !date}
            className={`w-full py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              saved
                ? 'bg-green-500 text-white'
                : totalSelected > 0 && date
                  ? 'bg-app-primary hover:bg-app-primary/90 text-white'
                  : 'bg-app-border/5 text-app-text-3 cursor-not-allowed'
            }`}
          >
            {saved ? 'Gespeichert ✓' : 'Speichern'}
          </button>
        </div>
      )}
    </div>
  )
}
