import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { FollowService } from '@/services/follow.service'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = createClient()
    const { following_id } = await request.json()

    const followService = new FollowService(supabase)
    const follow = await followService.followUser(user.id, following_id)

    return NextResponse.json(follow, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = createClient()
    const { following_id } = await request.json()

    const followService = new FollowService(supabase)
    await followService.unfollowUser(user.id, following_id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
