# REQ-002: Tägliche Trainingserfassung

**Status:** ✅ Implementiert | **Version:** 1.0.0 | **Priorität:** High

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

## Komponente

`src/components/MuscleGroupSelector.tsx`

- Liest `todaySelection` aus Zustand-Store beim Mount
- Toggle-State lokal in `useState<MuscleGroup[]>`
- `saveTodaySelection()` aus Store aufrufen → schreibt in IndexedDB
- Button-Zustände: leer / bereit (violett) / gespeichert (grün, 3s)
