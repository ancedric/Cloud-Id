-- CRM Prospection: schema Supabase (PostgreSQL)

create extension if not exists pgcrypto;

create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null,
  position text,
  platform text not null default 'LinkedIn',
  linkedin_url text,
  sector text,
  company_size text,
  status text not null default 'À contacter',
  last_action text,
  last_interaction_date timestamptz,
  next_action text,
  next_action_date date,
  has_replied boolean not null default false,
  questions_count integer not null default 0,
  average_reply_hours integer not null default 48,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  type text not null,
  content text not null,
  asked_question boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_prospects_status on public.prospects(status);
create index if not exists idx_prospects_next_action_date on public.prospects(next_action_date);
create index if not exists idx_interactions_prospect_id on public.interactions(prospect_id);

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_prospects_updated_at on public.prospects;
create trigger trg_prospects_updated_at
before update on public.prospects
for each row execute procedure public.set_updated_at();

-- Option RLS minimal (à adapter à ton auth globale)
alter table public.prospects enable row level security;
alter table public.interactions enable row level security;

-- Exemple permissif (MVP interne) :
-- create policy "allow all prospects" on public.prospects for all using (true) with check (true);
-- create policy "allow all interactions" on public.interactions for all using (true) with check (true);
