// Presentation Application
// This class integrates all components and manages the application lifecycle

import { EventBus } from '../utils/EventBus.js';
import { SlideManager } from './SlideManager.js';
import { AnimationManager } from './AnimationManager.js';
import { NavigationManager, TOCNavigation } from './NavigationManager.js';
import {
  SearchManager,
  BookmarkManager,
  AutoPlayManager,
  FullscreenManager
} from './FeatureManagers.js';
import { TemplateRenderer } from './TemplateRenderer.js';
import { SlideFactory } from './SlideFactory.js';
import { InteractionManager } from './InteractionManager.js';
import { PerformanceManager } from './PerformanceManager.js';
import { ServiceWorkerManager } from '../utils/ServiceWorkerManager.js';
import { TestingManager } from '../utils/TestingManager.js';
import { AccessibilityChecker } from '../utils/AccessibilityChecker.js';
import { QualityAssurance } from '../utils/QualityAssurance.js';
import { slidesData } from '../data/slides.js';
import { presentationConfig, isFeatureEnabled } from '../data/config.js';

export class PresentationApp {
  constructor() {
    this.eventBus = new EventBus();
    this.components = new Map();
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize the presentation application
   */
  async init() {
    try {
      console.log('🚀 Initializing Presentation App...');
      
      // Set up event bus debugging in development
      if (process.env.NODE_ENV === 'development') {
        this.eventBus.setDebugMode(true);
      }

      // Initialize core components in order
      await this.initializeCore();
      await this.initializeFeatures();
      await this.initializeUI();
      
      // Set up global error handling
      this.setupErrorHandling();
      
      // Mark as initialized
      this.isInitialized = true;
      
      // Emit app ready event
      this.eventBus.emit('app:ready', {
        totalSlides: slidesData.length,
        features: this.getEnabledFeatures()
      });
      
      console.log('✅ Presentation App initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Presentation App:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Initialize core components
   */
  async initializeCore() {
    console.log('📦 Initializing core components...');

    // Initialize template system first
    this.components.set('slideFactory', new SlideFactory(this.eventBus));
    this.components.set('templateRenderer', new TemplateRenderer(this.eventBus));

    // Render slides from data
    const templateRenderer = this.components.get('templateRenderer');
    templateRenderer.renderSlides(slidesData);

    // Initialize slide manager (core functionality)
    this.components.set('slideManager', new SlideManager(this.eventBus));

    // Initialize animation manager
    this.components.set('animationManager', new AnimationManager(this.eventBus));

    // Initialize interaction manager
    this.components.set('interactionManager', new InteractionManager(this.eventBus));

    // Initialize performance manager
    this.components.set('performanceManager', new PerformanceManager(this.eventBus));

    // Initialize navigation manager
    this.components.set('navigationManager', new NavigationManager(this.eventBus));

    // Initialize table of contents
    if (isFeatureEnabled('clickableAgenda')) {
      this.components.set('tocNavigation', new TOCNavigation(this.eventBus, slidesData));
    }

    console.log('✅ Core components initialized');
  }

  /**
   * Initialize feature components
   */
  async initializeFeatures() {
    console.log('🔧 Initializing feature components...');
    
    // Initialize search manager
    if (isFeatureEnabled('search')) {
      this.components.set('searchManager', new SearchManager(this.eventBus, slidesData));
    }
    
    // Initialize bookmark manager
    if (isFeatureEnabled('bookmarks')) {
      this.components.set('bookmarkManager', new BookmarkManager(this.eventBus, slidesData));
    }
    
    // Initialize autoplay manager
    if (isFeatureEnabled('autoPlay')) {
      this.components.set('autoPlayManager', new AutoPlayManager(this.eventBus));
    }
    
    // Initialize fullscreen manager
    if (isFeatureEnabled('fullscreen')) {
      this.components.set('fullscreenManager', new FullscreenManager(this.eventBus));
    }

    // Initialize service worker manager
    this.components.set('serviceWorkerManager', new ServiceWorkerManager(this.eventBus));

    // Initialize testing and quality assurance
    if (process.env.NODE_ENV === 'development' || isFeatureEnabled('testing')) {
      this.components.set('testingManager', new TestingManager(this.eventBus));
      this.components.set('accessibilityChecker', new AccessibilityChecker(this.eventBus));
      this.components.set('qualityAssurance', new QualityAssurance(this.eventBus));
    }

    console.log('✅ Feature components initialized');
  }

  /**
   * Initialize UI components
   */
  async initializeUI() {
    console.log('🎨 Initializing UI components...');
    
    // Set up global event listeners
    this.setupGlobalEvents();
    
    // Initialize accessibility features
    this.setupAccessibility();
    
    // Update initial UI state
    this.updateUIState();
    
    console.log('✅ UI components initialized');
  }

  /**
   * Set up global event listeners
   */
  setupGlobalEvents() {
    // Listen for component communication
    this.eventBus.on('slideManager:getCurrentSlide', (callback) => {
      const slideManager = this.components.get('slideManager');
      if (slideManager && typeof callback === 'function') {
        callback(slideManager.getCurrentSlide());
      }
    });

    this.eventBus.on('slideManager:getTotalSlides', (callback) => {
      const slideManager = this.components.get('slideManager');
      if (slideManager && typeof callback === 'function') {
        callback(slideManager.getTotalSlides());
      }
    });

    // Handle navigation to last slide
    this.eventBus.on('navigation:goToLast', () => {
      const slideManager = this.components.get('slideManager');
      if (slideManager) {
        slideManager.goToSlide(slideManager.getTotalSlides());
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.eventBus.emit('window:resize', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    });

    // Handle visibility change (for autoplay pause/resume)
    document.addEventListener('visibilitychange', () => {
      this.eventBus.emit('document:visibilityChange', {
        hidden: document.hidden
      });
    });
  }

  /**
   * Set up accessibility features
   */
  setupAccessibility() {
    if (!isFeatureEnabled('screenReaderSupport')) return;

    // Add ARIA labels and roles
    const presentationContainer = document.querySelector('.presentation-container');
    if (presentationContainer) {
      presentationContainer.setAttribute('role', 'application');
      presentationContainer.setAttribute('aria-label', presentationConfig.title);
    }

    // Add slide region
    const slidesWrapper = document.querySelector('.slides-wrapper');
    if (slidesWrapper) {
      slidesWrapper.setAttribute('role', 'region');
      slidesWrapper.setAttribute('aria-label', 'Presentation slides');
      slidesWrapper.setAttribute('aria-live', 'polite');
    }

    // Add navigation landmarks
    const navigationControls = document.querySelector('.navigation-controls');
    if (navigationControls) {
      navigationControls.setAttribute('role', 'navigation');
      navigationControls.setAttribute('aria-label', 'Slide navigation');
    }
  }

  /**
   * Update UI state
   */
  updateUIState() {
    // Update presentation title
    const titleElement = document.querySelector('.presentation-title');
    if (titleElement) {
      titleElement.textContent = presentationConfig.title;
    }

    // Update total slides counter
    const totalSlidesElement = document.querySelector('.total-slides');
    if (totalSlidesElement) {
      totalSlidesElement.textContent = slidesData.length;
    }

    // Hide disabled features
    this.hideDisabledFeatures();
  }

  /**
   * Hide UI elements for disabled features
   */
  hideDisabledFeatures() {
    const featureButtons = {
      'search': '.search-btn',
      'bookmarks': '.bookmark-btn',
      'autoPlay': '.autoplay-btn',
      'fullscreen': '.fullscreen-btn'
    };

    Object.entries(featureButtons).forEach(([feature, selector]) => {
      if (!isFeatureEnabled(feature)) {
        const button = document.querySelector(selector);
        if (button) {
          button.style.display = 'none';
        }
      }
    });
  }

  /**
   * Set up error handling
   */
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.eventBus.emit('app:error', {
        error: event.error,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.eventBus.emit('app:unhandledRejection', {
        reason: event.reason
      });
    });

    // Component error handler
    this.eventBus.on('component:error', (data) => {
      console.error(`Component error in ${data.component}:`, data.error);
      // Could implement error recovery logic here
    });
  }

  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    // Show error message to user
    const errorContainer = document.createElement('div');
    errorContainer.className = 'initialization-error';
    errorContainer.innerHTML = `
      <div class="error-content">
        <h2>⚠️ Initialization Error</h2>
        <p>The presentation failed to initialize properly.</p>
        <details>
          <summary>Error Details</summary>
          <pre>${error.message}</pre>
        </details>
        <button onclick="location.reload()">Reload Page</button>
      </div>
    `;
    
    document.body.appendChild(errorContainer);
  }

  /**
   * Get list of enabled features
   */
  getEnabledFeatures() {
    const features = [
      'slideNavigation',
      'slideIndicators', 
      'progressBar',
      'search',
      'bookmarks',
      'autoPlay',
      'fullscreen',
      'keyboardNavigation'
    ];
    
    return features.filter(feature => isFeatureEnabled(feature));
  }

  /**
   * Get component instance
   */
  getComponent(name) {
    return this.components.get(name);
  }

  /**
   * Check if app is initialized
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Get app status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      components: Array.from(this.components.keys()),
      enabledFeatures: this.getEnabledFeatures(),
      totalSlides: slidesData.length,
      currentSlide: this.components.get('slideManager')?.getCurrentSlide() || 1
    };
  }

  /**
   * Destroy the application
   */
  destroy() {
    console.log('🧹 Destroying Presentation App...');
    
    // Clear all event listeners
    this.eventBus.clear();
    
    // Destroy components
    this.components.clear();
    
    // Mark as not initialized
    this.isInitialized = false;
    
    console.log('✅ Presentation App destroyed');
  }

  /**
   * Restart the application
   */
  async restart() {
    this.destroy();
    await this.init();
  }
}

// Export a singleton instance
export const presentationApp = new PresentationApp();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.presentationApp = presentationApp;
}
