'use client'

import { LayoutGrid, List, TableProperties, Columns3 } from 'lucide-react'

export type LibraryView = 'grid' | 'list' | 'table' | 'kanban'

const views: { key: LibraryView; icon: typeof LayoutGrid; label: string }[] = [
  { key: 'grid', icon: LayoutGrid, label: 'Grid' },
  { key: 'list', icon: List, label: 'List' },
  { key: 'table', icon: TableProperties, label: 'Table' },
  { key: 'kanban', icon: Columns3, label: 'Kanban' },
]

interface ViewSwitcherProps {
  view: LibraryView
  onChange: (view: LibraryView) => void
}

export function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 dark:border-dark-border overflow-hidden">
      {views.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          title={label}
          className={`p-2 transition-colors ${
            view === key
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-dark-card text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-hover'
          }`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  )
}
