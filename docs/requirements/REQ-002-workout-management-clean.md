# REQ-002: Tägliche Trainingserfassung

**Status:** ✅ Implementiert | **Version:** 1.3.0 | **Priorität:** High

---

## Zusammenfassung

Der Nutzer wählt täglich aus, welche Muskelgruppen er trainiert hat, und speichert diese Auswahl. Es gibt kein vollständiges Workout-CRUD (keine Übungen, keine Sets/Reps). Das Konzept ist bewusst simpel: **ein Eintrag pro Tag = eine Liste von Muskelgruppen**.

---

## Implementiert

- **FR-2.1** ✅ 9 Muskelgruppen auswählbar (Mehrfachauswahl)
- **FR-2.2** ✅ Auswahl per Klick auf farbigen Button (Toggle)
- **FR-2.3** ✅ Speichern erzeugt einen `TrainingEntry` in IndexedDB
- **FR-2.4** ✅ Beim App-Start wird die heutige Auswahl automatisch geladen und angezeigt
- **FR-2.5** ✅ Speichern-Button zeigt Feedback: „Gespeichert ✓" für 3 Sekunden (kein Alert)
- **FR-2.6** ✅ Speichern-Button deaktiviert wenn keine Auswahl
- **FR-2.7** ✅ Vergangene Tage nachtragen (dezente Funktion, selten genutzt)
- **FR-2.8** ✅ Alle Trainingsdaten löschen (mit Sicherheitsabfrage, ohne Browser-Dialogs)

## Nicht implementiert (kein Bedarf)

- Workout-Templates → nicht geplant
- Übungen / Sets / Reps → nicht geplant
- Workout bearbeiten / löschen (außer intern) → nicht in der UI
- Notizen zu Trainings → Feld in TrainingEntry vorhanden, aber UI nicht gebaut

---

## Datenmodell

```typescript
interface TrainingEntry {
  id: string          // Date.now().toString()
  date: string        // "YYYY-MM-DD"
  muscleGroups: MuscleGroup[]
  createdAt: string   // ISO-Datetime
  notes?: string      // Optional, UI nicht gebaut
}
```

---

## Komponenten

### `src/components/MuscleGroupSelector.tsx`
- Liest `todaySelection` aus Zustand-Store beim Mount
- Toggle-State lokal in `useState<MuscleGroup[]>`
- `saveTodaySelection()` aus Store aufrufen → schreibt in IndexedDB / Supabase
- Button-Zustände: leer / bereit (violett) / gespeichert (grün, 3s)

### `src/components/AddPastTraining.tsx` (FR-2.7)
- Dezenter Toggle-Link (`+ Vergangenen Tag nachtragen`) am Ende der Historie
- Klappt ein Inline-Formular auf (kein Modal, kein eigener Tab)
- **Datumspicker**: `<input type="date">`, max = gestern (heute hat eigenen Flow)
- **Muskelgruppen-Pills**: kompaktere Variante der Hauptauswahl (`px-2.5 py-1 text-xs`)
- Gleiche Farblogik wie MuscleGroupSelector (`data-active`)
- Nach Speichern: Button zeigt „Gespeichert ✓" (1,5s), Formular klappt automatisch zu
- Store-Action: `addTrainingForDate(date: string, muscleGroups: MuscleGroup[])`
- Sichtbar sowohl im Leer-Zustand als auch unter der gefüllten Historie

### `src/components/ClearDataButton.tsx` (FR-2.8)
- Dezenter Untertext-Link am Ende des Dashboards: „Alle Trainingsdaten löschen"
- Nach Klick: Inline-Bestätigungsblock erscheint (kein Modal, kein `window.confirm()`)
- **Bestätigungsblock**: roter Hintergrund-Tint, Hinweis mit Anzahl der betroffenen Trainings, Buttons „Abbrechen" und „Ja, alles löschen"
- Während Löschvorgang: Ladezustand „Wird gelöscht…"
- Store-Action: `clearAllTrainings()` → löscht aus IndexedDB oder Supabase (je nach Login-Status), setzt `allTrainings: []` und `todaySelection: null`
- Service-Methoden: `storageService.clearAllTrainings()` (IndexedDB `clear()`), `cloudStorageService.clearAllTrainings()` (Supabase DELETE WHERE user_id)
