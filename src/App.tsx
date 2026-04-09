import HeroSection from './components/HeroSection'
import CoupleSection from './components/CoupleSection'
import GallerySection from './components/GallerySection'
import CalendarSection from './components/CalendarSection'
import LocationSection from './components/LocationSection'
import RsvpSection from './components/RsvpSection'
import GuestbookSection from './components/GuestbookSection'
import FooterSection from './components/FooterSection'

export default function App() {
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
      <GallerySection />
      <CalendarSection />
      <LocationSection />
      <RsvpSection />
      <GuestbookSection />
      <FooterSection />
    </div>
  )
}
