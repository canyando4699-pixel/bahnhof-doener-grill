import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum — Bahnhof Döner Grill',
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen pt-20">
      <article className="max-w-container mx-auto px-[var(--container-px)] py-16 max-w-2xl">
        <h1 className="font-display text-5xl text-[var(--color-text)] mb-10">Impressum</h1>

        <section className="space-y-8 text-muted leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">Angaben gemäß § 5 TMG</h2>
            <p>Bahnhof Döner Grill</p>
            <p>Inhaber: Ömer Yando</p>
            <p>Am Bahnhof 10</p>
            <p>35066 Frankenberg</p>
            <p>Deutschland</p>
            <p className="mt-2">
              Telefon:{' '}
              <a href="tel:06451240925" className="hover:text-[var(--color-text)] transition-colors">
                06451 240925
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <p>Ömer Yando</p>
            <p>Am Bahnhof 10</p>
            <p>35066 Frankenberg</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
              Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
              überwachen.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">Haftung für Links</h2>
            <p>
              Unsere Website enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">Urheberrecht</h2>
            <p>
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website
              unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung oder Verbreitung
              bedürfen der schriftlichen Zustimmung.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
