'use client'

import { Users, Clock } from 'lucide-react'

export default function AdminTeamsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-apple-blue/10 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-apple-blue" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-apple-black dark:text-white">
              Manage Teams
            </h1>
            <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
              View and manage all teams and members
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-apple-gray-50 dark:bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-apple-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-apple-black dark:text-white mb-2">
            Coming Soon
          </h2>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 max-w-md mx-auto">
            Team management will be available here. You&apos;ll be able to view all teams, members, and usage statistics.
          </p>
        </div>
      </div>
    </div>
  )
}
