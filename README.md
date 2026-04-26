# Simple Workout

Eine Progressive Web App (PWA) zum einfachen Tracken von Trainingseinheiten und intelligenten Empfehlungen, welche Muskelgruppen als nächstes trainiert werden sollten.

## Features

- **Trainingserfassung** – Muskelgruppen per Tap auswählen und mit Datum speichern
- **Intelligente Empfehlungen** – Algorithmus schlägt vor, welche Muskelgruppen überfällig sind (basierend auf Tagen seit letztem Training und Wochenzielen)
- **Dashboard** – Übersicht der letzten Trainings, Statistiken und Wochenaktivität
- **Analyse** – Charts zur Wochenaktivität und Muskelgruppenverteilung
- **Offline-first** – IndexedDB für lokale Speicherung, kein Login nötig
- **Cloud-Sync** – Optional mit Supabase-Account für geräteübergreifende Synchronisierung
- **PWA** – Installierbar auf dem Homescreen (iOS & Android)
- **Dark Mode** – Standard-Theme; zusätzlich ein helles Theme verfügbar
- **iOS Shortcuts** – Integration für Apple Health (optional)

## Muskelgruppen

Brust · Rücken · Schulter · Bizeps · Trizeps · Beine · Bauch · Mobility · Ausdauer · Eisbaden · Sauna

## Tech Stack

| Bereich | Technologie |
|---------|-------------|
| Frontend | React 18 + TypeScript |
| State | Zustand |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Lokale DB | IndexedDB (`idb`) |
| Cloud | Supabase (Auth + PostgreSQL) |
| Build | Vite |
| Tests | Vitest + Cypress |
| Deployment | Vercel |

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Tests ausführen
npm test

# E2E-Tests (Cypress)
npm run cypress:open
```

### Umgebungsvariablen

Für Cloud-Sync wird ein Supabase-Projekt benötigt. Eine `.env`-Datei im Root-Verzeichnis anlegen:

```env
VITE_SUPABASE_URL=https://<projekt-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Ohne diese Variablen läuft die App vollständig lokal (IndexedDB, kein Login).

## Deployment

Die App wird automatisch bei jedem Push auf `main` über Vercel deployed. Die Umgebungsvariablen müssen im Vercel-Dashboard hinterlegt sein.

Details: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

## Projektstruktur

```
src/
├── components/     # React-Komponenten
├── services/       # Business-Logik (Storage, Empfehlungen, Analytics)
├── store/          # Zustand-Stores (Workout, Auth, Theme)
├── types/          # TypeScript-Typdefinitionen
└── utils/          # Hilfsfunktionen
docs/               # Ausführliche Dokumentation (deutsch)
cypress/            # End-to-End-Tests
```

## Dokumentation

Weiterführende Dokumentation liegt im Ordner [`docs/`](docs/):

- [`docs/PROJECT.md`](docs/PROJECT.md) – Projektübersicht & Architektur
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) – CI/CD & Vercel-Setup
- [`docs/IMPLEMENTATION_DETAILS.md`](docs/IMPLEMENTATION_DETAILS.md) – Technische Details
- [`docs/SECRETS_SECURITY.md`](docs/SECRETS_SECURITY.md) – Sicherheit & Secrets
