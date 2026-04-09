import { useScrollFadeIn } from '../hooks/useScrollFadeIn'
const serif = "'Noto Serif KR', serif"

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
      <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #B8956A)' }} />
      <span style={{ color: '#B8956A', fontSize: 10 }}>◆</span>
      <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #B8956A)' }} />
    </div>
  )
}

export default function CoupleSection() {
  const { ref, visible } = useScrollFadeIn()

  return (
    <section ref={ref} className={`scroll-fade ${visible ? 'visible' : ''}`}
      style={{ padding: '64px 24px', background: '#FAF8F5', textAlign: 'center' }}>
      <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: '#3D3D3D', marginBottom: 8 }}>인사말</h2>
      <Divider />
      <div style={{ maxWidth: 320, margin: '0 auto', lineHeight: 2, fontSize: 14, color: '#6B6B6B', fontWeight: 300 }}>
        <p style={{ margin: '0 0 8px' }}>서로 다른 두 사람이</p>
        <p style={{ margin: '0 0 8px' }}>사랑으로 만나 하나의 길을 걷고자 합니다.</p>
        <p style={{ margin: '0 0 8px' }}>저희의 새로운 시작을</p>
        <p style={{ margin: 0 }}>함께 축복해 주시면 감사하겠습니다.</p>
      </div>

      <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
        {[
          { label: '신랑측', color: '#B8956A', father: '신OO', mother: 'OOO', name: '진욱' },
          { label: '신부측', color: '#D4A0A0', father: 'OOO', mother: 'OOO', name: 'OO' },
        ].map((s) => (
          <div key={s.label} style={{
            flex: 1, background: '#fff', borderRadius: 12, padding: '24px 16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <p style={{ fontFamily: serif, fontSize: 13, color: s.color, marginBottom: 16 }}>{s.label}</p>
            <p style={{ fontSize: 12, color: '#999', margin: '0 0 4px' }}><span style={{ color: '#6B6B6B' }}>아버지</span> {s.father}</p>
            <p style={{ fontSize: 12, color: '#999', margin: '0 0 12px' }}><span style={{ color: '#6B6B6B' }}>어머니</span> {s.mother}</p>
            <p style={{ fontFamily: serif, fontSize: 16, color: '#3D3D3D', fontWeight: 400, margin: 0 }}>{s.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
