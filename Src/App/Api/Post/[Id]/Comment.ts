import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { commentSchema } from '@/lib/utils/validation'
import { PostService } from '@/services/post.service'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const postService = new PostService(supabase)

    const comments = await postService.getPostComments(params.id)

    return NextResponse.json(comments)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const supabase = createClient()
    const body = await request.json()

    // Validate input
    const validatedData = commentSchema.parse(body)

    const postService = new PostService(supabase)
    const comment = await postService.addComment(
      params.id,
      user.id,
      validatedData.content,
      validatedData.parent_comment_id
    )

    return NextResponse.json(comment, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
