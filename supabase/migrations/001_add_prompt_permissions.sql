-- Migration: Add permission, versioning, and approval fields to prompts
-- Run this in your Supabase SQL Editor after the base schema

alter table public.prompts
  add column if not exists is_standard boolean not null default false,
  add column if not exists is_locked   boolean not null default false,
  add column if not exists version     text,
  add column if not exists version_updated_at timestamp with time zone,
  add column if not exists approval_status text
    check (approval_status in ('pending_review', 'approved', 'rejected'));

-- Index to quickly surface pending items in the review queue
create index if not exists prompts_approval_status_idx
  on public.prompts(approval_status);

-- Backfill: treat all existing prompts as already approved
update public.prompts
set approval_status = 'approved'
where approval_status is null;
