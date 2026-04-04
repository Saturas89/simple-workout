import { useState } from 'react'
import { useWorkoutStore } from '@/store/workoutStore'

export default function ClearDataButton() {
  const [step, setStep] = useState<'idle' | 'confirm' | 'deleting'>('idle')
  const { clearAllTrainings, allTrainings } = useWorkoutStore()

  const handleRequest = () => setStep('confirm')
  const handleCancel = () => setStep('idle')

  const handleConfirm = async () => {
    setStep('deleting')
    try {
      await clearAllTrainings()
    } finally {
      setStep('idle')
    }
  }

  if (step === 'confirm') {
    return (
      <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-red-400">Alle Daten löschen?</p>
        <p className="text-xs text-gray-400">
          {allTrainings.length} Training{allTrainings.length !== 1 ? 's' : ''} werden unwiderruflich
          gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-400 transition-colors"
          >
            Ja, alles löschen
          </button>
        </div>
      </div>
    )
  }

  if (step === 'deleting') {
    return (
      <div className="mt-6 text-center py-3">
        <p className="text-xs text-gray-500">Wird gelöscht…</p>
      </div>
    )
  }

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleRequest}
        className="text-xs text-gray-600 hover:text-red-400 transition-colors underline underline-offset-2"
      >
        Alle Trainingsdaten löschen
      </button>
    </div>
  )
}
