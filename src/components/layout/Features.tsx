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
  },
  {
    icon: Bookmark,
    title: 'Personal Library',
    description: 'Save your favorite prompts to your personal library for quick access anytime, anywhere.',
  },
  {
    icon: FolderOpen,
    title: 'Organized Categories',
    description: 'Browse prompts organized by PM tasks: planning, communication, reporting, risk management, and more.',
  },
  {
    icon: Copy,
    title: 'One-Click Copy',
    description: 'Copy prompts instantly with a single click. Paste directly into ChatGPT, Claude, or any AI tool.',
  },
  {
    icon: Sparkles,
    title: 'Curated Quality',
    description: 'Every prompt is carefully crafted and tested by experienced project managers for maximum effectiveness.',
  },
  {
    icon: Share2,
    title: 'Team Sharing',
    description: 'Share prompts with your team and collaborate on building your organization\'s prompt library.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-28 bg-apple-gray-50 dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-apple-black dark:text-white mb-4">
            Everything You Need to Work Smarter
          </h2>
          <p className="text-lg text-apple-gray-500 dark:text-apple-gray-400 max-w-2xl mx-auto">
            PromptVault gives you the tools to find, save, and use AI prompts that make project management easier.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-dark-card rounded-2xl p-8 transition-shadow duration-300 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-apple-gray-50 dark:bg-dark-hover rounded-2xl flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-apple-gray-500 dark:text-apple-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-apple-black dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-apple-gray-500 dark:text-apple-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
