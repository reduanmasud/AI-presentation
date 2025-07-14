// Conclusion Slide Component
// Specific component for conclusion/summary slides

import { BaseSlide } from './BaseSlide.js';

export class ConclusionSlide extends BaseSlide {
  constructor(slideData, eventBus) {
    super(slideData, eventBus);
    this.currentHighlight = 0;
    this.animationComplete = false;
  }

  /**
   * Create main content for conclusion slide
   */
  createMainContent() {
    const content = document.createElement('div');
    content.className = 'slide-content conclusion-slide';

    // Create the exact structure from your original HTML
    content.innerHTML = `
      <h2 class="slide-title">${this.slideData.title}</h2>

      <!-- Key Takeaways -->
      <div class="key-takeaways">
        <div class="takeaways-header">
          <i class="${this.slideData.conclusion.takeaways.header.icon}"></i>
          <h3>${this.slideData.conclusion.takeaways.header.title}</h3>
        </div>
        <div class="takeaways-grid">
          ${this.slideData.conclusion.takeaways.items.map(item => `
            <div class="takeaway-item">
              <div class="takeaway-icon">
                <i class="${item.icon}"></i>
              </div>
              <div class="takeaway-content">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Next Steps -->
      <div class="next-steps">
        <div class="steps-header">
          <i class="${this.slideData.conclusion.nextSteps.header.icon}"></i>
          <h3>${this.slideData.conclusion.nextSteps.header.title}</h3>
        </div>
        <div class="steps-list">
          ${this.slideData.conclusion.nextSteps.items.map((step, index) => `
            <div class="step-item">
              <div class="step-number">${index + 1}</div>
              <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Call to Action -->
      <div class="call-to-action">
        <div class="cta-content">
          <h3>${this.slideData.conclusion.callToAction.title}</h3>
          <p>${this.slideData.conclusion.callToAction.message}</p>
          <div class="cta-buttons">
            ${this.slideData.conclusion.callToAction.buttons.map(button => `
              <a href="${button.url}" target="_blank" class="cta-button ${button.type}">
                <i class="${button.icon}"></i>
                <span>${button.text}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Thank You -->
      <div class="thank-you-section">
        <div class="thank-you-content">
          <h2>${this.slideData.conclusion.thankYou.title}</h2>
          <p>${this.slideData.conclusion.thankYou.message}</p>
          <div class="contact-info">
            ${this.slideData.conclusion.thankYou.contacts.map(contact => `
              <div class="contact-item">
                <i class="${contact.icon}"></i>
                <span>${contact.text}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    return content;
  }

  /**
   * Create conclusion header
   */
  createConclusionHeader() {
    const header = document.createElement('div');
    header.className = 'conclusion-header';
    
    if (!this.slideData.conclusion) {
      return header;
    }
    
    const conclusion = this.slideData.conclusion;
    
    // Conclusion icon
    const icon = document.createElement('div');
    icon.className = 'conclusion-icon';
    icon.innerHTML = '<i class="fas fa-flag-checkered" aria-hidden="true"></i>';
    header.appendChild(icon);
    
    // Summary statement
    if (conclusion.summary) {
      const summary = document.createElement('p');
      summary.className = 'conclusion-summary';
      summary.textContent = conclusion.summary;
      header.appendChild(summary);
    }
    
    // Achievement stats
    if (conclusion.achievements && conclusion.achievements.length > 0) {
      const achievements = document.createElement('div');
      achievements.className = 'conclusion-achievements';
      
      conclusion.achievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';
        
        const value = document.createElement('div');
        value.className = 'achievement-value';
        value.textContent = achievement.value;
        achievementItem.appendChild(value);
        
        const label = document.createElement('div');
        label.className = 'achievement-label';
        label.textContent = achievement.label;
        achievementItem.appendChild(label);
        
        achievements.appendChild(achievementItem);
      });
      
      header.appendChild(achievements);
    }
    
    return header;
  }

  /**
   * Create key takeaways section
   */
  createKeyTakeaways() {
    const takeaways = document.createElement('div');
    takeaways.className = 'key-takeaways';
    
    if (!this.slideData.conclusion || !this.slideData.conclusion.takeaways) {
      return takeaways;
    }
    
    const takeawaysTitle = document.createElement('h3');
    takeawaysTitle.textContent = 'Key Takeaways';
    takeaways.appendChild(takeawaysTitle);
    
    const takeawaysList = document.createElement('div');
    takeawaysList.className = 'takeaways-list';
    
    this.slideData.conclusion.takeaways.forEach((takeaway, index) => {
      const takeawayItem = this.createTakeawayItem(takeaway, index);
      takeawaysList.appendChild(takeawayItem);
    });
    
    takeaways.appendChild(takeawaysList);
    
    return takeaways;
  }

  /**
   * Create individual takeaway item
   */
  createTakeawayItem(takeawayData, index) {
    const item = document.createElement('div');
    item.className = 'takeaway-item';
    item.setAttribute('data-takeaway', index);
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Key takeaway: ${takeawayData.title}`);
    
    // Takeaway number
    const number = document.createElement('div');
    number.className = 'takeaway-number';
    number.textContent = index + 1;
    item.appendChild(number);
    
    // Takeaway content
    const content = document.createElement('div');
    content.className = 'takeaway-content';
    
    // Takeaway title
    const title = document.createElement('h4');
    title.className = 'takeaway-title';
    title.textContent = takeawayData.title;
    content.appendChild(title);
    
    // Takeaway description
    if (takeawayData.description) {
      const description = document.createElement('p');
      description.className = 'takeaway-description';
      description.textContent = takeawayData.description;
      content.appendChild(description);
    }
    
    // Takeaway impact
    if (takeawayData.impact) {
      const impact = document.createElement('div');
      impact.className = 'takeaway-impact';
      impact.innerHTML = `<i class="fas fa-chart-line"></i> ${takeawayData.impact}`;
      content.appendChild(impact);
    }
    
    item.appendChild(content);
    
    // Takeaway icon
    if (takeawayData.icon) {
      const icon = document.createElement('div');
      icon.className = 'takeaway-icon';
      icon.innerHTML = `<i class="${takeawayData.icon}" aria-hidden="true"></i>`;
      item.appendChild(icon);
    }
    
    return item;
  }

  /**
   * Create next steps section
   */
  createNextSteps() {
    const nextSteps = document.createElement('div');
    nextSteps.className = 'next-steps';
    
    if (!this.slideData.conclusion || !this.slideData.conclusion.nextSteps) {
      return nextSteps;
    }
    
    const nextStepsTitle = document.createElement('h3');
    nextStepsTitle.textContent = 'Next Steps';
    nextSteps.appendChild(nextStepsTitle);
    
    const stepsList = document.createElement('div');
    stepsList.className = 'steps-list';
    
    this.slideData.conclusion.nextSteps.forEach((step, index) => {
      const stepItem = this.createNextStepItem(step, index);
      stepsList.appendChild(stepItem);
    });
    
    nextSteps.appendChild(stepsList);
    
    return nextSteps;
  }

  /**
   * Create individual next step item
   */
  createNextStepItem(stepData, index) {
    const item = document.createElement('div');
    item.className = 'next-step-item';
    item.setAttribute('data-step', index);
    
    // Step timeline
    const timeline = document.createElement('div');
    timeline.className = 'step-timeline';
    timeline.textContent = stepData.timeline || `Step ${index + 1}`;
    item.appendChild(timeline);
    
    // Step content
    const content = document.createElement('div');
    content.className = 'step-content';
    
    const title = document.createElement('h4');
    title.className = 'step-title';
    title.textContent = stepData.title;
    content.appendChild(title);
    
    if (stepData.description) {
      const description = document.createElement('p');
      description.className = 'step-description';
      description.textContent = stepData.description;
      content.appendChild(description);
    }
    
    item.appendChild(content);
    
    // Step action
    if (stepData.action) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'step-action-btn';
      actionBtn.innerHTML = `${stepData.action.label} <i class="fas fa-arrow-right"></i>`;
      actionBtn.addEventListener('click', () => {
        this.handleStepAction(stepData.action, index);
      });
      item.appendChild(actionBtn);
    }
    
    return item;
  }

  /**
   * Create call to action section
   */
  createCallToAction() {
    const cta = document.createElement('div');
    cta.className = 'call-to-action';
    
    if (!this.slideData.conclusion || !this.slideData.conclusion.callToAction) {
      return cta;
    }
    
    const ctaData = this.slideData.conclusion.callToAction;
    
    // CTA title
    const title = document.createElement('h3');
    title.className = 'cta-title';
    title.textContent = ctaData.title;
    cta.appendChild(title);
    
    // CTA message
    if (ctaData.message) {
      const message = document.createElement('p');
      message.className = 'cta-message';
      message.textContent = ctaData.message;
      cta.appendChild(message);
    }
    
    // CTA buttons
    if (ctaData.actions && ctaData.actions.length > 0) {
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'cta-actions';
      
      ctaData.actions.forEach((action, index) => {
        const actionBtn = document.createElement('button');
        actionBtn.className = `cta-btn ${action.type || 'primary'}`;
        actionBtn.innerHTML = `<i class="${action.icon}"></i> ${action.label}`;
        actionBtn.addEventListener('click', () => {
          this.handleCTAAction(action, index);
        });
        actionsContainer.appendChild(actionBtn);
      });
      
      cta.appendChild(actionsContainer);
    }
    
    // Contact information
    if (ctaData.contact) {
      const contact = document.createElement('div');
      contact.className = 'cta-contact';
      
      if (ctaData.contact.email) {
        const email = document.createElement('div');
        email.className = 'contact-item';
        email.innerHTML = `<i class="fas fa-envelope"></i> ${ctaData.contact.email}`;
        contact.appendChild(email);
      }
      
      if (ctaData.contact.phone) {
        const phone = document.createElement('div');
        phone.className = 'contact-item';
        phone.innerHTML = `<i class="fas fa-phone"></i> ${ctaData.contact.phone}`;
        contact.appendChild(phone);
      }
      
      cta.appendChild(contact);
    }
    
    return cta;
  }

  /**
   * Set up conclusion specific interactions
   */
  setupInteractiveElements() {
    super.setupInteractiveElements();
    
    // Add click handlers for takeaway items
    const takeawayItems = this.element.querySelectorAll('.takeaway-item');
    takeawayItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.highlightTakeaway(index);
      });
      
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.highlightTakeaway(index);
        }
      });
    });
    
    // Add hover effects
    takeawayItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        item.classList.add('hovered');
      });
      
      item.addEventListener('mouseleave', () => {
        item.classList.remove('hovered');
      });
    });
  }

  /**
   * Highlight specific takeaway
   */
  highlightTakeaway(index) {
    // Remove previous highlights
    const takeawayItems = this.element.querySelectorAll('.takeaway-item');
    takeawayItems.forEach(item => {
      item.classList.remove('highlighted');
    });
    
    // Highlight selected takeaway
    const selectedItem = this.element.querySelector(`[data-takeaway="${index}"]`);
    if (selectedItem) {
      selectedItem.classList.add('highlighted');
      this.currentHighlight = index;
      
      // Emit highlight event
      this.eventBus.emit('conclusion:takeawayHighlighted', {
        slideId: this.slideData.id,
        takeawayIndex: index,
        takeaway: this.slideData.conclusion.takeaways[index]
      });
    }
  }

  /**
   * Handle next step action
   */
  handleStepAction(action, stepIndex) {
    this.eventBus.emit('conclusion:stepActionTriggered', {
      slideId: this.slideData.id,
      stepIndex: stepIndex,
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
      case 'restart':
        this.eventBus.emit('navigation:restart');
        break;
    }
  }

  /**
   * Handle call to action
   */
  handleCTAAction(action, actionIndex) {
    this.eventBus.emit('conclusion:ctaActionTriggered', {
      slideId: this.slideData.id,
      actionIndex: actionIndex,
      action: action
    });
    
    // Handle different action types
    switch (action.type) {
      case 'external':
        if (action.url) {
          window.open(action.url, '_blank');
        }
        break;
      case 'email':
        if (action.email) {
          window.location.href = `mailto:${action.email}`;
        }
        break;
      case 'download':
        if (action.url) {
          const link = document.createElement('a');
          link.href = action.url;
          link.download = action.filename || 'download';
          link.click();
        }
        break;
      case 'restart':
        this.eventBus.emit('navigation:restart');
        break;
    }
  }

  /**
   * Start conclusion slide animations
   */
  startAnimations() {
    super.startAnimations();
    
    // Animate conclusion header
    const header = this.element.querySelector('.conclusion-header');
    if (header) {
      setTimeout(() => {
        header.classList.add('animated');
      }, 500);
    }
    
    // Animate takeaways in sequence
    const takeawayItems = this.element.querySelectorAll('.takeaway-item');
    takeawayItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animated');
      }, 1000 + (index * 300));
    });
    
    // Animate next steps
    const nextStepItems = this.element.querySelectorAll('.next-step-item');
    nextStepItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animated');
      }, 1500 + (takeawayItems.length * 300) + (index * 200));
    });
    
    // Animate call to action
    const cta = this.element.querySelector('.call-to-action');
    if (cta) {
      setTimeout(() => {
        cta.classList.add('animated');
      }, 2000 + (takeawayItems.length * 300) + (nextStepItems.length * 200));
    }
    
    // Mark animation as complete
    setTimeout(() => {
      this.animationComplete = true;
      this.eventBus.emit('conclusion:animationComplete', {
        slideId: this.slideData.id
      });
    }, 2500 + (takeawayItems.length * 300) + (nextStepItems.length * 200));
  }

  /**
   * Cycle through takeaway highlights
   */
  cycleTakeaways() {
    if (!this.slideData.conclusion || !this.slideData.conclusion.takeaways) {
      return;
    }
    
    const totalTakeaways = this.slideData.conclusion.takeaways.length;
    const nextHighlight = (this.currentHighlight + 1) % totalTakeaways;
    this.highlightTakeaway(nextHighlight);
  }

  /**
   * Show summary animation
   */
  showSummaryAnimation() {
    const takeawayItems = this.element.querySelectorAll('.takeaway-item');
    
    takeawayItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('summary-highlight');
        
        setTimeout(() => {
          item.classList.remove('summary-highlight');
        }, 1000);
      }, index * 200);
    });
  }

  /**
   * Get conclusion data
   */
  getConclusionData() {
    return {
      conclusion: this.slideData.conclusion,
      currentHighlight: this.currentHighlight,
      animationComplete: this.animationComplete
    };
  }

  /**
   * Reset conclusion slide
   */
  resetConclusion() {
    this.currentHighlight = 0;
    this.animationComplete = false;
    
    // Remove all highlights
    const takeawayItems = this.element.querySelectorAll('.takeaway-item');
    takeawayItems.forEach(item => {
      item.classList.remove('highlighted', 'hovered', 'summary-highlight');
    });
  }
}
