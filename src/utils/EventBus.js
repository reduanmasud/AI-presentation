// Event Bus System
// This class provides event-driven communication between components

export class EventBus {
  constructor() {
    this.events = new Map();
    this.debugMode = false;
    this.maxListeners = 50; // Prevent memory leaks
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   * @param {object} options - Options (once, priority)
   * @returns {function} Unsubscribe function
   */
  on(event, callback, options = {}) {
    if (typeof event !== 'string') {
      throw new Error('Event name must be a string');
    }
    
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const listeners = this.events.get(event);
    
    // Check for max listeners
    if (listeners.length >= this.maxListeners) {
      console.warn(`EventBus: Maximum listeners (${this.maxListeners}) reached for event "${event}"`);
    }

    const listener = {
      callback,
      once: options.once || false,
      priority: options.priority || 0,
      id: this.generateListenerId()
    };

    // Insert listener based on priority (higher priority first)
    const insertIndex = listeners.findIndex(l => l.priority < listener.priority);
    if (insertIndex === -1) {
      listeners.push(listener);
    } else {
      listeners.splice(insertIndex, 0, listener);
    }

    if (this.debugMode) {
      console.log(`EventBus: Registered listener for "${event}" (ID: ${listener.id})`);
    }

    // Return unsubscribe function
    return () => this.off(event, listener.id);
  }

  /**
   * Subscribe to an event once
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   * @returns {function} Unsubscribe function
   */
  once(event, callback) {
    return this.on(event, callback, { once: true });
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {string|function} callbackOrId - Callback function or listener ID
   */
  off(event, callbackOrId) {
    if (!this.events.has(event)) {
      return;
    }

    const listeners = this.events.get(event);
    let removedCount = 0;

    if (typeof callbackOrId === 'string') {
      // Remove by listener ID
      const index = listeners.findIndex(l => l.id === callbackOrId);
      if (index !== -1) {
        listeners.splice(index, 1);
        removedCount = 1;
      }
    } else if (typeof callbackOrId === 'function') {
      // Remove by callback function
      for (let i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i].callback === callbackOrId) {
          listeners.splice(i, 1);
          removedCount++;
        }
      }
    }

    // Clean up empty event arrays
    if (listeners.length === 0) {
      this.events.delete(event);
    }

    if (this.debugMode && removedCount > 0) {
      console.log(`EventBus: Removed ${removedCount} listener(s) for "${event}"`);
    }
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Data to pass to listeners
   * @returns {boolean} True if event had listeners
   */
  emit(event, data = null) {
    if (!this.events.has(event)) {
      if (this.debugMode) {
        console.log(`EventBus: No listeners for "${event}"`);
      }
      return false;
    }

    const listeners = this.events.get(event);
    const listenersToRemove = [];

    if (this.debugMode) {
      console.log(`EventBus: Emitting "${event}" to ${listeners.length} listener(s)`, data);
    }

    // Execute listeners
    listeners.forEach(listener => {
      try {
        listener.callback(data, event);
        
        // Mark once listeners for removal
        if (listener.once) {
          listenersToRemove.push(listener.id);
        }
      } catch (error) {
        console.error(`EventBus: Error in listener for "${event}":`, error);
      }
    });

    // Remove once listeners
    listenersToRemove.forEach(id => {
      this.off(event, id);
    });

    return true;
  }

  /**
   * Emit an event asynchronously
   * @param {string} event - Event name
   * @param {*} data - Data to pass to listeners
   * @returns {Promise<boolean>} Promise resolving to true if event had listeners
   */
  async emitAsync(event, data = null) {
    if (!this.events.has(event)) {
      return false;
    }

    const listeners = this.events.get(event);
    const listenersToRemove = [];

    if (this.debugMode) {
      console.log(`EventBus: Emitting async "${event}" to ${listeners.length} listener(s)`, data);
    }

    // Execute listeners asynchronously
    const promises = listeners.map(async listener => {
      try {
        await listener.callback(data, event);
        
        // Mark once listeners for removal
        if (listener.once) {
          listenersToRemove.push(listener.id);
        }
      } catch (error) {
        console.error(`EventBus: Error in async listener for "${event}":`, error);
      }
    });

    await Promise.all(promises);

    // Remove once listeners
    listenersToRemove.forEach(id => {
      this.off(event, id);
    });

    return true;
  }

  /**
   * Remove all listeners for an event or all events
   * @param {string} [event] - Event name (optional)
   */
  clear(event = null) {
    if (event) {
      this.events.delete(event);
      if (this.debugMode) {
        console.log(`EventBus: Cleared all listeners for "${event}"`);
      }
    } else {
      this.events.clear();
      if (this.debugMode) {
        console.log('EventBus: Cleared all listeners');
      }
    }
  }

  /**
   * Get list of events with listener counts
   * @returns {object} Events and their listener counts
   */
  getEvents() {
    const eventList = {};
    this.events.forEach((listeners, event) => {
      eventList[event] = listeners.length;
    });
    return eventList;
  }

  /**
   * Check if an event has listeners
   * @param {string} event - Event name
   * @returns {boolean} True if event has listeners
   */
  hasListeners(event) {
    return this.events.has(event) && this.events.get(event).length > 0;
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number} Number of listeners
   */
  getListenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }

  /**
   * Enable or disable debug mode
   * @param {boolean} enabled - Debug mode state
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
    console.log(`EventBus: Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Set maximum number of listeners per event
   * @param {number} max - Maximum listeners
   */
  setMaxListeners(max) {
    if (typeof max !== 'number' || max < 1) {
      throw new Error('Max listeners must be a positive number');
    }
    this.maxListeners = max;
  }

  /**
   * Generate unique listener ID
   * @returns {string} Unique ID
   */
  generateListenerId() {
    return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a namespaced event bus
   * @param {string} namespace - Namespace prefix
   * @returns {object} Namespaced event bus methods
   */
  namespace(namespace) {
    const prefixEvent = (event) => `${namespace}:${event}`;
    
    return {
      on: (event, callback, options) => this.on(prefixEvent(event), callback, options),
      once: (event, callback) => this.once(prefixEvent(event), callback),
      off: (event, callbackOrId) => this.off(prefixEvent(event), callbackOrId),
      emit: (event, data) => this.emit(prefixEvent(event), data),
      emitAsync: (event, data) => this.emitAsync(prefixEvent(event), data),
      clear: (event) => this.clear(event ? prefixEvent(event) : null),
      hasListeners: (event) => this.hasListeners(prefixEvent(event)),
      getListenerCount: (event) => this.getListenerCount(prefixEvent(event))
    };
  }

  /**
   * Create a middleware system for events
   * @param {function} middleware - Middleware function
   */
  use(middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function');
    }

    const originalEmit = this.emit.bind(this);
    
    this.emit = (event, data) => {
      const result = middleware(event, data);
      if (result !== false) {
        return originalEmit(event, result !== undefined ? result : data);
      }
      return false;
    };
  }
}

// Create and export a default instance
export const eventBus = new EventBus();

// Enable debug mode in development
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  eventBus.setDebugMode(true);
}
