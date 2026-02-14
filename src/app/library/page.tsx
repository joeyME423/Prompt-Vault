'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PromptCard } from '@/components/prompts/PromptCard'
import { ViewSwitcher, type LibraryView } from '@/components/ui/ViewSwitcher'
import { PromptListView } from '@/components/prompts/PromptListView'
import { PromptTableView, type SortColumn } from '@/components/prompts/PromptTableView'
import { PromptKanbanView } from '@/components/prompts/PromptKanbanView'
import { FolderSidebar } from '@/components/prompts/FolderSidebar'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useFolders } from '@/hooks/useFolders'
import { AlertCircle, Users, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUserProfile } from '@/hooks/useUserProfile'
import { ROLE_CATEGORY_MAP } from '@/lib/constants'
import { posthog } from '@/lib/posthog'
import type { Prompt } from '@/types'

const categories = ['Planning', 'Communication', 'Reporting', 'Risk', 'Stakeholder', 'Agile', 'Meetings']

interface SavedPromptMapping {
  id: string
  prompt_id: string
  folder_id: string | null
}

export default function LibraryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [teamName, setTeamName] = useState('')
  const [view, setView] = useLocalStorage<LibraryView>('pv-library-view', 'grid')
  const [sortColumn, setSortColumn] = useState<SortColumn>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [activeFolder, setActiveFolder] = useState<string | null>(null) // null = All, 'unsorted' = no folder
  const [savedMappings, setSavedMappings] = useState<SavedPromptMapping[]>([])

  const { folders, createFolder, deleteFolder, moveToFolder } = useFolders(userId)
  const { profile } = useUserProfile()

  // Get suggested categories based on user role
  const suggestedCategories = profile?.role ? ROLE_CATEGORY_MAP[profile.role] || [] : []

  const fetchSavedMappings = useCallback(async (uid: string) => {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('saved_prompts') as any)
      .select('id, prompt_id, folder_id')
      .eq('user_id', uid)
    setSavedMappings(data || [])
  }, [])

  useEffect(() => {
    async function fetchTeamPrompts() {
      const supabase = createClient()

      // Check auth — library requires login
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login?redirect=/library')
        return
      }

      setUserId(session.user.id)

      // Get user's team
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: membership } = await (supabase.from('team_members') as any)
        .select('team_id')
        .eq('user_id', session.user.id)
        .limit(1)
        .maybeSingle()

      if (!membership) {
        setLoading(false)
        return
      }

      // Get team name
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: team } = await (supabase.from('teams') as any)
        .select('name')
        .eq('id', membership.team_id)
        .maybeSingle()

      if (team) setTeamName(team.name)

      // Fetch team prompts
      const { data, error: fetchError } = await supabase
        .from('prompts')
        .select('*')
        .eq('team_id', membership.team_id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching team prompts:', fetchError)
        setError(true)
      } else {
        setPrompts(data || [])
      }

      // Fetch saved prompt mappings for folder filtering
      await fetchSavedMappings(session.user.id)

      setLoading(false)
    }

    fetchTeamPrompts()
  }, [router, fetchSavedMappings])

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleMoveToFolder = async (savedPromptId: string, folderId: string | null) => {
    const success = await moveToFolder(savedPromptId, folderId)
    if (success) {
      setSavedMappings(prev =>
        prev.map(m => m.id === savedPromptId ? { ...m, folder_id: folderId } : m)
      )
    }
    return success
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === null || prompt.category === activeCategory

    // Folder filtering
    let matchesFolder = true
    if (activeFolder === 'unsorted') {
      const mapping = savedMappings.find(m => m.prompt_id === prompt.id)
      matchesFolder = !mapping || mapping.folder_id === null
    } else if (activeFolder !== null) {
      const mapping = savedMappings.find(m => m.prompt_id === prompt.id)
      matchesFolder = mapping?.folder_id === activeFolder
    }

    return matchesSearch && matchesCategory && matchesFolder
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

  const getSavedPromptId = (promptId: string) => {
    return savedMappings.find(m => m.prompt_id === promptId)?.id ?? null
  }

  const getFolderId = (promptId: string) => {
    return savedMappings.find(m => m.prompt_id === promptId)?.folder_id ?? null
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-dark-surface rounded w-64 mx-auto mb-4" />
            <div className="h-5 bg-slate-200 dark:bg-dark-surface rounded w-96 mx-auto mb-12" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 dark:bg-dark-surface rounded w-24 mb-4" />
                  <div className="h-5 bg-slate-200 dark:bg-dark-surface rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 dark:bg-dark-surface rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
            <Users className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {teamName || 'Your Team'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Team Library
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your team&apos;s private collection of AI prompts.
          </p>
        </div>

        {/* Search, Filters, and View Switcher */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search your team's prompts..."
            />
            <ViewSwitcher view={view} onChange={(v) => { setView(v); posthog.capture('view_changed', { view: v }) }} />
          </div>
          <div className="flex justify-center">
            <FilterTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Folder bar */}
        <FolderSidebar
          folders={folders}
          activeFolder={activeFolder}
          onSelect={setActiveFolder}
          onCreate={createFolder}
          onDelete={deleteFolder}
        />

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              Unable to load your team prompts. Please try again later.
            </p>
          </div>
        )}

        {/* Suggested for you */}
        {!error && suggestedCategories.length > 0 && searchQuery === '' && activeCategory === null && activeFolder === null && (
          (() => {
            const suggested = sortedPrompts.filter(p =>
              suggestedCategories.some(c => p.category.toLowerCase() === c.toLowerCase())
            ).slice(0, 3)
            if (suggested.length === 0) return null
            return (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  <h2 className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                    Suggested for {profile?.role}s
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggested.map((prompt) => (
                    <PromptCard
                      key={`suggested-${prompt.id}`}
                      prompt={prompt}
                      userId={userId}
                      folders={folders}
                      currentFolderId={getFolderId(prompt.id)}
                      savedPromptId={getSavedPromptId(prompt.id)}
                      onMoveToFolder={handleMoveToFolder}
                      onCreateFolder={createFolder}
                    />
                  ))}
                </div>
                <hr className="mt-10 border-slate-200 dark:border-dark-border" />
              </div>
            )
          })()
        )}

        {/* Results */}
        {!error && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
            </p>

            {/* View rendering */}
            {view === 'grid' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    userId={userId}
                    folders={folders}
                    currentFolderId={getFolderId(prompt.id)}
                    savedPromptId={getSavedPromptId(prompt.id)}
                    onMoveToFolder={handleMoveToFolder}
                    onCreateFolder={createFolder}
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

            {/* Empty state */}
            {filteredPrompts.length === 0 && searchQuery === '' && activeCategory === null && activeFolder === null && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No team prompts yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  Start building your team&apos;s prompt library by contributing your first prompt.
                </p>
                <Link
                  href="/contribute"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Prompt
                </Link>
              </div>
            )}

            {filteredPrompts.length === 0 && (searchQuery !== '' || activeCategory !== null || activeFolder !== null) && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  No prompts found matching your criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
