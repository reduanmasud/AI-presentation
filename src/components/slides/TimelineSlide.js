// Timeline Slide Component
// Specific component for timeline slides showing AI evolution

import { BaseSlide } from './BaseSlide.js';

export class TimelineSlide extends BaseSlide {
  constructor(slideData, eventBus) {
    super(slideData, eventBus);
    this.currentMilestone = 0;
    this.isAnimating = false;
  }

  /**
   * Create main content for timeline slide
   */
  createMainContent() {
    const content = document.createElement('div');
    content.className = 'slide-content ai-evolution-slide';

    // Create the exact structure from your original HTML
    content.innerHTML = `
      <h2 class="slide-title">${this.slideData.title}</h2>
      <div class="evolution-subtitle">
        <p>${this.slideData.subtitle}</p>
      </div>

      <div class="ai-timeline-horizontal">
        <!-- Timeline Progress Line -->
        <div class="timeline-progress-horizontal">
          <div class="progress-line-horizontal"></div>
          <div class="progress-fill-horizontal" id="timelineProgressHorizontal"></div>
        </div>

        <!-- Horizontal Milestones Container -->
        <div class="milestones-container">
          ${this.slideData.timeline.milestones.map(milestone => `
            <!-- Milestone ${milestone.id}: ${milestone.title} -->
            <div class="milestone-horizontal" data-milestone="${milestone.id}" data-year="${milestone.year}">
              <div class="milestone-marker-horizontal">
                <i class="${milestone.icon}"></i>
                <div class="milestone-pulse-horizontal"></div>
              </div>
              <div class="milestone-info">
                <h4>${milestone.title}</h4>
                <span class="milestone-year-horizontal">${milestone.year}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Expandable Details Panel -->
        <div class="milestone-details-panel" id="detailsPanel">
          ${this.slideData.timeline.milestones.map(milestone => `
            <!-- Milestone ${milestone.id} Details -->
            <div class="milestone-details-content" data-milestone="${milestone.id}">
              <div class="details-header">
                <h3>${milestone.title}</h3>
                <span class="details-year">${milestone.year}</span>
              </div>
              <div class="details-summary">
                <p>"${milestone.summary}"</p>
              </div>
              <div class="details-list">
                <ul>
                  ${milestone.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
                <div class="details-tools">
                  ${milestone.tools.map(tool => `<span class="tool-badge">${tool}</span>`).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Interactive Hint -->
      <div class="timeline-hint">
        <div class="hint-section">
          <i class="fas fa-hand-pointer"></i>
          <span>Click any milestone to explore details</span>
        </div>
        <div class="hint-section">
          <i class="fas fa-keyboard"></i>
          <span>Use <kbd>↑</kbd> <kbd>↓</kbd> keys to navigate timeline • <kbd>Esc</kbd> to close</span>
        </div>
      </div>
    `;

    return content;
  }

  /**
   * Create timeline container with milestones
   */
  createTimelineContainer() {
    const container = document.createElement('div');
    container.className = 'timeline-container';
    
    if (!this.slideData.timeline || !this.slideData.timeline.milestones) {
      return container;
    }
    
    const timeline = this.slideData.timeline;
    
    // Create timeline line
    const timelineLine = document.createElement('div');
    timelineLine.className = `timeline-line ${timeline.type || 'horizontal'}`;
    container.appendChild(timelineLine);
    
    // Create milestones
    const milestonesContainer = document.createElement('div');
    milestonesContainer.className = 'timeline-milestones';
    
    timeline.milestones.forEach((milestone, index) => {
      const milestoneElement = this.createMilestone(milestone, index);
      milestonesContainer.appendChild(milestoneElement);
    });
    
    container.appendChild(milestonesContainer);
    
    return container;
  }

  /**
   * Create individual milestone element
   */
  createMilestone(milestoneData, index) {
    const milestone = document.createElement('div');
    milestone.className = 'timeline-milestone';
    milestone.setAttribute('data-milestone', index);
    milestone.setAttribute('data-year', milestoneData.year);
    milestone.setAttribute('role', 'button');
    milestone.setAttribute('tabindex', '0');
    milestone.setAttribute('aria-label', `Timeline milestone: ${milestoneData.year} - ${milestoneData.title}`);
    
    // Create milestone marker
    const marker = document.createElement('div');
    marker.className = 'milestone-marker';
    
    if (milestoneData.icon) {
      const icon = document.createElement('i');
      icon.className = milestoneData.icon;
      icon.setAttribute('aria-hidden', 'true');
      marker.appendChild(icon);
    }
    
    milestone.appendChild(marker);
    
    // Create milestone year
    const year = document.createElement('div');
    year.className = 'milestone-year';
    year.textContent = milestoneData.year;
    milestone.appendChild(year);
    
    // Create milestone title
    const title = document.createElement('div');
    title.className = 'milestone-title';
    title.textContent = milestoneData.title;
    milestone.appendChild(title);
    
    // Create milestone description (initially hidden)
    const description = document.createElement('div');
    description.className = 'milestone-description';
    description.textContent = milestoneData.description;
    milestone.appendChild(description);
    
    return milestone;
  }

  /**
   * Create timeline navigation controls
   */
  createTimelineControls() {
    const controls = document.createElement('div');
    controls.className = 'timeline-controls';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'timeline-btn timeline-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
    prevBtn.setAttribute('aria-label', 'Previous milestone');
    controls.appendChild(prevBtn);
    
    // Progress indicator
    const progress = document.createElement('div');
    progress.className = 'timeline-progress';
    
    if (this.slideData.timeline && this.slideData.timeline.milestones) {
      this.slideData.timeline.milestones.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.setAttribute('data-milestone', index);
        progress.appendChild(dot);
      });
    }
    
    controls.appendChild(progress);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'timeline-btn timeline-next';
    nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    nextBtn.setAttribute('aria-label', 'Next milestone');
    controls.appendChild(nextBtn);
    
    return controls;
  }

