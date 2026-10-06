/**
 * Typography constants for the Create Campaign Page
 * Based on reference images and design specifications
 */

export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  // Font sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Component-specific typography
  component: {
    // Headings
    heading: {
      h1: {
        fontSize: '36px',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '30px',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: '24px',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: 1.5,
      },
    },

    // Body text
    body: {
      large: {
        fontSize: '18px',
        fontWeight: 400,
        lineHeight: 1.75,
      },
      base: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      small: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },

    // Labels
    label: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.5,
    },

    // Buttons
    button: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1,
    },

    // Input
    input: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
    },

    // Caption
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.5,
    },

    // Metric value
    metricValue: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.2,
    },

    // Metric label
    metricLabel: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
} as const;
