'use client'

import { Copy, Bookmark } from 'lucide-react'
import { categoryColors } from '@/lib/constants'

interface HeroPromptPreviewProps {
  title: string
  content: string
  category: string
}

const PLACEHOLDER = {
  title: 'Sprint Planning Assistant',
  content: 'You are a scrum master assistant. Help me plan the upcoming sprint by analyzing the backlog, estimating story points, and identifying dependencies between tasks...',
  category: 'Planning',
}

export function HeroPromptPreview({ title, content, category }: HeroPromptPreviewProps) {
  const displayTitle = title || PLACEHOLDER.title
  const displayContent = content || PLACEHOLDER.content
  const displayCategory = category || PLACEHOLDER.category
  const isEmpty = !title && !content && !category

  const colorClass = categoryColors[displayCategory.toLowerCase()] || categoryColors.default

  return (
    <div className="relative">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Live Preview
        </span>
      </div>

      {/* Card with 3D tilt effect */}
      <div
        className="relative bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-lg p-6 flex flex-col transition-all duration-500 animate-float"
        style={{ transform: 'perspective(1000px) rotateY(-2deg)' }}
      >
        {/* Decorative gradient border glow */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500/20 via-accent-purple/20 to-accent-pink/20 rounded-xl -z-10 blur-sm" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${colorClass}`}>
            {displayCategory}
          </span>
          <Bookmark className="w-5 h-5 text-slate-300 dark:text-slate-600" />
        </div>

        {/* Title */}
        <h3 className={`text-lg font-semibold mb-2 transition-all duration-300 ${isEmpty ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
          {displayTitle}
        </h3>

        {/* Content Preview */}
        <div className={`text-sm mb-4 flex-grow font-mono transition-all duration-300 ${isEmpty ? 'text-slate-300 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'}`}>
          <p className="line-clamp-4 whitespace-pre-wrap">{displayContent}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isEmpty ? (
            <>
              <span className="px-2 py-1 bg-slate-100 dark:bg-dark-hover text-slate-400 dark:text-slate-500 rounded text-xs">planning</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-dark-hover text-slate-400 dark:text-slate-500 rounded text-xs">sprint</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-dark-hover text-slate-400 dark:text-slate-500 rounded text-xs">agile</span>
            </>
          ) : (
            <span className="px-2 py-1 bg-slate-100 dark:bg-dark-hover text-slate-500 dark:text-slate-400 rounded text-xs">
              {displayCategory.toLowerCase()}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-dark-border">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Used 0 times
          </span>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-dark-hover text-slate-500 dark:text-slate-400">
            <Copy className="w-4 h-4" />
            Copy
          </div>
        </div>
      </div>
    </div>
  )
}
