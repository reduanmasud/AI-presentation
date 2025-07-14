// Base Slide Component
// Abstract base class for all slide types

export class BaseSlide {
  constructor(slideData, eventBus) {
    this.slideData = slideData;
    this.eventBus = eventBus;
    this.element = null;
    this.isRendered = false;
    this.isVisible = false;
    this.animations = [];
    
    this.validateSlideData();
  }

  /**
   * Validate slide data structure
   */
  validateSlideData() {
    const required = ['id', 'type', 'slideNumber', 'title'];
    const missing = required.filter(field => !this.slideData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required slide data fields: ${missing.join(', ')}`);
    }
  }

  /**
   * Render the slide element
   * This method should be overridden by subclasses
   */
  render() {
    if (this.isRendered) {
      return this.element;
    }

    this.element = this.createElement();
    this.setupEventListeners();
    this.isRendered = true;
    
    return this.element;
  }

  /**
   * Create the main slide element
   * This method should be overridden by subclasses
   */
  createElement() {
    const slide = document.createElement('div');
    slide.className = `slide ${this.slideData.type}-slide`;
    slide.setAttribute('data-slide', this.slideData.slideNumber);
    slide.setAttribute('data-slide-id', this.slideData.id);
    slide.setAttribute('data-slide-type', this.slideData.type);
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-labelledby', `slide-title-${this.slideData.id}`);
    
    const content = document.createElement('div');
    content.className = 'slide-content';
    
    // Add basic slide structure
    content.appendChild(this.createTitle());
    content.appendChild(this.createMainContent());
    
    slide.appendChild(content);
    return slide;
  }

  /**
   * Create slide title element
   */
  createTitle() {
    const titleContainer = document.createElement('div');
    titleContainer.className = 'slide-title-container';
    
    const title = document.createElement('h1');
    title.className = 'slide-title';
    title.id = `slide-title-${this.slideData.id}`;
    title.textContent = this.slideData.title;
    
    titleContainer.appendChild(title);
    
    // Add subtitle if present
    if (this.slideData.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'slide-subtitle';
      subtitle.textContent = this.slideData.subtitle;
      titleContainer.appendChild(subtitle);
    }
    
    return titleContainer;
  }

  /**
   * Create main content area
   * This method should be overridden by subclasses
   */
  createMainContent() {
    const content = document.createElement('div');
    content.className = 'slide-main-content';
    
    // Default content - subclasses should override this
    const placeholder = document.createElement('p');
    placeholder.textContent = 'Content will be rendered by specific slide component';
    placeholder.className = 'slide-placeholder';
    content.appendChild(placeholder);
    
    return content;
  }

  /**
   * Set up event listeners for the slide
   */
  setupEventListeners() {
    if (!this.element) return;

    // Listen for slide activation
    this.eventBus.on('slide:activate', (data) => {
      if (data.slideId === this.slideData.id) {
        this.activate();
      }
    });

    // Listen for slide deactivation
    this.eventBus.on('slide:deactivate', (data) => {
      if (data.slideId === this.slideData.id) {
        this.deactivate();
      }
    });

    // Add click handlers for interactive elements
    this.setupInteractiveElements();
  }

  /**
   * Set up interactive elements
   * Can be overridden by subclasses for specific interactions
   */
  setupInteractiveElements() {
    // Default implementation - subclasses can override
    const interactiveElements = this.element.querySelectorAll('[data-action]');
    
    interactiveElements.forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const action = element.getAttribute('data-action');
        const target = element.getAttribute('data-target');
        
        this.handleInteraction(action, target, element);
      });
    });
  }

  /**
   * Handle interactive element clicks
   */
  handleInteraction(action, target, element) {
    switch (action) {
      case 'navigate':
        this.eventBus.emit('navigation:goToSlide', { slideId: target });
        break;
      case 'toggle':
        this.toggleElement(target);
        break;
      case 'reveal':
        this.revealElement(target);
        break;
      default:
        console.warn(`Unknown interaction action: ${action}`);
    }
  }

  /**
   * Toggle element visibility
   */
  toggleElement(selector) {
    const element = this.element.querySelector(selector);
    if (element) {
      element.classList.toggle('hidden');
      element.classList.toggle('visible');
    }
  }

  /**
   * Reveal element with animation
   */
  revealElement(selector) {
    const element = this.element.querySelector(selector);
    if (element) {
      element.classList.add('revealed');
      element.classList.remove('hidden');
    }
  }

  /**
   * Activate the slide (when it becomes visible)
   */
  activate() {
    if (!this.element) return;
    
    this.isVisible = true;
    this.element.classList.add('active');
    this.element.setAttribute('aria-hidden', 'false');
    
    // Start animations
    this.startAnimations();
    
    // Emit activation event
    this.eventBus.emit('slide:activated', {
      slideId: this.slideData.id,
      slideNumber: this.slideData.slideNumber,
      slideType: this.slideData.type
    });
  }

  /**
   * Deactivate the slide (when it becomes hidden)
   */
  deactivate() {
    if (!this.element) return;
    
    this.isVisible = false;
    this.element.classList.remove('active');
    this.element.setAttribute('aria-hidden', 'true');
    
    // Stop animations
    this.stopAnimations();
    
    // Emit deactivation event
    this.eventBus.emit('slide:deactivated', {
      slideId: this.slideData.id,
      slideNumber: this.slideData.slideNumber,
      slideType: this.slideData.type
    });
  }

  /**
   * Start slide animations
   * Can be overridden by subclasses for specific animations
   */
  startAnimations() {
    // Default fade-in animation
    const animatedElements = this.element.querySelectorAll('.animate-on-enter');
    
    animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animated');
      }, index * 100);
    });
  }

  /**
   * Stop slide animations
   */
  stopAnimations() {
    // Clear any running animations
    this.animations.forEach(animation => {
      if (animation.cancel) {
        animation.cancel();
      }
    });
    this.animations = [];
  }

  /**
   * Update slide data
   */
  updateData(newData) {
    this.slideData = { ...this.slideData, ...newData };
    this.validateSlideData();
    
    if (this.isRendered) {
      this.refresh();
    }
  }

  /**
   * Refresh the slide content
   */
  refresh() {
    if (!this.element) return;
    
    // Update title
    const title = this.element.querySelector('.slide-title');
    if (title) {
      title.textContent = this.slideData.title;
    }
    
    // Update subtitle
    const subtitle = this.element.querySelector('.slide-subtitle');
    if (subtitle) {
      if (this.slideData.subtitle) {
        subtitle.textContent = this.slideData.subtitle;
        subtitle.style.display = '';
      } else {
        subtitle.style.display = 'none';
      }
    }
    
    // Emit refresh event
    this.eventBus.emit('slide:refreshed', {
      slideId: this.slideData.id,
      slideNumber: this.slideData.slideNumber
    });
  }

  /**
   * Destroy the slide component
   */
  destroy() {
    this.stopAnimations();
    
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    this.element = null;
    this.isRendered = false;
    this.isVisible = false;
    
    // Emit destruction event
    this.eventBus.emit('slide:destroyed', {
      slideId: this.slideData.id,
      slideNumber: this.slideData.slideNumber
    });
  }

  /**
   * Get slide data
   */
  getData() {
    return { ...this.slideData };
  }

  /**
   * Get slide element
   */
  getElement() {
    return this.element;
  }

  /**
   * Check if slide is rendered
   */
  isSlideRendered() {
    return this.isRendered;
  }

  /**
   * Check if slide is visible
   */
  isSlideVisible() {
    return this.isVisible;
  }

  /**
   * Get slide type
   */
  getType() {
    return this.slideData.type;
  }

  /**
   * Get slide ID
   */
  getId() {
    return this.slideData.id;
  }

  /**
   * Get slide number
   */
  getSlideNumber() {
    return this.slideData.slideNumber;
  }
}
