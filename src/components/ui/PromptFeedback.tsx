'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { posthog } from '@/lib/posthog'

interface PromptFeedbackProps {
  promptId: string
  userId: string | null
  onFeedback?: (helpful: boolean) => void
}

export function PromptFeedback({ promptId, userId, onFeedback }: PromptFeedbackProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleFeedback = async (helpful: boolean) => {
    if (submitting || submitted) return
    setSubmitting(true)

    try {
      if (userId) {
        const supabase = createClient()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('prompt_feedback') as any)
          .upsert({ prompt_id: promptId, user_id: userId, helpful }, { onConflict: 'prompt_id,user_id' })
      }

      posthog.capture('prompt_feedback', { prompt_id: promptId, helpful })
      onFeedback?.(helpful)
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting feedback:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <span className="text-xs text-apple-blue font-medium animate-fade-in">
        Thanks for the feedback!
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2 animate-fade-in">
      <span className="text-xs text-apple-gray-400 dark:text-slate-400">Helpful?</span>
      <button
        onClick={() => handleFeedback(true)}
        disabled={submitting}
        className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-500/10 text-apple-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50"
        aria-label="Yes, helpful"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => handleFeedback(false)}
        disabled={submitting}
        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-500/10 text-apple-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
        aria-label="Not helpful"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
