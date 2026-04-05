# Simple Workout – Projektübersicht

**Version:** 1.4.0 | **Status:** Produktion | **Deployment:** Vercel

---

## Was ist die App?

Simple Workout ist eine Progressive Web App (PWA) zur täglichen Trainingserfassung.
Der Nutzer wählt jeden Tag aus, welche Muskelgruppen er trainiert hat.
Die App speichert diese Auswahl lokal im Browser (IndexedDB) und zeigt ein Dashboard
mit Statistiken und smarten Empfehlungen, was als nächstes trainiert werden sollte.

Nutzer können sich per Google oder E-Mail/Passwort (Supabase Auth) anmelden.
Trainings werden dann geräteübergreifend in der Cloud synchronisiert.
Ohne Login: vollständig offline im Browser (IndexedDB).

---

## Kernfunktionen

### 1. Tägliche Muskelgruppen-Auswahl
- 9 Muskelgruppen zur Auswahl (Mehrfachauswahl)
- Aktive Buttons erscheinen farbig ausgefüllt, inaktive als transparenter Tint
- Speichern-Button: violett wenn Auswahl vorhanden, deaktiviert wenn leer
- Nach dem Speichern: Button zeigt 3 Sekunden „Gespeichert ✓" (grün), danach zurück
- Kein Browser-Alert, keine Modals
- Beim App-Start wird die heutige Auswahl automatisch aus IndexedDB geladen

### 2. Dashboard (Tab: Heute)
- **3 Stats-Kacheln**: Anzahl Trainings, Durchschnitt pro Muskelgruppe, Top-Muskelgruppe
- **Empfehlungen**: Top 3 vernachlässigte Muskelgruppen (Score-basiert, niedrigster Score = dringendster Bedarf)
- **Historie**: Letzte 10 Tage, absteigend nach Datum sortiert
- **Leerer Zustand**: Emoji + Hinweistext wenn noch keine Trainings vorhanden
- **Vergangenen Tag nachtragen**: Dezenter Toggle-Link unterhalb der Historie — klappt ein kompaktes Inline-Formular mit Datumspicker (max. gestern) und Muskelgruppen-Pills auf
- **Alle Daten löschen**: Dezenter Untertext-Link am Ende des Dashboards; nach Klick erscheint ein Inline-Bestätigungsblock mit Trainingsanzahl und Buttons Abbrechen / Ja, alles löschen (kein Modal, kein window.confirm())

### 3. Analytics (Tab: Verlauf)
- **Stats-Zeile**: Gesamt-Trainings, aktuelle Streak (aufeinanderfolgende Tage), Lieblingsgruppe
- **Wöchentliche Aktivität**: Balkendiagramm — Trainingstage pro Woche, letzte 8 Wochen
- **Muskelgruppen-Verteilung**: Horizontales Balkendiagramm — Häufigkeit jeder Gruppe (alle Zeit)
- **Navigation**: Bottom Tab Bar (Heute / Verlauf)
- **Bibliothek**: recharts

### 4. Authentifizierung
- Login / Registrierung per E-Mail + Passwort oder Google OAuth
- Session bleibt erhalten (kein erneuter Login nötig)
- Eingeloggt: Daten in Supabase (PostgreSQL, geräteübergreifend)
- Nicht eingeloggt: Daten in IndexedDB (lokal)

### 5. Einstellungen & Design-Themes
- Zahnrad-Icon oben rechts öffnet SettingsModal (Bottom Sheet auf Mobile)
- **Power Mode** (Standard): dunkles Design mit Violett-Akzent
- **Prinzessin Mode**: helles Rosa-Design mit Pink-Akzent
- Theme-Wechsel sofort wirksam — ohne Reload — über CSS Custom Properties (`data-theme` auf `<html>`)
- Theme und Profil-Name werden lokal in localStorage persistiert (Zustand persist)
- Alle Trainings löschbar über Einstellungen / Dashboard (Sicherheitsabfrage)

---

## Muskelgruppen & Idealfrequenzen

| Muskelgruppe | Ideal pro 10 Tage | Button-Farbe (Tailwind) |
|---|---|---|
| Brust | 2x | red-500 |
| Rücken | 2x | blue-500 |
| Schulter | 2x | violet-500 |
| Bizeps | 1x | orange-500 |
| Trizeps | 1x | pink-500 |
| Beine | 2x | green-500 |
| Mobility | 4x | yellow-500 |
| Ausdauer | 2x | cyan-500 |
| Eisbaden | 3x | indigo-500 |

---

## Empfehlungsalgorithmus

```
score = (trainedInLast10Days / idealFrequency) * 10
```

Die 3 Gruppen mit dem niedrigsten Score werden empfohlen.

