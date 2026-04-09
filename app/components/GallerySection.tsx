'use client'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { useScrollFadeIn } from '../hooks/useScrollFadeIn'

const serif = "'Noto Serif KR', serif"

export default function GallerySection() {
  const { ref, visible } = useScrollFadeIn()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [cur, setCur] = useState(0)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then((urls: string[]) => {
        setImages(urls)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const onScroll = () => {
    if (!scrollRef.current) return
    const idx = Math.round(scrollRef.current.scrollLeft / (scrollRef.current.offsetWidth * 0.78))
    setCur(idx)
  }

  const goTo = (i: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ left: scrollRef.current.offsetWidth * 0.78 * i, behavior: 'smooth' })
    setCur(i)
  }

  return (
    <section
      ref={ref}
      className={`scroll-fade ${visible ? 'visible' : ''}`}
      style={{ padding: '64px 0', background: '#F7F3EE' }}
    >
      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 24px' }}>
        <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: '#3D3D3D', marginBottom: 8 }}>
          우리의 순간
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #B8956A)' }} />
          <span style={{ color: '#B8956A', fontSize: 10 }}>◆</span>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #B8956A)' }} />
        </div>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div style={{ display: 'flex', gap: 12, padding: '0 24px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              flex: '0 0 78%', aspectRatio: '3/4', borderRadius: 16,
              background: 'linear-gradient(90deg, #EDE8E3 25%, #E4DED8 50%, #EDE8E3 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }} />
          ))}
        </div>
      )}

      {/* 이미지 슬라이더 */}
      {!loading && images.length > 0 && (
        <>
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="no-scrollbar"
            style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '0 24px' }}
          >
            {images.map((url, i) => (
              <div key={i} style={{
                flex: '0 0 78%', scrollSnapAlign: 'start', aspectRatio: '3/4', borderRadius: 16,
                overflow: 'hidden', position: 'relative',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}>
                <Image
                  src={url}
                  alt={`웨딩 사진 ${i + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="78vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* 페이지 인디케이터 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: cur === i ? 20 : 6, height: 6, borderRadius: 3, border: 'none',
                background: cur === i ? '#D4A0A0' : '#E0D8D0',
                transition: 'all 0.3s', cursor: 'pointer', padding: 0,
              }} />
            ))}
          </div>
        </>
      )}

      {/* 이미지 없을 때 */}
      {!loading && images.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 24px', color: '#B8A99A', fontSize: 14, fontFamily: serif }}>
          사진을 불러올 수 없습니다
        </div>
      )}

      {/* shimmer 애니메이션 */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  )
}