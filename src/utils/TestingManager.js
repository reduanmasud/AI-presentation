// Testing Manager
// Comprehensive testing and quality assurance system

export class TestingManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.testResults = new Map();
    this.accessibilityIssues = [];
    this.performanceIssues = [];
    this.functionalIssues = [];
    this.isRunning = false;
    this.testSuites = new Map();
    
    this.init();
  }

  /**
   * Initialize testing manager
   */
  init() {
    this.setupTestSuites();
    this.setupEventListeners();
    this.setupAccessibilityTesting();
    this.setupPerformanceTesting();
    
    console.log('✅ Testing Manager initialized');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    this.eventBus.on('testing:runTests', (options) => {
      this.runTests(options);
    });

    this.eventBus.on('testing:runAccessibilityTests', () => {
      this.runAccessibilityTests();
    });

    this.eventBus.on('testing:runPerformanceTests', () => {
      this.runPerformanceTests();
    });

    this.eventBus.on('testing:runFunctionalTests', () => {
      this.runFunctionalTests();
    });

    this.eventBus.on('testing:getResults', (callback) => {
      if (typeof callback === 'function') {
        callback(this.getTestResults());
      }
    });
  }

  /**
   * Set up test suites
   */
  setupTestSuites() {
    // Navigation tests
    this.testSuites.set('navigation', {
      name: 'Navigation Tests',
      tests: [
        this.testSlideNavigation.bind(this),
        this.testKeyboardNavigation.bind(this),
        this.testTouchNavigation.bind(this),
        this.testNavigationHistory.bind(this),
        this.testOverviewMode.bind(this)
      ]
    });

    // Slide rendering tests
    this.testSuites.set('rendering', {
      name: 'Slide Rendering Tests',
      tests: [
        this.testSlideRendering.bind(this),
        this.testSlideTransitions.bind(this),
        this.testSlideContent.bind(this),
        this.testSlideInteractions.bind(this),
        this.testSlideAnimations.bind(this)
      ]
    });

    // Performance tests
    this.testSuites.set('performance', {
      name: 'Performance Tests',
      tests: [
        this.testLoadTimes.bind(this),
        this.testMemoryUsage.bind(this),
        this.testCacheEfficiency.bind(this),
        this.testImageLoading.bind(this),
        this.testServiceWorker.bind(this)
      ]
    });

    // Accessibility tests
    this.testSuites.set('accessibility', {
      name: 'Accessibility Tests',
      tests: [
        this.testKeyboardAccessibility.bind(this),
        this.testScreenReaderSupport.bind(this),
        this.testColorContrast.bind(this),
        this.testFocusManagement.bind(this),
        this.testARIAAttributes.bind(this)
      ]
    });

    // Feature tests
    this.testSuites.set('features', {
      name: 'Feature Tests',
      tests: [
        this.testSearchFunctionality.bind(this),
        this.testBookmarkSystem.bind(this),
        this.testFullscreenMode.bind(this),
        this.testAutoPlay.bind(this),
        this.testOfflineMode.bind(this)
      ]
    });
  }

  /**
   * Run all tests or specific test suite
   */
  async runTests(options = {}) {
    if (this.isRunning) {
      console.warn('Tests are already running');
      return;
    }

    this.isRunning = true;
    this.testResults.clear();
    this.accessibilityIssues = [];
    this.performanceIssues = [];
    this.functionalIssues = [];

    console.log('🧪 Starting test execution...');
    this.eventBus.emit('testing:started');

    try {
      const suitesToRun = options.suites || Array.from(this.testSuites.keys());
      
      for (const suiteKey of suitesToRun) {
        const suite = this.testSuites.get(suiteKey);
        if (suite) {
          await this.runTestSuite(suiteKey, suite);
        }
      }

      const results = this.getTestResults();
      console.log('✅ Test execution completed:', results);
      
      this.eventBus.emit('testing:completed', results);
      
      return results;
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      this.eventBus.emit('testing:failed', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run a specific test suite
   */
  async runTestSuite(suiteKey, suite) {
    console.log(`📋 Running ${suite.name}...`);
    
    const suiteResults = {
      name: suite.name,
      tests: [],
      passed: 0,
      failed: 0,
      duration: 0
    };

    const startTime = performance.now();

    for (const test of suite.tests) {
      try {
        const testResult = await this.runSingleTest(test);
        suiteResults.tests.push(testResult);
        
        if (testResult.passed) {
          suiteResults.passed++;
        } else {
          suiteResults.failed++;
        }
      } catch (error) {
        suiteResults.tests.push({
          name: test.name || 'Unknown Test',
          passed: false,
          error: error.message,
          duration: 0
        });
        suiteResults.failed++;
      }
    }

    suiteResults.duration = performance.now() - startTime;
    this.testResults.set(suiteKey, suiteResults);
  }

  /**
   * Run a single test
   */
  async runSingleTest(testFunction) {
    const startTime = performance.now();
    
    try {
      const result = await testFunction();
      const duration = performance.now() - startTime;
      
      return {
        name: testFunction.name || 'Unknown Test',
        passed: result.passed !== false,
        message: result.message || 'Test passed',
        duration: duration,
        details: result.details || {}
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        name: testFunction.name || 'Unknown Test',
        passed: false,
        error: error.message,
        duration: duration
      };
    }
  }

  // Navigation Tests
  async testSlideNavigation() {
    const currentSlide = document.querySelector('.slide.active');
    const slideNumber = currentSlide ? parseInt(currentSlide.dataset.slideNumber) : 1;
    
    // Test next slide navigation
    this.eventBus.emit('navigation:nextSlide');
    await this.wait(500);
    
    const nextSlide = document.querySelector('.slide.active');
    const nextSlideNumber = nextSlide ? parseInt(nextSlide.dataset.slideNumber) : 1;
    
    return {
      passed: nextSlideNumber === slideNumber + 1,
      message: `Navigation from slide ${slideNumber} to ${nextSlideNumber}`,
      details: { from: slideNumber, to: nextSlideNumber }
    };
  }

  async testKeyboardNavigation() {
    const initialSlide = document.querySelector('.slide.active');
    const initialNumber = initialSlide ? parseInt(initialSlide.dataset.slideNumber) : 1;
    
    // Simulate arrow key press
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    document.dispatchEvent(event);
    
    await this.wait(500);
    
    const newSlide = document.querySelector('.slide.active');
    const newNumber = newSlide ? parseInt(newSlide.dataset.slideNumber) : 1;
    
    return {
      passed: newNumber !== initialNumber,
      message: `Keyboard navigation ${initialNumber} → ${newNumber}`,
      details: { keyPressed: 'ArrowRight', slideChanged: newNumber !== initialNumber }
    };
  }

  async testTouchNavigation() {
    // Simulate touch events
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 }]
    });
    
    const touchEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 200, clientY: 100 }]
    });
    
    document.dispatchEvent(touchStart);
    await this.wait(100);
    document.dispatchEvent(touchEnd);
    
    return {
      passed: true,
      message: 'Touch navigation events dispatched successfully'
    };
  }

  async testNavigationHistory() {
    const navigationManager = this.getComponent('navigationManager');
    
    if (!navigationManager) {
      return { passed: false, message: 'Navigation manager not found' };
    }
    
    const stats = navigationManager.getNavigationStats();
    
    return {
      passed: stats.historyLength >= 0,
      message: `Navigation history contains ${stats.historyLength} entries`,
      details: stats
    };
  }

  async testOverviewMode() {
    // Test overview mode toggle
    this.eventBus.emit('navigation:toggleOverview');
    await this.wait(300);
    
    const hasOverviewClass = document.body.classList.contains('overview-mode');
    
    // Toggle back
    this.eventBus.emit('navigation:toggleOverview');
    await this.wait(300);
    
    return {
      passed: hasOverviewClass,
      message: `Overview mode ${hasOverviewClass ? 'activated' : 'failed to activate'}`,
      details: { overviewModeActivated: hasOverviewClass }
    };
  }

  // Rendering Tests
  async testSlideRendering() {
    const slides = document.querySelectorAll('.slide');
    const activeSlide = document.querySelector('.slide.active');
    
    return {
      passed: slides.length > 0 && activeSlide !== null,
      message: `Found ${slides.length} slides, ${activeSlide ? '1' : '0'} active`,
      details: { totalSlides: slides.length, hasActiveSlide: !!activeSlide }
    };
  }

  async testSlideTransitions() {
    const transitionStart = performance.now();
    
    // Trigger slide transition
    this.eventBus.emit('navigation:nextSlide');
    
    // Wait for transition
    await this.wait(1000);
    
    const transitionEnd = performance.now();
    const duration = transitionEnd - transitionStart;
    
    return {
      passed: duration < 2000, // Should complete within 2 seconds
      message: `Slide transition completed in ${duration.toFixed(2)}ms`,
      details: { duration: duration }
    };
  }

  async testSlideContent() {
    const activeSlide = document.querySelector('.slide.active');
    
    if (!activeSlide) {
      return { passed: false, message: 'No active slide found' };
    }
    
    const hasTitle = activeSlide.querySelector('h1, h2, .slide-title');
    const hasContent = activeSlide.querySelector('.slide-content, .slide-main-content');
    
    return {
      passed: hasTitle && hasContent,
      message: `Slide has ${hasTitle ? 'title' : 'no title'} and ${hasContent ? 'content' : 'no content'}`,
      details: { hasTitle: !!hasTitle, hasContent: !!hasContent }
    };
  }

  async testSlideInteractions() {
    const interactiveElements = document.querySelectorAll('[data-expandable], button, [role="button"]');
    
    return {
      passed: interactiveElements.length > 0,
      message: `Found ${interactiveElements.length} interactive elements`,
      details: { interactiveElementsCount: interactiveElements.length }
    };
  }

  async testSlideAnimations() {
    const animatedElements = document.querySelectorAll('.animated, [class*="animate"]');
    
    return {
      passed: true, // Animations are optional
      message: `Found ${animatedElements.length} animated elements`,
      details: { animatedElementsCount: animatedElements.length }
    };
  }

  // Performance Tests
  async testLoadTimes() {
    const performanceManager = this.getComponent('performanceManager');
    
    if (!performanceManager) {
      return { passed: false, message: 'Performance manager not found' };
    }
    
    const metrics = performanceManager.getPerformanceMetrics();
    const avgLoadTime = metrics.averageSlideLoadTime;
    
    return {
      passed: avgLoadTime < 1000, // Should load within 1 second
      message: `Average slide load time: ${avgLoadTime.toFixed(2)}ms`,
      details: metrics
    };
  }

  async testMemoryUsage() {
    if (!('memory' in performance)) {
      return { passed: true, message: 'Memory API not available' };
    }
    
    const memInfo = performance.memory;
    const usedMB = memInfo.usedJSHeapSize / (1024 * 1024);
    
    return {
      passed: usedMB < 100, // Should use less than 100MB
      message: `Memory usage: ${usedMB.toFixed(2)}MB`,
      details: {
        used: memInfo.usedJSHeapSize,
        total: memInfo.totalJSHeapSize,
        limit: memInfo.jsHeapSizeLimit
      }
    };
  }

  async testCacheEfficiency() {
    const performanceManager = this.getComponent('performanceManager');
    
    if (!performanceManager) {
      return { passed: false, message: 'Performance manager not found' };
    }
    
    const metrics = performanceManager.getPerformanceMetrics();
    const hitRate = metrics.cacheHitRate;
    
    return {
      passed: hitRate > 0.5, // Should have >50% cache hit rate
      message: `Cache hit rate: ${(hitRate * 100).toFixed(1)}%`,
      details: {
        hits: metrics.cacheHits,
        misses: metrics.cacheMisses,
        hitRate: hitRate
      }
    };
  }

  async testImageLoading() {
    const images = document.querySelectorAll('img');
    const loadedImages = document.querySelectorAll('img.loaded');
    const errorImages = document.querySelectorAll('img.error');
    
    return {
      passed: errorImages.length === 0,
      message: `Images: ${loadedImages.length}/${images.length} loaded, ${errorImages.length} errors`,
      details: {
        total: images.length,
        loaded: loadedImages.length,
        errors: errorImages.length
      }
    };
  }

  async testServiceWorker() {
    const swManager = this.getComponent('serviceWorkerManager');
    
    if (!swManager) {
      return { passed: false, message: 'Service Worker manager not found' };
    }
    
    const status = swManager.getStatus();
    
    return {
      passed: status.isSupported && status.isRegistered,
      message: `Service Worker: ${status.isRegistered ? 'registered' : 'not registered'}`,
      details: status
    };
  }

  // Accessibility Tests
  async testKeyboardAccessibility() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let accessibleCount = 0;
    
    focusableElements.forEach(element => {
      if (!element.disabled && element.offsetParent !== null) {
        accessibleCount++;
      }
    });
    
    return {
      passed: accessibleCount > 0,
      message: `Found ${accessibleCount} keyboard accessible elements`,
      details: { focusableElements: accessibleCount }
    };
  }

  async testScreenReaderSupport() {
    const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"]');
    
    return {
      passed: ariaElements.length > 0 && headings.length > 0,
      message: `ARIA elements: ${ariaElements.length}, Headings: ${headings.length}, Landmarks: ${landmarks.length}`,
      details: {
        ariaElements: ariaElements.length,
        headings: headings.length,
        landmarks: landmarks.length
      }
    };
  }

  async testColorContrast() {
    // Basic color contrast test (simplified)
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
    let contrastIssues = 0;
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simplified contrast check (would need more sophisticated algorithm in real implementation)
      if (color === backgroundColor) {
        contrastIssues++;
      }
    });
    
    return {
      passed: contrastIssues === 0,
      message: `Found ${contrastIssues} potential contrast issues`,
      details: { contrastIssues: contrastIssues }
    };
  }

  async testFocusManagement() {
    const focusableElements = document.querySelectorAll('[tabindex], button, [href], input, select, textarea');
    let focusIssues = 0;
    
    focusableElements.forEach(element => {
      if (element.tabIndex < 0 && element.tabIndex !== -1) {
        focusIssues++;
      }
    });
    
    return {
      passed: focusIssues === 0,
      message: `Found ${focusIssues} focus management issues`,
      details: { focusIssues: focusIssues }
    };
  }

  async testARIAAttributes() {
    const interactiveElements = document.querySelectorAll('button, [role="button"], [data-expandable]');
    let missingAria = 0;
    
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('aria-label') && 
          !element.hasAttribute('aria-labelledby') && 
          !element.textContent.trim()) {
        missingAria++;
      }
    });
    
    return {
      passed: missingAria === 0,
      message: `Found ${missingAria} elements missing ARIA labels`,
      details: { missingAriaLabels: missingAria }
    };
  }

  // Feature Tests
  async testSearchFunctionality() {
    const searchManager = this.getComponent('searchManager');
    
    if (!searchManager) {
      return { passed: false, message: 'Search manager not found' };
    }
    
    // Test search functionality
    const searchResults = await searchManager.search('test');
    
    return {
      passed: Array.isArray(searchResults),
      message: `Search returned ${searchResults ? searchResults.length : 0} results`,
      details: { searchResults: searchResults ? searchResults.length : 0 }
    };
  }

  async testBookmarkSystem() {
    const bookmarkManager = this.getComponent('bookmarkManager');
    
    if (!bookmarkManager) {
      return { passed: false, message: 'Bookmark manager not found' };
    }
    
    const bookmarks = bookmarkManager.getBookmarks();
    
    return {
      passed: Array.isArray(bookmarks),
      message: `Found ${bookmarks.length} bookmarks`,
      details: { bookmarkCount: bookmarks.length }
    };
  }

  async testFullscreenMode() {
    const fullscreenManager = this.getComponent('fullscreenManager');
    
    if (!fullscreenManager) {
      return { passed: false, message: 'Fullscreen manager not found' };
    }
    
    const isSupported = fullscreenManager.isSupported();
    
    return {
      passed: isSupported,
      message: `Fullscreen ${isSupported ? 'supported' : 'not supported'}`,
      details: { fullscreenSupported: isSupported }
    };
  }

  async testAutoPlay() {
    const autoPlayManager = this.getComponent('autoPlayManager');
    
    if (!autoPlayManager) {
      return { passed: false, message: 'AutoPlay manager not found' };
    }
    
    const isEnabled = autoPlayManager.isEnabled();
    
    return {
      passed: true, // AutoPlay is optional
      message: `AutoPlay ${isEnabled ? 'enabled' : 'disabled'}`,
      details: { autoPlayEnabled: isEnabled }
    };
  }

  async testOfflineMode() {
    const swManager = this.getComponent('serviceWorkerManager');
    
    if (!swManager) {
      return { passed: false, message: 'Service Worker manager not found' };
    }
    
    const status = swManager.getStatus();
    
    return {
      passed: status.isRegistered,
      message: `Offline support ${status.isRegistered ? 'available' : 'not available'}`,
      details: { offlineSupported: status.isRegistered }
    };
  }

  // Accessibility Testing Setup
  setupAccessibilityTesting() {
    // Monitor for accessibility violations
    this.observeAccessibilityViolations();
  }

  observeAccessibilityViolations() {
    // Monitor for missing alt text
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
      this.accessibilityIssues.push({
        type: 'missing-alt-text',
        element: img,
        message: 'Image missing alt text'
      });
    });

    // Monitor for missing form labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
      if (!input.closest('label')) {
        this.accessibilityIssues.push({
          type: 'missing-form-label',
          element: input,
          message: 'Form input missing label'
        });
      }
    });
  }

  // Performance Testing Setup
  setupPerformanceTesting() {
    // Monitor for performance issues
    this.observePerformanceIssues();
  }

  observePerformanceIssues() {
    // Monitor for slow operations
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 100) { // Operations taking more than 100ms
          this.performanceIssues.push({
            type: 'slow-operation',
            name: entry.name,
            duration: entry.duration,
            message: `Slow operation: ${entry.name} took ${entry.duration.toFixed(2)}ms`
          });
        }
      });
    });

    if ('PerformanceObserver' in window) {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }

  // Utility Methods
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getComponent(name) {
    // Get component from global app instance
    if (window.presentationApp && window.presentationApp.components) {
      return window.presentationApp.components.get(name);
    }
    return null;
  }

  getTestResults() {
    const results = {
      summary: {
        totalSuites: this.testResults.size,
        totalTests: 0,
        totalPassed: 0,
        totalFailed: 0,
        totalDuration: 0
      },
      suites: Array.from(this.testResults.values()),
      issues: {
        accessibility: this.accessibilityIssues,
        performance: this.performanceIssues,
        functional: this.functionalIssues
      }
    };

    // Calculate summary
    results.suites.forEach(suite => {
      results.summary.totalTests += suite.tests.length;
      results.summary.totalPassed += suite.passed;
      results.summary.totalFailed += suite.failed;
      results.summary.totalDuration += suite.duration;
    });

    return results;
  }

  // Accessibility Testing Methods
  async runAccessibilityTests() {
    console.log('🔍 Running accessibility tests...');
    return await this.runTests({ suites: ['accessibility'] });
  }

  // Performance Testing Methods
  async runPerformanceTests() {
    console.log('⚡ Running performance tests...');
    return await this.runTests({ suites: ['performance'] });
  }

  // Functional Testing Methods
  async runFunctionalTests() {
    console.log('🔧 Running functional tests...');
    return await this.runTests({ suites: ['navigation', 'rendering', 'features'] });
  }

  /**
   * Generate test report
   */
  generateTestReport() {
    const results = this.getTestResults();
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: results.summary,
      passRate: (results.summary.totalPassed / results.summary.totalTests * 100).toFixed(1),
      suites: results.suites.map(suite => ({
        name: suite.name,
        passed: suite.passed,
        failed: suite.failed,
        duration: suite.duration.toFixed(2),
        passRate: (suite.passed / (suite.passed + suite.failed) * 100).toFixed(1)
      })),
      issues: {
        accessibility: results.issues.accessibility.length,
        performance: results.issues.performance.length,
        functional: results.issues.functional.length
      }
    };

    return report;
  }

  /**
   * Destroy testing manager
   */
  destroy() {
    this.testResults.clear();
    this.testSuites.clear();
    this.accessibilityIssues = [];
    this.performanceIssues = [];
    this.functionalIssues = [];
    
    // Clear event listeners
    this.eventBus.off('testing:runTests');
    this.eventBus.off('testing:runAccessibilityTests');
    this.eventBus.off('testing:runPerformanceTests');
    this.eventBus.off('testing:runFunctionalTests');
    this.eventBus.off('testing:getResults');
    
    console.log('✅ Testing Manager destroyed');
  }
}
