import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Bahnhof Döner Grill',
  url: 'https://bahnhof-doener.de',
  image: 'https://bahnhof-doener.de/images/hero.avif',
  telephone: '+496451240925',
  priceRange: '€',
  servesCuisine: ['Türkisch', 'Döner', 'Pizza'],
  hasMenu: 'https://bahnhof-doener.de/menu',
  acceptsReservations: false,
  paymentAccepted: 'Cash, EC-Karte',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    reviewCount: '769',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 51.0587, longitude: 8.993 },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Am Bahnhof 10',
    addressLocality: 'Frankenberg',
    postalCode: '35066',
    addressCountry: 'DE',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
      opens: '10:00',
      closes: '23:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '10:00',
      closes: '00:00',
    },
  ],
} as const;

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Bahnhof Döner Grill — Frisch vom Spieß | Frankenberg',
  description:
    'Frisch zubereitete Döner, Dürüm, Pizza und mehr bei Bahnhof Döner Grill in Frankenberg. Täglich frisch vom Spieß — Am Bahnhof 10.',
  keywords: ['Döner', 'Dürüm', 'Pizza', 'Frankenberg', 'Bahnhof Döner Grill', 'türkische Küche'],
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Bahnhof Döner Grill — Frisch vom Spieß',
    description: 'Döner, Pizza & mehr — täglich frisch in Frankenberg. Am Bahnhof 10.',
    type: 'website',
    locale: 'de_DE',
    url: 'https://bahnhof-doener.de',
    siteName: 'Bahnhof Döner Grill',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=britney@1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-body bg-bg text-[var(--color-text)]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
