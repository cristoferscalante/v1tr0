import type { Config } from "tailwindcss";
import { designTokens } from "./config/design-tokens";

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
};

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
      /* ===== SHADCN/UI COMPATIBILITY ===== */
      ...shadcnConfig.theme.extend,

      /* ===== DESIGN TOKENS ===== */
      colors: {
        ...shadcnConfig.theme.extend.colors,
        
        // Design system colors
        primary: designTokens.colors.primary,
        accent: designTokens.colors.accent,
        highlight: designTokens.colors.highlight,
        danger: designTokens.colors.semantic.danger,
        warning: designTokens.colors.semantic.warning,
        success: designTokens.colors.semantic.success,
        info: designTokens.colors.semantic.info,
        neutral: designTokens.colors.neutral,
        
        // CSS variables (para compatibilidad con componentes existentes)
        background: "var(--color-background)",
        backgroundSecondary: "var(--color-background-secondary)",
        foreground: "var(--color-foreground)",
        textPrimary: "var(--color-text-primary)",
        textSecondary: "var(--color-text-secondary)",
        textMuted: "var(--color-text-muted)",
        
        // Colores personalizados (compatibilidad)
        "custom-1": "var(--custom-1)",
        "custom-2": "var(--custom-2)",
        "custom-3": "var(--custom-3)",
        "custom-4": "var(--custom-4)",
      },

      spacing: designTokens.spacing,

      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize,
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2',
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
      },

      borderRadius: {
        ...designTokens.borderRadius,
        // shadcn/ui compatibility
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      boxShadow: designTokens.shadows,

      transitionDuration: designTokens.transitions.duration,
      transitionTimingFunction: designTokens.transitions.timing,

      zIndex: {
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        modalBackdrop: '1040',
        modal: '1050',
        popover: '1060',
        tooltip: '1070',
      },

      screens: designTokens.breakpoints,

      /* ===== CUSTOM KEYFRAMES ===== */
      keyframes: {
        // Animaciones de deslizamiento
        slideInRight: {
          "0%": {
            transform: "translateX(100px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        slideInLeft: {
          "0%": {
            transform: "translateX(-100px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        slideInUp: {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideInDown: {
          "0%": {
            transform: "translateY(-20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        // Animaciones de escala
        scaleIn: {
          "0%": {
            transform: "scale(0.9)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        // Animaciones de fade
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        // Animaciones especiales
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        spin: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },

      /* ===== CUSTOM ANIMATIONS ===== */
      animation: {
        "slide-in-right": "slideInRight 0.8s ease-out",
        "slide-in-left": "slideInLeft 0.8s ease-out 0.2s both",
        "slide-in-up": "slideInUp 0.5s ease-out",
        "slide-in-down": "slideInDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        spin: "spin 1s linear infinite",
        bounce: "bounce 1s infinite",
      },

      /* ===== BACKGROUND IMAGES ===== */
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      /* ===== TYPOGRAPHY PLUGIN ===== */
      typography: () => ({
        DEFAULT: {
          css: {
            color: "var(--color-text-primary)",
            maxWidth: "65ch",
            a: {
              color: "var(--color-primary)",
              textDecoration: "underline",
              textDecorationColor: "var(--color-primary-light)",
              "&:hover": {
                color: "var(--color-primary-hover)",
              },
            },
            h1: {
              color: "var(--color-text-primary)",
              fontWeight: designTokens.typography.fontWeight.bold,
            },
            h2: {
              color: "var(--color-text-primary)",
              fontWeight: designTokens.typography.fontWeight.bold,
            },
            h3: {
              color: "var(--color-text-primary)",
              fontWeight: designTokens.typography.fontWeight.semibold,
            },
            h4: {
              color: "var(--color-text-primary)",
              fontWeight: designTokens.typography.fontWeight.semibold,
            },
            blockquote: {
              color: "var(--color-text-secondary)",
              borderLeftColor: "var(--color-primary)",
            },
            code: {
              color: "var(--color-primary)",
              backgroundColor: "var(--color-background-secondary)",
              fontFamily: designTokens.typography.fontFamily.mono,
            },
            pre: {
              backgroundColor: "var(--color-background-secondary)",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), ...shadcnConfig.plugins],
};

export default config;
