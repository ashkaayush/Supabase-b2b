import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database.types'

export class FollowService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async followUser(followerId: string, followingId: string) {
    const { data, error } = await this.supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async unfollowUser(followerId: string, followingId: string) {
    const { error } = await this.supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)

    if (error) throw error
  }

  async isFollowing(followerId: string, followingId: string) {
    const { data, error } = await this.supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle()

    if (error) throw error
    return !!data
  }
}
