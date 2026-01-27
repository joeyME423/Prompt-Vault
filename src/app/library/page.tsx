'use client'

import { useState } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PromptCard } from '@/components/prompts/PromptCard'
import type { Prompt } from '@/types'

// Sample data - replace with Supabase data
const samplePrompts: Prompt[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    title: 'Project Status Report Generator',
    description: 'Generate comprehensive weekly status reports with key metrics, accomplishments, and blockers.',
    content: 'Act as a senior project manager. Create a detailed weekly status report for [PROJECT NAME] that includes: 1) Executive summary (2-3 sentences), 2) Key accomplishments this week, 3) Tasks in progress, 4) Blockers and risks with mitigation plans, 5) Next week priorities, 6) Key metrics/KPIs. Format the report for executive stakeholders.',
    category: 'Reporting',
    tags: ['status', 'weekly', 'stakeholders'],
    author_id: null,
    is_public: true,
    use_count: 1234,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    title: 'Meeting Agenda Creator',
    description: 'Create structured meeting agendas that keep discussions focused and productive.',
    content: 'Create a meeting agenda for a [MEETING TYPE] meeting about [TOPIC]. Include: 1) Meeting objective, 2) Required attendees and their roles, 3) Time-boxed agenda items with owners, 4) Pre-read materials needed, 5) Expected outcomes/decisions. Total meeting duration: [DURATION].',
    category: 'Communication',
    tags: ['meetings', 'agenda', 'productivity'],
    author_id: null,
    is_public: true,
    use_count: 987,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    title: 'Risk Assessment Matrix',
    description: 'Identify and analyze project risks with probability, impact, and mitigation strategies.',
    content: 'Act as a risk management expert. For the project [PROJECT NAME], identify the top 10 potential risks. For each risk, provide: 1) Risk description, 2) Probability (High/Medium/Low), 3) Impact (High/Medium/Low), 4) Risk score, 5) Mitigation strategy, 6) Contingency plan, 7) Risk owner. Present in a table format.',
    category: 'Risk',
    tags: ['risk', 'analysis', 'mitigation'],
    author_id: null,
    is_public: true,
    use_count: 756,
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    title: 'Sprint Planning Assistant',
    description: 'Plan sprints effectively with user story refinement and capacity planning.',
    content: 'Help me plan a [DURATION]-week sprint for my [TEAM SIZE]-person team. Given these user stories: [STORIES], help me: 1) Estimate story points using Fibonacci scale, 2) Identify dependencies, 3) Suggest sprint goal, 4) Calculate team capacity, 5) Recommend which stories to include, 6) Identify potential risks.',
    category: 'Planning',
    tags: ['agile', 'sprint', 'planning'],
    author_id: null,
    is_public: true,
    use_count: 654,
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    title: 'Stakeholder Communication Email',
    description: 'Draft professional emails to stakeholders about project updates, changes, or issues.',
    content: 'Write a professional email to [STAKEHOLDER ROLE] about [TOPIC]. Context: [CONTEXT]. The email should: 1) Be concise yet comprehensive, 2) Lead with the most important information, 3) Include clear action items if needed, 4) Maintain a [TONE: formal/friendly] tone, 5) End with next steps.',
    category: 'Stakeholder',
    tags: ['email', 'communication', 'stakeholder'],
    author_id: null,
    is_public: true,
    use_count: 543,
  },
  {
    id: '6',
    created_at: new Date().toISOString(),
    title: 'Project Charter Template',
    description: 'Create a comprehensive project charter to kickstart new projects.',
    content: 'Create a project charter for [PROJECT NAME]. Include: 1) Project purpose and justification, 2) Measurable objectives and success criteria, 3) High-level requirements, 4) Project scope (in/out), 5) Key milestones and timeline, 6) Budget summary, 7) Key stakeholders and roles, 8) Assumptions and constraints, 9) Risks, 10) Approval signatures needed.',
    category: 'Planning',
    tags: ['charter', 'initiation', 'planning'],
    author_id: null,
    is_public: true,
    use_count: 432,
  },
]

const categories = ['Planning', 'Communication', 'Reporting', 'Risk', 'Stakeholder']

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredPrompts = samplePrompts.filter((prompt) => {
    const matchesSearch =
      searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === null || prompt.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Prompt Library
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Browse our collection of AI prompts designed for project managers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title, description, or tag..."
            />
          </div>
          <div className="flex justify-center">
            <FilterTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''}
        </p>

        {/* Prompts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {/* Empty state */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No prompts found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
