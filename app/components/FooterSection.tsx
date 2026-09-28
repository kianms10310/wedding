'use client'

import { useState } from 'react'
import KakaoShareButton from './KakaoShareButton'

export default function FooterSection({ kakaoKey }: { kakaoKey: string | null }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer style={{ background: '#3D3D3D', padding: '40px 24px' }}>
      {kakaoKey && <KakaoShareButton kakaoKey={kakaoKey} />}
      <button type="button" onClick={copyLink} style={{
        width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: '#A8B5A2', color: '#fff', fontSize: 13, fontWeight: 500, marginBottom: 32,
      }}>{copied ? '링크가 복사되었습니다' : '청첩장 링크 복사'}</button>

      <div style={{ textAlign: 'center', paddingTop: 24, borderTop: '1px solid rgba(184,149,106,0.15)' }}>
        <p style={{ fontSize: 11, color: 'rgba(250,248,245,0.4)', margin: 0, lineHeight: 2 }}>
          진욱 ♥ 한슬<br />2027. 06. 05
        </p>
      </div>
    </footer>
  )
}
