import { type Config } from 'tailwindcss'

export default {
  content: ['./src/components/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'nav-enter': 'nav-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'nav-exit': 'nav-exit 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'header-gradient':
          'linear-gradient(to bottom, rgba(27, 58, 87, 0.8) 0%, rgba(27, 58, 87, 0.4) 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        error: 'hsl(var(--error))',
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',

        warning: 'hsl(var(--warning))',
      },
      // fontFamily: {
      //   mono: ['var(--font-geist-mono)'],
      //   sans: ['var(--font-geist-sans)'],
      // },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'nav-enter': {
          '0%': {
            opacity: '0',
            transform: 'translate(-50%, -4px) scale(0.97)',
            clipPath: 'inset(0% 0% 100% 0%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, 0) scale(1)',
            clipPath: 'inset(0% 0% 0% 0%)',
          },
        },
        'nav-exit': {
          '0%': {
            opacity: '1',
            transform: 'translate(-50%, 0) scale(1)',
            clipPath: 'inset(0% 0% 0% 0%)',
          },
          '100%': {
            opacity: '0',
            transform: 'translate(-50%, -4px) scale(0.97)',
            clipPath: 'inset(0% 0% 100% 0%)',
          },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--text)',
            '--tw-prose-headings': 'var(--text)',
            h1: {
              fontSize: '4rem',
              fontWeight: 'normal',
              marginBottom: '0.25em',
            },
          },
        },
      }),
    },
  },
} satisfies Config
