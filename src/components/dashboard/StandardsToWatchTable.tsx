'use client'

import { AlertTriangle } from 'lucide-react'
import { PromptBadge } from './PromptBadge'
import type { TopPrompt } from '@/hooks/useDashboardData'

interface StandardsToWatchTableProps {
  prompts: TopPrompt[]
  onPromptClick?: (prompt: TopPrompt) => void
}

export function StandardsToWatchTable({ prompts, onPromptClick }: StandardsToWatchTableProps) {
  if (prompts.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
        <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Standards to Watch</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-sm text-apple-gray-500 dark:text-slate-400 max-w-sm">
            Mark prompts as PMO Standard to start tracking adoption. Standards with low usage will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
      <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Standards to Watch</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-apple-gray-400 dark:text-slate-400 border-b border-apple-gray-200 dark:border-dark-border">
              <th className="pb-3 pr-4 font-medium">Title</th>
              <th className="pb-3 pr-4 font-medium">Category</th>
              <th className="pb-3 pr-4 font-medium">Type</th>
              <th className="pb-3 pr-4 font-medium text-right">Uses</th>
              <th className="pb-3 font-medium text-right">Success</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt) => (
              <tr
                key={prompt.id}
                className="border-b border-apple-gray-200/50 dark:border-dark-border/50 last:border-0 cursor-pointer hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
                onClick={() => onPromptClick?.(prompt)}
              >
                <td className="py-3 pr-4">
                  <p className="text-sm font-medium text-apple-black dark:text-white truncate max-w-[200px]">
                    {prompt.title}
                  </p>
                </td>
                <td className="py-3 pr-4">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400">
                    {prompt.pmoCategory}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <PromptBadge isStandard={prompt.isStandard} />
                </td>
                <td className="py-3 pr-4 text-sm text-apple-gray-500 dark:text-slate-300 text-right">
                  {prompt.use_count.toLocaleString()}
                </td>
                <td className="py-3 text-right">
                  {prompt.feedbackCount > 0 ? (
                    <span className="text-xs text-green-600 dark:text-green-400">{prompt.successRate}%</span>
                  ) : (
                    <span className="text-xs text-apple-gray-400">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
