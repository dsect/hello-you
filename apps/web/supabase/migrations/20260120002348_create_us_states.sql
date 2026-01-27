
-- Migration: Create us_states and us_state_selections tables

create table if not exists public.us_states (
  id bigint primary key generated always as identity,
  name text not null,
  code text not null unique
);

create table if not exists public.us_state_selections (
  id bigint primary key generated always as identity,
  state_code text not null references public.us_states(code),
  selected_at timestamptz not null default now()
);

-- Enable RLS
alter table public.us_states enable row level security;
alter table public.us_state_selections enable row level security;

-- Allow anonymous read access to us_states
create policy "Allow anonymous read access to us_states"
  on public.us_states for select to anon using (true);

-- Allow anonymous read/insert access to us_state_selections
create policy "Allow anonymous read access to us_state_selections"
  on public.us_state_selections for select to anon using (true);

create policy "Allow anonymous insert to us_state_selections"
  on public.us_state_selections for insert to anon with check (true);
