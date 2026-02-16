import type { Metadata } from 'next'
import Link from 'next/link'
import { Target, Users, Zap, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | PromptVault',
  description: 'PromptVault helps project managers harness AI with curated, battle-tested prompts.',
}

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-semibold text-apple-black dark:text-white mb-6">
            AI prompts built for
            <br />
            project managers.
          </h1>
          <p className="text-lg text-apple-gray-500 dark:text-apple-gray-400 max-w-2xl mx-auto">
            PromptVault is a curated library of battle-tested AI prompts designed specifically for PMs.
            We help teams ship faster by making AI actually useful in day-to-day project work.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-apple-gray-50 dark:bg-dark-surface">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-apple-black dark:text-white text-center mb-16">
            What we believe
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-14 h-14 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Target className="w-7 h-7 text-apple-blue" />
              </div>
              <h3 className="text-lg font-semibold text-apple-black dark:text-white mb-3">
                Purpose-built
              </h3>
              <p className="text-apple-gray-500 dark:text-apple-gray-400 text-sm leading-relaxed">
                Generic AI prompts waste time. Every prompt in our library is crafted for real PM workflows — standups, retros, stakeholder updates, risk assessments.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7 text-apple-blue" />
              </div>
              <h3 className="text-lg font-semibold text-apple-black dark:text-white mb-3">
                Community-driven
              </h3>
              <p className="text-apple-gray-500 dark:text-apple-gray-400 text-sm leading-relaxed">
                The best prompts come from practitioners. Our community of PMs contribute, rate, and refine prompts so the library keeps getting better.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-apple-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Zap className="w-7 h-7 text-apple-blue" />
              </div>
              <h3 className="text-lg font-semibold text-apple-black dark:text-white mb-3">
                Immediate value
              </h3>
              <p className="text-apple-gray-500 dark:text-apple-gray-400 text-sm leading-relaxed">
                No setup, no training. Copy a prompt, paste it into your AI tool, get useful output in seconds. That&apos;s the bar we hold ourselves to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-apple-black dark:text-white mb-4">
            Ready to try it?
          </h2>
          <p className="text-apple-gray-500 dark:text-apple-gray-400 mb-8">
            Join thousands of PMs using AI prompts to ship faster.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-3 bg-apple-blue hover:bg-apple-blue-hover text-white font-medium rounded-full transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
