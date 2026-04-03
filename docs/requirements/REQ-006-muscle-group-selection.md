# Anforderung: Daily Muscle Group Selection

**Status:** 🟢 DRAFT  
**ID:** REQ-006  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03  
**Modul:** Workout Management  
**Priorität:** High  

---

## 1. Zusammenfassung

Benutzer können für den aktuellen Tag auswählen, welche Muskelgruppe(n) er trainiert. Dies ermöglicht schnelle und einfache Planung des täglichen Trainings.

---

## 2. Funktionale Anforderungen

### 2.1 Muskelgruppen Auswahl

- [ ] **FR-1.1:** Es gibt 8 vordefinierte Muskelgruppen:
  - Brust
  - Rücken
  - Schulter
  - Bizeps
  - Trizeps
  - Beine
  - Mobility
  - Ausdauer (Cardio)

- [ ] **FR-1.2:** Benutzer kann eine oder mehrere Muskelgruppen für heute auswählen
- [ ] **FR-1.3:** Auswahl wird visuell dargestellt (z.B. durch Farbgebung, Icons, oder Checkmarks)
- [ ] **FR-1.4:** Auswahl wird lokal gespeichert (heute's Selektion)
- [ ] **FR-1.5:** Benutzer kann Auswahl jederzeit ändern

### 2.2 UI/UX Anforderungen

- [ ] **FR-2.1:** Muskelgruppen sind auf Mobile leicht erreichbar
- [ ] **FR-2.2:** Muskelgruppen sind auf Desktop gut organisiert
- [ ] **FR-2.3:** Icons oder Bilder für jede Muskelgruppe (optional)
- [ ] **FR-2.4:** Klare Visualisierung welche Muskelgruppen selektiert sind
- [ ] **FR-2.5:** Schnelle Auswahl (wenige Klicks)

### 2.3 Datenverwaltung

- [ ] **FR-3.1:** Tägliche Selektion wird separat von Workouts gespeichert
- [ ] **FR-3.2:** Selektion kann rückgängig gemacht werden
- [ ] **FR-3.3:** Historische Daten (was trainiert wurde) werden aufbewahrt
- [ ] **FR-3.4:** Benutzer kann Selektion exportieren (optional)

### 2.4 Navigation & Filtering (Optional)

- [ ] **FR-4.1:** Nach Muskelgruppe-Selektion können Übungen gefiltert werden (optional)
- [ ] **FR-4.2:** App zeigt nur relevante Übungen für selektierte Muskelgruppen (optional)

---

## 3. Nicht-funktionale Anforderungen

### 3.1 Performance

| Anforderung | Wert |
|-------------|------|
| **Laden der Muskelgruppen** | < 100ms |
| **Speichern der Auswahl** | Sofort (lokal) |
| **UI Responsiveness** | Sofort (kein Laden) |

### 3.2 Usability

- [ ] **NFR-2.1:** Benutzer kann Auswahl in < 10 Sekunden machen
- [ ] **NFR-2.2:** Benutzer braucht keine Anleitung (Selbsterklärend)
- [ ] **NFR-2.3:** Mobile: Buttons sind mindestens 44x44px
- [ ] **NFR-2.4:** Desktop: Klare visuelle Hierarchie

### 3.3 Datenspeicherung

- [ ] **NFR-3.1:** Tägliche Auswahl wird lokal gespeichert
- [ ] **NFR-3.2:** Auswahl synchronisiert mit Cloud (wenn online)
- [ ] **NFR-3.3:** Auswahl bleibt erhalten bei App-Neustart

### 3.4 Accessibility

- [ ] **NFR-4.1:** Alle Buttons haben Alt-Text/Labels
- [ ] **NFR-4.2:** Fokus-Navigation funktioniert
- [ ] **NFR-4.3:** Farbkontrast mindestens 4.5:1

---

## 4. Framework Anforderungen

- [ ] **FW-1:** UI-Komponenten für Muskelgruppen (Buttons, Cards, etc.)
- [ ] **FW-2:** State Management für tägliche Auswahl
- [ ] **FW-3:** LocalStorage API für Persistierung
- [ ] **FW-4:** Optional: Icons/SVGs für Muskelgruppen
- [ ] **FW-5:** Optional: Farbkodierung für Muskelgruppen

---

## 5. Muskelgruppen Definition

```
1. Brust (Chest)
   - Große & kleine Brustmuskeln
   - Pektoral Übungen

2. Rücken (Back)
   - Latissimus, Trapezius, Rhomboid
   - Latzug, Ruder Übungen

3. Schulter (Shoulders)
   - Deltoides (voraus, mittel, hinten)
   - Schulterheben, Drücken

4. Bizeps (Biceps)
   - Bizeps Brachii
   - Bizeps Curls, Klimmzüge

5. Trizeps (Triceps)
   - Trizeps Brachii
   - Trizeps Dips, Extensions

6. Beine (Legs)
   - Quadrizeps, Hamstring, Waden, Glutes
   - Kniebeugen, Beinpresse

7. Mobility (Flexibility)
   - Dehnung, Beweglichkeit
   - Yoga, Stretching, Foam Rolling

8. Ausdauer (Cardio)
   - Herz-Kreislauf Training
   - Laufen, Radfahren, HIIT
```

---

## 6. Beispiel: User Flow

```
1. Benutzer öffnet App
2. Sieht 8 Muskelgruppen als Buttons/Cards
3. Klickt auf "Brust", "Rücken" und "Mobility"
4. Diese 3 sind jetzt markiert/hervorgehoben
5. App zeigt "Heute: Brust, Rücken, Mobility"
6. Benutzer kann Auswahl ändern jederzeit
7. Auswahl wird gespeichert (lokal + Cloud)
```

---

## 7. Abhängigkeiten

- **REQ-001:** PWA Foundation (für Offline-Funktionalität)
- **REQ-002:** Workout Management (Workouts mit Muskelgruppen verknüpft)
- **REQ-004:** Data Storage (Speicherung der Auswahl)

---

## 8. Akzeptanzkriterien

- [ ] **AC-1:** 8 Muskelgruppen sind definiert
- [ ] **AC-2:** Benutzer kann 1+ Muskelgruppen auswählen
- [ ] **AC-3:** Auswahl wird visuell angezeigt
- [ ] **AC-4:** Auswahl wird gespeichert
- [ ] **AC-5:** Auswahl bleibt nach App-Neustart erhalten
- [ ] **AC-6:** Mobile: UI funktioniert gut
- [ ] **AC-7:** Desktop: UI funktioniert gut
- [ ] **AC-8:** Auswahl kann geändert werden

---

## 9. UI/UX Optionen (Implementation losgelöst)

### Option A: Button-Grid (Mobile)
```
[Brust] [Rücken] [Schulter]
[Bizeps] [Trizeps] [Beine]
[Mobility] [Ausdauer]

Selektiert: farbig/hervorgehoben
```

### Option B: Card-Layout (Desktop)
```
+--------+  +--------+  +--------+
| Brust  |  | Rücken |  |Schulter|
+--------+  +--------+  +--------+
Größer, besser für Desktop
```

### Option C: List-Style
```
☐ Brust
☐ Rücken
☐ Schulter
☑ Bizeps
☑ Trizeps
```

---

## 10. Nicht-umfasst (Out of Scope)

- [ ] Automatische Muskelgruppen-Auswahl
- [ ] AI-basierte Empfehlungen
- [ ] Trainings-Verlauf pro Muskelgruppe
- [ ] Muskelgruppen-spezifische Pläne
- [ ] Bilder/Videos von Übungen

---

## 11. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|---------|
| 1.0.0 | 2026-04-03 | Claude | Initiale Version |

