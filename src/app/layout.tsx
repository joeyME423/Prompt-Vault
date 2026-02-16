import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { RolePickerModal } from '@/components/ui/RolePickerModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PromptVault - AI Prompt Library for Project Managers',
  description: 'Discover and save powerful AI prompts designed specifically for project managers. Boost your productivity with our curated prompt library.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Suspense fallback={null}>
            <PostHogProvider>
              <RolePickerModal />
              {children}
            </PostHogProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
