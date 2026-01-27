'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out PromptFlow',
    features: [
      'Access to 25 prompts',
      'Basic search',
      'Save up to 5 prompts',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For serious project managers',
    features: [
      'Access to all 100+ prompts',
      'Advanced search & filters',
      'Unlimited saved prompts',
      'Custom prompt creation',
      'Priority support',
      'Early access to new prompts',
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/user/month',
    description: 'For PM teams and organizations',
    features: [
      'Everything in Pro',
      'Team prompt sharing',
      'Admin dashboard',
      'Custom branding',
      'SSO integration',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
]

export function Pricing() {
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

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
