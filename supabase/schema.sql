-- PromptVault Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Teams table
create table public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Team members table
create table public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, user_id)
);

-- Prompts table
create table public.prompts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  content text not null,
  category text not null,
  tags text[] default '{}',
  author_id uuid references public.profiles(id) on delete set null,
  team_id uuid references public.teams(id) on delete cascade,
  is_public boolean default true,
  use_count integer default 0
);

-- Saved prompts table (many-to-many relationship)
create table public.saved_prompts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  prompt_id uuid references public.prompts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, prompt_id)
);

-- Prompt folders table
create table public.prompt_folders (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  team_id uuid references public.teams(id) on delete cascade,
  color text not null default '#3b82f6',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add folder_id to saved_prompts (nullable — null means "unsorted")
alter table public.saved_prompts add column if not exists folder_id uuid references public.prompt_folders(id) on delete set null;

-- Community submissions table (pending review)
create table public.community_submissions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  content text not null,
  category text not null,
  tags text[] default '{}',
  submitter_email text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Prompt ratings table
create table public.prompt_ratings (
  id uuid default uuid_generate_v4() primary key,
  prompt_id uuid references public.prompts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(prompt_id, user_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.prompts enable row level security;
alter table public.saved_prompts enable row level security;
alter table public.community_submissions enable row level security;
alter table public.prompt_ratings enable row level security;
alter table public.prompt_folders enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Teams policies
create policy "Team members can view their teams"
  on public.teams for select
  using (id in (select team_id from public.team_members where user_id = auth.uid()));

create policy "Authenticated users can create teams"
  on public.teams for insert
  with check (auth.uid() = owner_id);

create policy "Team owners can update their teams"
  on public.teams for update
  using (auth.uid() = owner_id);

-- Team members policies
create policy "Team members can view their team membership"
  on public.team_members for select
  using (team_id in (select team_id from public.team_members where user_id = auth.uid()));

create policy "Team owners can add members"
  on public.team_members for insert
  with check (
    team_id in (select id from public.teams where owner_id = auth.uid())
    or user_id = auth.uid()
  );

create policy "Team owners can remove members"
  on public.team_members for delete
  using (team_id in (select id from public.teams where owner_id = auth.uid()));

-- Prompts policies
-- Community prompts (public, no team) are viewable by everyone
create policy "Community prompts are viewable by everyone"
  on public.prompts for select
  using (is_public = true and team_id is null);

-- Team prompts are viewable by team members
create policy "Team members can view team prompts"
  on public.prompts for select
  using (team_id in (select team_id from public.team_members where user_id = auth.uid()));

-- Authenticated users can insert prompts (team or public)
create policy "Authenticated users can insert prompts"
  on public.prompts for insert
  with check (auth.uid() is not null);

create policy "Users can update own prompts"
  on public.prompts for update
  using (auth.uid() = author_id);

create policy "Users can delete own prompts"
  on public.prompts for delete
  using (auth.uid() = author_id);

-- Saved prompts policies
create policy "Users can view own saved prompts"
  on public.saved_prompts for select
  using (auth.uid() = user_id);

create policy "Users can save prompts"
  on public.saved_prompts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own saved prompts"
  on public.saved_prompts for update
  using (auth.uid() = user_id);

create policy "Users can unsave prompts"
  on public.saved_prompts for delete
  using (auth.uid() = user_id);

-- Community submissions policies
create policy "Anyone can submit community prompts"
  on public.community_submissions for insert
  with check (true);

create policy "Admins can view all submissions"
  on public.community_submissions for select
  using (auth.uid() is not null);

-- Prompt ratings policies
create policy "Anyone can view ratings"
  on public.prompt_ratings for select
  using (true);

create policy "Authenticated users can rate"
  on public.prompt_ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own rating"
  on public.prompt_ratings for update
  using (auth.uid() = user_id);

-- Prompt folders policies
create policy "Users can view own folders"
  on public.prompt_folders for select
  using (auth.uid() = user_id);

create policy "Users can create folders"
  on public.prompt_folders for insert
  with check (auth.uid() = user_id);

create policy "Users can update own folders"
  on public.prompt_folders for update
  using (auth.uid() = user_id);

create policy "Users can delete own folders"
  on public.prompt_folders for delete
  using (auth.uid() = user_id);

-- Function to handle new user signup (creates profile + personal team)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_team_id uuid;
begin
  -- Create profile
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Create personal team
  new_team_id := uuid_generate_v4();
  insert into public.teams (id, name, owner_id)
  values (new_team_id, coalesce(new.raw_user_meta_data->>'full_name', 'My Team') || '''s Team', new.id);

  -- Add user as team owner
  insert into public.team_members (team_id, user_id, role)
  values (new_team_id, new.id, 'owner');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to increment use count
create or replace function public.increment_use_count(prompt_uuid uuid)
returns void as $$
begin
  update public.prompts
  set use_count = use_count + 1
  where id = prompt_uuid;
end;
$$ language plpgsql security definer;

-- Indexes for better performance
create index prompts_category_idx on public.prompts(category);
create index prompts_is_public_idx on public.prompts(is_public);
create index prompts_author_id_idx on public.prompts(author_id);
create index prompts_team_id_idx on public.prompts(team_id);
create index saved_prompts_user_id_idx on public.saved_prompts(user_id);
create index saved_prompts_prompt_id_idx on public.saved_prompts(prompt_id);
create index team_members_user_id_idx on public.team_members(user_id);
create index team_members_team_id_idx on public.team_members(team_id);
create index community_submissions_status_idx on public.community_submissions(status);
create index prompt_ratings_prompt_id_idx on public.prompt_ratings(prompt_id);
create index prompt_ratings_user_id_idx on public.prompt_ratings(user_id);
create index prompt_folders_user_id_idx on public.prompt_folders(user_id);
create index saved_prompts_folder_id_idx on public.saved_prompts(folder_id);
