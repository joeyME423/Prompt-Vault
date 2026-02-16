import { PromptGuide } from '@/components/layout/Pricing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt Guide | PromptVault',
  description: 'Learn how to write great AI prompts for project management. Best practices, examples, and a step-by-step guide.',
}

export default function PromptGuidePage() {
  return (
    <div className="pt-12">
      <PromptGuide />
    </div>
  )
}
