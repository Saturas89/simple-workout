# REQ-001: PWA Foundation

**Status:** ✅ Implementiert | **Version:** 1.0.0 | **Priorität:** High

---

## Zusammenfassung

Die App ist als Progressive Web App aufgebaut. Sie ist installierbar und funktioniert vollständig offline, da alle Daten lokal im Browser gespeichert werden.

---

## Implementiert

- **FR-1.1** ✅ `public/manifest.json` vorhanden (Name, Icons, theme_color, display: standalone)
- **FR-1.2** ✅ `public/sw.js` Service Worker vorhanden
- **FR-1.3** ✅ App funktioniert vollständig ohne Internetverbindung (keine API-Calls)
- **FR-1.4** ✅ Layout funktioniert auf Mobile + Desktop (max-w-2xl, responsive)
- **FR-1.5** ✅ Safe-Area-Insets für Notch-Geräte (iOS) in `index.css`

## Nicht implementiert (kein Bedarf)

- Push Notifications → nicht geplant
- Hintergrund-Datensync → nicht relevant (kein Backend)
- Geräteübergreifende Synchronisation → nicht geplant

---

## Technische Details

- Entry Point: `src/index.tsx` → React 18 + `ReactDOM.createRoot`
- Font: System-Font-Stack (kein Google Fonts)
- Meta-Viewport: `width=device-width, initial-scale=1` in `index.html`
- Tailwind CSS für alle Styles (kein CSS-Framework)
