'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORY_TO_PMO, PMO_CATEGORIES } from '@/lib/constants'
import type { Prompt } from '@/types'

export type TimeRange = '30d' | 'quarter' | 'ytd'

export interface TopPrompt {
  id: string
  title: string
  category: string
  pmoCategory: string
  use_count: number
  successRate: number
  avgRating: number
  feedbackCount: number
  ratingCount: number
  isStandard: boolean
}

export interface CategoryStat {
  category: string
  standardUses: number
  nonStandardUses: number
}

export interface AdoptionStats {
  projectsPct: number
  pmsPct: number
  standardsUsed30d: number
  totalArtifacts: number
}

export interface OutcomeComparison {
  metric: string
  withStandards: number | null
  withoutStandards: number | null
}

export interface DashboardData {
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  highlights: string[]
  adoptionStats: AdoptionStats
  categoryStats: CategoryStat[]
  topPrompts: TopPrompt[]
  outcomeComparison: OutcomeComparison[]
  standardsToWatch: TopPrompt[]
  loading: boolean
}

function getDateThreshold(range: TimeRange): Date {
  const now = new Date()
  switch (range) {
    case '30d':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
    case 'quarter':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    case 'ytd':
      return new Date(now.getFullYear(), 0, 1)
  }
}

function mapToPmoCategory(category: string): string {
  return CATEGORY_TO_PMO[category] || category
}

