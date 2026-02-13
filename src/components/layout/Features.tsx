'use client'

import {
  Search,
  Bookmark,
  Sparkles,
  FolderOpen,
  Copy,
  Share2
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find the perfect prompt in seconds with powerful search and filtering by category, use case, or keyword.',
    color: 'text-primary-500',
    bgColor: 'bg-primary-500/10',
  },
  {
    icon: Bookmark,
    title: 'Personal Library',
    description: 'Save your favorite prompts to your personal library for quick access anytime, anywhere.',
    color: 'text-accent-purple',
    bgColor: 'bg-accent-purple/10',
  },
  {
    icon: FolderOpen,
    title: 'Organized Categories',
    description: 'Browse prompts organized by PM tasks: planning, communication, reporting, risk management, and more.',
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue/10',
  },
  {
    icon: Copy,
    title: 'One-Click Copy',
    description: 'Copy prompts instantly with a single click. Paste directly into ChatGPT, Claude, or any AI tool.',
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/10',
  },
  {
    icon: Sparkles,
    title: 'Curated Quality',
    description: 'Every prompt is carefully crafted and tested by experienced project managers for maximum effectiveness.',
    color: 'text-accent-pink',
    bgColor: 'bg-accent-pink/10',
  },
  {
    icon: Share2,
    title: 'Team Sharing',
    description: 'Share prompts with your team and collaborate on building your organization\'s prompt library.',
    color: 'text-primary-600',
    bgColor: 'bg-primary-600/10',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need to <span className="gradient-text">Work Smarter</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            PromptVault gives you the tools to find, save, and use AI prompts that make project management easier.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card p-6 hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
