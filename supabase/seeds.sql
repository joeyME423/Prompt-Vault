-- PromptVault Seed Data
-- Standard PMO prompts — public community prompts, pre-approved
-- Run this after schema.sql AND migrations/001_add_prompt_permissions.sql

insert into public.prompts
  (title, description, content, category, tags, is_public, is_standard, is_locked,
   version, version_updated_at, approval_status, use_count)
values

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Meeting Action Item Follow-up
-- ─────────────────────────────────────────────────────────────────────────────
(
  'Meeting Action Item Follow-up',
  'Post-meeting nudge email that surfaces every open item, owner, and due date in one scannable message. Natural companion to Meeting Notes Synthesizer.',
  $prompt$You are a professional project manager. Using the meeting notes below, draft a follow-up email to all attendees that:

- Opens with a 1–2 sentence summary of what was decided or agreed
- Lists every action item in a table with three columns: Action | Owner | Due Date
- Flags any items that are overdue or have no assigned owner
- Closes with the date and time of the next scheduled touchpoint (if known)

Tone: professional but direct. Skip pleasantries. The email should be ready to send with only minor personalisation edits.

---
Meeting notes:
[PASTE MEETING NOTES HERE]$prompt$,
  'Meetings',
  array['action items', 'follow-up', 'email', 'accountability', 'meetings'],
  true, true, false,
  '1.0', now(), 'approved', 47
),

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Budget Variance Explanation
-- ─────────────────────────────────────────────────────────────────────────────
(
  'Budget Variance Explanation',
  'Plain-language explanation of a cost over/under run for stakeholders — practical and direct, not academic. No finance jargon.',
  $prompt$You are a project manager explaining a budget variance to non-financial stakeholders.

Project: [PROJECT NAME]
Reporting period: [MONTH / QUARTER]
Approved budget: $[AMOUNT]
Actual spend: $[AMOUNT]
Variance: $[AMOUNT] ([OVER / UNDER] budget)

Write a plain-language explanation (3–5 short paragraphs) that:

1. States the variance clearly in the first sentence — no burying the lead
2. Identifies the top 2–3 root causes with specifics, not vague excuses
3. Describes what corrective actions are in place or planned
4. Ends with a revised forecast and a confidence level (High / Medium / Low)

Rules:
- No finance jargon (no "encumbrances", "accruals", or "burn rate" without explanation)
- Write as if explaining to a smart VP who has 90 seconds to read this
- If the variance is under budget, explain that too — don't just celebrate it$prompt$,
  'Reporting',
  array['budget', 'variance', 'finance', 'reporting', 'stakeholders', 'cost'],
  true, true, false,
  '1.0', now(), 'approved', 31
),

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Project Handoff Brief
-- ─────────────────────────────────────────────────────────────────────────────
(
  'Project Handoff Brief',
  'Structured transition document for when a PM rolls off a project. Covers status, open issues, key contacts, risk watch list, and exactly what the incoming PM must do in the first 30 days.',
  $prompt$You are a project manager preparing to transition off [PROJECT NAME]. Create a structured handoff brief the incoming PM can act on immediately.

Use the context I provide below and produce the following sections:

**1. Project Snapshot**
- Current status (Red / Amber / Green), phase, and % complete
- Original baseline dates vs. current forecast
- Budget: approved vs. spent vs. remaining

**2. Open Items & Pending Decisions**
Bulleted list — for each item include: description, owner, urgency (High / Med / Low), and any hard deadline.

**3. Key Stakeholders & Contacts**
| Name | Role | Relationship notes | Best way to reach |
Include any political dynamics or sensitivities worth knowing.

**4. Risks & Watch Items**
| Risk | Likelihood | Impact | Current mitigation |
Flag anything that could blow up in the next 60 days.

**5. Where Everything Lives**
Links or locations for: project plan, status reports, budget tracker, RAID log, decisions log, team channel.

**6. First 30 Days — Incoming PM Priorities**
Numbered action list with suggested deadlines. Start with the most urgent.

Use plain language. Mark anything needing immediate attention with [⚠ URGENT].

---
Project context (paste notes, status updates, or a data dump):
[PASTE HERE]$prompt$,
  'Planning',
  array['handoff', 'transition', 'planning', 'documentation', 'onboarding', 'knowledge transfer'],
  true, true, false,
  '1.0', now(), 'approved', 28
),

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Escalation Email
-- ─────────────────────────────────────────────────────────────────────────────
(
  'Escalation Email',
  'Structured, direct escalation to an executive or senior stakeholder. Opens with the ask, explains impact and what''s been tried, and offers a clear path forward. Under 200 words.',
  $prompt$You are a project manager drafting an escalation email to [RECIPIENT / EXECUTIVE NAME].

Fill in the context below before generating:

- Issue: [DESCRIBE THE PROBLEM IN ONE SENTENCE]
- Impact: [WHAT IS BLOCKED, AT RISK, OR DELAYED — BE SPECIFIC]
- Duration: [HOW LONG HAS THIS BEEN UNRESOLVED]
- Already tried: [WHAT STEPS HAVE ALREADY BEEN TAKEN TO RESOLVE IT]
- What I need: [SPECIFIC DECISION, RESOURCE, APPROVAL, OR UNBLOCK REQUIRED]
- Decision deadline: [DATE — WHY THIS DATE MATTERS]

Write a concise escalation email (target: under 200 words) that:

1. Opens with one sentence stating exactly what you need and by when
2. Explains the issue and its impact in 2–3 tight bullet points
3. Lists what has already been attempted (shows due diligence)
4. Makes a specific, unambiguous ask
5. Offers two possible paths forward if a binary decision is needed
6. Closes with your name and best contact number

Rules:
- Do not soften the urgency to spare feelings
- Be respectful but ruthlessly direct
- No throat-clearing or pleasantries in the opening
- No passive voice$prompt$,
  'Communication',
  array['escalation', 'email', 'communication', 'risk', 'executive', 'blocker'],
  true, true, false,
  '1.1', now(), 'approved', 62
),

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Project Health Dashboard Summary
-- ─────────────────────────────────────────────────────────────────────────────
(
  'Project Health Dashboard Summary',
  'Rolls up multi-project portfolio status into one exec-facing summary — snapshot, RAG table, top issues needing decisions, wins, and upcoming choices. Fits on one page.',
  $prompt$You are a PMO analyst preparing an executive-facing portfolio health summary for [REPORTING PERIOD, e.g. "April 2026"].

I will provide project data below. For each project I'll give: name, RAG status, phase, key milestone, and any flags.

Produce a summary with these sections:

**Portfolio Snapshot** *(1 short paragraph, 3–4 sentences)*
Overall health, any systemic themes, and the single most important thing leadership should know right now.

**Project Status at a Glance**
| Project | Status | Phase | Next Milestone | Due | Flag |
Use 🟢 🟡 🔴 for status. Keep flag notes to ≤8 words.

**Top Items Requiring Executive Attention** *(max 3)*
For each: issue, affected project(s), recommended action, owner, and decision-by date.

**Wins This Period**
2–3 bullets. Concrete, not generic ("shipped X", "resolved Y", not "good progress").

**Decisions Needed in the Next 30 Days**
| Decision | Project | Needed By | Decision Owner |

Formatting rules:
- Entire summary must fit on one page (≈500 words max)
- Use exec-friendly language — no PM jargon, no acronyms without expansion
- Lead with risk, not optimism

---
Project data:
[PASTE PROJECT STATUS DATA HERE — one project per line or as a table]$prompt$,
  'Reporting',
  array['dashboard', 'portfolio', 'executive', 'reporting', 'PMO', 'health', 'multi-project'],
  true, true, false,
  '1.0', now(), 'approved', 39
);
