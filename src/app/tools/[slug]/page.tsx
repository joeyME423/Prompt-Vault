'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Brain, Sparkles, ArrowLeft, Plus, BookOpen, Lightbulb, ChevronRight } from 'lucide-react'
import { PM_TOOLS, getToolBySlug, PMTool } from '@/data/tools'
import { createClient } from '@/lib/supabase/client'
import { Prompt } from '@/types/database'

interface ToolPageProps {
  params: { slug: string }
}

function ToolIcon({ color, size = 'lg' }: { color: string; size?: 'sm' | 'lg' }) {
  const sizeClasses = size === 'lg' ? 'w-20 h-20 rounded-2xl' : 'w-10 h-10 rounded-lg'
  const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-5 h-5'

  return (
    <div
      className={`${sizeClasses} flex items-center justify-center`}
      style={{ backgroundColor: `${color}20` }}
    >
      <Brain className={iconSize} style={{ color }} />
    </div>
  )
}

function PromptCard({ prompt, tool }: { prompt: Prompt; tool: PMTool }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-slate-200 dark:border-dark-border hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-dark-surface text-xs font-medium text-slate-600 dark:text-slate-400 rounded-md">
          {prompt.category}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {prompt.title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
        {prompt.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {prompt.tags
          .filter((tag) => !tag.startsWith('tool:'))
          .slice(0, 3)
          .map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded"
              style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
            >
              {tag}
            </span>
          ))}
      </div>
    </div>
  )
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = getToolBySlug(params.slug)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({})

  useEffect(() => {
    async function fetchPrompts() {
      if (!tool) return

      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('prompts') as any)
        .select('*')
        .contains('tags', [`tool:${tool.name}`])
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (!error && data) {
        const promptsData = data as Prompt[]
        setPrompts(promptsData)
        // Calculate category stats
        const stats: Record<string, number> = {}
        promptsData.forEach((prompt) => {
          stats[prompt.category] = (stats[prompt.category] || 0) + 1
        })
        setCategoryStats(stats)
      }
      setIsLoading(false)
    }

    fetchPrompts()
  }, [tool])

  if (!tool) {
    notFound()
  }

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/tools" className="hover:text-primary-500 transition-colors">
            PM Tools
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 dark:text-white">{tool.name}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <ToolIcon color={tool.color} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {tool.name}
                </h1>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
                >
                  <Sparkles className="w-4 h-4" />
                  {tool.aiFeatureName}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-2xl">
                {tool.description}
              </p>
              <Link
                href={`/contribute?tool=${tool.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Contribute a {tool.name} Prompt
              </Link>
            </div>
          </div>
        </div>

        {/* Stats & AI Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* AI Features Card */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${tool.color}20` }}
              >
                <Brain className="w-5 h-5" style={{ color: tool.color }} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {tool.aiFeatureName}
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {tool.aiFeatureDescription}
            </p>
            <div className="space-y-2">
              {tool.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: tool.color }}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Prompt Statistics
              </h2>
            </div>
            <div className="mb-4">
              <div className="text-4xl font-bold text-slate-900 dark:text-white">
                {prompts.length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Total prompts for {tool.name}
              </div>
            </div>
            {Object.keys(categoryStats).length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  By Category
                </div>
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{category}</span>
                    <span
                      className="px-2 py-0.5 text-xs font-medium rounded"
                      style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
                    >
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-gradient-to-r from-primary-500/10 to-accent-purple/10 rounded-2xl border border-primary-500/20 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Best Practices for {tool.name} Prompts
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Reference {tool.aiFeatureName} capabilities when crafting prompts</li>
                <li>• Use tool-specific terminology and field names</li>
                <li>• Consider the tool&apos;s automation and integration features</li>
                <li>• Test prompts within {tool.name}&apos;s AI interface for best results</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prompts Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {tool.name} Prompts
            </h2>
            <Link
              href={`/contribute?tool=${tool.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Prompt
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-dark-card rounded-xl p-5 border border-slate-200 dark:border-dark-border animate-pulse"
                >
                  <div className="h-6 w-20 bg-slate-200 dark:bg-dark-surface rounded mb-3" />
                  <div className="h-5 w-3/4 bg-slate-200 dark:bg-dark-surface rounded mb-2" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-dark-surface rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-slate-200 dark:bg-dark-surface rounded" />
                    <div className="h-5 w-16 bg-slate-200 dark:bg-dark-surface rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : prompts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-12 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${tool.color}20` }}
              >
                <BookOpen className="w-8 h-8" style={{ color: tool.color }} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No prompts yet for {tool.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Be the first to contribute a prompt optimized for {tool.aiFeatureName}!
              </p>
              <Link
                href={`/contribute?tool=${tool.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Contribute First Prompt
              </Link>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-border">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All PM Tools
          </Link>
        </div>
      </div>
    </main>
  )
}
