'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string | null
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setLoading(false)
        return
      }

      setUserId(session.user.id)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from('profiles') as any)
        .select('id, email, full_name, avatar_url, role')
        .eq('id', session.user.id)
        .maybeSingle()

      if (data) {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const updateRole = useCallback(async (role: string) => {
    if (!userId) return false
    const supabase = createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('profiles') as any)
      .update({ role })
      .eq('id', userId)

    if (!error) {
      setProfile(prev => prev ? { ...prev, role } : null)
      return true
    }
    return false
  }, [userId])

  return { profile, loading, userId, updateRole, needsRole: !loading && !!userId && profile?.role === null }
}
