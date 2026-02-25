import Image from 'next/image';
import Link from 'next/link';

export default function InfoStrip() {
  return (
    <section className="bg-bg py-[var(--section-py)]" aria-label="Informationen">
      <div className="max-w-container mx-auto px-[var(--container-px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

          {/* Öffnungszeiten */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-[72px] mb-4">
              <Image
                src="/images/Uhr_Icon.png"
                alt="Öffnungszeiten"
                width={72}
                height={72}
                className="object-contain"
              />
            </div>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2 tracking-wide">
              Öffnungszeiten
            </h2>
            <p className="text-muted text-sm leading-relaxed">Mo–Do & So: 10:00 – 23:00 Uhr</p>
            <p className="text-muted text-sm leading-relaxed">Fr & Sa: 10:00 – 24:00 Uhr</p>
          </div>

          {/* Adresse */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-[72px] mb-4">
              <Image
                src="/images/GoogleMaps_Icon.png"
                alt="Adresse"
                width={72}
                height={72}
                className="object-contain"
              />
            </div>
            <a
              href="https://share.google/CrjoKS0CHDSPw5vDS"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <h2 className="text-base font-semibold text-[var(--color-text)] mb-2 tracking-wide group-hover:text-accent transition-colors">
                Adresse
              </h2>
              <p className="text-muted text-sm leading-relaxed group-hover:text-[var(--color-text)] transition-colors">Am Bahnhof 10</p>
              <p className="text-muted text-sm leading-relaxed group-hover:text-[var(--color-text)] transition-colors">35066 Frankenberg ↗</p>
            </a>
          </div>

          {/* Bewertung */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-[72px] mb-4">
              <Image
                src="/images/Star_Icon.png"
                alt="5 Sterne Bewertung"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>
            <a
              href="https://share.google/CrjoKS0CHDSPw5vDS"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <h2 className="text-base font-semibold text-[var(--color-text)] mb-2 tracking-wide group-hover:text-accent transition-colors">
                4.5 Sterne bei Google
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-4 group-hover:text-[var(--color-text)] transition-colors">
                Bewertungen ansehen ↗
              </p>
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
