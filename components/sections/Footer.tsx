import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#050403] border-t border-border overflow-hidden">
      <div className="max-w-container mx-auto px-[var(--container-px)] pt-16 pb-8">
        {/* Riesige Wortmarke */}
        <p
          className="font-display uppercase text-[clamp(3rem,11vw,9rem)] leading-[0.85] text-outline-dim select-none"
          aria-hidden="true"
        >
          Bahnhof
          <br />
          Döner Grill
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--color-text-dim)] mb-4">Adresse</p>
            <address className="not-italic text-[var(--color-text-muted)] text-sm leading-relaxed">
              Am Bahnhof 10<br />
              35066 Frankenberg (Eder)<br />
              <a href="tel:06451240925" className="link-sweep text-[var(--color-text)] inline-block mt-2">
                06451 240925
              </a>
            </address>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--color-text-dim)] mb-4">Öffnungszeiten</p>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              Mo – Do & So: 10 – 23 Uhr<br />
              Fr & Sa: 10 – 24 Uhr
            </p>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--color-text-dim)] mb-4">Rechtliches</p>
            <nav className="space-y-2" aria-label="Rechtliche Links">
              <Link href="/impressum" className="link-sweep inline-block text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm transition-colors">
                Impressum
              </Link>
              <br />
              <Link href="/datenschutz" className="link-sweep inline-block text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm transition-colors">
                Datenschutz
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-dim text-xs">
            &copy; {new Date().getFullYear()} Bahnhof Döner Grill — Alle Rechte vorbehalten.
          </p>
          <p className="text-dim text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" aria-hidden="true" />
            Frisch vom Spieß. Täglich.
          </p>
        </div>
      </div>
    </footer>
  );
}
