'use client'

import { useState } from 'react'
import { FolderOpen, Plus, X, Trash2 } from 'lucide-react'
import type { PromptFolder } from '@/types'

interface FolderSidebarProps {
  folders: PromptFolder[]
  activeFolder: string | null // null = "All", 'unsorted' = no folder
  onSelect: (folderId: string | null) => void
  onCreate: (name: string) => Promise<PromptFolder | null>
  onDelete: (folderId: string) => Promise<void>
}

export function FolderSidebar({ folders, activeFolder, onSelect, onCreate, onDelete }: FolderSidebarProps) {
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = async () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    await onCreate(trimmed)
    setNewName('')
    setCreating(false)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
      {/* All */}
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
          activeFolder === null
            ? 'bg-apple-blue text-white'
            : 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-slate-400 hover:bg-apple-gray-200 dark:hover:bg-dark-surface'
        }`}
      >
        All
      </button>

      {/* Unsorted */}
      <button
        onClick={() => onSelect('unsorted')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
          activeFolder === 'unsorted'
            ? 'bg-apple-blue text-white'
            : 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-slate-400 hover:bg-apple-gray-200 dark:hover:bg-dark-surface'
        }`}
      >
        Unsorted
      </button>

      {/* User folders */}
      {folders.map((folder) => (
        <div key={folder.id} className="relative group flex-shrink-0">
          <button
            onClick={() => onSelect(folder.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeFolder === folder.id
                ? 'bg-apple-blue text-white'
                : 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-slate-400 hover:bg-apple-gray-200 dark:hover:bg-dark-surface'
            }`}
          >
            <FolderOpen className="w-3 h-3" style={{ color: activeFolder === folder.id ? 'white' : folder.color }} />
            {folder.name}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(folder.id) }}
            className="absolute -top-1 -right-1 hidden group-hover:flex w-4 h-4 items-center justify-center rounded-full bg-red-500 text-white"
          >
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        </div>
      ))}

      {/* New folder */}
      {creating ? (
        <div className="flex items-center gap-1 flex-shrink-0">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Folder name"
            className="px-2 py-1 text-xs rounded-lg border border-apple-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-apple-black dark:text-white w-28 focus:outline-none focus:ring-1 focus:ring-apple-blue"
            autoFocus
          />
          <button onClick={handleCreate} className="p-1 text-apple-blue hover:text-apple-blue-hover">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { setCreating(false); setNewName('') }} className="p-1 text-apple-gray-400 hover:text-apple-gray-500">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-apple-blue hover:bg-apple-blue/5 dark:hover:bg-apple-blue/10 transition-colors"
        >
          <Plus className="w-3 h-3" />
          New Folder
        </button>
      )}
    </div>
  )
}
