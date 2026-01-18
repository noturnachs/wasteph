import { toast as sonnerToast } from 'sonner';

/**
 * Custom toast utilities with consistent styling
 * These wrap Sonner's toast methods with predefined soft color schemes
 */

const toast = {
  success: (message, options = {}) => {
    return sonnerToast.success(message, {
      ...options,
      style: {
        '--normal-bg':
          'color-mix(in oklab, light-dark(var(--color-chart-1), #22c55e) 10%, var(--background))',
        '--normal-text': 'light-dark(var(--color-chart-1), #22c55e)',
        '--normal-border': 'light-dark(var(--color-chart-1), #22c55e)',
        ...options.style,
      },
    });
  },

  error: (message, options = {}) => {
    return sonnerToast.error(message, {
      ...options,
      style: {
        '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
        '--normal-text': 'var(--destructive)',
        '--normal-border': 'var(--destructive)',
        ...options.style,
      },
    });
  },

  warning: (message, options = {}) => {
    return sonnerToast.warning(message, {
      ...options,
      style: {
        '--normal-bg':
          'color-mix(in oklab, light-dark(#d97706, #fbbf24) 10%, var(--background))',
        '--normal-text': 'light-dark(#d97706, #fbbf24)',
        '--normal-border': 'light-dark(#d97706, #fbbf24)',
        ...options.style,
      },
    });
  },

  info: (message, options = {}) => {
    return sonnerToast.info(message, {
      ...options,
      style: {
        '--normal-bg':
          'color-mix(in oklab, light-dark(#0284c7, #38bdf8) 10%, var(--background))',
        '--normal-text': 'light-dark(#0284c7, #38bdf8)',
        '--normal-border': 'light-dark(#0284c7, #38bdf8)',
        ...options.style,
      },
    });
  },

  // Expose other sonner methods
  loading: sonnerToast.loading,
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  message: sonnerToast.message,
  dismiss: sonnerToast.dismiss,
};

export { toast };
