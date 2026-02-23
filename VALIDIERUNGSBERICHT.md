# Validierungsbericht -- menu.json

**Projekt:** Bahnhof Doener Speisekarte
**Datei:** `data/menu.json`
**Validiert am:** 2026-02-15
**Ergebnis:** BESTANDEN (mit Hinweisen)

---

## 1. Zusammenfassung

| Pruefpunkt | Ergebnis | Details |
|------------|----------|---------|
| JSON-Syntax | BESTANDEN | Valides JSON, 25.699 Bytes |
| Gesamtanzahl Gerichte | BESTANDEN | 89 von 89 erwartet |
| Kategorien | BESTANDEN | 6 von 6 erwartet |
| Fehlende Preise | BESTANDEN | 0 Eintraege ohne Preis |
| Doppelte IDs | BESTANDEN | 0 doppelte IDs |
| Doppelte Namen | HINWEIS | 7 Gruppen (beabsichtigt, siehe Abschnitt 3) |
| Leere Beschreibungen | HINWEIS | 14 Eintraege (siehe Abschnitt 4) |
| Sicherheit (HTML/Script) | BESTANDEN | 0 unsichere Inhalte gefunden |
| Sonderzeichen-Escaping | BESTANDEN | Alle Umlaute und Sonderzeichen korrekt als Unicode-Escapes |

---

## 2. Kategorie-Statistik

| Kategorie | ID | Anzahl Gerichte | Erwartet | Status |
|-----------|----|-----------------|----------|--------|
| Salate | `salate` | 8 | 8 | OK |
| Pizza | `pizza` | 33 | 33 | OK |
| Drehspiess (Doener) Teller | `drehspiess-teller` | 8 | 8 | OK |
| Lahmacun (Tuerkische Pizza) | `lahmacun` | 6 | 6 | OK |
| Kleine Gerichte | `kleine-gerichte` | 21 | 21 | OK |
| Drehspiess (Doener) | `drehspiess` | 13 | 13 | OK |
| **Gesamt** | | **89** | **89** | **OK** |

---

## 3. Doppelte Namen (beabsichtigt)

Die folgenden Gerichte haben den gleichen Namen innerhalb einer Kategorie, unterscheiden sich aber durch ihre Beschreibung und/oder den Preis. Dies entspricht der Originalkarte und ist **kein Fehler**.

### 3.1 Pizza: "Pizzabrot" (2 Varianten)

| ID | Beschreibung | Preis |
|----|-------------|-------|
| `pizza-9` | mit Kaese | 3,00 / 4,00 |
| `pizza-10` | mit Tomatensosse und Knoblauch | 3,00 / 4,00 |

### 3.2 Drehspiess Teller: "Drehspiessteller" (5 Varianten)

| ID | Beschreibung | Preis |
|----|-------------|-------|
| `drehspiess-teller-1` | Hackfleisch vom Kalb mit gemischtem Salat | 7,00 |
| `drehspiess-teller-2` | Hackfleisch vom Kalb mit Pommes Frites | 7,00 |
| `drehspiess-teller-3` | Hackfleisch vom Kalb mit Weichkaese und gemischtem Salat | 7,50 |
| `drehspiess-teller-4` | Hackfleisch vom Kalb mit Pommes und gemischtem Salat | 8,00 |
| `drehspiess-teller-5` | Hackfleisch vom Kalb mit Reis und gemischtem Salat | 8,00 |

### 3.3 Lahmacun: "Lahmacun" (4 Varianten)

| ID | Beschreibung | Preis |
|----|-------------|-------|
| `lahmacun-1` | mit Salat | 4,00 |
| `lahmacun-2` | mit Doenerfleisch und Salat | 5,00 |
| `lahmacun-3` | mit doppelt Fleisch und Salat | 5,50 |
| `lahmacun-4` | mit Weichkaese und Salat | 4,50 |

### 3.4 Kleine Gerichte: "Port. Pommes" (2 Varianten)

| ID | Beschreibung | Preis |
|----|-------------|-------|
| `kleine-gerichte-1` | (klein) | 1,50 |
| `kleine-gerichte-2` | (gross) | 2,50 |

### 3.5 Kleine Gerichte: "1/2 Haehnchen" (3 Varianten)

| ID | Beschreibung | Preis |
|----|-------------|-------|
| `kleine-gerichte-10` | mit Brot | 4,00 |
| `kleine-gerichte-11` | mit Pommes | 6,00 |
| `kleine-gerichte-12` | mit Pommes und Salat | 7,00 |

### 3.6 Kleine Gerichte: "Schnitzel" (2 Varianten)

| ID | Beschreibung | Preis |
|----|-------------|-------|
| `kleine-gerichte-19` | mit Pommes | 6,00 |
| `kleine-gerichte-20` | mit Pommes und Salat | 7,00 |

### 3.7 Drehspiess: "Boerek" (2 Varianten)

| ID | Beschreibung | Preis |
|----|-------------|-------|
| `drehspiess-3` | mit Sosse | 4,50 |
| `drehspiess-4` | mit Salat und Sosse | 6,50 |

**Fazit:** Alle 7 Namens-Duplikate sind beabsichtigte Varianten desselben Gerichts mit unterschiedlichen Beilagen/Zubereitungen. Jedes hat eine eindeutige ID.

---

## 4. Leere Beschreibungen (14 Eintraege)

Die folgenden Gerichte haben keine Beschreibung. Dies entspricht der Originalkarte, da diese Gerichte keiner zusaetzlichen Erlaeuterung beduerfen.

