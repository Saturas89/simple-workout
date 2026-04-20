import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TrainingEntry } from '@/types'
import { useWorkoutStore } from '@/store/workoutStore'

// Swipe past this point → entry commits and deletes itself
const COMMIT_PX = 110

const LOCALE_MAP: Record<string, string> = { de: 'de-DE', en: 'en-US' }

interface Props {
  training: TrainingEntry
}

export default function SwipeableEntry({ training }: Props) {
  const { i18n } = useTranslation()
  const locale = LOCALE_MAP[i18n.language] ?? i18n.language
  const { deleteTraining } = useWorkoutStore()
  const [offset, setOffset] = useState(0)
  const [animate, setAnimate] = useState(false)
  const [removing, setRemoving] = useState(false)

  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)
  const startOffset = useRef(0)
  const isHorizontal = useRef<boolean | null>(null)

  const progress = Math.min(1, Math.abs(offset) / COMMIT_PX)

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    startOffset.current = offset
    isHorizontal.current = null
    setAnimate(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    // Lock axis on first meaningful movement
    if (isHorizontal.current === null && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy)
    }
    if (!isHorizontal.current) return

    e.preventDefault()
    const next = Math.min(0, Math.max(-260, startOffset.current + dx))
    setOffset(next)
  }

  const handleTouchEnd = () => {
    startX.current = null
    startY.current = null
    setAnimate(true)

    if (offset < -COMMIT_PX) {
      // Commit: slide fully out then collapse
      setOffset(-320)
      setRemoving(true)
      setTimeout(() => deleteTraining(training.id), 320)
    } else {
      // Snap back with spring feel
      setOffset(0)
    }
    isHorizontal.current = null
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        maxHeight: removing ? 0 : 72,
        opacity: removing ? 0 : 1,
        marginBottom: removing ? -8 : 0,
        transition: removing
          ? 'max-height 0.3s ease, opacity 0.25s ease, margin-bottom 0.3s ease'
          : undefined,
      }}
    >
      {/* Subtle background hint — appears as you swipe */}
      <div
        className="absolute inset-0 rounded-xl flex items-center justify-end pr-5 pointer-events-none"
        style={{
          background: `rgba(239,68,68, ${progress * 0.15})`,
        }}
      >
        <svg
          className="w-4 h-4 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ opacity: progress, transform: `scale(${0.6 + progress * 0.4})` }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>

      {/* Card */}
      <div
        className="relative bg-app-inner p-4 flex items-center gap-3 rounded-xl select-none"
        style={{
          transform: `translateX(${offset}px)`,
          transition: animate ? 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
          opacity: 1 - progress * 0.25,
          willChange: 'transform',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-1.5 h-8 bg-app-primary rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-sm font-semibold text-app-text">
              {(() => {
                const [y, m, d] = training.date.split('-').map(Number)
                return new Date(y, m - 1, d).toLocaleDateString(locale, {
                  weekday: 'short', day: 'numeric', month: 'short',
                })
              })()}
            </p>
            {training.createdAt && (
              <span className="text-[11px] text-app-text-3">
                {new Date(training.createdAt).toLocaleTimeString(locale, {
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            )}
          </div>
          <p className="text-xs text-app-text-3 truncate">{training.muscleGroups.join(', ')}</p>
        </div>
      </div>
    </div>
  )
}
