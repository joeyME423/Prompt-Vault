'use client'

import Link from 'next/link'
import { Moon, Sun, Menu, X, Plus, ChevronDown, Brain, LogOut, User, BarChart3 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { useAuthState } from '@/hooks/useAuthState'
import { createClient } from '@/lib/supabase/client'
import { posthog } from '@/lib/posthog'
import { PM_TOOLS } from '@/data/tools'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { isLoggedIn, authChecked } = useAuthState()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    posthog.capture('logout')
    posthog.reset()
    await supabase.auth.signOut()
    setIsMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-apple-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-apple-black dark:text-white">
              Prompt<span className="text-apple-blue">Vault</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-xs text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-black dark:hover:text-white transition-colors">
              Prompt Guide
            </Link>
            <Link href="/about" className="text-xs text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-black dark:hover:text-white transition-colors">
              About
            </Link>
            <Link href="/app/community" className="text-xs text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-black dark:hover:text-white transition-colors">
              Community
            </Link>

            {/* PM Tools Dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center gap-1 text-xs text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-black dark:hover:text-white transition-colors"
              >
                PM Tools
                <ChevronDown className={`w-3 h-3 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border shadow-xl overflow-hidden">
                  <div className="p-2">
                    <Link
                      href="/tools"
                      onClick={() => setIsToolsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
                    >
                      <div className="w-8 h-8 bg-apple-gray-50 dark:bg-dark-hover rounded-xl flex items-center justify-center">
                        <Brain className="w-4 h-4 text-apple-gray-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-apple-black dark:text-white">
                          All Tools
                        </div>
                        <div className="text-xs text-apple-gray-400">
                          Compare AI features
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="border-t border-apple-gray-200 dark:border-dark-border" />
                  <div className="p-2">
                    {PM_TOOLS.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.slug}`}
                        onClick={() => setIsToolsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
                      >
                        <div className="w-8 h-8 bg-apple-gray-50 dark:bg-dark-hover rounded-xl flex items-center justify-center">
                          <Brain className="w-4 h-4 text-apple-gray-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-apple-black dark:text-white">
                            {tool.name}
                          </div>
                          <div className="text-xs text-apple-gray-400">
                            {tool.aiFeatureName}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/#features" className="text-xs text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-black dark:hover:text-white transition-colors">
              Features
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/app/contribute"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-medium rounded-full transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Contribute
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-apple-gray-400 hover:text-apple-black dark:hover:text-white hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {authChecked && isLoggedIn ? (
              <>
                <Link
                  href="/app/library"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-apple-gray-500 hover:text-apple-black dark:hover:text-white hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="text-xs">My Library</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-apple-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-xs">Logout</span>
                </button>
              </>
            ) : authChecked ? (
              <>
                <Link href="/auth/login" className="text-xs text-apple-gray-500 hover:text-apple-black dark:hover:text-white transition-colors">
                  Log in
                </Link>
                <Link href="/auth/signup" className="inline-flex items-center px-4 py-1.5 bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-medium rounded-full transition-colors">
                  Get Started
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full text-apple-gray-500"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-apple-gray-200 dark:border-dark-border">
          <div className="px-4 py-4 space-y-3">
            <Link href="/pricing" className="block text-sm text-apple-gray-500 hover:text-apple-black dark:hover:text-white">
              Prompt Guide
            </Link>
            <Link href="/about" className="block text-sm text-apple-gray-500 hover:text-apple-black dark:hover:text-white">
              About
            </Link>
            <Link href="/app/community" className="block text-sm text-apple-gray-500 hover:text-apple-black dark:hover:text-white">
              Community
            </Link>

            {/* Mobile PM Tools */}
            <div>
              <button
                onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                className="flex items-center justify-between w-full text-sm text-apple-gray-500 hover:text-apple-black dark:hover:text-white"
              >
                PM Tools
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileToolsOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  <Link
                    href="/tools"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm text-apple-gray-400 hover:text-apple-blue"
                  >
                    All Tools
                  </Link>
                  {PM_TOOLS.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-sm text-apple-gray-400 hover:text-apple-blue"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/#features" className="block text-sm text-apple-gray-500 hover:text-apple-black dark:hover:text-white">
              Features
            </Link>
            <Link
              href="/app/contribute"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-apple-blue hover:bg-apple-blue-hover text-white text-sm font-medium rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" />
              Contribute Prompt
            </Link>
            <hr className="border-apple-gray-200 dark:border-dark-border" />
            {authChecked && isLoggedIn ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-apple-gray-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-full text-apple-gray-400">
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            ) : authChecked ? (
              <>
                <div className="flex items-center justify-between">
                  <Link href="/auth/login" className="text-sm text-apple-gray-500">
                    Log in
                  </Link>
                  <button onClick={toggleTheme} className="p-2 rounded-full text-apple-gray-400">
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
                <Link href="/auth/signup" className="btn-primary block text-center text-sm">
                  Get Started
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  )
}
