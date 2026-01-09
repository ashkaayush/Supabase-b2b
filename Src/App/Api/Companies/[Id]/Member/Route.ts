import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/utils/auth'
import { CompanyService } from '@/services/company.service'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    const supabase = createClient()
    const { user_id, role } = await request.json()

    const companyService = new CompanyService(supabase)
    const member = await companyService.addMember(params.id, user_id, role)

    return NextResponse.json(member, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    const supabase = createClient()
    const { user_id } = await request.json()

    const companyService = new CompanyService(supabase)
    await companyService.removeMember(params.id, user_id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
