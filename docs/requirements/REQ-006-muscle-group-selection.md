# REQ-006: Muskelgruppen-Auswahl

**Status:** ✅ Implementiert | **Version:** 1.3.0 | **Priorität:** High

---

## Zusammenfassung

Die 9 Muskelgruppen sind fest vordefiniert. Jede hat eine feste Farbe, ein Emoji-Icon und eine Idealfrequenz (Zielanzahl Trainings pro 10 Tage). Die Buttons sind als moderne Cards mit Icon + Label gestaltet.

---

## Muskelgruppen

| Muskelgruppe | Idealfrequenz (10 Tage) | Tailwind-Farbe | Icon |
|---|---|---|---|
| Brust | 2 | red | 💪 |
| Rücken | 2 | blue | 🏊 |
| Schulter | 2 | violet | 🏋️ |
| Bizeps | 1 | orange | 🦵 |
| Trizeps | 1 | pink | 🦾 |
| Beine | 2 | green | 🚴 |
| Mobility | 4 | yellow | 🧘 |
| Ausdauer | 2 | cyan | 🏃 |
| Eisbaden | 3 | indigo | 🧊 |

---

## Card-Design

Jeder Button ist eine Karte mit Emoji oben und Label unten (zentriert).

**Inaktiv:**
```
bg-{color}-500/10  border-{color}-500/20  text-{color}-300
hover: brightness-125
```

**Aktiv:**
```
bg-{color}-500  border-{color}-500  text-white
shadow-lg shadow-{color}-500/30  scale-[1.03]
```

Transition: `transition-all duration-200`

---

## Speichern-Button

| Zustand | Aussehen | Label |
|---|---|---|
| Leer | `bg-white/5 text-gray-600 cursor-not-allowed` | „Muskelgruppen auswählen" |
| Bereit | `bg-violet-500 text-white shadow-lg` | „{n} Gruppe(n) speichern" |
| Gespeichert | `bg-green-500 text-white shadow-lg` | „✓ Gespeichert" (3s) |

---

## Konstanten in `src/types/index.ts`

```typescript
const MUSCLE_GROUPS: MuscleGroup[] = [ ... ]   // Reihenfolge = Anzeige-Reihenfolge im Grid

const IDEAL_FREQUENCIES: Record<MuscleGroup, number> = {
  Brust: 2, Rücken: 2, Schulter: 2, Bizeps: 1, Trizeps: 1,
  Beine: 2, Mobility: 4, Ausdauer: 2, Eisbaden: 3
}
```

Icon + Farb-Config in `MUSCLE_CONFIG` in `MuscleGroupSelector.tsx`:
```typescript
const MUSCLE_CONFIG: Record<MuscleGroup, { icon: string; base: string; active: string }> = { ... }
```

---

## Grid-Layout

`grid grid-cols-3 gap-2.5` — 3 Spalten, fix.
Label mit `text-xs truncate` — kein Textüberlauf.
