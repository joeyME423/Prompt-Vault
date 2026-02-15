'use client'

import { Copy, Bookmark, ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { categoryColors } from '@/lib/constants'
import type { Prompt } from '@/types'

export type SortColumn = 'title' | 'category' | 'use_count' | 'created_at'

interface PromptTableViewProps {
  prompts: Prompt[]
  userId: string | null
  sortColumn: SortColumn
  sortDirection: 'asc' | 'desc'
  onSort: (column: SortColumn) => void
}

export function PromptTableView({ prompts, sortColumn, sortDirection, onSort }: PromptTableViewProps) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-apple-gray-50 dark:bg-dark-surface">
              <SortableHeader column="title" label="Title" current={sortColumn} direction={sortDirection} onSort={onSort} />
              <SortableHeader column="category" label="Category" current={sortColumn} direction={sortDirection} onSort={onSort} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-apple-gray-400 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Tags</th>
              <SortableHeader column="use_count" label="Uses" current={sortColumn} direction={sortDirection} onSort={onSort} className="text-right" />
              <SortableHeader column="created_at" label="Date" current={sortColumn} direction={sortDirection} onSort={onSort} className="hidden sm:table-cell" />
              <th className="px-4 py-3 text-center text-xs font-semibold text-apple-gray-400 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-apple-gray-200 dark:divide-dark-border">
            {prompts.map((prompt) => (
              <PromptTableRow key={prompt.id} prompt={prompt} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SortableHeader({
  column, label, current, direction, onSort, className = ''
}: {
  column: SortColumn; label: string; current: SortColumn; direction: 'asc' | 'desc'; onSort: (col: SortColumn) => void; className?: string
}) {
  const isActive = current === column
  return (
    <th
      onClick={() => onSort(column)}
      className={`px-4 py-3 text-left text-xs font-semibold text-apple-gray-400 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-apple-blue transition-colors select-none ${className}`}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive && (direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
      </div>
    </th>
  )
}

function PromptTableRow({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false)
  const colorClass = categoryColors[prompt.category.toLowerCase()] || categoryColors.default

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <tr className="hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors">
      <td className="px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-apple-black dark:text-white truncate max-w-[200px] lg:max-w-[300px]">{prompt.title}</p>
          <p className="text-xs text-apple-gray-400 dark:text-slate-400 truncate max-w-[200px] lg:max-w-[300px]">{prompt.description}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colorClass}`}>
          {prompt.category}
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex gap-1.5">
          {prompt.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-400 dark:text-slate-400 rounded text-xs">
              {tag}
            </span>
          ))}
          {prompt.tags && prompt.tags.length > 2 && (
            <span className="text-xs text-apple-gray-400">+{prompt.tags.length - 2}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right text-sm text-apple-gray-500 dark:text-slate-400">
        {prompt.use_count.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm text-apple-gray-400 dark:text-slate-400 hidden sm:table-cell whitespace-nowrap">
        {new Date(prompt.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-full transition-colors ${
              copied ? 'bg-apple-blue text-white' : 'text-apple-gray-400 hover:text-apple-blue hover:bg-apple-gray-50 dark:hover:bg-dark-hover'
            }`}
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-full text-apple-gray-400 hover:text-apple-blue hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors" title="Save">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
