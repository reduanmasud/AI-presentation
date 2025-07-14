// Slide Data Structure
// This file contains all slide content extracted from the original HTML

export const slidesData = [
  // Slide 1: Title Slide
  {
    id: 'title-slide',
    type: 'title',
    slideNumber: 1,
    title: 'AI in QA & Security Testing',
    subtitle: 'Practical Applications',
    presenters: 'Reduan Masud & Arafat',
    team: 'QA Team & xCloud',
    icons: [
      { class: 'fas fa-robot', label: 'AI' },
      { class: 'fas fa-shield-alt', label: 'Security' },
      { class: 'fas fa-bug', label: 'Testing' }
    ],
    decorations: {
      hasLine: true,
      hasDots: true,
      dotCount: 3
    }
  },

  // Slide 2: Workshop Agenda
  {
    id: 'agenda-slide',
    type: 'agenda',
    slideNumber: 2,
    title: 'Workshop Agenda',
    agendaItems: [
      {
        number: 1,
        icon: 'fas fa-history',
        title: 'Brief Evolution of Modern AI',
        description: 'Understanding AI\'s journey and current capabilities',
        targetSlide: 'ai-evolution-slide',
        reveal: 1
      },
      {
        number: 2,
        icon: 'fas fa-robot',
        title: 'Generate Test Cases Using AI',
        description: 'Practical AI tools for automated test case generation',
        targetSlide: 'xcloud-workflow-slide',
        reveal: 2
      },
      {
        number: 3,
        icon: 'fas fa-dungeon',
        title: 'DevOps Dungeon - An Interesting App',
        description: 'Exploring innovative DevOps automation tools',
        targetSlide: 'devops-dungeon-slide',
        reveal: 3
      },
      {
        number: 4,
        icon: 'fas fa-gem',
        title: 'An Underrated App: Gemini',
        description: 'Discovering hidden gems in AI-powered testing',
        targetSlide: 'gemini-slide',
        reveal: 4
      },
      {
        number: 5,
        icon: 'fas fa-shield-alt',
        title: 'AI in Security Testing',
        description: 'Vulnerability detection and security automation',
        targetSlide: 'security-slide',
        reveal: 5
      },
      {
        number: 6,
        icon: 'fas fa-graduation-cap',
        title: 'AI for Learning & Development',
        description: 'Continuous learning and skill enhancement with AI',
        targetSlide: 'conclusion-slide',
        reveal: 6
      },
      {
        number: 7,
        icon: 'fas fa-chart-line',
        title: 'Staying Ahead: AI Trends & Resources',
        description: 'Future trends and valuable resources',
        targetSlide: 'conclusion-slide',
        reveal: 7
      },
      {
        number: 8,
        icon: 'fas fa-comments',
        title: 'Q&A and Next Steps',
        description: 'Discussion and action items',
        targetSlide: 'conclusion-slide',
        reveal: 8
      }
    ],
    footer: {
      icon: 'fas fa-hand-pointer',
      instruction: 'Click any agenda item to jump directly to that section'
    }
  },

  // Slide 3: AI Evolution Timeline
  {
    id: 'ai-evolution-slide',
    type: 'timeline',
    slideNumber: 3,
    title: 'Brief Evolution of Modern AI',
    subtitle: 'From ChatGPT hype to context engineering — the AI journey in QA & Testing',
    timeline: {
      type: 'horizontal',
      milestones: [
        {
          id: 1,
          year: 'Late 2022',
          title: 'ChatGPT & The Hype',
          icon: 'fas fa-comments',
          summary: 'The world met ChatGPT!',
          details: [
            'Everyone was chatting with AI — writing poems, code, even love letters',
            'Fun fact: ChatGPT hit 100 million users faster than TikTok!'
          ],
          tools: ['100M in 2 months']
        },
        {
          id: 2,
          year: '2023',
          title: 'Prompt Engineering Era',
          icon: 'fas fa-brain',
          summary: 'The art of talking to AI',
          details: [
            'People realized: "How you ask matters!"',
            'Prompt engineering became a skill (and a job title)',
            'Everyone was crafting the perfect prompt'
          ],
          tools: ['Chain-of-thought', 'Few-shot learning', 'Role-based prompts']
        },
        {
          id: 3,
          year: 'Late 2023',
          title: 'Agentic AI & Tools like n8n',
          icon: 'fas fa-robot',
          summary: 'AI agents started doing the work',
          details: [
            'AI agents could now use tools and APIs',
            'Workflow automation became AI-powered',
            'n8n, Zapier, and others integrated AI capabilities'
          ],
          tools: ['n8n', 'AutoGPT', 'LangChain']
        },
        {
          id: 4,
          year: 'Mid 2024',
          title: '"Vive Coding" Era',
          icon: 'fas fa-code',
          summary: 'AI became your coding buddy',
          details: [
            'AI could write, debug, and explain code',
            'Pair programming with AI became normal',
            'Code generation reached production quality'
          ],
          tools: ['GitHub Copilot', 'Cursor', 'Claude Dev']
        },
        {
          id: 5,
          year: 'Early 2025',
          title: 'Beyond Prompts: Context Engineering',
          icon: 'fas fa-database',
          summary: 'Context became king',
          details: [
            'RAG (Retrieval-Augmented Generation) everywhere',
            'AI systems with deep domain knowledge',
            'Context-aware AI that understands your codebase'
          ],
          tools: ['Augment', 'Cursor with codebase context', 'Custom RAG systems']
        }
      ]
    }
  },

  // Slide 4: xCloud Workflow
  {
    id: 'xcloud-workflow-slide',
    type: 'workflow',
    slideNumber: 4,
    title: 'Generate Test Cases Using AI - xCloud Workflow',
    prerequisites: {
      header: {
        icon: 'fas fa-exclamation-triangle',
        title: 'Prerequisites'
      },
      items: [
        {
          icon: 'fab fa-github',
          text: 'GitHub access to xCloud repository'
        },
        {
          icon: 'fas fa-code-branch',
          text: 'Proper Pull Request workflow knowledge'
        }
      ]
    },
    workflow: {
      steps: [
        {
          id: 1,
          title: 'xCloud Process Overview',
          description: 'GitHub Project Manager Integration',
          icon: 'fas fa-project-diagram',
          details: {
            badge: 'GitHub Integration',
            items: [
              {
                icon: 'fab fa-github',
                title: 'GitHub Project Manager Integration',
                description: 'Seamless synchronization between developers and QA teams through automated project management'
              },
              {
                icon: 'fas fa-code-branch',
                title: 'Pull Request Workflow',
                description: 'Structured workflow for features, fixes, and releases with automated test case generation'
              },
              {
                icon: 'fas fa-sync-alt',
                title: 'Developer-QA Synchronization',
                description: 'Real-time collaboration and communication through integrated tools and workflows'
              }
            ]
          }
        },
        {
          id: 2,
          title: 'Before vs. After Comparison',
          description: 'Traditional vs AI-Powered Methods',
          icon: 'fas fa-balance-scale',
          details: {
            badge: 'Transformation',
            comparison: {
              before: {
                title: 'Traditional Method',
                icon: 'fas fa-clock',
                items: [
                  'Manual test case writing',
                  'Time-consuming QA briefings',
                  'Lengthy code review processes',
                  'Inconsistent test coverage',
                  'Human error prone'
                ],
                time: {
                  value: '4-6 hours',
                  label: 'per feature'
                }
              },
              after: {
                title: 'AI-Powered Method',
                icon: 'fas fa-robot',
                items: [
                  'Automated generation using Augment',
                  'PR ID input for context',
                  'Comprehensive test coverage',
                  'Consistent quality output',
                  'Edge case detection'
                ],
                time: {
                  value: '30-45 min',
                  label: 'per feature',
                  success: true
                }
              }
            }
          }
        },
        {
          id: 3,
          title: 'Live Demo',
          description: 'Interactive Workflow Demonstration',
          icon: 'fas fa-play-circle',
          details: {
            badge: 'Interactive',
            demoContent: 'Live demonstration content will be shown here'
          }
        }
      ]
    }
  },

  // Slide 5: DevOps Dungeon
  {
    id: 'devops-dungeon-slide',
    type: 'platform',
    slideNumber: 5,
    title: 'DevOps Dungeon - Learning Platform',
    platform: {
      overview: {
        logo: {
          icon: 'fas fa-dungeon'
        },
        info: {
          title: 'Interactive DevOps Learning Environment',
          description: 'Hands-on challenges and real-world scenarios for skill development'
        }
      },
      screenshot: {
        image: 'devops-dungeon.png',
        alt: 'DevOps Dungeon Interface',
        overlay: 'Live Platform Interface'
      },
      preview: {
        url: 'https://studio.firebase.google.com/studio-9086808136',
        text: 'Preview Platform',
        icon: 'fas fa-external-link-alt'
      },
      engagement: {
        question: {
          icon: 'fas fa-question-circle',
          title: 'What technical expertise do you think is required to build this platform?',
          hint: 'Consider the infrastructure, containerization, and deployment requirements...'
        }
      }
    }
  },

  // Slide 6: Gemini Gallery
  {
    id: 'gemini-slide',
    type: 'gallery',
    slideNumber: 6,
    title: 'Gemini - An Underrated App',
    gallery: {
      screenshots: [
        {
          id: 1,
          image: 'gemini-app-01.png',
          alt: 'Gemini App - Plugin Analysis',
          title: 'Use Case 1: Plugin Analysis of WPDeveloper',
          description: 'Demonstrate Gemini\'s code analysis and plugin evaluation capabilities',
          demoLink: 'https://gemini.google.com/app/249322542af0dc33'
        },
        {
          id: 2,
          image: 'gemini-app-02.png',
          alt: 'Gemini App - Banner Design',
          title: 'Use Case 2: Banner Design',
          description: 'Showcase Gemini\'s creative design and visual content generation abilities',
          demoLink: 'https://gemini.google.com/app/e4f782bbe810159a'
        },
        {
          id: 3,
          image: 'gemini-app-03.png',
          alt: 'Gemini App - xCloud vs Gridpane',
          title: 'Use Case 3: xCloud vs Gridpane Comparison',
          description: 'Highlight Gemini\'s analytical comparison and technical evaluation skills',
          demoLink: 'https://g.co/gemini/share/52e9cfdfc5bc'
        }
      ],
      projectLink: {
        url: 'https://github.com/your-username/gemini-app',
        text: 'Go to Project',
        icon: 'fab fa-github'
      }
    }
  },

  // Slide 7: Security Testing
  {
    id: 'security-slide',
    type: 'security',
    slideNumber: 7,
    title: 'AI in Security Testing',
    security: {
      categories: [
        {
          id: 'vulnerability',
          icon: 'fas fa-shield-alt',
          title: 'Vulnerability Detection',
          description: 'AI-powered SAST/DAST tools for automated security scanning',
          tools: ['Snyk', 'Veracode', 'Checkmarx']
        },
        {
          id: 'penetration',
          icon: 'fas fa-user-secret',
          title: 'Intelligent Penetration Testing',
          description: 'AI-driven attack simulation and threat modeling',
          tools: ['Metasploit', 'Burp Suite', 'OWASP ZAP']
        },
        {
          id: 'monitoring',
          icon: 'fas fa-eye',
          title: 'Real-time Threat Monitoring',
          description: 'ML-based anomaly detection and incident response',
          tools: ['Splunk', 'Darktrace', 'CrowdStrike']
        },
        {
          id: 'compliance',
          icon: 'fas fa-clipboard-check',
          title: 'Compliance Automation',
          description: 'Automated security policy validation and reporting',
          tools: ['AWS Config', 'Azure Policy', 'Chef InSpec']
        }
      ],
      stats: [
        {
          number: '70%',
          text: 'Faster vulnerability detection'
        },
        {
          number: '85%',
          text: 'Reduction in false positives'
        }
      ]
    }
  },

  // Slide 8: Conclusion & Next Steps
  {
    id: 'conclusion-slide',
    type: 'conclusion',
    slideNumber: 8,
    title: 'AI for Learning & Development',
    learning: {
      cards: [
        {
          icon: 'fas fa-graduation-cap',
          title: 'Personalized Learning Paths',
          description: 'AI-curated courses based on skill gaps and career goals'
        },
        {
          icon: 'fas fa-brain',
          title: 'Intelligent Mentoring',
          description: 'AI-powered code reviews and best practice suggestions'
        },
        {
          icon: 'fas fa-chart-line',
          title: 'Progress Tracking',
          description: 'Real-time skill assessment and improvement recommendations'
        }
      ]
    },
    nextSteps: {
      title: '🚀 Next Steps & Action Items',
      actions: [
        {
          icon: 'fas fa-play',
          text: 'Start experimenting with AI tools in your current projects'
        },
        {
          icon: 'fas fa-users',
          text: 'Form AI-QA study groups within your teams'
        },
        {
          icon: 'fas fa-book',
          text: 'Explore recommended resources and training materials'
        },
        {
          icon: 'fas fa-lightbulb',
          text: 'Identify pilot projects for AI integration'
        }
      ]
    },
    conclusion: {
      cta: {
        primary: 'Start Your AI Journey',
        secondary: 'Access Resources'
      },
      contact: {
        title: 'Questions & Discussion',
        presenters: 'Reduan Masud & Arafat',
        team: 'QA Team & xCloud',
        message: 'Let\'s continue the conversation and explore AI possibilities together!'
      }
    }
  }
];
