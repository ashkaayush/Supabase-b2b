import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database.types'

type Post = Database['public']['Tables']['posts']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']
type PostUpdate = Database['public']['Tables']['posts']['Update']

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
        author:users!posts_author_id_fkey(id, username, full_name, avatar_url, headline),
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
        author:users!posts_author_id_fkey(id, username, full_name, avatar_url, headline, is_verified),
        post_media(*),
        post_likes(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data
  }

  async updatePost(id: string, updates: PostUpdate) {
    const { data, error } = await this.supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deletePost(id: string) {
    const { error } = await this.supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async likePost(postId: string, userId: string) {
    const { data, error } = await this.supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async unlikePost(postId: string, userId: string) {
    const { error } = await this.supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) throw error
  }

  async getPostLikes(postId: string) {
    const { data, error } = await this.supabase
      .from('post_likes')
      .select(`
        user:users(id, username, full_name, avatar_url)
      `)
      .eq('post_id', postId)

    if (error) throw error
    return data
  }

  async addComment(postId: string, authorId: string, content: string, parentCommentId?: string) {
    const { data, error } = await this.supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: authorId,
        content,
        parent_comment_id: parentCommentId
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getPostComments(postId: string) {
    const { data, error } = await this.supabase
      .from('comments')
      .select(`
        *,
        author:users!comments_author_id_fkey(id, username, full_name, avatar_url),
        comment_upvotes(count)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  }
}
