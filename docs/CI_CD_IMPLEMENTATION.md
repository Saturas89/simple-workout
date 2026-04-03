# CI/CD Pipeline - Implementation Details

**Status:** 🟢 DRAFT  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03

---

## 📋 Übersicht

Technische Implementation der CI/CD Pipeline basierend auf REQ-005.

**AUSGEWÄHLTE TOOLS:**
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel

**Anforderungen:** Siehe `/docs/requirements/REQ-005-ci-cd-pipeline.md`

---

## 1. Kombinierte Setup: GitHub Actions + Vercel

### GitHub Actions

```yaml
Kosten: FREE (bis 2000 Minuten/Monat)
Einsatz: Build, Test, Quality Checks
Vorteile:
✓ Native GitHub Integration
✓ Kein Setup außerhalb GitHub
✓ Kostenlos für Open Source
✓ Vollständige Control über Pipeline
```

### Vercel

```yaml
Kosten: FREE Tier für einfache Apps
Einsatz: Hosting & Auto-Deploy
Vorteile:
✓ Automatischer Deploy bei Git Push
✓ Preview URLs für Pull Requests
✓ Optimiert für Next.js/React
✓ HTTPS automatisch
✓ Global CDN
```

### Kombination

```
GitHub Repository
        ↓
   (Git Push)
        ↓
GitHub Actions:
  - Build, Test, Security, Performance
        ↓ (if all pass)
     Vercel:
       - Deploy
       - Health Check
       - Live URL
```

---

## 2. GitHub Actions Workflow Example

### Datei: `.github/workflows/deploy.yml`

```yaml
name: Build, Test & Deploy

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

env:
  NODE_VERSION: '18'
  CACHE_PATH: ~/.npm

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Build Application
        run: npm run build
      
      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
          retention-days: 1

  lint:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm ci
      - name: Run ESLint
        run: npm run lint
      - name: Type Check
        run: npm run type-check

  test-unit:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm ci
      - name: Run Unit Tests
        run: npm run test:unit
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  test-e2e:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Run E2E Tests
        run: npm run test:e2e
      
      - name: Upload Screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-screenshots
          path: cypress/screenshots/

  security-scan:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - uses: actions/checkout@v3
      - run: npm audit --audit-level=moderate
      - name: Scan Dependencies
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  performance:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './.github/lighthouse/lighthouserc.json'

  deploy:
    runs-on: ubuntu-latest
    needs: [build, lint, test-unit, test-e2e, security-scan, performance]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Download Build Artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
      
      - name: Health Check
        run: |
          URL=${{ steps.deploy.outputs.preview-url }}
          curl -f $URL || exit 1
      
      - name: Notify Success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '✅ Deployment successful!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      
      - name: Notify Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '❌ Deployment failed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 3. Hosting Provider Setup

### Vercel (Empfohlen für Next.js)

```bash
# 1. Create Vercel Account
# 2. Connect GitHub Repository
# 3. Set Environment Variables

VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx

# 4. Each push deploys automatically
```

### Netlify

```bash
# 1. Create Netlify Account
# 2. Connect GitHub Repository
# 3. Configure Build Settings

Build Command: npm run build
Publish Directory: dist/

# 4. Each push deploys automatically
```

### AWS (More Control)

```bash
# 1. Create AWS Account
# 2. Setup S3 Bucket for static files
# 3. Setup CloudFront for CDN
# 4. Setup CloudFormation for IaC

Deployment:
  S3 Upload → CloudFront Invalidation → Live
```

---

## 4. Environment Variables Configuration

### GitHub Secrets Setup

```
Settings → Secrets and variables → Actions

Production Secrets:
- DATABASE_URL
- API_KEY
- JWT_SECRET
- SLACK_WEBHOOK
- VERCEL_TOKEN
- SENTRY_DSN
```

### Environment-specific .env files

```
.env.production
  API_URL=https://api.simple-workout.com
  SENTRY_DSN=xxx
  ANALYTICS=enabled

.env.staging
  API_URL=https://staging-api.simple-workout.com
  SENTRY_DSN=xxx

.env.development
  API_URL=http://localhost:3000
```

---

## 5. Testing Configuration

### Jest/Vitest Config

```javascript
// vitest.config.ts
export default {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.tsx',
      ],
      lines: 70,      // Mindestens 70% Code Coverage
      functions: 70,
      branches: 65,
      statements: 70,
    },
  },
}
```

### Cypress E2E Config

```javascript
// cypress.config.ts
import defineConfig from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    screenshotOnRunFailure: true,
    video: false,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
})
```

---

## 6. Monitoring & Alerts

### Sentry Setup (Error Tracking)

```javascript
// main.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Slack Integration

```yaml
# .github/workflows/deploy.yml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      Deployment Status: ${{ job.status }}
      Branch: ${{ github.ref }}
      Commit: ${{ github.sha }}
      URL: ${{ steps.deploy.outputs.preview-url }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 7. Scripts in package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --fix",
    "type-check": "tsc --noEmit",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:coverage": "vitest run --coverage",
    "audit": "npm audit --audit-level=moderate",
    "ci": "npm run build && npm run lint && npm run test:unit && npm run test:e2e"
  }
}
```

---

## 8. Lighthouse Configuration

### File: `.github/lighthouse/lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:5173",
        "http://localhost:5173/workouts",
      ],
      "numberOfRuns": 1,
      "settings": {
        "chromeFlags": ["--no-sandbox"]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

---

## 9. Workflow: Deployment Flow

```
Developer:
  1. git push to main
         ↓
GitHub Actions:
  2. Checkout Code
  3. Build (npm run build)
  4. Lint (npm run lint)
  5. Unit Tests (npm run test:unit)
  6. E2E Tests (npm run test:e2e)
  7. Security Scan (npm audit)
  8. Lighthouse
         ↓
  IF all pass:
    9. Deploy to Vercel
    10. Health Check (curl)
    11. Slack Notification ✅
         ↓
  ELSE:
    9. Slack Notification ❌
    10. Stop (Developer fixes)
         ↓
User:
  11. Access live app at URL
  12. App is ready to use!
```

---

## 10. Troubleshooting

### Build Fehler

```
Problem: npm install schlägt fehl
Fix: 
  - npm cache clean --force
  - npm install --no-optional
  - Check Node Version
```

### Test Fehler

```
Problem: E2E Tests flaky
Fix:
  - Erhöhe Timeouts
  - Add retry logic
  - Use cy.intercept() für APIs
  - Run locally erst
```

### Deploy Fehler

```
Problem: Deployment schlägt fehl
Fix:
  - Check Environment Variables
  - Verify Health Check URL
  - Check Disk Space
  - Review Deployment Logs
```

---

## 11. Performance Targets

```
Build Time Target: < 5 min
  - npm ci: 1-2 min
  - npm run build: 2-3 min

Test Time Target: < 10 min
  - Unit Tests: 2-3 min
  - E2E Tests: 5-7 min

Deploy Time Target: < 2 min
  - Upload: 30-60s
  - Health Check: 10-30s

Total Pipeline: < 20 min (all stages)
```

---

## 12. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|---------|
| 1.0.0 | 2026-04-03 | Claude | Initiale Implementation |

