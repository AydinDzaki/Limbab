/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  safelist: [
    'bg-blue-100', 'text-blue-600', 'bg-blue-500',
    'bg-orange-100', 'text-orange-600', 'bg-orange-500',
    'bg-purple-100', 'text-purple-600', 'bg-purple-500',
    'bg-yellow-100', 'text-yellow-600', 'bg-yellow-500',
    'bg-green-100', 'text-green-600', 'bg-green-500',
    'bg-pink-100', 'text-pink-600', 'bg-pink-500',
    'bg-indigo-100', 'text-indigo-600', 'bg-indigo-500',
    'bg-rose-100', 'text-rose-600', 'bg-rose-500',
    'bg-teal-100', 'text-teal-600', 'bg-teal-500',
    'bg-cyan-100', 'text-cyan-600', 'bg-cyan-500',
    'bg-emerald-100', 'text-emerald-600', 'bg-emerald-500',
    'bg-slate-100', 'text-slate-600', 'bg-slate-500',
    'bg-red-100', 'text-red-600', 'bg-red-500',
    'bg-amber-100', 'text-amber-600', 'bg-amber-500',
    'text-violet-600', 'bg-violet-100', 'bg-violet-500'
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}