import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { PostService } from '@/services/post.service'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const postService = new PostService(supabase)

    const post = await postService.getPostById(params.id)

    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const supabase = createClient()
    const body = await request.json()

    const postService = new PostService(supabase)
    const post = await postService.updatePost(params.id, body)

    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const supabase = createClient()

    const postService = new PostService(supabase)
    await postService.deletePost(params.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
