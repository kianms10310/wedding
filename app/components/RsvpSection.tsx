'use client'
import { useEffect, useRef, useState } from 'react'

const serif = "'Noto Serif KR', serif"
const hideTodayKey = 'wedding-rsvp-hidden-today'
const todayInKorea = () => new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date())

const pill = (on: boolean): React.CSSProperties => ({
  flex: 1, padding: '10px 0', borderRadius: 24, border: 'none', cursor: 'pointer',
  fontSize: 13, fontWeight: 400, transition: 'all 0.2s',
  background: on ? '#D4A0A0' : '#F0EBE3', color: on ? '#fff' : '#6B6B6B',
})

export default function RsvpSection() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousOverflow = useRef('')
  const [f, setF] = useState({ name: '', side: 'groom', att: true, count: 1, msg: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    try {
      if (localStorage.getItem(hideTodayKey) === todayInKorea()) return
    } catch {
      // 저장소 사용이 제한된 환경에서도 팝업은 표시합니다.
    }

    previousOverflow.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow.current
    }
  }, [])

  const closeDialog = () => dialogRef.current?.close()

  const hideForToday = () => {
    try {
      localStorage.setItem(hideTodayKey, todayInKorea())
    } catch {
      // 저장소 사용이 제한된 환경에서는 현재 팝업만 닫습니다.
    }
    closeDialog()
  }

  const onDialogClose = () => {
    if (dialogRef.current?.open) return
    document.body.style.overflow = previousOverflow.current
    setDone(false)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.name.trim()) return
    setLoading(true)
    setErrMsg('')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name.trim(),
          side: f.side,
          attendance: f.att,
          guest_count: f.count,
          message: f.msg || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        console.error('rsvp insert error:', err)
        setErrMsg('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
      } else {
        setDone(true)
        setF({ name: '', side: 'groom', att: true, count: 1, msg: '' })
      }
    } catch (err) {
      console.error('rsvp insert exception:', err)
      setErrMsg('서버 연결에 실패했습니다.')
    } finally { setLoading(false) }
  }

  return (
    <dialog ref={dialogRef} className="rsvp-dialog" onClose={onDialogClose} aria-labelledby="rsvp-dialog-title"
      onClick={e => {
        const bounds = e.currentTarget.getBoundingClientRect()
        if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) closeDialog()
      }}
      style={{
        width: 'calc(100% - 32px)', maxWidth: 432, maxHeight: 'min(85dvh, 760px)',
        margin: 'auto', padding: 24, border: 'none', borderRadius: 20,
        background: '#fff', boxShadow: '0 12px 40px rgba(0,0,0,0.16)', overflowY: 'auto',
      }}>
      <style>{`.rsvp-dialog::backdrop { background: rgba(40, 32, 32, 0.55); }`}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 id="rsvp-dialog-title" style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, color: '#3D3D3D' }}>참석 여부</h2>
        <button type="button" onClick={closeDialog} aria-label="팝업 닫기" style={{
          width: 32, height: 32, border: 'none', background: 'transparent', color: '#999', fontSize: 22, cursor: 'pointer',
        }}>×</button>
      </div>

      {done ? (
        <div style={{ padding: '32px 0 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16, color: '#D4A0A0' }}>✓</div>
          <p style={{ fontFamily: serif, fontSize: 18, color: '#3D3D3D', marginBottom: 8 }}>감사합니다</p>
          <p style={{ fontSize: 13, color: '#999' }}>참석 여부가 전달되었습니다.</p>
        </div>
      ) : <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontSize: 11, color: '#B8956A', display: 'block', marginBottom: 8 }}>성함</label>
          <input type="text" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))}
            placeholder="이름을 입력해주세요" required
            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #E0D8D0', outline: 'none', fontSize: 14, color: '#3D3D3D', background: 'transparent', boxSizing: 'border-box' }} />
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
            style={{ width: '100%', padding: 12, border: '1px solid #E0D8D0', borderRadius: 12, outline: 'none', fontSize: 13, color: '#3D3D3D', resize: 'none', background: '#FAF8F5', lineHeight: 1.6, boxSizing: 'border-box' }} />
        </div>

        <button type="submit" disabled={loading || !f.name.trim()} style={{
          width: '100%', padding: '14px 0', borderRadius: 24, border: 'none', cursor: 'pointer',
          background: '#D4A0A0', color: '#fff', fontSize: 14, fontWeight: 500,
          opacity: loading || !f.name.trim() ? 0.5 : 1, transition: 'all 0.2s',
        }}>{loading ? '전송 중...' : '참석 여부 전달'}</button>
        {errMsg && <p style={{ fontSize: 12, color: '#D4A0A0', marginTop: 12, textAlign: 'center' }}>{errMsg}</p>}
      </form>}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="button" onClick={hideForToday} style={{
          flex: 1, minWidth: 0, padding: '12px 4px', borderRadius: 24, border: '1px solid #E0D8D0',
          background: '#fff', color: '#6B6B6B', fontSize: 12, cursor: 'pointer',
        }}>오늘 하루 보지 않기</button>
        <button type="button" onClick={closeDialog} style={{
          flex: 1, minWidth: 0, padding: '12px 4px', borderRadius: 24, border: 'none',
          background: '#D4A0A0', color: '#fff', fontSize: 12, cursor: 'pointer',
        }}>닫기</button>
      </div>
    </dialog>
  )
}
