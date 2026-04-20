import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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

export default function AnalyticsView() {
  const { t } = useTranslation()
  const { allTrainings } = useWorkoutStore()

  const weeklyData = useMemo(
    () => analyticsService.getWeeklyActivity(allTrainings, 8),
    [allTrainings]
  )
  const muscleData = useMemo(
    () => analyticsService.getMuscleGroupDistribution(allTrainings),
    [allTrainings]
  )
  const streak = useMemo(() => analyticsService.getCurrentStreak(allTrainings), [allTrainings])
  const favorite = useMemo(
    () => analyticsService.getFavoriteMuscleGroup(allTrainings),
    [allTrainings]
  )
  const colors = useThemeStore((s) => s.getCurrentColors())
  const tickStyle = { fill: colors.textSecondary, fontSize: 11 }
  const labelStyle = { fill: colors.text, fontSize: 11 }
  const tooltipStyle = {
    backgroundColor: colors.cardBg,
    border: 'none',
    borderRadius: 8,
    color: colors.text,
    fontSize: 12,
  }

  if (allTrainings.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-3xl mb-3">📊</p>
        <p className="text-app-text-2 text-sm">{t('analytics.noData')}</p>
        <p className="text-app-text-3 text-xs mt-1">{t('analytics.saveFirstWorkout')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
          <p className="text-2xl font-black text-app-text leading-none">{allTrainings.length}</p>
          <p className="text-app-text-2 text-xs mt-2 leading-tight">{t('analytics.total')}</p>
        </div>
        <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px]">
          <p className="text-2xl font-black text-app-text leading-none">{streak}</p>
          <p className="text-app-text-2 text-xs mt-2 leading-tight">{t('analytics.dayStreak')}</p>
        </div>
        <div className="bg-app-inner rounded-xl p-3 flex flex-col justify-between min-h-[80px] overflow-hidden">
          <p className="text-sm font-black text-app-text leading-tight truncate">
            {favorite ?? '–'}
          </p>
          <p className="text-app-text-2 text-xs mt-2 leading-tight">{t('analytics.favorite')}</p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-app-inner rounded-2xl p-5">
        <p className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-4">
          {t('analytics.weeklyActivity')}
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
              formatter={(value) => [t('analytics.workoutsTooltip', { count: value }), '']}
            />
            <Bar dataKey="count" fill={colors.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle Group Distribution */}
      <div className="bg-app-inner rounded-2xl p-5">
        <p className="text-xs font-semibold text-app-text-2 uppercase tracking-wider mb-4">
          {t('analytics.muscleDistribution')}
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
              formatter={(value) => [t('analytics.trainedTooltip', { count: value }), '']}
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
