'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Library,
  Globe,
  Plus,
  Brain,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/app/library', icon: Library, label: 'Library' },
  { href: '/app/community', icon: Globe, label: 'Community' },
  { href: '/app/contribute', icon: Plus, label: 'Contribute' },
  { href: '/tools', icon: Brain, label: 'PM Tools' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-apple-gray-200 dark:border-dark-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-apple-black dark:text-white">
            Prompt<span className="text-apple-blue">Vault</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/tools'
            ? pathname.startsWith('/tools')
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-apple-blue text-white'
                  : 'text-apple-gray-500 dark:text-apple-gray-400 hover:bg-apple-gray-50 dark:hover:bg-dark-hover'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-dark-card border border-apple-gray-200 dark:border-dark-border shadow-sm"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5 text-apple-gray-500" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-white dark:bg-dark-card flex flex-col shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-apple-gray-400 hover:text-apple-black dark:hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-dark-card border-r border-apple-gray-200 dark:border-dark-border flex-col flex-shrink-0">
        {navContent}
      </aside>
    </>
  )
}
