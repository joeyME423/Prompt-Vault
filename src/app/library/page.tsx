'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PromptCard } from '@/components/prompts/PromptCard'
import { AlertCircle, Users, Plus } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Prompt } from '@/types'

const categories = ['Planning', 'Communication', 'Reporting', 'Risk', 'Stakeholder', 'Agile', 'Meetings']

export default function LibraryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [teamName, setTeamName] = useState('')

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
      setLoading(false)
    }

    fetchTeamPrompts()
  }, [router])

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === null || prompt.category === activeCategory

    return matchesSearch && matchesCategory
  })

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

        {/* Search and Filters */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search your team's prompts..."
            />
          </div>
          <div className="flex justify-center">
            <FilterTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              Unable to load your team prompts. Please try again later.
            </p>
          </div>
        )}

        {/* Results */}
        {!error && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} userId={userId} />
              ))}
            </div>

            {/* Empty state */}
            {filteredPrompts.length === 0 && searchQuery === '' && activeCategory === null && (
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

            {filteredPrompts.length === 0 && (searchQuery !== '' || activeCategory !== null) && (
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
