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
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeCategory === null
            ? 'bg-apple-blue text-white'
            : 'bg-apple-gray-50 dark:bg-dark-card text-apple-gray-500 dark:text-slate-300 hover:bg-apple-gray-200 dark:hover:bg-dark-hover'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === category
              ? 'bg-apple-blue text-white'
              : 'bg-apple-gray-50 dark:bg-dark-card text-apple-gray-500 dark:text-slate-300 hover:bg-apple-gray-200 dark:hover:bg-dark-hover'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
