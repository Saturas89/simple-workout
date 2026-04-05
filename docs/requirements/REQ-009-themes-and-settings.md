# REQ-009: Themes & Settings System

**Status:** ✅ Implementiert  
**Version:** 1.1.0  
**Letzte Aktualisierung:** 2026-04-05

---

## 📋 Zusammenfassung

Benutzer können zwischen verschiedenen visuellen Designs wählen und ihr Profil personalisieren. Das System speichert alle Einstellungen lokal, sodass die Präferenzen erhalten bleiben.

---

## ✨ Features

### 1. Theme Selector (Designwechsel)

#### Power Mode (Standard - Dunkel)
- **Icon:** 💪
- **Farben:**
  - Primär: Violett (#7c3aed)
  - Hintergrund: Dunkelgrau (#030712)
  - Card: Dunkelgrau (#1f1f2e)
  - Text: Weiß (#ffffff)

#### Prinzessin Mode
- **Icon:** 👑
- **Farben:**
  - Primär: Pink (#ec4899)
  - Hintergrund: Hellrosa (#fdf2f8)
  - Card: Weiß (#ffffff)
  - Text: Dunkles Rosa (#831843)

**Funktionen:**
- [x] 2 Themes zur Auswahl
- [x] Sofortiger Wechsel (ohne Reload) — via CSS Custom Properties auf :root[data-theme]
- [x] Icons für beide Themes
- [x] Theme wird beim Store-Hydrate sofort angewendet (onRehydrateStorage)

### 2. Settings/Profile Modal

**Trigger:**
- Zahnrad-Icon oben rechts in der Header
- Öffnet von unten (Mobile) oder zentriert (Desktop)

**Sections:**

#### 👤 Profil
- [x] Name eingeben & speichern
- [x] Email anzeigen (von Auth)
- [x] Name wird lokal gespeichert
- [ ] Name wird in Header angezeigt (nicht implementiert)

#### 🎨 Design
- [x] 2 Theme Cards zum Auswählen
- [x] Visuelles Feedback (Border + Scale)
- [x] "✓ Aktiv" Badge
- [x] Icon für jedes Theme

#### 👀 Vorschau
- [x] **Entfernt** — Vorschau-Sektion wurde aus dem Modal entfernt (kein Mehrwert, da das Theme sofort im Hintergrund sichtbar ist)

#### Abmelden
- [x] Abmelden-Button am unteren Ende
- [x] Geht zurück zur AuthView

### 3. Persistent Storage

**Was wird gespeichert:**
- Aktuelles Theme (dark/pink)
- Benutzername
- Erstellungsdatum des Profils

**Wo:**
- LocalStorage via Zustand Persist Middleware
- Key: 'theme-store'

**Behaltung:**
- Auch nach Browser-Reload
- Auch nach App-Neustart

### 4. Settings Button in Header

- [x] Zahnrad-Icon (SVG)
- [x] Responsive für Mobile & Desktop
- [x] Hover-Effekt
- [x] Öffnet SettingsModal

---

## 🎨 Design System

### Power Mode (Dunkel)
```
Primär:     #7c3aed (Violett)
Dunkel:     #6d28d9 (Dunkles Violett)
Accent:     #8b5cf6 (Helles Violett)
Background: #030712 (Schwarz)
Card:       #1f1f2e (Dunkelgrau)
Text:       #ffffff (Weiß)
Secondary:  #a1a1aa (Grau)
```

### Prinzessin Mode
```
Primär:     #ec4899 (Pink)
Dunkel:     #db2777 (Dunkles Pink)
Accent:     #f472b6 (Helles Pink)
Background: #fdf2f8 (Hellrosa)
Card:       #ffffff (Weiß)
Text:       #831843 (Dunkles Rosa)
Secondary:  #be185d (Mittleres Pink)
```

---

## 📱 UI/UX Details

### SettingsModal
- **Größe:** 100% Breite auf Mobile, 384px auf Desktop
- **Position:** Bottom Sheet auf Mobile, Center auf Desktop
- **Animation:** Slide up auf Mobile
- **Close Button:** X oben rechts
- **Sticky Header:** Bleibt beim Scrollen sichtbar
- **Sticky Footer:** "Fertig" + "Abmelden" Buttons

### Theme Cards
- **Layout:** Grid 2x1
- **Größe:** Gleich groß
- **State:** Border + Shadow bei Active
- **Animation:** Scale 1.05 bei Active

---

## 🔧 Technische Implementation

### State Management
```typescript
interface ThemeStore {
  theme: 'dark' | 'pink'
  profile: {
    theme: string
    name?: string
    email?: string
    createdAt?: string
  }
  setTheme(theme): void
  updateProfile(profile): void
  getThemeConfig(): ThemeConfig
  getCurrentColors(): ThemeConfig['colors']
}
```

### CSS Custom Properties (Theme Switching)

Theme-Wechsel wird über `data-theme` Attribut auf `document.documentElement` gesteuert.
CSS Custom Properties in `src/index.css`:
```css
:root {
  --app-bg:      3 7 18;       /* gray-950 */
  --app-card:    17 24 39;     /* gray-900 */
  --app-inner:   31 41 55;     /* gray-800 */
  --app-primary: 139 92 246;   /* violet-500 */
  /* ... weitere Farben */
}
:root[data-theme="pink"] {
  --app-bg:      253 242 248;  /* #fdf2f8 */
  --app-card:    252 231 243;  /* #fce7f3 */
  --app-inner:   255 255 255;  /* white */
  --app-primary: 236 72 153;   /* pink-500 */
  /* ... weitere Farben */
}
```

Tailwind-Config erweitert um semantische Farb-Tokens:
```
bg-app-bg / bg-app-card / bg-app-inner
text-app-text / text-app-text-2 / text-app-text-3
bg-app-primary / text-app-primary
border-app-border (mit Opacity-Modifiern, z.B. border-app-border/5)
```

`applyTheme(theme)` wird aufgerufen:
- Beim `setTheme()` (Nutzeraktion)
- Beim `onRehydrateStorage` (App-Start, aus localStorage)

### Zustand Persist
- **Key:** 'theme-store'
- **Storage:** localStorage
- **Partialize:** Nur theme + profile speichern

---

## ✅ Acceptance Criteria

- [x] Zwei Themes verfügbar (Dark + Pink)
- [x] Theme-Auswahl speichert sich lokal
- [x] Settings Modal öffnet/schließt korrekt
- [x] Profile Name wird gespeichert
- [x] Einstellungen überleben Browser-Reload (Zustand persist + onRehydrateStorage)
- [x] Responsive auf Mobile & Desktop
- [x] Theme wird beim Store-Hydrate sofort angewendet (onRehydrateStorage)
- [x] Icons zeigen korrektes Theme (💪 vs 👑)
- [x] Abmelden-Button funktioniert

---

## 📊 Performance Requirements

- **Modal Open:** < 100ms
- **Theme Switch:** < 50ms
- **LocalStorage Write:** < 10ms
- **Persist Initialization:** < 200ms

---

## 🔗 Related Requirements

- REQ-001: PWA Foundation (Profile)
- REQ-002: Workout Management
- REQ-004: Data Storage (Persist)

---

## 📝 Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-04-05 | Claude | Initiale Version mit Power Mode + Prinzessin Mode |
| 1.1.0 | 2026-04-05 | Claude | Fix: Theme-Farben werden jetzt korrekt über CSS Custom Properties angewendet; Vorschau-Sektion entfernt |

