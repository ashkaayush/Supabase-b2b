import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { PostService } from '@/services/post.service'
import { NextResponse } from 'next/server'

/*** GET /api/posts/:id */
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

/*** PATCH /api/posts/:id*/
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    const supabase = createClient()
    const body = await request.json()

    const postService = new PostService(supabase)
    const post = await postService.updatePost(params.id, body)

    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

/*** DELETE /api/posts/:id*/
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    const supabase = createClient()

    const postService = new PostService(supabase)
    await postService.deletePost(params.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

/*** POST /api/posts/:id/likes*/
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const supabase = createClient()

    const postService = new PostService(supabase)
    const like = await postService.likePost(params.id, user.id)

    return NextResponse.json(like, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
/*** GET /api/posts/:id/likes*/
export async function GET_LIKES(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const postService = new PostService(supabase)

    const likes = await postService.getPostLikes(params.id)
    return NextResponse.json(likes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

/*** DELETE /api/posts/:id/likes*/
export async function DELETE_LIKES(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const supabase = createClient()

    const postService = new PostService(supabase)
    await postService.unlikePost(params.id, user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
