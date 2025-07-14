// Agenda Slide Component
// Specific component for workshop agenda slides

import { BaseSlide } from './BaseSlide.js';

export class AgendaSlide extends BaseSlide {
  constructor(slideData, eventBus) {
    super(slideData, eventBus);
    this.visitedItems = new Set();
  }

  /**
   * Create main content for agenda slide
   */
  createMainContent() {
    const content = document.createElement('div');
    content.className = 'slide-content agenda-slide';

    // Create the exact structure from your original HTML
    content.innerHTML = `
      <h2 class="slide-title">${this.slideData.title}</h2>
      <div class="agenda-grid">
        ${this.slideData.agendaItems.map(item => `
          <div class="agenda-item clickable" data-reveal="${item.reveal}" data-target-slide="${item.targetSlide}">
            <div class="agenda-marker">
              <i class="${item.icon}"></i>
              <span class="agenda-number">${item.number}</span>
            </div>
            <div class="agenda-content">
              <h3>${item.title}</h3>
              <p>${item.description}</p>
              <div class="click-hint">
                <i class="fas fa-arrow-right"></i>
                <span>Click to explore</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="agenda-footer">
        <p class="agenda-instruction">
          <i class="${this.slideData.footer.icon}"></i>
          ${this.slideData.footer.instruction}
        </p>
      </div>
    `;

    return content;
  }

  /**
   * Create agenda items grid
   */
  createAgendaGrid() {
    const grid = document.createElement('div');
    grid.className = 'agenda-grid';
    
    if (!this.slideData.agendaItems || !Array.isArray(this.slideData.agendaItems)) {
      return grid;
    }
    
    this.slideData.agendaItems.forEach((item, index) => {
      const agendaItem = this.createAgendaItem(item, index);
      grid.appendChild(agendaItem);
    });
    
    return grid;
  }

  /**
   * Create individual agenda item
   */
  createAgendaItem(itemData, index) {
    const item = document.createElement('div');
    item.className = 'agenda-item animate-on-enter';
    item.setAttribute('data-reveal', itemData.reveal || index + 1);
    item.setAttribute('data-target', itemData.targetSlide);
    item.setAttribute('data-action', 'navigate');
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Navigate to ${itemData.title}`);
    
    // Create agenda number
    const number = document.createElement('div');
    number.className = 'agenda-number';
    number.textContent = itemData.number || index + 1;
    item.appendChild(number);
    
    // Create agenda icon
    if (itemData.icon) {
      const icon = document.createElement('i');
      icon.className = `agenda-icon ${itemData.icon}`;
      icon.setAttribute('aria-hidden', 'true');
      item.appendChild(icon);
    }
    
    // Create agenda title
    const title = document.createElement('h3');
    title.className = 'agenda-title';
    title.textContent = itemData.title;
    item.appendChild(title);
    
    // Create agenda description
    const description = document.createElement('p');
    description.className = 'agenda-description';
    description.textContent = itemData.description;
    item.appendChild(description);
    
    // Create target indicator
    if (itemData.targetSlide) {
      const target = document.createElement('div');
      target.className = 'agenda-target';
      target.innerHTML = '<span>Go to section</span> <i class="fas fa-arrow-right"></i>';
      item.appendChild(target);
    }
    
