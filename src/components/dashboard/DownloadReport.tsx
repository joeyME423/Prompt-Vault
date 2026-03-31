'use client'

import { Download } from 'lucide-react'

export function DownloadReport() {
  const handleDownload = () => {
    window.print()
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-apple-blue hover:bg-apple-blue-hover text-white rounded-full transition-colors print:hidden"
    >
      <Download className="w-4 h-4" />
      Download PMO Report
    </button>
  )
}
