// Workflow Slide Component
// Specific component for workflow process slides

import { BaseSlide } from './BaseSlide.js';

export class WorkflowSlide extends BaseSlide {
  constructor(slideData, eventBus) {
    super(slideData, eventBus);
    this.currentStep = 0;
    this.completedSteps = new Set();
  }

  /**
   * Create main content for workflow slide
   */
  createMainContent() {
    const content = document.createElement('div');
    content.className = 'slide-content xcloud-workflow-slide';

    // Create the exact structure from your original HTML
    content.innerHTML = `
      <h2 class="slide-title">${this.slideData.title}</h2>

      <!-- Prerequisites Section -->
      <div class="prerequisites-section">
        <div class="prerequisites-header">
          <i class="${this.slideData.prerequisites.header.icon}"></i>
          <h3>${this.slideData.prerequisites.header.title}</h3>
        </div>
        <div class="prerequisites-content">
          ${this.slideData.prerequisites.items.map(item => `
            <div class="prerequisite-item">
              <i class="${item.icon}"></i>
              <span>${item.text}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Workflow Navigation -->
      <div class="workflow-navigation">
        <div class="workflow-progress">
          <div class="progress-line-workflow"></div>
          <div class="progress-fill-workflow" id="workflowProgress"></div>
        </div>

        <div class="workflow-steps-container">
          ${this.slideData.workflow.steps.map(step => `
            <!-- Step ${step.id}: ${step.title} -->
            <div class="workflow-step" data-step="${step.id}">
              <div class="step-marker-workflow">
                <i class="${step.icon}"></i>
                <span class="step-number">${step.id}</span>
              </div>
              <div class="step-info">
                <h4>${step.title}</h4>
                <span class="step-description">${step.description}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Expandable Content Panel -->
      <div class="workflow-details-panel" id="workflowDetailsPanel">
        ${this.slideData.workflow.steps.map(step => this.createStepContent(step)).join('')}
      </div>

      <!-- Workflow Navigation Hint -->
      <div class="workflow-hint">
        <div class="hint-section">
          <i class="fas fa-hand-pointer"></i>
          <span>Click any workflow step to explore details</span>
        </div>
        <div class="hint-section">
          <i class="fas fa-keyboard"></i>
          <span>Use <kbd>↑</kbd> <kbd>↓</kbd> keys to navigate steps • <kbd>Esc</kbd> to close</span>
        </div>
      </div>
    `;

    return content;
  }

  /**
   * Create step content for workflow details panel
   */
  createStepContent(step) {
    if (step.id === 1) {
      return `
        <!-- Step 1 Content -->
        <div class="workflow-details-content" data-step="1">
          <div class="details-header-workflow">
            <h3>${step.title}</h3>
            <span class="details-badge">${step.details.badge}</span>
          </div>
          <div class="process-overview">
            ${step.details.items.map(item => `
              <div class="overview-item">
                <div class="overview-icon">
                  <i class="${item.icon}"></i>
                </div>
                <div class="overview-content">
                  <h5>${item.title}</h5>
                  <p>${item.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (step.id === 2) {
      return `
        <!-- Step 2 Content -->
        <div class="workflow-details-content" data-step="2">
          <div class="details-header-workflow">
            <h3>${step.title}</h3>
            <span class="details-badge">${step.details.badge}</span>
          </div>
          <div class="comparison-container">
            <div class="comparison-side before">
              <div class="comparison-header">
                <i class="${step.details.comparison.before.icon}"></i>
                <h4>${step.details.comparison.before.title}</h4>
              </div>
              <div class="comparison-content">
                <ul class="comparison-list">
                  ${step.details.comparison.before.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <div class="time-indicator">
                  <span class="time-value">${step.details.comparison.before.time.value}</span>
                  <span class="time-label">${step.details.comparison.before.time.label}</span>
                </div>
              </div>
            </div>
            <div class="comparison-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
            <div class="comparison-side after">
              <div class="comparison-header">
                <i class="${step.details.comparison.after.icon}"></i>
                <h4>${step.details.comparison.after.title}</h4>
              </div>
              <div class="comparison-content">
                <ul class="comparison-list">
                  ${step.details.comparison.after.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <div class="time-indicator success">
                  <span class="time-value">${step.details.comparison.after.time.value}</span>
                  <span class="time-label">${step.details.comparison.after.time.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (step.id === 3) {
      return `
        <!-- Step 3 Content -->
        <div class="workflow-details-content" data-step="3">
          <div class="details-header-workflow">
            <h3>${step.title}</h3>
            <span class="details-badge">${step.details.badge}</span>
          </div>
          <div class="demo-section">
            <div class="demo-actions">
              <button class="demo-button primary" onclick="window.open('vscode://file', '_blank')">
                <i class="fas fa-code"></i>
                <span>Open VS Code</span>
              </button>
              <button class="demo-button secondary" onclick="window.open('https://github.com/xCloudDev/xCloud/pulls', '_blank')">
                <i class="fab fa-github"></i>
                <span>View GitHub PRs</span>
              </button>
            </div>

            <div class="demo-workflow">
              <div class="workflow-step-demo">
                <div class="step-number-demo">1</div>
                <div class="step-content-demo">
                  <h5>Select Pull Request</h5>
                  <p>Choose the PR ID from xCloud repository</p>
                  <div class="code-example">
                    <code>PR #1234: Feature - User Authentication</code>
                  </div>
                </div>
              </div>

              <div class="workflow-step-demo">
                <div class="step-number-demo">2</div>
                <div class="step-content-demo">
                  <h5>Generate with Augment</h5>
                  <p>Use AI to create comprehensive test cases</p>
                  <div class="markdown-template">
                    <div class="template-header">
                      <i class="fab fa-markdown"></i>
                      <span>Markdown Prompt Template</span>
                    </div>
                    <div class="template-content">
                      <pre><code>
# Test Case Generation for PR #{PR_ID}

## Context
- Feature: {FEATURE_NAME}
- Changes: {CHANGE_DESCRIPTION}
- Files Modified: {FILE_LIST}

## Generate test cases covering:
- Functional testing scenarios
- Edge cases and boundary conditions
- Integration testing points
- Security considerations
- Performance implications
                      </code></pre>
                    </div>
                  </div>
                </div>
              </div>

              <div class="workflow-step-demo">
                <div class="step-number-demo">3</div>
                <div class="step-content-demo">
                  <h5>Review & Execute</h5>
                  <p>Validate generated test cases and execute testing</p>
                  <div class="results-preview">
                    <div class="result-item">
                      <i class="fas fa-check-circle"></i>
                      <span>25 test cases generated</span>
                    </div>
                    <div class="result-item">
                      <i class="fas fa-shield-alt"></i>
                      <span>Security tests included</span>
                    </div>
                    <div class="result-item">
                      <i class="fas fa-tachometer-alt"></i>
                      <span>Performance tests added</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }

  /**
   * Create workflow diagram with steps
   */
  createWorkflowDiagram() {
    const diagram = document.createElement('div');
    diagram.className = 'workflow-diagram';
    
    if (!this.slideData.workflow || !this.slideData.workflow.steps) {
      return diagram;
    }
    
    const steps = this.slideData.workflow.steps;
    
    steps.forEach((step, index) => {
      const stepElement = this.createWorkflowStep(step, index);
      diagram.appendChild(stepElement);
      
      // Add connector arrow (except for last step)
      if (index < steps.length - 1) {
        const connector = this.createStepConnector(index);
        diagram.appendChild(connector);
      }
    });
    
    return diagram;
  }

  /**
   * Create individual workflow step
   */
  createWorkflowStep(stepData, index) {
    const step = document.createElement('div');
    step.className = 'workflow-step';
    step.setAttribute('data-step', index);
    step.setAttribute('role', 'button');
    step.setAttribute('tabindex', '0');
    step.setAttribute('aria-label', `Workflow step ${index + 1}: ${stepData.title}`);
    
    // Step number
    const stepNumber = document.createElement('div');
    stepNumber.className = 'step-number';
    stepNumber.textContent = index + 1;
    step.appendChild(stepNumber);
    
    // Step icon
    if (stepData.icon) {
      const icon = document.createElement('div');
      icon.className = 'step-icon';
      icon.innerHTML = `<i class="${stepData.icon}" aria-hidden="true"></i>`;
      step.appendChild(icon);
    }
    
    // Step title
    const title = document.createElement('div');
    title.className = 'step-title';
    title.textContent = stepData.title;
    step.appendChild(title);
    
    // Step status indicator
    const status = document.createElement('div');
    status.className = 'step-status';
    step.appendChild(status);
    
    return step;
  }

  /**
   * Create connector arrow between steps
   */
  createStepConnector(index) {
    const connector = document.createElement('div');
    connector.className = 'step-connector';
    connector.setAttribute('data-connector', index);
    
    const arrow = document.createElement('div');
    arrow.className = 'connector-arrow';
    arrow.innerHTML = '<i class="fas fa-arrow-right" aria-hidden="true"></i>';
    connector.appendChild(arrow);
    
    return connector;
  }

  /**
   * Create step details panel
   */
  createStepDetails() {
    const details = document.createElement('div');
    details.className = 'step-details';
    
    if (!this.slideData.workflow || !this.slideData.workflow.steps) {
      return details;
    }
    
    // Initialize with first step
    const firstStep = this.slideData.workflow.steps[0];
    if (firstStep) {
      this.updateStepDetails(details, firstStep, 0);
    }
    
    return details;
  }

  /**
   * Update step details panel
   */
  updateStepDetails(detailsElement, stepData, index) {
    detailsElement.innerHTML = '';
    
    // Step header
    const header = document.createElement('div');
    header.className = 'details-header';
    
    const stepNumber = document.createElement('span');
    stepNumber.className = 'details-step-number';
    stepNumber.textContent = `Step ${index + 1}`;
    header.appendChild(stepNumber);
    
    const title = document.createElement('h3');
    title.className = 'details-title';
    title.textContent = stepData.title;
    header.appendChild(title);
    
    detailsElement.appendChild(header);
    
    // Step description
    const description = document.createElement('p');
    description.className = 'details-description';
    description.textContent = stepData.description;
    detailsElement.appendChild(description);
    
    // Step actions/tools
    if (stepData.tools && stepData.tools.length > 0) {
      const toolsSection = document.createElement('div');
      toolsSection.className = 'details-tools';
      
      const toolsTitle = document.createElement('h4');
      toolsTitle.textContent = 'Tools & Technologies:';
      toolsSection.appendChild(toolsTitle);
      
      const toolsList = document.createElement('ul');
      stepData.tools.forEach(tool => {
        const toolItem = document.createElement('li');
        toolItem.innerHTML = `<i class="fas fa-tool"></i> ${tool}`;
        toolsList.appendChild(toolItem);
      });
      
      toolsSection.appendChild(toolsList);
      detailsElement.appendChild(toolsSection);
    }
    
    // Step benefits/outcomes
    if (stepData.benefits && stepData.benefits.length > 0) {
      const benefitsSection = document.createElement('div');
      benefitsSection.className = 'details-benefits';
      
      const benefitsTitle = document.createElement('h4');
      benefitsTitle.textContent = 'Key Benefits:';
      benefitsSection.appendChild(benefitsTitle);
      
      const benefitsList = document.createElement('ul');
      stepData.benefits.forEach(benefit => {
        const benefitItem = document.createElement('li');
        benefitItem.innerHTML = `<i class="fas fa-check-circle"></i> ${benefit}`;
        benefitsList.appendChild(benefitItem);
      });
      
      benefitsSection.appendChild(benefitsList);
      detailsElement.appendChild(benefitsSection);
    }
    
    // Action button if available
    if (stepData.action) {
      const actionButton = document.createElement('button');
      actionButton.className = 'details-action-btn';
      actionButton.innerHTML = `${stepData.action.label} <i class="fas fa-external-link-alt"></i>`;
      actionButton.addEventListener('click', () => {
        this.handleStepAction(stepData.action, index);
      });
      detailsElement.appendChild(actionButton);
    }
  }

  /**
   * Create workflow controls
   */
  createWorkflowControls() {
    const controls = document.createElement('div');
    controls.className = 'workflow-controls';
    
    // Previous step button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'workflow-btn workflow-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous Step';
    prevBtn.setAttribute('aria-label', 'Previous workflow step');
    controls.appendChild(prevBtn);
    
    // Progress indicator
    const progress = document.createElement('div');
    progress.className = 'workflow-progress';
    
    if (this.slideData.workflow && this.slideData.workflow.steps) {
      this.slideData.workflow.steps.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.setAttribute('data-step', index);
        dot.setAttribute('title', `Step ${index + 1}`);
        progress.appendChild(dot);
      });
    }
    
    controls.appendChild(progress);
    
    // Next step button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'workflow-btn workflow-next';
    nextBtn.innerHTML = 'Next Step <i class="fas fa-chevron-right"></i>';
    nextBtn.setAttribute('aria-label', 'Next workflow step');
    controls.appendChild(nextBtn);
    
    // Reset workflow button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'workflow-btn workflow-reset';
    resetBtn.innerHTML = '<i class="fas fa-redo"></i> Reset';
    resetBtn.setAttribute('aria-label', 'Reset workflow');
    controls.appendChild(resetBtn);
    
    return controls;
  }

  /**
   * Set up workflow specific interactions
   */
  setupInteractiveElements() {
    super.setupInteractiveElements();
    
    // Add click handlers for workflow steps
    const steps = this.element.querySelectorAll('.workflow-step');
    steps.forEach((step, index) => {
      step.addEventListener('click', () => {
        this.goToStep(index);
      });
      
      step.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.goToStep(index);
        }
      });
    });
    
    // Add navigation button handlers
    const prevBtn = this.element.querySelector('.workflow-prev');
    const nextBtn = this.element.querySelector('.workflow-next');
    const resetBtn = this.element.querySelector('.workflow-reset');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.previousStep();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextStep();
      });
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetWorkflow();
      });
    }
    
    // Add progress dot handlers
    const progressDots = this.element.querySelectorAll('.progress-dot');
    progressDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToStep(index);
      });
    });
  }

  /**
   * Navigate to specific step
   */
  goToStep(index) {
    if (!this.slideData.workflow || !this.slideData.workflow.steps) {
      return;
    }
    
    const steps = this.slideData.workflow.steps;
    if (index < 0 || index >= steps.length) {
      return;
    }
    
    // Mark previous step as completed
    if (this.currentStep < index) {
      this.completedSteps.add(this.currentStep);
    }
    
    this.currentStep = index;
    
    // Update visual state
    this.updateStepStates();
    
    // Update details panel
    const detailsElement = this.element.querySelector('.step-details');
    if (detailsElement) {
      this.updateStepDetails(detailsElement, steps[index], index);
    }
    
    // Update progress
    this.updateProgress();
    
    // Emit step change event
    this.eventBus.emit('workflow:stepChanged', {
      slideId: this.slideData.id,
      stepIndex: index,
      step: steps[index],
      completedSteps: Array.from(this.completedSteps)
    });
  }

  /**
   * Go to previous step
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  }

  /**
   * Go to next step
   */
  nextStep() {
    if (this.slideData.workflow && this.currentStep < this.slideData.workflow.steps.length - 1) {
      this.goToStep(this.currentStep + 1);
    }
  }

  /**
   * Reset workflow to first step
   */
  resetWorkflow() {
    this.completedSteps.clear();
    this.goToStep(0);
  }

  /**
   * Update step visual states
   */
  updateStepStates() {
    const steps = this.element.querySelectorAll('.workflow-step');
    
    steps.forEach((step, index) => {
      step.classList.remove('active', 'completed', 'upcoming');
      
      if (this.completedSteps.has(index)) {
        step.classList.add('completed');
      } else if (index === this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.add('upcoming');
      }
    });
    
    // Update connectors
    const connectors = this.element.querySelectorAll('.step-connector');
    connectors.forEach((connector, index) => {
      connector.classList.remove('active', 'completed');
      
      if (this.completedSteps.has(index)) {
        connector.classList.add('completed');
      } else if (index === this.currentStep) {
        connector.classList.add('active');
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
      
      if (this.completedSteps.has(index)) {
        dot.classList.add('completed');
      } else if (index === this.currentStep) {
        dot.classList.add('active');
      }
    });
    
    // Update navigation buttons
    const prevBtn = this.element.querySelector('.workflow-prev');
    const nextBtn = this.element.querySelector('.workflow-next');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentStep === 0;
    }
    
    if (nextBtn && this.slideData.workflow) {
      nextBtn.disabled = this.currentStep === this.slideData.workflow.steps.length - 1;
    }
  }

  /**
   * Handle step action button click
   */
  handleStepAction(action, stepIndex) {
    this.eventBus.emit('workflow:actionTriggered', {
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
      case 'demo':
        // Handle demo action
        this.triggerDemo(action);
        break;
    }
  }

  /**
   * Trigger demo functionality
   */
  triggerDemo(action) {
    // Placeholder for demo functionality
    console.log('Demo triggered:', action);
    
    this.eventBus.emit('workflow:demoTriggered', {
      slideId: this.slideData.id,
      action: action
    });
  }

  /**
   * Start workflow slide animations
   */
  startAnimations() {
    super.startAnimations();
    
    // Animate workflow steps in sequence
    const steps = this.element.querySelectorAll('.workflow-step');
    steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('animated');
      }, 500 + (index * 200));
    });
    
    // Animate connectors
    const connectors = this.element.querySelectorAll('.step-connector');
    connectors.forEach((connector, index) => {
      setTimeout(() => {
        connector.classList.add('animated');
      }, 700 + (index * 200));
    });
    
    // Initialize first step
    setTimeout(() => {
      this.goToStep(0);
    }, 1000 + (steps.length * 200));
  }

  /**
   * Get workflow data
   */
  getWorkflowData() {
    return {
      workflow: this.slideData.workflow,
      currentStep: this.currentStep,
      completedSteps: Array.from(this.completedSteps),
      totalSteps: this.slideData.workflow ? this.slideData.workflow.steps.length : 0
    };
  }
}
