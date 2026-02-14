'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PromptCard } from '@/components/prompts/PromptCard'
import type { Prompt } from '@/types'

export function NewPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchNewPrompts() {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_public', true)
        .is('team_id', null)
        .order('created_at', { ascending: false })
        .limit(3)

      if (fetchError) {
        console.error('Error fetching prompts:', fetchError)
        setError(true)
      } else {
        setPrompts(data || [])
      }
      setLoading(false)
    }

    fetchNewPrompts()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">
            Unable to load prompts right now. Please try again later.
          </p>
        </div>
      </section>
    )
  }

  if (prompts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Community Prompts
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Free and open to everyone &mdash; our way of giving back to the PM community
            </p>
          </div>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            View all community prompts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Prompts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </div>
    </section>
  )
}
