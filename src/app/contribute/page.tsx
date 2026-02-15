'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Send, Sparkles, Check, Plus, Library, Users, Globe } from 'lucide-react'
import { getToolBySlug } from '@/data/tools'
import { useAuthState } from '@/hooks/useAuthState'
import { submitPrompt } from '@/lib/prompts/submitPrompt'
import { CATEGORIES } from '@/lib/constants'

const PM_TOOLS = [
  'Wrike',
  'Asana',
  'ClickUp',
  'Monday.com',
  'Smartsheet',
]

const EXAMPLE_PROMPT = `Example:
You are a project management assistant. Help me create a detailed project plan for [PROJECT_NAME].

Include:
- Project objectives and scope
- Key milestones and deliverables
- Timeline with dependencies
- Resource allocation
- Risk assessment

Format the output as a structured document with clear sections.`

interface FormData {
  title: string
  description: string
  content: string
  category: string
  tags: string
  pmTools: string[]
  email: string
}

interface FormErrors {
  title?: string
  description?: string
  content?: string
  category?: string
  email?: string
}

function ContributeForm() {
  const searchParams = useSearchParams()
  const toolSlug = searchParams?.get('tool') ?? null
  const preselectedTool = toolSlug ? getToolBySlug(toolSlug) : null

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    pmTools: preselectedTool ? [preselectedTool.name] : [],
    email: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { userId, teamId, authChecked } = useAuthState()

  // Update pmTools when preselectedTool changes
  useEffect(() => {
    if (preselectedTool) {
      setFormData((prev) => {
        if (!prev.pmTools.includes(preselectedTool.name)) {
          return { ...prev, pmTools: [preselectedTool.name] }
        }
        return prev
      })
    }
  }, [preselectedTool])

  const isLoggedIn = !!userId

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.content.trim()) newErrors.content = 'Prompt content is required'
    if (!formData.category) newErrors.category = 'Please select a category'
    if (!isLoggedIn && !formData.email.trim()) newErrors.email = 'Email is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const tagList = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
      const toolTags = formData.pmTools.map((tool) => `tool:${tool}`)
      const allTags = [...tagList, ...toolTags]

      await submitPrompt({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        tags: allTags,
        email: formData.email || undefined,
        userId,
        teamId,
      })

      setIsSuccess(true)
    } catch (error) {
      console.error('Error submitting prompt:', error)
      setSubmitError('Failed to submit prompt. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePmToolToggle = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      pmTools: prev.pmTools.includes(tool)
        ? prev.pmTools.filter((t) => t !== tool)
        : [...prev.pmTools, tool],
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: '',
      tags: '',
      pmTools: [],
      email: '',
    })
    setErrors({})
    setIsSuccess(false)
  }

  if (!authChecked) return null

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 text-center border border-apple-gray-200 dark:border-dark-border">
          <div className="w-16 h-16 bg-apple-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-apple-black dark:text-white mb-2">
            {isLoggedIn ? 'Prompt Added to Your Team!' : 'Submission Received!'}
          </h1>
          <p className="text-apple-gray-500 dark:text-slate-400 mb-8">
            {isLoggedIn
              ? 'Your prompt has been added to your team library.'
              : 'Thanks for contributing! Your prompt will be reviewed and, if approved, added to the Community Prompts section.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-apple-blue hover:bg-apple-blue-hover text-white rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Another
            </button>
            <Link
              href={isLoggedIn ? '/library' : '/community'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-apple-gray-50 dark:bg-dark-surface hover:bg-apple-gray-200 dark:hover:bg-dark-hover text-apple-black dark:text-white rounded-full transition-colors"
            >
              <Library className="w-5 h-5" />
              {isLoggedIn ? 'View Team Library' : 'Browse Community'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            preselectedTool ? '' : 'bg-apple-blue'
          }`}
          style={preselectedTool ? { backgroundColor: `${preselectedTool.color}20` } : undefined}
        >
          <Sparkles
            className="w-6 h-6"
            style={{ color: preselectedTool ? preselectedTool.color : 'white' }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-apple-black dark:text-white">
            {preselectedTool
              ? `Contribute a ${preselectedTool.name} Prompt`
              : 'Contribute a Prompt'}
          </h1>
          <p className="text-apple-gray-500 dark:text-slate-400">
            {preselectedTool
              ? `Optimized for ${preselectedTool.aiFeatureName}`
              : 'Share your expertise with the community'}
          </p>
        </div>
      </div>

      {/* Submission type banner */}
      {isLoggedIn ? (
        <div className="mb-6 p-4 rounded-xl bg-apple-blue/10 border border-apple-blue/20 flex items-center gap-3">
          <Users className="w-5 h-5 text-apple-blue-hover dark:text-apple-blue flex-shrink-0" />
          <p className="text-sm text-apple-blue-hover dark:text-apple-blue">
            This prompt will be added to <strong>your team&apos;s private library</strong>.
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
          <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="text-sm text-amber-700 dark:text-amber-300">
            <strong>Community submission</strong> — your prompt will be reviewed before appearing in the Community Prompts section.{' '}
            <Link href="/auth/signup" className="underline font-medium">Sign up</Link> to add prompts directly to your team.
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email (anonymous only) */}
        {!isLoggedIn && (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-apple-black dark:text-white mb-2"
            >
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 bg-white dark:bg-dark-card border rounded-xl text-apple-black dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 ${
                errors.email ? 'border-red-500' : 'border-apple-gray-200 dark:border-dark-border'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-apple-black dark:text-white mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Project Planning Assistant"
            className={`w-full px-4 py-3 bg-white dark:bg-dark-card border rounded-xl text-apple-black dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 ${
              errors.title ? 'border-red-500' : 'border-apple-gray-200 dark:border-dark-border'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-apple-black dark:text-white mb-2"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Briefly describe what this prompt does and when to use it..."
            rows={3}
            className={`w-full px-4 py-3 bg-white dark:bg-dark-card border rounded-xl text-apple-black dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 resize-none ${
              errors.description ? 'border-red-500' : 'border-apple-gray-200 dark:border-dark-border'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Prompt Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-apple-black dark:text-white mb-2"
          >
            Prompt Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder={EXAMPLE_PROMPT}
            rows={10}
            className={`w-full px-4 py-3 bg-white dark:bg-dark-card border rounded-xl text-apple-black dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 resize-none font-mono text-sm ${
              errors.content ? 'border-red-500' : 'border-apple-gray-200 dark:border-dark-border'
            }`}
          />
          {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-apple-black dark:text-white mb-2"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`w-full px-4 py-3 bg-white dark:bg-dark-card border rounded-xl text-apple-black dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue/50 ${
              errors.category ? 'border-red-500' : 'border-apple-gray-200 dark:border-dark-border'
            }`}
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-apple-black dark:text-white mb-2"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., planning, timeline, resources (comma separated)"
            className="w-full px-4 py-3 bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border rounded-xl text-apple-black dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue/50"
          />
          <p className="mt-1 text-sm text-apple-gray-400 dark:text-slate-400">
            Separate tags with commas
          </p>
        </div>

        {/* PM Tools */}
        <div>
          <label className="block text-sm font-medium text-apple-black dark:text-white mb-3">
            PM Tools (optional)
          </label>
          <div className="flex flex-wrap gap-3">
            {PM_TOOLS.map((tool) => (
              <label
                key={tool}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  formData.pmTools.includes(tool)
                    ? 'bg-apple-blue text-white'
                    : 'bg-apple-gray-50 dark:bg-dark-surface text-apple-gray-500 dark:text-slate-300 hover:bg-apple-gray-200 dark:hover:bg-dark-hover'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.pmTools.includes(tool)}
                  onChange={() => handlePmToolToggle(tool)}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    formData.pmTools.includes(tool)
                      ? 'border-white bg-white'
                      : 'border-apple-gray-400 dark:border-slate-500'
                  }`}
                >
                  {formData.pmTools.includes(tool) && (
                    <Check className="w-3 h-3 text-apple-blue" />
                  )}
                </span>
                {tool}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-apple-blue hover:bg-apple-blue-hover disabled:bg-apple-blue/50 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {isLoggedIn ? 'Add to Team Library' : 'Submit for Review'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function FormLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="animate-pulse">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-apple-gray-200 dark:bg-dark-surface rounded-xl" />
          <div>
            <div className="h-6 w-48 bg-apple-gray-200 dark:bg-dark-surface rounded mb-2" />
            <div className="h-4 w-64 bg-apple-gray-200 dark:bg-dark-surface rounded" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-12 bg-apple-gray-200 dark:bg-dark-surface rounded-xl" />
          <div className="h-24 bg-apple-gray-200 dark:bg-dark-surface rounded-xl" />
          <div className="h-48 bg-apple-gray-200 dark:bg-dark-surface rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function ContributePage() {
  return (
    <main className="min-h-screen pt-24 pb-8 px-4">
      <Suspense fallback={<FormLoading />}>
        <ContributeForm />
      </Suspense>
    </main>
  )
}
