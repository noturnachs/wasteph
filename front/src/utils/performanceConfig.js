/**
 * Performance Configuration for Low-End Devices
 * This file contains utilities to detect device capabilities
 * and adjust animations/effects accordingly
 */

// Detect if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Detect low-end device based on hardware concurrency
export const isLowEndDevice = () => {
  // Check number of CPU cores (4 or less = low-end)
  const cores = navigator.hardwareConcurrency || 4;

  // Check available memory (less than 4GB = low-end)
  const memory = navigator.deviceMemory || 4;

  // Check if mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  return cores <= 4 || memory < 4 || isMobile;
};

// Get optimal animation settings based on device
export const getAnimationSettings = () => {
  if (prefersReducedMotion()) {
    return {
      enableAnimations: false,
      duration: 0,
      staggerDelay: 0,
    };
  }

  if (isLowEndDevice()) {
    return {
      enableAnimations: true,
      duration: 0.6, // Faster animations
      staggerDelay: 0.03, // Less stagger
    };
  }

  return {
    enableAnimations: true,
    duration: 1,
    staggerDelay: 0.05,
  };
};

// Debounce function for scroll/resize events
export const debounce = (func, wait = 16) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for high-frequency events
export const throttle = (func, limit = 16) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Check if browser supports modern features
export const hasModernFeatures = () => {
  return (
    "IntersectionObserver" in window &&
    "requestAnimationFrame" in window &&
    CSS.supports("transform", "translate3d(0, 0, 0)")
  );
};

// Enable performance monitoring (development only)
export const enablePerformanceMonitoring = () => {
  if (process.env.NODE_ENV === "development" && "performance" in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 16) {
          // Log if frame takes longer than 16ms (60fps)
          console.warn(
            `Slow frame detected: ${entry.name} took ${entry.duration}ms`
          );
        }
      }
    });

    try {
      observer.observe({ entryTypes: ["measure", "navigation"] });
    } catch (e) {
      // Ignore if not supported
    }

    return observer;
  }
  return null;
};

export default {
  prefersReducedMotion,
  isLowEndDevice,
  getAnimationSettings,
  debounce,
  throttle,
  hasModernFeatures,
  enablePerformanceMonitoring,
};
