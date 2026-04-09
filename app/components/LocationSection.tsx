'use client'
import { useState, useEffect, useRef } from 'react'
import { useScrollFadeIn } from '../hooks/useScrollFadeIn'

const VENUE_LAT = 37.5373, VENUE_LNG = 126.9987
const serif = "'Noto Serif KR', serif"
const address = '경기 수원시 권선구 경수대로 401'
const venueName = '루클라비 수원 라비에벨 홀'

const transports = [
  { key: 'subway', label: '지하철', icon: '🚇', text: '< 수원시청역 5번 출구 >\n* 도보 이용시 : 5번 출구에서 직진 후 TG2 맞춤정장 매장 앞 사거리 횡단보도를 건넌 후 좌측\n* 셔틀버스 : 5번 출구 앞 승차 (예식 당일 5-7분 간격 운행)' },
  { key: 'bus', label: '버스', icon: '🚌', text: '< KT남수원지사 하차 >\n* 일반버스 : 81, 300-1 \n* 좌석버스 : 300\n\n< 권선초등학교 하차 >\n* 일반버스 : 92, 92-1' },
  { key: 'car', label: '자가용', icon: '🚗', text: '< 주차장 안내 >\n* 제1주차장 : KT 남수원지사주차장\n* 제2주차장 : 한화생명 주차장 \n※ 주차 요원의 안내를 받으세요.' },
]

export default function LocationSection() {
  const { ref, visible } = useScrollFadeIn()
  const [copied, setCopied] = useState(false)
  const [openT, setOpenT] = useState<string | null>(null)
  const [mapOk, setMapOk] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const naverMapId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || null

  useEffect(() => {
    if (!naverMapId) return
    if (document.getElementById('naver-map-sdk')) { if ((window as unknown as Record<string, unknown>).naver) setMapOk(true); return }
    const s = document.createElement('script')
    s.id = 'naver-map-sdk'
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapId}`
    s.async = true
    s.onload = () => setMapOk(true)
    document.head.appendChild(s)
  }, [naverMapId])

  useEffect(() => {
    if (!mapOk || !mapRef.current) return
    const naver = (window as unknown as Record<string, unknown>).naver as Record<string, unknown>
    const maps = naver.maps as Record<string, unknown>
    const LatLng = maps.LatLng as new (lat: number, lng: number) => unknown
    const MapClass = maps.Map as new (el: HTMLElement, opts: unknown) => unknown
    const MarkerClass = maps.Marker as new (opts: unknown) => unknown
    const loc = new LatLng(VENUE_LAT, VENUE_LNG)
    const map = new MapClass(mapRef.current!, { center: loc, zoom: 16, zoomControl: true })
    new MarkerClass({ position: loc, map })
  }, [mapOk])

  const copyAddr = async () => { await navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const openMap = () => window.open(`https://map.naver.com/p/entry/place/1224030066?placePath=%2Fhome`, '_blank')

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

      {naverMapId ? (
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
