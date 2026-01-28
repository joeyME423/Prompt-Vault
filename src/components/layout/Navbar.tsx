'use client'

import Link from 'next/link'
import { Moon, Sun, Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from './ThemeProvider'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              Prompt<span className="text-primary-500">Flow</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/library" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Library
            </Link>
            <Link href="/assistant" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Assistant
            </Link>
            <Link href="#features" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Pricing
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/auth/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
              Log in
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Get Started
            </Link>
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
            <Link href="/assistant" className="block text-slate-600 dark:text-slate-300 hover:text-primary-500">
              Assistant
            </Link>
            <Link href="#features" className="block text-slate-600 dark:text-slate-300 hover:text-primary-500">
              Features
            </Link>
            <Link href="#pricing" className="block text-slate-600 dark:text-slate-300 hover:text-primary-500">
              Pricing
            </Link>
            <hr className="border-slate-200 dark:border-dark-border" />
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
          </div>
        </div>
      )}
    </nav>
  )
}
