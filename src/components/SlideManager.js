// Core Slide Manager
// This class handles slide navigation and state management

import { slidesData } from '../data/slides.js';
import { presentationConfig } from '../data/config.js';

export class SlideManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.currentSlide = presentationConfig.startSlide || 1;
    this.totalSlides = slidesData.length;
    this.slidesData = slidesData;
    this.isTransitioning = false;
    
    this.init();
  }

  /**
   * Initialize the slide manager
   */
  init() {
    this.validateSlideData();
    this.setupInitialState();
    this.bindEvents();
    this.updateUI();
    
    // Emit initialization complete event
    this.eventBus.emit('slideManager:initialized', {
      currentSlide: this.currentSlide,
      totalSlides: this.totalSlides
    });
  }

  /**
   * Validate slide data integrity
   */
  validateSlideData() {
    if (!Array.isArray(this.slidesData) || this.slidesData.length === 0) {
      throw new Error('Invalid slide data: slides must be a non-empty array');
    }
    
    // Verify slide numbers are sequential
    const slideNumbers = this.slidesData.map(slide => slide.slideNumber).sort((a, b) => a - b);
    for (let i = 0; i < slideNumbers.length; i++) {
      if (slideNumbers[i] !== i + 1) {
        console.warn(`Slide sequence warning: expected slide ${i + 1}, found ${slideNumbers[i]}`);
      }
    }
  }

  /**
   * Set up initial slide state
   */
  setupInitialState() {
    // Ensure current slide is within bounds
    if (this.currentSlide < 1) this.currentSlide = 1;
    if (this.currentSlide > this.totalSlides) this.currentSlide = this.totalSlides;
    
    // Hide all slides initially
    this.hideAllSlides();
    
    // Show the current slide
    this.showSlide(this.currentSlide);
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Listen for navigation events from other components
    this.eventBus.on('navigation:next', () => this.nextSlide());
    this.eventBus.on('navigation:previous', () => this.previousSlide());
    this.eventBus.on('navigation:goTo', (data) => this.goToSlide(data.slideNumber));
    
    // Listen for keyboard events
    this.eventBus.on('keyboard:navigation', (data) => this.handleKeyboardNavigation(data));
  }

  /**
   * Navigate to a specific slide
   * @param {number} slideNumber - The slide number to navigate to
   */
  goToSlide(slideNumber) {
    // Validate slide number
    if (slideNumber < 1 || slideNumber > this.totalSlides) {
      console.warn(`Invalid slide number: ${slideNumber}. Must be between 1 and ${this.totalSlides}`);
      return false;
    }

    // Prevent navigation during transition
    if (this.isTransitioning) {
      return false;
    }

    // Don't navigate if already on the target slide
    if (slideNumber === this.currentSlide) {
      return false;
    }

    const previousSlide = this.currentSlide;
    this.currentSlide = slideNumber;
    
    this.performSlideTransition(previousSlide, slideNumber);
    return true;
  }

  /**
   * Navigate to the next slide
   */
  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      return this.goToSlide(this.currentSlide + 1);
    }
    return false;
  }

  /**
   * Navigate to the previous slide
   */
  previousSlide() {
    if (this.currentSlide > 1) {
      return this.goToSlide(this.currentSlide - 1);
    }
    return false;
  }

  /**
   * Perform the actual slide transition
   * @param {number} fromSlide - Previous slide number
   * @param {number} toSlide - Target slide number
   */
  performSlideTransition(fromSlide, toSlide) {
    this.isTransitioning = true;
    
    // Emit transition start event
    this.eventBus.emit('slide:transitionStart', {
      from: fromSlide,
      to: toSlide,
      direction: toSlide > fromSlide ? 'forward' : 'backward'
    });

    // Hide previous slide
    this.hideSlide(fromSlide);
    
    // Show new slide
    this.showSlide(toSlide);
    
    // Update UI elements
    this.updateUI();
    
    // Wait for transition to complete
    setTimeout(() => {
      this.isTransitioning = false;
      
      // Emit transition complete event
      this.eventBus.emit('slide:transitionComplete', {
        from: fromSlide,
        to: toSlide,
        currentSlide: this.currentSlide,
        slideData: this.getCurrentSlideData()
      });
    }, presentationConfig.animations.transitionDuration || 600);
  }

  /**
   * Show a specific slide
   * @param {number} slideNumber - The slide number to show
   */
  showSlide(slideNumber) {
    const slideData = this.getSlideData(slideNumber);
    if (!slideData) return;

    const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
    if (slideElement) {
      slideElement.classList.add('active');
      slideElement.style.display = 'block';
    }
  }

  /**
   * Hide a specific slide
   * @param {number} slideNumber - The slide number to hide
   */
  hideSlide(slideNumber) {
    const slideData = this.getSlideData(slideNumber);
    if (!slideData) return;

    const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
    if (slideElement) {
      slideElement.classList.remove('active');
      // Don't set display:none immediately to allow transition
      setTimeout(() => {
        if (!slideElement.classList.contains('active')) {
          slideElement.style.display = 'none';
        }
      }, presentationConfig.animations.transitionDuration || 600);
    }
  }

  /**
   * Hide all slides
   */
  hideAllSlides() {
    this.slidesData.forEach(slideData => {
      const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
      if (slideElement) {
        slideElement.classList.remove('active');
        slideElement.style.display = 'none';
      }
    });
  }

  /**
   * Update UI elements (progress, counter, indicators)
   */
  updateUI() {
    this.updateProgress();
    this.updateSlideCounter();
    this.updateIndicators();
    this.updateNavigationButtons();
  }

  /**
   * Update progress bar
   */
  updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      const progress = (this.currentSlide / this.totalSlides) * 100;
      progressFill.style.width = `${progress}%`;
    }
  }

  /**
   * Update slide counter
   */
  updateSlideCounter() {
    const currentSlideElement = document.querySelector('.current-slide');
    const totalSlidesElement = document.querySelector('.total-slides');
    
    if (currentSlideElement) {
      currentSlideElement.textContent = this.currentSlide;
    }
    if (totalSlidesElement) {
      totalSlidesElement.textContent = this.totalSlides;
    }
  }

  /**
   * Update slide indicators
   */
  updateIndicators() {
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
      if (index + 1 === this.currentSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  /**
   * Update navigation button states
   */
  updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
      prevBtn.disabled = this.currentSlide === 1;
      prevBtn.classList.toggle('disabled', this.currentSlide === 1);
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentSlide === this.totalSlides;
      nextBtn.classList.toggle('disabled', this.currentSlide === this.totalSlides);
    }
  }

  /**
   * Handle keyboard navigation
   * @param {object} data - Keyboard event data
   */
  handleKeyboardNavigation(data) {
    const { key, ctrlKey, altKey } = data;
    
    switch (key) {
      case 'ArrowRight':
      case 'Space':
        if (!ctrlKey && !altKey) {
          this.nextSlide();
        }
        break;
      case 'ArrowLeft':
        if (!ctrlKey && !altKey) {
          this.previousSlide();
        }
        break;
      case 'Home':
        this.goToSlide(1);
        break;
      case 'End':
        this.goToSlide(this.totalSlides);
        break;
      default:
        // Handle number keys for direct navigation
        if (/^[1-9]$/.test(key)) {
          const slideNumber = parseInt(key);
          if (slideNumber <= this.totalSlides) {
            this.goToSlide(slideNumber);
          }
        }
    }
  }

  /**
   * Get slide data by slide number
   * @param {number} slideNumber - The slide number
   * @returns {object|null} The slide data or null if not found
   */
  getSlideData(slideNumber) {
    return this.slidesData.find(slide => slide.slideNumber === slideNumber) || null;
  }

  /**
   * Get current slide data
   * @returns {object|null} The current slide data
   */
  getCurrentSlideData() {
    return this.getSlideData(this.currentSlide);
  }

  /**
   * Get slide data by ID
   * @param {string} slideId - The slide ID
   * @returns {object|null} The slide data or null if not found
   */
  getSlideDataById(slideId) {
    return this.slidesData.find(slide => slide.id === slideId) || null;
  }

  /**
   * Navigate to slide by ID
   * @param {string} slideId - The slide ID
   * @returns {boolean} Success status
   */
  goToSlideById(slideId) {
    const slideData = this.getSlideDataById(slideId);
    if (slideData) {
      return this.goToSlide(slideData.slideNumber);
    }
    return false;
  }

  /**
   * Get current slide number
   * @returns {number} Current slide number
   */
  getCurrentSlide() {
    return this.currentSlide;
  }

  /**
   * Get total slides count
   * @returns {number} Total slides count
   */
  getTotalSlides() {
    return this.totalSlides;
  }

  /**
   * Check if navigation is possible
   * @returns {object} Navigation state
   */
  getNavigationState() {
    return {
      canGoNext: this.currentSlide < this.totalSlides,
      canGoPrevious: this.currentSlide > 1,
      isTransitioning: this.isTransitioning,
      currentSlide: this.currentSlide,
      totalSlides: this.totalSlides
    };
  }
}
