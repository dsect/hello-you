
-- Migration: Create state_visits table

create table if not exists public.state_visits (
  id bigint primary key generated always as identity,
  state_code text not null references public.us_states(code),
  visited_at timestamptz not null default now(),
  notes text,
  constraint unique_state_visit unique(state_code)
);
