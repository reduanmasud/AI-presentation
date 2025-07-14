// Feature Managers
// This file contains managers for search, bookmarks, autoplay, and fullscreen features

import { presentationConfig, isFeatureEnabled } from '../data/config.js';

/**
 * Search Manager
 * Handles slide search functionality
 */
export class SearchManager {
  constructor(eventBus, slidesData) {
    this.eventBus = eventBus;
    this.slidesData = slidesData;
    this.isVisible = false;
    this.searchResults = [];
    this.currentResultIndex = -1;
    
    if (isFeatureEnabled('search')) {
      this.init();
    }
  }

  init() {
    this.createSearchInterface();
    this.bindEvents();
    this.buildSearchIndex();
  }

  createSearchInterface() {
    // Search interface will be created by template system
    // This method sets up the search functionality
  }

  bindEvents() {
    // Listen for search toggle requests
    this.eventBus.on('search:toggle', () => this.toggle());
    this.eventBus.on('search:show', () => this.show());
    this.eventBus.on('search:hide', () => this.hide());
    
    // Search input handling
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      searchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
    }

    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.toggle());
    }

    // Close button
    const closeBtn = document.querySelector('.search-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }
  }

  buildSearchIndex() {
    this.searchIndex = this.slidesData.map(slide => ({
      slideNumber: slide.slideNumber,
      slideId: slide.id,
      title: slide.title.toLowerCase(),
      subtitle: (slide.subtitle || '').toLowerCase(),
      content: this.extractSearchableContent(slide).toLowerCase()
    }));
  }

  extractSearchableContent(slide) {
    let content = '';
    
    // Extract content based on slide type
    switch (slide.type) {
      case 'agenda':
        content += slide.agendaItems.map(item => `${item.title} ${item.description}`).join(' ');
        break;
      case 'timeline':
        content += slide.timeline.milestones.map(m => `${m.title} ${m.summary} ${m.details.join(' ')}`).join(' ');
        break;
      case 'workflow':
        content += slide.workflow.steps.map(s => `${s.title} ${s.description}`).join(' ');
        break;
      case 'security':
        content += slide.security.categories.map(c => `${c.title} ${c.description}`).join(' ');
        break;
      default:
        // Extract any text content
        content += JSON.stringify(slide).replace(/[{}"\[\]]/g, ' ');
    }
    
    return content;
  }

  handleSearch(query) {
    if (query.length < presentationConfig.search.minLength) {
      this.clearResults();
      return;
    }

    this.searchResults = this.searchIndex.filter(item => 
      item.title.includes(query.toLowerCase()) ||
      item.subtitle.includes(query.toLowerCase()) ||
      item.content.includes(query.toLowerCase())
    );

    this.displayResults();
  }

  handleSearchKeydown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.navigateResults(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.navigateResults(-1);
        break;
      case 'Enter':
        e.preventDefault();
        this.selectCurrentResult();
        break;
      case 'Escape':
        this.hide();
        break;
    }
  }

  navigateResults(direction) {
    if (this.searchResults.length === 0) return;
    
    this.currentResultIndex += direction;
    
    if (this.currentResultIndex >= this.searchResults.length) {
      this.currentResultIndex = 0;
    } else if (this.currentResultIndex < 0) {
      this.currentResultIndex = this.searchResults.length - 1;
    }
    
    this.highlightResult(this.currentResultIndex);
  }

  selectCurrentResult() {
    if (this.currentResultIndex >= 0 && this.searchResults[this.currentResultIndex]) {
      const result = this.searchResults[this.currentResultIndex];
      this.eventBus.emit('navigation:goTo', { slideNumber: result.slideNumber });
      this.hide();
    }
  }

  displayResults() {
    const resultsContainer = document.querySelector('.search-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';
    
    if (this.searchResults.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
      return;
    }

    this.searchResults.forEach((result, index) => {
      const resultElement = document.createElement('div');
      resultElement.className = 'search-result';
      resultElement.innerHTML = `
        <div class="result-title">${this.highlightMatch(result.title)}</div>
        <div class="result-slide">Slide ${result.slideNumber}</div>
      `;
      
      resultElement.addEventListener('click', () => {
        this.eventBus.emit('navigation:goTo', { slideNumber: result.slideNumber });
        this.hide();
      });
      
      resultsContainer.appendChild(resultElement);
    });
  }

  highlightMatch(text) {
    // Simple highlighting - can be enhanced
    return text;
  }

  highlightResult(index) {
    const results = document.querySelectorAll('.search-result');
    results.forEach((result, i) => {
      result.classList.toggle('highlighted', i === index);
    });
  }

  clearResults() {
    this.searchResults = [];
    this.currentResultIndex = -1;
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }

  show() {
    const searchOverlay = document.querySelector('.search-overlay');
    if (searchOverlay) {
      searchOverlay.classList.add('visible');
      this.isVisible = true;
      
      // Focus search input
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
      }
      
      this.eventBus.emit('search:shown');
    }
  }

  hide() {
    const searchOverlay = document.querySelector('.search-overlay');
    if (searchOverlay) {
      searchOverlay.classList.remove('visible');
      this.isVisible = false;
      this.clearResults();
      
      // Clear search input
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.value = '';
      }
      
      this.eventBus.emit('search:hidden');
    }
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}

