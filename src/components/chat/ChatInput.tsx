'use client'

import { Send } from 'lucide-react'
import { useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={`relative flex items-end gap-2 p-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl transition-all duration-200 ${
        isFocused ? 'ring-2 ring-primary-500/50' : ''
      }`}
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Ask about prompt engineering..."
        disabled={disabled}
        rows={1}
        className="flex-1 px-3 py-2 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none max-h-32"
        style={{ minHeight: '40px' }}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 dark:disabled:bg-dark-border disabled:cursor-not-allowed rounded-lg transition-colors"
      >
        <Send className="w-5 h-5 text-white" />
      </button>
    </div>
  )
}
