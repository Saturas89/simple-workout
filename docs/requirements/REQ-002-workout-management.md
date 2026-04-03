# Anforderung: Workout Management & Planning

**Status:** 🟢 DRAFT  
**ID:** REQ-002  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03  
**Modul:** Workout Management  
**Priorität:** High  

---

## 1. Zusammenfassung

Benutzer können Trainingsplan erstellen, verwalten und organisieren. Ein Trainingsplan besteht aus Übungen mit Sets, Reps, Gewicht und Ruhezeiten. Pläne können vordefinierten Vorlagen basiert oder von Grund auf neu erstellt werden.

---

## 2. Detaillierte Beschreibung

### 2.1 Kontext

Benutzer brauchen eine intuitive Möglichkeit, ihre persönlichen Trainingspläne zu verwalten. Auf dem Handy während des Trainings schnell auf die Übungen zugreifen, am Desktop die Pläne detailliert planen und verwalten.

### 2.2 Benutzer/Stakeholder

- **Trainierende:** Verwalten ihre Workouts
- **Trainer:** Erstellen Plans für Klienten
- **Anfänger:** Nutzen vordefinierte Templates

---

## 3. Akzeptanzkriterien

### 3.1 Workout CRUD

- [ ] **AC-1.1:** Benutzer können neuen Workout erstellen
- [ ] **AC-1.2:** Benutzer können Workout bearbeiten
- [ ] **AC-1.3:** Benutzer können Workout löschen (mit Bestätigung)
- [ ] **AC-1.4:** Benutzer können Workout duplizieren
- [ ] **AC-1.5:** Workouts werden mit Datum und Beschreibung gespeichert

### 3.2 Übung Management

- [ ] **AC-2.1:** Übungen können zu Workout hinzugefügt werden
- [ ] **AC-2.2:** Übungen haben: Name, Sets, Reps, Gewicht, Ruhezeit
- [ ] **AC-2.3:** Übungen können umsortiert werden (Drag & Drop)
- [ ] **AC-2.4:** Übungen können gelöscht werden
- [ ] **AC-2.5:** Übungs-Notizen speichern (z.B. "Langsam ausführen")

### 3.3 Vorlagen/Templates

- [ ] **AC-3.1:** Vordefinierte Workout-Templates verfügbar
- [ ] **AC-3.2:** Templates können als Basis für neuen Workout genutzt werden
- [ ] **AC-3.3:** Benutzer können eigene Templates speichern
- [ ] **AC-3.4:** Templates nach Kategorien sortierbar

### 3.4 UI/UX Anforderungen

- [ ] **AC-4.1:** Mobile: Swipe zum Löschen (iOS-style)
- [ ] **AC-4.2:** Mobile: Plus-Button floating action button für neue Übung
- [ ] **AC-4.3:** Desktop: Keyboard Shortcuts (Ctrl+N für neuer Workout)
- [ ] **AC-4.4:** Desktop: Seitenleiste mit Workout-Liste
- [ ] **AC-4.5:** Aktiven Workout visuell hervorheben

---

## 4. Nicht-funktionale Anforderungen

| Kategorie | Anforderung |
|-----------|------------|
| **Performance** | Laden von 100+ Übungen < 500ms |
| **Speicher** | Bis zu 100 Workouts speichern können |
| **Synchronisation** | Auto-Save nach jeder Änderung |
| **Offline** | Vollständig offline funktionsfähig |
| **Datenvalidation** | Sets/Reps müssen positive Zahlen sein |

---

## 5. Abhängigkeiten

- **REQ-001:** PWA Foundation (benötigt für Offline)
- **REQ-004:** Data Storage & Sync (für Datenspeicherung)

---

## 6. Design / Mockups

```
MOBILE VIEW:
┌──────────────────────┐
│ My Workouts      [☰] │
├──────────────────────┤
│ Chest Day      [>]   │
│ Back Workout   [>]   │
│ Leg Day        [>]   │
├──────────────────────┤
│          [+ NEW]     │
└──────────────────────┘

WORKOUT DETAILS:
┌──────────────────────┐
│ Chest Day       [✎]  │
├──────────────────────┤
│ 1. Bench Press       │
│    4 sets × 8 reps   │
│    Gewicht: 80kg     │
│    Ruhezeit: 2 min   │
│                      │
│ 2. Incline Press     │
│    3 sets × 10 reps  │
│    [swipe to delete]  │
│                      │
│ 3. [+ Add Exercise]  │
└──────────────────────┘
```

---

## 7. Implementierungsnotizen

- **Storage:** Lokale DB (IndexedDB) für Workouts
- **Format:** JSON für Workout-Struktur
- **Versionierung:** Alte Workouts archivieren, nicht löschen
- **Validierung:** Min 1 Übung pro Workout erforderlich

---

## 8. Testkriterien

- [x] Unit Tests für Workout CRUD Operationen
- [x] E2E Tests für Mobile Swipe Gesten
- [x] E2E Tests für Desktop Navigation
- [x] Manuelle Tests der Benutzerflows

---

## 9. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|---------|
| 1.0.0 | 2026-04-03 | Claude | Initiale Version |