  /**
   * Create milestone details panel
   */
  createMilestoneDetails() {
    const details = document.createElement('div');
    details.className = 'milestone-details';
    
    if (!this.slideData.timeline || !this.slideData.timeline.milestones) {
      return details;
    }
    
    // Create details for first milestone
    const firstMilestone = this.slideData.timeline.milestones[0];
    if (firstMilestone) {
      this.updateMilestoneDetails(details, firstMilestone, 0);
    }
    
    return details;
  }

  /**
   * Update milestone details panel
   */
  updateMilestoneDetails(detailsElement, milestoneData, index) {
    detailsElement.innerHTML = '';
    
    // Year and title
    const header = document.createElement('div');
    header.className = 'details-header';
    
    const year = document.createElement('h3');
    year.className = 'details-year';
    year.textContent = milestoneData.year;
    header.appendChild(year);
    
    const title = document.createElement('h4');
    title.className = 'details-title';
    title.textContent = milestoneData.title;
    header.appendChild(title);
    
    detailsElement.appendChild(header);
    
    // Description
    const description = document.createElement('p');
    description.className = 'details-description';
    description.textContent = milestoneData.description;
    detailsElement.appendChild(description);
    
    // Additional details if available
    if (milestoneData.details) {
      const additionalDetails = document.createElement('div');
      additionalDetails.className = 'details-additional';
      
      milestoneData.details.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        detailItem.innerHTML = `<i class="fas fa-check"></i> ${detail}`;
        additionalDetails.appendChild(detailItem);
      });
      
