'use client'

export type PromptFilter = 'all' | 'standards' | 'team' | 'low-adoption'

interface PromptFiltersProps {
  value: PromptFilter
  onChange: (filter: PromptFilter) => void
}

const FILTERS: { value: PromptFilter; label: string }[] = [
  { value: 'all', label: 'All prompts' },
  { value: 'standards', label: 'Only standards' },
  { value: 'team', label: 'Only team prompts' },
  { value: 'low-adoption', label: 'Standards with low adoption' },
]

export function PromptFilters({ value, onChange }: PromptFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            value === f.value
              ? 'bg-apple-blue text-white border-apple-blue'
              : 'bg-white dark:bg-dark-card text-apple-gray-500 dark:text-slate-400 border-apple-gray-200 dark:border-dark-border hover:border-apple-blue/40'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
