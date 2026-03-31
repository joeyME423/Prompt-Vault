'use client'

import { useState } from 'react'
import { BarChart3, FolderCheck, Users, Shield, Sparkles } from 'lucide-react'
import { useDashboardData, type TopPrompt } from '@/hooks/useDashboardData'
import { StatCard } from '@/components/dashboard/StatCard'
import { CategoryUsageChart } from '@/components/dashboard/CategoryUsageChart'
import { TopPromptsTable } from '@/components/dashboard/TopPromptsTable'
import { HighlightsStrip } from '@/components/dashboard/HighlightsStrip'
import { TimeRangeFilter } from '@/components/dashboard/TimeRangeFilter'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { OutcomeComparisonTiles } from '@/components/dashboard/OutcomeComparisonTiles'
import { OutcomeUpliftChart } from '@/components/dashboard/OutcomeUpliftChart'
import { StandardsToWatchTable } from '@/components/dashboard/StandardsToWatchTable'
import { PromptDetailPanel } from '@/components/dashboard/PromptDetailPanel'
import { DownloadReport } from '@/components/dashboard/DownloadReport'

export default function DashboardPage() {
  const {
    timeRange,
    setTimeRange,
    highlights,
    adoptionStats,
    categoryStats,
    topPrompts,
    outcomeComparison,
    standardsToWatch,
    loading,
  } = useDashboardData()

  const [selectedPrompt, setSelectedPrompt] = useState<TopPrompt | null>(null)

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-apple-gray-200 dark:bg-dark-surface rounded w-48 mb-2" />
            <div className="h-5 bg-apple-gray-200 dark:bg-dark-surface rounded w-96 mb-8" />
            <div className="h-16 bg-apple-gray-200 dark:bg-dark-surface rounded-2xl mb-8" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6 animate-pulse">
                  <div className="h-10 w-10 bg-apple-gray-200 dark:bg-dark-surface rounded-xl mb-3" />
                  <div className="h-7 bg-apple-gray-200 dark:bg-dark-surface rounded w-16 mb-1" />
                  <div className="h-4 bg-apple-gray-200 dark:bg-dark-surface rounded w-24" />
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6 h-80 animate-pulse mb-8" />
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6 h-64 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
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
                Monitor adoption and effectiveness of PMO&#8209;approved prompts across projects.
              </p>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
              <DownloadReport />
            </div>
          </div>
        </div>

        {/* Highlights Strip */}
        <HighlightsStrip highlights={highlights} />

        {/* ─── Section 1: Adoption Overview ─── */}
        <div className="mb-12">
          <SectionHeader
            title="Adoption Overview"
            helper="How widely are PMO standards being used across projects and teams?"
          />

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={FolderCheck}
              label="Projects using PMO prompts (%)"
              value={adoptionStats.projectsPct > 0 ? `${adoptionStats.projectsPct}%` : '—'}
              sublabel="Link projects to track"
            />
            <StatCard
              icon={Users}
              label="PMs using standards (%)"
              value={adoptionStats.pmsPct > 0 ? `${adoptionStats.pmsPct}%` : '—'}
              sublabel="Based on team activity"
              color="text-accent-cyan"
            />
            <StatCard
              icon={Shield}
              label="Standard prompts used (30 days)"
              value={adoptionStats.standardsUsed30d.toLocaleString()}
              sublabel="Team-owned prompt uses"
              color="text-green-500"
            />
            <StatCard
              icon={Sparkles}
              label="Total AI-assisted artifacts created"
              value={adoptionStats.totalArtifacts.toLocaleString()}
              sublabel="All prompt uses combined"
              color="text-accent-purple"
            />
          </div>

          {/* Category Chart */}
          <div className="mb-8">
            <CategoryUsageChart data={categoryStats} />
          </div>

          {/* Top Prompts Table */}
          <TopPromptsTable
            prompts={topPrompts}
            onPromptClick={setSelectedPrompt}
          />
        </div>

        {/* ─── Section 2: Outcome Impact ─── */}
        <div className="mb-12">
          <SectionHeader
            title="Outcome Impact"
            helper="Are PMO standards improving project delivery outcomes?"
          />

          <OutcomeComparisonTiles data={outcomeComparison} />
          <OutcomeUpliftChart />
        </div>

        {/* ─── Section 3: Standards to Watch ─── */}
        <div className="mb-8">
          <SectionHeader
            title="Standards to Watch"
            helper="Which standards need attention — low adoption or no outcome link?"
          />

          <StandardsToWatchTable
            prompts={standardsToWatch}
            onPromptClick={setSelectedPrompt}
          />
        </div>
      </div>

      {/* Prompt Detail Panel */}
      <PromptDetailPanel
        prompt={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
      />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          nav, aside, .print\\:hidden { display: none !important; }
          body { background: white !important; }
          .dark\\:bg-dark-card { background: white !important; }
          .dark\\:bg-dark-bg { background: white !important; }
          .dark\\:text-white { color: black !important; }
          .dark\\:text-slate-300, .dark\\:text-slate-400 { color: #666 !important; }
          .dark\\:border-dark-border { border-color: #e5e5e5 !important; }
        }
      `}</style>
    </div>
  )
}