      detailsElement.appendChild(additionalDetails);
    }
  }

  /**
   * Set up timeline specific interactions
   */
  setupInteractiveElements() {
    super.setupInteractiveElements();
    
    // Add click handlers for milestones
    const milestones = this.element.querySelectorAll('.timeline-milestone');
    milestones.forEach((milestone, index) => {
      milestone.addEventListener('click', () => {
        this.goToMilestone(index);
      });
      
      milestone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.goToMilestone(index);
        }
      });
    });
    
    // Add navigation button handlers
    const prevBtn = this.element.querySelector('.timeline-prev');
    const nextBtn = this.element.querySelector('.timeline-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.previousMilestone();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextMilestone();
      });
    }
    
    // Add progress dot handlers
    const progressDots = this.element.querySelectorAll('.progress-dot');
    progressDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToMilestone(index);
      });
    });
  }

  /**
   * Navigate to specific milestone
   */
  goToMilestone(index) {
    if (this.isAnimating || !this.slideData.timeline || !this.slideData.timeline.milestones) {
      return;
    }
    
    const milestones = this.slideData.timeline.milestones;
    if (index < 0 || index >= milestones.length) {
      return;
    }
    
    this.isAnimating = true;
    this.currentMilestone = index;
    
    // Update visual state
    this.updateMilestoneStates();
    
    // Update details panel
    const detailsElement = this.element.querySelector('.milestone-details');
    if (detailsElement) {
      this.updateMilestoneDetails(detailsElement, milestones[index], index);
    }
    
    // Update progress
    this.updateProgress();
    
    // Emit milestone change event
    this.eventBus.emit('timeline:milestoneChanged', {
      slideId: this.slideData.id,
      milestoneIndex: index,
      milestone: milestones[index]
    });
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  /**
   * Go to previous milestone
   */
  previousMilestone() {
    if (this.currentMilestone > 0) {
      this.goToMilestone(this.currentMilestone - 1);
    }
  }

  /**
   * Go to next milestone
   */
  nextMilestone() {
    if (this.slideData.timeline && this.currentMilestone < this.slideData.timeline.milestones.length - 1) {
      this.goToMilestone(this.currentMilestone + 1);
    }
  }

  /**
   * Update milestone visual states
   */
  updateMilestoneStates() {
    const milestones = this.element.querySelectorAll('.timeline-milestone');
    
    milestones.forEach((milestone, index) => {
      milestone.classList.remove('active', 'completed', 'upcoming');
      
      if (index < this.currentMilestone) {
        milestone.classList.add('completed');
      } else if (index === this.currentMilestone) {
        milestone.classList.add('active');
      } else {
        milestone.classList.add('upcoming');
      }
    });
  }

  /**
   * Update progress indicator
   */
  updateProgress() {
    const progressDots = this.element.querySelectorAll('.progress-dot');
    
    progressDots.forEach((dot, index) => {
      dot.classList.remove('active', 'completed');
      
      if (index < this.currentMilestone) {
        dot.classList.add('completed');
      } else if (index === this.currentMilestone) {
        dot.classList.add('active');
      }
    });
    
    // Update navigation buttons
    const prevBtn = this.element.querySelector('.timeline-prev');
    const nextBtn = this.element.querySelector('.timeline-next');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentMilestone === 0;
    }
    
    if (nextBtn && this.slideData.timeline) {
      nextBtn.disabled = this.currentMilestone === this.slideData.timeline.milestones.length - 1;
    }
  }

  /**
   * Start timeline slide animations
   */
  startAnimations() {
    super.startAnimations();
    
    // Animate timeline line
    const timelineLine = this.element.querySelector('.timeline-line');
    if (timelineLine) {
      setTimeout(() => {
        timelineLine.classList.add('animated');
      }, 500);
    }
    
    // Animate milestones in sequence
    const milestones = this.element.querySelectorAll('.timeline-milestone');
    milestones.forEach((milestone, index) => {
      setTimeout(() => {
        milestone.classList.add('animated');
      }, 800 + (index * 200));
    });
    
    // Initialize first milestone
    setTimeout(() => {
      this.goToMilestone(0);
    }, 1500);
  }

  /**
   * Get timeline data
   */
  getTimelineData() {
    return {
      timeline: this.slideData.timeline,
      currentMilestone: this.currentMilestone,
      totalMilestones: this.slideData.timeline ? this.slideData.timeline.milestones.length : 0
    };
  }

  /**
   * Reset timeline to first milestone
   */
  resetTimeline() {
    this.goToMilestone(0);
  }
}