### 4.1 Kleine Gerichte (12 Eintraege)

| ID | Name | Anmerkung |
|----|------|-----------|
| `kleine-gerichte-5` | Bratwurst | Standardgericht, selbsterklaerend |
| `kleine-gerichte-6` | Currywurst | Standardgericht, selbsterklaerend |
| `kleine-gerichte-7` | Jaegerwurst | Standardgericht, selbsterklaerend |
| `kleine-gerichte-8` | Zigeunerwurst | Standardgericht, selbsterklaerend |
| `kleine-gerichte-9` | Rindswurst | Standardgericht, selbsterklaerend |
| `kleine-gerichte-13` | Hamburger | Standardgericht, selbsterklaerend |
| `kleine-gerichte-14` | Doppel Hamburger | Standardgericht, selbsterklaerend |
| `kleine-gerichte-15` | Cheeseburger | Standardgericht, selbsterklaerend |
| `kleine-gerichte-16` | Hawaii-Burger | Standardgericht, selbsterklaerend |
| `kleine-gerichte-17` | Doenerburger | Standardgericht, selbsterklaerend |
| `kleine-gerichte-18` | Haehnchen-Doenerburger | Standardgericht, selbsterklaerend |
| `kleine-gerichte-21` | Chickenburger | Standardgericht, selbsterklaerend |

### 4.2 Drehspiess (2 Eintraege)

| ID | Name | Anmerkung |
|----|------|-----------|
| `drehspiess-6` | Haehnchen Doener | Standardgericht, selbsterklaerend |
| `drehspiess-13` | Falafel Doener | Standardgericht, selbsterklaerend |

**Fazit:** Alle 14 Eintraege sind bewusst ohne Beschreibung, da die Gerichtnamen selbsterklaerend sind. Die leeren Strings sind im JSON korrekt als `""` gespeichert.

---

## 5. Sicherheitspruefung

| Pruefung | Ergebnis |
|----------|----------|
| HTML-Tags in Texten | Keine gefunden |
| Script-Referenzen | Keine gefunden |
| Event-Handler-Attribute (onclick etc.) | Keine gefunden |
| javascript:-Protokoll | Keines gefunden |
| Sonderzeichen korrekt escaped | Ja (Unicode-Escapes fuer Umlaute) |

### Escaped Sonderzeichen im JSON:

| Zeichen | Unicode-Escape | Vorkommen |
|---------|----------------|-----------|
| ae | \u00e4 | Kaese, Haehnchen, Jaeger, etc. |
| oe | \u00f6 | Doener, Boerek, etc. |
| ue | \u00fc | Tuerkische, Meeresfruechte |
| ss (sz) | \u00df | Sosse, Weiss, gross |
| Euro | \u20ac | Alle Preisangaben |
| Oe | \u00d6 | Oel (Essig-Oel) |

---

## 6. Datenstruktur-Konformitaet

| Eigenschaft | Architektur-Vorgabe | Implementiert | Status |
|-------------|---------------------|---------------|--------|
| `restaurant`-Objekt mit Metadaten | Ja | Ja | OK |
| `categories`-Array | Ja | Ja (6 Kategorien) | OK |
| `config`-Objekt | Ja | Ja | OK |
| Dual-Preis-Schema (`prices.klein`/`prices.gross`) | Ja | Ja (Salate, Pizza) | OK |
| Einzel-Preis-Schema (`price`) | Ja | Ja (Doener, Lahmacun, Kleine Gerichte) | OK |
| `badges`-Array | Ja | Ja (vegetarisch, scharf) | OK |
| `pageBreak`-Flag | Ja | Ja (alle Kategorien) | OK |
| `maxItemsPerPage`-Override | Ja | Ja (Pizza: 18, Kleine Gerichte: 12) | OK |
| Eindeutige `id` pro Item | Ja | Ja (89 eindeutige IDs) | OK |
| `nr`-Feld fuer Originalnummerierung | Ja | Ja | OK |

---

## 7. Quelldaten-Auffaelligkeiten

Die folgenden Auffaelligkeiten stammen aus der Originalkarte und wurden 1:1 uebernommen:

1. **pizza-32 "Calzone Haehnchen Doener"**: Beschreibung lautet nur "mit Tomaten Doener" -- moeglicherweise unvollstaendig in der Quelle.
2. **pizza-33 "Quatro Formaggi Pizza"**: Beschreibung lautet "mit Tomaten, Schinken, Pilzen" -- fuer eine Vier-Kaese-Pizza ungewoehnlich, keine Kaese-Sorten erwaehnt. Moeglicherweise Fehler in der Quelle.
3. **pizza-24 "Kaesesvielfalt Pizza"** vs. **pizza-33 "Quatro Formaggi Pizza"**: Beide sind konzeptionell Vier-Kaese-Pizzen, aber mit unterschiedlichen Beschreibungen.

---

## 8. Gesamtbewertung

**Status: BESTANDEN**

Die Datei `data/menu.json` ist:
- Syntaktisch valides JSON
- Vollstaendig (89 von 89 Gerichten)
- Strukturkonform zur ARCHITECTURE.md
- Frei von Sicherheitsproblemen (kein HTML, kein Script)
- Alle Sonderzeichen korrekt als Unicode escaped
- Alle Preise vorhanden
- Alle IDs eindeutig

Die 14 leeren Beschreibungen und 7 Namens-Duplikate sind beabsichtigt und entsprechen der Originalkarte.
