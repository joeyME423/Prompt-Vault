'use client'

import Link from 'next/link'
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-dark-surface border-t border-slate-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-purple rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Prompt<span className="text-primary-500">Flow</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              AI prompts for project managers who want to work smarter.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/library" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 text-sm">
                  Prompt Library
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 text-sm">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-dark-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} PromptFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
