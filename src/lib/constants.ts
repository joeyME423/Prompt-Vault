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

// Estimated minutes saved per prompt copy, by category
export const CATEGORY_TIME_SAVED: Record<string, number> = {
  planning: 15,
  execution: 12,
  'risk management': 15,
  communication: 10,
  reporting: 20,
  agile: 10,
  meetings: 10,
  stakeholder: 12,
  risk: 15,
}

export const categoryColors: Record<string, string> = {
  planning: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  execution: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  'risk management': 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  communication: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  reporting: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  agile: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  meetings: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  stakeholder: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  risk: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  default: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
}
