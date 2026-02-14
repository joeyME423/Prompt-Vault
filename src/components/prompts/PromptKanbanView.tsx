'use client'

import { Copy } from 'lucide-react'
import { useState } from 'react'
import { categoryColors } from '@/lib/constants'
import type { Prompt } from '@/types'

interface PromptKanbanViewProps {
  prompts: Prompt[]
  userId: string | null
  categories: string[]
}

export function PromptKanbanView({ prompts, categories }: PromptKanbanViewProps) {
  // Only show categories that have prompts
  const activeCategories = categories.filter(cat =>
    prompts.some(p => p.category.toLowerCase() === cat.toLowerCase())
  )

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {activeCategories.map((category) => {
        const categoryPrompts = prompts.filter(
          p => p.category.toLowerCase() === category.toLowerCase()
        )
        const colorClass = categoryColors[category.toLowerCase()] || categoryColors.default

        return (
          <div key={category} className="min-w-[280px] max-w-[320px] flex-shrink-0">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                {category}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {categoryPrompts.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {categoryPrompts.map((prompt) => (
                <KanbanCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function KanbanCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card p-4">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
        {prompt.title}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
        {prompt.description}
      </p>

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {prompt.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-dark-hover text-slate-500 dark:text-slate-400 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {prompt.use_count.toLocaleString()} uses
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            copied
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 dark:bg-dark-hover text-slate-600 dark:text-slate-400 hover:bg-primary-500 hover:text-white'
          }`}
        >
          <Copy className="w-3 h-3" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
