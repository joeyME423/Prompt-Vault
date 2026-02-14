export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          content: string
          category: string
          tags: string[]
          author_id: string | null
          team_id: string | null
          is_public: boolean
          use_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          content: string
          category: string
          tags?: string[]
          author_id?: string | null
          team_id?: string | null
          is_public?: boolean
          use_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          content?: string
          category?: string
          tags?: string[]
          author_id?: string | null
          team_id?: string | null
          is_public?: boolean
          use_count?: number
        }
      }
      saved_prompts: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          folder_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          folder_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          folder_id?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      community_submissions: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          category: string
          tags: string[]
          submitter_email: string
          status: string
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          category: string
          tags?: string[]
          submitter_email: string
          status?: string
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          category?: string
          tags?: string[]
          submitter_email?: string
          status?: string
          reviewed_at?: string | null
          created_at?: string
        }
      }
      prompt_ratings: {
        Row: {
          id: string
          prompt_id: string
          user_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          user_id: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          user_id?: string
          rating?: number
          created_at?: string
        }
      }
      prompt_folders: {
        Row: {
          id: string
          name: string
          user_id: string
          team_id: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          team_id?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          team_id?: string | null
          color?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Prompt = Database['public']['Tables']['prompts']['Row']
export type SavedPrompt = Database['public']['Tables']['saved_prompts']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Team = Database['public']['Tables']['teams']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type CommunitySubmission = Database['public']['Tables']['community_submissions']['Row']
export type PromptRating = Database['public']['Tables']['prompt_ratings']['Row']
export type PromptFolder = Database['public']['Tables']['prompt_folders']['Row']
