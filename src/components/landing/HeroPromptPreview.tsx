'use client'

import { Copy, Bookmark } from 'lucide-react'

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

  return (
    <div className="relative">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-apple-blue" />
        <span className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider">
          Live Preview
        </span>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border shadow-lg p-6 flex flex-col transition-all duration-500">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400 transition-all duration-300">
            {displayCategory}
          </span>
          <Bookmark className="w-5 h-5 text-apple-gray-300 dark:text-apple-gray-500" />
        </div>

        {/* Title */}
        <h3 className={`text-lg font-semibold mb-2 transition-all duration-300 ${isEmpty ? 'text-apple-gray-300 dark:text-apple-gray-500' : 'text-apple-black dark:text-white'}`}>
          {displayTitle}
        </h3>

        {/* Content Preview */}
        <div className={`text-sm mb-4 flex-grow font-mono transition-all duration-300 ${isEmpty ? 'text-apple-gray-300 dark:text-apple-gray-500' : 'text-apple-gray-500 dark:text-apple-gray-400'}`}>
          <p className="line-clamp-4 whitespace-pre-wrap">{displayContent}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isEmpty ? (
            <>
              <span className="px-2 py-1 bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-400 dark:text-apple-gray-500 rounded text-xs">planning</span>
              <span className="px-2 py-1 bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-400 dark:text-apple-gray-500 rounded text-xs">sprint</span>
              <span className="px-2 py-1 bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-400 dark:text-apple-gray-500 rounded text-xs">agile</span>
            </>
          ) : (
            <span className="px-2 py-1 bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400 rounded text-xs">
              {displayCategory.toLowerCase()}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-apple-gray-200 dark:border-dark-border">
          <span className="text-xs text-apple-gray-400">
            Used 0 times
          </span>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400">
            <Copy className="w-4 h-4" />
            Copy
          </div>
        </div>
      </div>
    </div>
  )
}
