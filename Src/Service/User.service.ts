import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database.types'

type User = Database['public']['Tables']['users']['Row']
type UserUpdate = Database['public']['Tables']['users']['Update']

export class UserService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getUserById(id: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async getUserByUsername(username: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) throw error
    return data
  }

  async updateUser(id: string, updates: UserUpdate) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async searchUsers(query: string, limit = 20) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, username, full_name, headline, avatar_url, is_verified')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(limit)

    if (error) throw error
    return data
  }

  async getFollowers(userId: string) {
    const { data, error } = await this.supabase
      .from('follows')
      .select(`
        follower_id,
        follower:users!follows_follower_id_fkey(id, username, full_name, avatar_url)
      `)
      .eq('following_id', userId)

    if (error) throw error
    return data
  }

  async getFollowing(userId: string) {
    const { data, error } = await this.supabase
      .from('follows')
      .select(`
        following_id,
        following:users!follows_following_id_fkey(id, username, full_name, avatar_url)
      `)
      .eq('follower_id', userId)

    if (error) throw error
    return data
  }
}
