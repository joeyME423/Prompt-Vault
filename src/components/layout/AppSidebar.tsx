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
  ClipboardList,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="px-3 pt-4 pb-1 text-[10px] font-semibold tracking-widest uppercase text-apple-gray-400 dark:text-apple-gray-500 select-none">
      {label}
    </p>
  )
}

function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
  badge,
  onClick,
}: {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
  badge?: number
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-apple-blue text-white'
          : 'text-apple-gray-500 dark:text-apple-gray-400 hover:bg-apple-gray-50 dark:hover:bg-dark-hover'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className={`ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${
          isActive ? 'bg-white/20 text-white' : 'bg-orange-500 text-white'
        }`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAdmin, userId } = useAuth()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (!isAdmin || !userId) return
    const fetchPendingCount = async () => {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count } = await (supabase.from('prompts') as any)
        .select('id', { count: 'exact', head: true })
        .eq('approval_status', 'pending_review')
      setPendingCount(count ?? 0)
    }
    fetchPendingCount()
  }, [isAdmin, userId])

  const navContent = (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-apple-gray-200 dark:border-dark-border flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-semibold text-apple-black dark:text-white tracking-tight">
            Prompt<span className="text-apple-blue">Vault</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
        <SectionLabel label="Workspace" />
        <div className="space-y-0.5">
          <NavLink
            href="/app/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={pathname.startsWith('/app/dashboard')}
            onClick={() => setMobileOpen(false)}
          />
          <NavLink
            href="/app/library"
            icon={Library}
            label="Library"
            isActive={pathname.startsWith('/app/library')}
            onClick={() => setMobileOpen(false)}
          />
        </div>

        <SectionLabel label="Prompts" />
        <div className="space-y-0.5">
          <NavLink
            href="/app/community"
            icon={Globe}
            label="Community"
            isActive={pathname.startsWith('/app/community')}
            onClick={() => setMobileOpen(false)}
          />
          <NavLink
            href="/app/contribute"
            icon={Plus}
            label="Contribute"
            isActive={pathname.startsWith('/app/contribute')}
            onClick={() => setMobileOpen(false)}
          />
        </div>

        {isAdmin && (
          <>
            <SectionLabel label="PMO Admin" />
            <div className="space-y-0.5">
              <NavLink
                href="/admin/prompts"
                icon={ClipboardList}
                label="Review Queue"
                isActive={pathname.startsWith('/admin/prompts')}
                badge={pendingCount}
                onClick={() => setMobileOpen(false)}
              />
            </div>
          </>
        )}

        <SectionLabel label="Tools" />
        <div className="space-y-0.5">
          <NavLink
            href="/tools"
            icon={Brain}
            label="PM Tools"
            isActive={pathname.startsWith('/tools')}
            onClick={() => setMobileOpen(false)}
          />
        </div>
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
          <aside className="relative w-56 h-full bg-white dark:bg-dark-card flex flex-col shadow-xl">
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
      <aside className="hidden lg:flex w-56 bg-white dark:bg-dark-card border-r border-apple-gray-200 dark:border-dark-border flex-col flex-shrink-0">
        {navContent}
      </aside>
    </>
  )
}
