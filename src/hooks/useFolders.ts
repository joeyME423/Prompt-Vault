'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PromptFolder } from '@/types'

const FOLDER_COLORS = [
  '#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316',
]

export function useFolders(userId: string | null) {
  const [folders, setFolders] = useState<PromptFolder[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFolders = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('prompt_folders') as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    setFolders(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  const createFolder = async (name: string, teamId?: string | null) => {
    if (!userId) return null
    const supabase = createClient()
    const color = FOLDER_COLORS[folders.length % FOLDER_COLORS.length]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('prompt_folders') as any)
      .insert({ name, user_id: userId, team_id: teamId || null, color })
      .select()
      .single()

    if (error) {
      console.error('Error creating folder:', error)
      return null
    }
    setFolders(prev => [...prev, data])
    return data as PromptFolder
  }

  const deleteFolder = async (folderId: string) => {
    const supabase = createClient()
    // Move saved prompts to "unsorted" (null folder_id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('saved_prompts') as any)
      .update({ folder_id: null })
      .eq('folder_id', folderId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('prompt_folders') as any)
      .delete()
      .eq('id', folderId)

    if (!error) {
      setFolders(prev => prev.filter(f => f.id !== folderId))
    }
  }

  const renameFolder = async (folderId: string, newName: string) => {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('prompt_folders') as any)
      .update({ name: newName })
      .eq('id', folderId)

    if (!error) {
      setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: newName } : f))
    }
  }

  const moveToFolder = async (savedPromptId: string, folderId: string | null) => {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('saved_prompts') as any)
      .update({ folder_id: folderId })
      .eq('id', savedPromptId)

    return !error
  }

  return { folders, loading, createFolder, deleteFolder, renameFolder, moveToFolder, refetch: fetchFolders }
}
