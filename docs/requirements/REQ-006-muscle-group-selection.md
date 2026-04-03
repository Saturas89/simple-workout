# REQ-006: Muskelgruppen-Auswahl

**Status:** ✅ Implementiert | **Version:** 1.0.0 | **Priorität:** High

---

## Zusammenfassung

Die 9 Muskelgruppen sind fest vordefiniert. Jede hat eine feste Farbe und eine Idealfrequenz (Zielanzahl Trainings pro 10 Tage), die für den Empfehlungsalgorithmus genutzt wird.

---

## Muskelgruppen

| Muskelgruppe | Idealfrequenz (10 Tage) | Tailwind-Farbe |
|---|---|---|
| Brust | 2 | red |
| Rücken | 2 | blue |
| Schulter | 2 | violet |
| Bizeps | 1 | orange |
| Trizeps | 1 | pink |
| Beine | 2 | green |
| Mobility | 4 | yellow |
| Ausdauer | 2 | cyan |
| Eisbaden | 3 | indigo |

---

## Button-Verhalten

**Inaktiv** (nicht ausgewählt):
```
bg-{color}-500/20  text-{color}-300  border-{color}-500/30
```

**Aktiv** (ausgewählt, via `data-active="true"`):
```
bg-{color}-500  text-white  border-{color}-500
```

Transition: `transition-all duration-150`

---

## Konstanten in `src/types/index.ts`

```typescript
const MUSCLE_GROUPS: MuscleGroup[] = [ ... ]   // Reihenfolge = Anzeige-Reihenfolge im Grid

const IDEAL_FREQUENCIES: Record<MuscleGroup, number> = {
  Brust: 2, Rücken: 2, Schulter: 2, Bizeps: 1, Trizeps: 1,
  Beine: 2, Mobility: 4, Ausdauer: 2, Eisbaden: 3
}
```

---

## Grid-Layout

`grid grid-cols-3 gap-2` — 3 Spalten, fix (kein responsive Breakpoint-Wechsel)
