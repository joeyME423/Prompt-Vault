'use client'

import { Shield, Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function AdminTopbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="h-14 bg-white dark:bg-dark-card border-b border-apple-gray-200 dark:border-dark-border flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <div className="text-sm font-medium text-apple-black dark:text-white">Administrator Panel</div>
          <div className="text-xs text-apple-gray-400">Full system access</div>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-apple-gray-400 hover:text-apple-black dark:hover:text-white hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </header>
  )
}
