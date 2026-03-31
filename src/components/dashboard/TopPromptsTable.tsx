'use client'

import { useState } from 'react'
import { TrendingUp, Star } from 'lucide-react'
import { PromptBadge } from './PromptBadge'
import { PromptFilters, type PromptFilter } from './PromptFilters'
import type { TopPrompt } from '@/hooks/useDashboardData'

interface TopPromptsTableProps {
  prompts: TopPrompt[]
  onPromptClick?: (prompt: TopPrompt) => void
}

export function TopPromptsTable({ prompts, onPromptClick }: TopPromptsTableProps) {
  const [filter, setFilter] = useState<PromptFilter>('all')

  const filtered = prompts.filter((p) => {
    switch (filter) {
      case 'standards': return p.isStandard
      case 'team': return !p.isStandard
      case 'low-adoption': return p.isStandard && p.use_count < 5
      default: return true
    }
  })

  // Sort: standards first, then by use count
  const sorted = [...filtered].sort((a, b) => {
    if (a.isStandard !== b.isStandard) return a.isStandard ? -1 : 1
    return b.use_count - a.use_count
  })

  if (prompts.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
        <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Top Prompts by Usage</h3>
        <p className="text-apple-gray-400 text-sm text-center py-8">No prompts yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-apple-black dark:text-white">Top Prompts by Usage</h3>
        <PromptFilters value={filter} onChange={setFilter} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-apple-gray-400 dark:text-slate-400 border-b border-apple-gray-200 dark:border-dark-border">
              <th className="pb-3 pr-4 font-medium">#</th>
              <th className="pb-3 pr-4 font-medium">Title</th>
              <th className="pb-3 pr-4 font-medium">Standard?</th>
              <th className="pb-3 pr-4 font-medium">Category</th>
              <th className="pb-3 pr-4 font-medium text-right">Uses</th>
              <th className="pb-3 pr-4 font-medium text-right">Success</th>
              <th className="pb-3 pr-4 font-medium text-right">Rating</th>
              <th className="pb-3 pr-4 font-medium text-right">Projects</th>
              <th className="pb-3 font-medium">Portfolio</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((prompt, i) => (
              <tr
                key={prompt.id}
                className={`border-b border-apple-gray-200/50 dark:border-dark-border/50 last:border-0 cursor-pointer hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors ${
                  prompt.isStandard ? 'border-l-2 border-l-apple-blue' : ''
                }`}
                onClick={() => onPromptClick?.(prompt)}
              >
                <td className="py-3 pr-4 text-sm text-apple-gray-400">{i + 1}</td>
                <td className="py-3 pr-4">
                  <p className="text-sm font-medium text-apple-black dark:text-white truncate max-w-[200px]">
                    {prompt.title}
                  </p>
                </td>
                <td className="py-3 pr-4">
                  <PromptBadge isStandard={prompt.isStandard} />
                </td>
                <td className="py-3 pr-4">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400">
                    {prompt.pmoCategory}
                  </span>
                </td>
                <td className="py-3 pr-4 text-sm text-apple-gray-500 dark:text-slate-300 text-right">
                  {prompt.use_count.toLocaleString()}
                </td>
                <td className="py-3 pr-4 text-right">
                  {prompt.feedbackCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      {prompt.successRate}%
                    </span>
                  ) : (
                    <span className="text-xs text-apple-gray-400">--</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-right">
                  {prompt.ratingCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      {prompt.avgRating}
                    </span>
                  ) : (
                    <span className="text-xs text-apple-gray-400">--</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-sm text-apple-gray-400 text-right">—</td>
                <td className="py-3 text-sm text-apple-gray-400">—</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <p className="text-apple-gray-400 text-sm text-center py-6">No prompts match this filter.</p>
        )}
      </div>
    </div>
  )
}
