'use client'

import { BarChart3 } from 'lucide-react'

export function OutcomeUpliftChart() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
      <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Outcome Uplift</h3>
      <div className="h-48 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-xl bg-apple-gray-100 dark:bg-dark-hover flex items-center justify-center mb-3">
          <BarChart3 className="w-6 h-6 text-apple-gray-400" />
        </div>
        <p className="text-sm text-apple-gray-500 dark:text-slate-400 max-w-sm">
          This chart will show improvement deltas for projects using PMO standards vs those without.
        </p>
        <p className="text-xs text-apple-gray-400 mt-2 italic">
          Ask PMs to rate prompts and link projects to unlock impact analytics here.
        </p>
      </div>
    </div>
  )
}
