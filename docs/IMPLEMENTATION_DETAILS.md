# Implementation Details - Simple Workout

**Status:** 🟢 DRAFT  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03

---

## 📋 Übersicht

Dieses Dokument beschreibt die **technischen Implementation-Details** - unabhängig von den eigentlichen Anforderungen. Diese Details KÖNNEN sich ändern, ohne die Anforderungen zu ändern.

**Anforderungen:** Siehe `/docs/requirements/`

---

## 1. Technology Stack (Empfohlen)

### Frontend

```
Framework:       React 18+ / Vue 3+ / Svelte
Build Tool:      Vite / Next.js
State Management: Redux Toolkit / Zustand / Pinia
Styling:         Tailwind CSS / CSS Modules
UI Components:   Custom + Headless UI
Testing:         Vitest / Jest + React Testing Library
E2E Tests:       Cypress / Playwright
```

### Backend

```
API:             Node.js (Express) / Python (Django/FastAPI) / Go / Rust
Database:        PostgreSQL / MongoDB
Cache:           Redis
Message Queue:   Bull / Celery (optional)
Authentication:  Passport.js / Django Auth / Ory
```

### DevOps

```
Hosting:         Vercel / Netlify / AWS / Google Cloud / Self-hosted
Database:        Managed (AWS RDS, MongoDB Atlas) oder Self-hosted
Storage:         S3 / Google Cloud Storage (für Backups)
CI/CD:           GitHub Actions / GitLab CI / Jenkins
Monitoring:      Sentry / DataDog / New Relic
```

---

## 2. Data Caching Strategy

### Service Worker Caching

```javascript
// Cache-First Strategy für Static Assets
- HTML/CSS/JS files
- Icons, Fonts
- Images (unter 1MB)

// Network-First für API Requests
- Daten-APIs
- User Endpoints
- Sync Endpoints

// Stale-While-Revalidate für Images
- Große Bilder (1MB+)
- Workout Icons
```

### Client-Side Caching

```
LocalStorage:  User Preferences, Auth Token
IndexedDB:     
  - workouts Collection
  - exercises Collection
  - syncQueue Collection
  - metadata Collection
In-Memory:     Current UI State, Temporary Data
```

---

## 3. API Endpoints (Beispiel)

### Authentication

```
POST   /api/auth/register           # { email, password, name }
POST   /api/auth/login              # { email, password }
POST   /api/auth/refresh-token      # { refreshToken }
POST   /api/auth/logout             # {}
POST   /api/auth/password-reset     # { email }
```

### Workouts

```
GET    /api/workouts                # List alle Workouts
GET    /api/workouts/:id            # Get spezifischen Workout
POST   /api/workouts                # Create Workout
PUT    /api/workouts/:id            # Update Workout
DELETE /api/workouts/:id            # Delete Workout
```

### Exercises

```
GET    /api/workouts/:id/exercises  # List Übungen
POST   /api/workouts/:id/exercises  # Create Übung
PUT    /api/exercises/:id           # Update Übung
DELETE /api/exercises/:id           # Delete Übung
```

### Sync

```
POST   /api/sync                    # Batch Sync (offline changes)
GET    /api/sync/status             # Sync Status
```

---

## 4. Data Models

### Workout Model

```javascript
{
  id: UUID,
  userId: UUID,
  title: string,
  description: string,
  exercises: Exercise[],
  createdAt: ISO8601,
  updatedAt: ISO8601,
  version: number,  // Für Konflikt-Detection
  syncStatus: 'synced' | 'pending' | 'conflict'
}
```

### Exercise Model

```javascript
{
  id: UUID,
  workoutId: UUID,
  name: string,
  sets: number,
  reps: number,
  weight?: number,  // in kg
  restTime: number, // in seconds
  notes?: string,
  order: number,
  updatedAt: ISO8601
}
```

### SyncQueue Model

```javascript
{
  id: UUID,
  type: 'workout' | 'exercise',
  action: 'create' | 'update' | 'delete',
  data: any,
  timestamp: ISO8601,
  retries: number,
  lastError?: string
}
```

---

## 5. Frontend Architecture

### Folder Structure

```
src/
├── components/
│   ├── mobile/              # Mobile-only Komponenten
│   │   ├── BottomNav.tsx
│   │   └── MobileWorkoutList.tsx
│   ├── desktop/             # Desktop-only Komponenten
│   │   ├── Sidebar.tsx
│   │   └── DesktopWorkoutList.tsx
│   └── shared/              # Shared Komponenten
│       ├── Button.tsx
│       ├── Card.tsx
│       └── FormInput.tsx
├── pages/
│   ├── WorkoutList.tsx
│   ├── WorkoutDetail.tsx
│   ├── AddExercise.tsx
│   └── NotFound.tsx
├── services/
│   ├── api.ts              # API Calls
│   ├── storage.ts          # IndexedDB Operations
│   ├── sync.ts             # Sync Logic
│   ├── pwa.ts              # PWA Management
│   └── offline.ts          # Offline Detection
├── hooks/
│   ├── useWorkouts.ts
│   ├── useOffline.ts
│   └── useSync.ts
├── styles/
│   ├── global.css
│   ├── breakpoints.css     # Responsive Breakpoints
│   ├── touch.css           # Touch Optimizations
│   └── desktop.css         # Desktop Optimizations
├── types/
│   └── models.ts
└── manifest.json           # PWA Manifest
```

