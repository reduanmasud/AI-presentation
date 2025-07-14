// Security Slide Component
// Specific component for security-focused slides

import { BaseSlide } from './BaseSlide.js';

export class SecuritySlide extends BaseSlide {
  constructor(slideData, eventBus) {
    super(slideData, eventBus);
    this.activeSection = 0;
    this.revealedItems = new Set();
    this.animationQueue = [];
  }

  /**
   * Create main content for security slide
   */
  createMainContent() {
    const content = document.createElement('div');
    content.className = 'slide-content security-testing-slide';

    // Create the exact structure from your original HTML
    content.innerHTML = `
      <h2 class="slide-title">${this.slideData.title}</h2>

      <!-- Security Testing Grid -->
      <div class="security-testing-grid">
        ${this.slideData.security.testingAreas.map(area => `
          <!-- ${area.title} -->
          <div class="security-area clickable" data-expandable="security-${area.id}">
            <div class="security-area-header">
              <div class="security-icon">
                <i class="${area.icon}"></i>
              </div>
              <h3>${area.title}</h3>
              <div class="expand-indicator">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
            <div class="security-area-preview">
              <p>${area.preview}</p>
            </div>
            <div class="security-area-details" id="security-${area.id}">
              <div class="details-content">
                <div class="testing-methods">
                  <h4>Testing Methods:</h4>
                  <ul>
                    ${area.details.methods.map(method => `<li>${method}</li>`).join('')}
                  </ul>
                </div>
                <div class="ai-applications">
                  <h4>AI Applications:</h4>
                  <ul>
                    ${area.details.aiApplications.map(app => `<li>${app}</li>`).join('')}
                  </ul>
                </div>
                <div class="tools-section">
                  <h4>Tools & Techniques:</h4>
                  <div class="tools-grid">
                    ${area.details.tools.map(tool => `<span class="tool-badge">${tool}</span>`).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Security Metrics -->
      <div class="security-metrics">
        <div class="metrics-header">
          <i class="${this.slideData.security.metrics.header.icon}"></i>
          <h3>${this.slideData.security.metrics.header.title}</h3>
        </div>
        <div class="metrics-grid">
          ${this.slideData.security.metrics.stats.map(stat => `
            <div class="metric-item">
              <div class="metric-value">${stat.value}</div>
              <div class="metric-label">${stat.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Interactive Hint -->
      <div class="security-hint">
        <div class="hint-section">
          <i class="fas fa-hand-pointer"></i>
          <span>Click any security area to explore testing methods and AI applications</span>
        </div>
      </div>
    `;

    return content;
  }

  /**
   * Create security overview section
   */
  createSecurityOverview() {
    const overview = document.createElement('div');
    overview.className = 'security-overview';
    
    if (!this.slideData.security) {
      return overview;
    }
    
    const security = this.slideData.security;
    
    // Security icon
    const icon = document.createElement('div');
    icon.className = 'security-icon';
    icon.innerHTML = '<i class="fas fa-shield-alt" aria-hidden="true"></i>';
    overview.appendChild(icon);
    
    // Security statement
    if (security.statement) {
      const statement = document.createElement('p');
      statement.className = 'security-statement';
      statement.textContent = security.statement;
      overview.appendChild(statement);
    }
    
    // Security level indicator
    if (security.level) {
      const levelIndicator = document.createElement('div');
      levelIndicator.className = 'security-level';
      
      const levelLabel = document.createElement('span');
      levelLabel.className = 'level-label';
      levelLabel.textContent = 'Security Level:';
      levelIndicator.appendChild(levelLabel);
      
      const levelValue = document.createElement('span');
      levelValue.className = `level-value ${security.level.toLowerCase()}`;
      levelValue.textContent = security.level;
      levelIndicator.appendChild(levelValue);
      
      overview.appendChild(levelIndicator);
    }
    
    return overview;
  }

  /**
   * Create security sections
   */
  createSecuritySections() {
    const sectionsContainer = document.createElement('div');
    sectionsContainer.className = 'security-sections';
    
    if (!this.slideData.security || !this.slideData.security.sections) {
      return sectionsContainer;
    }
    
    this.slideData.security.sections.forEach((section, index) => {
      const sectionElement = this.createSecuritySection(section, index);
      sectionsContainer.appendChild(sectionElement);
    });
    
    return sectionsContainer;
  }

  /**
   * Create individual security section
   */
  createSecuritySection(sectionData, index) {
    const section = document.createElement('div');
    section.className = 'security-section';
    section.setAttribute('data-section', index);
    section.setAttribute('role', 'button');
    section.setAttribute('tabindex', '0');
    section.setAttribute('aria-label', `Security section: ${sectionData.title}`);
    section.setAttribute('aria-expanded', 'false');
    
    // Section header
    const header = document.createElement('div');
    header.className = 'section-header';
    
    // Section icon
    if (sectionData.icon) {
      const icon = document.createElement('div');
      icon.className = 'section-icon';
      icon.innerHTML = `<i class="${sectionData.icon}" aria-hidden="true"></i>`;
      header.appendChild(icon);
    }
    
    // Section title
    const title = document.createElement('h3');
    title.className = 'section-title';
    title.textContent = sectionData.title;
    header.appendChild(title);
    
    // Section status
    if (sectionData.status) {
      const status = document.createElement('div');
      status.className = `section-status ${sectionData.status.toLowerCase()}`;
      status.textContent = sectionData.status;
      header.appendChild(status);
    }
    
    // Expand indicator
    const expandIndicator = document.createElement('div');
    expandIndicator.className = 'expand-indicator';
    expandIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
    header.appendChild(expandIndicator);
    
    section.appendChild(header);
    
    // Section content (initially hidden)
    const content = document.createElement('div');
    content.className = 'section-content';
    
    // Section description
    if (sectionData.description) {
      const description = document.createElement('p');
      description.className = 'section-description';
      description.textContent = sectionData.description;
      content.appendChild(description);
    }
    
    // Security measures
    if (sectionData.measures && sectionData.measures.length > 0) {
      const measuresContainer = document.createElement('div');
      measuresContainer.className = 'security-measures';
      
      const measuresTitle = document.createElement('h4');
      measuresTitle.textContent = 'Security Measures:';
      measuresContainer.appendChild(measuresTitle);
      
      const measuresList = document.createElement('ul');
      sectionData.measures.forEach((measure, measureIndex) => {
        const measureItem = document.createElement('li');
        measureItem.className = 'measure-item';
        measureItem.setAttribute('data-measure', measureIndex);
        measureItem.innerHTML = `<i class="fas fa-check-circle"></i> ${measure}`;
        measuresList.appendChild(measureItem);
      });
      
      measuresContainer.appendChild(measuresList);
      content.appendChild(measuresContainer);
    }
    
    // Threats addressed
    if (sectionData.threats && sectionData.threats.length > 0) {
      const threatsContainer = document.createElement('div');
      threatsContainer.className = 'security-threats';
      
      const threatsTitle = document.createElement('h4');
      threatsTitle.textContent = 'Threats Addressed:';
      threatsContainer.appendChild(threatsTitle);
      
      const threatsList = document.createElement('ul');
      sectionData.threats.forEach(threat => {
        const threatItem = document.createElement('li');
        threatItem.className = 'threat-item';
        threatItem.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${threat}`;
        threatsList.appendChild(threatItem);
      });
      
      threatsContainer.appendChild(threatsList);
      content.appendChild(threatsContainer);
    }
    
    section.appendChild(content);
    
    return section;
  }

  /**
   * Create security metrics section
   */
  createSecurityMetrics() {
    const metrics = document.createElement('div');
    metrics.className = 'security-metrics';
    
    if (!this.slideData.security || !this.slideData.security.metrics) {
      return metrics;
    }
    
    const metricsTitle = document.createElement('h3');
    metricsTitle.textContent = 'Security Metrics';
    metrics.appendChild(metricsTitle);
    
    const metricsGrid = document.createElement('div');
    metricsGrid.className = 'metrics-grid';
    
    this.slideData.security.metrics.forEach((metric, index) => {
      const metricCard = this.createMetricCard(metric, index);
      metricsGrid.appendChild(metricCard);
    });
    
    metrics.appendChild(metricsGrid);
    
    return metrics;
  }

  /**
   * Create individual metric card
   */
  createMetricCard(metricData, index) {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.setAttribute('data-metric', index);
    
    // Metric icon
    if (metricData.icon) {
      const icon = document.createElement('div');
      icon.className = 'metric-icon';
      icon.innerHTML = `<i class="${metricData.icon}" aria-hidden="true"></i>`;
      card.appendChild(icon);
    }
    
    // Metric value
    const value = document.createElement('div');
    value.className = 'metric-value';
    value.textContent = metricData.value;
    card.appendChild(value);
    
    // Metric label
    const label = document.createElement('div');
    label.className = 'metric-label';
    label.textContent = metricData.label;
    card.appendChild(label);
    
    // Metric trend (if available)
    if (metricData.trend) {
      const trend = document.createElement('div');
      trend.className = `metric-trend ${metricData.trend}`;
      
      const trendIcon = metricData.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
      trend.innerHTML = `<i class="fas ${trendIcon}"></i>`;
      card.appendChild(trend);
    }
    
    return card;
  }

  /**
   * Set up security specific interactions
   */
  setupInteractiveElements() {
    super.setupInteractiveElements();
    
    // Add click handlers for security sections
    const sections = this.element.querySelectorAll('.security-section');
    sections.forEach((section, index) => {
      section.addEventListener('click', () => {
        this.toggleSection(index);
      });
      
      section.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleSection(index);
        }
      });
    });
    
    // Add hover effects for metric cards
    const metricCards = this.element.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        this.highlightMetric(index, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.highlightMetric(index, false);
      });
    });
  }

  /**
   * Toggle security section expansion
   */
  toggleSection(index) {
    const section = this.element.querySelector(`[data-section="${index}"]`);
    if (!section) return;
    
    const isExpanded = section.classList.contains('expanded');
    
    if (isExpanded) {
      // Collapse section
      section.classList.remove('expanded');
      section.setAttribute('aria-expanded', 'false');
    } else {
      // Expand section
      section.classList.add('expanded');
      section.setAttribute('aria-expanded', 'true');
      
      // Reveal measures with animation
      this.revealSectionMeasures(index);
    }
    
    // Update expand indicator
    const indicator = section.querySelector('.expand-indicator i');
    if (indicator) {
      indicator.className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    }
    
    // Emit section toggle event
    this.eventBus.emit('security:sectionToggled', {
      slideId: this.slideData.id,
      sectionIndex: index,
      expanded: !isExpanded,
      section: this.slideData.security.sections[index]
    });
  }

  /**
   * Reveal section measures with animation
   */
  revealSectionMeasures(sectionIndex) {
    const section = this.element.querySelector(`[data-section="${sectionIndex}"]`);
    if (!section) return;
    
    const measures = section.querySelectorAll('.measure-item');
    measures.forEach((measure, index) => {
      setTimeout(() => {
        measure.classList.add('revealed');
        this.revealedItems.add(`${sectionIndex}-${index}`);
      }, index * 200);
    });
  }

  /**
   * Highlight metric card
   */
  highlightMetric(index, highlight) {
    const card = this.element.querySelector(`[data-metric="${index}"]`);
    if (!card) return;
    
    if (highlight) {
      card.classList.add('highlighted');
    } else {
      card.classList.remove('highlighted');
    }
  }

  /**
   * Expand all security sections
   */
  expandAllSections() {
    if (!this.slideData.security || !this.slideData.security.sections) {
      return;
    }
    
    this.slideData.security.sections.forEach((_, index) => {
      const section = this.element.querySelector(`[data-section="${index}"]`);
      if (section && !section.classList.contains('expanded')) {
        this.toggleSection(index);
      }
    });
  }

  /**
   * Collapse all security sections
   */
  collapseAllSections() {
    if (!this.slideData.security || !this.slideData.security.sections) {
      return;
    }
    
    this.slideData.security.sections.forEach((_, index) => {
      const section = this.element.querySelector(`[data-section="${index}"]`);
      if (section && section.classList.contains('expanded')) {
        this.toggleSection(index);
      }
    });
  }

  /**
   * Start security slide animations
   */
  startAnimations() {
    super.startAnimations();
    
    // Animate security overview
    const overview = this.element.querySelector('.security-overview');
    if (overview) {
      setTimeout(() => {
        overview.classList.add('animated');
      }, 500);
    }
    
    // Animate security sections in sequence
    const sections = this.element.querySelectorAll('.security-section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('animated');
      }, 800 + (index * 200));
    });
    
    // Animate metrics cards
    const metricCards = this.element.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animated');
      }, 1200 + (sections.length * 200) + (index * 100));
    });
  }

  /**
   * Simulate security scan
   */
  simulateSecurityScan() {
    const sections = this.element.querySelectorAll('.security-section');
    
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('scanning');
        
        setTimeout(() => {
          section.classList.remove('scanning');
          section.classList.add('scan-complete');
        }, 2000);
      }, index * 500);
    });
    
    // Emit scan complete event
    setTimeout(() => {
      this.eventBus.emit('security:scanComplete', {
        slideId: this.slideData.id,
        results: this.getSecurityScanResults()
      });
    }, sections.length * 500 + 2000);
  }

  /**
   * Get security scan results
   */
  getSecurityScanResults() {
    if (!this.slideData.security || !this.slideData.security.sections) {
      return {};
    }
    
    return {
      totalSections: this.slideData.security.sections.length,
      passedSections: this.slideData.security.sections.filter(s => s.status === 'Secure').length,
      warnings: this.slideData.security.sections.filter(s => s.status === 'Warning').length,
      critical: this.slideData.security.sections.filter(s => s.status === 'Critical').length
    };
  }

  /**
   * Get security data
   */
  getSecurityData() {
    return {
      security: this.slideData.security,
      activeSection: this.activeSection,
      revealedItems: Array.from(this.revealedItems)
    };
  }

  /**
   * Reset security slide to initial state
   */
  resetSecurity() {
    this.activeSection = 0;
    this.revealedItems.clear();
    this.collapseAllSections();
    
    // Remove scan states
    const sections = this.element.querySelectorAll('.security-section');
    sections.forEach(section => {
      section.classList.remove('scanning', 'scan-complete');
    });
  }
}
