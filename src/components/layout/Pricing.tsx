import Link from 'next/link'
import { Target, MessageSquare, ListChecks, RefreshCw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'

const bestPractices = [
  {
    icon: Target,
    title: 'Be Specific',
    description: 'Tell the AI exactly what role you need it to play and what output you expect. "Write a status update" is vague — "Write a weekly status update for my VP of Engineering covering sprint progress, blockers, and next steps" is actionable.',
  },
  {
    icon: MessageSquare,
    title: 'Include Context',
    description: 'Give the AI the background it needs. Mention your team size, methodology (Agile, Waterfall), tools you use, and who the audience is. More context = better output.',
  },
  {
    icon: ListChecks,
    title: 'Define the Format',
    description: 'Specify exactly how you want the output structured. Ask for bullet points, tables, numbered lists, or specific sections. This prevents rambling and gets you copy-paste-ready results.',
  },
  {
    icon: RefreshCw,
    title: 'Iterate and Refine',
    description: 'Your first prompt rarely nails it. Treat prompting like a conversation — review the output, adjust your instructions, and re-run. Save versions that work well to your library.',
  },
]

const goodExample = {
  label: 'Good Prompt',
  text: 'You are a senior project manager. Write a stakeholder update email for a Q1 product launch that is 2 weeks behind schedule. Include: current status, reason for delay (vendor dependency), revised timeline, mitigation steps, and what stakeholders need to do. Keep it under 300 words. Tone: professional but transparent.',
}

const badExample = {
  label: 'Weak Prompt',
  text: 'Write me a project update email.',
}

const steps = [
  { step: '1', title: 'Start with a role', description: 'Tell the AI who it should be: "You are a scrum master with 10 years of experience..."' },
  { step: '2', title: 'State the task', description: 'Be clear about what you need: a document, analysis, email, checklist, or decision framework.' },
  { step: '3', title: 'Add constraints', description: 'Define length, tone, format, audience, and any specific requirements or data to include.' },
  { step: '4', title: 'Provide examples', description: 'If possible, show the AI what good output looks like or reference a template you want it to follow.' },
  { step: '5', title: 'Save what works', description: 'When you get a great result, save the prompt to your PromptVault library so you and your team can reuse it.' },
]

export function PromptGuide() {
  return (
    <section id="prompt-guide" className="py-28 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-semibold text-apple-black dark:text-white mb-4">
            How to Write Great PM Prompts
          </h2>
          <p className="text-lg text-apple-gray-500 dark:text-apple-gray-400 max-w-2xl mx-auto">
            A good prompt is the difference between useless AI output and something you can actually ship.
            Here&apos;s how to get it right.
          </p>
        </div>

        {/* Best Practices Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-24">
          {bestPractices.map((practice) => (
            <div
              key={practice.title}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-apple-gray-200 dark:border-dark-border"
            >
              <div className="w-10 h-10 bg-apple-blue/10 rounded-xl flex items-center justify-center mb-4">
                <practice.icon className="w-5 h-5 text-apple-blue" />
              </div>
              <h3 className="text-lg font-semibold text-apple-black dark:text-white mb-2">
                {practice.title}
              </h3>
              <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 leading-relaxed">
                {practice.description}
              </p>
            </div>
          ))}
        </div>

        {/* Good vs Bad Example */}
        <div className="max-w-4xl mx-auto mb-24">
          <h3 className="text-2xl font-semibold text-apple-black dark:text-white text-center mb-10">
            See the difference
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bad example */}
            <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {badExample.label}
                </span>
              </div>
              <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 font-mono bg-white dark:bg-dark-card rounded-xl p-4 border border-apple-gray-200 dark:border-dark-border">
                {badExample.text}
              </p>
              <p className="mt-3 text-xs text-apple-gray-400">
                Too vague. The AI has no idea about scope, audience, tone, or format.
              </p>
            </div>

            {/* Good example */}
            <div className="rounded-2xl border border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {goodExample.label}
                </span>
              </div>
              <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 font-mono bg-white dark:bg-dark-card rounded-xl p-4 border border-apple-gray-200 dark:border-dark-border">
                {goodExample.text}
              </p>
              <p className="mt-3 text-xs text-apple-gray-400">
                Specific role, clear task, defined format, constraints, and tone.
              </p>
            </div>
          </div>
        </div>

        {/* Step by Step */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold text-apple-black dark:text-white text-center mb-10">
            Build a prompt in 5 steps
          </h3>
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-4 bg-apple-gray-50 dark:bg-dark-surface rounded-2xl p-5 border border-apple-gray-200 dark:border-dark-border"
              >
                <div className="w-8 h-8 bg-apple-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                  {step.step}
                </div>
                <div>
                  <h4 className="font-semibold text-apple-black dark:text-white mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/app/community"
            className="inline-flex items-center gap-2 px-8 py-3 bg-apple-blue hover:bg-apple-blue-hover text-white font-medium rounded-full transition-colors"
          >
            Browse Community Prompts
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 text-sm text-apple-gray-400">
            100% free. No account required to browse.
          </p>
        </div>
      </div>
    </section>
  )
}
