'use client'

import { useState, useRef, useEffect } from 'react'
import { FolderOpen, ChevronDown, Plus } from 'lucide-react'
import type { PromptFolder } from '@/types'

interface FolderDropdownProps {
  folders: PromptFolder[]
  currentFolderId: string | null
  onMove: (folderId: string | null) => void
  onCreate: (name: string) => Promise<PromptFolder | null>
}

export function FolderDropdown({ folders, currentFolderId, onMove, onCreate }: FolderDropdownProps) {
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setCreating(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentFolder = folders.find(f => f.id === currentFolderId)

  const handleCreate = async () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    const folder = await onCreate(trimmed)
    if (folder) {
      onMove(folder.id)
    }
    setNewName('')
    setCreating(false)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors"
        title="Move to folder"
      >
        <FolderOpen className="w-3.5 h-3.5" style={currentFolder ? { color: currentFolder.color } : undefined} />
        <span className="hidden sm:inline max-w-[60px] truncate">{currentFolder?.name || 'Unsorted'}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl shadow-lg z-50 py-1">
          {/* Unsorted option */}
          <button
            onClick={() => { onMove(null); setOpen(false) }}
            className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors ${
              !currentFolderId ? 'text-primary-500 font-medium' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Unsorted
          </button>

          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => { onMove(folder.id); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors flex items-center gap-2 ${
                currentFolderId === folder.id ? 'text-primary-500 font-medium' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FolderOpen className="w-3 h-3 flex-shrink-0" style={{ color: folder.color }} />
              <span className="truncate">{folder.name}</span>
            </button>
          ))}

          <div className="border-t border-slate-200 dark:border-dark-border mt-1 pt-1">
            {creating ? (
              <div className="px-3 py-2 flex items-center gap-1">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="Folder name"
                  className="flex-1 px-2 py-1 text-xs rounded border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  autoFocus
                />
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="w-full text-left px-3 py-2 text-xs text-primary-500 hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                New Folder
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
