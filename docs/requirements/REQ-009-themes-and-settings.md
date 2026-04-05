# REQ-009: Themes & Settings System

**Status:** 🟢 DRAFT  
**Version:** 1.0.0  
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
- [ ] 2 Themes zur Auswahl
- [ ] Sofortiger Wechsel (ohne Reload)
- [ ] Icons für beide Themes
- [ ] Smooth Theme-Übergänge

### 2. Settings/Profile Modal

**Trigger:**
- Zahnrad-Icon oben rechts in der Header
- Öffnet von unten (Mobile) oder zentriert (Desktop)

**Sections:**

#### 👤 Profil
- [ ] Name eingeben & speichern
- [ ] Email anzeigen (von Auth)
- [ ] Name wird lokal gespeichert
- [ ] Name wird in Header angezeigt (optional)

#### 🎨 Design
- [ ] 2 Theme Cards zum Auswählen
- [ ] Visuelles Feedback (Border + Scale)
- [ ] "✓ Aktiv" Badge
- [ ] Icon für jedes Theme

#### 👀 Vorschau
- [ ] Zeigt aktuelle Farben
- [ ] Primär Farbe
- [ ] Accent Farbe

#### Abmelden
- [ ] Abmelden-Button am unteren Ende
- [ ] Geht zurück zur AuthView

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

- [ ] Zahnrad-Icon (SVG)
- [ ] Responsive für Mobile & Desktop
- [ ] Hover-Effekt
- [ ] Öffnet SettingsModal

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
}
```

### Zustand Persist
- **Key:** 'theme-store'
- **Storage:** localStorage
- **Partialize:** Nur theme + profile speichern

---

## ✅ Acceptance Criteria

- [ ] Zwei Themes verfügbar (Dark + Pink)
- [ ] Theme-Auswahl speichert sich lokal
- [ ] Settings Modal öffnet/schließt korrekt
- [ ] Profile Name wird gespeichert & angezeigt
- [ ] Einstellungen überleben Browser-Reload
- [ ] Responsive auf Mobile & Desktop
- [ ] Smooth Theme-Übergänge
- [ ] Icons zeigen korrektes Theme (💪 vs 👑)
- [ ] Abmelden-Button funktioniert

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

