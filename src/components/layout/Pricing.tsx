'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Send } from 'lucide-react'

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
    features: [
      'Access to all prompts',
      'Save up to 10 prompts',
      'Basic search & filters',
      'Contribute prompts',
      'Community support',
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
    description: 'For PM teams ready to scale',
    features: [
      'Everything in Free',
      'Unlimited saved prompts',
      'Unlimited team members',
      'Share prompts with your team',
      'Team activity stream',
      'Prompt success rate tracking',
      'Analytics dashboard',
      'SSO integration',
      'Priority support',
    ],
    cta: 'Contact Sales',
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
    plan: 'Team',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Build mailto link with form data as body
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-dark-border">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Contact Sales
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Thanks for reaching out!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We&apos;ll get back to you shortly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>

            {/* Current Tool */}
            <div>
              <label htmlFor="contact-tool" className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
                Current Tool <span className="text-red-500">*</span>
              </label>
              <select
                id="contact-tool"
                required
                value={formData.currentTool}
                onChange={(e) => setFormData({ ...formData, currentTool: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="">Select your PM tool...</option>
                {PM_TOOL_OPTIONS.map((tool) => (
                  <option key={tool} value={tool}>{tool}</option>
                ))}
              </select>
            </div>

            {/* Which Plan */}
            <div>
              <label htmlFor="contact-plan" className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
                Which Plan <span className="text-red-500">*</span>
              </label>
              <select
                id="contact-plan"
                required
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
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
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white font-medium rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
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
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card p-8 relative ${
                plan.popular
                  ? 'border-primary-500 dark:border-primary-500 ring-2 ring-primary-500/20'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {plan.period}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.isContact ? (
                <button
                  onClick={() => setShowContactModal(true)}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all btn-secondary`}
                >
                  {plan.cta}
                </button>
              ) : (
                <Link
                  href={plan.href}
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'btn-primary w-full'
                      : 'btn-secondary w-full'
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </section>
  )
}
