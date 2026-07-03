/**
 * Design Tokens - Sistema de diseño V1TR0
 * 
 * Tokens de diseño centralizados para mantener consistencia visual
 * en toda la aplicación. Estos valores se sincronizan con CSS variables.
 */

export const designTokens = {
  /**
   * Paleta de colores
   */
  colors: {
    primary: {
      DEFAULT: '#08a696',
      hover: '#06877a',
      light: '#e6f7f6',
      dark: '#025159',
      50: '#e6f7f6',
      100: '#c5ebe7',
      200: '#a3dfd9',
      300: '#81d3cb',
      400: '#5fc7bd',
      500: '#08a696',
      600: '#06877a',
      700: '#05685f',
      800: '#044943',
      900: '#025159',
    },
    accent: {
      DEFAULT: '#1e7d7d',
      light: '#26a0a0',
      dark: '#165f5f',
    },
    highlight: {
      light: '#08a696',
      dark: '#26ffdf',
    },
    semantic: {
      danger: '#ff2c10',
      dangerHover: '#cc2309',
      warning: '#f26a1b',
      warningHover: '#c25516',
      success: '#10b981',
      successHover: '#0d9668',
      info: '#3b82f6',
      infoHover: '#2f68c4',
    },
    neutral: {
      50: '#fafaf9',
      100: '#f5f4f1',
      200: '#e5e4df',
      300: '#d4d3cc',
      400: '#a8a7a0',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  /**
   * Espaciado
   */
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem',    // 128px
  },

  /**
   * Tipografía
   */
  typography: {
    fontFamily: {
      sans: 'var(--font-bricolage-grotesque), ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  /**
   * Radios de borde
   */
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  /**
   * Sombras
   */
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  /**
   * Transiciones
   */
  transitions: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    timing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  /**
   * Z-Index
   */
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  /**
   * Breakpoints
   */
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignTokens = typeof designTokens;

// Helper types
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type FontSizeToken = keyof typeof designTokens.typography.fontSize;
export type BorderRadiusToken = keyof typeof designTokens.borderRadius;
