// Performance Manager
// Handles lazy loading, caching, and memory management for optimal performance

export class PerformanceManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.cache = new Map();
    this.imageCache = new Map();
    this.componentCache = new Map();
    this.loadedSlides = new Set();
    this.preloadQueue = [];
    this.isPreloading = false;
    this.memoryThreshold = 100 * 1024 * 1024; // 100MB
    this.maxCacheSize = 50;
    this.intersectionObserver = null;
    this.performanceMetrics = {
      slideLoadTimes: new Map(),
      imageLoadTimes: new Map(),
      cacheHits: 0,
      cacheMisses: 0,
      memoryUsage: 0
    };
    
    this.init();
  }

  /**
   * Initialize performance manager
   */
  init() {
    this.setupLazyLoading();
    this.setupCaching();
    this.setupMemoryManagement();
    this.setupPerformanceMonitoring();
    this.setupEventListeners();
    
    console.log('✅ Performance Manager initialized');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Listen for slide changes to trigger preloading
    this.eventBus.on('navigation:slideChanged', (data) => {
      this.onSlideChanged(data.slideNumber);
    });

    // Listen for slide rendering to cache components
    this.eventBus.on('template:slideRendered', (data) => {
      this.onSlideRendered(data.slideId, data.slideType);
    });

    // Listen for memory pressure warnings
    this.eventBus.on('performance:memoryPressure', () => {
      this.handleMemoryPressure();
    });

    // Listen for performance requests
    this.eventBus.on('performance:getMetrics', (callback) => {
      if (typeof callback === 'function') {
        callback(this.getPerformanceMetrics());
      }
    });
  }

  /**
   * Set up lazy loading with Intersection Observer
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          root: null,
          rootMargin: '50px',
          threshold: 0.1
        }
      );
    }

    // Set up lazy loading for images
    this.setupImageLazyLoading();
    
    // Set up lazy loading for slide components
    this.setupComponentLazyLoading();
  }

  /**
   * Set up image lazy loading
   */
  setupImageLazyLoading() {
    // Find all images that should be lazy loaded
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    lazyImages.forEach(img => {
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(img);
      } else {
        // Fallback for browsers without Intersection Observer
        this.loadImage(img);
      }
    });
  }

  /**
   * Set up component lazy loading
   */
  setupComponentLazyLoading() {
    // Find all components that should be lazy loaded
    const lazyComponents = document.querySelectorAll('[data-lazy-component]');
    
    lazyComponents.forEach(component => {
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(component);
      }
    });
  }

  /**
   * Handle intersection observer entries
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        if (target.tagName === 'IMG' && target.dataset.src) {
          this.loadImage(target);
        } else if (target.dataset.lazyComponent) {
          this.loadComponent(target);
        }
        
        this.intersectionObserver.unobserve(target);
      }
    });
  }

  /**
   * Load image with performance tracking
   */
  async loadImage(img) {
    const startTime = performance.now();
    const src = img.dataset.src;
    
    if (!src) return;

    try {
      // Check cache first
      if (this.imageCache.has(src)) {
        img.src = this.imageCache.get(src);
        this.performanceMetrics.cacheHits++;
        return;
      }

      // Create new image for preloading
      const newImg = new Image();
      
      await new Promise((resolve, reject) => {
        newImg.onload = () => {
          // Cache the loaded image
          this.imageCache.set(src, src);
          
          // Set the source
          img.src = src;
          img.classList.add('loaded');
          
          // Track performance
          const loadTime = performance.now() - startTime;
          this.performanceMetrics.imageLoadTimes.set(src, loadTime);
          
          resolve();
        };
        
        newImg.onerror = reject;
        newImg.src = src;
      });

      this.performanceMetrics.cacheMisses++;
      
    } catch (error) {
      console.error('Failed to load image:', src, error);
      img.classList.add('error');
    }
  }

  /**
   * Load component lazily
   */
  async loadComponent(element) {
    const componentType = element.dataset.lazyComponent;
    const startTime = performance.now();
    
    try {
      // Check component cache
      if (this.componentCache.has(componentType)) {
        const cachedComponent = this.componentCache.get(componentType);
        element.innerHTML = cachedComponent.html;
        this.performanceMetrics.cacheHits++;
        return;
      }

      // Load component dynamically
      const component = await this.loadComponentModule(componentType);
      
      if (component) {
        const html = component.render();
        element.innerHTML = html;
        
        // Cache the component
        this.componentCache.set(componentType, { html, component });
        
        // Track performance
        const loadTime = performance.now() - startTime;
        this.performanceMetrics.slideLoadTimes.set(componentType, loadTime);
        
        this.performanceMetrics.cacheMisses++;
      }
      
    } catch (error) {
      console.error('Failed to load component:', componentType, error);
      element.innerHTML = '<div class="component-error">Failed to load component</div>';
    }
  }

  /**
   * Load component module dynamically
   */
  async loadComponentModule(componentType) {
    try {
      const module = await import(`./slides/${componentType}Slide.js`);
      return module[`${componentType}Slide`];
    } catch (error) {
      console.error('Failed to import component module:', componentType, error);
      return null;
    }
  }

  /**
   * Set up caching system
   */
  setupCaching() {
    // Set up cache size limits
    this.setupCacheLimits();
    
    // Set up cache persistence
    this.setupCachePersistence();
    
    // Set up cache invalidation
    this.setupCacheInvalidation();
  }

  /**
   * Set up cache size limits
   */
  setupCacheLimits() {
    // Monitor cache sizes and clean up when needed
    setInterval(() => {
      this.cleanupCaches();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Clean up caches when they exceed limits
   */
  cleanupCaches() {
    // Clean up image cache
    if (this.imageCache.size > this.maxCacheSize) {
      const entries = Array.from(this.imageCache.entries());
      const toRemove = entries.slice(0, Math.floor(this.maxCacheSize * 0.3));
      toRemove.forEach(([key]) => this.imageCache.delete(key));
    }

    // Clean up component cache
    if (this.componentCache.size > this.maxCacheSize) {
      const entries = Array.from(this.componentCache.entries());
      const toRemove = entries.slice(0, Math.floor(this.maxCacheSize * 0.3));
      toRemove.forEach(([key]) => this.componentCache.delete(key));
    }

    // Clean up general cache
    if (this.cache.size > this.maxCacheSize) {
      const entries = Array.from(this.cache.entries());
      const toRemove = entries.slice(0, Math.floor(this.maxCacheSize * 0.3));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * Set up cache persistence
   */
  setupCachePersistence() {
    // Save cache to localStorage periodically
    setInterval(() => {
      this.saveCacheToStorage();
    }, 60000); // Save every minute

    // Load cache from localStorage on init
    this.loadCacheFromStorage();
  }

  /**
   * Save cache to localStorage
   */
  saveCacheToStorage() {
    try {
      const cacheData = {
        images: Array.from(this.imageCache.entries()),
        timestamp: Date.now()
      };
      
      localStorage.setItem('presentation-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  loadCacheFromStorage() {
    try {
      const cacheData = localStorage.getItem('presentation-cache');
      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        
        // Check if cache is not too old (24 hours)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          this.imageCache = new Map(parsed.images);
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  /**
   * Set up cache invalidation
   */
  setupCacheInvalidation() {
    // Clear cache when presentation data changes
    this.eventBus.on('data:updated', () => {
      this.clearCache();
    });

    // Clear cache on version change
    const currentVersion = this.getCurrentVersion();
    const cachedVersion = localStorage.getItem('presentation-version');
    
    if (currentVersion !== cachedVersion) {
      this.clearCache();
      localStorage.setItem('presentation-version', currentVersion);
    }
  }

  /**
   * Get current presentation version
   */
  getCurrentVersion() {
    // This could be from package.json or a version file
    return '1.0.0'; // Placeholder
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
    this.imageCache.clear();
    this.componentCache.clear();
    localStorage.removeItem('presentation-cache');
    
    this.eventBus.emit('performance:cacheCleared');
  }

  /**
   * Set up memory management
   */
  setupMemoryManagement() {
    // Monitor memory usage
    this.setupMemoryMonitoring();
    
    // Set up garbage collection hints
    this.setupGarbageCollection();
    
    // Set up memory pressure handling
    this.setupMemoryPressureHandling();
  }

  /**
   * Set up memory monitoring
   */
  setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        this.checkMemoryUsage();
      }, 10000); // Check every 10 seconds
    }
  }

  /**
   * Check memory usage and emit warnings
   */
  checkMemoryUsage() {
    if ('memory' in performance) {
      const memInfo = performance.memory;
      this.performanceMetrics.memoryUsage = memInfo.usedJSHeapSize;
      
      // Check if memory usage is high
      if (memInfo.usedJSHeapSize > this.memoryThreshold) {
        this.eventBus.emit('performance:memoryPressure', {
          used: memInfo.usedJSHeapSize,
          total: memInfo.totalJSHeapSize,
          limit: memInfo.jsHeapSizeLimit
        });
      }
    }
  }

  /**
   * Set up garbage collection hints
   */
  setupGarbageCollection() {
    // Suggest garbage collection after slide changes
    this.eventBus.on('navigation:slideChanged', () => {
      // Small delay to allow slide transition to complete
      setTimeout(() => {
        this.suggestGarbageCollection();
      }, 1000);
    });
  }

  /**
   * Suggest garbage collection
   */
  suggestGarbageCollection() {
    // Force garbage collection if available (Chrome DevTools)
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
    
    // Clean up unused DOM elements
    this.cleanupUnusedElements();
  }

  /**
   * Clean up unused DOM elements
   */
  cleanupUnusedElements() {
    // Remove hidden slides from DOM to free memory
    const hiddenSlides = document.querySelectorAll('.slide:not(.active):not(.next):not(.previous)');
    
    hiddenSlides.forEach(slide => {
      // Only remove if it's far from current slide
      const slideNumber = parseInt(slide.dataset.slideNumber);
      const currentSlide = parseInt(document.querySelector('.slide.active')?.dataset.slideNumber || '1');
      
      if (Math.abs(slideNumber - currentSlide) > 3) {
        slide.remove();
        this.loadedSlides.delete(slideNumber);
      }
    });
  }

  /**
   * Set up memory pressure handling
   */
  setupMemoryPressureHandling() {
    // Listen for memory pressure events
    this.eventBus.on('performance:memoryPressure', () => {
      this.handleMemoryPressure();
    });
  }

  /**
   * Handle memory pressure
   */
  handleMemoryPressure() {
    console.warn('Memory pressure detected, cleaning up...');
    
    // Clear caches
    this.cleanupCaches();
    
    // Remove unused elements
    this.cleanupUnusedElements();
    
    // Clear old performance metrics
    this.cleanupMetrics();
    
    // Suggest garbage collection
    this.suggestGarbageCollection();
    
    this.eventBus.emit('performance:memoryCleanupComplete');
  }

  /**
   * Clean up old performance metrics
   */
  cleanupMetrics() {
    // Keep only recent metrics
    const maxMetrics = 100;
    
    if (this.performanceMetrics.slideLoadTimes.size > maxMetrics) {
      const entries = Array.from(this.performanceMetrics.slideLoadTimes.entries());
      const toRemove = entries.slice(0, entries.length - maxMetrics);
      toRemove.forEach(([key]) => this.performanceMetrics.slideLoadTimes.delete(key));
    }

    if (this.performanceMetrics.imageLoadTimes.size > maxMetrics) {
      const entries = Array.from(this.performanceMetrics.imageLoadTimes.entries());
      const toRemove = entries.slice(0, entries.length - maxMetrics);
      toRemove.forEach(([key]) => this.performanceMetrics.imageLoadTimes.delete(key));
    }
  }

  /**
   * Set up performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.setupWebVitalsMonitoring();
    
    // Monitor custom metrics
    this.setupCustomMetrics();
    
    // Set up performance reporting
    this.setupPerformanceReporting();
  }

  /**
   * Set up Web Vitals monitoring
   */
  setupWebVitalsMonitoring() {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.performanceMetrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.performanceMetrics.fid = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Monitor Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.performanceMetrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error);
      }
    }
  }

  /**
   * Set up custom metrics
   */
  setupCustomMetrics() {
    // Track slide transition times
    this.eventBus.on('slide:transitionStart', (data) => {
      this.performanceMetrics.transitionStart = performance.now();
    });

    this.eventBus.on('slide:transitionComplete', (data) => {
      if (this.performanceMetrics.transitionStart) {
        const duration = performance.now() - this.performanceMetrics.transitionStart;
        this.performanceMetrics.lastTransitionTime = duration;
      }
    });
  }

  /**
   * Set up performance reporting
   */
  setupPerformanceReporting() {
    // Report performance metrics periodically
    setInterval(() => {
      this.reportPerformanceMetrics();
    }, 60000); // Report every minute
  }

  /**
   * Report performance metrics
   */
  reportPerformanceMetrics() {
    const metrics = this.getPerformanceMetrics();
    
    this.eventBus.emit('performance:metricsReport', metrics);
    
    // Log performance warnings
    if (metrics.averageSlideLoadTime > 1000) {
      console.warn('Slow slide loading detected:', metrics.averageSlideLoadTime + 'ms');
    }
    
    if (metrics.cacheHitRate < 0.5) {
      console.warn('Low cache hit rate:', (metrics.cacheHitRate * 100).toFixed(1) + '%');
    }
  }

  /**
   * Handle slide change for preloading
   */
  onSlideChanged(slideNumber) {
    // Preload adjacent slides
    this.preloadAdjacentSlides(slideNumber);
    
    // Mark current slide as loaded
    this.loadedSlides.add(slideNumber);
  }

  /**
   * Handle slide rendered for caching
   */
  onSlideRendered(slideId, slideType) {
    // Cache slide data
    this.cache.set(slideId, {
      type: slideType,
      timestamp: Date.now()
    });
  }

  /**
   * Preload adjacent slides
   */
  preloadAdjacentSlides(currentSlide) {
    const slidesToPreload = [
      currentSlide + 1,
      currentSlide + 2,
      currentSlide - 1
    ].filter(num => num > 0);

    slidesToPreload.forEach(slideNumber => {
      if (!this.loadedSlides.has(slideNumber)) {
        this.preloadQueue.push(slideNumber);
      }
    });

    this.processPreloadQueue();
  }

  /**
   * Process preload queue
   */
  async processPreloadQueue() {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }

    this.isPreloading = true;

    while (this.preloadQueue.length > 0) {
      const slideNumber = this.preloadQueue.shift();
      await this.preloadSlide(slideNumber);
      
      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isPreloading = false;
  }

  /**
   * Preload a specific slide
   */
  async preloadSlide(slideNumber) {
    try {
      // Emit preload request
      this.eventBus.emit('performance:preloadSlide', { slideNumber });
      
      // Mark as loaded
      this.loadedSlides.add(slideNumber);
      
    } catch (error) {
      console.error('Failed to preload slide:', slideNumber, error);
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    const slideLoadTimes = Array.from(this.performanceMetrics.slideLoadTimes.values());
    const imageLoadTimes = Array.from(this.performanceMetrics.imageLoadTimes.values());
    
    return {
      // Cache metrics
      cacheHits: this.performanceMetrics.cacheHits,
      cacheMisses: this.performanceMetrics.cacheMisses,
      cacheHitRate: this.performanceMetrics.cacheHits / (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses) || 0,
      
      // Load time metrics
      averageSlideLoadTime: slideLoadTimes.length > 0 ? slideLoadTimes.reduce((a, b) => a + b, 0) / slideLoadTimes.length : 0,
      averageImageLoadTime: imageLoadTimes.length > 0 ? imageLoadTimes.reduce((a, b) => a + b, 0) / imageLoadTimes.length : 0,
      
      // Memory metrics
      memoryUsage: this.performanceMetrics.memoryUsage,
      
      // Cache sizes
      imageCacheSize: this.imageCache.size,
      componentCacheSize: this.componentCache.size,
      generalCacheSize: this.cache.size,
      
      // Web Vitals
      lcp: this.performanceMetrics.lcp,
      fid: this.performanceMetrics.fid,
      cls: this.performanceMetrics.cls,
      
      // Custom metrics
      lastTransitionTime: this.performanceMetrics.lastTransitionTime,
      loadedSlidesCount: this.loadedSlides.size,
      preloadQueueLength: this.preloadQueue.length
    };
  }

  /**
   * Optimize performance based on device capabilities
   */
  optimizeForDevice() {
    // Check device capabilities
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const deviceMemory = navigator.deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;

    // Adjust settings based on device
    if (connection && connection.effectiveType === 'slow-2g') {
      this.maxCacheSize = 10;
      this.memoryThreshold = 50 * 1024 * 1024; // 50MB
    } else if (deviceMemory && deviceMemory < 4) {
      this.maxCacheSize = 25;
      this.memoryThreshold = 75 * 1024 * 1024; // 75MB
    }

    // Adjust preloading based on CPU
    if (hardwareConcurrency && hardwareConcurrency < 4) {
      // Reduce preloading on low-end devices
      this.preloadQueue = this.preloadQueue.slice(0, 2);
    }
  }

  /**
   * Destroy performance manager
   */
  destroy() {
    // Disconnect intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    // Clear all caches
    this.clearCache();

    // Clear intervals and timeouts
    // (In a real implementation, you'd store interval IDs and clear them)

    // Clear event listeners
    this.eventBus.off('navigation:slideChanged');
    this.eventBus.off('template:slideRendered');
    this.eventBus.off('performance:memoryPressure');
    this.eventBus.off('performance:getMetrics');
    this.eventBus.off('data:updated');
    this.eventBus.off('slide:transitionStart');
    this.eventBus.off('slide:transitionComplete');

    console.log('✅ Performance Manager destroyed');
  }
}
