# Architektur: Mehrseitige Speisekarte — Bahnhof Döner

**Projekt:** Editierbare Speisekarte mit Print- und Web-Ausgabe
**Stand:** 2026-02-15
**Kategorien:** 6 Hauptkategorien, 89 Gerichte
**Ausgabeformate:** HTML/CSS (Web) + PDF (Print)

---

## 1. Datenmodell (JSON-Struktur)

### 1.1 Haupt-Datenstruktur

Das gesamte Menü wird in einer **einzigen JSON-Datei** gespeichert, die klar zwischen Metadaten, Kategorien und Gerichten trennt:

```
menu.json
├── restaurant (Metadaten)
│   ├── name: "Bahnhof Döner"
│   ├── address: "Am Bahnhof 12, 35066 Frankenberg"
│   ├── lastUpdated: "2024-10-21"
│   └── branding (Farben, Logo-Pfad, Schriftarten)
│
├── categories (Array von Kategorien)
│   ├── [0] Salate
│   │   ├── id: "salate"
│   │   ├── name: "Salate"
│   │   ├── icon: "🥗" (optional)
│   │   ├── pageBreak: true (startet neue Seite)
│   │   └── items: [Array von Gerichten]
│   │
│   ├── [1] Pizza
│   │   └── items: [33 Pizza-Gerichte]
│   │
│   └── ... (weitere Kategorien)
│
└── config (Seitenlayout-Einstellungen)
    ├── itemsPerPage: 12 (Richtwert)
    ├── pageFormat: "A4-landscape"
    └── columnLayout: "2-column"
```

### 1.2 Gericht-Objekt (Item)

Jedes Gericht folgt diesem Schema:

```
{
  "id": "tomatensalat",
  "name": "Tomatensalat",
  "description": "mit Essig-Öl, Basilikum",
  "prices": {
    "klein": "4,00 €",
    "groß": "6,50 €"
  },
  "badges": ["vegetarisch"]
}
```

**Für Einzelpreis-Gerichte** (z.B. Döner-Teller):

```
{
  "id": "drehspiessteller-1",
  "name": "Drehspießteller",
  "description": "Hackfleisch vom Kalb mit gemischtem Salat",
  "price": "7,00 €"
}
```

**Badges** (Kennzeichnungen):
- `"vegetarisch"` → Zeigt grünes Icon
- `"scharf"` → Zeigt Chili-Icon
- `"neu"` → Zeigt "NEU"-Badge

---

## 2. Seitenlogik (Page-Break-Regeln)

### 2.1 Strategie: **1 Kategorie = 1 Seite**

**Warum diese Strategie?**
- **Übersichtlich:** Kunde findet Pizza-Kategorie auf einer dedizierten Seite
- **Wartbar:** Neue Gerichte in Kategorie hinzufügen ohne Layout-Chaos
- **Flexibel:** Kategorien mit wenig Gerichten (6 Items) nutzen Platz für größere Schrift/Bilder

**Seitenzuordnung:**

| Seite | Kategorie | Anzahl Gerichte | Layout-Strategie |
|-------|-----------|----------------|------------------|
| 1 | **Titelseite** | — | Restaurant-Info, Logo, Öffnungszeiten |
| 2 | Salate | 8 | 2-Spalten, große Beschreibungen |
| 3 | Pizza (Teil 1) | 17 | 2-Spalten, kompakt |
| 4 | Pizza (Teil 2) | 16 | 2-Spalten, kompakt |
| 5 | Drehspieß (Döner) Teller | 8 | 2-Spalten, mittelgroß |
| 6 | Lahmacun | 6 | 2-Spalten, große Darstellung |
| 7 | Kleine Gerichte (Teil 1) | 12 | 3-Spalten, kompakt |
| 8 | Kleine Gerichte (Teil 2) | 9 | 3-Spalten, kompakt |
| 9 | Drehspieß (Döner) | 13 | 2-Spalten, mittelgroß |

**Sonderfall: Pizza-Kategorie (33 Gerichte)**
- Automatische Aufteilung auf 2 Seiten (Teil 1: 17 Items, Teil 2: 16 Items)
- Logik: `if (category.items.length > 18) → split into pages`

### 2.2 Automatische Seitenumbruch-Logik

