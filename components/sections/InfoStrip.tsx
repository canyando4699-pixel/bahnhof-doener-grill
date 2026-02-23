import Link from 'next/link';

function ClockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-muted" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-muted" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-muted" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function InfoStrip() {
  return (
    <section className="bg-bg py-[var(--section-py)]" aria-label="Informationen">
      <div className="max-w-container mx-auto px-[var(--container-px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <ClockIcon />
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">Öffnungszeiten</h2>
            <p className="text-muted text-sm">Mo–Do & So: 10:00 – 23:00 Uhr</p>
            <p className="text-muted text-sm">Fr & Sa: 10:00 – 24:00 Uhr</p>
          </div>

          <div>
            <MapPinIcon />
            <a
              href="https://share.google/CrjoKS0CHDSPw5vDS"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <h2 className="text-base font-semibold text-[var(--color-text)] mb-2 group-hover:text-accent transition-colors">Adresse</h2>
              <p className="text-muted text-sm group-hover:text-[var(--color-text)] transition-colors">Am Bahnhof 10</p>
              <p className="text-muted text-sm group-hover:text-[var(--color-text)] transition-colors">35066 Frankenberg ↗</p>
            </a>
          </div>

          <div>
            <StarIcon />
            <a
              href="https://share.google/CrjoKS0CHDSPw5vDS"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <h2 className="text-base font-semibold text-[var(--color-text)] mb-2 group-hover:text-accent transition-colors">4.5 Sterne bei Google</h2>
              <p className="text-muted text-sm mb-4 group-hover:text-[var(--color-text)] transition-colors">Bewertungen ansehen ↗</p>
            </a>
            <Link
              href="/kontakt"
              className="inline-block text-muted hover:text-[var(--color-text)] text-sm border border-border px-5 py-2 rounded transition-colors"
            >
              Anfahrt &amp; Kontakt
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
