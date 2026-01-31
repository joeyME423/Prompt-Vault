export interface PMTool {
  id: string
  name: string
  slug: string
  description: string
  aiFeatureName: string
  aiFeatureDescription: string
  logoUrl: string
  color: string
  features: string[]
}

export const PM_TOOLS: PMTool[] = [
  {
    id: 'wrike',
    name: 'Wrike',
    slug: 'wrike',
    description: 'Enterprise-grade project management platform with powerful automation and collaboration features.',
    aiFeatureName: 'Wrike Work Intelligence',
    aiFeatureDescription: 'AI-powered work intelligence that predicts project risks, automates task creation, and provides smart recommendations for resource allocation.',
    logoUrl: '/tools/wrike.svg',
    color: '#00D084',
    features: [
      'Predictive risk assessment',
      'Smart task suggestions',
      'Automated status updates',
      'Intelligent resource planning',
      'AI-powered search',
    ],
  },
  {
    id: 'asana',
    name: 'Asana',
    slug: 'asana',
    description: 'Work management platform designed to help teams organize, track, and manage their work.',
    aiFeatureName: 'Asana Intelligence',
    aiFeatureDescription: 'AI capabilities that help teams write clearer goals, summarize projects, and get smart answers about their work.',
    logoUrl: '/tools/asana.svg',
    color: '#F06A6A',
    features: [
      'Smart project summaries',
      'Goal writing assistance',
      'Status update drafts',
      'Smart field suggestions',
      'AI-powered search answers',
    ],
  },
  {
    id: 'clickup',
    name: 'ClickUp',
    slug: 'clickup',
    description: 'All-in-one productivity platform combining project management, docs, goals, and more.',
    aiFeatureName: 'ClickUp Brain',
    aiFeatureDescription: 'Neural network connecting tasks, docs, and people. Generate content, summarize updates, and automate workflows with AI.',
    logoUrl: '/tools/clickup.svg',
    color: '#7B68EE',
    features: [
      'AI writing assistant',
      'Task summarization',
      'Standup reports generation',
      'Document Q&A',
      'Workflow automation',
    ],
  },
  {
    id: 'monday',
    name: 'Monday.com',
    slug: 'monday',
    description: 'Work OS that powers teams to run projects and workflows with confidence.',
    aiFeatureName: 'Monday AI',
    aiFeatureDescription: 'AI assistant that helps generate content, automate tasks, and build formulas without technical knowledge.',
    logoUrl: '/tools/monday.svg',
    color: '#FF3D57',
    features: [
      'Content generation',
      'Formula builder',
      'Task automation',
      'Email composition',
      'Data analysis',
    ],
  },
  {
    id: 'smartsheet',
    name: 'Smartsheet',
    slug: 'smartsheet',
    description: 'Dynamic work platform for enterprise teams to plan, capture, manage, and report on work.',
    aiFeatureName: 'Smartsheet AI',
    aiFeatureDescription: 'AI-powered assistance for generating formulas, summarizing data, and automating repetitive tasks.',
    logoUrl: '/tools/smartsheet.svg',
    color: '#0073EA',
    features: [
      'Formula generation',
      'Data summarization',
      'Content drafting',
      'Workflow suggestions',
      'Intelligent automation',
    ],
  },
]

export function getToolBySlug(slug: string): PMTool | undefined {
  return PM_TOOLS.find((tool) => tool.slug === slug)
}

export function getToolTagPrefix(toolName: string): string {
  return `tool:${toolName}`
}
