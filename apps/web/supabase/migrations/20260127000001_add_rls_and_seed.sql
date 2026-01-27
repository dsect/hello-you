-- Migration: Add RLS policies and seed data for us_states

-- Enable RLS on both tables
alter table public.us_states enable row level security;
alter table public.us_state_selections enable row level security;

-- Allow anonymous read access to us_states
create policy "Allow anonymous read access to us_states"
  on public.us_states
  for select
  to anon
  using (true);

-- Allow anonymous insert to us_states (for CI seeding)
create policy "Allow anonymous insert to us_states"
  on public.us_states
  for insert
  to anon
  with check (true);

-- Allow anonymous read/insert access to us_state_selections
create policy "Allow anonymous read access to us_state_selections"
  on public.us_state_selections
  for select
  to anon
  using (true);

create policy "Allow anonymous insert to us_state_selections"
  on public.us_state_selections
  for insert
  to anon
  with check (true);

-- Seed US states data (idempotent)
insert into public.us_states (name, code)
values
  ('Alabama', 'AL'),
  ('Alaska', 'AK'),
  ('Arizona', 'AZ'),
  ('Arkansas', 'AR'),
  ('California', 'CA'),
  ('Colorado', 'CO'),
  ('Connecticut', 'CT'),
  ('Delaware', 'DE'),
  ('Florida', 'FL'),
  ('Georgia', 'GA'),
  ('Hawaii', 'HI'),
  ('Idaho', 'ID'),
  ('Illinois', 'IL'),
  ('Indiana', 'IN'),
  ('Iowa', 'IA'),
  ('Kansas', 'KS'),
  ('Kentucky', 'KY'),
  ('Louisiana', 'LA'),
  ('Maine', 'ME'),
  ('Maryland', 'MD'),
  ('Massachusetts', 'MA'),
  ('Michigan', 'MI'),
  ('Minnesota', 'MN'),
  ('Mississippi', 'MS'),
  ('Missouri', 'MO'),
  ('Montana', 'MT'),
  ('Nebraska', 'NE'),
  ('Nevada', 'NV'),
  ('New Hampshire', 'NH'),
  ('New Jersey', 'NJ'),
  ('New Mexico', 'NM'),
  ('New York', 'NY'),
  ('North Carolina', 'NC'),
  ('North Dakota', 'ND'),
  ('Ohio', 'OH'),
  ('Oklahoma', 'OK'),
  ('Oregon', 'OR'),
  ('Pennsylvania', 'PA'),
  ('Rhode Island', 'RI'),
  ('South Carolina', 'SC'),
  ('South Dakota', 'SD'),
  ('Tennessee', 'TN'),
  ('Texas', 'TX'),
  ('Utah', 'UT'),
  ('Vermont', 'VT'),
  ('Virginia', 'VA'),
  ('Washington', 'WA'),
  ('West Virginia', 'WV'),
  ('Wisconsin', 'WI'),
  ('Wyoming', 'WY')
on conflict (code) do nothing;
