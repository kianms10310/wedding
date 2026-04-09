import { useState } from 'react'
import { useScrollFadeIn } from '../hooks/useScrollFadeIn'
const serif = "'Noto Serif KR', serif"

interface Account { bank: string; num: string; holder: string; relation: string }
interface Side { id: string; label: string; accounts: Account[] }

const sides: Side[] = [
  {
    id: 'groom', label: '신랑측',
    accounts: [
      { relation: '신랑', bank: '신한은행', num: '110-225-3800345', holder: '신진욱' },
      { relation: '아버지', bank: '국민은행', num: '123-456-789012', holder: '신OO' },
      { relation: '어머니', bank: '하나은행', num: '987-654-321098', holder: 'OOO' },
    ],
  },
  {
    id: 'bride', label: '신부측',
    accounts: [
      { relation: '신부', bank: '우리은행', num: '1002-456-789012', holder: '신부이름' },
      { relation: '아버지', bank: '기업은행', num: '111-222-333444', holder: 'OOO' },
      { relation: '어머니', bank: '농협은행', num: '555-666-777888', holder: 'OOO' },
    ],
  },
]

export default function FooterSection() {
  const { ref, visible } = useScrollFadeIn()
  const [open, setOpen] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (t: string, id: string) => {
    await navigator.clipboard.writeText(t); setCopied(id); setTimeout(() => setCopied(null), 2000)
  }

  return (
    <footer ref={ref} className={`scroll-fade ${visible ? 'visible' : ''}`} style={{ background: '#3D3D3D' }}>
      <div style={{ padding: '64px 24px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: '#FAF8F5', marginBottom: 8 }}>마음 전하실 곳</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #B8956A)' }} />
            <span style={{ color: '#B8956A', fontSize: 10 }}>◆</span>
            <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #B8956A)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {sides.map((side) => (
            <div key={side.id} style={{ borderRadius: 12, overflow: 'hidden', background: '#4a4a4a' }}>
              {/* 아코디언 헤더 */}
              <button onClick={() => setOpen(open === side.id ? null : side.id)} style={{
                width: '100%', padding: '14px 16px', border: 'none', cursor: 'pointer', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#E0D8D0', fontSize: 13,
              }}>
                <span>{side.label} 계좌번호</span>
                <span style={{ fontSize: 18, color: '#B8956A', transition: 'transform 0.2s', transform: open === side.id ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>

              {/* 아코디언 내용: 계좌 목록 */}
              {open === side.id && (
                <div style={{ padding: '0 12px 12px', borderTop: '1px solid rgba(184,149,106,0.2)' }}>
                  {side.accounts.map((acc, i) => {
                    const key = `${side.id}-${i}`
                    return (
                      <div key={key} style={{
                        padding: '14px 12px', marginTop: 10,
                        background: '#3D3D3D', borderRadius: 8,
                      }}>
                        {/* 관계 태그 */}
                        <span style={{
                          display: 'inline-block', fontSize: 10, color: '#FAF8F5',
                          background: side.id === 'groom' ? '#B8956A' : '#D4A0A0',
                          borderRadius: 4, padding: '2px 8px', marginBottom: 10,
                        }}>{acc.relation}</span>

                        {/* 계좌 정보 */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <p style={{ fontSize: 12, color: '#999', margin: '0 0 4px' }}>{acc.bank}</p>
                            <p style={{ fontSize: 14, color: '#FAF8F5', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' as const }}>{acc.num}</p>
                            <p style={{ fontSize: 12, color: '#B8956A', margin: 0 }}>{acc.holder}</p>
                          </div>
                          <button onClick={() => copy(acc.num, key)} style={{
                            padding: '8px 14px', borderRadius: 6, border: '1px solid rgba(184,149,106,0.3)',
                            background: 'transparent', cursor: 'pointer', color: '#B8956A', fontSize: 11,
                            whiteSpace: 'nowrap',
                          }}>{copied === key ? '복사됨' : '복사'}</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={() => copy(window.location.href, 'link')} style={{
          width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: '#A8B5A2', color: '#fff', fontSize: 13, fontWeight: 500, marginBottom: 32,
        }}>{copied === 'link' ? '링크가 복사되었습니다' : '청첩장 링크 복사'}</button>

        <div style={{ textAlign: 'center', paddingTop: 24, borderTop: '1px solid rgba(184,149,106,0.15)' }}>
          <p style={{ fontSize: 11, color: 'rgba(250,248,245,0.4)', margin: 0, lineHeight: 2 }}>
            진욱 ♥ 신부이름<br />2026. 05. 30
          </p>
        </div>
      </div>
    </footer>
  )
}
