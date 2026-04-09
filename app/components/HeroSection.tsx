'use client'
import { useEffect, useState } from 'react'

const WEDDING = new Date('2027-06-05T11:00:00+09:00')
const serif = "'Noto Serif KR', serif"

function getTimeLeft() {
  const d = WEDDING.getTime() - Date.now()
  if (d <= 0) return { d: 0, h: 0, m: 0, s: 0 }
  return {
    d: Math.floor(d / 86400000),
    h: Math.floor((d / 3600000) % 24),
    m: Math.floor((d / 60000) % 60),
    s: Math.floor((d / 1000) % 60),
  }
}

export default function HeroSection() {
  const [time, setTime] = useState(getTimeLeft())
  useEffect(() => { const id = setInterval(() => setTime(getTimeLeft()), 1000); return () => clearInterval(id) }, [])

  return (
    <section style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '60px 24px',
      background: 'linear-gradient(180deg, #FAF8F5 0%, #F7F3EE 50%, #F0EBE3 100%)',
      textAlign: 'center', position: 'relative',
    }}>
      <p style={{ fontSize: 11, letterSpacing: 6, color: '#B8956A', marginBottom: 32, fontFamily: serif }}>
        WEDDING INVITATION
      </p>

      <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: 36, color: '#3D3D3D', lineHeight: 1.5, margin: 0 }}>
        신진욱
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
        <div style={{ width: 40, height: 1, background: '#D4A0A0' }} />
        <span style={{ color: '#D4A0A0', fontSize: 18 }}>♥</span>
        <div style={{ width: 40, height: 1, background: '#D4A0A0' }} />
      </div>
      <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: 36, color: '#3D3D3D', lineHeight: 1.5, margin: 0 }}>
        봉한슬
      </h1>

      <div style={{ marginTop: 36, lineHeight: 2 }}>
        <p style={{ fontSize: 15, color: '#6B6B6B', fontWeight: 300, margin: 0 }}>
          2027. 06. 05 토요일 오전 11시
        </p>
        <p style={{ fontSize: 13, color: '#999', fontWeight: 300, margin: 0 }}>
          루클라비 수원 라비에벨 홀
        </p>
      </div>

      <div style={{ marginTop: 40 }}>
        <p style={{ fontSize: 11, letterSpacing: 4, color: '#B8956A', marginBottom: 16 }}>예식까지 남은 시간</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[
            { v: time.d, l: 'DAYS' }, { v: time.h, l: 'HRS' },
            { v: time.m, l: 'MIN' }, { v: time.s, l: 'SEC' },
          ].map((item) => (
            <div key={item.l} style={{
              width: 64, padding: '14px 0 10px', background: 'rgba(255,255,255,0.7)',
              borderRadius: 12, textAlign: 'center',
            }}>
              <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 300, color: '#3D3D3D' }}>
                {String(item.v).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: '#B8956A', marginTop: 4 }}>{item.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 24, animation: 'bounce-gentle 2s infinite' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8956A" strokeWidth="1.5">
          <path d="M19 14l-7 7m0 0l-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
