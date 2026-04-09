'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useScrollFadeIn } from '../hooks/useScrollFadeIn'

const serif = "'Noto Serif KR', serif"

export default function GallerySection() {
  const { ref, visible } = useScrollFadeIn()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [cur, setCur] = useState(0)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIdx, setModalIdx] = useState(0)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then((urls: string[]) => { setImages(urls); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // 모달 열기/닫기
  const openModal = (i: number) => { setModalIdx(i); setModalOpen(true) }
  const closeModal = () => setModalOpen(false)

  // 모달 내 이전/다음
  const modalPrev = useCallback(() => setModalIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const modalNext = useCallback(() => setModalIdx(i => (i + 1) % images.length), [images.length])

  // 키보드 이벤트
  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') modalPrev()
      if (e.key === 'ArrowRight') modalNext()
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, modalPrev, modalNext])

  // 모달 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])

  // 터치 스와이프
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? modalNext() : modalPrev()
    touchStartX.current = null
  }

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
    <>
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

        {/* 로딩 shimmer */}
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
                <div
                  key={i}
                  onClick={() => openModal(i)}
                  style={{
                    flex: '0 0 78%', scrollSnapAlign: 'start', aspectRatio: '3/4', borderRadius: 16,
                    overflow: 'hidden', position: 'relative',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    cursor: 'zoom-in',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
                  }}
                >
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

        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalSlideUp {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </section>

      {/* 전체화면 모달 */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'modalFadeIn 0.25s ease',
          }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={closeModal}
            style={{
              position: 'absolute', top: 20, right: 20,
              width: 40, height: 40, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              zIndex: 10,
            }}
          >✕</button>

          {/* 카운터 */}
          <div style={{
            position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: serif, letterSpacing: 2,
          }}>
            {modalIdx + 1} / {images.length}
          </div>

          {/* 이전 버튼 */}
          <button
            onClick={e => { e.stopPropagation(); modalPrev() }}
            style={{
              position: 'absolute', left: 16,
              width: 44, height: 44, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >‹</button>

          {/* 이미지 */}
          <div
            onClick={e => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{
              position: 'relative',
              width: 'min(92vw, 500px)',
              height: 'min(88vh, 700px)',
              borderRadius: 16,
              overflow: 'hidden',
              animation: 'modalSlideUp 0.25s ease',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            <Image
              src={images[modalIdx]}
              alt={`웨딩 사진 ${modalIdx + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              sizes="92vw"
              priority
            />
          </div>

          {/* 다음 버튼 */}
          <button
            onClick={e => { e.stopPropagation(); modalNext() }}
            style={{
              position: 'absolute', right: 16,
              width: 44, height: 44, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >›</button>

          {/* 하단 썸네일 */}
          <div style={{
            position: 'absolute', bottom: 20,
            display: 'flex', gap: 8, padding: '0 16px',
            overflowX: 'auto', maxWidth: '100vw',
          }}
            className="no-scrollbar"
          >
            {images.map((url, i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setModalIdx(i) }}
                style={{
                  flex: '0 0 52px', height: 52, borderRadius: 8,
                  overflow: 'hidden', position: 'relative', cursor: 'pointer',
                  border: i === modalIdx ? '2px solid #D4A0A0' : '2px solid transparent',
                  opacity: i === modalIdx ? 1 : 0.5,
                  transition: 'all 0.2s',
                }}
              >
                <Image src={url} alt="" fill style={{ objectFit: 'cover' }} sizes="52px" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}