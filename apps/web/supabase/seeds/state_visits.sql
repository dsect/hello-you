-- Seed state_visits table with example data (idempotent)
INSERT INTO public.state_visits (state_code, visited_at, notes)
VALUES
  ('CA', '2025-12-15 10:30:00+00', 'Amazing trip to San Francisco and Yosemite'),
  ('TX', '2025-11-20 14:00:00+00', 'Visited Austin for a tech conference'),
  ('FL', '2026-01-05 09:00:00+00', NULL),
  ('NY', '2025-10-10 16:45:00+00', 'Broadway shows and Central Park'),
  ('WA', '2025-09-01 08:00:00+00', NULL)
ON CONFLICT (state_code) DO NOTHING;
