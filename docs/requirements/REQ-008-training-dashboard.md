# Anforderung: Training Dashboard & Smart Recommendations

**Status:** 🟢 DRAFT  
**ID:** REQ-008  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03  
**Modul:** Workout Management / Analytics  
**Priorität:** High  

---

## 1. Zusammenfassung

Ein schönes Dashboard, das Trainings-Statistiken anzeigt und intelligente Empfehlungen gibt, welche Muskelgruppen als nächstes trainiert werden sollten, basierend auf den letzten 10 Tagen und individuellen Trainings-Zielen.

---

## 2. Funktionale Anforderungen

### 2.1 Dashboard Übersicht

- [ ] **FR-1.1:** Dashboard zeigt Trainings-Statistiken
- [ ] **FR-1.2:** Verschiedene Zeit-Ansichten: Woche, Monat
- [ ] **FR-1.3:** Dashboard ist responsive (Mobile + Desktop)
- [ ] **FR-1.4:** Daten aktualisieren automatisch
- [ ] **FR-1.5:** Dashboard ist schnell zu laden (< 1 Sekunde)

### 2.2 Wochenansicht

- [ ] **FR-2.1:** Zeigt letzte 7 Tage
- [ ] **FR-2.2:** Pro Tag sichtbar: Muskelgruppen trainiert
- [ ] **FR-2.3:** Visuell: Grid/Kalender Format
- [ ] **FR-2.4:** Total pro Woche: Anzahl Trainings
- [ ] **FR-2.5:** Navigierbar zwischen Wochen (vorherige/nächste)

### 2.3 Monatsansicht

- [ ] **FR-3.1:** Zeigt ganzen Monat (30/31 Tage)
- [ ] **FR-3.2:** Pro Tag sichtbar: Muskelgruppen trainiert
- [ ] **FR-3.3:** Heatmap: Intensität des Trainings visuell
- [ ] **FR-3.4:** Total pro Monat: Anzahl Trainings
- [ ] **FR-3.5:** Navigierbar zwischen Monaten

### 2.4 Filterbar & Statistiken

- [ ] **FR-4.1:** Filter nach Muskelgruppe
- [ ] **FR-4.2:** Zeigt: Wie oft wurde jede Muskelgruppe trainiert
- [ ] **FR-4.3:** Ranking: Meisttrainiert → Wenigsttrainiert
- [ ] **FR-4.4:** Prozentuale Verteilung (z.B. "20% Brust")
- [ ] **FR-4.5:** Vergleich mit Ideal-Häufigkeit

### 2.5 Smart Recommendations Engine

- [ ] **FR-5.1:** Basiert auf letzten 10 Tagen
- [ ] **FR-5.2:** Berechnet welche Muskelgruppen untertrainiert sind
- [ ] **FR-5.3:** Gibt TOP 3 Empfehlungen
- [ ] **FR-5.4:** Berücksichtigt Trainings-Ziele (siehe Punkt 3)
- [ ] **FR-5.5:** Zeigt Begründung der Empfehlung

---

## 3. Trainings-Ziele (Basis für Empfehlungen)

```
Ideal-Häufigkeit pro Woche:
- Brust: 2x
- Rücken: 2x
- Schulter: 2x
- Bizeps: 1x
- Trizeps: 1x
- Beine: 2x
- Mobility: 4x ← WICHTIG!
- Ausdauer (Cardio): 2x
- Eisbaden: 3x ← WICHTIG!

Total ideal: ~19 Trainings pro Woche
```

### 3.1 Personalisierbare Ziele (Optional)

- [ ] **FR-6.1:** Benutzer kann Ziele anpassen
- [ ] **FR-6.2:** Speichert Benutzer-Ziele
- [ ] **FR-6.3:** Empfehlungen basieren auf individuellen Zielen

---

## 4. Recommendation Algorithm

