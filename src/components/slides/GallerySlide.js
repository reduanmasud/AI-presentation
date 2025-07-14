// Gallery Slide Component
// Specific component for gallery/showcase slides

import { BaseSlide } from './BaseSlide.js';

export class GallerySlide extends BaseSlide {
  constructor(slideData, eventBus) {
    super(slideData, eventBus);
    this.currentItem = 0;
    this.expandedItems = new Set();
    this.isModalOpen = false;
  }

  /**
   * Create main content for gallery slide
   */
  createMainContent() {
    const content = document.createElement('div');
    content.className = 'slide-content timeline-slide';

    // Create the exact structure from your original HTML
    content.innerHTML = `
      <h2 class="slide-title">${this.slideData.title}</h2>
      <div class="gemini-showcase">
        <!-- App Screenshots Gallery -->
        <div class="gemini-gallery">
          <div class="gallery-container">
            ${this.slideData.gallery.screenshots.map((screenshot, index) => `
              <div class="screenshot-item ${index === 0 ? 'active' : ''}" data-screenshot="${screenshot.id}">
                <img src="${screenshot.image}" alt="${screenshot.alt}" />
                <div class="screenshot-caption">
                  <h4>${screenshot.title}</h4>
                  <p>${screenshot.description}</p>
                  <a href="${screenshot.demoLink}" target="_blank" class="demo-link">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                  </a>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Gallery Navigation -->
          <div class="gallery-nav">
            <button class="gallery-nav-btn gallery-prev-btn" onclick="changeScreenshot(-1, event)">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="gallery-dots">
              ${this.slideData.gallery.screenshots.map((screenshot, index) => `
                <span class="gallery-dot ${index === 0 ? 'active' : ''}" onclick="currentScreenshot(${screenshot.id}, event)"></span>
              `).join('')}
            </div>
            <button class="gallery-nav-btn gallery-next-btn" onclick="changeScreenshot(1, event)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Project Link -->
        <div class="project-link-section">
          <a href="${this.slideData.gallery.projectLink.url}" target="_blank" class="project-link-btn">
            <i class="${this.slideData.gallery.projectLink.icon}"></i>
            <span>${this.slideData.gallery.projectLink.text}</span>
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    `;

    return content;
  }

  /**
   * Create gallery header
   */
  createGalleryHeader() {
    const header = document.createElement('div');
    header.className = 'gallery-header';
    
    if (!this.slideData.gallery) {
      return header;
    }
    
    const gallery = this.slideData.gallery;
    
    // Gallery description
    if (gallery.description) {
      const description = document.createElement('p');
      description.className = 'gallery-description';
      description.textContent = gallery.description;
      header.appendChild(description);
    }
    
    // Gallery filters/categories
    if (gallery.categories && gallery.categories.length > 0) {
      const filters = document.createElement('div');
      filters.className = 'gallery-filters';
      
      // All filter
      const allFilter = document.createElement('button');
      allFilter.className = 'filter-btn active';
      allFilter.textContent = 'All';
      allFilter.setAttribute('data-filter', 'all');
      filters.appendChild(allFilter);
      
      // Category filters
      gallery.categories.forEach(category => {
        const filterBtn = document.createElement('button');
        filterBtn.className = 'filter-btn';
        filterBtn.textContent = category;
        filterBtn.setAttribute('data-filter', category.toLowerCase());
        filters.appendChild(filterBtn);
      });
      
      header.appendChild(filters);
    }
    
    return header;
  }

  /**
   * Create gallery grid
   */
  createGalleryGrid() {
    const grid = document.createElement('div');
    grid.className = 'gallery-grid';
    
    if (!this.slideData.gallery || !this.slideData.gallery.items) {
      return grid;
    }
    
    this.slideData.gallery.items.forEach((item, index) => {
      const galleryItem = this.createGalleryItem(item, index);
      grid.appendChild(galleryItem);
    });
    
    return grid;
  }

  /**
   * Create individual gallery item
   */
  createGalleryItem(itemData, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-item', index);
    item.setAttribute('data-category', itemData.category || 'all');
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Gallery item: ${itemData.title}`);
    
    // Item image/screenshot
    if (itemData.image) {
      const imageContainer = document.createElement('div');
      imageContainer.className = 'item-image-container';
      
      const image = document.createElement('img');
      image.className = 'item-image';
      image.src = itemData.image;
      image.alt = itemData.title;
      image.loading = 'lazy';
      imageContainer.appendChild(image);
      
      // Image overlay
      const overlay = document.createElement('div');
      overlay.className = 'item-overlay';
      
      const expandIcon = document.createElement('i');
      expandIcon.className = 'fas fa-expand-alt';
      expandIcon.setAttribute('aria-hidden', 'true');
      overlay.appendChild(expandIcon);
      
      imageContainer.appendChild(overlay);
      item.appendChild(imageContainer);
    }
    
