import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { postSchema } from '@/lib/utils/validation'
import { PostService } from '@/services/post.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    const supabase = createClient()
    const user = await requireAuth()
    const postService = new PostService(supabase)

    const posts = await postService.getFeed(user.id, limit, offset)

    return NextResponse.json(posts)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = createClient()
    const body = await request.json()

    // Validate input
    const validatedData = postSchema.parse(body)

    const postService = new PostService(supabase)
    const post = await postService.createPost({
      author_id: user.id,
      ...validatedData
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
