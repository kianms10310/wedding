'use client'
import { useScrollFadeIn } from '../hooks/useScrollFadeIn'
const serif = "'Noto Serif KR', serif"

export default function CalendarSection() {
  const { ref, visible } = useScrollFadeIn()
  const firstDay = new Date(2026, 4, 1).getDay()
  const daysInMonth = 31
  const weeks: (number | null)[][] = []
  let day = 1
  for (let w = 0; w < 6 && day <= daysInMonth; w++) {
    const week: (number | null)[] = []
    for (let d = 0; d < 7; d++) {
      if (w === 0 && d < firstDay) week.push(null)
      else if (day > daysInMonth) week.push(null)
      else week.push(day++)
    }
    weeks.push(week)
  }

  return (
    <section ref={ref} className={`scroll-fade ${visible ? 'visible' : ''}`}
      style={{ padding: '64px 24px', background: '#FAF8F5', textAlign: 'center' }}>
      <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: '#3D3D3D', marginBottom: 8 }}>예식 일정</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #B8956A)' }} />
        <span style={{ color: '#B8956A', fontSize: 10 }}>◆</span>
        <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #B8956A)' }} />
      </div>

      <p style={{ fontFamily: serif, fontSize: 16, color: '#6B6B6B', marginBottom: 20, fontWeight: 300 }}>2026년 5월</p>

      <div style={{ background: '#fff', borderRadius: 16, padding: '20px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', maxWidth: 360, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
          {['일','월','화','수','목','금','토'].map((n, i) => (
            <div key={n} style={{ fontSize: 11, fontWeight: 500, padding: '6px 0', color: i===0?'#D4A0A0':i===6?'#7BA0C4':'#999' }}>{n}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {week.map((d, di) => {
              const isW = d === 30
              return (
                <div key={di} style={{ padding: '8px 0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isW && <div style={{ position: 'absolute', width: 36, height: 36, borderRadius: '50%', background: '#D4A0A0' }} />}
                  <span style={{
                    position: 'relative', zIndex: 1, fontSize: 13,
                    fontWeight: isW ? 600 : 300,
                    color: isW ? '#fff' : di===0 ? '#D4A0A0' : di===6 ? '#7BA0C4' : '#3D3D3D',
                  }}>{d ?? ''}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <p style={{ fontFamily: serif, fontSize: 14, color: '#6B6B6B', fontWeight: 300, margin: 0 }}>2026년 5월 30일 토요일 오후 2시</p>
        <p style={{ fontSize: 13, color: '#999', fontWeight: 300, marginTop: 4 }}>그랜드 하얏트 서울 그랜드볼룸</p>
      </div>
    </section>
  )
}