    // Item content
    const content = document.createElement('div');
    content.className = 'item-content';
    
    // Item title
    const title = document.createElement('h3');
    title.className = 'item-title';
    title.textContent = itemData.title;
    content.appendChild(title);
    
    // Item description
    if (itemData.description) {
      const description = document.createElement('p');
      description.className = 'item-description';
      description.textContent = itemData.description;
      content.appendChild(description);
    }
    
    // Item tags
    if (itemData.tags && itemData.tags.length > 0) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'item-tags';
      
      itemData.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'item-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
      
      content.appendChild(tagsContainer);
    }
    
    // Item actions
    if (itemData.actions && itemData.actions.length > 0) {
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'item-actions';
      
      itemData.actions.forEach(action => {
        const actionBtn = document.createElement('button');
        actionBtn.className = 'item-action-btn';
        actionBtn.innerHTML = `<i class="${action.icon}"></i> ${action.label}`;
        actionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleItemAction(action, index);
        });
        actionsContainer.appendChild(actionBtn);
      });
      
      content.appendChild(actionsContainer);
    }
    
    item.appendChild(content);
    
    return item;
  }

  /**
   * Create gallery navigation
   */
  createGalleryNavigation() {
    const navigation = document.createElement('div');
    navigation.className = 'gallery-navigation';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'gallery-nav-btn gallery-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.setAttribute('aria-label', 'Previous gallery item');
    navigation.appendChild(prevBtn);
    
    // Item counter
    const counter = document.createElement('div');
    counter.className = 'gallery-counter';
    
    if (this.slideData.gallery && this.slideData.gallery.items) {
      counter.textContent = `1 / ${this.slideData.gallery.items.length}`;
    }
    
    navigation.appendChild(counter);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'gallery-nav-btn gallery-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.setAttribute('aria-label', 'Next gallery item');
    navigation.appendChild(nextBtn);
    
    // View mode toggle
    const viewToggle = document.createElement('button');
    viewToggle.className = 'gallery-view-toggle';
    viewToggle.innerHTML = '<i class="fas fa-th"></i>';
    viewToggle.setAttribute('aria-label', 'Toggle grid view');
    navigation.appendChild(viewToggle);
    
    return navigation;
  }

  /**
   * Create gallery modal for expanded view
   */
  createGalleryModal() {
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.setAttribute('aria-label', 'Close modal');
    modalContent.appendChild(closeBtn);
    
    // Modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalContent.appendChild(modalBody);
    
    modal.appendChild(modalContent);
    
    return modal;
  }

  /**
   * Set up gallery specific interactions
   */
  setupInteractiveElements() {
    super.setupInteractiveElements();
    
    // Add click handlers for gallery items
    const galleryItems = this.element.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.openItemModal(index);
      });
      
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openItemModal(index);
        }
      });
    });
    
    // Add filter button handlers
    const filterBtns = this.element.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.filterGallery(filter);
        
        // Update active filter
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    
    // Add navigation handlers
    const prevBtn = this.element.querySelector('.gallery-prev');
    const nextBtn = this.element.querySelector('.gallery-next');
    const viewToggle = this.element.querySelector('.gallery-view-toggle');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.previousItem();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextItem();
      });
    }
    
    if (viewToggle) {
      viewToggle.addEventListener('click', () => {
        this.toggleViewMode();
      });
    }
    
    // Add modal handlers
    const modal = this.element.querySelector('.gallery-modal');
    const closeBtn = this.element.querySelector('.modal-close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }
    
    // Add keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
      if (this.isModalOpen) {
        if (e.key === 'Escape') {
          this.closeModal();
        } else if (e.key === 'ArrowLeft') {
          this.previousItem();
        } else if (e.key === 'ArrowRight') {
          this.nextItem();
        }
      }
    });
  }

  /**
   * Filter gallery items by category
   */
  filterGallery(filter) {
    const items = this.element.querySelectorAll('.gallery-item');
    
    items.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        item.style.display = '';
        item.classList.remove('filtered-out');
      } else {
        item.style.display = 'none';
        item.classList.add('filtered-out');
      }
    });
    
    // Emit filter event
    this.eventBus.emit('gallery:filtered', {
      slideId: this.slideData.id,
      filter: filter
    });
  }

  /**
   * Open item in modal
   */
  openItemModal(index) {
    if (!this.slideData.gallery || !this.slideData.gallery.items) {
      return;
    }
    
    const item = this.slideData.gallery.items[index];
    const modal = this.element.querySelector('.gallery-modal');
    const modalBody = this.element.querySelector('.modal-body');
    
    if (!modal || !modalBody) return;
    
    // Update modal content
    modalBody.innerHTML = '';
    
    // Item image
    if (item.image) {
      const image = document.createElement('img');
      image.className = 'modal-image';
      image.src = item.image;
      image.alt = item.title;
      modalBody.appendChild(image);
    }
    
    // Item details
    const details = document.createElement('div');
    details.className = 'modal-details';
    
    const title = document.createElement('h2');
    title.textContent = item.title;
    details.appendChild(title);
    
    if (item.description) {
      const description = document.createElement('p');
      description.textContent = item.description;
      details.appendChild(description);
    }
    
    modalBody.appendChild(details);
    
    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    this.isModalOpen = true;
    this.currentItem = index;
    
    // Update counter
    this.updateCounter();
    
    // Emit modal open event
    this.eventBus.emit('gallery:modalOpened', {
      slideId: this.slideData.id,
      itemIndex: index,
      item: item
    });
  }

  /**
   * Close modal
   */
  closeModal() {
    const modal = this.element.querySelector('.gallery-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    this.isModalOpen = false;
    
    // Emit modal close event
    this.eventBus.emit('gallery:modalClosed', {
      slideId: this.slideData.id
    });
  }

  /**
   * Navigate to previous item
   */
  previousItem() {
    if (!this.slideData.gallery || !this.slideData.gallery.items) {
      return;
    }
    
    const totalItems = this.slideData.gallery.items.length;
    this.currentItem = (this.currentItem - 1 + totalItems) % totalItems;
    
    if (this.isModalOpen) {
      this.openItemModal(this.currentItem);
    } else {
      this.updateCounter();
    }
  }

  /**
   * Navigate to next item
   */
  nextItem() {
    if (!this.slideData.gallery || !this.slideData.gallery.items) {
      return;
    }
    
    const totalItems = this.slideData.gallery.items.length;
    this.currentItem = (this.currentItem + 1) % totalItems;
    
    if (this.isModalOpen) {
      this.openItemModal(this.currentItem);
    } else {
      this.updateCounter();
    }
  }

  /**
   * Toggle view mode between grid and list
   */
  toggleViewMode() {
    const grid = this.element.querySelector('.gallery-grid');
    const toggle = this.element.querySelector('.gallery-view-toggle i');
    
    if (!grid || !toggle) return;
    
    grid.classList.toggle('list-view');
    
    if (grid.classList.contains('list-view')) {
      toggle.className = 'fas fa-th-large';
    } else {
      toggle.className = 'fas fa-th';
    }
    
    // Emit view mode change event
    this.eventBus.emit('gallery:viewModeChanged', {
      slideId: this.slideData.id,
      viewMode: grid.classList.contains('list-view') ? 'list' : 'grid'
    });
  }

  /**
   * Update item counter
   */
  updateCounter() {
    const counter = this.element.querySelector('.gallery-counter');
    if (!counter || !this.slideData.gallery) return;
    
    const total = this.slideData.gallery.items.length;
    counter.textContent = `${this.currentItem + 1} / ${total}`;
  }

  /**
   * Handle item action button click
   */
  handleItemAction(action, itemIndex) {
    this.eventBus.emit('gallery:actionTriggered', {
      slideId: this.slideData.id,
      itemIndex: itemIndex,
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
        this.triggerDemo(action, itemIndex);
        break;
    }
  }

  /**
   * Trigger demo functionality
   */
  triggerDemo(action, itemIndex) {
    console.log('Gallery demo triggered:', action);
    
    this.eventBus.emit('gallery:demoTriggered', {
      slideId: this.slideData.id,
      itemIndex: itemIndex,
      action: action
    });
  }

  /**
   * Start gallery slide animations
   */
  startAnimations() {
    super.startAnimations();
    
    // Animate gallery header
    const header = this.element.querySelector('.gallery-header');
    if (header) {
      setTimeout(() => {
        header.classList.add('animated');
      }, 500);
    }
    
    // Animate gallery items in sequence
    const galleryItems = this.element.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animated');
      }, 800 + (index * 100));
    });
  }

  /**
   * Get gallery data
   */
  getGalleryData() {
    return {
      gallery: this.slideData.gallery,
      currentItem: this.currentItem,
      expandedItems: Array.from(this.expandedItems),
      isModalOpen: this.isModalOpen
    };
  }

  /**
   * Reset gallery to initial state
   */
  resetGallery() {
    this.currentItem = 0;
    this.expandedItems.clear();
    this.closeModal();
    this.filterGallery('all');
    this.updateCounter();
  }
}
