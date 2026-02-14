'use client'

import { Copy, Bookmark, BookmarkCheck, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { StarRating } from './StarRating'
import { FolderDropdown } from './FolderDropdown'
import { posthog } from '@/lib/posthog'
import type { Prompt, PromptFolder } from '@/types'

interface PromptCardProps {
  prompt: Prompt
  showRating?: boolean
  userId?: string | null
  onCopy?: (content: string) => void
  folders?: PromptFolder[]
  currentFolderId?: string | null
  onMoveToFolder?: (savedPromptId: string, folderId: string | null) => Promise<boolean>
  onCreateFolder?: (name: string) => Promise<PromptFolder | null>
  savedPromptId?: string | null
}

const FREE_SAVE_LIMIT = 10

const categoryColors: Record<string, string> = {
  planning: 'bg-accent-blue/10 text-accent-blue',
  communication: 'bg-accent-purple/10 text-accent-purple',
  reporting: 'bg-primary-500/10 text-primary-500',
  risk: 'bg-accent-pink/10 text-accent-pink',
  stakeholder: 'bg-accent-cyan/10 text-accent-cyan',
  default: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
}

export function PromptCard({ prompt, showRating = false, userId: externalUserId, onCopy, folders, currentFolderId, onMoveToFolder, onCreateFolder, savedPromptId }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(externalUserId ?? null)
  const [saveCount, setSaveCount] = useState(0)
  const [showLimitMessage, setShowLimitMessage] = useState(false)
  const [ratingData, setRatingData] = useState({ average: 0, total: 0, userRating: null as number | null })

  useEffect(() => {
    const checkSaveState = async () => {
      const supabase = createClient()

      // Use external userId if provided, otherwise check session
      let currentUserId = externalUserId
      if (!currentUserId) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) currentUserId = session.user.id
      }
      if (!currentUserId) return

      setUserId(currentUserId)

      // Check if this prompt is already saved
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: savedData } = await (supabase.from('saved_prompts') as any)
        .select('id')
        .eq('user_id', currentUserId)
        .eq('prompt_id', prompt.id)
        .maybeSingle()

      if (savedData) setSaved(true)

      // Get total save count for this user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count } = await (supabase.from('saved_prompts') as any)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', currentUserId)

      setSaveCount(count || 0)

      // Fetch rating data if showing ratings
      if (showRating) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: ratings } = await (supabase.from('prompt_ratings') as any)
          .select('rating')
          .eq('prompt_id', prompt.id)

        if (ratings && ratings.length > 0) {
          const avg = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / ratings.length
          setRatingData(prev => ({ ...prev, average: avg, total: ratings.length }))
        }

        // Get user's rating
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

  // Also fetch ratings for anonymous users
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
    onCopy?.(prompt.content)
    posthog.capture('prompt_copied', { prompt_id: prompt.id, category: prompt.category, title: prompt.title })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!userId) return
    if (saving) return

    if (!saved && saveCount >= FREE_SAVE_LIMIT) {
      setShowLimitMessage(true)
      setTimeout(() => setShowLimitMessage(false), 4000)
      return
    }

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
        setSaveCount((c) => c - 1)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('saved_prompts') as any)
          .insert({ user_id: userId, prompt_id: prompt.id })
        setSaved(true)
        setSaveCount((c) => c + 1)
        posthog.capture('prompt_saved', { prompt_id: prompt.id, category: prompt.category })
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
    } finally {
      setSaving(false)
    }
  }

  const colorClass = categoryColors[prompt.category.toLowerCase()] || categoryColors.default

  return (
    <div className="card p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {prompt.category}
        </span>
        {userId ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-slate-400 hover:text-primary-500 transition-colors disabled:opacity-50"
            aria-label={saved ? 'Remove from saved' : 'Save prompt'}
          >
            {saved ? (
              <BookmarkCheck className="w-5 h-5 text-primary-500" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="text-slate-400 hover:text-primary-500 transition-colors"
            title="Log in to save prompts"
          >
            <Bookmark className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Save limit message */}
      {showLimitMessage && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            You&apos;ve reached the free limit of {FREE_SAVE_LIMIT} saved prompts.{' '}
            <Link href="/#pricing" className="underline font-medium">Upgrade</Link> to save more.
          </p>
        </div>
      )}

      {/* Content */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {prompt.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow">
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
              className="px-2 py-1 bg-slate-100 dark:bg-dark-hover text-slate-600 dark:text-slate-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Folder dropdown (when folders are available) */}
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
