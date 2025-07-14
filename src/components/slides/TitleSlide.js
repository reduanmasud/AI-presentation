// Title Slide Component
// Specific component for presentation title slides

import { BaseSlide } from './BaseSlide.js';

export class TitleSlide extends BaseSlide {
  constructor(slideData, eventBus) {
    super(slideData, eventBus);
  }

  /**
   * Create the main slide element with title slide specific styling
   */
  createElement() {
    const slide = document.createElement('section');
    slide.className = `slide`;
    slide.setAttribute('data-slide', this.slideData.slideNumber);

    // Create the exact structure from your original HTML
    slide.innerHTML = `
      <div class="slide-content title-slide">
        <div class="title-animation">
          <div class="ai-icon-container">
            <i class="fas fa-robot"></i>
            <i class="fas fa-shield-alt"></i>
            <i class="fas fa-bug"></i>
          </div>
          <h1 class="main-title">${this.slideData.title}</h1>
          <p class="subtitle">${this.slideData.subtitle}</p>
          <div class="presenters-info">
            <p class="presenters">Presented by: <strong>${this.slideData.presenters}</strong></p>
            <p class="team-info">${this.slideData.team}</p>
          </div>
          <div class="title-decorations">
            <div class="decoration-line"></div>
            <div class="decoration-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    `;

    return slide;
  }

  /**
   * Create main title element
   */
  createMainTitle() {
    const titleContainer = document.createElement('div');
    titleContainer.className = 'main-title-container';
    
    const title = document.createElement('h1');
    title.className = 'main-title animate-on-enter';
    title.id = `slide-title-${this.slideData.id}`;
    title.textContent = this.slideData.title;
    
    titleContainer.appendChild(title);
    return titleContainer;
  }

  /**
   * Create subtitle element
   */
  createSubtitle() {
    if (!this.slideData.subtitle) {
      return document.createElement('div'); // Empty div
    }

    const subtitleContainer = document.createElement('div');
    subtitleContainer.className = 'subtitle-container';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle animate-on-enter';
    subtitle.textContent = this.slideData.subtitle;
    
    subtitleContainer.appendChild(subtitle);
    return subtitleContainer;
  }

  /**
   * Create presenters information
   */
  createPresentersInfo() {
    const presentersContainer = document.createElement('div');
    presentersContainer.className = 'presenters-info animate-on-enter';
    
    if (this.slideData.presenters) {
      const presenters = document.createElement('div');
      presenters.className = 'presenters';
      presenters.textContent = this.slideData.presenters;
      presentersContainer.appendChild(presenters);
    }
    
    if (this.slideData.team) {
      const team = document.createElement('div');
      team.className = 'team';
      team.textContent = this.slideData.team;
      presentersContainer.appendChild(team);
    }
    
    return presentersContainer;
  }

  /**
   * Create AI icon container
   */
  createIconContainer() {
    if (!this.slideData.icons || !Array.isArray(this.slideData.icons)) {
      return document.createElement('div'); // Empty div
    }

    const iconContainer = document.createElement('div');
    iconContainer.className = 'ai-icon-container animate-on-enter';
    
    this.slideData.icons.forEach((iconData, index) => {
      const iconElement = this.createIcon(iconData, index);
      iconContainer.appendChild(iconElement);
    });
    
    return iconContainer;
  }

  /**
   * Create individual icon element
   */
  createIcon(iconData, index) {
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'ai-icon';
    iconWrapper.style.animationDelay = `${0.2 + (index * 0.1)}s`;
    
    const icon = document.createElement('i');
    icon.className = iconData.class;
    icon.setAttribute('aria-hidden', 'true');
    
    const label = document.createElement('span');
    label.className = 'icon-label';
    label.textContent = iconData.label;
    
    iconWrapper.appendChild(icon);
    iconWrapper.appendChild(label);
    
    return iconWrapper;
  }

