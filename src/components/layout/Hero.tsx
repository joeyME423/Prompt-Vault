'use client'

import { useState } from 'react'
import { HeroPromptBuilder } from '@/components/landing/HeroPromptBuilder'
import { HeroPromptPreview } from '@/components/landing/HeroPromptPreview'

export function Hero() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  })

  return (
    <section className="relative pt-32 pb-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact headline - centered above the two columns */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-sm font-medium text-apple-blue mb-4">
            100+ Curated Prompts for PMs
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-apple-black dark:text-white mb-6 tracking-tight">
            Create & Discover<br />
            <span className="text-apple-blue">PM Prompts</span>
          </h1>

          <p className="text-lg text-apple-gray-500 dark:text-apple-gray-400 max-w-2xl mx-auto">
            Build AI prompts for project management in seconds.
            Try it below — your prompt updates in real time.
          </p>
        </div>

        {/* Two-column interactive area */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Builder */}
          <div className="order-2 lg:order-1 animate-slide-up">
            <HeroPromptBuilder formData={formData} setFormData={setFormData} />
          </div>

          {/* Right: Live Preview */}
          <div className="order-1 lg:order-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
