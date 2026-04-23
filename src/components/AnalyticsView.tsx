import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useWorkoutStore } from '@/store/workoutStore'
import { useThemeStore } from '@/store/themeStore'
import { analyticsService } from '@/services/analyticsService'
import { filterShowcaseTrainings } from '@/utils/showcase'

export default function AnalyticsView() {
  const { allTrainings } = useWorkoutStore()
  const showcaseMode = useThemeStore((s) => s.showcaseMode)
  const colors = useThemeStore((s) => s.getCurrentColors())

  const filteredTrainings = useMemo(
    () => showcaseMode ? filterShowcaseTrainings(allTrainings) : allTrainings,
    [allTrainings, showcaseMode]
  )

  const weeklyData = useMemo(
    () => analyticsService.getWeeklyActivity(filteredTrainings, 8),
    [filteredTrainings]
  )
  const muscleData = useMemo(() => {
    const data = analyticsService.getMuscleGroupDistribution(filteredTrainings)
    return showcaseMode ? data.filter((d) => d.group !== 'Sex') : data
  }, [filteredTrainings, showcaseMode])
  const streak = useMemo(() => analyticsService.getCurrentStreak(filteredTrainings), [filteredTrainings])
  const favorite = useMemo(
    () => analyticsService.getFavoriteMuscleGroup(filteredTrainings),
    [filteredTrainings]
  )
  const tickStyle = { fill: colors.textSecondary, fontSize: 11 }
  const labelStyle = { fill: colors.text, fontSize: 11 }
  const tooltipStyle = {
    backgroundColor: colors.cardBg,
    border: 'none',
    borderRadius: 8,
    color: colors.text,
    fontSize: 12,
  }

  if (filteredTrainings.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-3xl mb-3">📊</p>
        <p className="text-app-text-2 text-sm">Noch keine Daten für Analysen.</p>
        <p className="text-app-text-3 text-xs mt-1">Speichere dein erstes Training im Tab Heute.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
          <p className="text-2xl font-black text-app-text leading-none">{filteredTrainings.length}</p>
          <p className="text-app-text-2 text-xs mt-2 leading-tight">Gesamt</p>
        </div>
        <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
          <p className="text-2xl font-black text-app-text leading-none">{streak}</p>
          <p className="text-app-text-2 text-xs mt-2 leading-tight">Tage Streak</p>
        </div>
        <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px] overflow-hidden">
          <p className="text-sm font-black text-app-text leading-tight truncate">
            {favorite ?? '–'}
          </p>
          <p className="text-app-text-2 text-xs mt-2 leading-tight">Liebling</p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-app-inner rounded-2xl p-5">
        <p className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-4">
          Wöchentliche Aktivität
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData} barSize={22}>
            <CartesianGrid vertical={false} stroke="rgba(var(--app-border), 0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis
              allowDecimals={false}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
              width={20}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(128, 128, 128, 0.05)" }}
              formatter={(value) => [`${value} Training(s)`, '']}
            />
            <Bar dataKey="count" fill={colors.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle Group Distribution */}
      <div className="bg-app-inner rounded-2xl p-5">
        <p className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-4">
          Muskelgruppen-Verteilung
        </p>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart layout="vertical" data={muscleData} barSize={14}>
            <CartesianGrid horizontal={false} stroke="rgba(var(--app-border), 0.06)" strokeDasharray="3 3" />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="group"
              tick={labelStyle}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(128, 128, 128, 0.05)" }}
              formatter={(value) => [`${value}x trainiert`, '']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {muscleData.map((entry) => (
                <Cell key={entry.group} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
