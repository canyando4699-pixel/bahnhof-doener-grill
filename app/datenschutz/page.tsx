import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz — Bahnhof Döner Grill',
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen pt-20">
      <article className="max-w-container mx-auto px-[var(--container-px)] py-16 max-w-2xl">
        <h1 className="font-display text-5xl text-[var(--color-text)] mb-10">Datenschutzerklärung</h1>

        <section className="space-y-8 text-muted leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">1. Verantwortlicher</h2>
            <p>Bahnhof Döner Grill</p>
            <p>Inhaber: Ömer Yando</p>
            <p>Am Bahnhof 10</p>
            <p>35066 Frankenberg</p>
            <p>
              Telefon:{' '}
              <a href="tel:06451240925" className="hover:text-[var(--color-text)] transition-colors">
                06451 240925
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">2. Hosting</h2>
            <p>Diese Website wird gehostet bei:</p>
            <p className="mt-2">
              STRATO AG<br />
              Otto-Ostrowski-Straße 7<br />
              10249 Berlin<br />
              <a href="https://www.strato.de" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
                www.strato.de
              </a>
            </p>
            <p className="mt-2">
              Beim Besuch dieser Website erfasst STRATO automatisch Server-Logfiles (IP-Adresse,
              Zeitpunkt des Zugriffs, Browsertyp, Betriebssystem, Referrer-URL). Die Verarbeitung
              erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Mit STRATO besteht ein Vertrag
              zur Auftragsverarbeitung gemäß Art. 28 DSGVO.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">3. Externe Links (Google Maps)</h2>
            <p>
              Diese Website enthält Links zu Google Maps. Wenn Sie einen solchen Link anklicken,
              werden Sie auf die Server von Google (Google LLC, 1600 Amphitheatre Parkway,
              Mountain View, CA 94043, USA) weitergeleitet. Dabei können Daten wie Ihre IP-Adresse
              an Google übermittelt werden. Für die Datenverarbeitung durch Google ist Google
              verantwortlich. Weitere Informationen finden Sie in der{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                Datenschutzerklärung von Google
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">4. Keine Cookies / kein Tracking</h2>
            <p>
              Diese Website verwendet keine eigenen Cookies und kein Tracking. Es werden keine
              Analyse- oder Marketing-Tools eingesetzt.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2">5. Ihre Rechte</h2>
            <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
            Verarbeitung sowie Widerspruch. Beschwerden können Sie an die zuständige
            Aufsichtsbehörde richten:</p>
            <p className="mt-2">
              Der Hessische Beauftragte für Datenschutz und Informationsfreiheit<br />
              Postfach 3163, 65021 Wiesbaden<br />
              <a href="https://datenschutz.hessen.de" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
                datenschutz.hessen.de
              </a>
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
