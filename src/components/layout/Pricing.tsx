'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Send, Zap } from 'lucide-react'

const CONTACT_EMAIL = 'josephe1994@icloud.com'

const PM_TOOL_OPTIONS = [
  'Wrike',
  'Asana',
  'ClickUp',
  'Monday.com',
  'Smartsheet',
  'Jira',
  'Other',
]

const PLAN_OPTIONS = ['Pro']

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with AI prompts for PM',
    badge: null,
    features: [
      { text: '1 user', included: true },
      { text: '5 custom prompts', included: true },
      { text: 'Public prompt library', included: true },
      { text: 'Chrome extension', included: true },
      { text: 'Community support', included: true },
      { text: 'Team sharing', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Sign Up Free',
    href: '/auth/signup',
    popular: false,
    isContact: false,
  },
  {
    name: 'Pro',
    price: '$30',
    period: '/user/month',
    description: 'For PM teams ready to scale with AI',
    badge: '14-day free trial',
    trialNote: 'No credit card required. Asked on day 7.',
    features: [
      { text: 'Up to 10 users', included: true },
      { text: 'Unlimited custom prompts', included: true },
      { text: 'Everything in Free', included: true },
      { text: 'Team prompt sharing', included: true },
      { text: 'Team activity stream', included: true },
      { text: 'Prompt success tracking', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'SSO integration', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Start Free Trial',
    href: '#',
    popular: true,
    isContact: true,
  },
]

function ContactModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    currentTool: '',
    email: '',
    plan: 'Pro',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const subject = encodeURIComponent(`PromptVault ${formData.plan} Plan Inquiry`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCurrent Tool: ${formData.currentTool}\nInterested Plan: ${formData.plan}`
    )
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_blank')

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-apple-gray-200 dark:border-dark-border">
          <h2 className="text-xl font-semibold text-apple-black dark:text-white">
            Start Your Free Trial
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-apple-gray-400 hover:text-apple-black dark:hover:text-white hover:bg-apple-gray-50 dark:hover:bg-dark-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-apple-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-apple-black dark:text-white mb-2">
              Thanks for reaching out!
            </h3>
            <p className="text-apple-gray-500 dark:text-apple-gray-400 mb-6">
              We&apos;ll get back to you shortly with trial access.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-apple-blue hover:bg-apple-blue-hover text-white font-medium rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-apple-black dark:text-white mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-surface border border-apple-gray-200 dark:border-dark-border rounded-xl text-apple-black dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue/50"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-apple-black dark:text-white mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-surface border border-apple-gray-200 dark:border-dark-border rounded-xl text-apple-black dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue/50"
              />
            </div>

            <div>
              <label htmlFor="contact-tool" className="block text-sm font-medium text-apple-black dark:text-white mb-1.5">
                Current Tool <span className="text-red-500">*</span>
              </label>
              <select
                id="contact-tool"
                required
                value={formData.currentTool}
                onChange={(e) => setFormData({ ...formData, currentTool: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-surface border border-apple-gray-200 dark:border-dark-border rounded-xl text-apple-black dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue/50"
              >
                <option value="">Select your PM tool...</option>
                {PM_TOOL_OPTIONS.map((tool) => (
                  <option key={tool} value={tool}>{tool}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contact-plan" className="block text-sm font-medium text-apple-black dark:text-white mb-1.5">
                Which Plan <span className="text-red-500">*</span>
              </label>
              <select
                id="contact-plan"
                required
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-surface border border-apple-gray-200 dark:border-dark-border rounded-xl text-apple-black dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue/50"
              >
                {PLAN_OPTIONS.map((plan) => (
                  <option key={plan} value={plan}>{plan}</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-apple-blue hover:bg-apple-blue-hover disabled:bg-apple-blue/50 text-white font-medium rounded-full transition-colors"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Start Free Trial'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export function Pricing() {
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <section id="pricing" className="py-28 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-apple-black dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-apple-gray-500 dark:text-apple-gray-400 max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. Pro includes a 14-day free trial — no credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white dark:bg-dark-card rounded-2xl p-8 relative transition-shadow duration-300 ${
                plan.popular
                  ? 'border-2 border-apple-blue shadow-lg'
                  : 'border border-apple-gray-200 dark:border-dark-border'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-apple-blue text-white text-sm font-medium rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-apple-black dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-semibold text-apple-black dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-apple-gray-400">
                    {plan.period}
                  </span>
                </div>
                <p className="text-apple-gray-500 dark:text-apple-gray-400 mt-2 text-sm">
                  {plan.description}
                </p>
                {plan.trialNote && (
                  <p className="text-xs text-apple-blue mt-1.5 flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />
                    {plan.trialNote}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-apple-gray-300 dark:text-apple-gray-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-apple-gray-500 dark:text-apple-gray-400' : 'text-apple-gray-300 dark:text-apple-gray-500'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.isContact ? (
                <button
                  onClick={() => setShowContactModal(true)}
                  className="block w-full text-center py-3 px-6 rounded-full font-medium transition-all bg-apple-blue hover:bg-apple-blue-hover text-white"
                >
                  {plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.href}
                  className="block text-center py-3 px-6 rounded-full font-medium transition-all border border-apple-gray-300 dark:border-dark-border text-apple-black dark:text-white hover:border-apple-blue w-full"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-apple-gray-400">
            After trial ends, Pro downgrades to Free automatically. No surprise charges.
          </p>
        </div>
      </div>

      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </section>
  )
}