**Begründungstext** (in `recommendations.ts → getReason()`):
- 0% des Ziels: `"{Gruppe} brauchte definitiv Arbeit!"`
- < 50%: `"{Gruppe} brauchte noch viel mehr Trainieren!"`
- < 50–100%: `"{Gruppe} brauchte noch etwas mehr Aufmerksamkeit!"`
- ≥ 100%: `"{Gruppe} ist gut im Plan!"`

---

## Projektstruktur

```
simple-workout/
├── public/
│   ├── manifest.json        # PWA Manifest
│   └── sw.js                # Service Worker
├── src/
│   ├── App.tsx              # Root-Komponente (Layout, Header, Footer)
│   ├── index.tsx            # Entry Point
│   ├── index.css            # Tailwind-Basis + Safe-Area-Insets
│   ├── App.css              # Leer / minimale App-Styles
│   ├── components/
│   │   ├── MuscleGroupSelector.tsx   # Buttons + Speichern-Button
│   │   ├── DashboardView.tsx         # Stats, Empfehlungen, Historie
│   │   ├── AnalyticsView.tsx         # Charts: Wochenaktivität, Muskelverteilung
│   │   ├── AddPastTraining.tsx       # Dezentes Inline-Formular: vergangene Trainings nachtragen
│   │   ├── ClearDataButton.tsx       # Alle Trainingsdaten löschen (Inline-Sicherheitsabfrage)
│   │   └── SettingsModal.tsx          # Einstellungen: Theme-Auswahl, Profil-Name, Abmelden
│   │   └── AuthView.tsx              # Login / Registrierung
│   ├── services/
│   │   ├── storage.ts               # IndexedDB via idb (CRUD)
│   │   ├── cloudStorage.ts          # Supabase CRUD
│   │   ├── supabase.ts              # Supabase Client
│   │   ├── analyticsService.ts      # Datentransformationen für Charts
│   │   ├── recommendations.ts       # Score-Algorithmus + getWorkoutStats()
│   │   └── recommendations.test.ts  # Vitest Unit Tests
│   ├── store/
│   │   ├── workoutStore.ts          # Zustand Store (State + Actions)
│   │   ├── authStore.ts             # Auth State (user, signIn, signUp, signOut)
│   │   └── themeStore.ts            # Theme + Profil (persist → localStorage)
│   ├── types/
│   │   ├── index.ts                 # Workout-Typen + Konstanten
│   │   └── theme.ts                 # Theme-Typen, THEMES-Config, UserProfile
├── docs/                    # Dokumentation
├── eslint.config.js         # ESLint v9 Flat Config
├── tailwind.config.ts       # Tailwind Konfiguration
├── vite.config.ts           # Vite + @/ Pfad-Alias
├── tsconfig.json            # TypeScript Konfiguration
├── vercel.json              # Vercel Deployment
└── package.json
```

---

## Tech Stack

| Bereich | Technologie | Version |
|---|---|---|
| Framework | React | 18.2.0 |
| State Management | Zustand | 4.4.1 |
| Persistenz | IndexedDB via `idb` | 8.0.0 |
| Styling | Tailwind CSS | 3.3.6 |
| Build | Vite | 5.x |
| Sprache | TypeScript | 5.2.x |
| Unit Tests | Vitest | 1.x |
| E2E Tests | Cypress | 13.x |
| Linting | ESLint v9 (Flat Config) + typescript-eslint v8 | 9.x / 8.x |
| Formatter | Prettier | 3.x |
| Auth + Cloud DB | Supabase | – |
| Charts | recharts | 2.x |
| Deployment | Vercel | – |

---

## Deployment

Vercel, automatischer Deploy bei Push auf `main`.

`vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "env": { "NODE_ENV": "production" }
}
```

Build-Pipeline: `npm ci` → `tsc && vite build` → Deploy

---

## Glossar

| Begriff | Beschreibung |
|---|---|
| TrainingEntry | Ein gespeichertes Training: id, date, muscleGroups, createdAt |
| DailySelection | Die heutige Auswahl: date + muscleGroups |
| RecommendationItem | Score-Empfehlung: muscleGroup, score, trainedInLast10Days, ideal, reason |
| WorkoutStats | Statistik: totalTrainings, average, topMuscleGroup, muscleGroupFrequency |
| IDEAL_FREQUENCIES | Konstante: Zielfrequenz pro Muskelgruppe in 10 Tagen |
| score | (trained / ideal) * 10 — niedriger = dringender |
| WeeklyBar | Chart-Datenpunkt: { week: 'KW 14', count: number } |
| MuscleBar | Chart-Datenpunkt: { group, count, color } |
| Streak | Aufeinanderfolgende Tage mit mindestens einem Training |
