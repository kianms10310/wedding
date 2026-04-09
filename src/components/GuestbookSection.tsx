import { useState, useEffect } from 'react'
import { useScrollFadeIn } from '../hooks/useScrollFadeIn'
import { getSupabase } from '../lib/supabase'
import type { GuestbookEntry } from '../lib/supabase'

const serif = "'Noto Serif KR', serif"

function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return '방금 전'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  return `${Math.floor(h / 24)}일 전`
}

export default function GuestbookSection() {
  const { ref, visible } = useScrollFadeIn()
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const { data } = await getSupabase().from('guestbook').select('*').order('created_at', { ascending: false })
      if (data) setEntries(data)
    } catch { /* */ }
  }

  useEffect(() => { load() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    setLoading(true)
    try {
      const { error } = await getSupabase().from('guestbook').insert([{ name: name.trim(), message: msg.trim() }])
      if (!error) { setName(''); setMsg(''); load() }
    } catch { /* */ } finally { setLoading(false) }
  }

  return (
    <section ref={ref} className={`scroll-fade ${visible ? 'visible' : ''}`} style={{ padding: '64px 24px', background: '#FAF8F5' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: '#3D3D3D', marginBottom: 8 }}>축하 메시지</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #B8956A)' }} />
          <span style={{ color: '#B8956A', fontSize: 10 }}>◆</span>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #B8956A)' }} />
        </div>
      </div>

      <form onSubmit={submit} style={{
        background: '#fff', borderRadius: 16, padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 24,
      }}>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="이름" required
          style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #E0D8D0', outline: 'none', fontSize: 13, color: '#3D3D3D', background: 'transparent', marginBottom: 12 }} />
        <textarea value={msg} onChange={e => setMsg(e.target.value)}
          placeholder="축하의 말씀을 남겨주세요" required rows={3}
          style={{ width: '100%', padding: 12, border: '1px solid #E0D8D0', borderRadius: 12, outline: 'none', fontSize: 13, color: '#3D3D3D', resize: 'none', background: '#FAF8F5', lineHeight: 1.6, marginBottom: 12 }} />
        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '12px 0', borderRadius: 24, border: 'none', cursor: 'pointer',
          background: '#D4A0A0', color: '#fff', fontSize: 13, fontWeight: 500, opacity: loading ? 0.5 : 1,
        }}>{loading ? '등록 중...' : '메시지 남기기'}</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {entries.length === 0 && <p style={{ textAlign: 'center', fontSize: 13, color: '#999', padding: 20 }}>첫 번째 축하 메시지를 남겨보세요 ♡</p>}
        {entries.map((e, i) => (
          <div key={e.id} style={{
            background: i % 2 === 0 ? '#fff' : '#F7F3EE', borderRadius: 12, padding: '16px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#3D3D3D' }}>{e.name}</span>
              <span style={{ fontSize: 10, color: '#B8B0A8' }}>{e.created_at ? timeAgo(e.created_at) : ''}</span>
            </div>
            <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{e.message}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
