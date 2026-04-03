# Anforderung: Training History & Logging

**Status:** 🟢 DRAFT  
**ID:** REQ-007  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03  
**Modul:** Workout Management  
**Priorität:** High  

---

## 1. Zusammenfassung

Das System speichert automatisch, was der Benutzer an jedem Tag trainiert hat (Muskelgruppen + Datum). So entsteht eine Trainings-Historie für Verlauf und Analyse.

---

## 2. Funktionale Anforderungen

### 2.1 Automatisches Speichern

- [ ] **FR-1.1:** Wenn Benutzer Muskelgruppen auswählt, wird automatisch gespeichert
- [ ] **FR-1.2:** Speicherung erfolgt mit aktuellem Datum
- [ ] **FR-1.3:** Kein manuelles "Speichern"-Button nötig (automatisch)
- [ ] **FR-1.4:** Speicherung erfolgt lokal sofort
- [ ] **FR-1.5:** Speicherung synchronisiert mit Cloud (wenn online)

### 2.2 Training History Anzeige

- [ ] **FR-2.1:** Benutzer kann Trainings-Geschichte anschauen
- [ ] **FR-2.2:** History zeigt Datum + Muskelgruppen
- [ ] **FR-2.3:** History kann gefiltert werden (z.B. nach Datum, Muskelgruppe)
- [ ] **FR-2.4:** History kann sortiert werden (neueste zuerst)
- [ ] **FR-2.5:** Benutzer kann einzelne Einträge löschen (optional)

### 2.3 Datenformat

- [ ] **FR-3.1:** Jeder Eintrag hat: Datum, Muskelgruppen, Zeit (optional)
- [ ] **FR-3.2:** Format: "2026-04-03: Brust, Rücken, Mobility"
- [ ] **FR-3.3:** Mehrfache Einträge pro Tag möglich (z.B. Morgens & Abends)

### 2.4 Statistiken (Optional)

- [ ] **FR-4.1:** Benutzer kann sehen wie oft jede Muskelgruppe trainiert wurde
- [ ] **FR-4.2:** Durchschnitt pro Woche/Monat sichtbar (optional)
- [ ] **FR-4.3:** Trends visualisiert (z.B. Chart)

---

## 3. Nicht-funktionale Anforderungen

### 3.1 Performance

| Anforderung | Wert |
|-------------|------|
| **Speichern** | < 100ms |
| **Laden der History** | < 500ms |
| **Anzahl Einträge** | Mindestens 365 (1 Jahr) |

### 3.2 Datenspeicherung

- [ ] **NFR-2.1:** History wird lokal gespeichert
- [ ] **NFR-2.2:** History synchronisiert mit Cloud
- [ ] **NFR-2.3:** Keine Datenverluste möglich
- [ ] **NFR-2.4:** Daten sind persistent über App-Neustarts

### 3.3 Usability

- [ ] **NFR-3.1:** Benutzer braucht nichts "speichern" (automatisch)
- [ ] **NFR-3.2:** History ist einfach erreichbar
- [ ] **NFR-3.3:** Übersichtliche Darstellung

### 3.4 Datenschutz

- [ ] **NFR-4.1:** Daten gehören dem Benutzer
- [ ] **NFR-4.2:** Benutzer kann Daten exportieren
- [ ] **NFR-4.3:** Benutzer kann Daten löschen

---

## 4. Framework Anforderungen

- [ ] **FW-1:** Database/Storage für History-Einträge
- [ ] **FW-2:** Timestamps für Einträge
- [ ] **FW-3:** Query-Funktionen (Filter, Sort)
- [ ] **FW-4:** Optional: Chart/Graph Library für Statistiken
- [ ] **FW-5:** Optional: Export-Funktionalität (CSV, JSON)

---

## 5. Datenmodell

```typescript
interface TrainingEntry {
  id: string;                    // Eindeutige ID
  date: Date;                    // Datum (z.B. 2026-04-03)
  muscleGroups: string[];        // Array von Muskelgruppen
                                 // z.B. ["Brust", "Rücken"]
  createdAt: Date;               // Wann erstellt
  userId?: string;               // Benutzer ID (optional)
  notes?: string;                // Notizen (optional)
}

// Beispiel Eintrag:
{
  id: "entry-123",
  date: "2026-04-03",
  muscleGroups: ["Brust", "Rücken", "Mobility"],
  createdAt: "2026-04-03T10:30:00Z"
}
```

---

## 6. Example: User Flow

```
1. Benutzer öffnet App
2. Wählt Muskelgruppen: "Brust", "Rücken", "Mobility"
3. System speichert AUTOMATISCH:
   {
     date: "2026-04-03",
     muscleGroups: ["Brust", "Rücken", "Mobility"],
     time: "10:30 AM"
   }
4. Benutzer kann jederzeit History anschauen
5. Sieht: "3. April: Brust, Rücken, Mobility"
6. Kann sehen: Diese Woche 3x Rücken trainiert
```

---

## 7. Abhängigkeiten

- **REQ-006:** Daily Muscle Group Selection (benötigt für Daten)
- **REQ-001:** PWA Foundation (für Offline-Speicherung)
- **REQ-004:** Data Storage & Sync (für Cloud-Sync)

---

## 8. Akzeptanzkriterien

- [ ] **AC-1:** Trainings-Daten werden automatisch gespeichert
- [ ] **AC-2:** Jeder Eintrag hat Datum + Muskelgruppen
- [ ] **AC-3:** History kann angezeigt werden
- [ ] **AC-4:** Mindestens 365 Einträge speicherbar
- [ ] **AC-5:** Daten synchronisieren mit Cloud
- [ ] **AC-6:** Benutzer kann einzelne Einträge löschen
- [ ] **AC-7:** Statistiken zeigen Häufigkeit pro Muskelgruppe
- [ ] **AC-8:** History lädt schnell (< 500ms)

---

## 9. UI/UX Überlegungen

### History Anzeige Optionen:

**Option A: Timeline View**
```
2026-04-03: Brust, Rücken, Mobility
2026-04-02: Beine, Ausdauer
2026-04-01: Schulter, Bizeps, Trizeps
```

**Option B: Calendar View**
```
April 2026
Mo Di Mi Do Fr Sa So
   01 02 03 04 05 06
   Cl Br Rc Lm Be Au  (Abkürzungen)
```

**Option C: Statistics View**
```
Diese Woche:
- Brust: 2x
- Rücken: 3x
- Beine: 1x
- Ausdauer: 2x
```

---

## 10. Nicht-umfasst (Out of Scope)

- [ ] Social Sharing von Trainings-Daten
- [ ] Vergleich mit anderen Benutzern
- [ ] AI-basierte Trainings-Empfehlungen
- [ ] Automatische Trainings-Pläne generieren
- [ ] Video-Tutorials

---

## 11. Unterschied zu REQ-006

```
REQ-006: Daily Muscle Group Selection
  → Was trainiere ich HEUTE?
  → Aktuelle Auswahl

REQ-007: Training History & Logging
  → Was habe ich trainiert?
  → Historische Daten mit Datum
  → Verlauf & Statistiken
```

---

## 12. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|---------|
| 1.0.0 | 2026-04-03 | Claude | Initiale Version |

