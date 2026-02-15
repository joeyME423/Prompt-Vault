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
  planning: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  communication: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  reporting: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  risk: 'bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400',
  stakeholder: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400',
  agile: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
  meetings: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
}

export function TopPromptsTable({ prompts }: TopPromptsTableProps) {
  if (prompts.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top Prompts</h3>
        <p className="text-slate-400 text-sm text-center py-8">No prompts yet</p>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top Prompts by Usage</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-dark-border">
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
              const colorClass = categoryColors[prompt.category.toLowerCase()] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              return (
                <tr key={prompt.id} className="border-b border-slate-100 dark:border-dark-border/50 last:border-0">
                  <td className="py-3 pr-4 text-sm text-slate-400">{i + 1}</td>
                  <td className="py-3 pr-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                      {prompt.title}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                      {prompt.category}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-300 text-right">
                    {prompt.use_count.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    {prompt.feedbackCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        {prompt.successRate}%
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">--</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {prompt.ratingCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        {prompt.avgRating}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">--</span>
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
