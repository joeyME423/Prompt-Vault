'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  FileText,
  Check,
  X,
  Clock,
  ShieldCheck,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import type { Prompt } from '@/types'

type ReviewStatus = 'pending_review' | 'approved' | 'rejected'

const STATUS_TABS: { label: string; value: ReviewStatus | 'all' }[] = [
  { label: 'Pending', value: 'pending_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: 'all' },
]

function StatusBadge({ status }: { status: string | null }) {
  if (status === 'pending_review') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
        <Clock className="w-3 h-3" />
        Pending review
      </span>
    )
  }
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20">
        <Check className="w-3 h-3" />
        Approved
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
        <X className="w-3 h-3" />
        Rejected
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-apple-gray-100 dark:bg-dark-surface text-apple-gray-500 dark:text-apple-gray-400 border border-apple-gray-200 dark:border-dark-border">
      Published
    </span>
  )
}

function PromptRow({
  prompt,
  onApprove,
  onReject,
  onToggleLock,
  onToggleStandard,
  onSetVersion,
  isUpdating,
}: {
  prompt: Prompt
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onToggleLock: (id: string, current: boolean) => void
  onToggleStandard: (id: string, current: boolean) => void
  onSetVersion: (id: string, version: string) => void
  isUpdating: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [editingVersion, setEditingVersion] = useState(false)
  const [versionInput, setVersionInput] = useState(prompt.version ?? '')

  const handleVersionSave = () => {
    if (versionInput.trim()) {
      onSetVersion(prompt.id, versionInput.trim())
    }
    setEditingVersion(false)
  }

  return (
    <div className="border border-apple-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
      {/* Row header */}
      <div className="flex items-start gap-3 p-4 bg-white dark:bg-dark-card">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-apple-black dark:text-white truncate">
              {prompt.title}
            </h3>
            <StatusBadge status={prompt.approval_status} />
            {prompt.is_standard && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-apple-blue/10 text-apple-blue border border-apple-blue/20">
                <ShieldCheck className="w-3 h-3" />
                Standard
              </span>
            )}
            {prompt.is_locked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-apple-gray-100 dark:bg-dark-surface text-apple-gray-500 border border-apple-gray-200 dark:border-dark-border">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            )}
            {prompt.version && (
              <span className="text-xs text-apple-gray-400">v{prompt.version}</span>
            )}
          </div>
          <p className="text-xs text-apple-gray-500 dark:text-apple-gray-400 line-clamp-2">
            {prompt.description}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-apple-gray-400">
            <span>{prompt.category}</span>
            <span>·</span>
            <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
            <span>·</span>
            <span>{prompt.use_count} uses</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {prompt.approval_status === 'pending_review' && (
            <>
              <button
                onClick={() => onApprove(prompt.id)}
                disabled={isUpdating}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 border border-green-200 dark:border-green-500/20 transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                Approve
              </button>
              <button
                onClick={() => onReject(prompt.id)}
                disabled={isUpdating}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
            </>
          )}
          {prompt.approval_status !== 'pending_review' && (
            <>
              <button
                onClick={() => onToggleStandard(prompt.id, !!prompt.is_standard)}
                disabled={isUpdating}
                title={prompt.is_standard ? 'Remove standard flag' : 'Mark as standard'}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                  prompt.is_standard
                    ? 'bg-apple-blue/10 text-apple-blue border border-apple-blue/20'
                    : 'bg-apple-gray-50 dark:bg-dark-surface text-apple-gray-400 border border-apple-gray-200 dark:border-dark-border hover:text-apple-blue hover:bg-apple-blue/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleLock(prompt.id, !!prompt.is_locked)}
                disabled={isUpdating}
                title={prompt.is_locked ? 'Unlock prompt' : 'Lock prompt (PMs can only clone)'}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                  prompt.is_locked
                    ? 'bg-apple-gray-200 dark:bg-dark-hover text-apple-gray-600 dark:text-apple-gray-300 border border-apple-gray-300 dark:border-dark-border'
                    : 'bg-apple-gray-50 dark:bg-dark-surface text-apple-gray-400 border border-apple-gray-200 dark:border-dark-border hover:bg-apple-gray-100 dark:hover:bg-dark-hover'
                }`}
              >
                {prompt.is_locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            </>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-apple-gray-400 hover:text-apple-black dark:hover:text-white hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="border-t border-apple-gray-200 dark:border-dark-border bg-apple-gray-50 dark:bg-dark-surface px-4 py-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-apple-gray-500 dark:text-apple-gray-400 mb-1.5 uppercase tracking-wide">
              Prompt content
            </p>
            <pre className="text-xs text-apple-black dark:text-white bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded-lg p-3 whitespace-pre-wrap font-mono overflow-x-auto max-h-48 overflow-y-auto">
              {prompt.content}
            </pre>
          </div>

          {/* Version editor */}
          {prompt.approval_status !== 'pending_review' && (
            <div>
              <p className="text-xs font-medium text-apple-gray-500 dark:text-apple-gray-400 mb-1.5 uppercase tracking-wide">
                Version number
              </p>
              {editingVersion ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={versionInput}
                    onChange={(e) => setVersionInput(e.target.value)}
                    placeholder="e.g., 2.1"
                    className="px-3 py-1.5 text-sm bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded-lg text-apple-black dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 w-32"
                  />
                  <button
                    onClick={handleVersionSave}
                    className="px-3 py-1.5 text-xs font-medium bg-apple-blue text-white rounded-lg hover:bg-apple-blue-hover transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setEditingVersion(false); setVersionInput(prompt.version ?? '') }}
                    className="px-3 py-1.5 text-xs font-medium text-apple-gray-500 hover:text-apple-black dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingVersion(true)}
                  className="text-xs text-apple-blue hover:underline"
                >
                  {prompt.version ? `v${prompt.version} — click to edit` : 'Set version number'}
                </button>
              )}
            </div>
          )}

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-apple-gray-500 dark:text-apple-gray-400 mb-1.5 uppercase tracking-wide">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded text-xs text-apple-gray-500 dark:text-apple-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState<ReviewStatus | 'all'>('pending_review')
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())

  const fetchPrompts = useCallback(async () => {
    setLoading(true)
    setError(false)
    const supabase = createClient()

    try {
      let query = supabase.from('prompts').select('*').order('created_at', { ascending: false })

      if (activeTab !== 'all') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query = (query as any).eq('approval_status', activeTab)
      }

      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError
      setPrompts((data as Prompt[]) || [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  const setUpdating = (id: string, state: boolean) => {
    setUpdatingIds(prev => {
      const next = new Set(prev)
      state ? next.add(id) : next.delete(id)
      return next
    })
  }

  const patchPrompt = async (id: string, updates: Partial<Prompt>) => {
    setUpdating(id, true)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('prompts') as any).update(updates).eq('id', id)
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    setUpdating(id, false)
  }

  const handleApprove = (id: string) => patchPrompt(id, { approval_status: 'approved' })
  const handleReject = (id: string) => patchPrompt(id, { approval_status: 'rejected' })
  const handleToggleLock = (id: string, current: boolean) => patchPrompt(id, { is_locked: !current })
  const handleToggleStandard = (id: string, current: boolean) => patchPrompt(id, { is_standard: !current })
  const handleSetVersion = (id: string, version: string) =>
    patchPrompt(id, { version, version_updated_at: new Date().toISOString() })

  const pendingCount = prompts.filter(p => p.approval_status === 'pending_review').length

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-apple-black dark:text-white">
                Review Queue
              </h1>
              <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                Approve prompts, set versions, and manage standard library
              </p>
            </div>
          </div>
          <button
            onClick={fetchPrompts}
            className="p-2 rounded-lg text-apple-gray-400 hover:text-apple-black dark:hover:text-white hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Stat strip */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Pending review', value: prompts.filter(p => p.approval_status === 'pending_review').length, color: 'text-amber-600 dark:text-amber-400' },
              { label: 'Standard prompts', value: prompts.filter(p => p.is_standard).length, color: 'text-apple-blue' },
              { label: 'Locked prompts', value: prompts.filter(p => p.is_locked).length, color: 'text-apple-gray-500' },
            ].map(stat => (
              <div key={stat.label} className="bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded-xl px-4 py-3">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-apple-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-apple-gray-50 dark:bg-dark-surface rounded-xl border border-apple-gray-200 dark:border-dark-border mb-6 w-fit">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? 'bg-white dark:bg-dark-card text-apple-black dark:text-white shadow-sm'
                  : 'text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-black dark:hover:text-white'
              }`}
            >
              {tab.label}
              {tab.value === 'pending_review' && pendingCount > 0 && (
                <span className="ml-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500 text-white leading-none">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Failed to load prompts. Please try again.</p>
          </div>
        )}

        {!loading && !error && prompts.length === 0 && (
          <div className="bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded-2xl p-12 text-center">
            <div className="w-12 h-12 bg-apple-gray-50 dark:bg-dark-surface rounded-xl flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-apple-gray-400" />
            </div>
            <p className="text-sm font-medium text-apple-black dark:text-white mb-1">
              {activeTab === 'pending_review' ? 'No pending prompts' : 'Nothing here yet'}
            </p>
            <p className="text-xs text-apple-gray-400">
              {activeTab === 'pending_review'
                ? 'All submissions have been reviewed.'
                : 'Prompts in this state will appear here.'}
            </p>
          </div>
        )}

        {!loading && !error && prompts.length > 0 && (
          <div className="space-y-3">
            {prompts.map(prompt => (
              <PromptRow
                key={prompt.id}
                prompt={prompt}
                onApprove={handleApprove}
                onReject={handleReject}
                onToggleLock={handleToggleLock}
                onToggleStandard={handleToggleStandard}
                onSetVersion={handleSetVersion}
                isUpdating={updatingIds.has(prompt.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
