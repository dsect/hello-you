-- Enable RLS and ensure anonymous policies exist (idempotent)
-- Created to ensure RLS and full policy coverage for us_states and us_state_selections

ALTER TABLE IF EXISTS public.us_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.us_state_selections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='us_states'
      AND policyname='Allow anonymous read access to us_states'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow anonymous read access to us_states" ON public.us_states FOR SELECT TO anon USING (true);';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='us_state_selections'
      AND policyname='Allow anonymous read access to us_state_selections'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow anonymous read access to us_state_selections" ON public.us_state_selections FOR SELECT TO anon USING (true);';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='us_state_selections'
      AND policyname='Allow anonymous insert to us_state_selections'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow anonymous insert to us_state_selections" ON public.us_state_selections FOR INSERT TO anon WITH CHECK (true);';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='us_state_selections'
      AND policyname='Allow anonymous update to us_state_selections'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow anonymous update to us_state_selections" ON public.us_state_selections FOR UPDATE TO anon USING (true);';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='us_state_selections'
      AND policyname='Allow anonymous delete from us_state_selections'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow anonymous delete from us_state_selections" ON public.us_state_selections FOR DELETE TO anon USING (true);';
  END IF;
END
$$;
