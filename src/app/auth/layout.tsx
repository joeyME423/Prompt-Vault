import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | PromptVault',
  description: 'Sign in or create an account to contribute and save AI prompts for project management.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
