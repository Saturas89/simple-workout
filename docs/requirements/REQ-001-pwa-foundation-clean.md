# REQ-001: PWA Foundation

**Status:** ✅ Implementiert | **Version:** 1.1.0 | **Priorität:** High

---

## Zusammenfassung

Die App ist als Progressive Web App aufgebaut. Sie ist auf iOS und Android direkt zum Startbildschirm hinzufügbar und verhält sich dort wie eine native App — keine Browser-Leiste, kein Browser-UI, kein "Web-App"-Feeling. Alle Daten werden lokal im Browser gespeichert (offline-fähig).

---

## Implementiert

- **FR-1.1** ✅ `public/manifest.json` — `display: "standalone"`, Icons, theme_color, background_color
- **FR-1.2** ✅ `public/sw.js` — Service Worker für Offline-Fähigkeit
- **FR-1.3** ✅ App funktioniert vollständig ohne Internetverbindung
- **FR-1.4** ✅ Layout responsive (Mobile + Desktop, `max-w-2xl`)
- **FR-1.5** ✅ Safe-Area-Insets für Notch-Geräte (iOS) via `viewport-fit=cover`
- **FR-1.6** ✅ App-Icons für iOS und Android vorhanden (192px, 512px, maskable, apple-touch-icon)
- **FR-1.7** ✅ In-App Installations-Prompt (`InstallPrompt` Komponente)
- **FR-1.8** ✅ Keine sichtbare Browser-Leiste nach Installation (standalone mode)

---

## Zum Startbildschirm hinzufügen

### iOS (Safari)
1. Seite in Safari öffnen
2. Teilen-Icon antippen (□↑)
3. „Zum Home-Bildschirm" wählen
4. Name bestätigen → Hinzufügen

→ App öffnet sich ohne Safari-UI, im Vollbild-Modus

### Android (Chrome)
1. Seite in Chrome öffnen
2. Die App zeigt automatisch ein Installations-Banner
3. „Installieren" tippen
4. App erscheint auf dem Startbildschirm wie eine native App

→ Alternativ: Chrome-Menü (⋮) → „App installieren" / „Zum Startbildschirm hinzufügen"

---

## InstallPrompt Komponente (`src/components/InstallPrompt.tsx`)

- Erscheint automatisch bei der **zweiten** App-Öffnung (nicht beim ersten Besuch)
- Wird **nicht** angezeigt, wenn die App bereits als PWA installiert ist (`display-mode: standalone`)
- Kann vom Nutzer dauerhaft weggeklickt werden (`install-dismissed` in localStorage)
- **Android/Chrome**: Fängt `beforeinstallprompt` Event ab → zeigt nativen Install-Button
- **iOS/Safari**: Zeigt Anleitung mit Teilen-Icon und „Zum Home-Bildschirm"-Text
- Positioniert sich oberhalb der Tab-Leiste (bottom-20)

---

## PWA Manifest (`public/manifest.json`)

```json
{
  "name": "Simple Workout",
  "short_name": "Workout",
  "display": "standalone",
  "orientation": "portrait-primary",
  "start_url": "/",
  "scope": "/",
  "theme_color": "#030712",
  "background_color": "#030712"
}
```

## App-Icons (`public/`)

| Datei | Größe | Zweck |
|---|---|---|
| `icon.svg` | skalierbar | Browser-Favicon (modern) |
| `icon-192.png` | 192×192 | Android Home Screen |
| `icon-512.png` | 512×512 | Android Splash / Store |
| `icon-192-maskable.png` | 192×192 | Android (adaptive icon) |
| `icon-512-maskable.png` | 512×512 | Android (adaptive icon, groß) |
| `apple-touch-icon.png` | 180×180 | iOS Home Screen Icon |

---

## iOS-spezifische Meta-Tags (`index.html`)

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Simple Workout" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

- `apple-mobile-web-app-capable` → aktiviert Fullscreen-Modus auf iOS
- `black-translucent` → Status-Bar überlappt die App (kein weißer Balken oben)
- `viewport-fit=cover` → Inhalt reicht bis in die Notch/Dynamic Island

---

## Technische Details

- Entry Point: `src/index.tsx` → React 18 + `ReactDOM.createRoot`
- Font: System-Font-Stack (kein Google Fonts)
- Meta-Viewport: `width=device-width, initial-scale=1.0, viewport-fit=cover`
- Tailwind CSS für alle Styles
