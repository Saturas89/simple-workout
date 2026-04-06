import { useMemo } from 'react'
import { MUSCLE_GROUPS, MuscleGroup, TrainingEntry } from '@/types'
import { MUSCLE_ICONS } from '@/components/MuscleIcons'

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  Brust:    '#ef4444',
  Rücken:   '#3b82f6',
  Schulter: '#8b5cf6',
  Bizeps:   '#f97316',
  Trizeps:  '#ec4899',
  Beine:    '#22c55e',
  Mobility: '#eab308',
  Ausdauer: '#06b6d4',
  Eisbaden: '#6366f1',
}

const DE_DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

interface Props {
  trainings: TrainingEntry[]
}

export default function WeeklyMuscleGrid({ trainings }: Props) {
  const { days, trainedByDay, todayStr } = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const todayStr = now.toISOString().split('T')[0]

    // last 7 days, oldest first
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      return { str: d.toISOString().split('T')[0], date: d }
    })

    const trainedByDay: Record<string, Set<MuscleGroup>> = {}
    days.forEach(({ str }) => { trainedByDay[str] = new Set() })
    trainings.forEach((t) => {
      if (trainedByDay[t.date]) {
        t.muscleGroups.forEach((g) => trainedByDay[t.date].add(g as MuscleGroup))
      }
    })

    return { days, trainedByDay, todayStr }
  }, [trainings])

  return (
    <div className="bg-app-inner rounded-xl p-4">
      {/* Day header row */}
      <div className="flex items-end mb-3">
        {/* spacer for icon column */}
        <div className="w-8 shrink-0" />
        {days.map(({ str, date }) => {
          const isToday = str === todayStr
          return (
            <div key={str} className="flex-1 flex flex-col items-center gap-0.5">
              <span
                className="text-[10px] font-bold"
                style={{ color: isToday ? 'rgb(var(--app-primary))' : 'rgb(var(--app-text-3))' }}
              >
                {DE_DAYS[date.getDay()]}
              </span>
              <span
                className="text-[9px]"
                style={{
                  color: isToday ? 'rgb(var(--app-primary))' : 'rgb(var(--app-text-3))',
                  opacity: 0.7,
                }}
              >
                {date.getDate()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Muscle group rows */}
      <div className="space-y-2">
        {MUSCLE_GROUPS.map((group) => {
          const Icon = MUSCLE_ICONS[group]
          const color = MUSCLE_COLORS[group]
          const trainedThisWeek = days.some(({ str }) => trainedByDay[str].has(group))

          return (
            <div key={group} className="flex items-center">
              {/* Muscle icon */}
              <div className="w-8 shrink-0 flex items-center">
                <Icon
                  className="w-4 h-4 transition-colors"
                  style={{ color: trainedThisWeek ? color : 'rgb(var(--app-text-3) / 0.3)' }}
                />
              </div>

              {/* Day dots */}
              {days.map(({ str }) => {
                const trained = trainedByDay[str].has(group)
                const isToday = str === todayStr
                return (
                  <div key={str} className="flex-1 flex justify-center">
                    <div
                      className="rounded-full transition-all duration-300"
                      style={
                        trained
                          ? {
                              width: 16,
                              height: 16,
                              backgroundColor: color,
                              boxShadow: `0 0 8px ${color}55`,
                              transform: 'scale(1)',
                            }
                          : {
                              width: 10,
                              height: 10,
                              backgroundColor: isToday
                                ? 'rgb(var(--app-primary) / 0.15)'
                                : 'rgb(var(--app-border) / 0.1)',
                              border: isToday ? '1px solid rgb(var(--app-primary) / 0.3)' : undefined,
                            }
                      }
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-app-border/8 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-app-primary/20 border border-app-primary/30" />
          <span className="text-[9px] text-app-text-3">Heute</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#8b5cf6', boxShadow: '0 0 6px #8b5cf655' }} />
          <span className="text-[9px] text-app-text-3">Trainiert</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-app-border/10" />
          <span className="text-[9px] text-app-text-3">Nicht trainiert</span>
        </div>
      </div>
    </div>
  )
}