export function useDashboardData(): DashboardData {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [highlights, setHighlights] = useState<string[]>([])
  const [adoptionStats, setAdoptionStats] = useState<AdoptionStats>({
    projectsPct: 0,
    pmsPct: 0,
    standardsUsed30d: 0,
    totalArtifacts: 0,
  })
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [topPrompts, setTopPrompts] = useState<TopPrompt[]>([])
  const [outcomeComparison] = useState<OutcomeComparison[]>([
    { metric: 'On-time completion', withStandards: null, withoutStandards: null },
    { metric: 'On-budget delivery', withStandards: null, withoutStandards: null },
    { metric: 'Stakeholder satisfaction', withStandards: null, withoutStandards: null },
  ])
  const [standardsToWatch, setStandardsToWatch] = useState<TopPrompt[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setLoading(false)
      return
    }

    const userId = session.user.id
    const dateThreshold = getDateThreshold(timeRange)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: membership } = await (supabase.from('team_members') as any)
      .select('team_id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle()

    if (!membership) {
      setLoading(false)
      return
    }

    const teamId = membership.team_id

    // Fetch team prompts (standard)
    const { data: teamPrompts } = await supabase
      .from('prompts')
      .select('*')
      .eq('team_id', teamId)

    // Fetch community prompts (non-standard)
    const { data: communityPrompts } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_public', true)
      .is('team_id', null)

    const standardPrompts: Prompt[] = teamPrompts || []
    const nonStandardPrompts: Prompt[] = communityPrompts || []
    const allPrompts: Prompt[] = [...standardPrompts, ...nonStandardPrompts]
    const allPromptIds = allPrompts.map(p => p.id)

    // Team member count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: memberCount } = await (supabase.from('team_members') as any)
      .select('id', { count: 'exact', head: true })
      .eq('team_id', teamId)

    // Feedback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: allFeedback } = await (supabase.from('prompt_feedback') as any)
      .select('prompt_id, helpful')
      .in('prompt_id', allPromptIds.length > 0 ? allPromptIds : ['none'])

    // Ratings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: allRatings } = await (supabase.from('prompt_ratings') as any)
      .select('prompt_id, rating')
      .in('prompt_id', allPromptIds.length > 0 ? allPromptIds : ['none'])

    const feedback = allFeedback || []
    const ratings = allRatings || []

    // Filter by time range (using created_at on prompts as proxy)
    const filteredStandard = standardPrompts.filter(p => new Date(p.created_at) >= dateThreshold)
    const filteredNonStandard = nonStandardPrompts.filter(p => new Date(p.created_at) >= dateThreshold)
    const filteredAll = [...filteredStandard, ...filteredNonStandard]

    // Adoption stats
    const standardsUsed30d = standardPrompts.reduce((sum, p) => sum + p.use_count, 0)
    const totalArtifacts = allPrompts.reduce((sum, p) => sum + p.use_count, 0)
    const totalMembers = memberCount || 1
    // Approximate PMs using standards: if any standard prompt has uses, estimate based on ratio
    const pmsPct = standardPrompts.length > 0 && standardsUsed30d > 0
      ? Math.min(100, Math.round((standardsUsed30d / (totalMembers * standardPrompts.length)) * 100))
      : 0

    setAdoptionStats({
      projectsPct: 0, // no projects table
      pmsPct,
      standardsUsed30d,
      totalArtifacts,
    })

    // Category stats — group by PMO category, split standard vs non-standard
    const catMap: Record<string, CategoryStat> = {}
    for (const cat of PMO_CATEGORIES) {
      catMap[cat] = { category: cat, standardUses: 0, nonStandardUses: 0 }
    }

    for (const p of allPrompts) {
      const pmoCat = mapToPmoCategory(p.category)
      if (!catMap[pmoCat]) {
        catMap[pmoCat] = { category: pmoCat, standardUses: 0, nonStandardUses: 0 }
      }
      const isStandard = !!p.team_id
      if (isStandard) {
        catMap[pmoCat].standardUses += p.use_count
      } else {
        catMap[pmoCat].nonStandardUses += p.use_count
      }
    }

    const catStats = Object.values(catMap)
      .filter(cs => cs.standardUses > 0 || cs.nonStandardUses > 0)
      .sort((a, b) => (b.standardUses + b.nonStandardUses) - (a.standardUses + a.nonStandardUses))

    setCategoryStats(catStats)

    // Top prompts
    const buildTopPrompt = (p: Prompt): TopPrompt => {
      const pFeedback = feedback.filter((f: { prompt_id: string }) => f.prompt_id === p.id)
      const pHelpful = pFeedback.filter((f: { helpful: boolean }) => f.helpful).length
      const pRatings = ratings.filter((r: { prompt_id: string }) => r.prompt_id === p.id)
      const avgRating = pRatings.length > 0
        ? Math.round((pRatings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / pRatings.length) * 10) / 10
        : 0

      return {
        id: p.id,
        title: p.title,
        category: p.category,
        pmoCategory: mapToPmoCategory(p.category),
        use_count: p.use_count,
        successRate: pFeedback.length > 0 ? Math.round((pHelpful / pFeedback.length) * 100) : 0,
        avgRating,
        feedbackCount: pFeedback.length,
        ratingCount: pRatings.length,
        isStandard: !!p.team_id,
      }
    }

    const topP = allPrompts
      .sort((a, b) => b.use_count - a.use_count)
      .slice(0, 10)
      .map(buildTopPrompt)

    setTopPrompts(topP)

    // Standards to watch — standard prompts with lowest usage
    const watchList = standardPrompts
      .sort((a, b) => a.use_count - b.use_count)
      .slice(0, 10)
      .map(buildTopPrompt)

    setStandardsToWatch(watchList)

    // Highlights
    const hlights: string[] = []
    if (standardPrompts.length > 0) {
      hlights.push(`${standardPrompts.length} PMO standard${standardPrompts.length === 1 ? '' : 's'} used ${standardsUsed30d.toLocaleString()} times total.`)
    }
    if (filteredAll.length > 0) {
      hlights.push(`${filteredAll.length} prompt${filteredAll.length === 1 ? '' : 's'} created in this period across ${new Set(filteredAll.map(p => mapToPmoCategory(p.category))).size} categories.`)
    }
    if (totalArtifacts > 0) {
      hlights.push(`${totalArtifacts.toLocaleString()} total AI-assisted artifacts generated.`)
    }
    if (hlights.length === 0) {
      hlights.push('No activity yet. Create and use prompts to see insights here.')
    }
    setHighlights(hlights)

    setLoading(false)
  }, [timeRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    timeRange,
    setTimeRange,
    highlights,
    adoptionStats,
    categoryStats,
    topPrompts,
    outcomeComparison,
    standardsToWatch,
    loading,
  }
}
