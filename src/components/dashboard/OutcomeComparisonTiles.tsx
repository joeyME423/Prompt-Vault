'use client'

import { Clock, DollarSign, Star } from 'lucide-react'
import type { OutcomeComparison } from '@/hooks/useDashboardData'

interface OutcomeComparisonTilesProps {
  data: OutcomeComparison[]
}

const ICONS: Record<string, typeof Clock> = {
  'On-time completion': Clock,
  'On-budget delivery': DollarSign,
  'Stakeholder satisfaction': Star,
}

export function OutcomeComparisonTiles({ data }: OutcomeComparisonTilesProps) {
  const hasData = data.some(d => d.withStandards !== null || d.withoutStandards !== null)

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {data.map((item) => {
          const Icon = ICONS[item.metric] || Clock
          return (
            <div key={item.metric} className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-apple-gray-100 dark:bg-dark-hover flex items-center justify-center">
                  <Icon className="w-4 h-4 text-apple-gray-400" />
                </div>
                <span className="text-sm font-medium text-apple-black dark:text-white">{item.metric}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-apple-gray-400">
                  <span>With standards</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between text-xs text-apple-gray-400">
                  <span>Without standards</span>
                  <span>—</span>
                </div>
              </div>
              <p className="text-xs text-apple-gray-400 mt-4 italic">
                Link projects to prompts to unlock this metric.
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {data.map((item) => {
        const Icon = ICONS[item.metric] || Clock
        return (
          <div key={item.metric} className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-sm font-medium text-apple-black dark:text-white">{item.metric}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-apple-gray-500 dark:text-slate-400">With standards</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{item.withStandards}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-apple-gray-500 dark:text-slate-400">Without standards</span>
                <span className="font-semibold text-apple-gray-500">{item.withoutStandards}%</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
