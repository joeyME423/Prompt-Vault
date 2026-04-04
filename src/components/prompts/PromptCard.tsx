'use client'

import { Copy, Bookmark, BookmarkCheck, TrendingUp, Lock, GitFork, Clock, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { StarRating } from './StarRating'
import { FolderDropdown } from './FolderDropdown'
import { PromptFeedback } from '@/components/ui/PromptFeedback'
import { posthog } from '@/lib/posthog'
import type { Prompt, PromptFolder } from '@/types'

interface PromptCardProps {
  prompt: Prompt
  showRating?: boolean
  userId?: string | null
  isAdmin?: boolean
  onCopy?: (content: string, category: string) => void
  folders?: PromptFolder[]
  currentFolderId?: string | null
  onMoveToFolder?: (savedPromptId: string, folderId: string | null) => Promise<boolean>
  onCreateFolder?: (name: string) => Promise<PromptFolder | null>
  savedPromptId?: string | null
  onSaveChange?: (promptId: string, saved: boolean, savedPromptId?: string) => void
  onClone?: (prompt: Prompt) => void
}

const categoryColors: Record<string, string> = {
  planning: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  communication: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  reporting: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  risk: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  stakeholder: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
  default: 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400',
}

function formatVersionDate(isoDate: string | null | undefined): string {
  if (!isoDate) return ''
  const d = new Date(isoDate)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function PromptCard({
  prompt,
  showRating = false,
  userId: externalUserId,
  isAdmin = false,
  onCopy,
  folders,
  currentFolderId,
  onMoveToFolder,
  onCreateFolder,
  savedPromptId,
  onSaveChange,
  onClone,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [cloned, setCloned] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(externalUserId ?? null)
  const [ratingData, setRatingData] = useState({ average: 0, total: 0, userRating: null as number | null })
  const [showFeedback, setShowFeedback] = useState(false)
  const [successRate, setSuccessRate] = useState<{ rate: number; total: number } | null>(null)

  const isLocked = !!prompt.is_locked
  const isStandard = !!prompt.is_standard
  const isPending = prompt.approval_status === 'pending_review'
  // Non-admins cannot copy locked standard prompts — they must clone instead
  const canOnlyCopy = !isLocked || isAdmin

  useEffect(() => {
    const checkSaveState = async () => {
      const supabase = createClient()

      let currentUserId = externalUserId
      if (!currentUserId) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) currentUserId = session.user.id
      }
      if (!currentUserId) return

      setUserId(currentUserId)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: savedData } = await (supabase.from('saved_prompts') as any)
        .select('id')
        .eq('user_id', currentUserId)
        .eq('prompt_id', prompt.id)
        .maybeSingle()

      if (savedData) setSaved(true)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: feedbackData } = await (supabase.from('prompt_feedback') as any)
        .select('helpful')
        .eq('prompt_id', prompt.id)

      if (feedbackData && feedbackData.length > 0) {
        const helpful = feedbackData.filter((f: { helpful: boolean }) => f.helpful).length
        setSuccessRate({ rate: Math.round((helpful / feedbackData.length) * 100), total: feedbackData.length })
      }

      if (showRating) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: ratings } = await (supabase.from('prompt_ratings') as any)
          .select('rating')
          .eq('prompt_id', prompt.id)

        if (ratings && ratings.length > 0) {
          const avg = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / ratings.length
          setRatingData(prev => ({ ...prev, average: avg, total: ratings.length }))
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: userRatingData } = await (supabase.from('prompt_ratings') as any)
          .select('rating')
          .eq('prompt_id', prompt.id)
          .eq('user_id', currentUserId)
          .maybeSingle()

        if (userRatingData) {
          setRatingData(prev => ({ ...prev, userRating: userRatingData.rating }))
        }
      }
    }
    checkSaveState()
  }, [prompt.id, externalUserId, showRating])

  useEffect(() => {
    if (!showRating || userId) return
    const fetchPublicRatings = async () => {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: ratings } = await (supabase.from('prompt_ratings') as any)
        .select('rating')
        .eq('prompt_id', prompt.id)

      if (ratings && ratings.length > 0) {
        const avg = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / ratings.length
        setRatingData({ average: avg, total: ratings.length, userRating: null })
      }
    }
    fetchPublicRatings()
  }, [prompt.id, showRating, userId])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    onCopy?.(prompt.content, prompt.category)
    posthog.capture('prompt_copied', { prompt_id: prompt.id, category: prompt.category, title: prompt.title })
    setTimeout(() => {
      setCopied(false)
      if (userId) setShowFeedback(true)
    }, 1500)
  }

  const handleClone = async () => {
    if (!userId) return
    if (onClone) {
      onClone(prompt)
      return
    }
    // Default: clone via Supabase insert into team library
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: membership } = await (supabase.from('team_members') as any)
      .select('team_id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle()

    if (!membership) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('prompts') as any).insert({
      title: `${prompt.title} (copy)`,
      description: prompt.description,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags,
      author_id: userId,
      team_id: membership.team_id,
      is_public: false,
      is_standard: false,
      is_locked: false,
      approval_status: 'pending_review',
    })

    posthog.capture('prompt_cloned', { prompt_id: prompt.id, category: prompt.category })
    setCloned(true)
    setTimeout(() => setCloned(false), 2500)
  }

  const handleSave = async () => {
    if (!userId) return
    if (saving) return

    setSaving(true)
    const supabase = createClient()

    try {
      if (saved) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('saved_prompts') as any)
          .delete()
          .eq('user_id', userId)
          .eq('prompt_id', prompt.id)
        setSaved(false)
        onSaveChange?.(prompt.id, false)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newSaved } = await (supabase.from('saved_prompts') as any)
          .insert({ user_id: userId, prompt_id: prompt.id })
          .select('id')
          .single()
        setSaved(true)
        posthog.capture('prompt_saved', { prompt_id: prompt.id, category: prompt.category })
        onSaveChange?.(prompt.id, true, newSaved?.id)
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
    } finally {
      setSaving(false)
    }
  }

  const colorClass = categoryColors[prompt.category.toLowerCase()] || categoryColors.default

  // Show "Used by N teams this month" — use use_count as a proxy
  const teamsCount = Math.max(1, Math.ceil((prompt.use_count || 0) / 3))
  const usageLabel = prompt.use_count > 0
    ? `Used by ${teamsCount} team${teamsCount !== 1 ? 's' : ''} this month`
    : 'No uses yet'

  return (
    <div className={`bg-white dark:bg-dark-card rounded-2xl p-6 flex flex-col h-full border transition-shadow duration-300 hover:shadow-md ${
      isPending
        ? 'border-amber-300 dark:border-amber-500/50'
        : isStandard
          ? 'border-apple-blue/30 dark:border-apple-blue/20'
          : 'border-apple-gray-200 dark:border-dark-border'
    }`}>

      {/* Pending review banner */}
      {isPending && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg px-3 py-1.5 mb-3">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          Pending PMO review
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {prompt.category}
          </span>
          {isStandard && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-apple-blue/10 text-apple-blue dark:bg-apple-blue/20 dark:text-apple-blue border border-apple-blue/20">
              <ShieldCheck className="w-3 h-3" />
              Standard
            </span>
          )}
          {isLocked && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-apple-gray-100 dark:bg-dark-surface text-apple-gray-500 dark:text-apple-gray-400 border border-apple-gray-200 dark:border-dark-border">
              <Lock className="w-3 h-3" />
              Locked
            </span>
          )}
        </div>
        {userId ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-apple-gray-400 hover:text-apple-blue transition-colors disabled:opacity-50 flex-shrink-0"
            aria-label={saved ? 'Remove from saved' : 'Save prompt'}
          >
            {saved ? (
              <BookmarkCheck className="w-5 h-5 text-apple-blue" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="text-apple-gray-400 hover:text-apple-blue transition-colors flex-shrink-0"
            title="Log in to save prompts"
          >
            <Bookmark className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Title + version */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-apple-black dark:text-white leading-snug">
          {prompt.title}
        </h3>
        {prompt.version && (
          <p className="text-xs text-apple-gray-400 dark:text-apple-gray-500 mt-0.5">
            v{prompt.version}
            {prompt.version_updated_at && ` – updated ${formatVersionDate(prompt.version_updated_at)}`}
          </p>
        )}
      </div>

      <p className="text-apple-gray-500 dark:text-apple-gray-400 text-sm mb-4 flex-grow">
        {prompt.description}
      </p>

      {/* Rating */}
      {showRating && (
        <div className="mb-4">
          <StarRating
            promptId={prompt.id}
            userId={userId}
            averageRating={ratingData.average}
            totalRatings={ratingData.total}
            userRating={ratingData.userRating}
          />
        </div>
      )}

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Folder dropdown */}
      {folders && onMoveToFolder && onCreateFolder && savedPromptId && (
        <div className="mb-3">
          <FolderDropdown
            folders={folders}
            currentFolderId={currentFolderId ?? null}
            onMove={(folderId) => onMoveToFolder(savedPromptId, folderId)}
            onCreate={onCreateFolder}
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col gap-2 pt-4 border-t border-apple-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs text-apple-gray-400 truncate">
              {usageLabel}
            </span>
            {successRate && successRate.total > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="w-3 h-3" />
                {successRate.rate}% helpful
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Clone button — shown to non-admins on locked prompts */}
            {isLocked && !isAdmin && userId && (
              <button
                onClick={handleClone}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  cloned
                    ? 'bg-green-500 text-white'
                    : 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400 hover:bg-apple-blue/10 hover:text-apple-blue'
                }`}
                title="Clone this standard prompt to your library"
              >
                <GitFork className="w-3.5 h-3.5" />
                {cloned ? 'Cloned!' : 'Clone'}
              </button>
            )}

            {/* Copy button — shown when not locked, or when admin */}
            {canOnlyCopy && (
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  copied
                    ? 'bg-apple-blue text-white'
                    : 'bg-apple-gray-50 dark:bg-dark-hover text-apple-gray-500 dark:text-apple-gray-400 hover:bg-apple-blue hover:text-white'
                }`}
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>

        {showFeedback && !copied && (
          <div className="flex justify-end">
            <PromptFeedback
              promptId={prompt.id}
              userId={userId}
              onFeedback={() => setTimeout(() => setShowFeedback(false), 2000)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
