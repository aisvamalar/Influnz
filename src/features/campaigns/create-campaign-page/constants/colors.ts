/**
 * Color constants for the Create Campaign Page
 * Based on reference images and design specifications
 */

export const COLORS = {
  // Primary colors
  primary: {
    purple: '#8B5CF6',
    purpleHover: '#7C3AED',
    purpleLight: '#EDE9FE',
    purpleExtraLight: '#F5F3FF',
  },

  // Background colors
  background: {
    main: '#FFFFFF',
    secondary: '#F9FAFB',
    card: '#FFFFFF',
    hover: '#F3F4F6',
  },

  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    white: '#FFFFFF',
    purple: '#8B5CF6',
  },

  // Border colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    focus: '#8B5CF6',
  },

  // Status colors
  status: {
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },

  // Icon colors
  icon: {
    default: '#6B7280',
    hover: '#374151',
    purple: '#8B5CF6',
    light: '#9CA3AF',
  },

  // Shadow colors
  shadow: {
    sm: 'rgba(0, 0, 0, 0.05)',
    md: 'rgba(0, 0, 0, 0.1)',
    lg: 'rgba(0, 0, 0, 0.15)',
  },
} as const;
