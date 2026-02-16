'use client'

import { useState, useEffect, useCallback } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PromptCard } from '@/components/prompts/PromptCard'
import { ViewSwitcher, type LibraryView } from '@/components/ui/ViewSwitcher'
import { PromptListView } from '@/components/prompts/PromptListView'
import { PromptTableView, type SortColumn } from '@/components/prompts/PromptTableView'
import { PromptKanbanView } from '@/components/prompts/PromptKanbanView'
import { TimeSavedBanner } from '@/components/ui/TimeSavedBanner'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useFolders } from '@/hooks/useFolders'
import { AlertCircle, Globe, Heart, Lock, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUserProfile } from '@/hooks/useUserProfile'
import { ROLE_CATEGORY_MAP, CATEGORY_TIME_SAVED } from '@/lib/constants'
import { posthog } from '@/lib/posthog'
import type { Prompt } from '@/types'

const categories = ['Planning', 'Communication', 'Reporting', 'Risk', 'Stakeholder', 'Agile', 'Meetings']

interface SavedPromptMapping {
  id: string
  prompt_id: string
  folder_id: string | null
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isPaidUser, setIsPaidUser] = useState(false)
  const [view, setView] = useLocalStorage<LibraryView>('pv-community-view', 'grid')
  const [sortColumn, setSortColumn] = useState<SortColumn>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [copyCounts, setCopyCounts] = useLocalStorage<Record<string, number>>('pv-copy-counts', {})
  const [savedMappings, setSavedMappings] = useState<SavedPromptMapping[]>([])
  const { profile } = useUserProfile()
  const { folders, createFolder, moveToFolder } = useFolders(isPaidUser ? userId : null)

  // Get suggested categories based on user role
  const suggestedCategories = profile?.role ? ROLE_CATEGORY_MAP[profile.role] || [] : []

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleCopy = useCallback((_content: string, category: string) => {
    setCopyCounts(prev => ({
      ...prev,
      [category.toLowerCase()]: (prev[category.toLowerCase()] || 0) + 1,
    }))
    const minutesSaved = CATEGORY_TIME_SAVED[category.toLowerCase()] || 10
    posthog.capture('time_saved', { category, minutes: minutesSaved })
  }, [setCopyCounts])

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Check auth
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)

        // Check if paid user (has team membership)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: membership } = await (supabase.from('team_members') as any)
          .select('team_id')
          .eq('user_id', session.user.id)
          .limit(1)
          .maybeSingle()

        if (membership) {
          setIsPaidUser(true)

          // Fetch saved prompt mappings for folder assignment
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: mappings } = await (supabase.from('saved_prompts') as any)
            .select('id, prompt_id, folder_id')
            .eq('user_id', session.user.id)
          setSavedMappings(mappings || [])
        }
      }

      // Fetch community prompts (public, no team)
      const { data, error: fetchError } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_public', true)
        .is('team_id', null)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching community prompts:', fetchError)
        setError(true)
      } else {
        setPrompts(data || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSaveChange = useCallback((promptId: string, saved: boolean, newSavedPromptId?: string) => {
    if (saved && newSavedPromptId) {
      setSavedMappings(prev => [...prev, { id: newSavedPromptId, prompt_id: promptId, folder_id: null }])
    } else {
      setSavedMappings(prev => prev.filter(m => m.prompt_id !== promptId))
    }
  }, [])

  const handleMoveToFolder = async (savedPromptId: string, folderId: string | null) => {
    const success = await moveToFolder(savedPromptId, folderId)
    if (success) {
      setSavedMappings(prev =>
        prev.map(m => m.id === savedPromptId ? { ...m, folder_id: folderId } : m)
      )
    }
    return success
  }

  const getSavedPromptId = (promptId: string) => {
    return savedMappings.find(m => m.prompt_id === promptId)?.id ?? null
  }

  const getFolderId = (promptId: string) => {
    return savedMappings.find(m => m.prompt_id === promptId)?.folder_id ?? null
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === null || prompt.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Apply sorting
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1
    switch (sortColumn) {
      case 'title':
        return dir * a.title.localeCompare(b.title)
      case 'category':
        return dir * a.category.localeCompare(b.category)
      case 'use_count':
        return dir * (a.use_count - b.use_count)
      case 'created_at':
        return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      default:
        return 0
    }
  })

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-apple-gray-50 border border-apple-gray-200 mb-4">
            <Globe className="w-4 h-4 text-apple-gray-500" />
            <span className="text-sm font-medium text-apple-gray-500 dark:text-apple-gray-400">
              Community Contributed
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-apple-black dark:text-white mb-4">
            Community Prompts
          </h1>
          <p className="text-lg text-apple-gray-500 dark:text-slate-300 max-w-2xl mx-auto">
            Prompts contributed and rated by the PM community. Browse, rate, and save your favorites.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-apple-blue/5 border border-apple-blue/10">
            <Heart className="w-4 h-4 text-apple-blue" />
            <p className="text-sm text-apple-gray-500 dark:text-slate-400">
              Free and open to everyone. We believe great prompts should be accessible to all PMs &mdash; and we&apos;ll keep it that way for as long as we can.{' '}
              <Link href="/app/contribute" className="text-apple-blue hover:text-apple-blue-hover font-medium">
                Contribute yours
              </Link>
            </p>
          </div>
        </div>

        {/* Search, Filters, and View Switcher */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search community prompts..."
            />
            <ViewSwitcher view={view} onChange={(v) => { setView(v); posthog.capture('view_changed', { view: v, page: 'community' }) }} />
          </div>
          <div className="flex justify-center">
            <FilterTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6 animate-pulse">
                <div className="h-6 bg-apple-gray-200 dark:bg-dark-surface rounded w-24 mb-4" />
                <div className="h-5 bg-apple-gray-200 dark:bg-dark-surface rounded w-3/4 mb-2" />
                <div className="h-4 bg-apple-gray-200 dark:bg-dark-surface rounded w-full mb-4" />
                <div className="h-4 bg-apple-gray-200 dark:bg-dark-surface rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-apple-gray-400 mx-auto mb-3" />
            <p className="text-apple-gray-400 dark:text-slate-400">
              Unable to load community prompts right now. Please try again later.
            </p>
          </div>
        )}

        {/* Suggested for you */}
        {!loading && !error && suggestedCategories.length > 0 && searchQuery === '' && activeCategory === null && (() => {
          const suggested = filteredPrompts.filter(p =>
            suggestedCategories.some(c => p.category.toLowerCase() === c.toLowerCase())
          ).slice(0, 3)
          if (suggested.length === 0) return null
          return (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-apple-blue" />
                <h2 className="text-sm font-semibold text-apple-blue dark:text-apple-blue uppercase tracking-wide">
                  Suggested for {profile?.role}s
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggested.map((prompt) => (
                  <PromptCard
                    key={`suggested-${prompt.id}`}
                    prompt={prompt}
                    showRating
                    userId={userId}
                  />
                ))}
              </div>
              <hr className="mt-10 border-apple-gray-200 dark:border-dark-border" />
            </div>
          )
        })()}

        {/* Results */}
        {!loading && !error && (
          <>
            {/* Time Saved Banner */}
            <TimeSavedBanner copyCounts={copyCounts} />

            <p className="text-sm text-apple-gray-400 dark:text-slate-400 mb-6">
              Showing {filteredPrompts.length} community prompt{filteredPrompts.length !== 1 ? 's' : ''}
            </p>

            {/* View rendering */}
            {view === 'grid' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    showRating
                    userId={userId}
                    onCopy={handleCopy}
                    {...(isPaidUser ? {
                      folders,
                      currentFolderId: getFolderId(prompt.id),
                      savedPromptId: getSavedPromptId(prompt.id),
                      onMoveToFolder: handleMoveToFolder,
                      onCreateFolder: createFolder,
                      onSaveChange: handleSaveChange,
                    } : {})}
                  />
                ))}
              </div>
            )}

            {view === 'list' && (
              <PromptListView prompts={sortedPrompts} userId={userId} />
            )}

            {view === 'table' && (
              <PromptTableView
                prompts={sortedPrompts}
                userId={userId}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}

            {view === 'kanban' && (
              <PromptKanbanView prompts={sortedPrompts} userId={userId} categories={categories} />
            )}

            {/* Pro upsell */}
            {!userId && filteredPrompts.length > 0 && (
              <div className="mt-12 p-6 rounded-2xl bg-apple-gray-50 dark:bg-dark-surface border border-apple-gray-200 dark:border-dark-border">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-apple-blue/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-apple-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-apple-black dark:text-white mb-1">
                      Want to keep prompts private to your team?
                    </h3>
                    <p className="text-sm text-apple-gray-500 dark:text-slate-400">
                      Sign up for Pro to create a private team library, organize prompts in folders, and collaborate with your team &mdash; all in one place.
                    </p>
                  </div>
                  <Link
                    href="/#pricing"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-apple-blue hover:bg-apple-blue-hover text-white font-medium rounded-full transition-colors"
                  >
                    View Pro
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-apple-gray-400 dark:text-slate-400">
                  No community prompts found matching your criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