### Responsive Breakpoints

```scss
$mobile:           320px;
$mobile-landscape: 568px;
$tablet:           768px;
$desktop:          1024px;
$wide:             1440px;
$ultra-wide:       1920px;

// Media Queries
@media (max-width: 767px) { /* Mobile */ }
@media (min-width: 768px) and (max-width: 1023px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

---

## 6. Offline-First Flow

```
┌─────────────────────────────┐
│  User Action (Create/Edit)  │
└────────────┬────────────────┘
             │
             ▼
    ┌────────────────┐
    │ Validate Data  │
    └────────┬───────┘
             │
      ┌──────▼──────┐
      │   Online?   │
      └──┬───────┬──┘
    YES  │       │  NO
        ▼       ▼
    ┌──────────────┐      ┌──────────────┐
    │ POST to API  │      │ Add to Queue │
    └──┬───────────┘      │ + LocalStore │
       │                  └──────────────┘
       ▼
    ┌──────────────┐
    │ Update UI    │
    │ Optimistic   │
    └──────────────┘
       │
       ▼
    ┌──────────────┐
    │  Success?    │
    └──┬────────┬──┘
      YES      NO
       │       │
       ▼       ▼
    Continue Retry
```

---

## 7. Caching Strategy Details

### Static Assets (Cache-First)

```
Request → Check Service Worker Cache
  ├─ Found → Return from cache (fast!)
  └─ Not Found → Fetch from network
                  → Cache for next time
                  → Return
```

### API Requests (Network-First)

```
Request → Try to fetch from network
  ├─ Success → Cache result
  │          → Return fresh data
  └─ Failed → Check Service Worker Cache
              → Return cached (possibly stale)
              → If no cache → Error
```

---

## 8. Deployment Pipeline

```
Git Push
  ↓
GitHub Actions / CI
  ↓
Run Tests (Unit + E2E)
  ↓
Build (npm run build)
  ↓
Lighthouse CI (Performance)
  ↓
Deploy to Staging
  ↓
Test in Staging
  ↓
Deploy to Production
  ↓
Monitor (Sentry, DataDog)
```

---

## 9. Browser Storage Breakdown

```
LocalStorage (5-10MB):
  ├─ User Token
  ├─ Preferences
  └─ App Settings

IndexedDB (unlimited):
  ├─ workouts (größer)
  ├─ exercises
  ├─ syncQueue
  └─ cache metadata

Service Worker Cache (50MB+):
  ├─ Static Assets
  ├─ API Responses
  └─ Images
```

---

## 10. Error Handling Strategy

```
API Error
  ├─ 4xx (Client Error)
  │   ├─ 400 → Show validation error to user
  │   ├─ 401 → Redirect to login
  │   └─ 403 → Show "Access Denied"
  ├─ 5xx (Server Error)
  │   ├─ Add to retry queue
  │   ├─ Show "Trying again..." message
  │   └─ Retry with exponential backoff
  └─ Network Error
      ├─ Check if offline
      ├─ Add to queue
      └─ Show "Will sync when online"
```

---

## 11. Testing Strategy

### Unit Tests
```
- Service functions (api.ts, storage.ts)
- Utility functions
- Individual components
- Redux/Zustand actions
```

### Integration Tests
```
- API + Database interactions
- Sync logic
- Offline queue processing
- Auth flow
```

### E2E Tests
```
- Workout creation flow (Mobile + Desktop)
- Offline + Online transitions
- Sync scenarios
- Conflict resolution
```

---

## 12. Performance Optimizations

### Code Splitting
```
- Lazy load route components
- Dynamic imports für große Libraries
- Separate vendor chunk
```

### Image Optimization
```
- WebP format with fallback
- Responsive images (srcset)
- Lazy loading
- Image compression
```

### Bundle Size
```
- Tree-shaking unused code
- Minification
- Compression (Gzip/Brotli)
- Remove console logs in production
```

---

## 13. Monitoring & Analytics

### Error Tracking (Sentry)
```
- JavaScript errors
- API errors
- Offline errors
- Performance monitoring
```

### Analytics
```
- User DAU/MAU
- Feature usage
- Error rates
- Performance metrics
```

---

## 14. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|---------|
| 1.0.0 | 2026-04-03 | Claude | Initiale Implementation-Details |

---

## 15. Hinweise

⚠️ **Diese Details können sich ändern ohne die Anforderungen zu ändern!**

Zum Beispiel:
- Frontend-Framework wechsel: React → Vue
- API-Design: REST → GraphQL
- Database: PostgreSQL → MongoDB
- Caching-Strategie anpassen

**Solange die Anforderungen erfüllt werden, ist die Implementation austauschbar.**

