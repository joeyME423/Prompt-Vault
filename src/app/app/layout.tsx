'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppTopbar } from '@/components/layout/AppTopbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, authChecked } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [authChecked, isLoggedIn, router, pathname])

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-apple-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-apple-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-apple-gray-400">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="flex h-screen bg-apple-gray-50 dark:bg-dark-bg">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
