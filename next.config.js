const isDev = process.env.NODE_ENV !== 'production';

// Next.js Dev-Runtime (react-refresh) braucht eval → 'unsafe-eval' NUR in dev.
// Ohne diese Ausnahme bootet React im Dev-Modus nicht (stille Hydration-Blockade).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
  "img-src 'self' data:",
  "font-src 'self' data: https://cdn.fontshare.com",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      // Security + general headers for all routes
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            // max-age 2 years. Add preload + submit to hstspreload.org once confirmed on HTTPS.
            value: 'max-age=63072000; includeSubDomains',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'Content-Security-Policy',
            // Next.js App Router emits dynamic inline bootstrap scripts that cannot be
            // statically hashed. 'unsafe-inline' is required here. For stricter CSP,
            // implement nonce-based headers via Next.js middleware instead.
            value: csp,
          },
        ],
      },

      // Fingerprinted JS/CSS chunks — safe to cache forever (NICHT im Dev:
      // dort sind Chunks nicht fingerprinted → immutable cached alte Builds)
      ...(isDev
        ? []
        : [
            {
              source: '/_next/static/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
          ]),

      // Public images — not fingerprinted, 7d cache + background revalidation
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },

      // Favicon — 1d cache
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
