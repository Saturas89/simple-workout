# Dokumentation - Simple Workout

Dieses Verzeichnis enthält die gesamte Dokumentation für das Simple Workout Projekt.

## Verzeichnisstruktur

```
docs/
├── README.md                          # Dieses Dokument
├── PROJECT.md                         # Projektübersicht und Glossar
├── requirements/                      # Anforderungsdefinitionen
│   └── REQUIREMENTS_TEMPLATE.md       # Template für neue Anforderungen
├── modules/                           # Module des Projekts
│   ├── core/                          # Core-Modul
│   │   ├── SPECIFICATION.md           # Spezifikation des Core-Moduls
│   │   ├── REQUIREMENTS.md            # Anforderungen für Core
│   │   └── ARCHITECTURE.md            # Architektur-Details
│   ├── ui/                            # UI-Modul
│   │   ├── SPECIFICATION.md
│   │   ├── REQUIREMENTS.md
│   │   └── ARCHITECTURE.md
│   └── [weitere Module]/
├── design/                            # Design und UX Dokumentation
│   └── DESIGN_SYSTEM.md               # Design System und Standards
├── api/                               # API-Dokumentation
│   └── API_REFERENCE.md               # API Referenz (wenn zutreffend)
└── guides/                            # Anleitungen
    └── CONTRIBUTING.md                # Contributing Guide
```

## Wie man Anforderungen definiert

1. **Neue Anforderung erstellen:**
   - Gehe zu `requirements/`
   - Nutze die Vorlage in `REQUIREMENTS_TEMPLATE.md`
   - Speichere unter `requirements/[FEATURE_NAME].md`

2. **Vorlage ausfüllen:**
   - ID: Eindeutige Identifikation (z.B. REQ-001)
   - Titel: Klare Beschreibung
   - Beschreibung: Detaillierte Anforderung
   - Akzeptanzkriterien: Konkrete Erfolgskriterien
   - Priorität: High/Medium/Low
   - Modul: Zu welchem Modul gehört es

## Modulstruktur

Jedes Modul hat folgende Dateien:

- **SPECIFICATION.md** - Technische Spezifikation
- **REQUIREMENTS.md** - Funktionale Anforderungen
- **ARCHITECTURE.md** - Architektur und Design
- **CHANGELOG.md** (optional) - Änderungshistorie des Moduls

## Versionierung

- Alle Dokumente folgen Semantic Versioning (z.B. 1.0.0)
- Änderungen werden in der CHANGELOG.md dokumentiert
- Veraltete Versionen sollten archiviert werden

## Status der Dokumente

Dokumente können folgende Status haben:
- 🟢 **DRAFT** - In Entwicklung
- 🟡 **REVIEW** - Zur Überprüfung
- 🟢 **APPROVED** - Genehmigt und gültig
- 🔴 **DEPRECATED** - Nicht mehr gültig
