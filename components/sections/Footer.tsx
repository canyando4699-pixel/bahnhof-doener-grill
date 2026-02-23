import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-container mx-auto px-[var(--container-px)] py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-base font-semibold text-[var(--color-text)] mb-3">Bahnhof Döner Grill</p>
            <address className="not-italic text-muted text-sm leading-relaxed">
              Am Bahnhof 10<br />
              35066 Frankenberg<br />
              <a href="tel:06451240925" className="hover:text-[var(--color-text)] transition-colors">
                06451 240925
              </a>
            </address>
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Öffnungszeiten</p>
            <p className="text-muted text-sm">Mo–Do & So: 10:00 – 23:00</p>
            <p className="text-muted text-sm">Fr & Sa: 10:00 – 24:00</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Rechtliches</p>
            <nav className="space-y-1.5" aria-label="Rechtliche Links">
              <Link href="/impressum" className="block text-muted hover:text-[var(--color-text)] text-sm transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="block text-muted hover:text-[var(--color-text)] text-sm transition-colors">
                Datenschutz
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-dim text-xs">
            &copy; {new Date().getFullYear()} Bahnhof Döner Grill. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
