'use client'

import { useState } from 'react'
import { Send, Check, ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { useAuthState } from '@/hooks/useAuthState'
import { submitPrompt } from '@/lib/prompts/submitPrompt'
import { CATEGORIES } from '@/lib/constants'

interface HeroPromptBuilderProps {
  formData: { title: string; content: string; category: string }
  setFormData: React.Dispatch<React.SetStateAction<{ title: string; content: string; category: string }>>
}

export function HeroPromptBuilder({ formData, setFormData }: HeroPromptBuilderProps) {
  const { userId, teamId, isLoggedIn, authChecked } = useAuthState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showEmailField, setShowEmailField] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      setError('Please fill in all fields')
      return
    }

    // Anonymous users need email
    if (!isLoggedIn && !showEmailField) {
      setShowEmailField(true)
      return
    }

    if (!isLoggedIn && !email.trim()) {
      setError('Please enter your email')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await submitPrompt({
        title: formData.title,
        description: formData.content.slice(0, 100) + '...',
        content: formData.content,
        category: formData.category,
        tags: [formData.category.toLowerCase()],
        email: email || undefined,
        userId,
        teamId,
      })
      setIsSuccess(true)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', content: '', category: '' })
    setEmail('')
    setShowEmailField(false)
    setIsSuccess(false)
    setError('')
  }

  if (isSuccess) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {isLoggedIn ? 'Added to Your Team!' : 'Submitted for Review!'}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {isLoggedIn
            ? 'Your prompt is now in your team library.'
            : 'We\'ll review your prompt and add it to the community.'}
        </p>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors text-sm"
        >
          Create Another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 lg:p-8 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Create a Prompt
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Build your PM prompt and see it come alive
        </p>
      </div>

      {/* Title */}
      <div>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Sprint Planning Assistant"
          className="w-full px-4 py-3 bg-white/80 dark:bg-dark-card/80 border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
        />
      </div>

      {/* Category Chips */}
      <div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, category: prev.category === cat ? '' : cat }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                formData.category === cat
                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/25'
                  : 'bg-white/60 dark:bg-dark-surface/60 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-dark-hover border border-slate-200/50 dark:border-dark-border/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="You are a project management assistant. Help me..."
          rows={5}
          className="w-full px-4 py-3 bg-white/80 dark:bg-dark-card/80 border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none font-mono text-sm"
        />
      </div>

      {/* Email field (slides in for anonymous users) */}
      {showEmailField && !isLoggedIn && (
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Enter your email so we can notify you when it&apos;s approved
            </span>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-white/80 dark:bg-dark-card/80 border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
            autoFocus
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !authChecked}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors text-sm"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {showEmailField ? 'Submit for Review' : isLoggedIn ? 'Add to Team' : 'Share Prompt'}
            </>
          )}
        </button>

        <Link
          href="/contribute"
          className="text-xs text-slate-400 hover:text-primary-500 transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          Full form <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </form>
  )
}
