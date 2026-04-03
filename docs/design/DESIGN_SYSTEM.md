# Design System – Simple Workout

**Version:** 1.0.0 | **Theme:** Dark

---

## Design-Prinzipien

- **Dark-First**: Durchgehend dunkles Theme, keine Light-Mode-Alternative
- **Mobile-First**: Max-Breite 2xl (672px), zentriert, single-column
- **Minimal**: Keine Icons, keine Bilder, kein überflüssiges Dekor
- **Direkt**: Inhalte sofort sichtbar, kein Onboarding

---

## Farben

### Hintergründe

| Tailwind-Klasse | Hex | Verwendung |
|---|---|---|
| `bg-gray-950` | #030712 | App-Hintergrund |
| `bg-gray-900` | #111827 | Cards / Sections |
| `bg-gray-800` | #1f2937 | Innere Cards (Stats, Listenzeilen) |
| `bg-gray-900/80` | – | Header (mit backdrop-blur) |

### Akzentfarbe

| Tailwind-Klasse | Verwendung |
|---|---|
| `bg-violet-500` | Speichern-Button (aktiv), Logo-Badge, Empfehlungs-Badge, Verlauf-Balken |
| `hover:bg-violet-400` | Hover-State des Speichern-Buttons |
| `bg-violet-500/20` | Empfehlungs-Rang-Badge Hintergrund |
| `text-violet-300` | Empfehlungs-Rang-Badge Text |

### Status

| Farbe | Tailwind | Verwendung |
|---|---|---|
| Grün | `bg-green-500` | Speichern-Button nach erfolgreichem Speichern |
| Deaktiviert | `bg-white/5`, `text-gray-500` | Speichern-Button wenn keine Auswahl |

### Text

| Tailwind-Klasse | Verwendung |
|---|---|
| `text-white` | Primärer Text, Überschriften |
| `text-gray-400` | Sekundärer Text, Labels |
| `text-gray-500` | Tertiärer Text, Metadaten |
| `text-gray-600` | Footer, sehr dezenter Text |

### Rahmen

| Tailwind-Klasse | Verwendung |
|---|---|
| `border-white/5` | Card-Rahmen (kaum sichtbar) |

---

## Muskelgruppen-Button-Farben

Jede Muskelgruppe hat eine eigene Farbe. Zwei Zustände:
- **Inaktiv**: transparenter Farbton (`bg-{color}-500/20`, `text-{color}-300`, `border-{color}-500/30`)
- **Aktiv** (`data-[active=true]`): volle Farbe (`bg-{color}-500`, `text-white`, `border-{color}-500`)

| Muskelgruppe | Farbe |
|---|---|
| Brust | red |
| Rücken | blue |
| Schulter | violet |
| Bizeps | orange |
| Trizeps | pink |
| Beine | green |
| Mobility | yellow |
| Ausdauer | cyan |
| Eisbaden | indigo |

---

## Typografie

**Font**: System-Font-Stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', …`)

| Verwendung | Tailwind-Klassen |
|---|---|
| Logo-Text | `text-base font-bold` |
| Logo-Subtitle | `text-xs text-gray-400` |
| Section-Label | `text-xs font-semibold text-gray-400 uppercase tracking-wider` |
| Stats-Zahl (groß) | `text-2xl font-black text-white` |
| Stats-Zahl (medium) | `text-lg font-black text-white` |
| Stats-Label | `text-xs text-gray-400 mt-1` |
| Listenzeile Titel | `text-sm font-semibold text-white` |
| Listenzeile Sub | `text-xs text-gray-500` |
| Button | `text-sm font-bold` |
| Muskelgruppen-Button | `text-sm font-semibold` |
| Footer | `text-xs text-gray-600` |

---

## Layout

```
App (min-h-screen, bg-gray-950)
├── Header (sticky, bg-gray-900/80, backdrop-blur, border-b border-white/5)
│   └── Innen: max-w-2xl mx-auto px-4 py-4
│       ├── Logo-Badge (8x8, bg-violet-500, rounded-lg, "SW")
│       └── Title + Subtitle
│
├── Main (max-w-2xl mx-auto px-4 py-6, space-y-6)
│   ├── Section 1: bg-gray-900 rounded-2xl p-5 border border-white/5
│   │   ├── Label ("HEUTE TRAINIEREN")
│   │   └── <MuscleGroupSelector />
│   └── Section 2: bg-gray-900 rounded-2xl p-5 border border-white/5
│       ├── Label ("DASHBOARD")
│       └── <DashboardView />
│
└── Footer (max-w-2xl mx-auto px-4 py-6, text-center, text-gray-600 text-xs)
```

---

## Komponenten

### MuscleGroupSelector

```
grid grid-cols-3 gap-2
  → 9 Buttons (px-3 py-2.5, rounded-xl, border, transition-all)
    data-active=true  → volle Farbe
    data-active=false → transparenter Tint

Speichern-Button (w-full, py-3, rounded-xl, text-sm font-bold):
  - Leer:       bg-white/5, text-gray-500, cursor-not-allowed
  - Bereit:     bg-violet-500, hover:bg-violet-400, text-white
  - Gespeichert: bg-green-500, text-white, Text = "Gespeichert ✓" (3s)
```

### DashboardView – Leer-Zustand

```
py-10 text-center
  🏋️ (text-3xl, mb-3)
  "Noch keine Trainings gespeichert." (text-gray-400 text-sm)
  "Wähle oben deine Muskelgruppen aus." (text-gray-600 text-xs mt-1)
```

### DashboardView – Stats

```
grid grid-cols-3 gap-3
  Jede Kachel: bg-gray-800 rounded-xl p-4
    Zahl:  text-2xl font-black text-white
    Label: text-gray-400 text-xs mt-1
```

### DashboardView – Empfehlungen

```
Label: "NÄCHSTES TRAINING" (text-xs uppercase tracking-wider text-gray-400)
Liste: space-y-2
  Jede Zeile: bg-gray-800 rounded-xl p-4, flex items-center gap-4
    Rang-Badge: w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-bold
    Text: font-semibold text-white text-sm + text-gray-500 text-xs (Reason)
    Rechts: "Nx / Mx" (text-xs text-gray-500)
```

### DashboardView – Historie

```
Label: "LETZTE 10 TAGE"
Liste: space-y-2
  Jede Zeile: bg-gray-800 rounded-xl p-4, flex items-center gap-3
    Balken: w-1.5 h-8 bg-violet-500 rounded-full (shrink-0)
    Datum:  text-sm font-semibold text-white (Wochentag, Tag, Monat)
    Gruppen: text-xs text-gray-500 (komma-separiert)
```

---

## Animationen / Transitions

- Muskelgruppen-Buttons: `transition-all duration-150`
- Speichern-Button: `transition-all duration-200`
- Keine weiteren Animationen

---

## Responsive

Kein klassisches Responsive-Design notwendig. Die App ist auf `max-w-2xl` beschränkt
und funktioniert durch das simple Layout auf allen Bildschirmgrößen.
Muskelgruppen-Grid: `grid-cols-3` (fix, kein Breakpoint-Wechsel).
