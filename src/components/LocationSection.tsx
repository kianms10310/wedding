import { useState, useEffect, useRef } from 'react'
import { useScrollFadeIn } from '../hooks/useScrollFadeIn'

const VENUE_LAT = 37.5373, VENUE_LNG = 126.9987
const NAVER_MAP_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
const serif = "'Noto Serif KR', serif"
const address = '서울특별시 용산구 소월로 322'
const venueName = '그랜드 하얏트 서울 그랜드볼룸'

const transports = [
  { key: 'subway', label: '지하철', icon: '🚇', text: '6호선 녹사평역 3번 출구 → 도보 약 5분' },
  { key: 'bus', label: '버스', icon: '🚌', text: '강남행 버스 이용 → 하얏트호텔 정류장 하차' },
  { key: 'car', label: '자가용', icon: '🚗', text: '그랜드 하얏트 서울 지하 주차장 이용\n(주차 2시간 무료)' },
]

export default function LocationSection() {
  const { ref, visible } = useScrollFadeIn()
  const [copied, setCopied] = useState(false)
  const [openT, setOpenT] = useState<string | null>(null)
  const [mapOk, setMapOk] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!NAVER_MAP_ID) return
    if (document.getElementById('naver-map-sdk')) { if ((window as any).naver?.maps) setMapOk(true); return }
    const s = document.createElement('script')
    s.id = 'naver-map-sdk'
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_ID}`
    s.async = true
    s.onload = () => setMapOk(true)
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (!mapOk || !mapRef.current) return
    const naver = (window as any).naver
    const loc = new naver.maps.LatLng(VENUE_LAT, VENUE_LNG)
    const map = new naver.maps.Map(mapRef.current, { center: loc, zoom: 16, zoomControl: true, zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT } })
    new naver.maps.Marker({ position: loc, map })
  }, [mapOk])

  const copyAddr = async () => { await navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const openMap = () => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(venueName)}`, '_blank')

  return (
    <section ref={ref} className={`scroll-fade ${visible ? 'visible' : ''}`} style={{ padding: '64px 24px', background: '#FAF8F5' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: '#3D3D3D', marginBottom: 8 }}>오시는 길</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #B8956A)' }} />
          <span style={{ color: '#B8956A', fontSize: 10 }}>◆</span>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #B8956A)' }} />
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 16 }}>
        <p style={{ fontFamily: serif, fontSize: 16, color: '#3D3D3D', fontWeight: 400, margin: '0 0 6px' }}>{venueName}</p>
        <p style={{ fontSize: 13, color: '#999', fontWeight: 300, margin: 0 }}>{address}</p>
      </div>

      {NAVER_MAP_ID ? (
        <div ref={mapRef} style={{ width: '100%', height: 240, borderRadius: 16, marginBottom: 12 }} />
      ) : (
        <div onClick={openMap} style={{
          width: '100%', height: 200, borderRadius: 16, marginBottom: 12,
          background: 'linear-gradient(135deg, #E8E2DA, #D4CFC8)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.2">
            <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>탭하여 네이버 지도에서 보기</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button onClick={openMap} style={{
          flex: 1, padding: '12px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: '#1EC800', color: '#fff', fontSize: 13, fontWeight: 500,
        }}>네이버 지도</button>
        <button onClick={copyAddr} style={{
          flex: 1, padding: '12px 0', borderRadius: 10, border: '1px solid #E0D8D0', cursor: 'pointer',
          background: '#fff', color: '#6B6B6B', fontSize: 13, fontWeight: 400,
        }}>{copied ? '복사 완료!' : '주소 복사'}</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {transports.map((t) => (
          <div key={t.key} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <button onClick={() => setOpenT(openT === t.key ? null : t.key)} style={{
              width: '100%', padding: '14px 16px', border: 'none', cursor: 'pointer', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#3D3D3D',
            }}>
              <span>{t.icon} {t.label}</span>
              <span style={{ fontSize: 16, color: '#B8956A', transition: 'transform 0.2s', transform: openT === t.key ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {openT === t.key && (
              <div style={{ padding: '0 16px 14px', fontSize: 12, color: '#6B6B6B', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{t.text}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
