// Interactive Presentation Slider
class PresentationSlider {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 8;
        this.isAutoPlaying = false;
        this.autoPlayInterval = null;
        this.bookmarkedSlides = new Set();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.animateCurrentSlide();
        this.initializeChart();
        this.setupSearch();
    }

    bindEvents() {
        // Navigation buttons
        document.querySelector('.prev-btn').addEventListener('click', () => this.previousSlide());
        document.querySelector('.next-btn').addEventListener('click', () => this.nextSlide());

        // Slide indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index + 1));
        });

        // Table of contents
        document.querySelectorAll('.toc-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const slideNum = parseInt(link.dataset.slide);
                this.goToSlide(slideNum);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Control buttons
        document.querySelector('.search-btn').addEventListener('click', () => this.toggleSearch());
        document.querySelector('.bookmark-btn').addEventListener('click', () => this.toggleBookmark());
        document.querySelector('.autoplay-btn').addEventListener('click', () => this.toggleAutoPlay());
        document.querySelector('.fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());

        // Search modal
        document.querySelector('.search-close').addEventListener('click', () => this.closeSearch());
        document.querySelector('.search-input').addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Interactive elements
        this.setupInteractiveElements();

        // Agenda navigation
        this.setupAgendaNavigation();

        // Touch/swipe support
        this.setupTouchEvents();
    }

    setupInteractiveElements() {
        // Agenda items reveal animation
        document.querySelectorAll('.agenda-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, (index + 1) * 150);
        });

        // Feature cards animation
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, (index + 1) * 300);
        });

        // Demo button interaction
        document.querySelector('.demo-button')?.addEventListener('click', function() {
            const reveal = this.parentElement.querySelector('.demo-reveal');
            reveal.classList.toggle('show');
        });

        // Interactive timeline steps
        document.querySelectorAll('.timeline-step').forEach(step => {
            step.addEventListener('click', () => {
                document.querySelectorAll('.timeline-step').forEach(s => s.classList.remove('active'));
                step.classList.add('active');
            });
        });

        // Gallery items hover effects
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                // Could implement lightbox here
                console.log('Gallery item clicked:', item.dataset.image);
            });
        });
    }

    setupAgendaNavigation() {
        // Add click navigation for agenda items
        document.querySelectorAll('.agenda-item.clickable').forEach(item => {
            item.addEventListener('click', () => {
                const targetSlide = parseInt(item.dataset.targetSlide);
                if (targetSlide && targetSlide >= 1 && targetSlide <= this.totalSlides) {
                    // Add visual feedback
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.transform = '';
                        this.goToSlide(targetSlide);
                    }, 150);
                }
            });

            // Add hover sound effect (optional)
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-8px)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(-5px)';
            });
        });

        // Add keyboard navigation for agenda items
        document.querySelectorAll('.agenda-item.clickable').forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }

    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        const slider = document.querySelector('.slider-container');

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        };

        this.handleSwipe = handleSwipe;
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        // Remove active class from current slide
        document.querySelector('.slide.active').classList.remove('active');
        document.querySelector('.indicator.active').classList.remove('active');

        // Update current slide
        this.currentSlide = slideNumber;

        // Add active class to new slide
        document.querySelector(`[data-slide="${slideNumber}"]`).classList.add('active');
        document.querySelector(`.indicator[data-slide="${slideNumber}"]`).classList.add('active');

        // Update slides wrapper position
        const slidesWrapper = document.querySelector('.slides-wrapper');
        const translateX = -(slideNumber - 1) * 100;
        slidesWrapper.style.transform = `translateX(${translateX}%)`;

        // Update progress and counter
        this.updateProgress();
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.animateCurrentSlide();

        // Trigger slide-specific animations
        this.triggerSlideAnimations(slideNumber);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progress = (this.currentSlide / this.totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
    }

    updateSlideCounter() {
        document.querySelector('.current-slide').textContent = this.currentSlide;
    }

    updateNavigationButtons() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        prevBtn.disabled = this.currentSlide === 1;
        nextBtn.disabled = this.currentSlide === this.totalSlides;
    }

    animateCurrentSlide() {
        const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        
        // Reset and trigger animations
        const animatedElements = currentSlideElement.querySelectorAll('.slide-title, .timeline-item, .feature-card, .metric-card');
        animatedElements.forEach((element, index) => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = `slideInUp 0.8s ease-out ${index * 0.1}s forwards`;
        });
    }

    triggerSlideAnimations(slideNumber) {
        switch(slideNumber) {
            case 5: // Data slide
                this.animateCounters();
                break;
            case 2: // Agenda slide
                this.animateTimeline();
                break;
            case 3: // AI Evolution slide
                this.animateAIEvolution();
                break;
            case 4: // Features slide
                this.animateFeatures();
                break;
        }
    }

    animateCounters() {
        document.querySelectorAll('.metric-number').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    animateTimeline() {
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    animateAIEvolution() {
        // Animate horizontal timeline milestones
        document.querySelectorAll('.milestone-horizontal').forEach((milestone, index) => {
            setTimeout(() => {
                milestone.style.opacity = '1';
                milestone.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Animate horizontal timeline progress fill
        setTimeout(() => {
            const progressFill = document.getElementById('timelineProgressHorizontal');
            if (progressFill) {
                progressFill.style.width = '100%';
            }
        }, 500);

        // Animate counters in milestones and stats
        setTimeout(() => {
            this.animateCounters();
        }, 1000);

        // Setup horizontal timeline click interactions
        this.setupHorizontalTimelineInteractions();
    }

    setupHorizontalTimelineInteractions() {
        const detailsPanel = document.getElementById('detailsPanel');
        let currentActiveMilestone = null;
        const milestones = document.querySelectorAll('.milestone-horizontal');
        const totalMilestones = milestones.length;

        // Function to activate a specific milestone
        const activateMilestone = (milestoneNumber) => {
            // Remove active from all milestones and details
            document.querySelectorAll('.milestone-horizontal').forEach(m => {
                m.classList.remove('active');
            });
            document.querySelectorAll('.milestone-details-content').forEach(content => {
                content.classList.remove('active');
            });

            // Find and activate the target milestone
            const targetMilestone = document.querySelector(`.milestone-horizontal[data-milestone="${milestoneNumber}"]`);
            if (targetMilestone) {
                targetMilestone.classList.add('active');
                const targetContent = document.querySelector(`.milestone-details-content[data-milestone="${milestoneNumber}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                detailsPanel.classList.add('active');
                currentActiveMilestone = milestoneNumber;

                // Animate counters in the details panel
                setTimeout(() => {
                    this.animateCounters();
                }, 300);

                // Add visual feedback
                const marker = targetMilestone.querySelector('.milestone-marker-horizontal');
                marker.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    marker.style.transform = '';
                }, 150);
            }
        };

        // Function to navigate to next/previous milestone
        const navigateMilestone = (direction) => {
            if (currentActiveMilestone === null) {
                // If no milestone is active, start with the first one
                activateMilestone('1');
                return;
            }

            const currentNumber = parseInt(currentActiveMilestone);
            let nextNumber;

            if (direction === 'next') {
                nextNumber = currentNumber < totalMilestones ? currentNumber + 1 : 1; // Loop to first
            } else {
                nextNumber = currentNumber > 1 ? currentNumber - 1 : totalMilestones; // Loop to last
            }

            activateMilestone(nextNumber.toString());
        };

        // Click handlers for milestones
        milestones.forEach(milestone => {
            milestone.addEventListener('click', () => {
                const milestoneNumber = milestone.dataset.milestone;
                const isCurrentlyActive = milestone.classList.contains('active');

                if (isCurrentlyActive) {
                    // Close details panel if clicking the same milestone
                    milestone.classList.remove('active');
                    document.querySelectorAll('.milestone-details-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    detailsPanel.classList.remove('active');
                    currentActiveMilestone = null;
                } else {
                    activateMilestone(milestoneNumber);
                }
            });

            // Keyboard accessibility for individual milestones
            milestone.setAttribute('tabindex', '0');
            milestone.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    milestone.click();
                }
            });
        });

        // Global keyboard navigation for timeline (only when on slide 3)
        const handleTimelineKeyboard = (e) => {
            // Only handle timeline navigation when on slide 3
            if (this.currentSlide !== 3) return;

            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    navigateMilestone('previous');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    navigateMilestone('next');
                    break;
                case 'Escape':
                    e.preventDefault();
                    if (currentActiveMilestone) {
                        // Close active milestone
                        document.querySelectorAll('.milestone-horizontal').forEach(m => {
                            m.classList.remove('active');
                        });
                        document.querySelectorAll('.milestone-details-content').forEach(content => {
                            content.classList.remove('active');
                        });
                        detailsPanel.classList.remove('active');
                        currentActiveMilestone = null;
                    }
                    break;
            }
        };

        // Add the timeline keyboard handler
        document.addEventListener('keydown', handleTimelineKeyboard);

        // Store reference for cleanup if needed
        this.timelineKeyboardHandler = handleTimelineKeyboard;

        // Close details panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.milestone-horizontal') && !e.target.closest('.milestone-details-panel')) {
                if (currentActiveMilestone) {
                    document.querySelectorAll('.milestone-horizontal').forEach(m => {
                        m.classList.remove('active');
                    });
                    document.querySelectorAll('.milestone-details-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    detailsPanel.classList.remove('active');
                    currentActiveMilestone = null;
                }
            }
        });
    }

    animateFeatures() {
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }

    handleKeyboard(e) {
        // Skip slide navigation if we're on slide 3 and using Up/Down for timeline navigation
        if (this.currentSlide === 3 && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            return; // Let the timeline handler manage these keys
        }

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowUp':
                // Only handle for non-slide-3 or when no timeline is active
                if (this.currentSlide !== 3) {
                    e.preventDefault();
                    this.previousSlide();
                }
                break;
            case 'ArrowDown':
                // Only handle for non-slide-3 or when no timeline is active
                if (this.currentSlide !== 3) {
                    e.preventDefault();
                    this.nextSlide();
                }
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                this.closeSearch();
                break;
            case 'f':
            case 'F':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleSearch();
                }
                break;
        }
    }

    toggleAutoPlay() {
        const btn = document.querySelector('.autoplay-btn');
        const icon = btn.querySelector('i');

        if (this.isAutoPlaying) {
            clearInterval(this.autoPlayInterval);
            this.isAutoPlaying = false;
            icon.className = 'fas fa-play';
            btn.title = 'Auto-play';
        } else {
            this.autoPlayInterval = setInterval(() => {
                if (this.currentSlide < this.totalSlides) {
                    this.nextSlide();
                } else {
                    this.goToSlide(1);
                }
            }, 5000);
            this.isAutoPlaying = true;
            icon.className = 'fas fa-pause';
            btn.title = 'Pause auto-play';
        }
    }

    toggleBookmark() {
        const btn = document.querySelector('.bookmark-btn');
        const icon = btn.querySelector('i');

        if (this.bookmarkedSlides.has(this.currentSlide)) {
            this.bookmarkedSlides.delete(this.currentSlide);
            icon.className = 'far fa-bookmark';
            btn.title = 'Bookmark slide';
        } else {
            this.bookmarkedSlides.add(this.currentSlide);
            icon.className = 'fas fa-bookmark';
            btn.title = 'Remove bookmark';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    toggleSearch() {
        const modal = document.querySelector('.search-modal');
        const input = document.querySelector('.search-input');
        
        modal.classList.add('active');
        setTimeout(() => input.focus(), 100);
    }

    closeSearch() {
        const modal = document.querySelector('.search-modal');
        modal.classList.remove('active');
    }

    handleSearch(query) {
        const results = document.querySelector('.search-results');
        
        if (!query.trim()) {
            results.innerHTML = '';
            return;
        }

        // Simple search implementation
        const slides = [
            { number: 1, title: 'AI in QA & Security Testing', content: 'AI QA Security Testing Practical Applications Reduan Masud Arafat xCloud robot shield bug' },
            { number: 2, title: 'Workshop Agenda', content: 'Brief Evolution Modern AI Generate Test Cases DevOps Dungeon Gemini Security Testing Learning Development Trends Resources QA Next Steps' },
            { number: 3, title: 'Brief Evolution of Modern AI', content: 'ChatGPT hype 100 million users prompt engineering agentic AI n8n vive coding copilot context engineering RAG retrieval augmented generation' },
            { number: 4, title: 'Generate Test Cases Using AI', content: 'AI-powered test case generation ChatGPT GitHub Copilot Testim Applitools automated creation comprehensive coverage edge case detection' },
            { number: 5, title: 'DevOps Dungeon App', content: 'DevOps Dungeon gamified learning platform interactive quests achievement system team collaboration progress tracking' },
            { number: 6, title: 'Gemini - Underrated App', content: 'Google Gemini AI assistant code analysis test documentation bug investigation automation scripts' },
            { number: 7, title: 'AI in Security Testing', content: 'vulnerability detection penetration testing threat monitoring compliance automation Snyk Veracode Checkmarx Metasploit Burp Suite' },
            { number: 8, title: 'Learning & Next Steps', content: 'AI Learning Development personalized learning paths intelligent mentoring progress tracking next steps action items' }
        ];

        const matchedSlides = slides.filter(slide => 
            slide.title.toLowerCase().includes(query.toLowerCase()) ||
            slide.content.toLowerCase().includes(query.toLowerCase())
        );

        results.innerHTML = matchedSlides.map(slide => `
            <div class="search-result" onclick="slider.goToSlide(${slide.number}); slider.closeSearch();">
                <h4>Slide ${slide.number}: ${slide.title}</h4>
                <p>${slide.content.substring(0, 100)}...</p>
            </div>
        `).join('');
    }

    setupSearch() {
        // Add search result styling
        const style = document.createElement('style');
        style.textContent = `
            .search-result {
                padding: 1rem;
                border-bottom: 1px solid var(--border);
                cursor: pointer;
                transition: var(--transition);
            }
            .search-result:hover {
                background: var(--surface);
            }
            .search-result h4 {
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: var(--primary-color);
            }
            .search-result p {
                font-size: 0.875rem;
                color: var(--text-secondary);
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }

    initializeChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Engagement Rate',
                    data: [65, 72, 80, 85, 90, 95],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#e5e7eb'
                        }
                    },
                    x: {
                        grid: {
                            color: '#e5e7eb'
                        }
                    }
                }
            }
        });
    }
}

// Initialize the presentation slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.slider = new PresentationSlider();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate positions if needed
    if (window.slider) {
        window.slider.goToSlide(window.slider.currentSlide);
    }
});