/**
 * Bookmark Manager
 * Handles slide bookmarking functionality
 */
export class BookmarkManager {
  constructor(eventBus, slidesData) {
    this.eventBus = eventBus;
    this.slidesData = slidesData;
    this.bookmarks = new Set();
    this.storageKey = presentationConfig.bookmarks.storageKey;
    
    if (isFeatureEnabled('bookmarks')) {
      this.init();
    }
  }

  init() {
    this.loadBookmarks();
    this.bindEvents();
  }

  bindEvents() {
    // Listen for bookmark toggle requests
    this.eventBus.on('bookmark:toggle', (data) => this.toggleBookmark(data.slideNumber));
    this.eventBus.on('bookmark:add', (data) => this.addBookmark(data.slideNumber));
    this.eventBus.on('bookmark:remove', (data) => this.removeBookmark(data.slideNumber));
    
    // Bookmark button
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => this.toggleCurrentSlide());
    }

    // Listen for slide changes to update bookmark button
    this.eventBus.on('slide:transitionComplete', (data) => this.updateBookmarkButton(data.currentSlide));
  }

  toggleCurrentSlide() {
    this.eventBus.emit('slideManager:getCurrentSlide', (currentSlide) => {
      this.toggleBookmark(currentSlide);
    });
  }

  toggleBookmark(slideNumber) {
    if (this.bookmarks.has(slideNumber)) {
      this.removeBookmark(slideNumber);
    } else {
      this.addBookmark(slideNumber);
    }
  }

  addBookmark(slideNumber) {
    this.bookmarks.add(slideNumber);
    this.saveBookmarks();
    this.updateBookmarkButton(slideNumber);
    this.eventBus.emit('bookmark:added', { slideNumber });
  }

  removeBookmark(slideNumber) {
    this.bookmarks.delete(slideNumber);
    this.saveBookmarks();
    this.updateBookmarkButton(slideNumber);
    this.eventBus.emit('bookmark:removed', { slideNumber });
  }

  updateBookmarkButton(currentSlide) {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
      const isBookmarked = this.bookmarks.has(currentSlide);
      bookmarkBtn.classList.toggle('active', isBookmarked);
      
      const icon = bookmarkBtn.querySelector('i');
      if (icon) {
        icon.className = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
      }
    }
  }

  loadBookmarks() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.bookmarks = new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load bookmarks:', error);
    }
  }

  saveBookmarks() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify([...this.bookmarks]));
    } catch (error) {
      console.warn('Failed to save bookmarks:', error);
    }
  }

  getBookmarks() {
    return [...this.bookmarks];
  }

  clearBookmarks() {
    this.bookmarks.clear();
    this.saveBookmarks();
    this.eventBus.emit('bookmarks:cleared');
  }
}

/**
 * AutoPlay Manager
 * Handles automatic slide progression
 */
