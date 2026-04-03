# Anforderung: Data Storage & Synchronisation

**Status:** 🟢 DRAFT  
**ID:** REQ-004  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03  
**Modul:** Data Layer  
**Priorität:** High  

---

## 1. Zusammenfassung

Implementierung eines robusten Datenspeichersystems mit lokaler IndexedDB und Cloud-Synchronisation. Unterstützung für Benutzer-Konten, mehrere Geräte und sichere Datenverwaltung.

---

## 2. Detaillierte Beschreibung

### 2.1 Kontext

Benutzer müssen ihre Daten auf mehreren Geräten zugreifen können und gleichzeitig offline arbeiten. System muss Konflikte handhaben und Datenkonsistenz gewährleisten.

### 2.2 Benutzer/Stakeholder

- **Einzelnutzer:** Persönliche Trainingsdata
- **Synchronisieren Geräte:** Handy <-> Desktop
- **Cloud-Backup Nutzer:** Datensicherung in Cloud

---

## 3. Akzeptanzkriterien

### 3.1 Lokale Datenspeicherung

- [ ] **AC-1.1:** IndexedDB implementiert für lokale Daten
- [ ] **AC-1.2:** Größe-Limits für Database definiert und implementiert
- [ ] **AC-1.3:** Daten-Export möglich (JSON)
- [ ] **AC-1.4:** Daten-Import möglich (JSON)
- [ ] **AC-1.5:** Backup & Restore Funktionalität

### 3.2 Cloud-Synchronisation

- [ ] **AC-2.1:** REST API für Daten-Upload
- [ ] **AC-2.2:** Authentifizierung (Token-basiert)
- [ ] **AC-2.3:** Automatische Sync bei Verbindung
- [ ] **AC-2.4:** Manuelle Sync-Trigger möglich
- [ ] **AC-2.5:** Sync-Progresss wird angezeigt

### 3.3 Konflikt-Handling

- [ ] **AC-3.1:** Last-Write-Wins Strategie implementiert
- [ ] **AC-3.2:** Timestamps für alle Änderungen
- [ ] **AC-3.3:** Benutzer wird bei Konflikten informiert
- [ ] **AC-3.4:** Konflikt-Resolution UX implementiert

### 3.4 Datensicherheit

- [ ] **AC-4.1:** Daten verschlüsselt bei Übertragung (HTTPS)
- [ ] **AC-4.2:** Authentifizierung erforderlich
- [ ] **AC-4.3:** Autorisierung (nur eigene Daten)
- [ ] **AC-4.4:** GDPR-Datenschutz implementiert

---

## 4. Nicht-funktionale Anforderungen

| Kategorie | Anforderung |
|-----------|------------|
| **Storage** | LocalStorage: Unlimited (Browser-Limit), Cloud: Min 1GB |
| **Sync Time** | Unter 5 Sekunden für typische Workloads |
| **Consistency** | Strong Consistency (Last-Write-Wins) |
| **Reliability** | No Data Loss, Retry Mechanismus |
| **Security** | E2E Encryption optional, HTTPS mandatory |

---

## 5. Abhängigkeiten

- **REQ-001:** PWA Foundation (für Offline-Storage)
- **REQ-002:** Workout Management (Daten-Model)
- Backend API Server (Cloud-Synchronisation)

---

## 6. Datenmodell

```typescript
interface Workout {
  id: string;                    // UUID
  userId: string;                // Owner
  title: string;
  description: string;
  exercises: Exercise[];
  createdAt: ISO8601DateTime;
  updatedAt: ISO8601DateTime;
  version: number;              // For conflict detection
  syncStatus: 'synced' | 'pending' | 'conflict';
}

interface Exercise {
  id: string;
  workoutId: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number;             // seconds
  notes?: string;
  order: number;
  updatedAt: ISO8601DateTime;
}

interface SyncQueue {
  id: string;
  type: 'workout' | 'exercise';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: ISO8601DateTime;
  retries: number;
}
```

---

## 7. API Endpoints (Backend)

```
POST   /api/auth/register          # Registrierung
POST   /api/auth/login             # Login
POST   /api/workouts               # Create Workout
GET    /api/workouts               # List Workouts
GET    /api/workouts/:id           # Get Workout
PUT    /api/workouts/:id           # Update Workout
DELETE /api/workouts/:id           # Delete Workout
POST   /api/sync                   # Batch Sync
```

---

## 8. Caching-Strategien

### LocalStorage Strategy

```
Workouts
├── workout:uuid → JSON
├── workout:uuid → JSON
└── exercise:uuid → JSON

Metadata
├── lastSync → Timestamp
├── user → Object
└── settings → Object
```

### Sync Queue

```json
[
  {
    "id": "sync-1",
    "type": "workout",
    "action": "update",
    "data": {...},
    "timestamp": "2026-04-03T10:00:00Z",
    "retries": 0
  }
]
```

---

## 9. Fehler-Handling

```
Network Error
↓
Add to Sync Queue
↓
Wait for Connection
↓
Retry Sync
↓
If Still Failed → Show Notification
↓
User Option: Retry / Discard / Keep Local
```

---

## 10. Implementierungsnotizen

- **Technologie:** IndexedDB + REST API
- **Authentifizierung:** JWT Tokens
- **Versionierung:** Optimistic Locking mit Version Numbers
- **Testing:** Offline Tests mit Network Throttling

---

## 11. Testkriterien

- [x] Unit Tests für LocalStorage CRUD
- [x] Integration Tests für Sync
- [x] E2E Tests mit Offline Scenarios
- [x] Konflikt-Handling Tests
- [x] Performance Tests (Große Datenmengen)

---

## 12. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|---------|
| 1.0.0 | 2026-04-03 | Claude | Initiale Version |

