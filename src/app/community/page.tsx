'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PromptCard } from '@/components/prompts/PromptCard'
import { AlertCircle, Globe, Heart, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Prompt } from '@/types'

const categories = ['Planning', 'Communication', 'Reporting', 'Risk', 'Stakeholder', 'Agile', 'Meetings']

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Check auth
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setUserId(session.user.id)

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

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === null || prompt.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Globe className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Community Contributed
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Community Prompts
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Prompts contributed and rated by the PM community. Browse, rate, and save your favorites.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500/5 border border-primary-500/10">
            <Heart className="w-4 h-4 text-primary-500" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Free and open to everyone. We believe great prompts should be accessible to all PMs &mdash; and we&apos;ll keep it that way for as long as we can.{' '}
              <Link href="/contribute" className="text-primary-500 hover:text-primary-600 font-medium">
                Contribute yours
              </Link>
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search community prompts..."
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

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-dark-surface rounded w-24 mb-4" />
                <div className="h-5 bg-slate-200 dark:bg-dark-surface rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-dark-surface rounded w-full mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-dark-surface rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              Unable to load community prompts right now. Please try again later.
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Showing {filteredPrompts.length} community prompt{filteredPrompts.length !== 1 ? 's' : ''}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  showRating
                  userId={userId}
                />
              ))}
            </div>

            {/* Pro upsell */}
            {!userId && filteredPrompts.length > 0 && (
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary-500/5 via-accent-purple/5 to-accent-blue/5 border border-primary-500/10">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                      Want to keep prompts private to your team?
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Sign up for Pro to create a private team library, organize prompts in folders, and collaborate with your team &mdash; all in one place.
                    </p>
                  </div>
                  <Link
                    href="/#pricing"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
                  >
                    View Pro
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
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
