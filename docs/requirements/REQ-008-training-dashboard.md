# REQ-008: Dashboard & Empfehlungen

**Status:** ✅ Implementiert | **Version:** 1.0.0 | **Priorität:** High

---

## Zusammenfassung

Das Dashboard zeigt drei Bereiche: Statistiken, Empfehlungen und Trainingshistorie.
Alle Daten basieren auf den letzten 10 Tagen aus IndexedDB.

---

## 1. Statistiken

Drei kompakte Kacheln (`grid grid-cols-3 gap-3`):

| Kachel | Wert | Berechnung |
|---|---|---|
| Trainings | `totalTrainings` | Anzahl TrainingEntries in letzten 10 Tagen |
| Ø Muskelgruppen | `average` | `totalTrainings / 9` (auf 1 Dezimalstelle) |
| Top Gruppe | `topMuscleGroup` | Gruppe mit höchster Trainingsfrequenz |

Darstellung: `bg-gray-800 rounded-xl p-4`, Zahl `text-2xl font-black`, Label `text-xs text-gray-400`

---

## 2. Empfehlungen

**Algorithmus** (in `src/services/recommendations.ts`):

```
Für jede Muskelgruppe:
  score = (trainedInLast10Days / IDEAL_FREQUENCIES[gruppe]) * 10

Sortierung: aufsteigend (niedrigster Score = am meisten vernachlässigt)
Anzeige: Top 3
```

**Begründungstext** (`getReason()`):
- 0% des Ziels: `"{Gruppe} brauchte definitiv Arbeit!"`
- 1–49%: `"{Gruppe} brauchte noch viel mehr Trainieren!"`
- 50–99%: `"{Gruppe} brauchte noch etwas mehr Aufmerksamkeit!"`
- ≥ 100%: `"{Gruppe} ist gut im Plan!"`

**Darstellung** jeder Empfehlung:
```
bg-gray-800 rounded-xl p-4, flex items-center gap-4
  Rang-Badge:  w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-bold
  Muskelgruppe: text-sm font-semibold text-white
  Begründung:  text-xs text-gray-500
  Rechts:      "Nx / Mx" (trainiert / ideal), text-xs text-gray-500
```

---

## 3. Leerer Zustand

Wenn noch keine Trainings vorhanden:
```
py-10 text-center
🏋️ (text-3xl)
"Noch keine Trainings gespeichert." (text-gray-400 text-sm)
"Wähle oben deine Muskelgruppen aus." (text-gray-600 text-xs)
```

---

## Nicht implementiert

- Wochenansicht / Kalender → nicht geplant
- Grafiken / Charts → nicht geplant
- Vergleich mit Vorwochen → nicht geplant

---

## Komponente

`src/components/DashboardView.tsx`

- `useEffect` auf `allTrainings` (Zustand-Store) als Dependency
- Ruft `getTrainingsFromLastDays(10)` auf
- Ruft `recommendationService.generateRecommendations(trainings, 3)` auf
- Ruft `recommendationService.getWorkoutStats(trainings)` auf
