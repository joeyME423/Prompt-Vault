'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-apple-gray-50 dark:bg-dark-surface border-t border-apple-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-semibold text-apple-black dark:text-white">
                Prompt<span className="text-apple-blue">Vault</span>
              </span>
            </Link>
            <p className="text-apple-gray-500 dark:text-apple-gray-400 text-sm">
              AI prompts for project managers who want to work smarter.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-medium text-apple-black dark:text-white text-xs uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/app/library" className="text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-blue text-sm transition-colors">
                  Prompt Library
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-blue text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-blue text-sm transition-colors">
                  Prompt Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-medium text-apple-black dark:text-white text-xs uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/app/contribute" className="text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-blue text-sm transition-colors">
                  Contribute
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-blue text-sm transition-colors">
                  PM Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-medium text-apple-black dark:text-white text-xs uppercase tracking-wider mb-4">Get Started</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/signup" className="text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-blue text-sm transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-blue text-sm transition-colors">
                  Log In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-apple-gray-200 dark:border-dark-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-apple-gray-400 text-xs">
            &copy; {new Date().getFullYear()} PromptVault. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-apple-gray-400 hover:text-apple-gray-500 dark:hover:text-apple-gray-300 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="text-apple-gray-400 hover:text-apple-gray-500 dark:hover:text-apple-gray-300 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="text-apple-gray-400 hover:text-apple-gray-500 dark:hover:text-apple-gray-300 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
