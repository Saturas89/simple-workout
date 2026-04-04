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

### AddPastTraining (dezentes Inline-Formular)

```
Toggle-Link: text-xs text-gray-600 hover:text-gray-400, flex items-center gap-1
  Text: "+ Vergangenen Tag nachtragen" / "− Vergangenen Tag nachtragen"

Formular (wenn offen):
  mt-3 p-4 bg-gray-800/60 rounded-xl space-y-3 border border-white/5

  Datumspicker:
    w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2
    border border-white/10, focus:border-violet-500
    max = gestern

  Muskelgruppen-Pills (kompakter als Hauptauswahl):
    flex flex-wrap gap-1.5
    Jede Pill: px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150
    Gleiche data-active Farblogik wie MuscleGroupSelector

  Speichern-Button: w-full py-2 rounded-lg text-xs font-bold
    - Leer/kein Datum: bg-white/5 text-gray-600 cursor-not-allowed
    - Bereit:          bg-violet-500 hover:bg-violet-400 text-white
    - Gespeichert:     bg-green-500 text-white, Text "Gespeichert ✓" (1,5s, dann auto-close)
```

---

## Animationen / Transitions

- Muskelgruppen-Buttons: `transition-all duration-150`
- Speichern-Button: `transition-all duration-200`
- Keine weiteren Animationen

---

## Bottom Tab Bar (Navigation)

```
sticky bottom-0 bg-gray-900 border-t border-white/5
  max-w-2xl mx-auto grid grid-cols-2

  Jeder Tab:
    py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors
    Aktiv:   text-violet-400
    Inaktiv: text-gray-500 hover:text-gray-300
```

Tabs: **Heute** | **Verlauf**

---

## AnalyticsView – Charts (recharts)

### Gemeinsame Chart-Styles

| Property | Wert |
|---|---|
| Container | `bg-gray-800 rounded-2xl p-5` |
| Gitterlinien (`CartesianGrid`) | `strokeDasharray="3 3"`, `stroke="#ffffff10"` |
| Achstext | `fill="#9ca3af"`, `fontSize={11}` |
| Tooltip Hintergrund | `#1f2937` (gray-800) |
| Tooltip Text | `#f9fafb` (gray-50) |
| Tooltip Rahmen | `border: none` |

### Wöchentliche Aktivität (BarChart vertikal)

```
ResponsiveContainer width="100%" height={200}
  BarChart data={weeklyData} barSize={24}
    CartesianGrid vertical={false}
    XAxis dataKey="week" → KW-Labels
    YAxis allowDecimals={false}
    Tooltip
    Bar dataKey="count" fill="#8b5cf6" radius={[4,4,0,0]}
```

### Muskelgruppen-Verteilung (BarChart horizontal)

```
ResponsiveContainer width="100%" height={280}
  BarChart layout="vertical" data={muscleData} barSize={14}
    CartesianGrid horizontal={false}
    XAxis type="number" allowDecimals={false}
    YAxis type="category" dataKey="group" width={68}
    Tooltip
    Bar dataKey="count" radius={[0,4,4,0]}
      Cell fill={entry.color}  ← individuelle Farbe je Muskelgruppe
```

### Muskelgruppen-Farben (Hex für recharts)

| Gruppe | Hex |
|---|---|
| Brust | `#ef4444` |
| Rücken | `#3b82f6` |
| Schulter | `#8b5cf6` |
| Bizeps | `#f97316` |
| Trizeps | `#ec4899` |
| Beine | `#22c55e` |
| Mobility | `#eab308` |
| Ausdauer | `#06b6d4` |
| Eisbaden | `#6366f1` |

---

## Responsive

Kein klassisches Responsive-Design notwendig. Die App ist auf `max-w-2xl` beschränkt
und funktioniert durch das simple Layout auf allen Bildschirmgrößen.
Muskelgruppen-Grid: `grid-cols-3` (fix, kein Breakpoint-Wechsel).
