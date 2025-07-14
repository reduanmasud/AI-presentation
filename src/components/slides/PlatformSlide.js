// Platform Slide Component
// Specific component for platform showcase slides

import { BaseSlide } from './BaseSlide.js';

export class PlatformSlide extends BaseSlide {
  constructor(slideData, eventBus) {
    super(slideData, eventBus);
    this.activeFeature = 0;
    this.expandedCards = new Set();
  }

  /**
   * Create main content for platform slide
   */
  createMainContent() {
    const content = document.createElement('div');
    content.className = 'slide-content devops-dungeon-simple-slide';

    // Create the exact structure from your original HTML
    content.innerHTML = `
      <h2 class="slide-title">${this.slideData.title}</h2>

      <!-- Platform Overview -->
      <div class="platform-overview-simple">
        <div class="overview-header-simple">
          <div class="platform-logo-simple">
            <i class="${this.slideData.platform.overview.logo.icon}"></i>
          </div>
          <div class="platform-info-simple">
            <h3>${this.slideData.platform.overview.info.title}</h3>
            <p>${this.slideData.platform.overview.info.description}</p>
          </div>
        </div>

        <div class="platform-screenshot-simple">
          <img src="${this.slideData.platform.screenshot.image}" alt="${this.slideData.platform.screenshot.alt}" class="screenshot-image-simple">
          <div class="screenshot-overlay-simple">
            <div class="overlay-text-simple">${this.slideData.platform.screenshot.overlay}</div>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="preview-section">
        <div class="preview-button-container">
          <a href="${this.slideData.platform.preview.url}" target="_blank" class="preview-button">
            <i class="${this.slideData.platform.preview.icon}"></i>
            <span>${this.slideData.platform.preview.text}</span>
          </a>
        </div>
      </div>

      <!-- Engagement Question -->
      <div class="engagement-section">
        <div class="question-container">
          <div class="question-icon">
            <i class="${this.slideData.platform.engagement.question.icon}"></i>
          </div>
          <div class="question-content">
            <h4>${this.slideData.platform.engagement.question.title}</h4>
            <p class="question-hint">${this.slideData.platform.engagement.question.hint}</p>
          </div>
        </div>
      </div>
    `;

    return content;
  }

  /**
   * Create platform header with logo and description
   */
  createPlatformHeader() {
    const header = document.createElement('div');
    header.className = 'platform-header';
    
    if (!this.slideData.platform) {
      return header;
    }
    
    const platform = this.slideData.platform;
    
    // Platform logo/icon
    if (platform.logo) {
      const logo = document.createElement('div');
      logo.className = 'platform-logo';
      logo.innerHTML = `<i class="${platform.logo}" aria-hidden="true"></i>`;
      header.appendChild(logo);
    }
    
    // Platform name
    const name = document.createElement('h2');
    name.className = 'platform-name';
    name.textContent = platform.name;
    header.appendChild(name);
    
    // Platform tagline
    if (platform.tagline) {
      const tagline = document.createElement('p');
      tagline.className = 'platform-tagline';
      tagline.textContent = platform.tagline;
      header.appendChild(tagline);
    }
    
    // Platform stats
    if (platform.stats && platform.stats.length > 0) {
      const stats = document.createElement('div');
      stats.className = 'platform-stats';
      
      platform.stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        
        const value = document.createElement('div');
        value.className = 'stat-value';
        value.textContent = stat.value;
        statItem.appendChild(value);
        
        const label = document.createElement('div');
        label.className = 'stat-label';
        label.textContent = stat.label;
        statItem.appendChild(label);
        
        stats.appendChild(statItem);
      });
      
