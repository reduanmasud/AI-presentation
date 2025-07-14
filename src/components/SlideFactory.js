// Slide Factory
// Factory pattern for creating slide components

import { BaseSlide } from './slides/BaseSlide.js';
import { TitleSlide } from './slides/TitleSlide.js';
import { AgendaSlide } from './slides/AgendaSlide.js';
import { TimelineSlide } from './slides/TimelineSlide.js';
import { WorkflowSlide } from './slides/WorkflowSlide.js';
import { PlatformSlide } from './slides/PlatformSlide.js';
import { GallerySlide } from './slides/GallerySlide.js';
import { SecuritySlide } from './slides/SecuritySlide.js';
import { ConclusionSlide } from './slides/ConclusionSlide.js';

export class SlideFactory {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.slideTypes = new Map();
    this.slideInstances = new Map();
    
    this.registerDefaultSlideTypes();
  }

  /**
   * Register default slide types
   */
  registerDefaultSlideTypes() {
    this.registerSlideType('base', BaseSlide);
    this.registerSlideType('title', TitleSlide);
    this.registerSlideType('agenda', AgendaSlide);
    this.registerSlideType('timeline', TimelineSlide);
    this.registerSlideType('workflow', WorkflowSlide);
    this.registerSlideType('platform', PlatformSlide);
    this.registerSlideType('gallery', GallerySlide);
    this.registerSlideType('security', SecuritySlide);
    this.registerSlideType('conclusion', ConclusionSlide);
  }

  /**
   * Register a new slide type
   */
  registerSlideType(type, SlideClass) {
    if (typeof type !== 'string') {
      throw new Error('Slide type must be a string');
    }
    
    if (typeof SlideClass !== 'function') {
      throw new Error('Slide class must be a constructor function');
    }
    
    // Validate that the class extends BaseSlide
    if (!this.isValidSlideClass(SlideClass)) {
      throw new Error('Slide class must extend BaseSlide');
    }
    
    this.slideTypes.set(type, SlideClass);
    
    console.log(`📝 Registered slide type: ${type}`);
  }

  /**
   * Validate slide class
   */
  isValidSlideClass(SlideClass) {
    try {
      // Create a temporary instance to check inheritance
      const tempInstance = Object.create(SlideClass.prototype);
      return tempInstance instanceof BaseSlide || SlideClass === BaseSlide;
    } catch (error) {
      return false;
    }
  }

  /**
   * Create a slide component
   */
  createSlide(slideData) {
    if (!slideData || typeof slideData !== 'object') {
      throw new Error('Slide data must be an object');
    }
    
    if (!slideData.type) {
      throw new Error('Slide data must have a type property');
    }
    
    if (!slideData.id) {
      throw new Error('Slide data must have an id property');
    }
    
    // Get the appropriate slide class
    const SlideClass = this.getSlideClass(slideData.type);
    
    // Create the slide instance
    const slideInstance = new SlideClass(slideData, this.eventBus);
    
    // Store the instance
    this.slideInstances.set(slideData.id, slideInstance);
    
    // Emit creation event
    this.eventBus.emit('slideFactory:slideCreated', {
      slideId: slideData.id,
      slideType: slideData.type,
      slideNumber: slideData.slideNumber
    });
    
    return slideInstance;
  }

  /**
   * Get slide class for a given type
   */
  getSlideClass(type) {
    const SlideClass = this.slideTypes.get(type);
    
    if (!SlideClass) {
      console.warn(`Unknown slide type: ${type}, falling back to BaseSlide`);
      return this.slideTypes.get('base');
    }
    
    return SlideClass;
  }

  /**
   * Create multiple slides
   */
  createSlides(slidesData) {
    if (!Array.isArray(slidesData)) {
      throw new Error('Slides data must be an array');
    }
    
    const slides = [];
    const errors = [];
    
    slidesData.forEach((slideData, index) => {
      try {
        const slide = this.createSlide(slideData);
        slides.push(slide);
      } catch (error) {
        errors.push({
          index,
          slideData,
          error: error.message
        });
        console.error(`Failed to create slide at index ${index}:`, error);
      }
    });
    
    // Emit batch creation event
    this.eventBus.emit('slideFactory:batchCreated', {
      totalSlides: slidesData.length,
      successfulSlides: slides.length,
      errors: errors.length,
      slides: slides
    });
    
    if (errors.length > 0) {
      console.warn(`Created ${slides.length}/${slidesData.length} slides successfully`);
    } else {
      console.log(`✅ Created all ${slides.length} slides successfully`);
    }
    
    return { slides, errors };
  }

  /**
   * Get slide instance by ID
   */
  getSlideInstance(slideId) {
    return this.slideInstances.get(slideId);
  }

  /**
   * Get all slide instances
   */
  getAllSlideInstances() {
    return Array.from(this.slideInstances.values());
  }

  /**
   * Remove slide instance
   */
  removeSlideInstance(slideId) {
    const slideInstance = this.slideInstances.get(slideId);
    
    if (slideInstance) {
      // Destroy the slide
      if (typeof slideInstance.destroy === 'function') {
        slideInstance.destroy();
      }
      
      // Remove from instances map
      this.slideInstances.delete(slideId);
      
      // Emit removal event
      this.eventBus.emit('slideFactory:slideRemoved', { slideId });
      
      return true;
    }
    
    return false;
  }

  /**
   * Clear all slide instances
   */
  clearAllSlideInstances() {
    // Destroy all slides
    this.slideInstances.forEach((slideInstance, slideId) => {
      if (typeof slideInstance.destroy === 'function') {
        slideInstance.destroy();
      }
    });
    
    // Clear the map
    this.slideInstances.clear();
    
    // Emit clear event
    this.eventBus.emit('slideFactory:allSlidesCleared');
  }

  /**
   * Get registered slide types
   */
  getRegisteredSlideTypes() {
    return Array.from(this.slideTypes.keys());
  }

  /**
   * Check if slide type is registered
   */
  isSlideTypeRegistered(type) {
    return this.slideTypes.has(type);
  }

  /**
   * Unregister slide type
   */
  unregisterSlideType(type) {
    if (type === 'base') {
      throw new Error('Cannot unregister base slide type');
    }
    
    const removed = this.slideTypes.delete(type);
    
    if (removed) {
      console.log(`📝 Unregistered slide type: ${type}`);
      this.eventBus.emit('slideFactory:typeUnregistered', { type });
    }
    
    return removed;
  }

  /**
   * Get factory statistics
   */
  getStats() {
    const instances = Array.from(this.slideInstances.values());
    
    return {
      registeredTypes: this.slideTypes.size,
      totalInstances: instances.length,
      renderedInstances: instances.filter(slide => slide.isSlideRendered()).length,
      visibleInstances: instances.filter(slide => slide.isSlideVisible()).length,
      typeDistribution: instances.reduce((dist, slide) => {
        const type = slide.getType();
        dist[type] = (dist[type] || 0) + 1;
        return dist;
      }, {}),
      availableTypes: this.getRegisteredSlideTypes()
    };
  }

  /**
   * Validate slide data against type requirements
   */
  validateSlideData(slideData) {
    const SlideClass = this.getSlideClass(slideData.type);
    
    // Basic validation
    const required = ['id', 'type', 'slideNumber', 'title'];
    const missing = required.filter(field => !slideData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    // Type-specific validation
    if (SlideClass.validateData && typeof SlideClass.validateData === 'function') {
      return SlideClass.validateData(slideData);
    }
    
    return true;
  }

  /**
   * Create slide with validation
   */
  createSlideWithValidation(slideData) {
    // Validate first
    this.validateSlideData(slideData);
    
    // Create if validation passes
    return this.createSlide(slideData);
  }

  /**
   * Clone slide instance
   */
  cloneSlide(slideId, newSlideId) {
    const originalSlide = this.slideInstances.get(slideId);
    
    if (!originalSlide) {
      throw new Error(`Slide with ID ${slideId} not found`);
    }
    
    // Get original slide data
    const originalData = originalSlide.getData();
    
    // Create new data with new ID
    const newData = {
      ...originalData,
      id: newSlideId,
      slideNumber: originalData.slideNumber + 0.5 // Temporary number
    };
    
    // Create new slide
    return this.createSlide(newData);
  }

  /**
   * Destroy the factory
   */
  destroy() {
    this.clearAllSlideInstances();
    this.slideTypes.clear();
    
    // Clear factory-related events
    this.eventBus.off('slideFactory:*');
    
    console.log('🧹 Slide Factory destroyed');
  }
}
