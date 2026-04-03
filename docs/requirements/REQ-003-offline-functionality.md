# Anforderung: Offline Funktionalität & Service Worker

**Status:** 🟢 DRAFT  
**ID:** REQ-003  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03  
**Modul:** PWA / Offline  
**Priorität:** High  

---

## 1. Zusammenfassung

Die App funktioniert vollständig offline. Trainingsplan und Daten sind offline verfügbar. Service Worker cached kritische Ressourcen. Wenn Verbindung wiederhergestellt wird, synchronisieren sich Daten automatisch.

---

## 2. Detaillierte Beschreibung

### 2.1 Kontext

Beim Training im Studio ist WiFi oft nicht verfügbar oder instabil. Benutzer brauchen zuverlässigen Zugriff auf ihren Trainingsplan während des Trainings, egal ob online oder offline.

### 2.2 Benutzer/Stakeholder

- **Trainierende:** Brauchen Offline-Zugriff während Training
- **Reisende:** Internet in verschiedenen Ländern/Gegenden
- **Offline-First User:** Preferieren lokale Daten

---

## 3. Akzeptanzkriterien

### 3.1 Service Worker

- [ ] **AC-1.1:** Service Worker registriert und aktiviert
- [ ] **AC-1.2:** Caching-Strategie implementiert (Cache-First, Stale-While-Revalidate)
- [ ] **AC-1.3:** Alle statischen Assets sind gecacht
- [ ] **AC-1.4:** Service Worker Updates werden automatisch angewendet

### 3.2 Offline Daten

- [ ] **AC-2.1:** Alle Workouts sind lokal gespeichert
- [ ] **AC-2.2:** App funktioniert ohne Internet-Verbindung
- [ ] **AC-2.3:** Offline-Indikator zeigt Verbindungsstatus
- [ ] **AC-2.4:** Alle Änderungen sind persistent (IndexedDB)
- [ ] **AC-2.5:** Datenverlust bei Neuinstall wird gewarnt

### 3.3 Synchronisation

- [ ] **AC-3.1:** Änderungen werden automatisch mit Server synchronisiert wenn online
- [ ] **AC-3.2:** Sync-Warteschlange für Offline-Änderungen
- [ ] **AC-3.3:** Konflikt-Handling bei gleichzeitigen Änderungen
- [ ] **AC-3.4:** Sync-Status visuell angezeigt (Icon/Badge)
- [ ] **AC-3.5:** Manuelle Sync-Option für Benutzer

### 3.4 User Experience

- [ ] **AC-4.1:** Offline-Warnung wenn kritische Features nicht möglich sind
- [ ] **AC-4.2:** Smooth Transition zwischen Online/Offline
- [ ] **AC-4.3:** Keine Fehlermeldungen für erwartete Offline-Verhaltensweisen

---

## 4. Nicht-funktionale Anforderungen

| Kategorie | Anforderung |
|-----------|------------|
| **Cache Size** | Max 50MB für App-Daten |
| **Sync Zeit** | Sync in < 5 Sekunden wenn online |
| **Offline Dauer** | Unbegrenzter Offline-Zugriff möglich |
| **Datenintegrität** | Keine Datenverluste bei Offline-Änderungen |
| **Browser Support** | Service Workers auf modernen Browsern |

---

## 5. Abhängigkeiten

- **REQ-001:** PWA Foundation (Service Worker)
- **REQ-002:** Workout Management (Daten zu synchronisieren)

---

## 6. Caching-Strategie

```
┌────────────────────────────────────┐
│  Service Worker Caching Strategy   │
├────────────────────────────────────┤
│                                    │
│ Static Assets (HTML, CSS, JS):     │
│ → Cache-First, Fallback to Network │
│ → Serve from cache immediately     │
│                                    │
│ API Requests (Workouts, Data):    │
│ → Network-First, Fallback to Cache │
│ → Try fresh data, use cache if fail │
│                                    │
│ Images:                            │
│ → Stale-While-Revalidate           │
│ → Serve cache, update in background│
│                                    │
└────────────────────────────────────┘
```

---

## 7. Implementierungsnotizen

### Service Worker

```javascript
// cache-first für static assets
const CACHE_NAME = 'simple-workout-v1';

self.addEventListener('install', (event) => {
  // Pre-cache critical assets
});

self.addEventListener('fetch', (event) => {
  // Implement caching strategy
});
```

### IndexedDB Schema

```json
{
  "workouts": {
    "keyPath": "id",
    "indexes": ["createdAt", "lastModified"]
  },
  "exercises": {
    "keyPath": "id"
  },
  "syncQueue": {
    "keyPath": "id"
  }
}
```

---

## 8. Testkriterien

- [x] Unit Tests für Service Worker
- [x] Integration Tests für Offline Scenarios
- [x] E2E Tests mit Network Throttling
- [x] Tests für Data Sync
- [x] Manuelle Tests (DevTools Offline Mode)

---

## 9. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|---------|
| 1.0.0 | 2026-04-03 | Claude | Initiale Version |

