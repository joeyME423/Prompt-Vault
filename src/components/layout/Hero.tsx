'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Users, BookOpen } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-purple/10 to-accent-pink/10 dark:from-primary-500/5 dark:via-accent-purple/5 dark:to-accent-pink/5" />

      {/* Animated background shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/20 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              100+ Curated Prompts for PMs
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 animate-slide-up">
            Supercharge Your PM Workflow{' '}
            <span className="gradient-text">with AI Prompts</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover battle-tested AI prompts designed specifically for project managers.
            Save time, improve communication, and deliver projects faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/library" className="btn-primary flex items-center gap-2 text-lg">
              Explore Library
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/auth/signup" className="btn-secondary flex items-center gap-2 text-lg">
              Start Free Trial
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-slate-900 dark:text-white mb-1">
                <BookOpen className="w-6 h-6 text-primary-500" />
                100+
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">PM Prompts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-slate-900 dark:text-white mb-1">
                <Users className="w-6 h-6 text-accent-purple" />
                5K+
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-slate-900 dark:text-white mb-1">
                <Zap className="w-6 h-6 text-accent-pink" />
                50K+
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Prompts Used</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
