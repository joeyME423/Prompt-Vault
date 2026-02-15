'use client'

import Link from 'next/link'
import { Moon, Sun, Menu, X, Sparkles, Plus, ChevronDown, Brain, LogOut, User, BarChart3 } from 'lucide-react'
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
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-purple rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Prompt<span className="text-primary-500">Vault</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/library" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Library
            </Link>
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/community" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Community
            </Link>

            {/* PM Tools Dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors"
              >
                PM Tools
                <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-xl overflow-hidden">
                  <div className="p-2">
                    <Link
                      href="/tools"
                      onClick={() => setIsToolsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-purple rounded-lg flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          All Tools
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Compare AI features
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="border-t border-slate-200 dark:border-dark-border" />
                  <div className="p-2">
                    {PM_TOOLS.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.slug}`}
                        onClick={() => setIsToolsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${tool.color}20` }}
                        >
                          <Brain className="w-4 h-4" style={{ color: tool.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {tool.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {tool.aiFeatureName}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/#features" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Pricing
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contribute"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Contribute
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {authChecked && isLoggedIn ? (
              <>
                <Link
                  href="/library"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">My Library</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            ) : authChecked ? (
              <>
                <Link href="/auth/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
                  Log in
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <Link href="/library" className="block text-slate-600 dark:text-slate-300 hover:text-primary-500">
              Library
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary-500">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/community" className="block text-slate-600 dark:text-slate-300 hover:text-primary-500">
              Community
            </Link>

            {/* Mobile PM Tools */}
            <div>
              <button
                onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                className="flex items-center justify-between w-full text-slate-600 dark:text-slate-300 hover:text-primary-500"
              >
                PM Tools
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileToolsOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  <Link
                    href="/tools"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500"
                  >
                    All Tools
                  </Link>
                  {PM_TOOLS.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/#features" className="block text-slate-600 dark:text-slate-300 hover:text-primary-500">
              Features
            </Link>
            <Link href="/#pricing" className="block text-slate-600 dark:text-slate-300 hover:text-primary-500">
              Pricing
            </Link>
            <Link
              href="/contribute"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Contribute Prompt
            </Link>
            <hr className="border-slate-200 dark:border-dark-border" />
            {authChecked && isLoggedIn ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-600 dark:text-slate-300">
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            ) : authChecked ? (
              <>
                <div className="flex items-center justify-between">
                  <Link href="/auth/login" className="text-slate-600 dark:text-slate-300">
                    Log in
                  </Link>
                  <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-600 dark:text-slate-300">
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
