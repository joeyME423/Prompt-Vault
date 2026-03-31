'use client'

interface SectionHeaderProps {
  title: string
  helper: string
}

export function SectionHeader({ title, helper }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-apple-black dark:text-white">{title}</h2>
      <p className="text-sm text-apple-gray-500 dark:text-slate-400 mt-1">{helper}</p>
    </div>
  )
}
