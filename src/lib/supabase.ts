import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Missing Supabase env vars')
    _client = createClient(url, key)
  }
  return _client
}

export interface Rsvp {
  id?: number; name: string; side: 'groom' | 'bride'
  attendance: boolean; guest_count: number; message?: string; created_at?: string
}

export interface GuestbookEntry {
  id?: number; name: string; message: string; created_at?: string
}
