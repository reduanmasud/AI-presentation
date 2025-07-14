// Application Configuration
// This file contains all configuration settings extracted from hardcoded values

/**
 * Presentation Configuration
 */
export const presentationConfig = {
  // Basic presentation info
  title: 'AI in QA & Security Testing',
  subtitle: 'Interactive Presentation Slider',
  totalSlides: 8,
  
  // Presentation metadata
  meta: {
    description: 'AI in QA & Security Testing - Interactive Presentation',
    author: 'Reduan Masud & Arafat',
    team: 'QA Team & xCloud',
    keywords: ['AI', 'QA', 'Security Testing', 'Automation', 'DevOps']
  },

  // Default slide settings
  defaultSlide: 1,
  startSlide: 1,

  // Navigation settings
  navigation: {
    enableKeyboard: true,
    enableMouse: true,
    enableTouch: true,
    enableIndicators: true,
    enableArrows: true,
    loop: false,
    autoAdvance: false
  },

  // Animation settings
  animations: {
    slideTransition: 'slide',
    transitionDuration: 600,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    enableSlideAnimations: true,
    enableElementAnimations: true,
    animationDelay: 100
  },

  // Auto-play settings
  autoPlay: {
    enabled: false,
    interval: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    showTimer: true
  },

  // Search functionality
  search: {
    enabled: true,
    placeholder: 'Search slides...',
    minLength: 2,
    highlightResults: true,
    searchFields: ['title', 'subtitle', 'content']
  },

  // Bookmark functionality
  bookmarks: {
    enabled: true,
    storageKey: 'presentation-bookmarks',
    maxBookmarks: 10,
    showPanel: true
  },

  // Fullscreen settings
  fullscreen: {
    enabled: true,
    exitOnEscape: true,
    showControls: true
  },

  // Theme settings
  theme: {
    default: 'modern',
    allowSwitching: true,
    available: ['modern', 'dark', 'corporate']
  },

  // Progress bar settings
  progress: {
    enabled: true,
    height: 4,
    color: 'var(--primary-color)',
    showPercentage: false
  },

  // Header settings
  header: {
    enabled: true,
    showTitle: true,
    showCounter: true,
    showControls: true,
    height: 64
  }
};

/**
 * Feature Flags
 * Enable/disable specific features
 */
export const featureFlags = {
  // Core features
  slideNavigation: true,
  slideIndicators: true,
  progressBar: true,
  
  // Advanced features
  search: true,
  bookmarks: true,
  autoPlay: true,
  fullscreen: true,
  themeSwitch: true,
  
  // Interactive features
  clickableAgenda: true,
  timelineInteraction: true,
  workflowSteps: true,
  galleryNavigation: true,
  
  // Accessibility features
  keyboardNavigation: true,
  screenReaderSupport: true,
  highContrast: false,
  reducedMotion: false,
  
  // Development features
  debugMode: false,
  performanceMonitoring: false,
  analytics: false
};

/**
 * UI Configuration
 */
export const uiConfig = {
  // Breakpoints for responsive design
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
    ultrawide: 1536
  },

  // Z-index layers
  zIndex: {
    base: 1,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  },

  // Animation durations (in milliseconds)
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
    slideTransition: 600
  },

  // Common spacing values
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  }
};

/**
 * External Resources Configuration
 */
export const externalResources = {
  fonts: {
    google: [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ]
  },
  
  icons: {
    fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
  },

  // External links used in slides
  links: {
    devOpsDungeon: 'https://studio.firebase.google.com/studio-9086808136',
    geminiDemo1: 'https://gemini.google.com/app/249322542af0dc33',
    geminiDemo2: 'https://gemini.google.com/app/e4f782bbe810159a',
    geminiDemo3: 'https://g.co/gemini/share/52e9cfdfc5bc',
    geminiProject: 'https://github.com/your-username/gemini-app'
  }
};

/**
 * Performance Configuration
 */
export const performanceConfig = {
  // Image loading
  images: {
    lazyLoad: true,
    preloadNext: 1,
    optimizeQuality: true,
    fallbackFormat: 'jpg'
  },

  // Animation performance
  animations: {
    useGPU: true,
    reducedMotion: false,
    maxConcurrent: 3
  },

  // Memory management
  memory: {
    maxCacheSize: 50, // MB
    cleanupInterval: 300000, // 5 minutes
    preloadSlides: 2
  }
};

/**
 * Development Configuration
 */
export const devConfig = {
  // Debug settings
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    logLevel: 'info',
    showPerformance: false,
    showBoundingBoxes: false
  },

  // Hot reload settings
  hotReload: {
    enabled: true,
    watchFiles: ['src/**/*.js', 'src/**/*.scss'],
    reloadDelay: 100
  }
};

/**
 * Get configuration value by path
 * @param {string} path - Dot notation path to config value
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} Configuration value
 */
export function getConfig(path, defaultValue = null) {
  const keys = path.split('.');
  let current = presentationConfig;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current;
}

/**
 * Check if a feature is enabled
 * @param {string} feature - Feature name
 * @returns {boolean} Whether feature is enabled
 */
export function isFeatureEnabled(feature) {
  return featureFlags[feature] === true;
}
