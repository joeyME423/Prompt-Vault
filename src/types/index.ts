export * from './database'

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export interface FilterOptions {
  category: string | null
  searchQuery: string
  sortBy: 'newest' | 'popular' | 'alphabetical'
}
