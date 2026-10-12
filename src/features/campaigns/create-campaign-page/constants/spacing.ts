/**
 * Spacing constants for the Create Campaign Page
 * Based on reference images and design specifications
 */

export const SPACING = {
  // Base spacing units (in pixels)
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,

  // Component-specific spacing
  component: {
    // Card padding
    cardPadding: {
      sm: 16,
      md: 24,
      lg: 32,
    },

    // Gaps between elements
    gap: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
    },

    // Section spacing
    section: {
      marginBottom: 24,
      paddingVertical: 32,
    },

    // Input field spacing
    input: {
      padding: 12,
      marginBottom: 16,
    },

    // Button spacing
    button: {
      paddingX: 24,
      paddingY: 12,
      gap: 8,
    },

    // Tab spacing
    tab: {
      padding: 12,
      gap: 8,
    },

    // Parameter chip spacing
    chip: {
      paddingX: 12,
      paddingY: 8,
      gap: 6,
    },

    // Message spacing
    message: {
      padding: 16,
      marginBottom: 16,
    },

    // Metric card spacing
    metric: {
      padding: 16,
      gap: 8,
    },
  },

  // Layout spacing
  layout: {
    containerPadding: 24,
    maxWidth: 1200,
    sidebarWidth: 320,
    headerHeight: 64,
  },

  // Border radius
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;
