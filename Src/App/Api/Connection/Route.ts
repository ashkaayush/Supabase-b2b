import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { ConnectionService } from '@/services/connection.service'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = createClient()

    const connectionService = new ConnectionService(supabase)
    const connections = await connectionService.getConnections(user.id)

    return NextResponse.json(connections)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
