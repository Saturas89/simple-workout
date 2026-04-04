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
import { analyticsService } from '@/services/analyticsService'

const axisStyle = { fill: '#9ca3af', fontSize: 11 }

const tooltipStyle = {
  backgroundColor: '#1f2937',
  border: 'none',
  borderRadius: 8,
  color: '#f9fafb',
  fontSize: 12,
}

export default function AnalyticsView() {
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

  if (allTrainings.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-3xl mb-3">📊</p>
        <p className="text-gray-400 text-sm">Noch keine Daten für Analysen.</p>
        <p className="text-gray-600 text-xs mt-1">Speichere dein erstes Training im Tab Heute.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-white">{allTrainings.length}</p>
          <p className="text-gray-400 text-xs mt-1">Trainings gesamt</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-2xl font-black text-white">{streak}</p>
          <p className="text-gray-400 text-xs mt-1">Tage Streak</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-lg font-black text-white truncate">{favorite ?? '–'}</p>
          <p className="text-gray-400 text-xs mt-1">Lieblingsgruppe</p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-gray-800 rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Wöchentliche Aktivität
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData} barSize={22}>
            <CartesianGrid vertical={false} stroke="#ffffff10" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis
              allowDecimals={false}
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              width={20}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: '#ffffff08' }}
              formatter={(value) => [`${value} Training(s)`, '']}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle Group Distribution */}
      <div className="bg-gray-800 rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Muskelgruppen-Verteilung
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart layout="vertical" data={muscleData} barSize={14}>
            <CartesianGrid horizontal={false} stroke="#ffffff10" strokeDasharray="3 3" />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="group"
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              width={68}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: '#ffffff08' }}
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
