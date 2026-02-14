'use client'

import { useState } from 'react'
import { Target, Repeat, Network, Code, ClipboardList, User, Sparkles } from 'lucide-react'
import { PM_ROLES } from '@/lib/constants'
import { useUserProfile } from '@/hooks/useUserProfile'
import { posthog } from '@/lib/posthog'

const ROLE_ICONS: Record<string, React.ReactNode> = {
  'Product Manager': <Target className="w-6 h-6" />,
  'Scrum Master': <Repeat className="w-6 h-6" />,
  'Program Manager': <Network className="w-6 h-6" />,
  'Engineering Manager': <Code className="w-6 h-6" />,
  'Project Coordinator': <ClipboardList className="w-6 h-6" />,
  'Other': <User className="w-6 h-6" />,
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  'Product Manager': 'Roadmaps, prioritization, stakeholder management',
  'Scrum Master': 'Sprint planning, retros, team facilitation',
  'Program Manager': 'Cross-team coordination, risk management',
  'Engineering Manager': 'Technical planning, team leadership',
  'Project Coordinator': 'Scheduling, status tracking, logistics',
  'Other': 'A different PM-adjacent role',
}

const ROLE_COLORS: Record<string, string> = {
  'Product Manager': 'from-blue-500 to-blue-600',
  'Scrum Master': 'from-cyan-500 to-cyan-600',
  'Program Manager': 'from-purple-500 to-purple-600',
  'Engineering Manager': 'from-green-500 to-green-600',
  'Project Coordinator': 'from-amber-500 to-amber-600',
  'Other': 'from-slate-500 to-slate-600',
}

export function RolePickerModal() {
  const { needsRole, updateRole } = useUserProfile()
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  if (!needsRole) return null

  const handleConfirm = async () => {
    if (!selected) return
    setSaving(true)
    const success = await updateRole(selected)
    if (success) {
      posthog.capture('role_selected', { role: selected })
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-500/10 mb-4">
            <Sparkles className="w-7 h-7 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to PromptVault!
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            What best describes your role? We&apos;ll suggest prompts tailored to your work.
          </p>
        </div>

        {/* Role cards */}
        <div className="px-8 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PM_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selected === role
                  ? 'border-primary-500 bg-primary-500/5 shadow-md'
                  : 'border-slate-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-500/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ROLE_COLORS[role]} flex items-center justify-center text-white`}>
                {ROLE_ICONS[role]}
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white text-center">
                {role}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 text-center leading-tight">
                {ROLE_DESCRIPTIONS[role]}
              </span>
              {selected === role && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={!selected || saving}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            {saving ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
