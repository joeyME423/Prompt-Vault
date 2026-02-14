'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { HeroPromptBuilder } from '@/components/landing/HeroPromptBuilder'
import { HeroPromptPreview } from '@/components/landing/HeroPromptPreview'

export function Hero() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  })

  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-purple/10 to-accent-pink/10 dark:from-primary-500/5 dark:via-accent-purple/5 dark:to-accent-pink/5" />

      {/* Animated background shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact headline - centered above the two columns */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/20 mb-6">
            <Zap className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              100+ Curated Prompts for PMs
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4">
            Create & Discover{' '}
            <span className="gradient-text">PM Prompts</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Build AI prompts for project management in seconds.
            Try it below — your prompt updates in real time.
          </p>
        </div>

        {/* Two-column interactive area */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Builder */}
          <div className="order-2 lg:order-1 animate-slide-in-left">
            <HeroPromptBuilder formData={formData} setFormData={setFormData} />
          </div>

          {/* Right: Live Preview */}
          <div className="order-1 lg:order-2 animate-slide-in-right">
            <HeroPromptPreview
              title={formData.title}
              content={formData.content}
              category={formData.category}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