```
Für jede Kategorie:
  WENN pageBreak = true:
    ➜ Neue Seite starten

  WENN Anzahl Gerichte > maxItemsPerPage:
    ➜ Kategorie auf mehrere Seiten aufteilen
    ➜ Seitennummer anzeigen: "Pizza (1/2)", "Pizza (2/2)"

  SONST:
    ➜ Alle Gerichte auf einer Seite
```

---

## 3. Komponentenstruktur

### 3.1 System-Übersicht

```
Speisekarte-System
│
├── DATA LAYER (Inhalte)
│   └── menu.json → Zentrale Datei mit allen Gerichten
│
├── TEMPLATE ENGINE (Generator)
│   ├── page-generator.js → Liest JSON, erstellt HTML-Seiten
│   ├── pdf-generator.js → Konvertiert HTML → PDF (Druckversion)
│   └── config.json → Layout-Einstellungen (Spalten, Farben, Schriften)
│
├── DESIGN SYSTEM (Styling)
│   ├── styles/
│   │   ├── base.css → Typografie, Farben, Grundstile
│   │   ├── print.css → Print-spezifische Styles (@media print)
│   │   ├── web.css → Web-spezifische Styles (responsiv)
│   │   └── components.css → Wiederverwendbare Komponenten
│   │
│   └── assets/
│       ├── logo.svg → Restaurant-Logo
│       ├── icons/ → Vegetarisch-Icon, Chili-Icon, etc.
│       └── chili-illustration.svg → Dekorative Grafik
│
└── OUTPUT (Generierte Dateien)
    ├── web/
    │   ├── index.html → Titelseite
    │   ├── salate.html → Kategorie-Seite
    │   ├── pizza-1.html
    │   └── ...
    │
    └── print/
        ├── menu-print.html → Alle Seiten in einem Dokument
        └── menu.pdf → Fertiges PDF (generiert aus HTML)
```

### 3.2 UI-Komponenten (Wiederverwendbare Bausteine)

#### A) **MenuPage** (Seiten-Container)
```
MenuPage
├── Header
│   ├── Restaurant-Logo
│   ├── Kategorie-Titel ("Salate")
│   └── Dekorative Grafik (Chili-Illustration)
│
├── ItemGrid (2-Spalten oder 3-Spalten)
│   ├── MenuItem (Wiederholbar)
│   │   ├── ItemName ("Tomatensalat")
│   │   ├── ItemDescription ("mit Essig-Öl, Basilikum")
│   │   ├── PriceDisplay
│   │   │   ├── "klein: 4,00 €"
│   │   │   └── "groß: 6,50 €"
│   │   └── Badges (Vegetarisch-Icon, Scharf-Icon)
│   │
│   └── (weitere MenuItems...)
│
└── Footer
    ├── Seitenzahl ("Seite 2/9")
    └── Last-Updated ("Stand: 21.10.2024")
```

#### B) **MenuItem** (Einzelnes Gericht)
```
MenuItem
├── ItemHeader
│   ├── ItemName (fett, groß)
│   └── Badges (Icons rechts oben)
│
├── ItemDescription (grauer Text, kleiner)
│
└── PriceSection
    ├── WENN zwei Preise:
    │   ├── "klein: X,XX €"
    │   └── "groß: X,XX €"
    └── SONST:
        └── "X,XX €" (einzelner Preis, rechtsbündig)
```

#### C) **CategoryHeader** (Kategorie-Überschrift)
```
CategoryHeader
├── Icon (optional, z.B. 🥗 für Salate)
├── CategoryTitle ("Salate", sehr groß, fett)
└── Dekorative Linie (unter Titel)
```

---

## 4. Technische Entscheidungen (WARUM?)

### 4.1 JSON als Datenquelle

**Warum JSON statt Datenbank?**
- ✅ **Einfach editierbar:** Du öffnest `menu.json` in einem Editor und änderst Preise/Gerichte
- ✅ **Versionskontrollierbar:** Git-Tracking für Änderungshistorie
- ✅ **Kein Server nötig:** Statische Website möglich (schnell, sicher)
- ✅ **Portabel:** JSON kann in Excel exportiert/importiert werden

**Alternative:** Für 89 Gerichte ist eine Datenbank überdimensioniert.

### 4.2 Statische HTML-Generierung

**Warum nicht dynamisch (React/Vue)?**
- ✅ **Druckoptimierung:** HTML → PDF funktioniert perfekt
- ✅ **Performance:** Keine JavaScript-Ladezeiten
- ✅ **SEO-freundlich:** Suchmaschinen lesen statisches HTML direkt
- ✅ **Offline nutzbar:** Restaurant kann Speisekarte ohne Internet laden

