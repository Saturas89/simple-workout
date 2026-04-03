# REQ-007: Trainingshistorie

**Status:** ✅ Implementiert | **Version:** 1.0.0 | **Priorität:** High

---

## Zusammenfassung

Jedes gespeicherte Training wird dauerhaft in IndexedDB abgelegt. Die letzten 10 Tage werden im Dashboard angezeigt, absteigend nach Datum.

---

## Implementiert

- **FR-7.1** ✅ Jede gespeicherte Auswahl erzeugt einen `TrainingEntry` mit Datum + Muskelgruppen
- **FR-7.2** ✅ Einträge werden dauerhaft in IndexedDB gespeichert (bleiben bei App-Neustart erhalten)
- **FR-7.3** ✅ Dashboard zeigt letzte 10 Tage als Liste
- **FR-7.4** ✅ Liste ist absteigend nach Datum sortiert
- **FR-7.5** ✅ Jede Zeile zeigt: Wochentag + Datum + Muskelgruppen (komma-separiert)

## Nicht implementiert

- Einträge aus der UI löschen → `deleteTraining()` im Store existiert, aber kein UI-Element
- Einträge bearbeiten → nicht geplant
- Export / Import → nicht geplant

---

## Darstellung

```
Listenzeile: bg-gray-800 rounded-xl p-4, flex items-center gap-3
  Balken:  w-1.5 h-8 bg-violet-500 rounded-full
  Datum:   text-sm font-semibold text-white
           Format: "Mo., 3. Apr." (de-DE: weekday:short, day:numeric, month:short)
  Gruppen: text-xs text-gray-500
```

---

## Datenabruf

`getTrainingsFromLastDays(10)` aus dem Zustand-Store  
→ Filtert alle `TrainingEntry` mit Datum innerhalb der letzten 10 Tage  
→ Wird bei jeder Änderung von `allTrainings` neu berechnet (useEffect-Dependency)
