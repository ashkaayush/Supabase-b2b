import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { connectionRequestSchema } from '@/lib/utils/validation'
import { ConnectionService } from '@/services/connection.service'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = createClient()
    const body = await request.json()

    // Validate input
    const validatedData = connectionRequestSchema.parse(body)

    const connectionService = new ConnectionService(supabase)
    const connection = await connectionService.sendConnectionRequest(
      user.id,
      validatedData.receiver_id,
      validatedData.note
    )

    return NextResponse.json(connection, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