**Workflow:**
1. JSON bearbeiten → `menu.json`
2. Generator ausführen → `npm run build`
3. Output: Fertige HTML-Dateien + PDF

### 4.3 CSS Print Media Queries

**Warum CSS statt InDesign/Canva?**
- ✅ **Ein Design, zwei Ausgaben:** Gleicher Code für Web + Print
- ✅ **Automatisierbar:** Änderungen in JSON → automatisch neues PDF
- ✅ **Präzise Kontrolle:** `@page` CSS für Seitenränder, Umbrüche

**Print-spezifische CSS-Regeln:**
```
@media print {
  - Seitenumbrüche: page-break-after: always
  - CMYK-Farben: color: cmyk(...)
  - Keine Schatten/Animationen
  - A4 Landscape: @page { size: A4 landscape; }
}
```

### 4.4 Modularität: Trennung von Inhalt & Design

**Architektur-Prinzip:**
```
CONTENT (menu.json)
    ↓
LOGIC (Generator liest JSON)
    ↓
TEMPLATE (HTML-Struktur)
    ↓
STYLE (CSS anwenden)
    ↓
OUTPUT (HTML/PDF)
```

**Vorteil:** Designänderungen (Farbe, Schrift) = nur CSS anfassen, NICHT JSON!

---

## 5. Ausgabeformate

### 5.1 Web-Version (HTML/CSS)

**Features:**
- Responsive Design (funktioniert auf Tablet/Smartphone)
- Navigation: Klickbare Kategorie-Links (sticky sidebar)
- Suchfunktion: Gerichte filtern nach Name
- Accessibility: Screen-Reader-freundlich (ARIA-Labels)

**Technologie:**
- Vanilla HTML/CSS (kein Framework nötig)
- Optional: Leichte JavaScript-Suche (< 50 Zeilen)

### 5.2 Print-Version (PDF)

**Features:**
- A4 Querformat (841.89 × 595.276 pt)
- CMYK-Farbprofil für professionellen Druck
- 3mm Beschnittzugabe (bleed)
- Seitenzahlen im Footer

**PDF-Generierung:**
- Tool: **Playwright** oder **Puppeteer** (HTML → PDF)
- Vorteil: 100% identisch zur Web-Version, nur optimiert für Druck

---

## 6. Ordnerstruktur

```
bahnhof-doener-menu/
│
├── data/
│   └── menu.json                 ← Zentrale Datendatei (editierbar)
│
├── templates/
│   ├── page.html                 ← HTML-Template für Kategorie-Seite
│   ├── item.html                 ← Template für einzelnes Gericht
│   └── index.html                ← Titelseite-Template
│
├── styles/
│   ├── base.css                  ← Grundstile (Farben, Typografie)
│   ├── components.css            ← MenuItem, CategoryHeader, etc.
│   ├── print.css                 ← Print-spezifische Styles
│   └── web.css                   ← Web-responsive Styles
│
├── assets/
│   ├── logo.svg
│   ├── chili-illustration.svg
│   └── icons/
│       ├── vegetarisch.svg
│       └── scharf.svg
│
├── scripts/
│   ├── generate-html.js          ← Liest menu.json → erstellt HTML
│   ├── generate-pdf.js           ← Konvertiert HTML → PDF
│   └── config.json               ← Layout-Konfiguration
│
├── dist/                         ← Generierte Dateien (nicht editieren!)
│   ├── web/
│   │   ├── index.html
│   │   ├── salate.html
│   │   └── ...
│   └── print/
│       └── menu.pdf
│
├── package.json                  ← NPM-Dependencies
└── README.md                     ← Anleitung zur Nutzung
```

---

## 7. Workflow: Speisekarte bearbeiten

### Schritt 1: Gericht hinzufügen
```
1. Öffne data/menu.json
2. Finde die passende Kategorie (z.B. "pizza")
3. Füge neues Gericht-Objekt hinzu:
   {
     "id": "pizza-4-kaese",
     "name": "Quattro Formaggi",
     "description": "mit 4 Käsesorten",
     "prices": { "klein": "4,50 €", "groß": "6,50 €" }
   }
4. Speichern
```

