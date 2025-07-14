// Service Worker Manager
// Handles service worker registration and communication

export class ServiceWorkerManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.registration = null;
    this.isSupported = 'serviceWorker' in navigator;
    this.isOnline = navigator.onLine;
    this.updateAvailable = false;
    
    this.init();
  }

  /**
   * Initialize service worker manager
   */
  async init() {
    if (!this.isSupported) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      await this.registerServiceWorker();
      this.setupEventListeners();
      this.setupOnlineOfflineHandling();
      
      console.log('✅ Service Worker Manager initialized');
    } catch (error) {
      console.error('Failed to initialize Service Worker Manager:', error);
    }
  }

  /**
   * Register service worker
   */
  async registerServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered:', this.registration);

      // Handle different registration states
      if (this.registration.installing) {
        console.log('Service Worker installing...');
        this.trackInstallProgress(this.registration.installing);
      } else if (this.registration.waiting) {
        console.log('Service Worker waiting...');
        this.updateAvailable = true;
        this.eventBus.emit('sw:updateAvailable');
      } else if (this.registration.active) {
        console.log('Service Worker active');
        this.eventBus.emit('sw:active');
      }

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        console.log('Service Worker update found');
        this.trackInstallProgress(this.registration.installing);
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  /**
   * Track service worker install progress
   */
  trackInstallProgress(worker) {
    worker.addEventListener('statechange', () => {
      console.log('Service Worker state changed:', worker.state);
      
      switch (worker.state) {
        case 'installed':
          if (navigator.serviceWorker.controller) {
            // New update available
            this.updateAvailable = true;
            this.eventBus.emit('sw:updateAvailable');
          } else {
            // First install
            this.eventBus.emit('sw:installed');
          }
          break;
          
        case 'activated':
          this.eventBus.emit('sw:activated');
          break;
          
        case 'redundant':
          this.eventBus.emit('sw:redundant');
          break;
      }
    });
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Listen for service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event);
    });

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
      this.eventBus.emit('sw:controllerChanged');
      
      // Reload page if needed
      if (this.updateAvailable) {
        window.location.reload();
      }
    });

    // Listen for app events
    this.eventBus.on('sw:skipWaiting', () => {
      this.skipWaiting();
    });

    this.eventBus.on('sw:getCacheInfo', (callback) => {
      this.getCacheInfo().then(callback);
    });

    this.eventBus.on('sw:clearCache', (callback) => {
      this.clearCache().then(callback);
    });
  }

  /**
   * Set up online/offline handling
   */
  setupOnlineOfflineHandling() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.eventBus.emit('connectivity:online');
      console.log('App is online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.eventBus.emit('connectivity:offline');
      console.log('App is offline');
    });

    // Initial state
    this.eventBus.emit(this.isOnline ? 'connectivity:online' : 'connectivity:offline');
  }

  /**
   * Handle messages from service worker
   */
  handleServiceWorkerMessage(event) {
    const { type, payload } = event.data;
    
    console.log('Received message from Service Worker:', type, payload);
    
    switch (type) {
      case 'CACHE_UPDATED':
        this.eventBus.emit('sw:cacheUpdated', payload);
        break;
        
      case 'OFFLINE_READY':
        this.eventBus.emit('sw:offlineReady', payload);
        break;
        
      case 'UPDATE_AVAILABLE':
        this.updateAvailable = true;
        this.eventBus.emit('sw:updateAvailable', payload);
        break;
        
      default:
        console.log('Unknown Service Worker message:', type);
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting() {
    if (this.registration && this.registration.waiting) {
      // Send skip waiting message
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  /**
   * Get cache information
   */
  async getCacheInfo() {
    if (!this.registration || !this.registration.active) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };
      
      this.registration.active.postMessage(
        { type: 'GET_CACHE_INFO' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Clear all caches
   */
  async clearCache() {
    if (!this.registration || !this.registration.active) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };
      
      this.registration.active.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Check if app is running offline
   */
  isOffline() {
    return !this.isOnline;
  }

  /**
   * Check if update is available
   */
  isUpdateAvailable() {
    return this.updateAvailable;
  }

  /**
   * Get service worker registration
   */
  getRegistration() {
    return this.registration;
  }

  /**
   * Unregister service worker
   */
  async unregister() {
    if (this.registration) {
      const success = await this.registration.unregister();
      console.log('Service Worker unregistered:', success);
      return success;
    }
    return false;
  }

  /**
   * Update service worker
   */
  async update() {
    if (this.registration) {
      await this.registration.update();
      console.log('Service Worker update triggered');
    }
  }

  /**
   * Show update notification
   */
  showUpdateNotification() {
    if (!this.updateAvailable) return;

    // Create update notification
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <i class="fas fa-download"></i>
        </div>
        <div class="notification-text">
          <h4>Update Available</h4>
          <p>A new version of the presentation is available.</p>
        </div>
        <div class="notification-actions">
          <button class="btn-update">Update</button>
          <button class="btn-dismiss">Dismiss</button>
        </div>
      </div>
    `;

    // Add event listeners
    notification.querySelector('.btn-update').addEventListener('click', () => {
      this.skipWaiting();
      notification.remove();
    });

    notification.querySelector('.btn-dismiss').addEventListener('click', () => {
      notification.remove();
    });

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  /**
   * Show offline notification
   */
  showOfflineNotification() {
    const notification = document.createElement('div');
    notification.className = 'offline-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <i class="fas fa-wifi-slash"></i>
        </div>
        <div class="notification-text">
          <h4>You're Offline</h4>
          <p>Some features may be limited while offline.</p>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Remove when back online
    const removeOnOnline = () => {
      if (notification.parentNode) {
        notification.remove();
      }
      window.removeEventListener('online', removeOnOnline);
    };

    window.addEventListener('online', removeOnOnline);
  }

  /**
   * Preload critical resources
   */
  async preloadCriticalResources() {
    const criticalResources = [
      '/src/styles/main.css',
      '/src/data/slides.js',
      '/src/data/config.js'
    ];

    try {
      await Promise.all(
        criticalResources.map(url => fetch(url))
      );
      console.log('Critical resources preloaded');
    } catch (error) {
      console.error('Failed to preload critical resources:', error);
    }
  }

  /**
   * Get service worker status
   */
  getStatus() {
    return {
      isSupported: this.isSupported,
      isRegistered: !!this.registration,
      isActive: !!(this.registration && this.registration.active),
      isOnline: this.isOnline,
      updateAvailable: this.updateAvailable,
      scope: this.registration ? this.registration.scope : null
    };
  }

  /**
   * Destroy service worker manager
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    // Clear event bus listeners
    this.eventBus.off('sw:skipWaiting');
    this.eventBus.off('sw:getCacheInfo');
    this.eventBus.off('sw:clearCache');
    
    console.log('✅ Service Worker Manager destroyed');
  }
}
