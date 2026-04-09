import { useRef, useState } from 'react'
import { useScrollFadeIn } from '../hooks/useScrollFadeIn'
const serif = "'Noto Serif KR', serif"
const COLORS = ['#D4A0A0','#A8B5A2','#B8956A','#C4B5A5','#D4A0A0','#A8B5A2','#B8956A','#C4B5A5']

export default function GallerySection() {
  const { ref, visible } = useScrollFadeIn()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [cur, setCur] = useState(0)

  const onScroll = () => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const idx = Math.round(el.scrollLeft / (el.offsetWidth * 0.78))
    setCur(idx)
  }

  const goTo = (i: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ left: scrollRef.current.offsetWidth * 0.78 * i, behavior: 'smooth' })
    setCur(i)
  }

  return (
    <section ref={ref} className={`scroll-fade ${visible ? 'visible' : ''}`}
      style={{ padding: '64px 0', background: '#F7F3EE' }}>
      <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 24px' }}>
        <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: '#3D3D3D', marginBottom: 8 }}>우리의 순간</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #B8956A)' }} />
          <span style={{ color: '#B8956A', fontSize: 10 }}>◆</span>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #B8956A)' }} />
        </div>
      </div>

      <div ref={scrollRef} onScroll={onScroll} className="no-scrollbar"
        style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '0 24px' }}>
        {COLORS.map((c, i) => (
          <div key={i} style={{
            flex: '0 0 78%', scrollSnapAlign: 'start', aspectRatio: '3/4', borderRadius: 16,
            background: `linear-gradient(135deg, ${c}40, ${c}80)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.2">
              <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
        {COLORS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: cur === i ? 20 : 6, height: 6, borderRadius: 3, border: 'none',
            background: cur === i ? '#D4A0A0' : '#E0D8D0', transition: 'all 0.3s', cursor: 'pointer', padding: 0,
          }} />
        ))}
      </div>
    </section>
  )
}
