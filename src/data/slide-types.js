// Slide Type Definitions
// This file defines the data structure and validation for different slide types

/**
 * Base slide structure that all slides must follow
 */
export const BaseSlideType = {
  id: 'string',           // Unique identifier for the slide
  type: 'string',         // Type of slide (title, agenda, timeline, etc.)
  slideNumber: 'number',  // Position in the presentation
  title: 'string'         // Main title of the slide
};

/**
 * Title Slide Type
 * Used for the opening slide of the presentation
 */
export const TitleSlideType = {
  ...BaseSlideType,
  type: 'title',
  subtitle: 'string',
  presenters: 'string',
  team: 'string',
  icons: [
    {
      class: 'string',    // Font Awesome class
      label: 'string'     // Accessibility label
    }
  ],
  decorations: {
    hasLine: 'boolean',
    hasDots: 'boolean',
    dotCount: 'number'
  }
};

/**
 * Agenda Slide Type
 * Used for workshop agenda with clickable items
 */
export const AgendaSlideType = {
  ...BaseSlideType,
  type: 'agenda',
  agendaItems: [
    {
      number: 'number',
      icon: 'string',
      title: 'string',
      description: 'string',
      targetSlide: 'string',
      reveal: 'number'
    }
  ],
  footer: {
    icon: 'string',
    instruction: 'string'
  }
};

/**
 * Timeline Slide Type
 * Used for horizontal timeline presentations
 */
export const TimelineSlideType = {
  ...BaseSlideType,
  type: 'timeline',
  subtitle: 'string',
  timeline: {
    type: 'string',       // 'horizontal' or 'vertical'
    milestones: [
      {
        id: 'number',
        year: 'string',
        title: 'string',
        icon: 'string',
        summary: 'string',
        details: ['string'],
        tools: ['string']
      }
    ]
  }
};

/**
 * Workflow Slide Type
 * Used for step-by-step process demonstrations
 */
export const WorkflowSlideType = {
  ...BaseSlideType,
  type: 'workflow',
  prerequisites: {
    header: {
      icon: 'string',
      title: 'string'
    },
    items: [
      {
        icon: 'string',
        text: 'string'
      }
    ]
  },
  workflow: {
    steps: [
      {
        id: 'number',
        title: 'string',
        description: 'string',
        icon: 'string',
        details: 'object'    // Flexible structure for step details
      }
    ]
  }
};

/**
 * Platform Slide Type
 * Used for showcasing applications or platforms
 */
export const PlatformSlideType = {
  ...BaseSlideType,
  type: 'platform',
  platform: {
    overview: {
      logo: {
        icon: 'string'
      },
      info: {
        title: 'string',
        description: 'string'
      }
    },
    screenshot: {
      image: 'string',
      alt: 'string',
      overlay: 'string'
    },
    preview: {
      url: 'string',
      text: 'string',
      icon: 'string'
    },
    engagement: {
      question: {
        icon: 'string',
        title: 'string',
        hint: 'string'
      }
    }
  }
};

/**
 * Gallery Slide Type
 * Used for image galleries with navigation
 */
export const GallerySlideType = {
  ...BaseSlideType,
  type: 'gallery',
  gallery: {
    screenshots: [
      {
        id: 'number',
        image: 'string',
        alt: 'string',
        title: 'string',
        description: 'string',
        demoLink: 'string'
      }
    ],
    projectLink: {
      url: 'string',
      text: 'string',
      icon: 'string'
    }
  }
};

/**
 * Security Slide Type
 * Used for security testing information
 */
export const SecuritySlideType = {
  ...BaseSlideType,
  type: 'security',
  security: {
    categories: [
      {
        id: 'string',
        icon: 'string',
        title: 'string',
        description: 'string',
        tools: ['string']
      }
    ],
    stats: [
      {
        number: 'string',
        text: 'string'
      }
    ]
  }
};

/**
 * Conclusion Slide Type
 * Used for final slide with next steps and contact info
 */
export const ConclusionSlideType = {
  ...BaseSlideType,
  type: 'conclusion',
  learning: {
    cards: [
      {
        icon: 'string',
        title: 'string',
        description: 'string'
      }
    ]
  },
  nextSteps: {
    title: 'string',
    actions: [
      {
        icon: 'string',
        text: 'string'
      }
    ]
  },
  conclusion: {
    cta: {
      primary: 'string',
      secondary: 'string'
    },
    contact: {
      title: 'string',
      presenters: 'string',
      team: 'string',
      message: 'string'
    }
  }
};

/**
 * Map of slide types to their definitions
 */
export const SlideTypeMap = {
  title: TitleSlideType,
  agenda: AgendaSlideType,
  timeline: TimelineSlideType,
  workflow: WorkflowSlideType,
  platform: PlatformSlideType,
  gallery: GallerySlideType,
  security: SecuritySlideType,
  conclusion: ConclusionSlideType
};

/**
 * Get the type definition for a specific slide type
 * @param {string} type - The slide type
 * @returns {object} The type definition
 */
export function getSlideTypeDefinition(type) {
  return SlideTypeMap[type] || BaseSlideType;
}
