import { Hero } from '@/components/layout/Hero'
import { Features } from '@/components/layout/Features'
import { Pricing } from '@/components/layout/Pricing'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  )
}
