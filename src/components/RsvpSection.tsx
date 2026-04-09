import { useState } from 'react'
import { useScrollFadeIn } from '../hooks/useScrollFadeIn'
import { getSupabase } from '../lib/supabase'

const serif = "'Noto Serif KR', serif"
const pill = (on: boolean): React.CSSProperties => ({
  flex: 1, padding: '10px 0', borderRadius: 24, border: 'none', cursor: 'pointer',
  fontSize: 13, fontWeight: 400, transition: 'all 0.2s',
  background: on ? '#D4A0A0' : '#F0EBE3', color: on ? '#fff' : '#6B6B6B',
})

export default function RsvpSection() {
  const { ref, visible } = useScrollFadeIn()
  const [f, setF] = useState({ name: '', side: 'groom', att: true, count: 1, msg: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.name.trim()) return
    setLoading(true)
    try {
      const sb = getSupabase()
      const { error } = await sb.from('rsvps').insert([{
        name: f.name.trim(), side: f.side, attendance: f.att,
        guest_count: f.count, message: f.msg || null,
      }])
      if (!error) { setDone(true); setTimeout(() => setDone(false), 4000); setF({ name: '', side: 'groom', att: true, count: 1, msg: '' }) }
    } catch { /* */ } finally { setLoading(false) }
  }

  if (done) return (
    <section style={{ padding: '80px 24px', textAlign: 'center', background: '#F7F3EE' }}>
      <div style={{ fontSize: 40, marginBottom: 16, color: '#D4A0A0' }}>✓</div>
      <p style={{ fontFamily: serif, fontSize: 18, color: '#3D3D3D', marginBottom: 8 }}>감사합니다</p>
      <p style={{ fontSize: 13, color: '#999' }}>참석 여부가 전달되었습니다.</p>
    </section>
  )

  return (
    <section ref={ref} className={`scroll-fade ${visible ? 'visible' : ''}`} style={{ padding: '64px 24px', background: '#F7F3EE' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: '#3D3D3D', marginBottom: 8 }}>참석 여부</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #B8956A)' }} />
          <span style={{ color: '#B8956A', fontSize: 10 }}>◆</span>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #B8956A)' }} />
        </div>
        <p style={{ fontSize: 12, color: '#999' }}>축하의 마음으로 참석 여부를 알려주세요</p>
      </div>

      <form onSubmit={submit} style={{
        background: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div>
          <label style={{ fontSize: 11, color: '#B8956A', display: 'block', marginBottom: 8 }}>성함</label>
          <input type="text" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))}
            placeholder="이름을 입력해주세요" required
            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #E0D8D0', outline: 'none', fontSize: 14, color: '#3D3D3D', background: 'transparent' }} />
        </div>

        <div>
          <label style={{ fontSize: 11, color: '#B8956A', display: 'block', marginBottom: 8 }}>구분</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => setF(p => ({ ...p, side: 'groom' }))} style={pill(f.side === 'groom')}>신랑측</button>
            <button type="button" onClick={() => setF(p => ({ ...p, side: 'bride' }))} style={pill(f.side === 'bride')}>신부측</button>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, color: '#B8956A', display: 'block', marginBottom: 8 }}>참석 여부</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => setF(p => ({ ...p, att: true }))} style={pill(f.att)}>참석합니다</button>
            <button type="button" onClick={() => setF(p => ({ ...p, att: false }))} style={pill(!f.att)}>불참합니다</button>
          </div>
        </div>

        {f.att && (
          <div>
            <label style={{ fontSize: 11, color: '#B8956A', display: 'block', marginBottom: 8 }}>동행 인원 (본인 포함)</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, background: '#FAF8F5', borderRadius: 12, padding: '10px 0' }}>
              <button type="button" onClick={() => setF(p => ({ ...p, count: Math.max(1, p.count - 1) }))}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E0D8D0', background: '#fff', cursor: 'pointer', fontSize: 16, color: '#B8956A' }}>−</button>
              <span style={{ fontSize: 18, fontWeight: 400, color: '#3D3D3D', width: 24, textAlign: 'center' }}>{f.count}</span>
              <button type="button" onClick={() => setF(p => ({ ...p, count: Math.min(5, p.count + 1) }))}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #E0D8D0', background: '#fff', cursor: 'pointer', fontSize: 16, color: '#B8956A' }}>+</button>
            </div>
          </div>
        )}

        <div>
          <label style={{ fontSize: 11, color: '#B8956A', display: 'block', marginBottom: 8 }}>축하 메시지 (선택)</label>
          <textarea value={f.msg} onChange={e => setF(p => ({ ...p, msg: e.target.value }))}
            placeholder="한마디 남겨주세요" rows={3}
            style={{ width: '100%', padding: 12, border: '1px solid #E0D8D0', borderRadius: 12, outline: 'none', fontSize: 13, color: '#3D3D3D', resize: 'none', background: '#FAF8F5', lineHeight: 1.6 }} />
        </div>

        <button type="submit" disabled={loading || !f.name.trim()} style={{
          width: '100%', padding: '14px 0', borderRadius: 24, border: 'none', cursor: 'pointer',
          background: '#D4A0A0', color: '#fff', fontSize: 14, fontWeight: 500,
          opacity: loading || !f.name.trim() ? 0.5 : 1, transition: 'all 0.2s',
        }}>{loading ? '전송 중...' : '참석 여부 전달'}</button>
      </form>
    </section>
  )
}
