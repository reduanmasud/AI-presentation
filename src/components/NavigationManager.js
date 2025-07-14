// Navigation Manager
// This class handles all navigation controls and interactions

import { presentationConfig } from '../data/config.js';

export class NavigationManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.config = presentationConfig.navigation;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.minSwipeDistance = 50;
    this.navigationHistory = [];
    this.historyIndex = -1;
    this.currentSlide = 1;
    this.totalSlides = 0;
    this.isOverviewMode = false;
    this.shortcuts = new Map();
    this.liveRegion = null;

    this.init();
  }

  /**
   * Initialize navigation manager
   */
  init() {
    this.bindEvents();
    this.setupKeyboardNavigation();
    this.setupTouchNavigation();
    this.setupMouseNavigation();
    this.setupIndicators();
    this.setupAccessibility();
    this.setupAdvancedShortcuts();
    this.setupNavigationHistory();
    this.setupOverviewMode();
    this.createNavigationUI();

    console.log('✅ Navigation Manager initialized with advanced features');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Listen for slide changes to update navigation state
    this.eventBus.on('slide:transitionComplete', (data) => this.updateNavigationState(data));
    
    // Listen for navigation state requests
    this.eventBus.on('navigation:updateState', () => this.updateNavigationState());
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    if (!this.config.enableKeyboard) return;

    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  /**
   * Setup touch/swipe navigation
   */
  setupTouchNavigation() {
    if (!this.config.enableTouch) return;

    const container = document.querySelector('.slider-container');
    if (!container) return;

    container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
  }

  /**
   * Setup mouse navigation
   */
  setupMouseNavigation() {
    if (!this.config.enableMouse) return;

    // Navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousSlide());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Mouse wheel navigation (optional)
    if (this.config.enableMouseWheel) {
      document.addEventListener('wheel', (e) => this.handleMouseWheel(e), { passive: false });
    }
  }

  /**
   * Setup slide indicators
   */
  setupIndicators() {
    if (!this.config.enableIndicators) return;

    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index + 1));
    });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(e) {
    // Prevent navigation when user is typing in input fields
    if (this.isInputFocused()) return;

    const keyData = {
      key: e.key,
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey
    };

    // Emit keyboard event for other components to handle
    this.eventBus.emit('keyboard:navigation', keyData);

    // Check for advanced shortcuts first
    const shortcutKey = this.getShortcutKey(e);
    if (this.shortcuts.has(shortcutKey)) {
      e.preventDefault();
      this.shortcuts.get(shortcutKey)(e);
      return;
    }

    // Handle basic navigation keys
    switch (e.key) {
      case 'ArrowRight':
      case 'Space':
        if (!e.ctrlKey && !e.altKey) {
          e.preventDefault();
          this.nextSlide();
        }
        break;
      case 'ArrowLeft':
        if (!e.ctrlKey && !e.altKey) {
          e.preventDefault();
          this.previousSlide();
        }
        break;
      case 'ArrowUp':
        if (e.ctrlKey) {
          e.preventDefault();
          this.navigateToSection('up');
        }
        break;
      case 'ArrowDown':
        if (e.ctrlKey) {
          e.preventDefault();
          this.navigateToSection('down');
        }
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        this.goToLastSlide();
        break;
      case 'Escape':
        e.preventDefault();
        this.handleEscape();
        break;
      case 'PageUp':
        e.preventDefault();
        this.goToPreviousSection();
        break;
      case 'PageDown':
        e.preventDefault();
        this.goToNextSection();
        break;
      default:
        // Handle number keys for direct navigation
        if (/^[1-9]$/.test(e.key) && !e.ctrlKey && !e.altKey) {
          const slideNumber = parseInt(e.key);
          this.goToSlide(slideNumber);
        }
    }
  }

  /**
   * Handle touch start
   */
  handleTouchStart(e) {
    if (e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }
  }

  /**
   * Handle touch end (swipe detection)
   */
  handleTouchEnd(e) {
    if (e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;
      
      // Check if it's a horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right - previous slide
          this.previousSlide();
        } else {
          // Swipe left - next slide
          this.nextSlide();
        }
      }
    }
  }

  /**
   * Handle mouse wheel navigation
   */
  handleMouseWheel(e) {
    // Debounce wheel events
    if (this.wheelTimeout) return;
    
    this.wheelTimeout = setTimeout(() => {
      this.wheelTimeout = null;
    }, 300);

    if (e.deltaY > 0) {
      this.nextSlide();
    } else if (e.deltaY < 0) {
      this.previousSlide();
    }
    
    e.preventDefault();
  }

  /**
   * Navigate to next slide
   */
  nextSlide() {
    this.eventBus.emit('navigation:next');
  }

  /**
   * Navigate to previous slide
   */
  previousSlide() {
    this.eventBus.emit('navigation:previous');
  }

  /**
   * Navigate to specific slide
   */
  goToSlide(slideNumber) {
    this.eventBus.emit('navigation:goTo', { slideNumber });
  }

  /**
   * Navigate to last slide
   */
  goToLastSlide() {
    this.eventBus.emit('navigation:goToLast');
  }

  /**
   * Update navigation state
   */
  updateNavigationState(data = null) {
    if (data) {
      this.updateIndicators(data.currentSlide);
      this.updateNavigationButtons(data.currentSlide);
    }
  }

  /**
   * Update slide indicators
   */
  updateIndicators(currentSlide) {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      if (index + 1 === currentSlide) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('active');
        indicator.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Update navigation button states
   */
  updateNavigationButtons(currentSlide) {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
      const isFirstSlide = currentSlide === 1;
      prevBtn.disabled = isFirstSlide;
      prevBtn.classList.toggle('disabled', isFirstSlide);
      prevBtn.setAttribute('aria-disabled', isFirstSlide.toString());
    }

    if (nextBtn) {
      // Get total slides from slide manager
      this.eventBus.emit('slideManager:getTotalSlides', (totalSlides) => {
        const isLastSlide = currentSlide === totalSlides;
        nextBtn.disabled = isLastSlide;
        nextBtn.classList.toggle('disabled', isLastSlide);
        nextBtn.setAttribute('aria-disabled', isLastSlide.toString());
      });
    }
  }

  /**
   * Check if an input field is focused
   */
  isInputFocused() {
    const activeElement = document.activeElement;
    const inputTypes = ['input', 'textarea', 'select'];
    return inputTypes.includes(activeElement.tagName.toLowerCase()) ||
           activeElement.contentEditable === 'true';
  }

  /**
   * Enable navigation
   */
  enable() {
    this.config.enableKeyboard = true;
    this.config.enableMouse = true;
    this.config.enableTouch = true;
    this.eventBus.emit('navigation:enabled');
  }

  /**
   * Disable navigation
   */
  disable() {
    this.config.enableKeyboard = false;
    this.config.enableMouse = false;
    this.config.enableTouch = false;
    this.eventBus.emit('navigation:disabled');
  }

  /**
   * Toggle navigation state
   */
  toggle() {
    if (this.config.enableKeyboard || this.config.enableMouse || this.config.enableTouch) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Get navigation configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Update navigation configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

    // Re-initialize with new config
    this.init();

    this.eventBus.emit('navigation:configUpdated', this.config);
  }

  /**
   * Set up accessibility features
   */
  setupAccessibility() {
    // Create ARIA live region for announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    this.liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(this.liveRegion);

    // Set up focus management
    this.setupFocusManagement();

    // Add skip links
    this.createSkipLinks();
  }

  /**
   * Set up advanced keyboard shortcuts
   */
  setupAdvancedShortcuts() {
    // Navigation shortcuts
    this.shortcuts.set('ctrl+g', () => this.showGoToDialog());
    this.shortcuts.set('ctrl+h', () => this.showNavigationHistory());
    this.shortcuts.set('ctrl+o', () => this.toggleOverviewMode());
    this.shortcuts.set('ctrl+b', () => this.toggleBookmarks());
    this.shortcuts.set('ctrl+f', () => this.toggleFullscreen());
    this.shortcuts.set('ctrl+s', () => this.showSearch());
    this.shortcuts.set('ctrl+/', () => this.showKeyboardHelp());

    // History navigation
    this.shortcuts.set('alt+ArrowLeft', () => this.goBackInHistory());
    this.shortcuts.set('alt+ArrowRight', () => this.goForwardInHistory());

    // Quick navigation
    this.shortcuts.set('ctrl+1', () => this.goToSlideType('title'));
    this.shortcuts.set('ctrl+2', () => this.goToSlideType('agenda'));
    this.shortcuts.set('ctrl+3', () => this.goToSlideType('conclusion'));
  }

  /**
   * Set up navigation history
   */
  setupNavigationHistory() {
    this.eventBus.on('navigation:slideChanged', (data) => {
      this.addToHistory(data.slideNumber);
      this.currentSlide = data.slideNumber;
    });

    this.eventBus.on('slideManager:totalSlidesChanged', (data) => {
      this.totalSlides = data.totalSlides;
    });
  }

  /**
   * Set up overview mode
   */
  setupOverviewMode() {
    this.eventBus.on('navigation:toggleOverview', () => {
      this.toggleOverviewMode();
    });
  }

  /**
   * Create navigation UI elements
   */
  createNavigationUI() {
    this.createBreadcrumbs();
    this.createProgressIndicator();
    this.createNavigationPanel();
  }

  /**
   * Get shortcut key string
   */
  getShortcutKey(e) {
    const parts = [];
    if (e.ctrlKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    if (e.metaKey) parts.push('meta');
    parts.push(e.key);
    return parts.join('+');
  }

  /**
   * Handle escape key
   */
  handleEscape() {
    if (this.isOverviewMode) {
      this.toggleOverviewMode();
    } else {
      this.eventBus.emit('navigation:escape');
    }
  }

  /**
   * Navigate to section
   */
  navigateToSection(direction) {
    this.eventBus.emit('navigation:sectionNavigation', { direction });
  }

  /**
   * Go to previous section
   */
  goToPreviousSection() {
    this.eventBus.emit('navigation:previousSection');
  }

  /**
   * Go to next section
   */
  goToNextSection() {
    this.eventBus.emit('navigation:nextSection');
  }

  /**
   * Add slide to navigation history
   */
  addToHistory(slideNumber) {
    // Don't add if it's the same as current
    if (this.navigationHistory[this.historyIndex] === slideNumber) {
      return;
    }

    // Remove any history after current index
    this.navigationHistory = this.navigationHistory.slice(0, this.historyIndex + 1);

    // Add new slide
    this.navigationHistory.push(slideNumber);
    this.historyIndex = this.navigationHistory.length - 1;

    // Limit history size
    if (this.navigationHistory.length > 50) {
      this.navigationHistory.shift();
      this.historyIndex--;
    }
  }

  /**
   * Go back in navigation history
   */
  goBackInHistory() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const slideNumber = this.navigationHistory[this.historyIndex];
      this.goToSlide(slideNumber);
      this.announceSlideChange(slideNumber, 'Navigated back to');
    }
  }

  /**
   * Go forward in navigation history
   */
  goForwardInHistory() {
    if (this.historyIndex < this.navigationHistory.length - 1) {
      this.historyIndex++;
      const slideNumber = this.navigationHistory[this.historyIndex];
      this.goToSlide(slideNumber);
      this.announceSlideChange(slideNumber, 'Navigated forward to');
    }
  }

  /**
   * Show go-to dialog
   */
  showGoToDialog() {
    const slideNumber = prompt(`Go to slide (1-${this.totalSlides}):`);
    if (slideNumber && !isNaN(slideNumber)) {
      const num = parseInt(slideNumber);
      if (num >= 1 && num <= this.totalSlides) {
        this.goToSlide(num);
      }
    }
  }

  /**
   * Show navigation history
   */
  showNavigationHistory() {
    this.eventBus.emit('navigation:showHistory', {
      history: this.navigationHistory,
      currentIndex: this.historyIndex
    });
  }

  /**
   * Toggle overview mode
   */
  toggleOverviewMode() {
    this.isOverviewMode = !this.isOverviewMode;

    if (this.isOverviewMode) {
      document.body.classList.add('overview-mode');
      this.announceToScreenReader('Overview mode enabled. Use arrow keys to navigate, Enter to select, Escape to exit.');
    } else {
      document.body.classList.remove('overview-mode');
      this.announceToScreenReader('Overview mode disabled.');
    }

    this.eventBus.emit('navigation:overviewModeChanged', {
      isOverviewMode: this.isOverviewMode
    });
  }

  /**
   * Toggle bookmarks
   */
  toggleBookmarks() {
    this.eventBus.emit('bookmarks:toggle');
  }

  /**
   * Toggle fullscreen
   */
  toggleFullscreen() {
    this.eventBus.emit('fullscreen:toggle');
  }

  /**
   * Show search
   */
  showSearch() {
    this.eventBus.emit('search:show');
  }

  /**
   * Show keyboard help
   */
  showKeyboardHelp() {
    this.eventBus.emit('navigation:showKeyboardHelp');
  }

  /**
   * Go to slide by type
   */
  goToSlideType(type) {
    this.eventBus.emit('navigation:goToSlideType', { type });
  }

  /**
   * Set up focus management
   */
  setupFocusManagement() {
    // Trap focus in overview mode
    document.addEventListener('keydown', (e) => {
      if (this.isOverviewMode && e.key === 'Tab') {
        this.handleFocusTrap(e);
      }
    });
  }

  /**
   * Handle focus trap in overview mode
   */
  handleFocusTrap(e) {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Create skip links
   */
  createSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#slide-content" class="skip-link">Skip to slide content</a>
    `;
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  /**
   * Create breadcrumbs
   */
  createBreadcrumbs() {
    const breadcrumbs = document.createElement('nav');
    breadcrumbs.className = 'breadcrumbs';
    breadcrumbs.setAttribute('aria-label', 'Breadcrumb navigation');
    breadcrumbs.innerHTML = `
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <a href="#" class="breadcrumb-link" data-slide="1">Start</a>
        </li>
        <li class="breadcrumb-item current" aria-current="page">
          <span class="breadcrumb-current">Current Slide</span>
        </li>
      </ol>
    `;

    const header = document.querySelector('.presentation-header');
    if (header) {
      header.appendChild(breadcrumbs);
    }
  }

  /**
   * Create progress indicator
   */
  createProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'navigation-progress';
    progressContainer.innerHTML = `
      <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-text">
        <span class="current-slide">1</span> / <span class="total-slides">${this.totalSlides}</span>
      </div>
    `;

    const header = document.querySelector('.presentation-header');
    if (header) {
      header.appendChild(progressContainer);
    }
  }

  /**
   * Create navigation panel
   */
  createNavigationPanel() {
    const panel = document.createElement('div');
    panel.className = 'navigation-panel';
    panel.innerHTML = `
      <button class="nav-btn history-btn" title="Navigation History (Ctrl+H)">
        <i class="fas fa-history"></i>
      </button>
      <button class="nav-btn overview-btn" title="Overview Mode (Ctrl+O)">
        <i class="fas fa-th"></i>
      </button>
      <button class="nav-btn goto-btn" title="Go to Slide (Ctrl+G)">
        <i class="fas fa-search"></i>
      </button>
      <button class="nav-btn help-btn" title="Keyboard Help (Ctrl+/)">
        <i class="fas fa-question"></i>
      </button>
    `;

    // Add event listeners
    panel.querySelector('.history-btn').addEventListener('click', () => this.showNavigationHistory());
    panel.querySelector('.overview-btn').addEventListener('click', () => this.toggleOverviewMode());
    panel.querySelector('.goto-btn').addEventListener('click', () => this.showGoToDialog());
    panel.querySelector('.help-btn').addEventListener('click', () => this.showKeyboardHelp());

    const header = document.querySelector('.presentation-header');
    if (header) {
      header.appendChild(panel);
    }
  }

  /**
   * Announce slide change to screen readers
   */
  announceSlideChange(slideNumber, prefix = 'Navigated to') {
    if (this.liveRegion) {
      this.liveRegion.textContent = `${prefix} slide ${slideNumber} of ${this.totalSlides}`;
    }
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
    }
  }

  /**
   * Update progress indicators
   */
  updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const currentSlideSpan = document.querySelector('.current-slide');

    if (progressBar && progressFill && currentSlideSpan) {
      const progress = (this.currentSlide / this.totalSlides) * 100;
      progressFill.style.width = `${progress}%`;
      progressBar.setAttribute('aria-valuenow', progress.toString());
      currentSlideSpan.textContent = this.currentSlide.toString();
    }
  }

  /**
   * Update breadcrumbs
   */
  updateBreadcrumbs(slideData) {
    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    if (breadcrumbCurrent && slideData) {
      breadcrumbCurrent.textContent = slideData.title || `Slide ${this.currentSlide}`;
    }
  }

  /**
   * Get navigation statistics
   */
  getNavigationStats() {
    return {
      currentSlide: this.currentSlide,
      totalSlides: this.totalSlides,
      historyLength: this.navigationHistory.length,
      historyIndex: this.historyIndex,
      isOverviewMode: this.isOverviewMode,
      shortcuts: this.shortcuts.size
    };
  }
}

/**
 * Table of Contents Navigation Component
 */
export class TOCNavigation {
  constructor(eventBus, slidesData) {
    this.eventBus = eventBus;
    this.slidesData = slidesData;
    this.isVisible = false;
    
    this.init();
  }

  /**
   * Initialize TOC navigation
   */
  init() {
    this.createTOC();
    this.bindEvents();
  }

  /**
   * Create table of contents
   */
  createTOC() {
    const tocContainer = document.querySelector('.toc-container');
    if (!tocContainer) return;

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    this.slidesData.forEach(slide => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      
      link.href = '#';
      link.textContent = slide.title;
      link.dataset.slideId = slide.id;
      link.dataset.slideNumber = slide.slideNumber;
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToSlide(slide.slideNumber);
      });
      
      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    tocContainer.appendChild(tocList);
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Listen for slide changes to update TOC
    this.eventBus.on('slide:transitionComplete', (data) => this.updateTOC(data.currentSlide));
    
    // Listen for TOC toggle requests
    this.eventBus.on('toc:toggle', () => this.toggle());
    this.eventBus.on('toc:show', () => this.show());
    this.eventBus.on('toc:hide', () => this.hide());
  }

  /**
   * Navigate to slide from TOC
   */
  navigateToSlide(slideNumber) {
    this.eventBus.emit('navigation:goTo', { slideNumber });
    this.hide(); // Hide TOC after navigation
  }

  /**
   * Update TOC active state
   */
  updateTOC(currentSlide) {
    const tocLinks = document.querySelectorAll('.toc-list a');
    tocLinks.forEach(link => {
      if (parseInt(link.dataset.slideNumber) === currentSlide) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Show TOC
   */
  show() {
    const tocContainer = document.querySelector('.toc-container');
    if (tocContainer) {
      tocContainer.classList.add('visible');
      this.isVisible = true;
      this.eventBus.emit('toc:shown');
    }
  }

  /**
   * Hide TOC
   */
  hide() {
    const tocContainer = document.querySelector('.toc-container');
    if (tocContainer) {
      tocContainer.classList.remove('visible');
      this.isVisible = false;
      this.eventBus.emit('toc:hidden');
    }
  }

  /**
   * Toggle TOC visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}
