import { NextResponse } from 'next/server'
import { getSupabase } from '../../lib/supabase-server'

export async function GET() {
  try {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, message } = body

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'name and message are required' }, { status: 400 })
    }

    const sb = getSupabase()
    const { data, error } = await sb
      .from('guestbook')
      .insert({ name: name.trim(), message: message.trim() })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
