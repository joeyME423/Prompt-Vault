'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAuthState() {
  const [userId, setUserId] = useState<string | null>(null)
  const [teamId, setTeamId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setUserId(session.user.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: membership } = await (supabase.from('team_members') as any)
          .select('team_id')
          .eq('user_id', session.user.id)
          .limit(1)
          .maybeSingle()

        if (membership) {
          setTeamId(membership.team_id)
        }
      }
      setAuthChecked(true)
    }
    checkAuth()
  }, [])

  return { userId, teamId, authChecked, isLoggedIn: !!userId }
}
