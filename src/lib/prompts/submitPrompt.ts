import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type PromptInsert = Database['public']['Tables']['prompts']['Insert']
type CommunityInsert = Database['public']['Tables']['community_submissions']['Insert']

interface SubmitPromptParams {
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  email?: string
  userId?: string | null
  teamId?: string | null
}

export async function submitPrompt(params: SubmitPromptParams): Promise<void> {
  const supabase = createClient()
  const isLoggedIn = !!params.userId && !!params.teamId

  if (isLoggedIn) {
    const promptData: PromptInsert = {
      title: params.title.trim(),
      description: params.description.trim(),
      content: params.content.trim(),
      category: params.category,
      tags: params.tags,
      author_id: params.userId!,
      team_id: params.teamId!,
      is_public: false,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('prompts') as any).insert(promptData)
    if (error) throw error
  } else {
    const submissionData: CommunityInsert = {
      title: params.title.trim(),
      description: params.description.trim(),
      content: params.content.trim(),
      category: params.category,
      tags: params.tags,
      submitter_email: params.email?.trim() || '',
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('community_submissions') as any).insert(submissionData)
    if (error) throw error
  }
}