    return item;
  }

  /**
   * Create instruction footer
   */
  createInstruction() {
    if (!this.slideData.footer) {
      return document.createElement('div');
    }
    
    const instruction = document.createElement('div');
    instruction.className = 'agenda-instruction';
    
    if (this.slideData.footer.icon) {
      const icon = document.createElement('i');
      icon.className = this.slideData.footer.icon;
      icon.setAttribute('aria-hidden', 'true');
      instruction.appendChild(icon);
    }
    
    const text = document.createElement('span');
    text.textContent = this.slideData.footer.instruction;
    instruction.appendChild(text);
    
    return instruction;
  }

  /**
   * Create progress indicator
   */
  createProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'agenda-progress';
    
    if (!this.slideData.agendaItems) {
      return progressContainer;
    }
    
    this.slideData.agendaItems.forEach((item, index) => {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      dot.setAttribute('data-item', index);
      progressContainer.appendChild(dot);
    });
    
    return progressContainer;
  }

  /**
   * Set up agenda specific interactions
   */
  setupInteractiveElements() {
    super.setupInteractiveElements();
    
    // Add click handlers for agenda items
    const agendaItems = this.element.querySelectorAll('.agenda-item');
    agendaItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        this.handleAgendaItemClick(item, index, e);
      });
      
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleAgendaItemClick(item, index, e);
        }
      });
      
      // Add hover effects
      item.addEventListener('mouseenter', () => {
        this.highlightAgendaItem(item, true);
      });
      
      item.addEventListener('mouseleave', () => {
        this.highlightAgendaItem(item, false);
      });
    });
  }

  /**
   * Handle agenda item click
   */
  handleAgendaItemClick(item, index, event) {
    event.preventDefault();
    
    // Add click animation
    item.classList.add('clicked');
    setTimeout(() => {
      item.classList.remove('clicked');
    }, 150);
    
    // Mark as visited
    this.visitedItems.add(index);
    item.classList.add('visited');
    
    // Update progress indicator
    this.updateProgressIndicator(index);
    
    // Navigate to target slide
    const targetSlide = item.getAttribute('data-target');
    if (targetSlide) {
      this.eventBus.emit('navigation:goToSlide', { slideId: targetSlide });
      
      // Emit agenda item clicked event
      this.eventBus.emit('agenda:itemClicked', {
        slideId: this.slideData.id,
        itemIndex: index,
        targetSlide: targetSlide,
        itemData: this.slideData.agendaItems[index]
      });
    }
  }

  /**
   * Highlight agenda item on hover
   */
  highlightAgendaItem(item, highlight) {
    if (highlight) {
      item.style.transform = 'translateY(-10px)';
      item.style.boxShadow = 'var(--shadow-lg)';
    } else {
      item.style.transform = '';
      item.style.boxShadow = '';
    }
  }

  /**
   * Update progress indicator
   */
  updateProgressIndicator(activeIndex) {
    const dots = this.element.querySelectorAll('.progress-dot');
    
    dots.forEach((dot, index) => {
      dot.classList.remove('active', 'completed');
      
      if (index === activeIndex) {
        dot.classList.add('active');
      } else if (this.visitedItems.has(index)) {
        dot.classList.add('completed');
      }
    });
  }

  /**
   * Start agenda slide animations
   */
  startAnimations() {
    super.startAnimations();
    
    // Animate agenda items with staggered delay
    const agendaItems = this.element.querySelectorAll('.agenda-item');
    
    agendaItems.forEach((item, index) => {
      const delay = 200 + (index * 150);
      setTimeout(() => {
        item.classList.add('animated');
      }, delay);
    });
    
    // Animate instruction after items
    const instruction = this.element.querySelector('.agenda-instruction');
    if (instruction) {
      setTimeout(() => {
        instruction.classList.add('animated');
      }, 200 + (agendaItems.length * 150) + 300);
    }
  }

  /**
   * Reveal agenda items progressively
   */
  revealAgendaItems() {
    const items = this.element.querySelectorAll('.agenda-item');
    
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('revealed');
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  /**
   * Get visited agenda items
   */
  getVisitedItems() {
    return Array.from(this.visitedItems);
  }

  /**
   * Mark agenda item as visited
   */
  markItemAsVisited(index) {
    this.visitedItems.add(index);
    const item = this.element.querySelector(`[data-reveal="${index + 1}"]`);
    if (item) {
      item.classList.add('visited');
    }
    this.updateProgressIndicator(index);
  }

  /**
   * Reset agenda progress
   */
  resetProgress() {
    this.visitedItems.clear();
    
    const items = this.element.querySelectorAll('.agenda-item');
    items.forEach(item => {
      item.classList.remove('visited');
    });
    
    const dots = this.element.querySelectorAll('.progress-dot');
    dots.forEach(dot => {
      dot.classList.remove('active', 'completed');
    });
  }

  /**
   * Get agenda data
   */
  getAgendaData() {
    return {
      agendaItems: this.slideData.agendaItems,
      footer: this.slideData.footer,
      visitedItems: this.getVisitedItems()
    };
  }

  /**
   * Refresh agenda slide content
   */
  refresh() {
    super.refresh();
    
    // Rebuild agenda grid if data changed
    const agendaGrid = this.element.querySelector('.agenda-grid');
    if (agendaGrid && this.slideData.agendaItems) {
      agendaGrid.innerHTML = '';
      this.slideData.agendaItems.forEach((item, index) => {
        const agendaItem = this.createAgendaItem(item, index);
        agendaGrid.appendChild(agendaItem);
      });
      
      // Re-setup interactions
      this.setupInteractiveElements();
    }
  }
}
