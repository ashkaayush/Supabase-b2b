import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:users!posts_author_id_fkey(*),
      post_media(*),
      post_likes(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      ...body
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
