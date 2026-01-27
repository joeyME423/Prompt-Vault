'use client'

interface FilterTabsProps {
  categories: string[]
  activeCategory: string | null
  onChange: (category: string | null) => void
}

export function FilterTabs({ categories, activeCategory, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          activeCategory === null
            ? 'bg-primary-500 text-white'
            : 'bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-hover'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeCategory === category
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-hover'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
