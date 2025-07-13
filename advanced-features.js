// Advanced Features for Interactive Presentation Slider

// Accessibility Manager
class AccessibilityManager {
    constructor(slider) {
        this.slider = slider;
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.addSkipLinks();
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation with more shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return; // Don't interfere with input fields

            switch(e.key) {
                case 'h':
                case 'H':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.showKeyboardHelp();
                    }
                    break;
                case 'b':
                case 'B':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.slider.toggleBookmark();
                    }
                    break;
                case 'p':
                case 'P':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.slider.toggleAutoPlay();
                    }
                    break;
            }
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA labels and live regions
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        });

        // Add live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'slide-announcer';
        document.body.appendChild(liveRegion);

        // Announce slide changes
        this.slider.onSlideChange = (slideNumber) => {
            const slideTitle = document.querySelector(`[data-slide="${slideNumber}"] .slide-title`)?.textContent || `Slide ${slideNumber}`;
            liveRegion.textContent = `Now viewing: ${slideTitle}`;
        };
    }

    setupFocusManagement() {
        // Manage focus for better keyboard navigation
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const currentSlide = document.querySelector('.slide.active');
                const focusableInSlide = currentSlide.querySelectorAll(focusableElements);
                
                if (focusableInSlide.length === 0) return;
                
                const firstFocusable = focusableInSlide[0];
                const lastFocusable = focusableInSlide[focusableInSlide.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content landmark
        const mainContent = document.querySelector('.slider-container');
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }

    showKeyboardHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'keyboard-help-modal';
        helpModal.innerHTML = `
            <div class="help-content">
                <h3>Keyboard Shortcuts</h3>
                <div class="shortcuts-grid">
                    <div class="shortcut">
                        <kbd>←</kbd><kbd>↑</kbd>
                        <span>Previous slide</span>
                    </div>
                    <div class="shortcut">
                        <kbd>→</kbd><kbd>↓</kbd><kbd>Space</kbd>
                        <span>Next slide</span>
                    </div>
                    <div class="shortcut">
                        <kbd>Home</kbd>
                        <span>First slide</span>
                    </div>
                    <div class="shortcut">
                        <kbd>End</kbd>
                        <span>Last slide</span>
                    </div>
                    <div class="shortcut">
                        <kbd>Ctrl</kbd>+<kbd>F</kbd>
                        <span>Search slides</span>
                    </div>
                    <div class="shortcut">
                        <kbd>B</kbd>
                        <span>Toggle bookmark</span>
                    </div>
                    <div class="shortcut">
                        <kbd>P</kbd>
                        <span>Toggle auto-play</span>
                    </div>
                    <div class="shortcut">
                        <kbd>H</kbd>
                        <span>Show this help</span>
                    </div>
                    <div class="shortcut">
                        <kbd>Esc</kbd>
                        <span>Close modals</span>
                    </div>
                </div>
                <button class="close-help">Close</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-help-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .help-content {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                max-width: 500px;
                width: 90%;
            }
            .help-content h3 {
                margin-bottom: 1.5rem;
                text-align: center;
            }
            .shortcuts-grid {
                display: grid;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .shortcut {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .shortcut kbd {
                background: #f3f4f6;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                padding: 0.25rem 0.5rem;
                font-family: monospace;
                font-size: 0.875rem;
            }
            .close-help {
                width: 100%;
                padding: 0.75rem;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
            }
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(helpModal);
        
        const closeBtn = helpModal.querySelector('.close-help');
        closeBtn.focus();
        
        const closeHelp = () => {
            document.body.removeChild(helpModal);
            document.head.removeChild(style);
        };
        
        closeBtn.addEventListener('click', closeHelp);
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) closeHelp();
        });
        
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeHelp();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            slideLoadTimes: [],
            animationFrameRate: 0,
            memoryUsage: 0
        };
        this.init();
    }

    init() {
        this.monitorPerformance();
        this.optimizeAnimations();
    }

    monitorPerformance() {
        // Monitor slide transition performance
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('slide-transition')) {
                    this.metrics.slideLoadTimes.push(entry.duration);
                }
            }
        });
        observer.observe({ entryTypes: ['measure'] });

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
            }, 5000);
        }
    }

    optimizeAnimations() {
        // Reduce animations if performance is poor
        let frameCount = 0;
        let lastTime = performance.now();

        const checkFrameRate = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.metrics.animationFrameRate = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Reduce animations if frame rate is low
                if (this.metrics.animationFrameRate < 30) {
                    document.body.classList.add('reduced-motion');
                }
            }
            
            requestAnimationFrame(checkFrameRate);
        };
        
        requestAnimationFrame(checkFrameRate);
    }

    getMetrics() {
        return this.metrics;
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = 'modern';
        this.customThemes = new Map();
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupThemeControls();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('presentation-theme');
        if (savedTheme && themes[savedTheme]) {
            this.applyTheme(savedTheme);
        }
    }

    applyTheme(themeName) {
        const theme = themes[themeName] || themes.modern;
        const root = document.documentElement;
        
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--secondary-color', theme.secondaryColor);
        root.style.setProperty('--accent-color', theme.accentColor);
        root.style.setProperty('--background', theme.backgroundColor);
        root.style.setProperty('--text-primary', theme.textColor);
        
        this.currentTheme = themeName;
        localStorage.setItem('presentation-theme', themeName);
    }

    setupThemeControls() {
        // Add theme selector to header
        const themeSelector = document.createElement('select');
        themeSelector.className = 'theme-selector';
        themeSelector.innerHTML = `
            <option value="modern">Modern</option>
            <option value="corporate">Corporate</option>
            <option value="creative">Creative</option>
            <option value="educational">Educational</option>
        `;
        themeSelector.value = this.currentTheme;
        
        themeSelector.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
        
        const headerRight = document.querySelector('.header-right');
        headerRight.insertBefore(themeSelector, headerRight.firstChild);
        
        // Add theme selector styles
        const style = document.createElement('style');
        style.textContent = `
            .theme-selector {
                padding: 0.5rem;
                border: 1px solid var(--border);
                border-radius: 0.5rem;
                background: var(--background);
                color: var(--text-primary);
                font-size: 0.875rem;
                cursor: pointer;
                margin-right: 0.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    createCustomTheme(name, colors) {
        this.customThemes.set(name, colors);
        this.addCustomThemeOption(name);
    }

    addCustomThemeOption(name) {
        const selector = document.querySelector('.theme-selector');
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        selector.appendChild(option);
    }
}

// Export Manager
class ExportManager {
    constructor(slider) {
        this.slider = slider;
        this.init();
    }

    init() {
        this.addExportControls();
    }

    addExportControls() {
        const exportBtn = document.createElement('button');
        exportBtn.className = 'control-btn export-btn';
        exportBtn.title = 'Export presentation';
        exportBtn.innerHTML = '<i class="fas fa-download"></i>';
        
        exportBtn.addEventListener('click', () => this.showExportOptions());
        
        const headerRight = document.querySelector('.header-right');
        headerRight.appendChild(exportBtn);
    }

    showExportOptions() {
        const modal = document.createElement('div');
        modal.className = 'export-modal';
        modal.innerHTML = `
            <div class="export-content">
                <h3>Export Presentation</h3>
                <div class="export-options">
                    <button class="export-option" data-type="pdf">
                        <i class="fas fa-file-pdf"></i>
                        <span>Export as PDF</span>
                    </button>
                    <button class="export-option" data-type="images">
                        <i class="fas fa-images"></i>
                        <span>Export as Images</span>
                    </button>
                    <button class="export-option" data-type="html">
                        <i class="fas fa-code"></i>
                        <span>Export as HTML</span>
                    </button>
                </div>
                <button class="close-export">Cancel</button>
            </div>
        `;
        
        // Add export modal styles
        const style = document.createElement('style');
        style.textContent = `
            .export-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .export-content {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                max-width: 400px;
                width: 90%;
            }
            .export-content h3 {
                margin-bottom: 1.5rem;
                text-align: center;
            }
            .export-options {
                display: grid;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .export-option {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border: 1px solid var(--border);
                border-radius: 0.5rem;
                background: var(--surface);
                cursor: pointer;
                transition: var(--transition);
            }
            .export-option:hover {
                background: var(--primary-color);
                color: white;
            }
            .close-export {
                width: 100%;
                padding: 0.75rem;
                background: var(--border);
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Handle export options
        modal.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', () => {
                const type = option.dataset.type;
                this.exportPresentation(type);
                this.closeExportModal(modal, style);
            });
        });
        
        modal.querySelector('.close-export').addEventListener('click', () => {
            this.closeExportModal(modal, style);
        });
    }

    closeExportModal(modal, style) {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    }

    async exportPresentation(type) {
        switch(type) {
            case 'pdf':
                await this.exportAsPDF();
                break;
            case 'images':
                await this.exportAsImages();
                break;
            case 'html':
                this.exportAsHTML();
                break;
        }
    }

    async exportAsPDF() {
        // This would require a library like jsPDF or Puppeteer
        console.log('PDF export would be implemented here');
        alert('PDF export feature would be implemented with a PDF library');
    }

    async exportAsImages() {
        // This would use html2canvas or similar
        console.log('Image export would be implemented here');
        alert('Image export feature would be implemented with html2canvas');
    }

    exportAsHTML() {
        const htmlContent = document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presentation.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize advanced features
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main slider to initialize
    setTimeout(() => {
        if (window.slider) {
            window.accessibilityManager = new AccessibilityManager(window.slider);
            window.performanceMonitor = new PerformanceMonitor();
            window.themeManager = new ThemeManager();
            window.exportManager = new ExportManager(window.slider);
        }
    }, 100);
});
