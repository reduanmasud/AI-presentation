// Quality Assurance Manager
// Final polish, optimization, and quality checks

export class QualityAssurance {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.isRunning = false;
    this.results = {
      performance: null,
      accessibility: null,
      functionality: null,
      ui: null
    };
    
    this.init();
  }

  /**
   * Initialize quality assurance
   */
  init() {
    this.setupEventListeners();
    console.log('✅ Quality Assurance Manager initialized');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    this.eventBus.on('qa:runFullAudit', () => {
      this.runFullAudit();
    });

    this.eventBus.on('qa:runPerformanceAudit', () => {
      this.runPerformanceAudit();
    });

    this.eventBus.on('qa:runAccessibilityAudit', () => {
      this.runAccessibilityAudit();
    });

    this.eventBus.on('qa:runFunctionalAudit', () => {
      this.runFunctionalAudit();
    });

    this.eventBus.on('qa:runUIAudit', () => {
      this.runUIAudit();
    });

    this.eventBus.on('qa:getResults', (callback) => {
      if (typeof callback === 'function') {
        callback(this.getResults());
      }
    });

    this.eventBus.on('qa:applyOptimizations', () => {
      this.applyOptimizations();
    });
  }

  /**
   * Run comprehensive quality audit
   */
  async runFullAudit() {
    if (this.isRunning) {
      console.warn('Quality audit already running');
      return;
    }

    this.isRunning = true;
    console.log('🔍 Starting comprehensive quality audit...');
    
    this.eventBus.emit('qa:auditStarted');

    try {
      // Run all audits in sequence
      await this.runPerformanceAudit();
      await this.runAccessibilityAudit();
      await this.runFunctionalAudit();
      await this.runUIAudit();

      const results = this.getResults();
      console.log('✅ Quality audit completed:', results.summary);
      
      this.eventBus.emit('qa:auditCompleted', results);
      
      return results;
    } catch (error) {
      console.error('❌ Quality audit failed:', error);
      this.eventBus.emit('qa:auditFailed', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run performance audit
   */
  async runPerformanceAudit() {
    console.log('⚡ Running performance audit...');
    
    const performanceManager = this.getComponent('performanceManager');
    const testingManager = this.getComponent('testingManager');
    
    const results = {
      metrics: null,
      tests: null,
      score: 0,
      issues: [],
      recommendations: []
    };

    // Get performance metrics
    if (performanceManager) {
      results.metrics = performanceManager.getPerformanceMetrics();
    }

    // Run performance tests
    if (testingManager) {
      results.tests = await testingManager.runPerformanceTests();
    }

    // Calculate performance score
    results.score = this.calculatePerformanceScore(results);

    // Generate recommendations
    results.recommendations = this.generatePerformanceRecommendations(results);

    this.results.performance = results;
    return results;
  }

  /**
   * Run accessibility audit
   */
  async runAccessibilityAudit() {
    console.log('♿ Running accessibility audit...');
    
    const accessibilityChecker = this.getComponent('accessibilityChecker');
    const testingManager = this.getComponent('testingManager');
    
    const results = {
      violations: null,
      tests: null,
      score: 0,
      issues: [],
      recommendations: []
    };

    // Run accessibility checks
    if (accessibilityChecker) {
      results.violations = await accessibilityChecker.runAccessibilityCheck();
    }

    // Run accessibility tests
    if (testingManager) {
      results.tests = await testingManager.runAccessibilityTests();
    }

    // Calculate accessibility score
    results.score = this.calculateAccessibilityScore(results);

    // Generate recommendations
    results.recommendations = this.generateAccessibilityRecommendations(results);

    this.results.accessibility = results;
    return results;
  }

  /**
   * Run functional audit
   */
  async runFunctionalAudit() {
    console.log('🔧 Running functional audit...');
    
    const testingManager = this.getComponent('testingManager');
    
    const results = {
      tests: null,
      score: 0,
      issues: [],
      recommendations: []
    };

    // Run functional tests
    if (testingManager) {
      results.tests = await testingManager.runFunctionalTests();
    }

    // Check component integrity
    results.componentCheck = this.checkComponentIntegrity();

    // Check data integrity
    results.dataCheck = this.checkDataIntegrity();

    // Calculate functional score
    results.score = this.calculateFunctionalScore(results);

    // Generate recommendations
    results.recommendations = this.generateFunctionalRecommendations(results);

    this.results.functionality = results;
    return results;
  }

  /**
   * Run UI audit
   */
  async runUIAudit() {
    console.log('🎨 Running UI audit...');
    
    const results = {
      responsiveness: null,
      consistency: null,
      usability: null,
      score: 0,
      issues: [],
      recommendations: []
    };

    // Check responsive design
    results.responsiveness = this.checkResponsiveDesign();

    // Check UI consistency
    results.consistency = this.checkUIConsistency();

    // Check usability
    results.usability = this.checkUsability();

    // Calculate UI score
    results.score = this.calculateUIScore(results);

    // Generate recommendations
    results.recommendations = this.generateUIRecommendations(results);

    this.results.ui = results;
    return results;
  }

  /**
   * Calculate performance score
   */
  calculatePerformanceScore(results) {
    let score = 100;
    
    if (results.metrics) {
      // Deduct points for slow load times
      if (results.metrics.averageSlideLoadTime > 1000) {
        score -= 20;
      } else if (results.metrics.averageSlideLoadTime > 500) {
        score -= 10;
      }

      // Deduct points for low cache hit rate
      if (results.metrics.cacheHitRate < 0.5) {
        score -= 15;
      } else if (results.metrics.cacheHitRate < 0.7) {
        score -= 5;
      }

      // Deduct points for high memory usage
      if (results.metrics.memoryUsage > 100 * 1024 * 1024) {
        score -= 20;
      } else if (results.metrics.memoryUsage > 50 * 1024 * 1024) {
        score -= 10;
      }
    }

    if (results.tests) {
      const passRate = results.tests.summary.totalPassed / results.tests.summary.totalTests;
      score = score * passRate;
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Calculate accessibility score
   */
  calculateAccessibilityScore(results) {
    let score = 100;
    
    if (results.violations) {
      // Deduct points for violations
      score -= results.violations.summary.errors * 10;
      score -= results.violations.summary.warnings * 5;
      score -= results.violations.summary.suggestions * 2;
    }

    if (results.tests) {
      const passRate = results.tests.summary.totalPassed / results.tests.summary.totalTests;
      score = score * passRate;
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Calculate functional score
   */
  calculateFunctionalScore(results) {
    let score = 100;
    
    if (results.tests) {
      const passRate = results.tests.summary.totalPassed / results.tests.summary.totalTests;
      score = score * passRate;
    }

    if (results.componentCheck && !results.componentCheck.allComponentsLoaded) {
      score -= 20;
    }

    if (results.dataCheck && !results.dataCheck.allDataValid) {
      score -= 15;
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Calculate UI score
   */
  calculateUIScore(results) {
    let score = 100;
    
    if (results.responsiveness && results.responsiveness.issues > 0) {
      score -= results.responsiveness.issues * 5;
    }

    if (results.consistency && results.consistency.issues > 0) {
      score -= results.consistency.issues * 3;
    }

    if (results.usability && results.usability.issues > 0) {
      score -= results.usability.issues * 4;
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Check component integrity
   */
  checkComponentIntegrity() {
    const slideFactory = this.getComponent('slideFactory');
    const templateRenderer = this.getComponent('templateRenderer');
    
    const results = {
      allComponentsLoaded: true,
      missingComponents: [],
      componentCount: 0
    };

    if (slideFactory) {
      const availableTypes = slideFactory.getAvailableTypes();
      results.componentCount = availableTypes.length;
      
      // Check if all slide types are properly registered
      const expectedTypes = ['title', 'agenda', 'timeline', 'workflow', 'platform', 'gallery', 'security', 'conclusion'];
      
      expectedTypes.forEach(type => {
        if (!availableTypes.includes(type)) {
          results.missingComponents.push(type);
          results.allComponentsLoaded = false;
        }
      });
    }

    return results;
  }

  /**
   * Check data integrity
   */
  checkDataIntegrity() {
    const results = {
      allDataValid: true,
      invalidSlides: [],
      totalSlides: 0
    };

    // Check slides data
    try {
      const slidesData = this.getSlidesData();
      results.totalSlides = slidesData.length;
      
      slidesData.forEach((slide, index) => {
        if (!slide.id || !slide.type || !slide.title) {
          results.invalidSlides.push(index);
          results.allDataValid = false;
        }
      });
    } catch (error) {
      results.allDataValid = false;
      results.error = error.message;
    }

    return results;
  }

  /**
   * Check responsive design
   */
  checkResponsiveDesign() {
    const results = {
      issues: 0,
      breakpoints: [],
      recommendations: []
    };

    // Check for responsive breakpoints
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      results.issues++;
      results.recommendations.push('Add viewport meta tag for mobile responsiveness');
    }

    // Check for media queries in stylesheets
    const stylesheets = Array.from(document.styleSheets);
    let hasMediaQueries = false;
    
    try {
      stylesheets.forEach(sheet => {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach(rule => {
            if (rule.type === CSSRule.MEDIA_RULE) {
              hasMediaQueries = true;
              results.breakpoints.push(rule.conditionText);
            }
          });
        }
      });
    } catch (error) {
      // Cross-origin stylesheets may not be accessible
    }

    if (!hasMediaQueries) {
      results.issues++;
      results.recommendations.push('Add responsive media queries for different screen sizes');
    }

    return results;
  }

  /**
   * Check UI consistency
   */
  checkUIConsistency() {
    const results = {
      issues: 0,
      colorScheme: null,
      typography: null,
      spacing: null
    };

    // Check color consistency
    const elements = document.querySelectorAll('*');
    const colors = new Set();
    
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      colors.add(styles.color);
      colors.add(styles.backgroundColor);
    });

    if (colors.size > 20) {
      results.issues++;
      results.colorScheme = { colors: colors.size, excessive: true };
    }

    // Check typography consistency
    const fontFamilies = new Set();
    const fontSizes = new Set();
    
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      fontFamilies.add(styles.fontFamily);
      fontSizes.add(styles.fontSize);
    });

    if (fontFamilies.size > 5) {
      results.issues++;
      results.typography = { fontFamilies: fontFamilies.size, excessive: true };
    }

    return results;
  }

  /**
   * Check usability
   */
  checkUsability() {
    const results = {
      issues: 0,
      navigation: null,
      interactions: null,
      feedback: null
    };

    // Check navigation clarity
    const navElements = document.querySelectorAll('nav, [role="navigation"], .navigation');
    if (navElements.length === 0) {
      results.issues++;
      results.navigation = { missing: true };
    }

    // Check interactive feedback
    const buttons = document.querySelectorAll('button, [role="button"]');
    let buttonsWithoutFeedback = 0;
    
    buttons.forEach(button => {
      const styles = window.getComputedStyle(button, ':hover');
      if (styles.cursor !== 'pointer') {
        buttonsWithoutFeedback++;
      }
    });

    if (buttonsWithoutFeedback > 0) {
      results.issues++;
      results.interactions = { buttonsWithoutFeedback };
    }

    return results;
  }

  /**
   * Generate performance recommendations
   */
  generatePerformanceRecommendations(results) {
    const recommendations = [];
    
    if (results.metrics) {
      if (results.metrics.averageSlideLoadTime > 1000) {
        recommendations.push('Optimize slide loading times by implementing lazy loading');
      }
      
      if (results.metrics.cacheHitRate < 0.7) {
        recommendations.push('Improve caching strategy to increase cache hit rate');
      }
      
      if (results.metrics.memoryUsage > 50 * 1024 * 1024) {
        recommendations.push('Implement memory management to reduce memory usage');
      }
    }

    recommendations.push('Enable service worker for offline caching');
    recommendations.push('Optimize images with modern formats (WebP, AVIF)');
    recommendations.push('Implement resource preloading for critical assets');

    return recommendations;
  }

  /**
   * Generate accessibility recommendations
   */
  generateAccessibilityRecommendations(results) {
    const recommendations = [];
    
    if (results.violations) {
      if (results.violations.summary.errors > 0) {
        recommendations.push('Fix critical accessibility violations immediately');
      }
      
      if (results.violations.summary.warnings > 0) {
        recommendations.push('Address accessibility warnings for better user experience');
      }
    }

    recommendations.push('Implement keyboard navigation for all interactive elements');
    recommendations.push('Ensure sufficient color contrast ratios (WCAG AA)');
    recommendations.push('Add ARIA labels and landmarks for screen readers');
    recommendations.push('Test with actual assistive technologies');

    return recommendations;
  }

  /**
   * Generate functional recommendations
   */
  generateFunctionalRecommendations(results) {
    const recommendations = [];
    
    if (results.componentCheck && !results.componentCheck.allComponentsLoaded) {
      recommendations.push('Ensure all slide components are properly loaded');
    }
    
    if (results.dataCheck && !results.dataCheck.allDataValid) {
      recommendations.push('Validate and fix slide data integrity issues');
    }

    recommendations.push('Implement comprehensive error handling');
    recommendations.push('Add fallback mechanisms for failed operations');
    recommendations.push('Set up automated testing pipeline');

    return recommendations;
  }

  /**
   * Generate UI recommendations
   */
  generateUIRecommendations(results) {
    const recommendations = [];
    
    if (results.responsiveness && results.responsiveness.issues > 0) {
      recommendations.push('Improve responsive design for all screen sizes');
    }
    
    if (results.consistency && results.consistency.issues > 0) {
      recommendations.push('Establish consistent design system and style guide');
    }
    
    if (results.usability && results.usability.issues > 0) {
      recommendations.push('Enhance user interface feedback and interactions');
    }

    recommendations.push('Implement consistent spacing and typography scale');
    recommendations.push('Add loading states and progress indicators');
    recommendations.push('Ensure clear visual hierarchy and information architecture');

    return recommendations;
  }

  /**
   * Apply automatic optimizations
   */
  async applyOptimizations() {
    console.log('🔧 Applying automatic optimizations...');
    
    const optimizations = [];

    // Apply performance optimizations
    const performanceManager = this.getComponent('performanceManager');
    if (performanceManager) {
      performanceManager.optimizeForDevice();
      optimizations.push('Device-specific performance optimization applied');
    }

    // Apply accessibility fixes
    const accessibilityChecker = this.getComponent('accessibilityChecker');
    if (accessibilityChecker) {
      const violations = accessibilityChecker.getViolations();
      let fixedCount = 0;
      
      [...violations.violations, ...violations.warnings].forEach(violation => {
        const result = accessibilityChecker.fixViolation(violation.id);
        if (result.fixed) {
          fixedCount++;
        }
      });
      
      if (fixedCount > 0) {
        optimizations.push(`Fixed ${fixedCount} accessibility issues automatically`);
      }
    }

    // Apply UI optimizations
    this.applyUIOptimizations();
    optimizations.push('UI optimizations applied');

    console.log('✅ Optimizations applied:', optimizations);
    
    this.eventBus.emit('qa:optimizationsApplied', optimizations);
    
    return optimizations;
  }

  /**
   * Apply UI optimizations
   */
  applyUIOptimizations() {
    // Add loading states to buttons without them
    const buttons = document.querySelectorAll('button:not([data-loading])');
    buttons.forEach(button => {
      button.setAttribute('data-loading', 'false');
    });

    // Enhance focus indicators
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
      if (!element.classList.contains('focus-visible-enhanced')) {
        element.classList.add('focus-visible-enhanced');
      }
    });

    // Add high contrast support
    document.body.classList.add('high-contrast-ready');
  }

  /**
   * Get component from app
   */
  getComponent(name) {
    if (window.presentationApp && window.presentationApp.components) {
      return window.presentationApp.components.get(name);
    }
    return null;
  }

  /**
   * Get slides data
   */
  getSlidesData() {
    // This would typically come from the data module
    return window.slidesData || [];
  }

  /**
   * Get comprehensive results
   */
  getResults() {
    const summary = {
      overallScore: 0,
      performance: this.results.performance?.score || 0,
      accessibility: this.results.accessibility?.score || 0,
      functionality: this.results.functionality?.score || 0,
      ui: this.results.ui?.score || 0
    };

    summary.overallScore = Math.round(
      (summary.performance + summary.accessibility + summary.functionality + summary.ui) / 4
    );

    return {
      summary,
      details: this.results,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    const results = this.getResults();
    
    return {
      ...results,
      grade: this.calculateGrade(results.summary.overallScore),
      recommendations: this.generateOverallRecommendations(results),
      nextSteps: this.generateNextSteps(results)
    };
  }

  calculateGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  generateOverallRecommendations(results) {
    const recommendations = [];
    
    if (results.summary.performance < 80) {
      recommendations.push('Focus on performance optimization');
    }
    
    if (results.summary.accessibility < 80) {
      recommendations.push('Prioritize accessibility improvements');
    }
    
    if (results.summary.functionality < 80) {
      recommendations.push('Address functional issues and testing');
    }
    
    if (results.summary.ui < 80) {
      recommendations.push('Improve user interface and experience');
    }

    return recommendations;
  }

  generateNextSteps(results) {
    const steps = [];
    
    steps.push('Review and address high-priority issues');
    steps.push('Implement automated quality checks in CI/CD pipeline');
    steps.push('Schedule regular quality audits');
    steps.push('Gather user feedback and iterate');
    
    return steps;
  }

  /**
   * Destroy quality assurance manager
   */
  destroy() {
    this.results = {
      performance: null,
      accessibility: null,
      functionality: null,
      ui: null
    };
    
    // Clear event listeners
    this.eventBus.off('qa:runFullAudit');
    this.eventBus.off('qa:runPerformanceAudit');
    this.eventBus.off('qa:runAccessibilityAudit');
    this.eventBus.off('qa:runFunctionalAudit');
    this.eventBus.off('qa:runUIAudit');
    this.eventBus.off('qa:getResults');
    this.eventBus.off('qa:applyOptimizations');
    
    console.log('✅ Quality Assurance Manager destroyed');
  }
}
