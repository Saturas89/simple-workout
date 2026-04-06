/**
 * Apple Health bridge via iOS Shortcuts Automation.
 *
 * Since PWAs cannot access HealthKit directly, we guide the user to create
 * a time-based Shortcuts Automation that runs once per day automatically —
 * no button press required.
 *
 * Only available on iOS.
 */

export const isIOS = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

const STORAGE_KEY = 'apple-health-automation-done'

export const isAutomationSetup = (): boolean =>
  localStorage.getItem(STORAGE_KEY) === 'true'

export const markAutomationSetup = (): void =>
  localStorage.setItem(STORAGE_KEY, 'true')

export const resetAutomationSetup = (): void =>
  localStorage.removeItem(STORAGE_KEY)

/** Opens the Shortcuts app on the Automation tab (best-effort deep link). */
export function openShortcutsAutomation(): void {
  window.location.href = 'shortcuts://open-automation'
}

/** Fallback: just open Shortcuts app. */
export function openShortcutsApp(): void {
  window.location.href = 'shortcuts://'
}

/**
 * Step-by-step guide to create a daily Shortcuts Automation.
 * Runs every day at a chosen time, writes a Strength Training workout to Health.
 * "Vor Ausführung fragen" must be disabled for fully automatic execution.
 */
export const AUTOMATION_SETUP_STEPS = [
  'Öffne die Shortcuts-App und tippe unten auf „Automation".',
  'Tippe oben rechts auf „+" → „Neue persönliche Automation".',
  '„Tageszeit" wählen → Uhrzeit festlegen (z. B. 21:00) → „Weiter".',
  '„Aktion hinzufügen" tippen → Suche „Workout" → „Workout aufzeichnen" wählen.',
  'Trainingstyp: Krafttraining — Dauer: gewünschte Zeit eintragen (z. B. 45 Min.).',
  '„Weiter" tippen → den Schalter „Vor Ausführung fragen" AUSSCHALTEN.',
  '„Fertig" tippen — ab jetzt läuft die Automation täglich automatisch.',
]
