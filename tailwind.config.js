/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:         'var(--color-bg)',
        surface:    'var(--color-surface)',
        'surface-2':'var(--color-surface-2)',
        border:     'var(--color-border)',
        muted:      'var(--color-text-muted)',
        dim:        'var(--color-text-dim)',
        accent:     'var(--color-accent)',
        'accent-hover':'var(--color-accent-hover)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
    },
  },
  plugins: [],
}
