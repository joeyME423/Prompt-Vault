'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface AuthState {
  userId: string | null
  teamId: string | null
  isLoggedIn: boolean
  isAdmin: boolean
  authChecked: boolean
}

export function useAuth(): AuthState {
  const [userId, setUserId] = useState<string | null>(null)
  const [teamId, setTeamId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setUserId(session.user.id)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: membership } = await (supabase.from('team_members') as any)
          .select('team_id, role')
          .eq('user_id', session.user.id)
          .limit(1)
          .maybeSingle()

        if (membership) {
          setTeamId(membership.team_id)

          // Check if user is admin via team_members role
          if (membership.role === 'owner' || membership.role === 'admin') {
            setIsAdmin(true)
          } else {
            // Also check if user is the team owner
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: team } = await (supabase.from('teams') as any)
              .select('owner_id')
              .eq('id', membership.team_id)
              .maybeSingle()

            if (team && team.owner_id === session.user.id) {
              setIsAdmin(true)
            }
          }
        }
      }
      setAuthChecked(true)
    }
    checkAuth()
  }, [])

  return { userId, teamId, isLoggedIn: !!userId, isAdmin, authChecked }
}
