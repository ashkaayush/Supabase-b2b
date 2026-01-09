import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database.types'

export class ConnectionService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async sendConnectionRequest(requesterId: string, receiverId: string, note?: string) {
    const { data, error } = await this.supabase
      .from('connections')
      .insert({
        requester_id: requesterId,
        receiver_id: receiverId,
        note,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async acceptConnection(connectionId: string) {
    const { data, error } = await this.supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async removeConnection(connectionId: string) {
    const { error } = await this.supabase
      .from('connections')
      .delete()
      .eq('id', connectionId)

    if (error) throw error
  }

  async getConnections(userId: string) {
    const { data, error } = await this.supabase
      .from('connections')
      .select(`
        *,
        requester:users!connections_requester_id_fkey(id, username, full_name, avatar_url, headline),
        receiver:users!connections_receiver_id_fkey(id, username, full_name, avatar_url, headline)
      `)
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted')

    if (error) throw error
    return data
  }

  async getPendingRequests(userId: string) {
    const { data, error } = await this.supabase
      .from('connections')
      .select(`
        *,
        requester:users!connections_requester_id_fkey(id, username, full_name, avatar_url, headline)
      `)
      .eq('receiver_id', userId)
      .eq('status', 'pending')

    if (error) throw error
    return data
  }
}
