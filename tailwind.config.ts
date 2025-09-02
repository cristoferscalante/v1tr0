import type { Config } from "tailwindcss"
const shadcnConfig = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
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

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      ...shadcnConfig.theme.extend,
      colors: {
        ...shadcnConfig.theme.extend.colors,
        background: "var(--background)",
        backgroundSecondary: "var(--background-secondary)",
        foreground: "var(--foreground)",
        textPrimary: "var(--text-primary)",
        textMuted: "var(--text-muted)",
        primary: "var(--primary)",
        highlight: "var(--highlight)",
        accent: "var(--accent)",
        "custom-1": "var(--custom-1)",
        "custom-2": "var(--custom-2)",
        "custom-3": "var(--custom-3)",
        "custom-4": "var(--custom-4)",
        danger: "var(--danger)",
        warning: "var(--warning)",
      },
      fontFamily: {
        sans: ["var(--font-bricolage-grotesque)", "sans-serif"],
        bricolage: ["var(--font-bricolage-grotesque)", "sans-serif"],
      },
      keyframes: {
        slideInRight: {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        slideInLeft: {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
      },
      animation: {
        slideInRight: 'slideInRight 0.8s ease-out',
        slideInLeft: 'slideInLeft 0.8s ease-out 0.2s both',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: "var(--text-primary)",
            a: {
              color: "var(--highlight)",
              "&:hover": {
                color: "var(--accent)",
              },
            },
            h1: {
              color: "var(--highlight)",
            },
            h2: {
              color: "var(--highlight)",
            },
            h3: {
              color: "var(--highlight)",
            },
            h4: {
              color: "var(--highlight)",
            },
            blockquote: {
              color: "var(--text-muted)",
              borderLeftColor: "var(--custom-3)",
            },
            code: {
              color: "var(--highlight)",
              backgroundColor: "var(--custom-1)",
            },
            pre: {
              backgroundColor: "var(--custom-1)",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), ...shadcnConfig.plugins],
}

export default config
