import { useMemo } from 'react'
import { MuscleGroup, TrainingEntry } from '@/types'

const MUSCLE_EMOJIS: Record<MuscleGroup, string> = {
  Brust:    '🫁',
  Rücken:   '🔙',
  Schulter: '🏋️',
  Bizeps:   '💪',
  Trizeps:  '🦾',
  Beine:    '🦵',
  Mobility: '🧘',
  Ausdauer: '🏃',
  Eisbaden: '🧊',
}

const DE_DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

interface Props {
  trainings: TrainingEntry[]
}

export default function WeeklyActivitySummary({ trainings }: Props) {
  const { days, groupsByDay, todayStr } = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const todayStr = now.toISOString().split('T')[0]

    // last 7 days, oldest first
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      return { str: d.toISOString().split('T')[0], date: d }
    })

    const groupsByDay: Record<string, MuscleGroup[]> = {}
    days.forEach(({ str }) => { groupsByDay[str] = [] })
    trainings.forEach((t) => {
      if (groupsByDay[t.date] !== undefined) {
        t.muscleGroups.forEach((g) => {
          if (!groupsByDay[t.date].includes(g as MuscleGroup)) {
            groupsByDay[t.date].push(g as MuscleGroup)
          }
        })
      }
    })

    return { days, groupsByDay, todayStr }
  }, [trainings])

  const totalDaysActive = days.filter(({ str }) => groupsByDay[str].length > 0).length

  return (
    <div className="space-y-3">
      {/* Summary line */}
      <p className="text-xs text-app-text-3">
        <span className="text-app-text font-semibold">{totalDaysActive}</span> von 7 Tagen aktiv
      </p>

      {/* Day cards */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map(({ str, date }) => {
          const isToday = str === todayStr
          const groups = groupsByDay[str]
          const hasActivity = groups.length > 0

          return (
            <div
              key={str}
              className="flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-1 transition-colors"
              style={{
                background: isToday
                  ? 'rgb(var(--app-primary) / 0.12)'
                  : hasActivity
                    ? 'rgb(var(--app-inner))'
                    : 'rgb(var(--app-inner) / 0.5)',
                border: isToday
                  ? '1px solid rgb(var(--app-primary) / 0.3)'
                  : '1px solid transparent',
              }}
            >
              {/* Day label */}
              <span
                className="text-[10px] font-bold leading-none"
                style={{
                  color: isToday
                    ? 'rgb(var(--app-primary))'
                    : 'rgb(var(--app-text-3))',
                }}
              >
                {DE_DAYS[date.getDay()]}
              </span>
              <span
                className="text-[9px] leading-none"
                style={{
                  color: isToday
                    ? 'rgb(var(--app-primary))'
                    : 'rgb(var(--app-text-3))',
                  opacity: 0.7,
                }}
              >
                {date.getDate()}
              </span>

              {/* Muscle icons or rest dot */}
              <div className="flex flex-col items-center gap-1 mt-0.5 min-h-[20px] justify-center">
                {hasActivity ? (
                  groups.map((g) => (
                    <span key={g} className="text-[11px] leading-none">{MUSCLE_EMOJIS[g]}</span>
                  ))
                ) : (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'rgb(var(--app-border) / 0.15)' }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
