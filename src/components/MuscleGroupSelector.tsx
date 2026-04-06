import { useState, useEffect } from 'react'
import { MUSCLE_GROUPS, MuscleGroup } from '@/types'
import { useWorkoutStore } from '@/store/workoutStore'
import {
  isIOS,
  isHealthReady,
  markHealthReady,
  openShortcutsApp,
  triggerHealthShortcut,
  SHORTCUT_NAME,
} from '@/services/appleHealth'

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
  const [lastSaved, setLastSaved] = useState<MuscleGroup[]>([])
  const [healthReady, setHealthReady] = useState(false)
  const { saveTodaySelection, todaySelection } = useWorkoutStore()

  const onIOS = isIOS()

  useEffect(() => {
    setHealthReady(isHealthReady())
  }, [])

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
    setLastSaved(selected)
    setTimeout(() => setSaved(false), 30000)
  }

  const handleConfirmSetup = () => {
    markHealthReady()
    setHealthReady(true)
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

      {/* Apple Health — only on iOS, only after saving */}
      {onIOS && saved && (
        healthReady ? (
          /* Shortcut exists → run it */
          <button
            onClick={() => triggerHealthShortcut(lastSaved)}
            className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
            style={{ background: 'rgba(255,59,48,0.12)', color: '#ff3b30', border: '1px solid rgba(255,59,48,0.25)' }}
          >
            <span>❤️</span>
            <span>In Apple Health speichern</span>
          </button>
        ) : (
          /* First time → guide to create the shortcut */
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#ff3b30' }}>
              ❤️ Apple Health einrichten
            </p>
            <p className="text-xs text-app-text-2 leading-snug">
              Erstelle einmalig den Shortcut „{SHORTCUT_NAME}" in der Shortcuts-App.
              Danach überträgt Simple Workout dein Training automatisch in Apple Health.
            </p>
            <ol className="space-y-1.5">
              {[
                `Tippe auf „Shortcuts-App öffnen"`,
                'Tippe oben rechts auf „+" → Neuer Kurzbefehl',
                `Name: „${SHORTCUT_NAME}"`,
                'Aktion hinzufügen → Suche: „Workout" → „Workout aufzeichnen"',
                'Typ: Krafttraining — Dauer: Eingabe fragen',
                'Oben rechts „Fertig" → zurück zu Simple Workout',
              ].map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-app-text-2">
                  <span
                    className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5"
                    style={{ background: 'rgba(255,59,48,0.2)', color: '#ff3b30' }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
            <div className="flex gap-2 pt-1">
              <button
                onClick={openShortcutsApp}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(255,59,48,0.15)', color: '#ff3b30' }}
              >
                Shortcuts-App öffnen
              </button>
              <button
                onClick={handleConfirmSetup}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-app-inner text-app-text-2"
              >
                Einrichtung abgeschlossen ✓
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
