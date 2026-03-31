'use client'

import { Lightbulb } from 'lucide-react'

interface HighlightsStripProps {
  highlights: string[]
}

export function HighlightsStrip({ highlights }: HighlightsStripProps) {
  if (highlights.length === 0) return null

  return (
    <div className="bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/15 dark:border-apple-blue/20 rounded-2xl p-4 mb-8">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-apple-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-apple-blue" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-apple-blue uppercase tracking-wide">Key Insights</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {highlights.map((h, i) => (
              <span key={i} className="text-sm text-apple-black dark:text-white">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
