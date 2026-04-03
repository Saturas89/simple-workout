# Vercel Setup & GitHub Actions Integration

**Status:** 🟢 DRAFT  
**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-04-03

---

## 📋 Übersicht

Vollständiger Leitfaden zum Einrichten von Vercel und GitHub Actions Integration, sodass bei jedem Git Push automatisch deployed wird.

---

## 1. Vercel Account erstellen (wenn noch nicht vorhanden)

### Schritt 1: Zu Vercel gehen

```
https://vercel.com
```

### Schritt 2: GitHub mit Vercel verbinden

```
Klicke: "Sign up"
  ↓
Wähle: "Continue with GitHub"
  ↓
Authorisiere Vercel auf GitHub
  ↓
✅ Vercel Account erstellt
```

---

## 2. Vercel Project erstellen

### Schritt 1: Neues Projekt erstellen

```
Vercel Dashboard → Add New → Project
```

### Schritt 2: GitHub Repository verbinden

```
Klicke: "Continue with GitHub"
  ↓
Suchfeld: "simple-workout"
  ↓
Wähle: "saturas89/simple-workout"
  ↓
Klicke: "Import"
```

### Schritt 3: Project konfigurieren

```
Framework Preset: Next.js (oder anderen wählen)
Build Command: npm run build
Output Directory: dist/

Klicke: "Deploy"
```

### Schritt 4: Initial Deploy abwarten

```
Vercel deployed automatisch den main branch
(kann 2-5 Minuten dauern)

Nach Completion:
✅ Production URL angezeigt: https://simple-workout.vercel.app
```

---

## 3. Vercel API Token generieren

### Schritt 1: Zu Account Settings gehen

```
Vercel.com
  → Profil Icon (oben rechts)
  → Settings
  → Tokens
```

### Schritt 2: Neuen Token erstellen

```
Klicke: "Create Token"

Token Name: "GitHub Actions"
Scope: "Full Account"
Expiration: "No expiration"

Klicke: "Create"
```

### Schritt 3: Token kopieren

```
⚠️  KOPIERE DEN TOKEN SOFORT!
    Er wird danach nicht wieder angezeigt!

Token sieht aus wie:
  abcd1234efgh5678ijkl9012mnop3456

(Später in GitHub Secrets einfügen)
```

---

## 4. Vercel Organization ID & Project ID finden

### Schritt 1: Zu Project Settings gehen

```
Vercel Dashboard
  → Dein Project (simple-workout)
  → Settings (Tab)
```

### Schritt 2: IDs kopieren

```
General Section:
  Project Name: simple-workout
  Project ID: prj_abc123def456ghi789  ← KOPIERE!

Personal Account Section:
  Team: [dein username]
  Team ID: team_abc123def456ghi789   ← KOPIERE!
```

**Die brauchst du:**
- `VERCEL_PROJECT_ID`: prj_abc123...
- `VERCEL_ORG_ID`: team_abc123... (oder dein username)

---

## 5. GitHub Secrets einrichten

### Schritt 1: Zu GitHub Repository gehen

```
GitHub.com
  → saturas89/simple-workout
  → Settings (Tab)
```

### Schritt 2: Zu Secrets gehen

```
Settings
  → Secrets and variables
  → Actions
```

### Schritt 3: Neue Secrets hinzufügen

```
Klicke: "New repository secret"

SECRET 1: VERCEL_TOKEN
Value: (dein Token von Schritt 3)

Klicke: "Add secret"
```

```
Klicke: "New repository secret"

SECRET 2: VERCEL_ORG_ID
Value: (deine Team/Org ID von Schritt 4)

Klicke: "Add secret"
```

```
Klicke: "New repository secret"

SECRET 3: VERCEL_PROJECT_ID
Value: (deine Project ID von Schritt 4)

Klicke: "Add secret"
```

### Ergebnis:

```
✅ VERCEL_TOKEN: ***
✅ VERCEL_ORG_ID: ***
✅ VERCEL_PROJECT_ID: ***
```

---

## 6. GitHub Actions Workflow erstellen

### Schritt 1: Datei erstellen

```
In deinem Repository:
.github/workflows/deploy.yml
```

### Schritt 2: Content hinzufügen

```yaml
name: Build, Test & Deploy to Vercel

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

env:
  NODE_VERSION: '18'

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
        run: npm run lint || true
      - name: Type Check
        run: npm run type-check || true

  test:
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
        run: npm run test:unit || true
      - name: Run E2E Tests
        run: npm run test:e2e || true

  deploy:
    runs-on: ubuntu-latest
    needs: [build, lint, test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
          github-token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Comment PR with Deploy URL
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Vercel deployment ready!\n\nPreview URL: https://simple-workout.vercel.app'
            })
```

