-- PromptFlow Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
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

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.prompts enable row level security;
alter table public.saved_prompts enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Prompts policies
create policy "Public prompts are viewable by everyone"
  on public.prompts for select
  using (is_public = true);

create policy "Authenticated users can view all prompts"
  on public.prompts for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own prompts"
  on public.prompts for insert
  with check (auth.uid() = author_id);

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

create policy "Users can unsave prompts"
  on public.saved_prompts for delete
  using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
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
create index saved_prompts_user_id_idx on public.saved_prompts(user_id);
create index saved_prompts_prompt_id_idx on public.saved_prompts(prompt_id);
