// Accessibility Checker
// Comprehensive accessibility testing and validation

export class AccessibilityChecker {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.violations = [];
    this.warnings = [];
    this.suggestions = [];
    this.isRunning = false;
    this.rules = new Map();
    
    this.init();
  }

  /**
   * Initialize accessibility checker
   */
  init() {
    this.setupAccessibilityRules();
    this.setupEventListeners();
    this.setupMutationObserver();
    
    console.log('✅ Accessibility Checker initialized');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    this.eventBus.on('accessibility:check', (options) => {
      this.runAccessibilityCheck(options);
    });

    this.eventBus.on('accessibility:getViolations', (callback) => {
      if (typeof callback === 'function') {
        callback(this.getViolations());
      }
    });

    this.eventBus.on('accessibility:fixViolation', (violationId) => {
      this.fixViolation(violationId);
    });
  }

  /**
   * Set up mutation observer to monitor DOM changes
   */
  setupMutationObserver() {
    if ('MutationObserver' in window) {
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.checkElementAccessibility(node);
              }
            });
          }
        });
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-label', 'aria-labelledby', 'aria-describedby', 'alt', 'role']
      });
    }
  }

  /**
   * Set up accessibility rules
   */
  setupAccessibilityRules() {
    // WCAG 2.1 AA compliance rules
    this.rules.set('missing-alt-text', {
      name: 'Missing Alt Text',
      level: 'error',
      wcag: '1.1.1',
      check: this.checkMissingAltText.bind(this),
      fix: this.fixMissingAltText.bind(this)
    });

    this.rules.set('missing-form-labels', {
      name: 'Missing Form Labels',
      level: 'error',
      wcag: '1.3.1',
      check: this.checkMissingFormLabels.bind(this),
      fix: this.fixMissingFormLabels.bind(this)
    });

    this.rules.set('insufficient-color-contrast', {
      name: 'Insufficient Color Contrast',
      level: 'error',
      wcag: '1.4.3',
      check: this.checkColorContrast.bind(this),
      fix: this.fixColorContrast.bind(this)
    });

    this.rules.set('missing-focus-indicators', {
      name: 'Missing Focus Indicators',
      level: 'error',
      wcag: '2.4.7',
      check: this.checkFocusIndicators.bind(this),
      fix: this.fixFocusIndicators.bind(this)
    });

    this.rules.set('improper-heading-structure', {
      name: 'Improper Heading Structure',
      level: 'warning',
      wcag: '1.3.1',
      check: this.checkHeadingStructure.bind(this),
      fix: this.fixHeadingStructure.bind(this)
    });

    this.rules.set('missing-landmarks', {
      name: 'Missing Landmarks',
      level: 'warning',
      wcag: '1.3.1',
      check: this.checkLandmarks.bind(this),
      fix: this.fixLandmarks.bind(this)
    });

    this.rules.set('keyboard-accessibility', {
      name: 'Keyboard Accessibility',
      level: 'error',
      wcag: '2.1.1',
      check: this.checkKeyboardAccessibility.bind(this),
      fix: this.fixKeyboardAccessibility.bind(this)
    });

    this.rules.set('aria-attributes', {
      name: 'ARIA Attributes',
      level: 'warning',
      wcag: '4.1.2',
      check: this.checkAriaAttributes.bind(this),
      fix: this.fixAriaAttributes.bind(this)
    });
  }

  /**
   * Run comprehensive accessibility check
   */
  async runAccessibilityCheck(options = {}) {
    if (this.isRunning) {
      console.warn('Accessibility check already running');
      return;
    }

    this.isRunning = true;
    this.violations = [];
    this.warnings = [];
    this.suggestions = [];

    console.log('🔍 Running accessibility check...');
    this.eventBus.emit('accessibility:checkStarted');

    try {
      const container = options.container || document.body;
      const rulesToCheck = options.rules || Array.from(this.rules.keys());

      for (const ruleKey of rulesToCheck) {
        const rule = this.rules.get(ruleKey);
        if (rule) {
          await this.runRule(rule, container);
        }
      }

      const results = this.getViolations();
      console.log('✅ Accessibility check completed:', results.summary);
      
      this.eventBus.emit('accessibility:checkCompleted', results);
      
      return results;
    } catch (error) {
      console.error('❌ Accessibility check failed:', error);
      this.eventBus.emit('accessibility:checkFailed', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run a specific accessibility rule
   */
  async runRule(rule, container) {
    try {
      const violations = await rule.check(container);
      
      violations.forEach(violation => {
        const violationData = {
          id: this.generateViolationId(),
          rule: rule.name,
          level: rule.level,
          wcag: rule.wcag,
          element: violation.element,
          message: violation.message,
          fix: rule.fix,
          timestamp: Date.now()
        };

        if (rule.level === 'error') {
          this.violations.push(violationData);
        } else if (rule.level === 'warning') {
          this.warnings.push(violationData);
        } else {
          this.suggestions.push(violationData);
        }
      });
    } catch (error) {
      console.error(`Failed to run accessibility rule ${rule.name}:`, error);
    }
  }

  /**
   * Check for missing alt text
   */
  async checkMissingAltText(container) {
    const violations = [];
    const images = container.querySelectorAll('img');

    images.forEach(img => {
      if (!img.hasAttribute('alt') || img.alt.trim() === '') {
        // Skip decorative images
        if (!img.hasAttribute('role') || img.getAttribute('role') !== 'presentation') {
          violations.push({
            element: img,
            message: 'Image is missing alt text or has empty alt attribute'
          });
        }
      }
    });

    return violations;
  }

  /**
   * Check for missing form labels
   */
  async checkMissingFormLabels(container) {
    const violations = [];
    const inputs = container.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      const hasLabel = input.closest('label') || 
                     input.hasAttribute('aria-label') || 
                     input.hasAttribute('aria-labelledby') ||
                     document.querySelector(`label[for="${input.id}"]`);

      if (!hasLabel && input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
        violations.push({
          element: input,
          message: 'Form control is missing an accessible label'
        });
      }
    });

    return violations;
  }

  /**
   * Check color contrast
   */
  async checkColorContrast(container) {
    const violations = [];
    const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = this.parseColor(styles.color);
      const backgroundColor = this.parseColor(styles.backgroundColor);

      if (color && backgroundColor) {
        const contrast = this.calculateContrast(color, backgroundColor);
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;

        // WCAG AA requirements
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
        const requiredContrast = isLargeText ? 3 : 4.5;

        if (contrast < requiredContrast) {
          violations.push({
            element: element,
            message: `Insufficient color contrast: ${contrast.toFixed(2)}:1 (required: ${requiredContrast}:1)`
          });
        }
      }
    });

    return violations;
  }

  /**
   * Check focus indicators
   */
  async checkFocusIndicators(container) {
    const violations = [];
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      const styles = window.getComputedStyle(element, ':focus');
      const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';
      const hasBoxShadow = styles.boxShadow !== 'none';
      const hasCustomFocus = element.classList.contains('focus-visible') || 
                            element.hasAttribute('data-focus-visible');

      if (!hasOutline && !hasBoxShadow && !hasCustomFocus) {
        violations.push({
          element: element,
          message: 'Focusable element lacks visible focus indicator'
        });
      }
    });

    return violations;
  }

  /**
   * Check heading structure
   */
  async checkHeadingStructure(container) {
    const violations = [];
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level > previousLevel + 1) {
        violations.push({
          element: heading,
          message: `Heading level ${level} skips level ${previousLevel + 1}`
        });
      }
      
      previousLevel = level;
    });

    return violations;
  }

  /**
   * Check landmarks
   */
  async checkLandmarks(container) {
    const violations = [];
    const landmarks = container.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');

    if (landmarks.length === 0) {
      violations.push({
        element: container,
        message: 'Page lacks landmark elements for navigation'
      });
    }

    return violations;
  }

  /**
   * Check keyboard accessibility
   */
  async checkKeyboardAccessibility(container) {
    const violations = [];
    const interactiveElements = container.querySelectorAll('button, [role="button"], [onclick], [data-expandable]');

    interactiveElements.forEach(element => {
      const isButton = element.tagName === 'BUTTON';
      const hasTabIndex = element.hasAttribute('tabindex');
      const hasRole = element.hasAttribute('role');

      if (!isButton && !hasTabIndex && !hasRole) {
        violations.push({
          element: element,
          message: 'Interactive element is not keyboard accessible'
        });
      }
    });

    return violations;
  }

  /**
   * Check ARIA attributes
   */
  async checkAriaAttributes(container) {
    const violations = [];
    const ariaElements = container.querySelectorAll('[aria-labelledby], [aria-describedby]');

    ariaElements.forEach(element => {
      const labelledBy = element.getAttribute('aria-labelledby');
      const describedBy = element.getAttribute('aria-describedby');

      if (labelledBy) {
        const labelElement = document.getElementById(labelledBy);
        if (!labelElement) {
          violations.push({
            element: element,
            message: `aria-labelledby references non-existent element: ${labelledBy}`
          });
        }
      }

      if (describedBy) {
        const descElement = document.getElementById(describedBy);
        if (!descElement) {
          violations.push({
            element: element,
            message: `aria-describedby references non-existent element: ${describedBy}`
          });
        }
      }
    });

    return violations;
  }

  /**
   * Fix missing alt text
   */
  fixMissingAltText(violation) {
    const img = violation.element;
    const src = img.src || img.dataset.src || '';
    const filename = src.split('/').pop().split('.')[0];
    
    // Generate descriptive alt text based on context
    let altText = filename.replace(/[-_]/g, ' ');
    
    // Check if image is in a figure with caption
    const figure = img.closest('figure');
    if (figure) {
      const caption = figure.querySelector('figcaption');
      if (caption) {
        altText = caption.textContent.trim();
      }
    }
    
    img.setAttribute('alt', altText || 'Image');
    
    return {
      fixed: true,
      message: `Added alt text: "${altText}"`
    };
  }

  /**
   * Fix missing form labels
   */
  fixMissingFormLabels(violation) {
    const input = violation.element;
    
    // Generate ID if missing
    if (!input.id) {
      input.id = `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Create label based on context
    let labelText = input.name || input.placeholder || input.type;
    
    // Check for nearby text that could be a label
    const previousElement = input.previousElementSibling;
    if (previousElement && previousElement.textContent.trim()) {
      labelText = previousElement.textContent.trim();
    }
    
    // Add aria-label
    input.setAttribute('aria-label', labelText);
    
    return {
      fixed: true,
      message: `Added aria-label: "${labelText}"`
    };
  }

  /**
   * Fix color contrast
   */
  fixColorContrast(violation) {
    const element = violation.element;
    
    // Add high contrast class
    element.classList.add('high-contrast');
    
    return {
      fixed: true,
      message: 'Applied high contrast styling'
    };
  }

  /**
   * Fix focus indicators
   */
  fixFocusIndicators(violation) {
    const element = violation.element;
    
    // Add focus-visible class
    element.classList.add('focus-visible-enhanced');
    
    return {
      fixed: true,
      message: 'Enhanced focus indicator added'
    };
  }

  /**
   * Fix heading structure
   */
  fixHeadingStructure(violation) {
    // This would require more complex logic to restructure headings
    return {
      fixed: false,
      message: 'Heading structure requires manual review'
    };
  }

  /**
   * Fix landmarks
   */
  fixLandmarks(violation) {
    const container = violation.element;
    
    // Add main landmark if missing
    if (!container.querySelector('[role="main"], main')) {
      const mainContent = container.querySelector('.slide-content, .main-content, .content');
      if (mainContent) {
        mainContent.setAttribute('role', 'main');
      }
    }
    
    return {
      fixed: true,
      message: 'Added main landmark'
    };
  }

  /**
   * Fix keyboard accessibility
   */
  fixKeyboardAccessibility(violation) {
    const element = violation.element;
    
    // Add tabindex and role
    element.setAttribute('tabindex', '0');
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'button');
    }
    
    // Add keyboard event listeners
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
    
    return {
      fixed: true,
      message: 'Added keyboard accessibility'
    };
  }

  /**
   * Fix ARIA attributes
   */
  fixAriaAttributes(violation) {
    // This would require creating the referenced elements
    return {
      fixed: false,
      message: 'ARIA references require manual review'
    };
  }

  /**
   * Check element accessibility when added to DOM
   */
  checkElementAccessibility(element) {
    // Quick check for common issues
    if (element.tagName === 'IMG' && !element.hasAttribute('alt')) {
      this.violations.push({
        id: this.generateViolationId(),
        rule: 'Missing Alt Text',
        level: 'error',
        element: element,
        message: 'Dynamically added image missing alt text',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Utility methods
   */
  parseColor(colorString) {
    // Simple RGB parser (would need more robust implementation)
    const match = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
    return null;
  }

  calculateContrast(color1, color2) {
    // WCAG contrast calculation
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  getLuminance(color) {
    // WCAG luminance calculation
    const { r, g, b } = color;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  generateViolationId() {
    return `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Fix violation by ID
   */
  fixViolation(violationId) {
    const violation = [...this.violations, ...this.warnings, ...this.suggestions]
      .find(v => v.id === violationId);
    
    if (violation && violation.fix) {
      const result = violation.fix(violation);
      
      if (result.fixed) {
        // Remove from violations list
        this.violations = this.violations.filter(v => v.id !== violationId);
        this.warnings = this.warnings.filter(v => v.id !== violationId);
        this.suggestions = this.suggestions.filter(v => v.id !== violationId);
        
        this.eventBus.emit('accessibility:violationFixed', {
          violationId: violationId,
          result: result
        });
      }
      
      return result;
    }
    
    return { fixed: false, message: 'Violation not found or cannot be fixed automatically' };
  }

  /**
   * Get all violations
   */
  getViolations() {
    return {
      summary: {
        errors: this.violations.length,
        warnings: this.warnings.length,
        suggestions: this.suggestions.length,
        total: this.violations.length + this.warnings.length + this.suggestions.length
      },
      violations: this.violations,
      warnings: this.warnings,
      suggestions: this.suggestions
    };
  }

  /**
   * Generate accessibility report
   */
  generateReport() {
    const violations = this.getViolations();
    
    return {
      timestamp: new Date().toISOString(),
      summary: violations.summary,
      wcagLevel: 'AA',
      issues: {
        critical: violations.violations.filter(v => v.level === 'error'),
        moderate: violations.warnings,
        minor: violations.suggestions
      },
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.violations.length > 0) {
      recommendations.push('Address critical accessibility violations immediately');
    }
    
    if (this.warnings.length > 0) {
      recommendations.push('Review and fix accessibility warnings for better user experience');
    }
    
    recommendations.push('Implement automated accessibility testing in your development workflow');
    recommendations.push('Conduct regular accessibility audits with real users');
    
    return recommendations;
  }

  /**
   * Destroy accessibility checker
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.violations = [];
    this.warnings = [];
    this.suggestions = [];
    this.rules.clear();
    
    // Clear event listeners
    this.eventBus.off('accessibility:check');
    this.eventBus.off('accessibility:getViolations');
    this.eventBus.off('accessibility:fixViolation');
    
    console.log('✅ Accessibility Checker destroyed');
  }
}
