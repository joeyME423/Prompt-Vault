'use client'

import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  sublabel?: string
  color?: string
}

export function StatCard({ icon: Icon, label, value, sublabel, color = 'text-apple-blue' }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-apple-blue/10 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-apple-black dark:text-white mb-1">{value}</p>
      <p className="text-sm text-apple-gray-400 dark:text-slate-400">{label}</p>
      {sublabel && (
        <p className="text-xs text-apple-gray-400 dark:text-slate-500 mt-1">{sublabel}</p>
      )}
    </div>
  )
}