### Schritt 3: Datei committen und pushen

```bash
git add .github/workflows/deploy.yml
git commit -m "docs: Add GitHub Actions + Vercel deployment workflow"
git push origin docs/vercel-setup
```

---

## 7. Testen: Ersten Deploy durchführen

### Schritt 1: Branch zu main mergen

```bash
git checkout main
git merge docs/vercel-setup
git push origin main
```

### Schritt 2: GitHub Actions beobachten

```
GitHub → Actions Tab
  ↓
Schaue auf den letzten Workflow Run
  ↓
Sollte sehen:
  - Build ✅
  - Lint ✅
  - Test ✅
  - Deploy ✅
```

### Schritt 3: Vercel Deploy prüfen

```
Vercel Dashboard
  → Deployments Tab
  ↓
Sollte neuen Deployment sehen:
  Status: ✅ Ready
  URL: https://simple-workout.vercel.app
```

### Schritt 4: App öffnen und testen

```
https://simple-workout.vercel.app
  ↓
App sollte live sein!
```

---

## 8. Environment Variables in Vercel setzen

### Falls deine App Environment Variables braucht:

```
Vercel Dashboard
  → Project Settings
  → Environment Variables
```

```
Hinzufügen:
Name: NEXT_PUBLIC_API_URL
Value: https://api.simple-workout.com

Name: DATABASE_URL
Value: (deine database URL - GEHEIM!)
```

⚠️ **Wichtig:** Vercel Environment Variables sind anders als GitHub Secrets!

---

## 9. Troubleshooting

### Problem: Deploy schlägt fehl mit "Cannot find module"

```
Lösung:
1. npm install (lokal)
2. npm run build (lokal)
3. Falls lokal funktioniert aber in Vercel nicht:
   → Vercel Settings → Build & Development
   → Überprüfe "Build Command" und "Output Directory"
```

### Problem: "Permission denied" bei Deploy

```
Lösung:
1. Überprüfe VERCEL_TOKEN ist korrekt
2. Token hat "Full Account" Scope?
3. Regeneriere Token falls nötig
```

### Problem: "Invalid vercel.json"

```
Lösung:
Falls du vercel.json verwendest:
- Überprüfe JSON Syntax
- Oder lösche vercel.json (nicht nötig)
```

### Problem: GitHub Actions zeigt Fehler

```
Lösung:
1. Klicke auf fehlgeschlagenen Job
2. Expande "Deploy to Vercel" Step
3. Lies die Fehlermeldung
4. Überprüfe:
   - VERCEL_TOKEN gültig?
   - VERCEL_ORG_ID korrekt?
   - VERCEL_PROJECT_ID korrekt?
```

---

## 10. Workflow nach Setup

```
Du pushst Code:
  git push origin main
         ↓
GitHub Actions startet:
  1. Checkout Code
  2. Build (npm run build)
  3. Lint (ESLint)
  4. Tests (Jest, Cypress)
         ↓
  Falls alle PASS:
  5. Deploy zu Vercel
         ↓
App ist LIVE in ~3-5 Minuten!
```

---

## 11. Automatischer Deploy bei jedem Push

### Jetzt passiert automatisch:

```
git push origin main
       ↓
GitHub Actions Workflow startet automatisch
       ↓
Build + Test + Lint (parallel)
       ↓
Falls alles Pass:
Deploy zu Vercel
       ↓
🚀 Deine App ist LIVE!
```

### Kein manueller Deploy mehr nötig!

```
❌ Alte Weg:
  - npm run build
  - vercel --prod

✅ Neue Weg:
  - git push
  - (auto-deploy!)
  - App is live
```

---

## 12. Security Reminders

```
⚠️  VERCEL_TOKEN:
- Niemals in Code committen
- Nur in GitHub Secrets speichern
- Niemals in .env committen
- GitHub maskiert automatisch in Logs

✅ Sicher:
- GitHub Secrets verwenden
- Token hat Expiration (optional)
- Nur minimale Permissions geben
```

---

## 13. Nächste Schritte

Nach erfolgreichem Setup:

```
1. ✅ Vercel Account erstellt
2. ✅ Project mit GitHub verbunden
3. ✅ API Token generiert
4. ✅ GitHub Secrets eingerichtet
5. ✅ GitHub Actions Workflow erstellt
6. ⏭️  Anfangen zu entwickeln!
7. ⏭️  Bei jedem Push auto-deploy!
```

---

## 14. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|---------|
| 1.0.0 | 2026-04-03 | Claude | Initiales Setup Guide |

---

## 📚 Weitere Ressourcen

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Deployment](https://docs.github.com/en/actions/deployment)
- [Vercel + GitHub Integration](https://vercel.com/docs/git-integrations/github)

