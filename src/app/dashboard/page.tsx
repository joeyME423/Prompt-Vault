'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Clock, TrendingUp, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { CATEGORY_TIME_SAVED } from '@/lib/constants'
import { StatCard } from '@/components/dashboard/StatCard'
import { CategoryUsageChart } from '@/components/dashboard/CategoryUsageChart'
import { SuccessRateChart } from '@/components/dashboard/SuccessRateChart'
import { TopPromptsTable } from '@/components/dashboard/TopPromptsTable'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

export default function DashboardPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const { stats, categoryStats, topPrompts, recentActivity, loading } = useDashboardData()
  const [copyCounts] = useLocalStorage<Record<string, number>>('pv-copy-counts', {})

  // Calculate time saved from localStorage copy counts
  const totalMinutes = Object.entries(copyCounts).reduce((sum, [category, count]) => {
    const minutesPerUse = CATEGORY_TIME_SAVED[category.toLowerCase()] || 10
    return sum + (minutesPerUse * count)
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const timeDisplay = hours > 0 ? `~${hours}h ${minutes}m` : `~${minutes}m`

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login?redirect=/dashboard')
        return
      }
      setAuthed(true)
    }
    checkAuth()
  }, [router])

  if (!authed || loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-apple-gray-200 dark:bg-dark-surface rounded w-48 mb-2" />
            <div className="h-5 bg-apple-gray-200 dark:bg-dark-surface rounded w-72 mb-8" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6 animate-pulse">
                  <div className="h-10 w-10 bg-apple-gray-200 dark:bg-dark-surface rounded-xl mb-3" />
                  <div className="h-7 bg-apple-gray-200 dark:bg-dark-surface rounded w-16 mb-1" />
                  <div className="h-4 bg-apple-gray-200 dark:bg-dark-surface rounded w-24" />
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6 h-80 animate-pulse" />
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6 h-80 animate-pulse" />
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
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-apple-blue/10 border border-apple-blue/20 mb-4">
            <BarChart3 className="w-4 h-4 text-apple-blue" />
            <span className="text-sm font-medium text-apple-blue-hover dark:text-apple-blue">
              Analytics
            </span>
          </div>
          <h1 className="text-3xl font-bold text-apple-black dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-apple-gray-500 dark:text-slate-300">
            Track your team&apos;s prompt usage, success rates, and productivity gains.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={BarChart3}
            label="Total Prompts"
            value={stats.totalPrompts.toLocaleString()}
            sublabel={`${stats.totalUses.toLocaleString()} total uses`}
          />
          <StatCard
            icon={Clock}
            label="Time Saved"
            value={totalMinutes > 0 ? timeDisplay : '0m'}
            sublabel="Estimated from prompt usage"
            color="text-accent-cyan"
          />
          <StatCard
            icon={TrendingUp}
            label="Success Rate"
            value={stats.avgSuccessRate > 0 ? `${stats.avgSuccessRate}%` : '--'}
            sublabel="Based on user feedback"
            color="text-green-500"
          />
          <StatCard
            icon={Users}
            label="Team Members"
            value={stats.teamMemberCount.toString()}
            sublabel="Active in your team"
            color="text-accent-purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <CategoryUsageChart data={categoryStats} />
          <SuccessRateChart data={categoryStats} />
        </div>

        {/* Bottom Row: Top Prompts + Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopPromptsTable prompts={topPrompts} />
          </div>
          <div>
            <RecentActivity activity={recentActivity} />
          </div>
        </div>
      </div>
    </div>
  )
}
