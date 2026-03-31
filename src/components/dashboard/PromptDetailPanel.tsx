'use client'

import { X, TrendingUp, Star, Copy } from 'lucide-react'
import { PromptBadge } from './PromptBadge'
import type { TopPrompt } from '@/hooks/useDashboardData'

interface PromptDetailPanelProps {
  prompt: TopPrompt | null
  onClose: () => void
}

export function PromptDetailPanel({ prompt, onClose }: PromptDetailPanelProps) {
  if (!prompt) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40 print:hidden" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-dark-card border-l border-apple-gray-200 dark:border-dark-border z-50 overflow-y-auto print:hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-apple-black dark:text-white mb-2 truncate">
                {prompt.title}
              </h2>
              <PromptBadge isStandard={prompt.isStandard} />
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-dark-hover transition-colors"
            >
              <X className="w-5 h-5 text-apple-gray-400" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-apple-gray-50 dark:bg-dark-hover rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Copy className="w-4 h-4 text-apple-blue" />
                <span className="text-xs text-apple-gray-500 dark:text-slate-400">Total Uses</span>
              </div>
              <p className="text-xl font-bold text-apple-black dark:text-white">{prompt.use_count.toLocaleString()}</p>
            </div>
            <div className="bg-apple-gray-50 dark:bg-dark-hover rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-apple-gray-500 dark:text-slate-400">Success Rate</span>
              </div>
              <p className="text-xl font-bold text-apple-black dark:text-white">
                {prompt.feedbackCount > 0 ? `${prompt.successRate}%` : '--'}
              </p>
            </div>
            <div className="bg-apple-gray-50 dark:bg-dark-hover rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-apple-gray-500 dark:text-slate-400">Avg Rating</span>
              </div>
              <p className="text-xl font-bold text-apple-black dark:text-white">
                {prompt.ratingCount > 0 ? prompt.avgRating : '--'}
              </p>
            </div>
            <div className="bg-apple-gray-50 dark:bg-dark-hover rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-apple-gray-500 dark:text-slate-400">Category</span>
              </div>
              <p className="text-sm font-semibold text-apple-black dark:text-white">{prompt.pmoCategory}</p>
            </div>
          </div>

          {/* Projects Using */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-3">Projects Using This Prompt</h3>
            <div className="bg-apple-gray-50 dark:bg-dark-hover rounded-xl p-4 text-center">
              <p className="text-sm text-apple-gray-400 italic">
                Link projects to prompts to see which projects use this standard.
              </p>
            </div>
          </div>

          {/* Outcome KPIs */}
          <div>
            <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-3">Linked Outcome KPIs</h3>
            <div className="bg-apple-gray-50 dark:bg-dark-hover rounded-xl p-4 text-center">
              <p className="text-sm text-apple-gray-400 italic">
                Outcome data will appear here once projects are linked and outcomes are tracked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
