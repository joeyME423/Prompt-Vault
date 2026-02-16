import { Hero } from '@/components/layout/Hero'
import { Features } from '@/components/layout/Features'
import { NewPrompts } from '@/components/layout/NewPrompts'
import { DashboardPreview } from '@/components/layout/DashboardPreview'
import { PromptGuide } from '@/components/layout/Pricing'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <NewPrompts />
      <DashboardPreview />
      <PromptGuide />
    </div>
  )
}
