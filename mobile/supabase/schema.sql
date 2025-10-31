-- Enable required extensions
create extension if not exists "uuid-ossp";

create type if not exists pass_type as enum ('guest', 'account', 'gamer', 'flow');

-- Users table
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  pass_type pass_type not null default 'guest',
  coins integer not null default 0,
  gold integer not null default 0,
  last_login timestamptz,
  streak_count integer not null default 0,
  auth_provider text not null default 'supabase',
  created_at timestamptz not null default timezone('utc', now())
);

-- Journal entries
create table if not exists public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  content text not null,
  tone text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Quotes
create table if not exists public.quotes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users (id) on delete cascade,
  text text not null,
  author text,
  tone text,
  source text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Goals
create table if not exists public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  importance numeric(4,2) default 0,
  urgency numeric(4,2) default 0,
  energy numeric(4,2) default 0,
  resonance numeric(4,2) default 0,
  priority_score numeric(6,2) generated always as ((coalesce(importance,0) + coalesce(urgency,0) + coalesce(resonance,0)) / greatest(nullif(coalesce(energy,1),0), 1)) stored,
  goal_id uuid references public.goals (id) on delete set null,
  done_at timestamptz
);

-- Habits
create table if not exists public.habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  goal_id uuid references public.goals (id) on delete set null,
  consistency numeric(5,2) default 0,
  streak integer default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

-- Prayers
create table if not exists public.prayers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  category text,
  text text not null,
  created_at timestamptz not null default timezone('utc', now())
);

-- Files
create table if not exists public.files (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  type text,
  url text not null,
  tags text[],
  linked_task_id uuid references public.tasks (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

-- Trigger: create quote when a prayer is added
create or replace function public.sync_prayer_to_quote()
returns trigger as $$
begin
  insert into public.quotes (user_id, text, author, tone, source, created_at)
  values (
    new.user_id,
    new.text,
    coalesce(new.category, 'Prayer'),
    'devotional',
    'ekklesion_auto',
    new.created_at
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_prayer_to_quote
after insert on public.prayers
for each row execute function public.sync_prayer_to_quote();

-- Trigger: optional AI summary when a journal entry is added
create or replace function public.sync_journal_to_quote()
returns trigger as $$
begin
  if new.tone is not null and length(trim(coalesce(new.content, ''))) > 0 then
    insert into public.quotes (user_id, text, author, tone, source, created_at)
    values (
      new.user_id,
      left(new.content, 240),
      'Luminote Auto Summary',
      new.tone,
      'luminote_auto',
      new.created_at
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_journal_to_quote
after insert on public.journal_entries
for each row execute function public.sync_journal_to_quote();
