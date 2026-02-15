'use client'

import { Clock, TrendingUp } from 'lucide-react'
import { CATEGORY_TIME_SAVED } from '@/lib/constants'

interface TimeSavedBannerProps {
  /** Map of category → number of copies */
  copyCounts: Record<string, number>
}

export function TimeSavedBanner({ copyCounts }: TimeSavedBannerProps) {
  const totalMinutes = Object.entries(copyCounts).reduce((sum, [category, count]) => {
    const minutesPerUse = CATEGORY_TIME_SAVED[category.toLowerCase()] || 10
    return sum + (minutesPerUse * count)
  }, 0)

  if (totalMinutes === 0) return null

  const totalCopies = Object.values(copyCounts).reduce((a, b) => a + b, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const timeDisplay = hours > 0
    ? `${hours}h ${minutes}m`
    : `${minutes}m`

  return (
    <div className="mb-8 p-4 rounded-xl bg-apple-blue/5 border border-apple-blue/10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-apple-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-apple-black dark:text-white">
              ~{timeDisplay} saved
            </p>
            <p className="text-xs text-apple-gray-400 dark:text-slate-400">
              Estimated time saved using PromptVault
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/50 dark:bg-dark-surface/50">
            <TrendingUp className="w-3.5 h-3.5 text-apple-blue" />
            <span className="text-xs font-medium text-apple-gray-500 dark:text-slate-300">
              {totalCopies} prompt{totalCopies !== 1 ? 's' : ''} used
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
