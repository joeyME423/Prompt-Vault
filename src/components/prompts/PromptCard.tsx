'use client'

import { Copy, Bookmark, BookmarkCheck } from 'lucide-react'
import { useState } from 'react'
import type { Prompt } from '@/types'

interface PromptCardProps {
  prompt: Prompt
  isSaved?: boolean
  onSave?: (promptId: string) => void
  onCopy?: (content: string) => void
}

const categoryColors: Record<string, string> = {
  planning: 'bg-accent-blue/10 text-accent-blue',
  communication: 'bg-accent-purple/10 text-accent-purple',
  reporting: 'bg-primary-500/10 text-primary-500',
  risk: 'bg-accent-pink/10 text-accent-pink',
  stakeholder: 'bg-accent-cyan/10 text-accent-cyan',
  default: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
}

export function PromptCard({ prompt, isSaved = false, onSave, onCopy }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(isSaved)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    onCopy?.(prompt.content)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    setSaved(!saved)
    onSave?.(prompt.id)
  }

  const colorClass = categoryColors[prompt.category.toLowerCase()] || categoryColors.default

  return (
    <div className="card p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {prompt.category}
        </span>
        <button
          onClick={handleSave}
          className="text-slate-400 hover:text-primary-500 transition-colors"
          aria-label={saved ? 'Remove from saved' : 'Save prompt'}
        >
          {saved ? (
            <BookmarkCheck className="w-5 h-5 text-primary-500" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {prompt.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow">
        {prompt.description}
      </p>

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-100 dark:bg-dark-hover text-slate-600 dark:text-slate-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-dark-border">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Used {prompt.use_count.toLocaleString()} times
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            copied
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 dark:bg-dark-hover text-slate-700 dark:text-slate-300 hover:bg-primary-500 hover:text-white'
          }`}
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
