// Template Rendering System
// Renders slides from data using appropriate slide components

import { SlideFactory } from './SlideFactory.js';

export class TemplateRenderer {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.slideFactory = new SlideFactory(eventBus);
    this.slideComponents = new Map();
    this.container = null;
    this.isInitialized = false;
    this.renderingQueue = [];
    this.isProcessingQueue = false;

    this.init();
  }

  /**
   * Initialize the template renderer
   */
  init() {
    this.container = document.getElementById('slides-wrapper');
    if (!this.container) {
      throw new Error('Slides container not found');
    }
    
    this.setupEventListeners();
    this.isInitialized = true;
    
    console.log('✅ Template Renderer initialized');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Listen for slide rendering requests
    this.eventBus.on('template:renderSlide', (data) => {
      this.renderSlide(data.slideData);
    });

    // Listen for slide removal requests
    this.eventBus.on('template:removeSlide', (data) => {
      this.removeSlide(data.slideId);
    });

    // Listen for template refresh requests
    this.eventBus.on('template:refresh', () => {
      this.refreshAllSlides();
    });

    // Listen for template clear requests
    this.eventBus.on('template:clear', () => {
      this.clearAllSlides();
    });

    // Listen for slide data updates
    this.eventBus.on('template:updateSlideData', (data) => {
      this.updateSlideData(data.slideId, data.newData);
    });

    // Listen for slide validation requests
    this.eventBus.on('template:validateSlide', (data) => {
      try {
        this.validateSlideData(data.slideData);
        this.eventBus.emit('template:slideValidated', {
          slideId: data.slideData.id,
          valid: true
        });
      } catch (error) {
        this.eventBus.emit('template:slideValidated', {
          slideId: data.slideData.id,
          valid: false,
          error: error.message
        });
      }
    });

    // Listen for slide type support queries
    this.eventBus.on('template:checkSlideTypeSupport', (data) => {
      const supported = this.isSlideTypeSupported(data.type);
      this.eventBus.emit('template:slideTypeSupportChecked', {
        type: data.type,
        supported: supported
      });
    });
  }

  /**
   * Render all slides from data array
   */
  async renderSlides(slidesData) {
    if (!Array.isArray(slidesData)) {
      throw new Error('Slides data must be an array');
    }

    console.log(`🎨 Rendering ${slidesData.length} slides...`);

    // Clear existing slides
    this.clearAllSlides();

    // Add slides to rendering queue
    this.renderingQueue = [...slidesData];

    // Process queue
    await this.processRenderingQueue();

    // Emit rendering complete event
    this.eventBus.emit('template:renderingComplete', {
      totalSlides: slidesData.length,
      renderedSlides: this.slideComponents.size,
      errors: this.getRenderingErrors()
    });

    console.log(`✅ Rendered ${this.slideComponents.size} slides successfully`);
  }

  /**
   * Process rendering queue with error handling
   */
  async processRenderingQueue() {
    if (this.isProcessingQueue) {
      return;
    }

    this.isProcessingQueue = true;
    const errors = [];

    while (this.renderingQueue.length > 0) {
      const slideData = this.renderingQueue.shift();

      try {
        await this.renderSlideAsync(slideData);
      } catch (error) {
        console.error(`Failed to render slide ${slideData.id}:`, error);
        errors.push({ slideId: slideData.id, error: error.message });

        // Create fallback slide
        this.renderFallbackSlide(slideData, error);
      }

      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this.isProcessingQueue = false;
    this.renderingErrors = errors;
  }

  /**
   * Render a single slide asynchronously
   */
  async renderSlideAsync(slideData) {
    return new Promise((resolve, reject) => {
      try {
        const result = this.renderSlide(slideData);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Render a single slide
   */
  renderSlide(slideData) {
    if (!slideData || !slideData.id) {
      throw new Error('Invalid slide data: missing id');
    }

    // Remove existing slide if it exists
    if (this.slideComponents.has(slideData.id)) {
      this.removeSlide(slideData.id);
    }

    // Create appropriate slide component
    const slideComponent = this.createSlideComponent(slideData);
    
    // Render the slide
    const slideElement = slideComponent.render();
    
    // Add to container
    this.container.appendChild(slideElement);
    
    // Store component reference
    this.slideComponents.set(slideData.id, slideComponent);
    
    // Emit slide rendered event
    this.eventBus.emit('template:slideRendered', {
      slideId: slideData.id,
      slideNumber: slideData.slideNumber,
      slideType: slideData.type
    });
    
    return slideComponent;
  }

  /**
   * Create appropriate slide component based on type
   */
  createSlideComponent(slideData) {
    try {
      // Validate slide data first
      this.validateSlideData(slideData);

      // Use SlideFactory to create the appropriate component
      return this.slideFactory.createSlide(slideData);
    } catch (error) {
      console.error(`Failed to create slide component for ${slideData.type}:`, error);

      // Create fallback slide with error information
      const fallbackData = {
        ...slideData,
        type: 'base',
        title: slideData.title || 'Error Slide',
        subtitle: `Failed to create ${slideData.type} slide`,
        error: error.message
      };

      return this.slideFactory.createSlide(fallbackData);
    }
  }

  /**
   * Render fallback slide for errors
   */
  renderFallbackSlide(slideData, error) {
    const fallbackData = {
      id: slideData.id || `fallback-${Date.now()}`,
      type: 'error',
      slideNumber: slideData.slideNumber || 0,
      title: 'Slide Rendering Error',
      subtitle: `Failed to render slide: ${slideData.title || 'Unknown'}`,
      error: error.message
    };
    
    const fallbackSlide = new BaseSlide(fallbackData, this.eventBus);
    const slideElement = fallbackSlide.render();
    
    // Add error styling
    slideElement.classList.add('slide-error');
    
    // Add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <p>Error: ${error.message}</p>
      <details>
        <summary>Debug Information</summary>
        <pre>${JSON.stringify(slideData, null, 2)}</pre>
      </details>
    `;
    
    const content = slideElement.querySelector('.slide-content');
    if (content) {
      content.appendChild(errorMessage);
    }
    
    this.container.appendChild(slideElement);
    this.slideComponents.set(fallbackData.id, fallbackSlide);
  }

  /**
   * Remove a slide
   */
  removeSlide(slideId) {
    const slideComponent = this.slideComponents.get(slideId);
    if (slideComponent) {
      slideComponent.destroy();
      this.slideComponents.delete(slideId);
      
      this.eventBus.emit('template:slideRemoved', { slideId });
    }
  }

  /**
   * Clear all slides
   */
  clearAllSlides() {
    // Destroy all slide components
    this.slideComponents.forEach((component, slideId) => {
      component.destroy();
    });
    
    // Clear the map
    this.slideComponents.clear();
    
    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    this.eventBus.emit('template:cleared');
  }

  /**
   * Refresh all slides
   */
  refreshAllSlides() {
    this.slideComponents.forEach(component => {
      component.refresh();
    });
    
    this.eventBus.emit('template:refreshed');
  }

  /**
   * Get slide component by ID
   */
  getSlideComponent(slideId) {
    return this.slideComponents.get(slideId);
  }

  /**
   * Get all slide components
   */
  getAllSlideComponents() {
    return Array.from(this.slideComponents.values());
  }

  /**
   * Get slide component by slide number
   */
  getSlideComponentByNumber(slideNumber) {
    return Array.from(this.slideComponents.values())
      .find(component => component.getSlideNumber() === slideNumber);
  }

  /**
   * Update slide data
   */
  updateSlideData(slideId, newData) {
    const slideComponent = this.slideComponents.get(slideId);
    if (slideComponent) {
      slideComponent.updateData(newData);
      
      this.eventBus.emit('template:slideUpdated', {
        slideId,
        newData
      });
    }
  }

  /**
   * Get rendering statistics
   */
  getStats() {
    const components = Array.from(this.slideComponents.values());
    
    return {
      totalSlides: components.length,
      renderedSlides: components.filter(c => c.isSlideRendered()).length,
      visibleSlides: components.filter(c => c.isSlideVisible()).length,
      slideTypes: components.reduce((types, component) => {
        const type = component.getType();
        types[type] = (types[type] || 0) + 1;
        return types;
      }, {}),
      isInitialized: this.isInitialized
    };
  }

  /**
   * Validate slide data structure
   */
  validateSlideData(slideData) {
    // Use SlideFactory validation
    const validation = this.slideFactory.validateSlideData(slideData);

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Additional template-specific validation
    if (slideData.slideNumber < 0) {
      throw new Error('Slide number must be non-negative');
    }

    // Check for duplicate IDs
    if (this.slideComponents.has(slideData.id)) {
      console.warn(`Slide with ID ${slideData.id} already exists, will be replaced`);
    }

    return true;
  }

  /**
   * Get rendering errors
   */
  getRenderingErrors() {
    return this.renderingErrors || [];
  }

  /**
   * Get slide type statistics
   */
  getSlideTypeStats() {
    const stats = {};
    const availableTypes = this.slideFactory.getAvailableTypes();

    // Initialize all types with 0
    availableTypes.forEach(type => {
      stats[type] = 0;
    });

    // Count actual slides
    this.slideComponents.forEach(component => {
      const type = component.getType();
      if (stats.hasOwnProperty(type)) {
        stats[type]++;
      } else {
        stats['unknown'] = (stats['unknown'] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Check if slide type is supported
   */
  isSlideTypeSupported(type) {
    return this.slideFactory.isSlideTypeRegistered(type);
  }

  /**
   * Get supported slide types
   */
  getSupportedSlideTypes() {
    return this.slideFactory.getAvailableTypes();
  }

  /**
   * Export slide data
   */
  exportSlideData() {
    const components = Array.from(this.slideComponents.values());
    return components.map(component => component.getData());
  }

  /**
   * Import slide data
   */
  importSlideData(slidesData) {
    // Validate all slides first
    slidesData.forEach((slideData, index) => {
      try {
        this.validateSlideData(slideData);
      } catch (error) {
        throw new Error(`Invalid slide data at index ${index}: ${error.message}`);
      }
    });
    
    // Render all slides
    this.renderSlides(slidesData);
  }

  /**
   * Destroy the template renderer
   */
  destroy() {
    this.clearAllSlides();
    this.eventBus.clear('template:*');
    this.container = null;
    this.isInitialized = false;
  }
}
