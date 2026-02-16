import { Pricing } from '@/components/layout/Pricing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | PromptVault',
  description: 'Simple, transparent pricing for PromptVault. Start free, upgrade when your team is ready.',
}

export default function PricingPage() {
  return (
    <div className="pt-20">
      <div className="py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold text-apple-black dark:text-white mb-4">
          Pricing
        </h1>
        <p className="text-lg text-apple-gray-500 dark:text-apple-gray-400 max-w-2xl mx-auto">
          Start free. Upgrade when your team is ready to scale with AI.
        </p>
      </div>
      <Pricing />
    </div>
  )
}