export class AutoPlayManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.isPlaying = false;
    this.interval = null;
    this.config = presentationConfig.autoPlay;
    
    if (isFeatureEnabled('autoPlay')) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Listen for autoplay control requests
    this.eventBus.on('autoplay:toggle', () => this.toggle());
    this.eventBus.on('autoplay:start', () => this.start());
    this.eventBus.on('autoplay:stop', () => this.stop());
    
    // AutoPlay button
    const autoplayBtn = document.querySelector('.autoplay-btn');
    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', () => this.toggle());
    }

    // Pause on user interaction
    if (this.config.pauseOnHover) {
      document.addEventListener('mouseenter', () => this.pause());
      document.addEventListener('mouseleave', () => this.resume());
    }

    if (this.config.pauseOnFocus) {
      document.addEventListener('focusin', () => this.pause());
      document.addEventListener('focusout', () => this.resume());
    }

    // Listen for manual navigation to reset timer
    this.eventBus.on('navigation:next', () => this.resetTimer());
    this.eventBus.on('navigation:previous', () => this.resetTimer());
    this.eventBus.on('navigation:goTo', () => this.resetTimer());
  }

  start() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.startTimer();
    this.updateButton();
    this.eventBus.emit('autoplay:started');
  }

  stop() {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    this.clearTimer();
    this.updateButton();
    this.eventBus.emit('autoplay:stopped');
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  pause() {
    if (this.isPlaying) {
      this.clearTimer();
    }
  }

  resume() {
    if (this.isPlaying) {
      this.startTimer();
    }
  }

  startTimer() {
    this.clearTimer();
    this.interval = setInterval(() => {
      this.eventBus.emit('navigation:next');
    }, this.config.interval);
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  resetTimer() {
    if (this.isPlaying) {
      this.startTimer();
    }
  }

  updateButton() {
    const autoplayBtn = document.querySelector('.autoplay-btn');
    if (autoplayBtn) {
      autoplayBtn.classList.toggle('active', this.isPlaying);
      
      const icon = autoplayBtn.querySelector('i');
      if (icon) {
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
      }
    }
  }
}

/**
 * Fullscreen Manager
 * Handles fullscreen functionality
 */
export class FullscreenManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.isFullscreen = false;
    
    if (isFeatureEnabled('fullscreen')) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
    this.checkFullscreenSupport();
  }

  bindEvents() {
    // Listen for fullscreen toggle requests
    this.eventBus.on('fullscreen:toggle', () => this.toggle());
    this.eventBus.on('fullscreen:enter', () => this.enter());
    this.eventBus.on('fullscreen:exit', () => this.exit());
    
    // Fullscreen button
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => this.toggle());
    }

    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());

    // ESC key handling
    this.eventBus.on('navigation:escape', () => {
      if (this.isFullscreen && presentationConfig.fullscreen.exitOnEscape) {
        this.exit();
      }
    });
  }

  checkFullscreenSupport() {
    const element = document.documentElement;
    this.fullscreenSupported = !!(
      element.requestFullscreen ||
      element.webkitRequestFullscreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen
    );
    
    if (!this.fullscreenSupported) {
      const fullscreenBtn = document.querySelector('.fullscreen-btn');
      if (fullscreenBtn) {
        fullscreenBtn.style.display = 'none';
      }
    }
  }

  enter() {
    if (!this.fullscreenSupported || this.isFullscreen) return;
    
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  exit() {
    if (!this.isFullscreen) return;
    
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  toggle() {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.enter();
    }
  }

  handleFullscreenChange() {
    this.isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    
    this.updateButton();
    
    if (this.isFullscreen) {
      this.eventBus.emit('fullscreen:entered');
    } else {
      this.eventBus.emit('fullscreen:exited');
    }
  }

  updateButton() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.classList.toggle('active', this.isFullscreen);
      
      const icon = fullscreenBtn.querySelector('i');
      if (icon) {
        icon.className = this.isFullscreen ? 'fas fa-compress' : 'fas fa-expand';
      }
    }
  }
}
