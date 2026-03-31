'use client'

import { Shield, Users } from 'lucide-react'

interface PromptBadgeProps {
  isStandard: boolean
}

export function PromptBadge({ isStandard }: PromptBadgeProps) {
  if (isStandard) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-apple-blue/10 text-apple-blue border border-apple-blue/20">
        <Shield className="w-3 h-3" />
        PMO Standard
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-apple-gray-100 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400">
      <Users className="w-3 h-3" />
      Team Prompt
    </span>
  )
}
