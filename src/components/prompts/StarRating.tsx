'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface StarRatingProps {
  promptId: string
  userId: string | null
  averageRating: number
  totalRatings: number
  userRating: number | null
}

export function StarRating({ promptId, userId, averageRating, totalRatings, userRating }: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0)
  const [currentUserRating, setCurrentUserRating] = useState(userRating)
  const [currentAverage, setCurrentAverage] = useState(averageRating)
  const [currentTotal, setCurrentTotal] = useState(totalRatings)
  const [submitting, setSubmitting] = useState(false)

  const handleRate = async (rating: number) => {
    if (!userId || submitting) return

    setSubmitting(true)
    const supabase = createClient()

    try {
      if (currentUserRating) {
        // Update existing rating
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('prompt_ratings') as any)
          .update({ rating })
          .eq('prompt_id', promptId)
          .eq('user_id', userId)

        // Recalculate average
        const newTotal = currentTotal
        const newAverage = (currentAverage * newTotal - currentUserRating + rating) / newTotal
        setCurrentAverage(newAverage)
      } else {
        // Insert new rating
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('prompt_ratings') as any)
          .insert({ prompt_id: promptId, user_id: userId, rating })

        // Recalculate average
        const newTotal = currentTotal + 1
        const newAverage = (currentAverage * currentTotal + rating) / newTotal
        setCurrentAverage(newAverage)
        setCurrentTotal(newTotal)
      }
      setCurrentUserRating(rating)
    } catch (error) {
      console.error('Error rating prompt:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const displayRating = hoveredStar || currentUserRating || 0

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => userId ? setHoveredStar(star) : null}
            onMouseLeave={() => setHoveredStar(0)}
            disabled={!userId || submitting}
            className={`p-0.5 transition-colors ${userId ? 'cursor-pointer' : 'cursor-default'}`}
            title={userId ? `Rate ${star} star${star !== 1 ? 's' : ''}` : 'Log in to rate'}
          >
            <Star
              className={`w-4 h-4 ${
                star <= displayRating
                  ? 'text-amber-400 fill-amber-400'
                  : star <= Math.round(currentAverage)
                    ? 'text-amber-400/40 fill-amber-400/40'
                    : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {currentAverage > 0 ? currentAverage.toFixed(1) : 'No ratings'}{' '}
        {currentTotal > 0 && `(${currentTotal})`}
      </span>
    </div>
  )
}
