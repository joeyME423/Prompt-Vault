import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt Library | PromptVault',
  description: 'Browse our collection of AI prompts designed for project managers. Search by category, use case, or keyword.',
}

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children
}
