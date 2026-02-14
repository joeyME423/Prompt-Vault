'use client'

import { Copy, Bookmark } from 'lucide-react'
import { useState } from 'react'
import { categoryColors } from '@/lib/constants'
import type { Prompt } from '@/types'

interface PromptListViewProps {
  prompts: Prompt[]
  userId: string | null
}

export function PromptListView({ prompts }: PromptListViewProps) {
  return (
    <div className="card divide-y divide-slate-200 dark:divide-dark-border overflow-hidden">
      {prompts.map((prompt) => (
        <PromptListRow key={prompt.id} prompt={prompt} />
      ))}
    </div>
  )
}

function PromptListRow({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false)
  const colorClass = categoryColors[prompt.category.toLowerCase()] || categoryColors.default

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors">
      {/* Category */}
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colorClass}`}>
        {prompt.category}
      </span>

      {/* Title & Description */}
      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
          {prompt.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {prompt.description}
        </p>
      </div>

      {/* Tags */}
      <div className="hidden md:flex gap-1.5 flex-shrink-0">
        {prompt.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-dark-hover text-slate-500 dark:text-slate-400 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>

      {/* Use count */}
      <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:block">
        {prompt.use_count.toLocaleString()} uses
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={handleCopy}
          className={`p-1.5 rounded-lg transition-colors ${
            copied ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-dark-hover'
          }`}
          title="Copy prompt"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors" title="Save prompt">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
