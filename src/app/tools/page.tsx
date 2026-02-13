import Link from 'next/link'
import { Sparkles, ArrowRight, Brain, Zap } from 'lucide-react'
import { PM_TOOLS } from '@/data/tools'

export const metadata = {
  title: 'PM Tools | PromptVault',
  description: 'Explore AI-powered prompts for your favorite project management tools',
}

function ToolIcon({ color }: { color: string }) {
  return (
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center"
      style={{ backgroundColor: `${color}20` }}
    >
      <Brain className="w-8 h-8" style={{ color }} />
    </div>
  )
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-4">
            <Zap className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-500">AI-Powered Prompts</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            PM Tool <span className="text-primary-500">Integrations</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover curated AI prompts optimized for your favorite project management tools.
            Each tool has specialized prompts designed for its unique AI features.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PM_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200 dark:border-dark-border hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
            >
              <div className="flex items-start justify-between mb-4">
                <ToolIcon color={tool.color} />
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {tool.name}
              </h2>

              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3"
                style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
              >
                <Sparkles className="w-3 h-3" />
                {tool.aiFeatureName}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {tool.features.slice(0, 3).map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 bg-slate-100 dark:bg-dark-surface text-xs text-slate-600 dark:text-slate-400 rounded-md"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-dark-border">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              AI Features Comparison
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare AI capabilities across project management tools
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-surface">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Tool
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    AI Feature
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Key Capabilities
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-dark-border">
                {PM_TOOLS.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${tool.color}20` }}
                        >
                          <Brain className="w-5 h-5" style={{ color: tool.color }} />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {tool.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
                      >
                        <Sparkles className="w-3 h-3" />
                        {tool.aiFeatureName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {tool.features.slice(0, 2).map((feature) => (
                          <span
                            key={feature}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-dark-surface text-xs text-slate-600 dark:text-slate-400 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {tool.features.length > 2 && (
                          <span className="px-2 py-0.5 text-xs text-slate-500">
                            +{tool.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        View Prompts
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
