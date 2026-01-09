import { createClient } from '@/lib/supabase/server'
import { CompanyService } from '@/services/company.service'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const companyService = new CompanyService(supabase)

    const company = await companyService.getCompanyById(params.id)

    return NextResponse.json(company)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
}
