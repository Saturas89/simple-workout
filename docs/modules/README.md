# Module - Simple Workout

Übersicht aller Module im Projekt mit Links zu deren Dokumentation.

---

## 📋 Modulverzeichnis

### Module Hinzufügen

Um ein neues Modul hinzuzufügen:

1. Kopiere den Ordner `MODULE_TEMPLATE/`
2. Benenne ihn zu `[modul-name]/`
3. Fülle folgende Dateien aus:
   - `README.md` - Modulübersicht
   - `SPECIFICATION.md` - Technische Spezifikation
   - `REQUIREMENTS.md` - Funktionale Anforderungen
   - `ARCHITECTURE.md` - System-Design
   - `CHANGELOG.md` - Versionshistorie

4. Füge die Zeile unten in diese README ein:

```markdown
| [Modul Name] | [Kurzbeschreibung] | [Status] |
```

---

## 📦 Verfügbare Module

| Modulname | Beschreibung | Status | Dateien |
|-----------|------------|--------|---------|
| [Template] | Vorlage für neue Module | 🟢 DRAFT | [README](./MODULE_TEMPLATE/README.md) • [Spec](./MODULE_TEMPLATE/SPECIFICATION.md) • [Req](./MODULE_TEMPLATE/REQUIREMENTS.md) • [Arch](./MODULE_TEMPLATE/ARCHITECTURE.md) |

*Hinweis: Das obige Beispiel ist eine Vorlage. Ersetze es mit echten Modulen.*

---

## 🎯 Schnellnavigation

### Neue Module initialisieren

```bash
# 1. Kopiere das Template
cp -r MODULE_TEMPLATE/ [new-module]/

# 2. Bearbeite die Dateien
# 3. Commit mit git
git add docs/modules/[new-module]/
git commit -m "docs: Add [module-name] module documentation"
```

---

## 📊 Modul-Status-Übersicht

```
Legend:
🟢 DRAFT      = In Entwicklung
🟡 REVIEW     = Zur Überprüfung
✅ APPROVED   = Genehmigt und aktiv
🔴 DEPRECATED = Nicht mehr in Verwendung
```

---

## 🔄 Modul-Abhängigkeiten

[Hier können Abhängigkeitsdiagramme oder -tabellen eingefügt werden]

```
Module A
  └─ Module B
      └─ Module C
Module D
  └─ Module C (Shared)
```

---

## 📈 Modul-Roadmap

| Phase | Module | Zeitrahmen |
|-------|--------|-----------|
| Phase 1 | [Modul 1], [Modul 2] | [Q1 2026] |
| Phase 2 | [Modul 3], [Modul 4] | [Q2 2026] |
| Phase 3 | [Modul 5] | [Q3 2026] |

---

## 📚 Dokumentationsstruktur jedes Moduls

```
[module-name]/
├── README.md                # Modulübersicht
├── SPECIFICATION.md         # Technische Details
├── REQUIREMENTS.md          # Funktionale Anforderungen
├── ARCHITECTURE.md          # Architektur-Design
└── CHANGELOG.md             # Versionshistorie
```

---

## 🔗 Verwandte Dokumentation

- [Hauptdokumentation](../README.md)
- [Anforderungen](../requirements/)
- [Design System](../design/DESIGN_SYSTEM.md)
- [Contributing Guide](../guides/CONTRIBUTING.md)

