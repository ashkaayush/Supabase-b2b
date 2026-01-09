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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          headline: string | null
          bio: string | null
          avatar_url: string | null
          role: string | null
          is_verified: boolean
          created_at: string
          last_active_at: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          username?: string | null
          headline?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: string | null
          is_verified?: boolean
          created_at?: string
          last_active_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          headline?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: string | null
          is_verified?: boolean
          created_at?: string
          last_active_at?: string | null
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          domain: string | null
          logo_url: string | null
          description: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          logo_url?: string | null
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          logo_url?: string | null
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          content: string
          post_type: string
          visibility: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          content: string
          post_type: string
          visibility?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          content?: string
          post_type?: string
          visibility?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types as needed
    }
  }
}
