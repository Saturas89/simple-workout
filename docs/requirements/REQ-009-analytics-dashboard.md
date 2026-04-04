# REQ-009: Analytics Dashboard

**Status:** 📋 Spezifiziert | **Version:** 1.1.0 | **Priorität:** High

---

## Zusammenfassung

Eine gesonderte Ansicht mit interaktiven Grafiken und Diagrammen zum Trainingsverlauf.
Erreichbar über eine Bottom-Navigation (Tab-Bar) als eigener Tab neben der Hauptansicht.
Alle Daten stammen aus IndexedDB (offline) oder Supabase (eingeloggt) — keine neuen Daten-Endpunkte nötig.

---

## Navigation

Die App erhält eine **Bottom Tab Bar** mit zwei Tabs:

| Tab | Label | Inhalt |
|---|---|---|
| 1 | Heute | MuscleGroupSelector + DashboardView (bestehend) |
| 2 | Verlauf | AnalyticsView (neu) |

Aktiver Tab: violetter Akzent (`text-violet-400`), inaktiv: `text-gray-500`.  
Tab Bar: `bg-gray-900 border-t border-white/5`, sticky am unteren Rand.

---

## Diagramme

### 1. Wöchentliche Aktivität (BarChart)

- **Typ:** Vertikales Balkendiagramm
- **X-Achse:** Letzte 8 Kalenderwochen (Format: `KW 14`, `KW 15`, …)
- **Y-Achse:** Anzahl Trainingstage pro Woche (ganzzahlig, min 0)
- **Balkenfarbe:** `#8b5cf6` (violet-500)
- **Tooltip:** `"{n} Training(s) in KW {x}"`
- **Datenquelle:** Alle `TrainingEntry` — gruppiert nach ISO-Kalenderwoche

### 2. Muskelgruppen-Verteilung (BarChart horizontal)

- **Typ:** Horizontales Balkendiagramm
- **Y-Achse:** Muskelgruppenname
- **X-Achse:** Anzahl Trainings (alle Zeit)
- **Balkenfarbe:** individuell je Muskelgruppe (gleiche Farben wie Selector-Buttons)
- **Sortierung:** Absteigend nach Häufigkeit
- **Tooltip:** `"{gruppe}: {n}x trainiert"`
- **Datenquelle:** Alle `TrainingEntry` — Häufigkeit jeder Muskelgruppe gezählt

### 3. Stats-Zeile (Kennzahlen, keine Grafik)

Drei Kacheln oben im Analytics-Tab:

| Kachel | Wert | Berechnung |
|---|---|---|
| Gesamt | Gesamtanzahl Trainings | `allTrainings.length` |
| Streak | Aufeinanderfolgende Tage mit Training | Rückwärts von heute zählen |
| Lieblingsgruppe | Am häufigsten trainierte Gruppe (aller Zeiten) | Max-Frequenz über alle Einträge |

---

## Analytik-Service (`src/services/analyticsService.ts`)

```typescript
// Liefert Trainingsanzahl pro Woche für die letzten N Wochen
getWeeklyActivity(trainings: TrainingEntry[], weeks: number): WeeklyBar[]
// { week: 'KW 14', count: number }

// Liefert Häufigkeit jeder Muskelgruppe (alle Trainings)
getMuscleGroupDistribution(trainings: TrainingEntry[]): MuscleBar[]
// { group: MuscleGroup, count: number, color: string }

// Liefert aktuelle Streak (aufeinanderfolgende Tage mit Training)
getCurrentStreak(trainings: TrainingEntry[]): number

// Liefert Lieblingsmuskelgruppe aller Zeiten
getFavoriteMuscleGroup(trainings: TrainingEntry[]): MuscleGroup | null
```

---

## Bibliothek

**recharts** — React-native Chart-Bibliothek, TypeScript-Support, kein Canvas.

Verwendete Komponenten:
- `BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`, `Cell`

---

## Design

Konsistent mit dem bestehenden Dark Theme:

| Element | Tailwind / Wert |
|---|---|
| Hintergrund Charts | `bg-gray-800 rounded-2xl p-5` |
| Gitterlinien | `stroke="#ffffff10"` |
| Achstext | `fill="#9ca3af"` (gray-400), `fontSize: 11` |
| Balken (Wochenaktivität) | `#8b5cf6` (violet-500) |
| Balken (Muskelgruppen) | individuelle Farbe je Gruppe |
| Tooltip Hintergrund | `#1f2937` (gray-800) |
| Tooltip Text | `#f9fafb` (gray-50) |
| Section Labels | `text-xs font-semibold text-gray-400 uppercase tracking-wider` |

---

## Komponenten-Struktur

```
src/
├── components/
│   └── AnalyticsView.tsx     # Neuer Analytics-Tab
├── services/
│   └── analyticsService.ts   # Datentransformationen für Charts
```

---

## Nicht implementiert (kein Bedarf)

- Datumsfilter / Zeitraum-Picker → nicht geplant
- Export als PDF/PNG → nicht geplant
- Vergleich zwischen Zeiträumen → nicht geplant
- Liniendiagramm über Gewichts-/Intensitätsprogression → keine Daten vorhanden
