/**
 * Keyword-basiertes Bild-Mapping für Menü-Karten.
 *
 * NORMALISIERUNG (normalize):
 *   Bevor ein Vergleich stattfindet, werden BEIDE Seiten normalisiert:
 *   - Großbuchstaben → Kleinbuchstaben
 *   - ä → ae | ö → oe | ü → ue | ß → ss
 *   - Leerzeichen trimmen
 *
 *   Dadurch funktioniert das Matching unabhängig von Groß-/Kleinschreibung
 *   oder Umlaut-Codierung. Keywords können mit oder ohne Umlaute geschrieben werden.
 *
 * REIHENFOLGE: Spezifischere Regeln stehen VOR allgemeineren.
 *   Beispiel: "calzone" vor "pizza", "falafel" vor "döner"
 */

const BASE = '/images/menu';

interface ImageRule {
  /** Keywords in natürlicher Schreibweise — normalize() wird zur Laufzeit angewandt */
  keywords: string[];
  image: string;
}

/**
 * Normalisiert einen String für robustes Keyword-Matching.
 * Konvertiert zu Kleinbuchstaben und ersetzt deutsche Umlaute durch ASCII.
 */
export function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .trim();
}

/**
 * Zentrale Mapping-Tabelle: Keyword-Array → Bildpfad.
 * Reihenfolge entscheidet bei Überschneidungen (erste Regel gewinnt).
 */
const IMAGE_RULES: ImageRule[] = [

  // ── Verbindliche Einzel-Overrides (höchste Priorität) ────────────────────
  { keywords: ['falafel-box', 'falafel box'],              image: `${BASE}/doener-box.webp` },
  { keywords: ['falafel döner', 'falafel doener'],         image: `${BASE}/doener.webp` },
  { keywords: ['schnitzel döner', 'schnitzel doener'],     image: `${BASE}/doener-teller.webp` },
  { keywords: ['hähnchen-dönerburger'],                    image: `${BASE}/burger.webp` },
  { keywords: ['calzone hähnchen döner'],                  image: `${BASE}/calzone.webp` },
  { keywords: ['hähnchen döner'],                          image: `${BASE}/doener.webp` },
  { keywords: ['pizza döner'],                             image: `${BASE}/pizza.webp` },
  { keywords: ['bahnhof-pizza-döner'],                     image: `${BASE}/pizza.webp` },
  { keywords: ['pide döner'],                              image: `${BASE}/pide.webp` },

  // ── Falafel (vor Döner, da spezifischer) ─────────────────────────────────
  { keywords: ['falafel'],                                    image: `${BASE}/falafelteller.webp` },

  // ── Calzone (vor Pizza, da spezifischer) ─────────────────────────────────
  // Trifft: Calzone Gefüllt, Calzone Tonno-Hawaii, Calzone Döner, Calzone Hähnchen Döner
  { keywords: ['calzone'],                                    image: `${BASE}/calzone.webp` },

  // ── Hähnchen-Varianten ───────────────────────────────────────────────────
  { keywords: ['chickenburger', 'chicken burger'],            image: `${BASE}/chickenburger.webp` },
  { keywords: ['chicken nuggets', 'chickennuggets'],          image: `${BASE}/chicken-nuggets.webp` },
  // "hähnchen" trifft auch "Hähnchen Döner" und "Hähnchen-Dönerburger"
  { keywords: ['hähnchen'],                                   image: `${BASE}/haehnchen.webp` },

  // ── Döner-Varianten (spezifisch → allgemein) ─────────────────────────────
  { keywords: ['döner teller', 'drehspießteller',
               'drehspieß teller', 'drehspieß portion'],      image: `${BASE}/doener-teller.webp` },
  { keywords: ['dönerburger'],                                image: `${BASE}/burger.webp` },
  { keywords: ['döner box', 'drehspieß-box', 'drehspieß box'], image: `${BASE}/doener-box.webp` },

  // ── Salate (VOR allgemeinem Döner, damit "Salat Bahnhof-Döner" korrekt trifft)
  { keywords: ['salat', 'sommersalat', 'bauernsalat',
               'tomatensalat'],                               image: `${BASE}/salat.webp` },

  // ── Allgemeiner Döner / Drehspieß ─────────────────────────────────────────
  { keywords: ['döner', 'drehspieß', 'drehspiess'],           image: `${BASE}/doener.webp` },

  // ── Burger ────────────────────────────────────────────────────────────────
  { keywords: ['doppel hamburger', 'doppel burger'],          image: `${BASE}/doppel-burger.webp` },
  { keywords: ['hamburger', 'cheeseburger',
               'hawaii-burger', 'hawaii burger'],             image: `${BASE}/burger.webp` },

  // ── Wurst / Grill ─────────────────────────────────────────────────────────
  { keywords: ['bratwurst', 'currywurst',
               'jägerwurst', 'zigeunerwurst'],                image: `${BASE}/bratwurst.webp` },

  // ── Schnitzel ─────────────────────────────────────────────────────────────
  { keywords: ['schnitzel'],                                  image: `${BASE}/schnitzel.webp` },

  // ── Lahmacun / Yufka / Pide / Sandwich ───────────────────────────────────
  { keywords: ['lahmacun'],                                   image: `${BASE}/lahmacun.webp` },
  { keywords: ['yufka'],                                      image: `${BASE}/yufka.webp` },
  { keywords: ['pide'],                                       image: `${BASE}/pide.webp` },
  { keywords: ['sandwich'],                                   image: `${BASE}/sandwich.webp` },

  // ── Pizza (inkl. Pizzabrot — "pizzabrot" enthält "pizza") ─────────────────
  { keywords: ['pizza', 'margherita', 'margharita',
               'quattro formaggi'],                           image: `${BASE}/pizza.webp` },

  // ── Börek ─────────────────────────────────────────────────────────────────
  { keywords: ['börek'],                                      image: `${BASE}/boerek.webp` },

  // ── Soßen / Dips ──────────────────────────────────────────────────────────
  { keywords: ['jäger, zigeuner', 'currysoße'],               image: `${BASE}/sosse.webp` },
  { keywords: ['ketchup', 'mayonnaise'],                      image: `${BASE}/ketchup.webp` },

  // ── Beilagen ──────────────────────────────────────────────────────────────
  { keywords: ['pommes'],                                     image: `${BASE}/pommes.webp` },
];

