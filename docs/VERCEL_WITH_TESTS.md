# Vercel Deployment mit Tests

**Status:** 🟢 DRAFT  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03

---

## 📋 Frage: Kann ich Tests vor Deployment durchführen?

**Antwort: JA! Zwei Optionen:**

---

## ✅ Option 1: Vercel CI (Einfach, von Vercel)

Vercel hat eingebaute CI/CD Funktionalität!

### Schritt 1: package.json prüfen

Stelle sicher, dass du diese Scripts hast:

```json
{
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "test:e2e": "cypress run"
  }
}
```

### Schritt 2: Vercel konfigurieren

**File: vercel.json** (im Root deines Repos)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Schritt 3: Pre-deployment Hook (Optional)

Falls du willst, dass Tests BLOCKIEREN können:

```json
{
  "buildCommand": "npm run build && npm run test",
  "devCommand": "npm run dev"
}
```

Das bedeutet:
- npm run build
- npm run test
- Wenn Test fehlschlägt → Deployment fehlschlägt ❌

### Wie es funktioniert:

```
git push origin main
       ↓
Vercel erkennt Push
       ↓
Vercel läuft:
  1. npm ci (install)
  2. npm run build
  3. npm run test (optional)
       ↓
  Falls alle Pass:
  4. Deploy
       ↓
  Falls Test Fail:
  ❌ Deployment wird verhindert!
```

### Vorteile:
✅ Einfach (keine GitHub Actions)
✅ In Vercel Dashboard sichtbar
✅ Schnell

### Nachteile:
❌ Weniger Kontrolle
❌ Tests laufen sehr spät (nach build)
❌ Längerer Deployment-Prozess

---

## ⚡ Option 2: GitHub Actions + Vercel (Mehr Kontrolle)

Für **volle Kontrolle** über Tests:

### Schritt 1: GitHub Actions Workflow

**File: .github/workflows/test-and-deploy.yml**

```yaml
name: Test & Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Run Unit Tests
        run: npm run test:unit
      
      - name: Run E2E Tests
        run: npm run test:e2e
      
      - name: Run Lint
        run: npm run lint || true

  deploy:
    runs-on: ubuntu-latest
    needs: test  # Warte bis Tests pass!
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Schritt 2: GitHub Secrets setzen

```
GitHub Settings → Secrets:
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
```

### Wie es funktioniert:

```
git push origin main
       ↓
GitHub Actions:
  1. Run Unit Tests
  2. Run E2E Tests
  3. Run Lint
       ↓
  Falls alle Pass:
  4. Deploy zu Vercel
       ↓
  Falls Test Fail:
  ❌ Deploy blockiert!
```

### Vorteile:
✅ Tests laufen PARALLEL (schneller)
✅ Tests blockieren Deploy
✅ Volle Kontrolle
✅ Lint, Type Check, etc.

### Nachteile:
❌ Komplexer
❌ GitHub Secrets nötig
❌ Token notwendig

---

## 🎯 Welche Option passt zu dir?

### Nutze Vercel CI wenn:
```
✓ Tests sind schnell (< 1 min)
✓ Du willst einfaches Setup
✓ Du brauchst nicht viel Kontrolle
```

### Nutze GitHub Actions wenn:
```
✓ Tests sind langsam (> 1 min)
✓ Du willst Tests vor Build laufen
✓ Du willst mehrere Checks (Lint, Type, etc.)
✓ Du willst feinen Kontrolle über Pipeline
```

---

## 🚀 Empfehlung

### Jetzt (schnell starten):
```
✓ Nutze Vercel Native (kein Test)
✓ Deploy ist sehr schnell
✓ Test später manuell lokal
```

### Später (wenn Tests wichtig sind):
```
✓ Aktiviere Vercel CI (einfach)
oder
✓ Richte GitHub Actions ein (vollständig)
```

---

## 📊 Vergleich

| Feature | Vercel Native | Vercel CI | GitHub Actions |
|---------|--------------|-----------|---|
| **Setup Zeit** | 5 min | 10 min | 15 min |
| **Komplexität** | Einfach | Mittel | Komplex |
| **Test vor Deploy** | ❌ | ✅ | ✅ |
| **Deploy Speed** | 2-5 min | 3-8 min | 5-10 min |
| **Kontrolle** | Wenig | Mittel | Viel |
| **Kosten** | Free | Free | Free (2000 min) |

---

## 🎓 Für dich empfohlen

```
Phase 1 (JETZT):
✅ Nutze Vercel Native
✅ Kein Test Setup
✅ Einfach: git push = Deploy

Phase 2 (Wenn nötig):
⏭️ Falls Tests wichtig:
   Vercel CI oder GitHub Actions
```

---

## 📝 Zusammenfassung

```
Frage: "Kann ich Tests durchführen?"
Antwort: JA!

Option 1: Vercel CI (einfach)
Option 2: GitHub Actions (vollständig)

Für jetzt: Nutze Vercel Native (keine Tests nötig)
Später: Aktiviere Tests wenn gewünscht
```

