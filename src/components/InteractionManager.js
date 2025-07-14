// Interaction Manager
// Manages advanced interactions across all slide components

export class InteractionManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.activeInteractions = new Map();
    this.keyboardHandlers = new Map();
    this.touchHandlers = new Map();
    this.hoverTimers = new Map();
    this.expandedElements = new Set();
    this.focusedElement = null;
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize the interaction manager
   */
  init() {
    this.setupGlobalEventListeners();
    this.setupKeyboardNavigation();
    this.setupTouchGestures();
    this.setupAccessibilityFeatures();
    this.isInitialized = true;
    
    console.log('✅ Interaction Manager initialized');
  }

  /**
   * Set up global event listeners
   */
  setupGlobalEventListeners() {
    // Listen for slide changes to reset interactions
    this.eventBus.on('navigation:slideChanged', (data) => {
      this.resetInteractions();
      this.setupSlideInteractions(data.slideId);
    });

    // Listen for interaction requests
    this.eventBus.on('interaction:enable', (data) => {
      this.enableInteraction(data.elementId, data.type, data.options);
    });

    this.eventBus.on('interaction:disable', (data) => {
      this.disableInteraction(data.elementId);
    });

    // Listen for expand/collapse requests
    this.eventBus.on('interaction:expand', (data) => {
      this.expandElement(data.elementId, data.options);
    });

    this.eventBus.on('interaction:collapse', (data) => {
      this.collapseElement(data.elementId, data.options);
    });

    // Listen for progressive disclosure requests
    this.eventBus.on('interaction:reveal', (data) => {
      this.revealContent(data.elementId, data.sequence);
    });
  }

  /**
   * Set up keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Register common keyboard shortcuts
    this.registerKeyboardShortcut('Tab', this.handleTabNavigation.bind(this));
    this.registerKeyboardShortcut('Enter', this.handleEnterKey.bind(this));
    this.registerKeyboardShortcut(' ', this.handleSpaceKey.bind(this));
    this.registerKeyboardShortcut('Escape', this.handleEscapeKey.bind(this));
    this.registerKeyboardShortcut('ArrowUp', this.handleArrowUp.bind(this));
    this.registerKeyboardShortcut('ArrowDown', this.handleArrowDown.bind(this));
    this.registerKeyboardShortcut('ArrowLeft', this.handleArrowLeft.bind(this));
    this.registerKeyboardShortcut('ArrowRight', this.handleArrowRight.bind(this));
  }

  /**
   * Set up touch gestures
   */
  setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = touchEndTime - touchStartTime;
      
      this.handleTouchGesture(deltaX, deltaY, deltaTime, e);
    });
  }

  /**
   * Set up accessibility features
   */
  setupAccessibilityFeatures() {
    // Ensure all interactive elements have proper ARIA attributes
    this.eventBus.on('template:slideRendered', (data) => {
      this.enhanceAccessibility(data.slideId);
    });

    // Handle focus management
    document.addEventListener('focusin', (e) => {
      this.handleFocusChange(e.target);
    });

    document.addEventListener('focusout', (e) => {
      this.handleFocusLoss(e.target);
    });
  }

  /**
   * Set up interactions for a specific slide
   */
  setupSlideInteractions(slideId) {
    const slideElement = document.querySelector(`[data-slide-id="${slideId}"]`);
    if (!slideElement) return;

    // Set up click-to-expand interactions
    this.setupClickToExpand(slideElement);
    
    // Set up hover effects
    this.setupHoverEffects(slideElement);
    
    // Set up progressive disclosure
    this.setupProgressiveDisclosure(slideElement);
    
    // Set up drag and drop if needed
    this.setupDragAndDrop(slideElement);
  }

  /**
   * Set up click-to-expand functionality
   */
  setupClickToExpand(container) {
    const expandableElements = container.querySelectorAll('[data-expandable]');
    
    expandableElements.forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleExpansion(element);
      });

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleExpansion(element);
        }
      });

      // Ensure proper ARIA attributes
      if (!element.hasAttribute('aria-expanded')) {
        element.setAttribute('aria-expanded', 'false');
      }
      if (!element.hasAttribute('role')) {
        element.setAttribute('role', 'button');
      }
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    });
  }

  /**
   * Set up hover effects
   */
  setupHoverEffects(container) {
    const hoverElements = container.querySelectorAll('[data-hover]');
    
    hoverElements.forEach(element => {
      const hoverType = element.getAttribute('data-hover');
      const delay = parseInt(element.getAttribute('data-hover-delay')) || 300;
      
      element.addEventListener('mouseenter', () => {
        this.startHoverEffect(element, hoverType, delay);
      });

      element.addEventListener('mouseleave', () => {
        this.endHoverEffect(element, hoverType);
      });
    });
  }

  /**
   * Set up progressive disclosure
   */
  setupProgressiveDisclosure(container) {
    const disclosureGroups = container.querySelectorAll('[data-progressive]');
    
    disclosureGroups.forEach(group => {
      const sequence = JSON.parse(group.getAttribute('data-progressive') || '[]');
      const trigger = group.querySelector('[data-disclosure-trigger]');
      
      if (trigger) {
        trigger.addEventListener('click', () => {
          this.revealContent(group, sequence);
        });
      }
    });
  }

  /**
   * Set up drag and drop functionality
   */
  setupDragAndDrop(container) {
    const draggableElements = container.querySelectorAll('[data-draggable]');
    const dropZones = container.querySelectorAll('[data-drop-zone]');
    
    draggableElements.forEach(element => {
      element.draggable = true;
      
      element.addEventListener('dragstart', (e) => {
        this.handleDragStart(e, element);
      });

      element.addEventListener('dragend', (e) => {
        this.handleDragEnd(e, element);
      });
    });

    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.handleDragOver(e, zone);
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.handleDrop(e, zone);
      });
    });
  }

  /**
   * Toggle element expansion
   */
  toggleExpansion(element) {
    const isExpanded = this.expandedElements.has(element);
    
    if (isExpanded) {
      this.collapseElement(element);
    } else {
      this.expandElement(element);
    }
  }

  /**
   * Expand an element
   */
  expandElement(element, options = {}) {
    if (this.expandedElements.has(element)) return;
    
    const duration = options.duration || 300;
    const easing = options.easing || 'ease-out';
    
    element.classList.add('expanding');
    element.setAttribute('aria-expanded', 'true');
    
    // Animate expansion
    element.style.transition = `all ${duration}ms ${easing}`;
    
    setTimeout(() => {
      element.classList.remove('expanding');
      element.classList.add('expanded');
      this.expandedElements.add(element);
      
      this.eventBus.emit('interaction:elementExpanded', {
        element: element,
        elementId: element.id || element.getAttribute('data-id')
      });
    }, duration);
  }

  /**
   * Collapse an element
   */
  collapseElement(element, options = {}) {
    if (!this.expandedElements.has(element)) return;
    
    const duration = options.duration || 300;
    const easing = options.easing || 'ease-in';
    
    element.classList.add('collapsing');
    element.classList.remove('expanded');
    element.setAttribute('aria-expanded', 'false');
    
    // Animate collapse
    element.style.transition = `all ${duration}ms ${easing}`;
    
    setTimeout(() => {
      element.classList.remove('collapsing');
      this.expandedElements.delete(element);
      
      this.eventBus.emit('interaction:elementCollapsed', {
        element: element,
        elementId: element.id || element.getAttribute('data-id')
      });
    }, duration);
  }

  /**
   * Start hover effect
   */
  startHoverEffect(element, type, delay) {
    const timerId = setTimeout(() => {
      element.classList.add(`hover-${type}`);
      
      this.eventBus.emit('interaction:hoverStarted', {
        element: element,
        type: type
      });
    }, delay);
    
    this.hoverTimers.set(element, timerId);
  }

  /**
   * End hover effect
   */
  endHoverEffect(element, type) {
    const timerId = this.hoverTimers.get(element);
    if (timerId) {
      clearTimeout(timerId);
      this.hoverTimers.delete(element);
    }
    
    element.classList.remove(`hover-${type}`);
    
    this.eventBus.emit('interaction:hoverEnded', {
      element: element,
      type: type
    });
  }

  /**
   * Reveal content progressively
   */
  revealContent(container, sequence) {
    if (!Array.isArray(sequence)) return;
    
    sequence.forEach((selector, index) => {
      setTimeout(() => {
        const elements = container.querySelectorAll(selector);
        elements.forEach(element => {
          element.classList.add('revealed');
          element.style.animationDelay = `${index * 100}ms`;
        });
      }, index * 200);
    });
    
    this.eventBus.emit('interaction:contentRevealed', {
      container: container,
      sequence: sequence
    });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(e) {
    const handler = this.keyboardHandlers.get(e.key);
    if (handler) {
      handler(e);
    }
  }

  /**
   * Register keyboard shortcut
   */
  registerKeyboardShortcut(key, handler) {
    this.keyboardHandlers.set(key, handler);
  }

  /**
   * Handle Tab navigation
   */
  handleTabNavigation(e) {
    // Enhanced tab navigation logic
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (e.shiftKey) {
      // Shift+Tab - go backwards
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
      focusableElements[prevIndex]?.focus();
    } else {
      // Tab - go forwards
      const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
      focusableElements[nextIndex]?.focus();
    }
    
    e.preventDefault();
  }

  /**
   * Handle Enter key
   */
  handleEnterKey(e) {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.hasAttribute('data-expandable')) {
      this.toggleExpansion(activeElement);
      e.preventDefault();
    }
  }

  /**
   * Handle Space key
   */
  handleSpaceKey(e) {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.hasAttribute('data-expandable')) {
      this.toggleExpansion(activeElement);
      e.preventDefault();
    }
  }

  /**
   * Handle Escape key
   */
  handleEscapeKey(e) {
    // Close any expanded elements
    this.expandedElements.forEach(element => {
      this.collapseElement(element);
    });
    
    // Emit escape event
    this.eventBus.emit('interaction:escapePressed');
  }

  /**
   * Handle Arrow Up
   */
  handleArrowUp(e) {
    this.eventBus.emit('interaction:arrowUp', { originalEvent: e });
  }

  /**
   * Handle Arrow Down
   */
  handleArrowDown(e) {
    this.eventBus.emit('interaction:arrowDown', { originalEvent: e });
  }

  /**
   * Handle Arrow Left
   */
  handleArrowLeft(e) {
    this.eventBus.emit('interaction:arrowLeft', { originalEvent: e });
  }

  /**
   * Handle Arrow Right
   */
  handleArrowRight(e) {
    this.eventBus.emit('interaction:arrowRight', { originalEvent: e });
  }

  /**
   * Get all focusable elements
   */
  getFocusableElements() {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [data-expandable]';
    return Array.from(document.querySelectorAll(selector))
      .filter(element => !element.disabled && element.offsetParent !== null);
  }

  /**
   * Handle focus change
   */
  handleFocusChange(element) {
    this.focusedElement = element;
    
    this.eventBus.emit('interaction:focusChanged', {
      element: element,
      elementId: element.id || element.getAttribute('data-id')
    });
  }

  /**
   * Handle focus loss
   */
  handleFocusLoss(element) {
    this.eventBus.emit('interaction:focusLost', {
      element: element,
      elementId: element.id || element.getAttribute('data-id')
    });
  }

  /**
   * Handle touch gestures
   */
  handleTouchGesture(deltaX, deltaY, deltaTime, event) {
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    
    if (deltaTime > maxSwipeTime) return;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      // Horizontal swipe
      if (deltaX > 0) {
        this.eventBus.emit('interaction:swipeRight', { originalEvent: event });
      } else {
        this.eventBus.emit('interaction:swipeLeft', { originalEvent: event });
      }
    } else if (Math.abs(deltaY) > minSwipeDistance) {
      // Vertical swipe
      if (deltaY > 0) {
        this.eventBus.emit('interaction:swipeDown', { originalEvent: event });
      } else {
        this.eventBus.emit('interaction:swipeUp', { originalEvent: event });
      }
    }
  }

  /**
   * Enhance accessibility for a slide
   */
  enhanceAccessibility(slideId) {
    const slideElement = document.querySelector(`[data-slide-id="${slideId}"]`);
    if (!slideElement) return;
    
    // Add ARIA labels where missing
    const interactiveElements = slideElement.querySelectorAll('button, [role="button"], [data-expandable]');
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        const text = element.textContent.trim() || element.getAttribute('title') || 'Interactive element';
        element.setAttribute('aria-label', text);
      }
    });
    
    // Ensure proper heading hierarchy
    const headings = slideElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${slideId}-${index}`;
      }
    });
  }

  /**
   * Reset all interactions
   */
  resetInteractions() {
    // Clear all timers
    this.hoverTimers.forEach(timerId => clearTimeout(timerId));
    this.hoverTimers.clear();
    
    // Collapse all expanded elements
    this.expandedElements.forEach(element => {
      element.classList.remove('expanded', 'expanding', 'collapsing');
      element.setAttribute('aria-expanded', 'false');
    });
    this.expandedElements.clear();
    
    // Clear active interactions
    this.activeInteractions.clear();
  }

  /**
   * Enable specific interaction
   */
  enableInteraction(elementId, type, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    this.activeInteractions.set(elementId, { type, options, element });
    
    switch (type) {
      case 'expandable':
        this.setupClickToExpand(element.parentElement);
        break;
      case 'hover':
        this.setupHoverEffects(element.parentElement);
        break;
      case 'progressive':
        this.setupProgressiveDisclosure(element.parentElement);
        break;
    }
  }

  /**
   * Disable specific interaction
   */
  disableInteraction(elementId) {
    this.activeInteractions.delete(elementId);
  }

  /**
   * Get interaction statistics
   */
  getStats() {
    return {
      activeInteractions: this.activeInteractions.size,
      expandedElements: this.expandedElements.size,
      hoverTimers: this.hoverTimers.size,
      keyboardHandlers: this.keyboardHandlers.size,
      focusedElement: this.focusedElement?.id || null,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Destroy the interaction manager
   */
  destroy() {
    this.resetInteractions();
    this.keyboardHandlers.clear();
    this.touchHandlers.clear();
    this.eventBus.clear('interaction:*');
    this.isInitialized = false;
  }
}
