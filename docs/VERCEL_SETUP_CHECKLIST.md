# Vercel + GitHub Actions Setup - Schnell-Checkliste

**Zeit zum Setup: ~15 Minuten**

---

## ✅ Schritt 1: Vercel Account (2 min)

```
☐ Gehe zu https://vercel.com
☐ Klicke "Sign up"
☐ Wähle "Continue with GitHub"
☐ Autorisiere Vercel
```

---

## ✅ Schritt 2: Vercel Project erstellen (3 min)

```
☐ Vercel Dashboard → Add New → Project
☐ Klicke "Continue with GitHub"
☐ Suche "simple-workout"
☐ Wähle "saturas89/simple-workout"
☐ Klicke "Import"
☐ Warte auf Initial Deploy (3-5 min)
☐ ✅ Production URL notieren: https://simple-workout.vercel.app
```

---

## ✅ Schritt 3: Vercel Token generieren (2 min)

```
☐ Vercel → Profil Icon (oben rechts) → Settings
☐ Klicke "Tokens"
☐ Klicke "Create Token"
☐ Name: "GitHub Actions"
☐ Scope: "Full Account"
☐ Expiration: "No expiration"
☐ Klicke "Create"
☐ 🔑 TOKEN KOPIEREN (wird nicht wieder gezeigt!)

Token Format: abcd1234efgh5678ijkl9012mnop3456
```

---

## ✅ Schritt 4: Project & Org ID finden (2 min)

```
☐ Vercel Dashboard → Project (simple-workout)
☐ Klicke "Settings"
☐ Suche nach "Project ID"
☐ 📋 PROJECT ID KOPIEREN: prj_abc123...
☐ Suche nach "Team ID" (oder Username)
☐ 📋 ORG ID KOPIEREN: team_abc123... (oder username)
```

---

## ✅ Schritt 5: GitHub Secrets hinzufügen (3 min)

```
☐ GitHub.com → saturas89/simple-workout
☐ Klicke "Settings" → "Secrets and variables" → "Actions"

☐ NEW SECRET #1:
  Name: VERCEL_TOKEN
  Value: (dein Token von Schritt 3)

☐ NEW SECRET #2:
  Name: VERCEL_ORG_ID
  Value: (deine Org/Team ID von Schritt 4)

☐ NEW SECRET #3:
  Name: VERCEL_PROJECT_ID
  Value: (deine Project ID von Schritt 4)
```

**Result:** 3 Secrets sollten auftauchen
```
✅ VERCEL_TOKEN: ***
✅ VERCEL_ORG_ID: ***
✅ VERCEL_PROJECT_ID: ***
```

---

## ✅ Schritt 6: GitHub Actions Workflow erstellen (3 min)

```
☐ Lokales Repository
☐ Erstelle Datei: .github/workflows/deploy.yml
☐ Kopiere Workflow YAML (siehe VERCEL_SETUP.md)
☐ Speichere Datei
```

**Oder Commands:**
```bash
mkdir -p .github/workflows
touch .github/workflows/deploy.yml
# Datei mit Editor öffnen und YAML einfügen
```

---

## ✅ Schritt 7: Workflow committen & pushen (2 min)

```bash
☐ git add .github/workflows/deploy.yml
☐ git commit -m "Add GitHub Actions + Vercel deployment"
☐ git push origin docs/vercel-setup
```

---

## ✅ Schritt 8: Zu main mergen (1 min)

```bash
☐ git checkout main
☐ git pull origin main
☐ git merge docs/vercel-setup
☐ git push origin main
```

---

## ✅ Schritt 9: Ersten Deploy testen (5 min)

```
☐ GitHub → Actions Tab
☐ Beobachte "Build, Test & Deploy to Vercel" Workflow
☐ Sollte sehen: ✅ Build, ✅ Lint, ✅ Test, ✅ Deploy
☐ Warte auf "All Checks Passed"
☐ Vercel → Deployments Tab
☐ Sollte neuen Deployment mit Status "✅ Ready" sehen
☐ Klicke auf Deployment URL oder gehe zu:
  https://simple-workout.vercel.app
☐ 🎉 App sollte LIVE sein!
```

---

## ✅ Schritt 10: Alles fertig!

```
Jetzt passiert automatisch bei jedem Push zu main:

git push origin main
    ↓
GitHub Actions:
  ✅ Build
  ✅ Lint
  ✅ Tests
  ✅ Deploy zu Vercel
    ↓
🚀 App is LIVE!
```

---

## 🔐 Sicherheit überprüfen

```
☐ .env ist in .gitignore?
☐ Passwörter sind in GitHub Secrets?
☐ VERCEL_TOKEN ist nicht im Code?
☐ Keine .env Datei committed?
```

---

## 🚀 Du bist fertig!

Ab jetzt:

```
Jedes Mal wenn du:
  git push origin main

Passiert automatisch:
  GitHub Actions startet
  → Build + Test + Lint
  → Deploy zu Vercel
  → App is LIVE in 3-5 min!
```

---

## ❓ Wenn etwas nicht funktioniert

```
1. Überprüfe GitHub Actions Logs:
   GitHub → Actions → fehlgeschlagener Workflow
   
2. Häufige Fehler:
   - VERCEL_TOKEN falsch
   - VERCEL_ORG_ID falsch
   - VERCEL_PROJECT_ID falsch
   
3. Solutions:
   - Regeneriere Token
   - Überprüfe Project Settings
   - Überprüfe GitHub Secrets

4. Detailliertes Troubleshooting:
   Siehe VERCEL_SETUP.md → Troubleshooting
```

---

## 📝 Notizen

```
Meine Vercel URLs:
- Production: https://simple-workout.vercel.app
- (Preview URLs generieren automatisch für PRs)

Meine GitHub Secrets sind gesetzt:
- ✅ VERCEL_TOKEN
- ✅ VERCEL_ORG_ID
- ✅ VERCEL_PROJECT_ID

Workflow ist aktiv:
- ✅ .github/workflows/deploy.yml vorhanden
```

