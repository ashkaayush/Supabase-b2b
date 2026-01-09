import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { userProfileSchema } from '@/lib/utils/validation'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = createClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = createClient()
    const body = await request.json()

    // Validate input
    const validatedData = userProfileSchema.parse(body)

    const { data, error } = await supabase
      .from('users')
      .update(validatedData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
