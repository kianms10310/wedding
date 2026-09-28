'use client'

import { useState } from 'react'
import Script from 'next/script'

const imageUrl = 'https://res.cloudinary.com/dhtvrg2js/image/upload/KakaoTalk_20260928_161605_kksaxi.jpg'

type KakaoSdk = {
  isInitialized: () => boolean
  init: (key: string) => void
  Share: { sendDefault: (options: object) => void }
}

const getKakao = () => (window as Window & { Kakao?: KakaoSdk }).Kakao

export default function KakaoShareButton({ kakaoKey }: { kakaoKey: string }) {
  const [ready, setReady] = useState(false)

  const share = () => {
    const kakao = getKakao()
    if (!kakao?.isInitialized()) return
    const url = `${window.location.origin}${window.location.pathname}`
    const link = { mobileWebUrl: url, webUrl: url }

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '진욱 ♥ 한슬 결혼합니다',
        description: '2027년 6월 5일 토요일 오전 11시, 루클라비 수원 라비에벨 홀',
        imageUrl,
        imageWidth: 1814,
        imageHeight: 2419,
        link,
      },
      buttons: [{ title: '청첩장 보기', link }],
    })
  }

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js"
        strategy="afterInteractive"
        onReady={() => {
          const kakao = getKakao()
          if (!kakao) return
          if (!kakao.isInitialized()) kakao.init(kakaoKey)
          setReady(true)
        }}
      />
      <button type="button" onClick={share} disabled={!ready} style={{
        width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
        background: '#FEE500', color: '#3D3D3D', fontSize: 13, fontWeight: 500,
        cursor: ready ? 'pointer' : 'default', opacity: ready ? 1 : 0.6,
        marginBottom: 10,
      }}>카카오톡으로 공유</button>
    </>
  )
}
