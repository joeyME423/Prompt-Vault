'use client'

import { Shield, FileText, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const adminCards = [
  {
    icon: FileText,
    title: 'Review Prompts',
    description: 'Review and approve community prompt submissions',
    href: '/admin/prompts',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
  {
    icon: Users,
    title: 'Manage Teams',
    description: 'View all teams, members, and usage',
    href: '/admin/teams',
    iconBg: 'bg-apple-blue/10',
    iconColor: 'text-apple-blue',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Global usage analytics and trends',
    href: '/admin/analytics',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
  },
]

export default function AdminHomePage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-apple-black dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
              Manage PromptVault
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded-2xl p-6 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-colors group"
            >
              <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-apple-black dark:text-white mb-1 group-hover:text-orange-500 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
