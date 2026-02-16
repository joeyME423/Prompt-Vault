'use client'

import { Moon, Sun, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { posthog } from '@/lib/posthog'

export function AppTopbar() {
  const { theme, toggleTheme } = useTheme()
  const { isAdmin } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    posthog.capture('logout')
    posthog.reset()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="h-14 bg-white dark:bg-dark-card border-b border-apple-gray-200 dark:border-dark-border flex items-center justify-end px-6 flex-shrink-0">
      <div className="flex items-center gap-1">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-apple-gray-400 hover:text-apple-black dark:hover:text-white hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-apple-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </header>
  )
}
