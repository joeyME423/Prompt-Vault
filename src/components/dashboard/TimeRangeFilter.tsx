'use client'

import type { TimeRange } from '@/hooks/useDashboardData'

interface TimeRangeFilterProps {
  value: TimeRange
  onChange: (range: TimeRange) => void
}

const OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '30d', label: 'Last 30 days' },
  { value: 'quarter', label: 'Last quarter' },
  { value: 'ytd', label: 'Year-to-date' },
]

export function TimeRangeFilter({ value, onChange }: TimeRangeFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TimeRange)}
      className="px-3 py-2 text-sm bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded-xl text-apple-black dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue/50 appearance-none cursor-pointer print:hidden"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
