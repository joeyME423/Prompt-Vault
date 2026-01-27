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
          is_public?: boolean
          use_count?: number
        }
      }
      saved_prompts: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
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
