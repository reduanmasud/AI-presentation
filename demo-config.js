// Demo Configuration for Interactive Presentation Slider
// This file contains sample content and configuration options

const presentationConfig = {
    // Basic settings
    title: "Interactive Presentation Slider",
    author: "Your Name",
    theme: "modern", // modern, corporate, creative, educational
    
    // Auto-play settings
    autoPlay: {
        enabled: false,
        interval: 5000, // milliseconds
        pauseOnHover: true
    },
    
    // Navigation settings
    navigation: {
        keyboard: true,
        touch: true,
        indicators: true,
        sidebar: true
    },
    
    // Animation settings
    animations: {
        slideTransition: "slide", // slide, fade, flip, zoom
        duration: 600,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    },
    
    // Sample slide content
    slides: [
        {
            id: 1,
            type: "title",
            title: "Interactive Presentations",
            subtitle: "Engaging • Modern • Professional",
            background: "gradient",
            animations: ["titleAppear", "slideInUp", "fadeIn"]
        },
        {
            id: 2,
            type: "agenda",
            title: "Agenda",
            items: [
                {
                    title: "Introduction",
                    description: "Overview and objectives",
                    icon: "fas fa-play-circle"
                },
                {
                    title: "Key Features",
                    description: "Interactive elements showcase",
                    icon: "fas fa-star"
                },
                {
                    title: "Data Insights",
                    description: "Charts and statistics",
                    icon: "fas fa-chart-bar"
                },
                {
                    title: "Conclusion",
                    description: "Summary and next steps",
                    icon: "fas fa-flag-checkered"
                }
            ]
        },
        {
            id: 3,
            type: "features",
            title: "Interactive Features",
            features: [
                {
                    icon: "fas fa-magic",
                    title: "Smooth Animations",
                    description: "Fluid transitions and micro-interactions",
                    demo: "bounce-animation"
                },
                {
                    icon: "fas fa-hand-pointer",
                    title: "Click Interactions",
                    description: "Hover and click to reveal content",
                    demo: "click-reveal"
                },
                {
                    icon: "fas fa-mobile-alt",
                    title: "Responsive Design",
                    description: "Works perfectly on all devices",
                    demo: "device-icons"
                }
            ]
        },
        {
            id: 4,
            type: "comparison",
            title: "Before & After Comparison",
            flipCard: {
                front: {
                    title: "Before",
                    subtitle: "Traditional static presentations",
                    items: ["Linear navigation", "Static content", "Limited engagement"]
                },
                back: {
                    title: "After",
                    subtitle: "Interactive dynamic presentations",
                    items: ["Flexible navigation", "Interactive elements", "High engagement"]
                }
            }
        },
        {
            id: 5,
            type: "data",
            title: "Performance Metrics",
            metrics: [
                {
                    value: 95,
                    label: "User Engagement",
                    unit: "%",
                    color: "#2563eb"
                },
                {
                    value: 3.2,
                    label: "Average Session",
                    unit: "min",
                    color: "#f59e0b"
                },
                {
                    value: 87,
                    label: "Completion Rate",
                    unit: "%",
                    color: "#10b981"
                }
            ],
            chart: {
                type: "line",
                data: [65, 72, 80, 85, 90, 95],
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
            }
        },
        {
            id: 6,
            type: "timeline",
            title: "Development Process",
            steps: [
                {
                    number: 1,
                    title: "Planning",
                    description: "Define requirements and user experience"
                },
                {
                    number: 2,
                    title: "Design",
                    description: "Create wireframes and visual design"
                },
                {
                    number: 3,
                    title: "Development",
                    description: "Build interactive components"
                },
                {
                    number: 4,
                    title: "Testing",
                    description: "Ensure quality and performance"
                }
            ]
        },
        {
            id: 7,
            type: "gallery",
            title: "Visual Showcase",
            items: [
                {
                    icon: "fas fa-image",
                    title: "Interactive Charts",
                    description: "Dynamic data visualization"
                },
                {
                    icon: "fas fa-mobile-alt",
                    title: "Mobile Responsive",
                    description: "Perfect on all devices"
                },
                {
                    icon: "fas fa-palette",
                    title: "Custom Themes",
                    description: "Multiple design options"
                },
                {
                    icon: "fas fa-cogs",
                    title: "Advanced Features",
                    description: "Rich functionality"
                }
            ]
        },
        {
            id: 8,
            type: "conclusion",
            title: "Ready to Get Started?",
            content: "Transform your presentations with interactive elements, smooth animations, and engaging user experiences.",
            buttons: [
                {
                    text: "Start Creating",
                    type: "primary",
                    action: "start"
                },
                {
                    text: "Learn More",
                    type: "secondary",
                    action: "learn"
                }
            ],
            contact: "Questions? Contact us at info@example.com"
        }
    ]
};

