import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Prompts | PromptVault',
  description: 'Browse and rate AI prompts contributed by the PM community.',
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children
}
