'use client'

import Link from 'next/link'
import { BarChart3, Clock, TrendingUp, Users, ArrowRight, Star } from 'lucide-react'

const mockStats = [
  { icon: BarChart3, label: 'Total Prompts', value: '247', color: 'text-primary-500', bg: 'bg-primary-500/10' },
  { icon: Clock, label: 'Time Saved', value: '~12h 30m', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { icon: TrendingUp, label: 'Success Rate', value: '94%', color: 'text-green-500', bg: 'bg-green-500/10' },
  { icon: Users, label: 'Team Members', value: '8', color: 'text-purple-500', bg: 'bg-purple-500/10' },
]

const mockCategoryData = [
  { category: 'Planning', uses: 89, height: '85%' },
  { category: 'Reporting', uses: 67, height: '65%' },
  { category: 'Communication', uses: 45, height: '45%' },
  { category: 'Agile', uses: 38, height: '38%' },
  { category: 'Risk', uses: 28, height: '28%' },
  { category: 'Meetings', uses: 22, height: '22%' },
]

const mockTopPrompts = [
  { rank: 1, title: 'Sprint Planning AI Assistant', category: 'Agile', uses: 89, success: '96%', rating: 4.8 },
  { rank: 2, title: 'Executive Status Report Generator', category: 'Reporting', uses: 67, success: '92%', rating: 4.6 },
  { rank: 3, title: 'Stakeholder Update Email', category: 'Communication', uses: 45, success: '94%', rating: 4.7 },
]

export function DashboardPreview() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
            <BarChart3 className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              Analytics Dashboard
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Track Your Team&apos;s <span className="gradient-text">AI Productivity</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            See which prompts work best, how much time your team saves, and where to focus next.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative max-w-5xl mx-auto">
          {/* Subtle glow behind */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 via-accent-purple/10 to-accent-cyan/10 rounded-3xl blur-2xl" />

          <div className="relative bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border shadow-2xl overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-xs text-slate-400">
                  prompt-vaults.com/dashboard
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {mockStats.map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-100 dark:border-dark-border">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid lg:grid-cols-2 gap-4 mb-6">
                {/* Usage chart mockup */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-100 dark:border-dark-border">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Usage by Category</p>
                  <div className="flex items-end gap-2 h-32">
                    {mockCategoryData.map((item) => (
                      <div key={item.category} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-primary-500/80 rounded-t-sm min-h-[4px] transition-all"
                          style={{ height: item.height }}
                        />
                        <span className="text-[9px] text-slate-400 truncate w-full text-center">{item.category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success rate mockup */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-100 dark:border-dark-border">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Success Rate by Category</p>
                  <div className="flex items-end gap-2 h-32">
                    {mockCategoryData.map((item) => (
                      <div key={item.category} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-green-500/80 rounded-t-sm min-h-[4px] transition-all"
                          style={{ height: `${70 + Math.random() * 25}%` }}
                        />
                        <span className="text-[9px] text-slate-400 truncate w-full text-center">{item.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top prompts mini table */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-100 dark:border-dark-border">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Top Prompts by Usage</p>
                <div className="space-y-2">
                  {mockTopPrompts.map((p) => (
                    <div key={p.rank} className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400 w-4">{p.rank}</span>
                      <span className="flex-1 font-medium text-slate-700 dark:text-slate-300 truncate">{p.title}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-medium">{p.category}</span>
                      <span className="text-slate-500 w-12 text-right">{p.uses} uses</span>
                      <span className="text-green-600 dark:text-green-400 w-10 text-right">{p.success}</span>
                      <span className="inline-flex items-center gap-0.5 text-amber-500 w-10 text-right">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {p.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-500/20"
          >
            Get Your Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Free to start. See your analytics instantly.
          </p>
        </div>
      </div>
    </section>
  )
}
