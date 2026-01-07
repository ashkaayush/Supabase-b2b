import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database.types'

type Post = Database['public']['Tables']['posts']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']

export class PostService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async createPost(post: PostInsert) {
    const { data, error } = await this.supabase
      .from('posts')
      .insert(post)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getPostById(id: string) {
    const { data, error } = await this.supabase
      .from('posts')
      .select(`
        *,
        author:users!posts_author_id_fkey(*),
        post_media(*),
        post_likes(count),
        comments(count)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async getFeed(userId: string, limit = 20, offset = 0) {
    const { data, error } = await this.supabase
      .from('posts')
      .select(`
        *,
        author:users!posts_author_id_fkey(*),
        post_media(*),
        post_likes(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data
  }
}
