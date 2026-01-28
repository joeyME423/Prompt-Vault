import { ChatInterface } from '@/components/chat/ChatInterface'

export const metadata = {
  title: 'AI Prompt Assistant | PromptFlow',
  description: 'Get expert help with prompt engineering best practices',
}

export default function AssistantPage() {
  return (
    <main className="min-h-screen pt-20 pb-8 px-4 bg-slate-50 dark:bg-dark-bg">
      <ChatInterface />
    </main>
  )
}
