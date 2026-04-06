/**
 * Apple Health bridge via iOS Shortcuts URL scheme.
 *
 * Two-step flow:
 *  1. SETUP (once): User opens Shortcuts app, creates "Simple Workout Log".
 *     App stores `apple-health-ready=true` in localStorage after user confirms.
 *  2. RUN: After every save, app opens
 *     shortcuts://run-shortcut?name=Simple+Workout+Log&input=text&text=<groups>
 *
 * Only available on iOS.
 */

export const isIOS = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

export const SHORTCUT_NAME = 'Simple Workout Log'
const STORAGE_KEY = 'apple-health-ready'

export const isHealthReady = (): boolean =>
  localStorage.getItem(STORAGE_KEY) === 'true'

export const markHealthReady = (): void =>
  localStorage.setItem(STORAGE_KEY, 'true')

/** Opens the Shortcuts app (so user can create the shortcut). */
export function openShortcutsApp(): void {
  window.location.href = 'shortcuts://'
}

/** Runs the shortcut with trained muscle groups as text input. */
export function triggerHealthShortcut(muscleGroups: string[]): void {
  const input = encodeURIComponent(muscleGroups.join(', '))
  const name = encodeURIComponent(SHORTCUT_NAME)
  window.location.href = `shortcuts://run-shortcut?name=${name}&input=text&text=${input}`
}

/** Steps the user needs to follow once to create the shortcut. */
export const SHORTCUT_SETUP_STEPS = [
  'Tippe auf „Shortcuts-App öffnen" unten.',
  'Tippe oben rechts auf „+" → neuen Shortcut erstellen.',
  `Benenne ihn exakt: „${SHORTCUT_NAME}"`,
  'Füge die Aktion „Workout aufzeichnen" hinzu (Suche: „Workout").',
  'Typ: Krafttraining — Dauer: „Shortcut-Eingabe fragen" — Kalorien leer.',
  'Oben rechts auf „Fertig" tippen → Shortcut ist gespeichert.',
  'Zurück zu Simple Workout kommen und „Einrichtung abgeschlossen" tippen.',
]
