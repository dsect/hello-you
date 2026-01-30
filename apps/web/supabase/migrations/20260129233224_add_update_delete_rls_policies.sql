-- Add UPDATE and DELETE policies for us_state_selections
-- Currently allowing anonymous users, but designed to be auth-ready
-- TODO: When authentication is implemented, change these policies to:
--   - for update to authenticated using (auth.uid() = user_id)
--   - for delete to authenticated using (auth.uid() = user_id)
-- And add a user_id column to us_state_selections table

create policy "Allow anonymous update to us_state_selections"
  on public.us_state_selections for update to anon using (true);

create policy "Allow anonymous delete from us_state_selections"
  on public.us_state_selections for delete to anon using (true);
