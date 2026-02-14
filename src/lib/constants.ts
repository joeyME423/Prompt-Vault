export const CATEGORIES = [
  'Planning',
  'Execution',
  'Risk Management',
  'Communication',
  'Reporting',
  'Agile',
  'Meetings',
]

export const PM_ROLES = [
  'Product Manager',
  'Scrum Master',
  'Program Manager',
  'Engineering Manager',
  'Project Coordinator',
  'Other',
] as const

export type PMRole = typeof PM_ROLES[number]

export const ROLE_CATEGORY_MAP: Record<string, string[]> = {
  'Product Manager': ['Planning', 'Reporting', 'Stakeholder'],
  'Scrum Master': ['Agile', 'Meetings', 'Execution'],
  'Program Manager': ['Risk Management', 'Communication', 'Reporting'],
  'Engineering Manager': ['Planning', 'Execution', 'Communication'],
  'Project Coordinator': ['Meetings', 'Planning', 'Communication'],
  'Other': [],
}

export const categoryColors: Record<string, string> = {
  planning: 'bg-accent-blue/10 text-accent-blue',
  execution: 'bg-primary-500/10 text-primary-500',
  'risk management': 'bg-accent-pink/10 text-accent-pink',
  communication: 'bg-accent-purple/10 text-accent-purple',
  reporting: 'bg-primary-500/10 text-primary-500',
  agile: 'bg-accent-cyan/10 text-accent-cyan',
  meetings: 'bg-accent-blue/10 text-accent-blue',
  default: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
}
