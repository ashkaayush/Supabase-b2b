import { createClient } from '@/lib/supabase/server'
import { UserService } from '@/services/user.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }

  try {
    const supabase = createClient()
    const userService = new UserService(supabase)

    const users = await userService.searchUsers(query)

    return NextResponse.json(users)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
