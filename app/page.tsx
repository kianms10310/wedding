import HeroSection from './components/HeroSection'
import CoupleSection from './components/CoupleSection'
import CalendarSection from './components/CalendarSection'
import GallerySection from './components/GallerySection'
import NoticeSection from './components/NoticeSection'
import LocationSection from './components/LocationSection'
import RsvpSection from './components/RsvpSection'
import AccountSection from './components/AccountSection'
// import GuestbookSection from './components/GuestbookSection'
import FooterSection from './components/FooterSection'

export default function Home() {
  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      background: '#FAF8F5',
      minHeight: '100vh',
      boxShadow: '0 0 40px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}>
      <HeroSection />
      <CoupleSection />
      <CalendarSection />
      <GallerySection />
      <NoticeSection />
      <LocationSection naverMapId={process.env.NAVER_MAP_CLIENT_ID ?? null} />
      {/* <GuestbookSection /> */}
      <RsvpSection />
      <AccountSection />
      <FooterSection kakaoKey={process.env.KAKAO_JAVASCRIPT_KEY ?? null} />
    </div>
  )
}
