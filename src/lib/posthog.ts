import posthog from 'posthog-js'

export const POSTHOG_KEY = 'phc_r9m0W1jLzEFVUI32GYySk2lBiQNIIzmSy3z2Mto9Y2J'
export const POSTHOG_HOST = 'https://us.i.posthog.com'

export function initPostHog() {
  if (typeof window === 'undefined') return
  if (posthog.__loaded) return

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false, // we handle manually in provider
    capture_pageleave: true,
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') {
        ph.debug()
      }
    },
  })
}

export { posthog }
