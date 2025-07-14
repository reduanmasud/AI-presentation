// Content Validation System
// This file provides validation functions for slide data integrity

import { SlideTypeMap, BaseSlideType } from '../data/slide-types.js';

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message, field = null, slideId = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.slideId = slideId;
  }
}

/**
 * Validate a single slide against its type definition
 * @param {object} slide - The slide data to validate
 * @returns {object} Validation result with success flag and errors
 */
export function validateSlide(slide) {
  const errors = [];
  
  try {
    // Check if slide has required base properties
    if (!slide.id) {
      errors.push(new ValidationError('Slide must have an id', 'id', slide.id));
    }
    
    if (!slide.type) {
      errors.push(new ValidationError('Slide must have a type', 'type', slide.id));
    }
    
    if (typeof slide.slideNumber !== 'number') {
      errors.push(new ValidationError('Slide must have a valid slideNumber', 'slideNumber', slide.id));
    }
    
    if (!slide.title) {
      errors.push(new ValidationError('Slide must have a title', 'title', slide.id));
    }
    
    // Validate against specific slide type if type is recognized
    if (slide.type && SlideTypeMap[slide.type]) {
      const typeErrors = validateSlideType(slide, slide.type);
      errors.push(...typeErrors);
    }
    
  } catch (error) {
    errors.push(new ValidationError(`Validation failed: ${error.message}`, null, slide.id));
  }
  
  return {
    success: errors.length === 0,
    errors,
    slideId: slide.id
  };
}

/**
 * Validate slide against specific type requirements
 * @param {object} slide - The slide data
 * @param {string} type - The slide type
 * @returns {Array} Array of validation errors
 */
function validateSlideType(slide, type) {
  const errors = [];
  
  switch (type) {
    case 'title':
      errors.push(...validateTitleSlide(slide));
      break;
    case 'agenda':
      errors.push(...validateAgendaSlide(slide));
      break;
    case 'timeline':
      errors.push(...validateTimelineSlide(slide));
      break;
    case 'workflow':
      errors.push(...validateWorkflowSlide(slide));
      break;
    case 'platform':
      errors.push(...validatePlatformSlide(slide));
      break;
    case 'gallery':
      errors.push(...validateGallerySlide(slide));
      break;
    case 'security':
      errors.push(...validateSecuritySlide(slide));
      break;
    case 'conclusion':
      errors.push(...validateConclusionSlide(slide));
      break;
    default:
      errors.push(new ValidationError(`Unknown slide type: ${type}`, 'type', slide.id));
  }
  
  return errors;
}

/**
 * Validate title slide specific requirements
 */
function validateTitleSlide(slide) {
  const errors = [];
  
  if (!slide.subtitle) {
    errors.push(new ValidationError('Title slide must have a subtitle', 'subtitle', slide.id));
  }
  
  if (!slide.presenters) {
    errors.push(new ValidationError('Title slide must have presenters', 'presenters', slide.id));
  }
  
  if (!slide.team) {
    errors.push(new ValidationError('Title slide must have team info', 'team', slide.id));
  }
  
  if (!Array.isArray(slide.icons)) {
    errors.push(new ValidationError('Title slide must have icons array', 'icons', slide.id));
  }
  
  return errors;
}

/**
 * Validate agenda slide specific requirements
 */
function validateAgendaSlide(slide) {
  const errors = [];
  
  if (!Array.isArray(slide.agendaItems)) {
    errors.push(new ValidationError('Agenda slide must have agendaItems array', 'agendaItems', slide.id));
  } else {
    slide.agendaItems.forEach((item, index) => {
      if (!item.title) {
        errors.push(new ValidationError(`Agenda item ${index} must have a title`, `agendaItems[${index}].title`, slide.id));
      }
      if (!item.description) {
        errors.push(new ValidationError(`Agenda item ${index} must have a description`, `agendaItems[${index}].description`, slide.id));
      }
    });
  }
  
  return errors;
}

/**
 * Validate timeline slide specific requirements
 */
function validateTimelineSlide(slide) {
  const errors = [];
  
  if (!slide.timeline) {
    errors.push(new ValidationError('Timeline slide must have timeline object', 'timeline', slide.id));
  } else {
    if (!Array.isArray(slide.timeline.milestones)) {
      errors.push(new ValidationError('Timeline must have milestones array', 'timeline.milestones', slide.id));
    }
  }
  
  return errors;
}

/**
 * Validate workflow slide specific requirements
 */
