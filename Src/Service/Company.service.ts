import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database.types'

type Company = Database['public']['Tables']['companies']['Row']
type CompanyInsert = Database['public']['Tables']['companies']['Insert']

export class CompanyService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async createCompany(company: CompanyInsert) {
    const { data, error } = await this.supabase
      .from('companies')
      .insert(company)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getCompanyById(id: string) {
    const { data, error } = await this.supabase
      .from('companies')
      .select(`
        *,
        creator:users!companies_created_by_fkey(id, username, full_name, avatar_url),
        company_members(
          id,
          role,
          user:users(id, username, full_name, avatar_url, headline)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async addMember(companyId: string, userId: string, role: 'owner' | 'employee') {
    const { data, error } = await this.supabase
      .from('company_members')
      .insert({
        company_id: companyId,
        user_id: userId,
        role
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async removeMember(companyId: string, userId: string) {
    const { error } = await this.supabase
      .from('company_members')
      .delete()
      .eq('company_id', companyId)
      .eq('user_id', userId)

    if (error) throw error
  }

  async getUserCompanies(userId: string) {
    const { data, error } = await this.supabase
      .from('company_members')
      .select(`
        role,
        company:companies(*)
      `)
      .eq('user_id', userId)

    if (error) throw error
    return data
  }
}
