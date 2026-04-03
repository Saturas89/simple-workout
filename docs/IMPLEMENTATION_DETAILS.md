# Implementation Details – Simple Workout

**Version:** 1.0.0 | **Stand:** 2026-04-03

---

## Supabase Setup (erforderlich für Deployment)

### 1. Projekt anlegen
Unter [supabase.com](https://supabase.com) ein neues Projekt erstellen.

### 2. Datenbank-Tabelle anlegen
Im Supabase SQL-Editor ausführen:

```sql
CREATE TABLE trainings (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  muscle_groups TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own trainings" ON trainings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 3. Environment Variables setzen
In Vercel unter Settings → Environment Variables:
```
VITE_SUPABASE_URL      = https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJ...
```
Beide Werte sind im Supabase Dashboard unter Settings → API zu finden.

### 4. Auth-Einstellungen
Supabase Dashboard → Authentication → Providers → Email: aktiviert (Standard).
E-Mail-Bestätigung kann für einfacheres Onboarding deaktiviert werden.

---

## Tech Stack (exakt)

```
React              18.2.0
react-dom          18.2.0
zustand            4.4.1
idb                8.0.0

Vite               5.x
TypeScript         5.2.x
Tailwind CSS       3.3.6
autoprefixer       10.4.x
postcss            8.4.x

Vitest             1.x
Cypress            13.x

ESLint             9.x
typescript-eslint  8.x
eslint-plugin-react-hooks  5.x
eslint-config-prettier     9.x
eslint-plugin-prettier     5.x
Prettier           3.x
```

---

## TypeScript-Typen (`src/types/index.ts`)

```typescript
type MuscleGroup =
  'Brust' | 'Rücken' | 'Schulter' | 'Bizeps' | 'Trizeps' |
  'Beine' | 'Mobility' | 'Ausdauer' | 'Eisbaden'

const MUSCLE_GROUPS: MuscleGroup[] = [
  'Brust', 'Rücken', 'Schulter', 'Bizeps', 'Trizeps',
  'Beine', 'Mobility', 'Ausdauer', 'Eisbaden'
]

const IDEAL_FREQUENCIES: Record<MuscleGroup, number> = {
  Brust: 2, Rücken: 2, Schulter: 2, Bizeps: 1, Trizeps: 1,
  Beine: 2, Mobility: 4, Ausdauer: 2, Eisbaden: 3
}

interface TrainingEntry {
  id: string          // Date.now() als String
  date: string        // ISO-Datum: "2026-04-03"
  muscleGroups: MuscleGroup[]
  createdAt: string   // ISO-Datetime
  notes?: string
}

interface DailySelection {
  date: string
  muscleGroups: MuscleGroup[]
}

interface RecommendationItem {
  muscleGroup: MuscleGroup
  score: number             // (trained/ideal)*10
  trainedInLast10Days: number
  ideal: number
  reason: string
}

interface WorkoutStats {
  totalTrainings: number
  average: number           // totalTrainings / MUSCLE_GROUPS.length, 1 Dezimalstelle
  topMuscleGroup: MuscleGroup | null
  muscleGroupFrequency: Record<MuscleGroup, number>
}
```

---

## IndexedDB (`src/services/storage.ts`)

Datenbank: `simple-workout`, Version 1  
Object Store: `trainings` (keyPath: `id`, Index: `by-date` auf `date`)

```typescript
// idb-Library
import { openDB, DBSchema, IDBPDatabase } from 'idb'

// Methoden:
storageService.addTraining(training)
storageService.getTraining(id)
storageService.getAllTrainings()
storageService.getTrainingsByDate(date)
storageService.getTrainingsInRange(startDate, endDate)
storageService.deleteTraining(id)
storageService.updateTraining(training)
storageService.clearAllTrainings()
```

---

## Zustand Store (`src/store/workoutStore.ts`)

```typescript
// State
allTrainings: TrainingEntry[]
todaySelection: DailySelection | null
isLoading: boolean

// Actions
initialize()              // Lädt alle Trainings aus IndexedDB beim App-Start
getTodaySelection()       // Gibt heutigen Eintrag zurück oder null
saveTodaySelection(muscleGroups)  // Speichert neuen TrainingEntry für heute
addTraining(muscleGroups) // Wie saveTodaySelection (intern gleich)
getTrainingsFromLastDays(days)    // Filtert nach Datum (letzte N Tage)
deleteTraining(id)        // Löscht aus IndexedDB + State
```

**IDs** werden als `Date.now().toString()` generiert.

---

## Recommendation Service (`src/services/recommendations.ts`)

```typescript
recommendationService.generateRecommendations(trainings, topN = 3)
  // 1. Zählt Frequenz jeder Muskelgruppe in trainings
  // 2. score = (trained / IDEAL_FREQUENCIES[group]) * 10
  // 3. Sortiert aufsteigend (niedrigster Score = dringendster)
  // 4. Gibt die ersten topN zurück

recommendationService.getReason(group, trained, ideal)
  // percentage = Math.round((trained / ideal) * 100)
  // 0%:     "{group} brauchte definitiv Arbeit!"
  // <50%:   "{group} brauchte noch viel mehr Trainieren!"
  // <100%:  "{group} brauchte noch etwas mehr Aufmerksamkeit!"
  // >=100%: "{group} ist gut im Plan!"

recommendationService.getWorkoutStats(trainings)
  // totalTrainings: Anzahl TrainingEntries
  // average: totalTrainings / MUSCLE_GROUPS.length (1 Dezimalstelle)
  // topMuscleGroup: Gruppe mit höchster Frequenz
  // muscleGroupFrequency: Frequenz-Map aller Gruppen
```

---

## Konfigurationsdateien

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  server: { port: 5173, strictPort: false },
  build: { target: 'esnext', outDir: 'dist', sourcemap: false },
})
```

### `tsconfig.json` (Auszug)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

### `tailwind.config.ts`

```typescript
// Nur eine Custom-Color:
colors: {
  primary: {
    50: '#f5f3ff', 100: '#ede9fe', 500: '#a78bfa',
    600: '#9333ea', 700: '#7e22ce', 900: '#4c0519'
  }
}
// Hinweis: primary wird in der aktuellen UI kaum verwendet.
// Stattdessen direkt bg-violet-* und bg-gray-* Klassen.
```

### `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "env": { "NODE_ENV": "production" }
}
```

Keine `functions`-Konfiguration (rein statisches Frontend, kein API-Verzeichnis).

### `eslint.config.js` (ESLint v9 Flat Config)

```javascript
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'eslint.config.js'] },
  tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks, prettier: prettierPlugin },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettierConfig,
)
```

---

## Scripts

```json
"dev":          "vite"
"build":        "tsc && vite build"
"preview":      "vite preview"
"lint":         "eslint src --fix"
"type-check":   "tsc --noEmit"
"test":         "vitest run"
"test:watch":   "vitest"
"test:e2e":     "cypress run"
"test:e2e:open":"cypress open"
```

---

## Pfad-Alias

`@/` → `src/`  
Beispiel: `import { useWorkoutStore } from '@/store/workoutStore'`

Konfiguriert in: `vite.config.ts` (für Build) + `tsconfig.json` (für TypeScript).

---

## Datenpersistenz

Daten werden in **IndexedDB** gespeichert (nicht localStorage).  
Bleiben erhalten bei: Tab schließen, Browser neu starten, App neu laden.  
Gehen verloren bei: Browser-Cache löschen, Privatmodus.  
Keine geräteübergreifende Synchronisation.

---

## Deployment-Checkliste

```
☐ npm run build  → muss lokal erfolgreich sein
☐ npm run lint   → keine Fehler (Warnings OK)
☐ package-lock.json ist committed (npm ci braucht es)
☐ Kein api/-Verzeichnis → keine functions-Config in vercel.json
☐ Push auf main → Vercel deployed automatisch
```
