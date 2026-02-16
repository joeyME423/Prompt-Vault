import { Hero } from '@/components/layout/Hero'
import { Features } from '@/components/layout/Features'
import { NewPrompts } from '@/components/layout/NewPrompts'
import { DashboardPreview } from '@/components/layout/DashboardPreview'
import { Pricing } from '@/components/layout/Pricing'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <NewPrompts />
      <DashboardPreview />
      <Pricing />
      <Footer />
    </div>
  )
}
