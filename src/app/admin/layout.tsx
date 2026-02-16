'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminTopbar } from '@/components/layout/AdminTopbar'
import { ShieldX } from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAdmin, authChecked } = useAuth()
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
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-apple-gray-400">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  // 403 - Not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-apple-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-apple-black dark:text-white mb-2">
            403 — Not Allowed
          </h1>
          <p className="text-apple-gray-500 dark:text-apple-gray-400 mb-8">
            You don&apos;t have permission to access the admin area. This section is restricted to administrators.
          </p>
          <Link
            href="/app/dashboard"
            className="inline-flex items-center px-6 py-2.5 bg-apple-blue hover:bg-apple-blue-hover text-white font-medium rounded-full transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-apple-gray-50 dark:bg-dark-bg">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
