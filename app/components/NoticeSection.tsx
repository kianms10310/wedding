const serif = "'Noto Serif KR', serif"

const notices = [
  '안내사항 예시 1: 예식 시작 10분 전까지 입장해 주세요.',
  '안내사항 예시 2: 주차 및 이동 안내를 미리 확인해 주세요.',
  '안내사항 예시 3: 예식 당일 현장 안내에 따라 이동해 주세요.',
]

export default function NoticeSection() {
  return (
    <section style={{ padding: '64px 24px', background: '#F7F3EE' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: '#3D3D3D', marginBottom: 8 }}>안내사항</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #B8956A)' }} />
          <span style={{ color: '#B8956A', fontSize: 10 }}>◆</span>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #B8956A)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notices.map((notice, index) => (
          <p key={notice} style={{
            margin: 0, padding: '16px 18px', borderRadius: 12, background: '#fff',
            color: '#6B6B6B', fontSize: 13, lineHeight: 1.6,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <span style={{ color: '#B8956A', marginRight: 8 }}>{String(index + 1).padStart(2, '0')}</span>
            {notice}
          </p>
        ))}
      </div>
    </section>
  )
}
