/**
 * Apple Health bridge via iOS Shortcuts URL scheme.
 *
 * Flow:
 *  1. User installs the "Simple Workout Log" shortcut once (guided in Settings).
 *  2. After every save, the app opens:
 *     shortcuts://run-shortcut?name=Simple+Workout+Log&input=text&text=<groups>
 *  3. The Shortcut receives the muscle group list, asks for duration,
 *     and writes a Strength Training workout to Apple Health.
 *
 * Only available on iOS (Safari + standalone PWA).
 */

export const isIOS = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

export const SHORTCUT_NAME = 'Simple Workout Log'

/** Opens the Shortcut with the trained muscle groups as input text. */
export function triggerHealthShortcut(muscleGroups: string[]): void {
  const input = encodeURIComponent(muscleGroups.join(', '))
  const name = encodeURIComponent(SHORTCUT_NAME)
  window.location.href = `shortcuts://run-shortcut?name=${name}&input=text&text=${input}`
}

/** Steps the user needs to follow once to create the Shortcut. */
export const SHORTCUT_SETUP_STEPS = [
  'Öffne die Shortcuts-App auf deinem iPhone.',
  'Tippe oben rechts auf „+" um einen neuen Shortcut zu erstellen.',
  `Benenne den Shortcut: „${SHORTCUT_NAME}"`,
  'Füge die Aktion „Workout aufzeichnen" hinzu (Suche: „Workout").',
  'Typ: Krafttraining — Dauer: „Shortcut-Eingabe fragen" — Kalorien leer lassen.',
  'Tippe oben rechts auf das Teilen-Symbol → „Zum Startbildschirm" oder einfach speichern.',
  'Fertig! Ab jetzt erscheint nach jedem Speichern in Simple Workout ein Health-Button.',
]