// Theme configurations
const themes = {
    modern: {
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",
        accentColor: "#f59e0b",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        fontFamily: "Inter, sans-serif"
    },
    corporate: {
        primaryColor: "#1f2937",
        secondaryColor: "#374151",
        accentColor: "#3b82f6",
        backgroundColor: "#f9fafb",
        textColor: "#111827",
        fontFamily: "Inter, sans-serif"
    },
    creative: {
        primaryColor: "#7c3aed",
        secondaryColor: "#5b21b6",
        accentColor: "#f59e0b",
        backgroundColor: "#faf5ff",
        textColor: "#1f2937",
        fontFamily: "Inter, sans-serif"
    },
    educational: {
        primaryColor: "#059669",
        secondaryColor: "#047857",
        accentColor: "#f59e0b",
        backgroundColor: "#f0fdf4",
        textColor: "#1f2937",
        fontFamily: "Inter, sans-serif"
    }
};

// Interactive elements configuration
const interactiveElements = {
    hoverEffects: {
        cards: "lift", // lift, glow, scale
        buttons: "scale",
        images: "zoom"
    },
    clickEffects: {
        buttons: "ripple",
        cards: "flip",
        timeline: "expand"
    },
    animations: {
        entrance: "slideInUp",
        exit: "slideOutDown",
        emphasis: "pulse"
    }
};

// Export configuration for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { presentationConfig, themes, interactiveElements };
}

// Sample quiz/poll data for interactive slides
const quizData = {
    questions: [
        {
            id: 1,
            type: "multiple-choice",
            question: "What makes presentations more engaging?",
            options: [
                "Static content",
                "Interactive elements",
                "Long text blocks",
                "Small fonts"
            ],
            correct: 1,
            explanation: "Interactive elements keep audiences engaged and improve retention."
        },
        {
            id: 2,
            type: "poll",
            question: "Which device do you primarily use for presentations?",
            options: [
                "Desktop/Laptop",
                "Tablet",
                "Smartphone",
                "Projector"
            ]
        }
    ]
};

// Sample hotspot data for interactive images
const hotspotData = {
    image: "sample-diagram.jpg",
    hotspots: [
        {
            x: 25,
            y: 30,
            title: "Feature A",
            description: "This is an important feature that enhances user experience.",
            type: "info"
        },
        {
            x: 60,
            y: 45,
            title: "Integration Point",
            description: "Shows how different components work together.",
            type: "connection"
        },
        {
            x: 80,
            y: 70,
            title: "Output",
            description: "Final result of the process flow.",
            type: "result"
        }
    ]
};

// Accessibility configuration
const accessibilityConfig = {
    keyboardNavigation: true,
    screenReaderSupport: true,
    highContrast: false,
    reducedMotion: false,
    focusIndicators: true,
    skipLinks: true,
    ariaLabels: {
        nextSlide: "Go to next slide",
        previousSlide: "Go to previous slide",
        slideIndicator: "Go to slide",
        search: "Search slides",
        bookmark: "Bookmark current slide",
        autoplay: "Toggle auto-play",
        fullscreen: "Toggle fullscreen mode"
    }
};

// Performance optimization settings
const performanceConfig = {
    lazyLoading: true,
    imageOptimization: true,
    animationOptimization: true,
    preloadNextSlide: true,
    cacheSlides: true,
    maxCacheSize: 10
};

// Export all configurations
window.presentationConfig = presentationConfig;
window.themes = themes;
window.interactiveElements = interactiveElements;
window.quizData = quizData;
window.hotspotData = hotspotData;
window.accessibilityConfig = accessibilityConfig;
window.performanceConfig = performanceConfig;
