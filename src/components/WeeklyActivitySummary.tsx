import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
  Sauna:    '🧖',
  Bauch:    '🤸',
  Sex:      '💋',
}

const LOCALE_MAP: Record<string, string> = { de: 'de-DE', en: 'en-US' }

interface Props {
  trainings: TrainingEntry[]
}

export default function WeeklyActivitySummary({ trainings }: Props) {
  const { i18n, t } = useTranslation()
  const locale = LOCALE_MAP[i18n.language] ?? i18n.language

  const { days, countByDay, todayStr } = useMemo(() => {
    const toLocalStr = (d: Date) => {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const todayStr = toLocalStr(now)

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      return { str: toLocalStr(d), date: d }
    })

    // Count how many times each group was trained per day
    const countByDay: Record<string, Partial<Record<MuscleGroup, number>>> = {}
    days.forEach(({ str }) => { countByDay[str] = {} })

    trainings.forEach((t) => {
      if (countByDay[t.date] !== undefined) {
        t.muscleGroups.forEach((g) => {
          const group = g as MuscleGroup
          countByDay[t.date][group] = (countByDay[t.date][group] ?? 0) + 1
        })
      }
    })

    return { days, countByDay, todayStr }
  }, [trainings])

  const totalDaysActive = days.filter(({ str }) =>
    Object.keys(countByDay[str]).length > 0
  ).length

  const formatDay = (date: Date) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)

  return (
    <div className="space-y-3">
      <p className="text-xs text-app-text-3">
        <span className="text-app-text font-semibold">{totalDaysActive}</span>{' '}
        {t('weeklyActivity.activeDays')}
      </p>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map(({ str, date }) => {
          const isToday = str === todayStr
          const counts = countByDay[str]
          const groups = Object.keys(counts) as MuscleGroup[]
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
                style={{ color: isToday ? 'rgb(var(--app-primary))' : 'rgb(var(--app-text-3))' }}
              >
                {formatDay(date)}
              </span>
              <span
                className="text-[9px] leading-none"
                style={{
                  color: isToday ? 'rgb(var(--app-primary))' : 'rgb(var(--app-text-3))',
                  opacity: 0.7,
                }}
              >
                {date.getDate()}
              </span>

              {/* Activity */}
              <div className="flex flex-col items-center gap-0.5 mt-0.5 min-h-[20px] justify-center">
                {hasActivity ? (
                  groups.map((g) => {
                    const count = counts[g]!
                    return (
                      <div key={g} className="flex items-center gap-0.5 leading-none">
                        {count > 1 && (
                          <span
                            className="text-[8px] font-bold tabular-nums leading-none"
                            style={{ color: 'rgb(var(--app-primary))' }}
                          >
                            {count}×
                          </span>
                        )}
                        <span className="text-[11px] leading-none">{MUSCLE_EMOJIS[g]}</span>
                      </div>
                    )
                  })
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