      header.appendChild(stats);
    }
    
    return header;
  }

  /**
   * Create features grid
   */
  createFeaturesGrid() {
    const grid = document.createElement('div');
    grid.className = 'features-grid';
    
    if (!this.slideData.platform || !this.slideData.platform.features) {
      return grid;
    }
    
    this.slideData.platform.features.forEach((feature, index) => {
      const featureCard = this.createFeatureCard(feature, index);
      grid.appendChild(featureCard);
    });
    
    return grid;
  }

  /**
   * Create individual feature card
   */
  createFeatureCard(featureData, index) {
    const card = document.createElement('div');
    card.className = 'feature-card';
    card.setAttribute('data-feature', index);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Feature: ${featureData.title}`);
    card.setAttribute('aria-expanded', 'false');
    
    // Feature icon
    if (featureData.icon) {
      const icon = document.createElement('div');
      icon.className = 'feature-icon';
      icon.innerHTML = `<i class="${featureData.icon}" aria-hidden="true"></i>`;
      card.appendChild(icon);
    }
    
    // Feature title
    const title = document.createElement('h3');
    title.className = 'feature-title';
    title.textContent = featureData.title;
    card.appendChild(title);
    
    // Feature description
    const description = document.createElement('p');
    description.className = 'feature-description';
    description.textContent = featureData.description;
    card.appendChild(description);
    
    // Feature details (initially hidden)
    if (featureData.details) {
      const details = document.createElement('div');
      details.className = 'feature-details';
      
      featureData.details.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        detailItem.innerHTML = `<i class="fas fa-check"></i> ${detail}`;
        details.appendChild(detailItem);
      });
      
      card.appendChild(details);
    }
    
    // Feature action button
    if (featureData.action) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'feature-action-btn';
      actionBtn.textContent = featureData.action.label;
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleFeatureAction(featureData.action, index);
      });
      card.appendChild(actionBtn);
    }
    
    // Expand indicator
    const expandIndicator = document.createElement('div');
    expandIndicator.className = 'expand-indicator';
    expandIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
    card.appendChild(expandIndicator);
    
    return card;
  }

  /**
   * Create platform details panel
   */
  createPlatformDetails() {
    const details = document.createElement('div');
    details.className = 'platform-details';
    
    if (!this.slideData.platform) {
      return details;
    }
    
    const platform = this.slideData.platform;
    
    // Technology stack
    if (platform.technologies && platform.technologies.length > 0) {
      const techSection = document.createElement('div');
      techSection.className = 'tech-section';
      
      const techTitle = document.createElement('h3');
      techTitle.textContent = 'Technology Stack';
      techSection.appendChild(techTitle);
      
      const techGrid = document.createElement('div');
      techGrid.className = 'tech-grid';
      
      platform.technologies.forEach(tech => {
        const techItem = document.createElement('div');
        techItem.className = 'tech-item';
        techItem.innerHTML = `<i class="${tech.icon}"></i> ${tech.name}`;
        techGrid.appendChild(techItem);
      });
      
      techSection.appendChild(techGrid);
      details.appendChild(techSection);
    }
    
    // Benefits section
    if (platform.benefits && platform.benefits.length > 0) {
      const benefitsSection = document.createElement('div');
      benefitsSection.className = 'benefits-section';
      
      const benefitsTitle = document.createElement('h3');
      benefitsTitle.textContent = 'Key Benefits';
      benefitsSection.appendChild(benefitsTitle);
      
      const benefitsList = document.createElement('ul');
      benefitsList.className = 'benefits-list';
      
      platform.benefits.forEach(benefit => {
        const benefitItem = document.createElement('li');
        benefitItem.innerHTML = `<i class="fas fa-star"></i> ${benefit}`;
        benefitsList.appendChild(benefitItem);
      });
      
      benefitsSection.appendChild(benefitsList);
      details.appendChild(benefitsSection);
    }
    
    return details;
  }

  /**
   * Set up platform specific interactions
   */
  setupInteractiveElements() {
    super.setupInteractiveElements();
    
    // Add click handlers for feature cards
    const featureCards = this.element.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        this.toggleFeatureCard(index);
      });
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleFeatureCard(index);
        }
      });
    });
    
    // Add hover effects
    featureCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        this.highlightFeature(index, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.highlightFeature(index, false);
      });
    });
  }

  /**
   * Toggle feature card expansion
   */
  toggleFeatureCard(index) {
    const card = this.element.querySelector(`[data-feature="${index}"]`);
    if (!card) return;
    
    const isExpanded = this.expandedCards.has(index);
    
    if (isExpanded) {
      // Collapse card
      this.expandedCards.delete(index);
      card.classList.remove('expanded');
      card.setAttribute('aria-expanded', 'false');
    } else {
      // Expand card
      this.expandedCards.add(index);
      card.classList.add('expanded');
      card.setAttribute('aria-expanded', 'true');
    }
    
    // Update expand indicator
    const indicator = card.querySelector('.expand-indicator i');
    if (indicator) {
      indicator.className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    }
    
    // Emit feature toggle event
    this.eventBus.emit('platform:featureToggled', {
      slideId: this.slideData.id,
      featureIndex: index,
      expanded: !isExpanded,
      feature: this.slideData.platform.features[index]
    });
  }

  /**
   * Highlight feature on hover
   */
  highlightFeature(index, highlight) {
    const card = this.element.querySelector(`[data-feature="${index}"]`);
    if (!card) return;
    
    if (highlight) {
      card.classList.add('highlighted');
    } else {
      card.classList.remove('highlighted');
    }
  }

  /**
   * Handle feature action button click
   */
  handleFeatureAction(action, featureIndex) {
    this.eventBus.emit('platform:actionTriggered', {
      slideId: this.slideData.id,
      featureIndex: featureIndex,
      action: action
    });
    
    // Handle different action types
    switch (action.type) {
      case 'navigate':
        if (action.target) {
          this.eventBus.emit('navigation:goToSlide', { slideId: action.target });
        }
        break;
      case 'external':
        if (action.url) {
          window.open(action.url, '_blank');
        }
        break;
      case 'demo':
        this.triggerDemo(action, featureIndex);
        break;
    }
  }

  /**
   * Trigger demo functionality
   */
  triggerDemo(action, featureIndex) {
    console.log('Platform demo triggered:', action);
    
    this.eventBus.emit('platform:demoTriggered', {
      slideId: this.slideData.id,
      featureIndex: featureIndex,
      action: action
    });
  }

  /**
   * Start platform slide animations
   */
  startAnimations() {
    super.startAnimations();
    
    // Animate platform header
    const header = this.element.querySelector('.platform-header');
    if (header) {
      setTimeout(() => {
        header.classList.add('animated');
      }, 500);
    }
    
    // Animate feature cards in sequence
    const featureCards = this.element.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animated');
      }, 800 + (index * 150));
    });
    
    // Animate platform details
    const details = this.element.querySelector('.platform-details');
    if (details) {
      setTimeout(() => {
        details.classList.add('animated');
      }, 1200 + (featureCards.length * 150));
    }
  }

  /**
   * Expand all feature cards
   */
  expandAllFeatures() {
    if (!this.slideData.platform || !this.slideData.platform.features) {
      return;
    }
    
    this.slideData.platform.features.forEach((_, index) => {
      if (!this.expandedCards.has(index)) {
        this.toggleFeatureCard(index);
      }
    });
  }

  /**
   * Collapse all feature cards
   */
  collapseAllFeatures() {
    Array.from(this.expandedCards).forEach(index => {
      this.toggleFeatureCard(index);
    });
  }

  /**
   * Get platform data
   */
  getPlatformData() {
    return {
      platform: this.slideData.platform,
      activeFeature: this.activeFeature,
      expandedCards: Array.from(this.expandedCards)
    };
  }

  /**
   * Reset platform to initial state
   */
  resetPlatform() {
    this.collapseAllFeatures();
    this.activeFeature = 0;
  }
}
