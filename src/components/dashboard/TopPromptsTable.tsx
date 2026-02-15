'use client'

import { TrendingUp, Star } from 'lucide-react'

interface TopPrompt {
  id: string
  title: string
  category: string
  use_count: number
  successRate: number
  avgRating: number
  feedbackCount: number
  ratingCount: number
}

interface TopPromptsTableProps {
  prompts: TopPrompt[]
}

const categoryColors: Record<string, string> = {
  planning: 'bg-apple-gray-50 text-apple-gray-500 dark:bg-dark-hover dark:text-apple-gray-400',
  communication: 'bg-apple-gray-50 text-apple-gray-500 dark:bg-dark-hover dark:text-apple-gray-400',
  reporting: 'bg-apple-gray-50 text-apple-gray-500 dark:bg-dark-hover dark:text-apple-gray-400',
  risk: 'bg-apple-gray-50 text-apple-gray-500 dark:bg-dark-hover dark:text-apple-gray-400',
  stakeholder: 'bg-apple-gray-50 text-apple-gray-500 dark:bg-dark-hover dark:text-apple-gray-400',
  agile: 'bg-apple-gray-50 text-apple-gray-500 dark:bg-dark-hover dark:text-apple-gray-400',
  meetings: 'bg-apple-gray-50 text-apple-gray-500 dark:bg-dark-hover dark:text-apple-gray-400',
}

export function TopPromptsTable({ prompts }: TopPromptsTableProps) {
  if (prompts.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
        <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Top Prompts</h3>
        <p className="text-apple-gray-400 text-sm text-center py-8">No prompts yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
      <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Top Prompts by Usage</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-apple-gray-400 dark:text-slate-400 border-b border-apple-gray-200 dark:border-dark-border">
              <th className="pb-3 pr-4 font-medium">#</th>
              <th className="pb-3 pr-4 font-medium">Title</th>
              <th className="pb-3 pr-4 font-medium">Category</th>
              <th className="pb-3 pr-4 font-medium text-right">Uses</th>
              <th className="pb-3 pr-4 font-medium text-right">Success</th>
              <th className="pb-3 font-medium text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt, i) => {
              const colorClass = categoryColors[prompt.category.toLowerCase()] || 'bg-apple-gray-50 text-apple-gray-500 dark:bg-dark-hover dark:text-apple-gray-400'
              return (
                <tr key={prompt.id} className="border-b border-apple-gray-200/50 dark:border-dark-border/50 last:border-0">
                  <td className="py-3 pr-4 text-sm text-apple-gray-400">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <p className="text-sm font-medium text-apple-black dark:text-white truncate max-w-[200px]">
                      {prompt.title}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                      {prompt.category}
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
                  <td className="py-3 text-right">
                    {prompt.ratingCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        {prompt.avgRating}
                      </span>
                    ) : (
                      <span className="text-xs text-apple-gray-400">--</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
