import { createClient } from '@/lib/supabase/server'
import { UserService } from '@/services/user.service'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const userService = new UserService(supabase)

    const user = await userService.getUserById(params.id)

    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
}
