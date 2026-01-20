
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
