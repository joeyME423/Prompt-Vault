'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Prompt } from '@/types'

interface CategoryStat {
  category: string
  totalUses: number
  promptCount: number
  successRate: number
  feedbackCount: number
}

interface TopPrompt {
  id: string
  title: string
  category: string
  use_count: number
  successRate: number
  avgRating: number
  feedbackCount: number
  ratingCount: number
}

interface ActivityItem {
  id: string
  type: 'save' | 'rating' | 'feedback'
  promptTitle: string
  userName: string
  detail: string
  created_at: string
}

interface DashboardStats {
  totalPrompts: number
  totalUses: number
  avgSuccessRate: number
  teamMemberCount: number
}

interface DashboardData {
  stats: DashboardStats
  categoryStats: CategoryStat[]
  topPrompts: TopPrompt[]
  recentActivity: ActivityItem[]
  loading: boolean
}

export function useDashboardData(): DashboardData {
  const [stats, setStats] = useState<DashboardStats>({ totalPrompts: 0, totalUses: 0, avgSuccessRate: 0, teamMemberCount: 0 })
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([])
  const [topPrompts, setTopPrompts] = useState<TopPrompt[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const userId = session.user.id

    // Get user's team
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

    // Fetch team prompts
    const { data: prompts } = await supabase
      .from('prompts')
      .select('*')
      .eq('team_id', teamId)

    // Also fetch community prompts the user might interact with
    const { data: communityPrompts } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_public', true)
      .is('team_id', null)

    const allPrompts: Prompt[] = [...(prompts || []), ...(communityPrompts || [])]
    const teamPrompts: Prompt[] = prompts || []
    const allPromptIds = allPrompts.map(p => p.id)

    // Team member count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: memberCount } = await (supabase.from('team_members') as any)
      .select('id', { count: 'exact', head: true })
      .eq('team_id', teamId)

    // Feedback for all prompts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: allFeedback } = await (supabase.from('prompt_feedback') as any)
      .select('prompt_id, helpful')
      .in('prompt_id', allPromptIds.length > 0 ? allPromptIds : ['none'])

    // Ratings for all prompts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: allRatings } = await (supabase.from('prompt_ratings') as any)
      .select('prompt_id, rating')
      .in('prompt_id', allPromptIds.length > 0 ? allPromptIds : ['none'])

    const feedback = allFeedback || []
    const ratings = allRatings || []

    // Calculate stats
    const totalUses = allPrompts.reduce((sum, p) => sum + p.use_count, 0)
    const helpfulCount = feedback.filter((f: { helpful: boolean }) => f.helpful).length
    const avgSuccessRate = feedback.length > 0 ? Math.round((helpfulCount / feedback.length) * 100) : 0

    setStats({
      totalPrompts: allPrompts.length,
      totalUses,
      avgSuccessRate,
      teamMemberCount: memberCount || 1,
    })

    // Category stats
    const categoryMap: Record<string, CategoryStat> = {}
    for (const prompt of allPrompts) {
      const cat = prompt.category
      if (!categoryMap[cat]) {
        categoryMap[cat] = { category: cat, totalUses: 0, promptCount: 0, successRate: 0, feedbackCount: 0 }
      }
      categoryMap[cat].totalUses += prompt.use_count
      categoryMap[cat].promptCount += 1
    }

    // Add feedback stats per category
    for (const fb of feedback) {
      const prompt = allPrompts.find(p => p.id === fb.prompt_id)
      if (prompt && categoryMap[prompt.category]) {
        categoryMap[prompt.category].feedbackCount += 1
        if (fb.helpful) {
          categoryMap[prompt.category].successRate += 1
        }
      }
    }

    // Convert successRate to percentage
    const catStats = Object.values(categoryMap).map(cs => ({
      ...cs,
      successRate: cs.feedbackCount > 0 ? Math.round((cs.successRate / cs.feedbackCount) * 100) : 0,
    })).sort((a, b) => b.totalUses - a.totalUses)

    setCategoryStats(catStats)

    // Top prompts
    const topP: TopPrompt[] = allPrompts
      .sort((a, b) => b.use_count - a.use_count)
      .slice(0, 10)
      .map(p => {
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
          use_count: p.use_count,
          successRate: pFeedback.length > 0 ? Math.round((pHelpful / pFeedback.length) * 100) : 0,
          avgRating,
          feedbackCount: pFeedback.length,
          ratingCount: pRatings.length,
        }
      })

    setTopPrompts(topP)

    // Recent activity — saved prompts by team members
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: recentSaves } = await (supabase.from('saved_prompts') as any)
      .select('id, prompt_id, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    const activity: ActivityItem[] = (recentSaves || []).map((save: { id: string; prompt_id: string; user_id: string; created_at: string }) => {
      const prompt = allPrompts.find(p => p.id === save.prompt_id)
      return {
        id: save.id,
        type: 'save' as const,
        promptTitle: prompt?.title || 'Unknown prompt',
        userName: 'Team member',
        detail: 'saved a prompt',
        created_at: save.created_at,
      }
    })

    setRecentActivity(activity)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { stats, categoryStats, topPrompts, recentActivity, loading }
}