  /**
   * Create decorative elements
   */
  createDecorations() {
    if (!this.slideData.decorations) {
      return document.createElement('div'); // Empty div
    }

    const decorationsContainer = document.createElement('div');
    decorationsContainer.className = 'title-decorations';
    
    const decorations = this.slideData.decorations;
    
    // Add decorative line
    if (decorations.hasLine) {
      const line = document.createElement('div');
      line.className = 'title-decoration line';
      decorationsContainer.appendChild(line);
    }
    
    // Add decorative dots
    if (decorations.hasDots && decorations.dotCount) {
      const dotsContainer = this.createDots(decorations.dotCount);
      decorationsContainer.appendChild(dotsContainer);
    }
    
    // Add floating particles
    const particles = this.createParticles();
    decorationsContainer.appendChild(particles);
    
    return decorationsContainer;
  }

  /**
   * Create decorative dots
   */
  createDots(count) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'title-dots';
    
    // Top-left dots
    const topLeftDots = document.createElement('div');
    topLeftDots.className = 'title-decoration dots top-left';
    dotsContainer.appendChild(topLeftDots);
    
    // Bottom-right dots
    const bottomRightDots = document.createElement('div');
    bottomRightDots.className = 'title-decoration dots bottom-right';
    dotsContainer.appendChild(bottomRightDots);
    
    return dotsContainer;
  }

  /**
   * Create floating particles
   */
  createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'title-particles';
    
    // Create 9 particles
    for (let i = 1; i <= 9; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particlesContainer.appendChild(particle);
    }
    
    return particlesContainer;
  }

  /**
   * Start title slide specific animations
   */
  startAnimations() {
    super.startAnimations();
    
    // Animate elements in sequence
    const animationSequence = [
      { selector: '.main-title', delay: 500 },
      { selector: '.subtitle', delay: 800 },
      { selector: '.presenters-info', delay: 1100 },
      { selector: '.ai-icon-container', delay: 1400 }
    ];
    
    animationSequence.forEach(({ selector, delay }) => {
      const element = this.element.querySelector(selector);
      if (element) {
        setTimeout(() => {
          element.classList.add('animated');
        }, delay);
      }
    });
    
    // Start particle animation
    this.startParticleAnimation();
  }

  /**
   * Start particle animation
   */
  startParticleAnimation() {
    const particles = this.element.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
      // Stagger particle animations
      setTimeout(() => {
        particle.style.animationPlayState = 'running';
      }, index * 600);
    });
  }

  /**
   * Stop title slide animations
   */
  stopAnimations() {
    super.stopAnimations();
    
    // Stop particle animations
    const particles = this.element.querySelectorAll('.particle');
    particles.forEach(particle => {
      particle.style.animationPlayState = 'paused';
    });
  }

  /**
   * Set up title slide specific interactions
   */
  setupInteractiveElements() {
    super.setupInteractiveElements();
    
    // Add hover effects to icons
    const icons = this.element.querySelectorAll('.ai-icon');
    icons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'translateY(-5px) scale(1.05)';
      });
      
      icon.addEventListener('mouseleave', () => {
        icon.style.transform = '';
      });
    });
    
    // Add click effect to main title
    const mainTitle = this.element.querySelector('.main-title');
    if (mainTitle) {
      mainTitle.addEventListener('click', () => {
        this.eventBus.emit('title:clicked', {
          slideId: this.slideData.id,
          title: this.slideData.title
        });
      });
    }
  }

  /**
   * Refresh title slide content
   */
  refresh() {
    super.refresh();
    
    // Update presenters info
    const presentersElement = this.element.querySelector('.presenters');
    if (presentersElement && this.slideData.presenters) {
      presentersElement.textContent = this.slideData.presenters;
    }
    
    const teamElement = this.element.querySelector('.team');
    if (teamElement && this.slideData.team) {
      teamElement.textContent = this.slideData.team;
    }
    
    // Update icons if changed
    if (this.slideData.icons) {
      const iconContainer = this.element.querySelector('.ai-icon-container');
      if (iconContainer) {
        iconContainer.innerHTML = '';
        this.slideData.icons.forEach((iconData, index) => {
          const iconElement = this.createIcon(iconData, index);
          iconContainer.appendChild(iconElement);
        });
      }
    }
  }

  /**
   * Get title slide specific data
   */
  getTitleData() {
    return {
      title: this.slideData.title,
      subtitle: this.slideData.subtitle,
      presenters: this.slideData.presenters,
      team: this.slideData.team,
      icons: this.slideData.icons,
      decorations: this.slideData.decorations
    };
  }
}
