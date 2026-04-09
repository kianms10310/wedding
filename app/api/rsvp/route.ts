import { NextResponse } from 'next/server'
import { getSupabase } from '../../lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, side, attendance, guest_count, message } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }
    if (!['groom', 'bride'].includes(side)) {
      return NextResponse.json({ error: 'side must be groom or bride' }, { status: 400 })
    }

    const sb = getSupabase()
    const { data, error } = await sb
      .from('rsvps')
      .insert({
        name: name.trim(),
        side,
        attendance: attendance ?? true,
        guest_count: guest_count ?? 1,
        message: message || null,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
