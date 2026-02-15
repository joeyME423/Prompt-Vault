'use client'

import { Bookmark, Star, ThumbsUp } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'save' | 'rating' | 'feedback'
  promptTitle: string
  userName: string
  detail: string
  created_at: string
}

interface RecentActivityProps {
  activity: ActivityItem[]
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

const iconMap = {
  save: Bookmark,
  rating: Star,
  feedback: ThumbsUp,
}

const colorMap = {
  save: 'bg-apple-blue/10 text-apple-blue',
  rating: 'bg-amber-500/10 text-amber-500',
  feedback: 'bg-green-500/10 text-green-500',
}

export function RecentActivity({ activity }: RecentActivityProps) {
  if (activity.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
        <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Recent Activity</h3>
        <p className="text-apple-gray-400 text-sm text-center py-8">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
      <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activity.map((item) => {
          const Icon = iconMap[item.type]
          const iconColor = colorMap[item.type]
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-apple-gray-500 dark:text-slate-300">
                  <span className="font-medium text-apple-black dark:text-white">{item.userName}</span>
                  {' '}{item.detail}
                </p>
                <p className="text-xs text-apple-gray-400 dark:text-slate-400 truncate">
                  {item.promptTitle}
                </p>
              </div>
              <span className="text-xs text-apple-gray-400 dark:text-slate-500 flex-shrink-0">
                {timeAgo(item.created_at)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