/**
 * Gibt den passenden WebP-Bildpfad für ein Menüelement zurück.
 *
 * Ablauf:
 *   1. Item-Name normalisieren
 *   2. Jeden Eintrag in IMAGE_RULES prüfen (Keywords ebenfalls normalisiert)
 *   3. Ersten Treffer zurückgeben
 *   4. Kein Treffer → Kategorie-Fallback prüfen
 *   5. Immer noch kein Treffer → null (Karte wird ohne Bild gerendert)
 *
 * @param itemName   Name des Gerichts (z.B. "Hähnchen Döner")
 * @param categoryId Kategorie-ID aus menu.json (z.B. "pizza", "drehspiess")
 * @returns Öffentlicher Bildpfad oder null
 */
export function getMenuImage(itemName: string, categoryId?: string): string | null {
  const name = normalize(itemName);

  // 1. Keyword-Matching (beide Seiten normalisiert)
  for (const rule of IMAGE_RULES) {
    if (rule.keywords.some((kw) => name.includes(normalize(kw)))) {
      return rule.image;
    }
  }

  // 2. Kategorie-Fallback (wenn kein Keyword getroffen hat)
  if (categoryId) {
    const cat = normalize(categoryId);
    if (cat === 'pizza')                                    return `${BASE}/pizza.webp`;
    if (cat === 'lahmacun')                                 return `${BASE}/lahmacun.webp`;
    if (cat === 'salate')                                   return `${BASE}/salat.webp`;
    if (cat === 'pide')                                     return `${BASE}/pide.webp`;
    if (cat.includes('teller'))                             return `${BASE}/doener-teller.webp`;
    if (cat.includes('drehspiess') || cat.includes('doener')) return `${BASE}/doener.webp`;
  }

  // 3. Kein Bild verfügbar — Karte wird ohne Bild angezeigt
  return null;
}
