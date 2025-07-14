// Animation Manager
// This class handles all slide animations and transitions

import { presentationConfig } from '../data/config.js';

export class AnimationManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.activeAnimations = new Map();
    this.animationQueue = [];
    this.isAnimating = false;
    this.config = presentationConfig.animations;
    
    this.init();
  }

  /**
   * Initialize the animation manager
   */
  init() {
    this.bindEvents();
    this.setupAnimationStyles();
    
    // Check for reduced motion preference
    this.respectReducedMotion();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Listen for slide transition events
    this.eventBus.on('slide:transitionStart', (data) => this.handleSlideTransition(data));
    this.eventBus.on('slide:transitionComplete', (data) => this.handleSlideAnimations(data));
    
    // Listen for specific animation requests
    this.eventBus.on('animation:trigger', (data) => this.triggerAnimation(data));
    this.eventBus.on('animation:stop', (data) => this.stopAnimation(data));
    this.eventBus.on('animation:stopAll', () => this.stopAllAnimations());
  }

  /**
   * Setup CSS animation styles
   */
  setupAnimationStyles() {
    if (!document.getElementById('animation-styles')) {
      const style = document.createElement('style');
      style.id = 'animation-styles';
      style.textContent = this.getAnimationCSS();
      document.head.appendChild(style);
    }
  }

  /**
   * Get CSS animation definitions
   */
  getAnimationCSS() {
    return `
      /* Slide transition animations */
      .slide-enter {
        opacity: 0;
        transform: translateX(100%);
      }
      
      .slide-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: all ${this.config.transitionDuration}ms ${this.config.easing};
      }
      
      .slide-exit {
        opacity: 1;
        transform: translateX(0);
      }
      
      .slide-exit-active {
        opacity: 0;
        transform: translateX(-100%);
        transition: all ${this.config.transitionDuration}ms ${this.config.easing};
      }

      /* Element animations */
      .animate-fade-in {
        animation: fadeIn ${this.config.animationDelay * 3}ms ease-out forwards;
      }
      
      .animate-slide-up {
        animation: slideUp ${this.config.animationDelay * 4}ms ease-out forwards;
      }
      
      .animate-slide-down {
        animation: slideDown ${this.config.animationDelay * 4}ms ease-out forwards;
      }
      
      .animate-slide-left {
        animation: slideLeft ${this.config.animationDelay * 4}ms ease-out forwards;
      }
      
      .animate-slide-right {
        animation: slideRight ${this.config.animationDelay * 4}ms ease-out forwards;
      }
      
      .animate-scale-in {
        animation: scaleIn ${this.config.animationDelay * 3}ms ease-out forwards;
      }
      
      .animate-bounce-in {
        animation: bounceIn ${this.config.animationDelay * 5}ms ease-out forwards;
      }

      /* Keyframe definitions */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideLeft {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes slideRight {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes bounceIn {
        0% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 1; transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .slide-enter-active,
        .slide-exit-active,
        .animate-fade-in,
        .animate-slide-up,
        .animate-slide-down,
        .animate-slide-left,
        .animate-slide-right,
        .animate-scale-in,
        .animate-bounce-in {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
  }

  /**
   * Handle slide transition animations
   */
  handleSlideTransition(data) {
    const { from, to, direction } = data;
    
    if (!this.config.enableSlideAnimations) {
      return;
    }

    // Get slide elements
    const fromElement = document.querySelector(`[data-slide="${from}"]`);
    const toElement = document.querySelector(`[data-slide="${to}"]`);

    if (fromElement && toElement) {
      this.animateSlideTransition(fromElement, toElement, direction);
    }
  }

  /**
   * Animate slide transition
   */
  animateSlideTransition(fromElement, toElement, direction) {
    // Add exit animation to current slide
    fromElement.classList.add('slide-exit');
    setTimeout(() => {
      fromElement.classList.add('slide-exit-active');
    }, 10);

    // Add enter animation to new slide
    toElement.classList.add('slide-enter');
    setTimeout(() => {
      toElement.classList.add('slide-enter-active');
    }, 10);

    // Clean up classes after animation
    setTimeout(() => {
      fromElement.classList.remove('slide-exit', 'slide-exit-active');
      toElement.classList.remove('slide-enter', 'slide-enter-active');
    }, this.config.transitionDuration);
  }

  /**
   * Handle slide-specific animations
   */
  handleSlideAnimations(data) {
    const { to, slideData } = data;
    
    if (!this.config.enableElementAnimations) {
      return;
    }

    // Trigger animations based on slide type
    switch (slideData.type) {
      case 'title':
        this.animateTitleSlide(slideData);
        break;
      case 'agenda':
        this.animateAgendaSlide(slideData);
        break;
      case 'timeline':
        this.animateTimelineSlide(slideData);
        break;
      case 'workflow':
        this.animateWorkflowSlide(slideData);
        break;
      case 'gallery':
        this.animateGallerySlide(slideData);
        break;
      case 'security':
        this.animateSecuritySlide(slideData);
        break;
      default:
        this.animateGenericSlide(slideData);
    }
  }

  /**
   * Animate title slide elements
   */
  animateTitleSlide(slideData) {
    const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
    if (!slideElement) return;

    const elements = [
      slideElement.querySelector('.main-title'),
      slideElement.querySelector('.subtitle'),
      slideElement.querySelector('.presenters-info'),
      slideElement.querySelector('.ai-icon-container')
    ].filter(Boolean);

    this.staggerAnimation(elements, 'animate-fade-in', 200);
  }

  /**
   * Animate agenda slide elements
   */
  animateAgendaSlide(slideData) {
    const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
    if (!slideElement) return;

    const agendaItems = slideElement.querySelectorAll('.agenda-item');
    this.staggerAnimation(Array.from(agendaItems), 'animate-slide-up', 150);
  }

  /**
   * Animate timeline slide elements
   */
  animateTimelineSlide(slideData) {
    const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
    if (!slideElement) return;

    const milestones = slideElement.querySelectorAll('.milestone-horizontal');
    this.staggerAnimation(Array.from(milestones), 'animate-scale-in', 200);

    // Animate progress line
    setTimeout(() => {
      const progressFill = slideElement.querySelector('.progress-fill-horizontal');
      if (progressFill) {
        progressFill.style.width = '100%';
      }
    }, milestones.length * 200 + 500);
  }

  /**
   * Animate workflow slide elements
   */
  animateWorkflowSlide(slideData) {
    const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
    if (!slideElement) return;

    const steps = slideElement.querySelectorAll('.workflow-step');
    this.staggerAnimation(Array.from(steps), 'animate-slide-left', 300);
  }

  /**
   * Animate gallery slide elements
   */
  animateGallerySlide(slideData) {
    const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
    if (!slideElement) return;

    const screenshots = slideElement.querySelectorAll('.screenshot-item');
    this.staggerAnimation(Array.from(screenshots), 'animate-bounce-in', 200);
  }

  /**
   * Animate security slide elements
   */
  animateSecuritySlide(slideData) {
    const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
    if (!slideElement) return;

    const securityItems = slideElement.querySelectorAll('.security-item');
    this.staggerAnimation(Array.from(securityItems), 'animate-slide-up', 150);

    // Animate stats
    setTimeout(() => {
      const stats = slideElement.querySelectorAll('.stat-highlight');
      this.staggerAnimation(Array.from(stats), 'animate-scale-in', 100);
    }, securityItems.length * 150 + 300);
  }

  /**
   * Animate generic slide elements
   */
  animateGenericSlide(slideData) {
    const slideElement = document.querySelector(`[data-slide-id="${slideData.id}"]`);
    if (!slideElement) return;

    const elements = slideElement.querySelectorAll('.slide-title, .slide-content > *');
    this.staggerAnimation(Array.from(elements), 'animate-fade-in', 100);
  }

  /**
   * Apply staggered animation to elements
   */
  staggerAnimation(elements, animationClass, delay = 100) {
    elements.forEach((element, index) => {
      if (element) {
        setTimeout(() => {
          element.classList.add(animationClass);
        }, index * delay);
      }
    });
  }

  /**
   * Trigger custom animation
   */
  triggerAnimation(data) {
    const { selector, animation, delay = 0, duration } = data;
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(animation);
        
        if (duration) {
          setTimeout(() => {
            element.classList.remove(animation);
          }, duration);
        }
      }, delay + (index * 50));
    });
  }

  /**
   * Stop specific animation
   */
  stopAnimation(data) {
    const { selector, animation } = data;
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      element.classList.remove(animation);
    });
  }

  /**
   * Stop all animations
   */
  stopAllAnimations() {
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach(element => {
      element.className = element.className.replace(/animate-[\w-]+/g, '');
    });
  }

  /**
   * Respect user's reduced motion preference
   */
  respectReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      this.config.enableSlideAnimations = false;
      this.config.enableElementAnimations = false;
      this.config.transitionDuration = 1;
      this.config.animationDelay = 1;
    }
  }

  /**
   * Animate counter numbers
   */
  animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const updateCounter = () => {
      current += increment;
      if ((increment > 0 && current < target) || (increment < 0 && current > target)) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }

  /**
   * Animate progress bars
   */
  animateProgressBar(element, targetWidth, duration = 1000) {
    element.style.width = '0%';
    element.style.transition = `width ${duration}ms ease-out`;
    
    setTimeout(() => {
      element.style.width = targetWidth;
    }, 50);
  }
}
