import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { ConnectionService } from '@/services/connection.service'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    await requireAuth()
    const supabase = createClient()
    const { connection_id } = await request.json()

    const connectionService = new ConnectionService(supabase)
    const connection = await connectionService.acceptConnection(connection_id)

    return NextResponse.json(connection)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