function validateWorkflowSlide(slide) {
  const errors = [];
  
  if (!slide.workflow) {
    errors.push(new ValidationError('Workflow slide must have workflow object', 'workflow', slide.id));
  } else {
    if (!Array.isArray(slide.workflow.steps)) {
      errors.push(new ValidationError('Workflow must have steps array', 'workflow.steps', slide.id));
    }
  }
  
  return errors;
}

/**
 * Validate platform slide specific requirements
 */
function validatePlatformSlide(slide) {
  const errors = [];
  
  if (!slide.platform) {
    errors.push(new ValidationError('Platform slide must have platform object', 'platform', slide.id));
  }
  
  return errors;
}

/**
 * Validate gallery slide specific requirements
 */
function validateGallerySlide(slide) {
  const errors = [];
  
  if (!slide.gallery) {
    errors.push(new ValidationError('Gallery slide must have gallery object', 'gallery', slide.id));
  } else {
    if (!Array.isArray(slide.gallery.screenshots)) {
      errors.push(new ValidationError('Gallery must have screenshots array', 'gallery.screenshots', slide.id));
    }
  }
  
  return errors;
}

/**
 * Validate security slide specific requirements
 */
function validateSecuritySlide(slide) {
  const errors = [];
  
  if (!slide.security) {
    errors.push(new ValidationError('Security slide must have security object', 'security', slide.id));
  } else {
    if (!Array.isArray(slide.security.categories)) {
      errors.push(new ValidationError('Security must have categories array', 'security.categories', slide.id));
    }
  }
  
  return errors;
}

/**
 * Validate conclusion slide specific requirements
 */
function validateConclusionSlide(slide) {
  const errors = [];
  
  if (!slide.learning) {
    errors.push(new ValidationError('Conclusion slide must have learning object', 'learning', slide.id));
  }
  
  if (!slide.nextSteps) {
    errors.push(new ValidationError('Conclusion slide must have nextSteps object', 'nextSteps', slide.id));
  }
  
  return errors;
}

/**
 * Validate an array of slides
 * @param {Array} slides - Array of slide data
 * @returns {object} Validation result with success flag and detailed errors
 */
export function validateSlides(slides) {
  if (!Array.isArray(slides)) {
    return {
      success: false,
      errors: [new ValidationError('Slides must be an array')],
      slideResults: []
    };
  }
  
  const slideResults = slides.map(slide => validateSlide(slide));
  const allErrors = slideResults.flatMap(result => result.errors);
  
  return {
    success: allErrors.length === 0,
    errors: allErrors,
    slideResults,
    totalSlides: slides.length,
    validSlides: slideResults.filter(r => r.success).length,
    invalidSlides: slideResults.filter(r => !r.success).length
  };
}

/**
 * Check for duplicate slide IDs
 * @param {Array} slides - Array of slide data
 * @returns {Array} Array of duplicate ID errors
 */
export function checkDuplicateIds(slides) {
  const errors = [];
  const seenIds = new Set();
  
  slides.forEach(slide => {
    if (seenIds.has(slide.id)) {
      errors.push(new ValidationError(`Duplicate slide ID: ${slide.id}`, 'id', slide.id));
    } else {
      seenIds.add(slide.id);
    }
  });
  
  return errors;
}

/**
 * Check slide number sequence
 * @param {Array} slides - Array of slide data
 * @returns {Array} Array of sequence errors
 */
export function checkSlideSequence(slides) {
  const errors = [];
  const sortedSlides = [...slides].sort((a, b) => a.slideNumber - b.slideNumber);
  
  sortedSlides.forEach((slide, index) => {
    const expectedNumber = index + 1;
    if (slide.slideNumber !== expectedNumber) {
      errors.push(new ValidationError(
        `Slide number sequence error: expected ${expectedNumber}, got ${slide.slideNumber}`,
        'slideNumber',
        slide.id
      ));
    }
  });
  
  return errors;
}

/**
 * Comprehensive validation of slide data
 * @param {Array} slides - Array of slide data
 * @returns {object} Complete validation result
 */
export function validateSlideData(slides) {
  const basicValidation = validateSlides(slides);
  const duplicateErrors = checkDuplicateIds(slides);
  const sequenceErrors = checkSlideSequence(slides);
  
  const allErrors = [
    ...basicValidation.errors,
    ...duplicateErrors,
    ...sequenceErrors
  ];
  
  return {
    ...basicValidation,
    success: allErrors.length === 0,
    errors: allErrors,
    duplicateIds: duplicateErrors.length > 0,
    sequenceIssues: sequenceErrors.length > 0
  };
}
