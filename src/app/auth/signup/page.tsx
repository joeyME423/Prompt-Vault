'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Mail, Lock, User, Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pmPlatform, setPmPlatform] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, pm_platform: pmPlatform },
        },
      })

      if (signUpError) throw signUpError

      router.push('/library')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-purple rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              Prompt<span className="text-primary-500">Vault</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Create your account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Join the community and start contributing prompts
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 border border-slate-200 dark:border-dark-border shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pmPlatform" className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
                PM Platform
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  id="pmPlatform"
                  value={pmPlatform}
                  onChange={(e) => setPmPlatform(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none"
                >
                  <option value="">Select your PM tool...</option>
                  <option value="Wrike">Wrike</option>
                  <option value="Asana">Asana</option>
                  <option value="ClickUp">ClickUp</option>
                  <option value="Monday.com">Monday.com</option>
                  <option value="Smartsheet">Smartsheet</option>
                  <option value="Jira">Jira</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
