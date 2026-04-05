import { useRef, useState } from 'react'
import { TrainingEntry } from '@/types'
import { useWorkoutStore } from '@/store/workoutStore'

const SNAP_PX = 72          // swipe this far → snap open and show delete button
const AUTO_DELETE_PX = 180  // swipe this far → auto-delete immediately

interface Props {
  training: TrainingEntry
}

export default function SwipeableEntry({ training }: Props) {
  const { deleteTraining } = useWorkoutStore()
  const [offset, setOffset] = useState(0)
  const [animate, setAnimate] = useState(false)   // enables CSS transition (during snap)
  const [removing, setRemoving] = useState(false)  // height-collapse exit animation

  const startX = useRef<number | null>(null)
  const startOffset = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startOffset.current = offset
    setAnimate(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return
    const dx = e.touches[0].clientX - startX.current
    const next = Math.min(0, Math.max(-240, startOffset.current + dx))
    setOffset(next)
  }

  const handleTouchEnd = () => {
    startX.current = null
    setAnimate(true)

    if (offset < -AUTO_DELETE_PX) {
      triggerDelete()
    } else if (offset < -SNAP_PX) {
      setOffset(-SNAP_PX)
    } else {
      setOffset(0)
    }
  }

  const triggerDelete = async () => {
    setAnimate(true)
    setOffset(-240)
    setRemoving(true)
    // wait for slide-out, then actually delete from store
    setTimeout(() => deleteTraining(training.id), 280)
  }

  const closeSwipe = () => {
    setAnimate(true)
    setOffset(0)
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-[max-height,opacity,margin] duration-300 ease-in-out ${
        removing ? 'max-h-0 opacity-0 mb-[-8px]' : 'max-h-24'
      }`}
    >
      {/* Delete background */}
      <div className="absolute inset-0 bg-red-500 flex items-center justify-end pr-5 rounded-xl">
        <button
          onClick={triggerDelete}
          className="flex flex-col items-center gap-0.5"
          aria-label="Training löschen"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-white text-[10px] font-semibold">Löschen</span>
        </button>
      </div>

      {/* Swipeable entry card */}
      <div
        className="relative bg-app-inner p-4 flex items-center gap-3 rounded-xl select-none"
        style={{
          transform: `translateX(${offset}px)`,
          transition: animate ? 'transform 0.25s ease' : 'none',
          willChange: 'transform',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={offset < -10 ? closeSwipe : undefined}
      >
        <div className="w-1.5 h-8 bg-app-primary rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-app-text">
            {new Date(training.date).toLocaleDateString('de-DE', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </p>
          <p className="text-xs text-app-text-3 truncate">{training.muscleGroups.join(', ')}</p>
        </div>
        {/* Swipe hint icon — subtle, visible until first swipe */}
        {offset === 0 && (
          <svg className="w-4 h-4 text-app-text-3/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </div>
    </div>
  )
}