### Schritt 2: Speisekarte neu generieren
```
Terminal:
$ npm run build

→ Generator liest menu.json
→ Erstellt neue HTML-Dateien in dist/web/
→ Erstellt neues PDF in dist/print/menu.pdf
```

### Schritt 3: Resultat ansehen
```
Web-Version:
→ Öffne dist/web/index.html im Browser

Print-Version:
→ Öffne dist/print/menu.pdf
→ Bereit für Druck!
```

---

## 8. Dependencies (benötigte Pakete)

| Paket | Zweck |
|-------|-------|
| **Mustache** (oder Handlebars) | Template-Engine für HTML-Generierung aus JSON |
| **Playwright** | HTML → PDF Konvertierung (inklusive CSS Print Media) |
| **fs-extra** | Datei-Operationen (JSON lesen, HTML schreiben) |
| **chokidar** (optional) | Auto-Rebuild bei JSON-Änderungen (Watch-Mode) |

**Installation:**
```
npm install mustache playwright fs-extra chokidar --save-dev
```

---

## 9. Vorteile dieser Architektur

### ✅ Wartbarkeit
- **Inhalte ändern:** Nur `menu.json` bearbeiten, kein HTML anfassen
- **Design ändern:** Nur CSS bearbeiten, Inhalte bleiben unberührt
- **Neue Kategorie:** Einfach neues Objekt in `menu.json` einfügen

### ✅ Erweiterbarkeit
- **Sprachen hinzufügen:** `menu-de.json`, `menu-en.json` → Mehrsprachigkeit
- **Bilder:** `"image": "pizza-margherita.jpg"` → automatisch eingebunden
- **Allergene:** Neues Feld `"allergens": ["Gluten", "Milch"]` → Badge anzeigen

### ✅ Kein Monolith
- **Modulares System:** Jede Komponente (Generator, Styles, Templates) ist eigenständig
- **Austauschbar:** Template-Engine wechseln? Nur `generate-html.js` ändern
- **Testbar:** JSON validieren, HTML-Output testen, PDF-Qualität prüfen

---

## 10. Nächste Schritte

### Phase 1: Setup (Foundation)
1. Projekt-Ordner erstellen (`bahnhof-doener-menu/`)
2. `menu.json` aus `requirements.md` generieren
3. NPM-Projekt initialisieren (`npm init`)
4. Dependencies installieren

### Phase 2: Design System (Styles)
1. `base.css` erstellen (Farben, Schriften aus SVG-Template)
2. `components.css` für MenuItem, CategoryHeader, etc.
3. `print.css` für PDF-Optimierung

### Phase 3: Template Engine (Generator)
1. `generate-html.js` schreiben (JSON → HTML)
2. HTML-Templates erstellen (`page.html`, `item.html`)
3. Generator testen mit 1 Kategorie (z.B. "Salate")

### Phase 4: Print-Ausgabe (PDF)
1. `generate-pdf.js` mit Playwright einrichten
2. A4-Landscape-Format testen
3. CMYK-Farben + Beschnittzugabe konfigurieren

### Phase 5: Finalisierung
1. Alle 6 Kategorien in `menu.json` einfügen
2. Web- und Print-Version generieren
3. Qualitätskontrolle (Drucktest, Responsive-Test)

---

## 11. Fragen & Antworten

**Q: Kann ich später Bilder zu Gerichten hinzufügen?**
A: Ja! Einfach `"image": "pfad/zum/bild.jpg"` in menu.json einfügen. Der Generator bindet es automatisch ein.

**Q: Wie ändere ich die Farben?**
A: In `styles/base.css` die CSS-Variablen ändern:
```
:root {
  --primary-color: #FC683F;  ← Orange/Rot
  --bg-dark: #1A1516;        ← Dunkler Hintergrund
  --text-light: #FAF0E8;     ← Helle Schrift
}
```

**Q: Kann ich die Seitenzahl pro Kategorie ändern?**
A: Ja, in `menu.json` für jede Kategorie:
```
{
  "id": "pizza",
  "maxItemsPerPage": 18  ← Mehr/weniger Gerichte pro Seite
}
```

**Q: Brauche ich einen Webserver?**
A: Nein! Die generierten HTML-Dateien funktionieren offline (Doppelklick auf `index.html`).

---

**Architektur erstellt von:** Claude Opus 4.6
**Für Projekt:** Bahnhof Döner — Mehrseitige Speisekarte
**Bereit für:** Frontend-Implementierung (/frontend)