```
Basis: Letzte 10 Tage

Für jede Muskelgruppe:
1. Zähle: Wie oft trainiert in letzten 10 Tagen?
2. Berechne: (Trainiert / Ideal * 10) = Score
3. Sortiere: Muskelgruppen mit niedrigstem Score

Beispiel:
- Eisbaden: 1x in 10 Tagen, Ideal: 3x
  Score: (1/3) * 10 = 3.3 ← LOW (Empfehlung!)
  
- Mobility: 3x in 10 Tagen, Ideal: 4x
  Score: (3/4) * 10 = 7.5 ← MEDIUM
  
- Brust: 2x in 10 Tagen, Ideal: 2x
  Score: (2/2) * 10 = 10 ← OK

TOP 3 Empfehlungen: Eisbaden, Mobility, Schulter
```

---

## 5. UI/UX Komponenten

### 5.1 Header

```
Training Dashboard
Woche: 3. März - 9. März [ ← ] [ → ]
Oder
Monat: März 2026 [ ← ] [ → ]
```

### 5.2 Statistiken Übersicht

```
┌─────────────────────────────────┐
│ Diese Woche: 12 Trainings       │
│ Durchschnitt: 1.7x pro Muskelgruppe │
│ Top Muskelgruppe: Brust (3x)    │
└─────────────────────────────────┘
```

### 5.3 Wochenkalender (Wochenansicht)

```
Mo 03  Di 04  Mi 05  Do 06  Fr 07  Sa 08  So 09
Br      Rc     -      Bi      Beine  Mo     -
Rc      -      Beine  -       -      Au     

Legende: Br=Brust, Rc=Rücken, Bi=Bizeps, etc.
```

### 5.4 Statistiken Tabelle

```
Muskelgruppe    Trainiert  Ideal  Prozent  Status
─────────────────────────────────────────────────
Eisbaden        1          3      33%      ⚠️ WENIG
Mobility        3          4      75%      OK
Brust           2          2      100%     ✓ GUT
Rücken          3          2      150%     ✓ ÜBER
Schulter        1          2      50%      ⚠️ WENIG
Bizeps          1          1      100%     ✓ GUT
Trizeps         1          1      100%     ✓ GUT
Beine           2          2      100%     ✓ GUT
Ausdauer        1          2      50%      ⚠️ WENIG
```

### 5.5 Smart Recommendations Card

```
┌────────────────────────────────────┐
│ 🎯 Nächstes Training               │
├────────────────────────────────────┤
│ 1. Eisbaden                        │
│    ⚠️ 1x in 10 Tagen (Ziel: 3x)   │
│    "Definitiv Zeit für Eisbad!"   │
│                                    │
│ 2. Schulter                        │
│    ⚠️ 1x in 10 Tagen (Ziel: 2x)   │
│    "Schultern brauchen Arbeit"    │
│                                    │
│ 3. Ausdauer                        │
│    ⚠️ 1x in 10 Tagen (Ziel: 2x)   │
│    "Herz braucht mehr Cardio"     │
└────────────────────────────────────┘
```

---

## 6. Nicht-funktionale Anforderungen

### 6.1 Performance

| Anforderung | Wert |
|-------------|------|
| **Dashboard laden** | < 1 Sekunde |
| **Empfehlungen berechnen** | < 500ms |
| **Monatsdaten anzeigen** | < 1 Sekunde |

### 6.2 Datenqualität

- [ ] **NFR-2.1:** Empfehlungen basieren auf korrekten Daten
- [ ] **NFR-2.2:** Letzte 10 Tage korrekt gezählt
- [ ] **NFR-2.3:** Ideal-Häufigkeiten korrekt

### 6.3 Usability

- [ ] **NFR-3.1:** Dashboard ist intuitiv
- [ ] **NFR-3.2:** Benutzer versteht Empfehlungen ohne Erklärung
- [ ] **NFR-3.3:** Mobile: Alles bei einem Swipe sichtbar
- [ ] **NFR-3.4:** Desktop: Vollständige Übersicht auf einen Blick

### 6.4 Visualisierung

