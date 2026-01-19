-- Migration: Create click_events table for local Supabase
CREATE TABLE IF NOT EXISTS click_events (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_type TEXT NOT NULL
);
