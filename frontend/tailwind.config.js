/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        // Strict monochromatic palette — no hue at all
        primary: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        // Keep standard Tailwind grays — used throughout for borders/text
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px #000000',
        'hard-sm': '2px 2px 0px 0px #000000',
        'hard-lg': '6px 6px 0px 0px #000000',
        'hard-xl': '8px 8px 0px 0px #000000',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body':        '#1A1A1A',
            '--tw-prose-headings':    '#000000',
            '--tw-prose-links':       '#000000',
            '--tw-prose-bold':        '#000000',
            '--tw-prose-counters':    '#404040',
            '--tw-prose-bullets':     '#000000',
            '--tw-prose-hr':          '#D4D4D4',
            '--tw-prose-quotes':      '#000000',
            '--tw-prose-quote-borders': '#000000',
            '--tw-prose-captions':    '#737373',
            '--tw-prose-code':        '#000000',
            '--tw-prose-pre-code':    '#000000',
            '--tw-prose-pre-bg':      '#F5F5F5',
            '--tw-prose-th-borders':  '#000000',
            '--tw-prose-td-borders':  '#D4D4D4',
            maxWidth: 'none',
            fontFamily: 'Playfair Display, Georgia, serif',
            h1: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '800' },
            h2: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '700' },
            h3: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '700' },
            h4: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '600' },
            a: { textDecoration: 'underline', textUnderlineOffset: '3px' },
            'thead th': {
              backgroundColor: '#000000',
              color:           '#FFFFFF',
              fontFamily:      'Inter, system-ui, sans-serif',
              fontWeight:      '600',
              fontSize:        '0.75rem',
              letterSpacing:   '0.05em',
              textTransform:   'uppercase',
              padding:         '0.75rem 1rem',
            },
            'tbody tr': { borderBottomColor: '#E5E5E5' },
            'tbody td': { padding: '0.75rem 1rem', verticalAlign: 'top' },
            'tbody tr:nth-child(even)': { backgroundColor: '#FAFAFA' },
            code: {
              backgroundColor: '#F5F5F5',
              border:          '1px solid #E5E5E5',
              borderRadius:    '0',
              padding:         '0.15em 0.4em',
              fontFamily:      'JetBrains Mono, monospace',
              fontSize:        '0.875em',
            },
            'code::before': { content: "''" },
            'code::after':  { content: "''" },
            pre: {
              backgroundColor: '#000000',
              color:           '#FAFAFA',
              borderRadius:    '0',
              border:          '1px solid #000000',
            },
            blockquote: {
              borderLeftColor: '#000000',
              borderLeftWidth: '3px',
              fontStyle:       'italic',
              color:           '#404040',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