- [ ] **NFR-4.1:** Farben zeigen Status (⚠️ ROT, OK GRÜN, ÜBER BLAU)
- [ ] **NFR-4.2:** Charts/Graphs sind klar lesbar
- [ ] **NFR-4.3:** Icons für jede Muskelgruppe (optional)

---

## 7. Framework Anforderungen

- [ ] **FW-1:** Chart Library (z.B. Chart.js, Recharts, D3.js)
- [ ] **FW-2:** Calculation Engine für Empfehlungen
- [ ] **FW-3:** Date/Time Library (für 10-Tage-Fenster)
- [ ] **FW-4:** Analytics/Statistics Helper Functions
- [ ] **FW-5:** Optional: Heatmap Library für Monatsansicht

---

## 8. Abhängigkeiten

- **REQ-006:** Daily Muscle Group Selection (Trainings-Daten)
- **REQ-007:** Training History & Logging (Historie)
- **REQ-004:** Data Storage (Daten abrufen)

---

## 9. Akzeptanzkriterien

- [ ] **AC-1:** Dashboard zeigt Wochenansicht
- [ ] **AC-2:** Dashboard zeigt Monatsansicht
- [ ] **AC-3:** Filterbar nach Muskelgruppe
- [ ] **AC-4:** Statistiken sind korrekt
- [ ] **AC-5:** Empfehlungen sind sinnvoll
- [ ] **AC-6:** Empfehlungen basieren auf letzten 10 Tagen
- [ ] **AC-7:** Berücksichtigt Trainings-Ziele (3x Eisbaden, 4x Mobility)
- [ ] **AC-8:** Dashboard lädt in < 1 Sekunde
- [ ] **AC-9:** Mobile + Desktop UI funktioniert
- [ ] **AC-10:** Farben zeigen Status klar

---

## 10. Beispiel-Szenario

```
Benutzers Trainings-Geschichte (letzte 10 Tage):
─────────────────────────────────────────────────
Tag 1 (Mo): Brust, Rücken
Tag 2 (Di): Mobility
Tag 3 (Mi): Beine, Ausdauer
Tag 4 (Do): Schulter
Tag 5 (Fr): Mobility, Eisbaden
Tag 6 (Sa): Brust
Tag 7 (So): -
Tag 8 (Mo): Rücken, Mobility
Tag 9 (Di): Eisbaden
Tag 10 (Mi): Mobility, Beine

Statistiken (10 Tage):
─────────────────────────────────────────────────
Brust: 2x (Ideal: 2x)      ✓ OK
Rücken: 2x (Ideal: 2x)     ✓ OK
Schulter: 1x (Ideal: 2x)   ⚠️ WENIG
Bizeps: 0x (Ideal: 1x)     🔴 SEHR WENIG
Trizeps: 0x (Ideal: 1x)    🔴 SEHR WENIG
Beine: 2x (Ideal: 2x)      ✓ OK
Mobility: 4x (Ideal: 4x)   ✓ PERFEKT!
Ausdauer: 1x (Ideal: 2x)   ⚠️ WENIG
Eisbaden: 2x (Ideal: 3x)   ⚠️ WENIG

TOP 3 Empfehlungen:
─────────────────────────────────────────────────
1. 🎯 Eisbaden (2x, sollte 3x sein)
   "Du brauchst noch 1x diese Woche Eisbad!"
   
2. 🎯 Bizeps (0x, sollte 1x sein)
   "Bizeps brauchte definitiv Arbeit!"
   
3. 🎯 Trizeps (0x, sollte 1x sein)
   "Arme sind untertrainiert!"
```

---

## 11. Nicht-umfasst (Out of Scope)

- [ ] AI-basierte adaptive Empfehlungen
- [ ] Social Sharing von Statistiken
- [ ] Export zu PDF/Image
- [ ] Vergleich mit anderen Benutzern
- [ ] Prognosen für Zukunft

---

## 12. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|---------|
| 1.0.0 | 2026-04-03 | Claude | Initiale Version |

