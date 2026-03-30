'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'

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
    const supabase = createClient()

    const processSession = async (session: Session | null) => {
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

          if (membership.role === 'owner' || membership.role === 'admin') {
            setIsAdmin(true)
          } else {
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
      } else {
        setUserId(null)
        setTeamId(null)
        setIsAdmin(false)
      }
      setAuthChecked(true)
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      processSession(session)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      processSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { userId, teamId, isLoggedIn: !!userId, isAdmin, authChecked }
}
