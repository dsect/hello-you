-- Create test tables for CI/CD testing

-- Create a simple test table
CREATE TABLE IF NOT EXISTS test_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a posts table for testing relationships
CREATE TABLE IF NOT EXISTS test_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  user_id INTEGER REFERENCES test_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for testing
ALTER TABLE test_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_posts ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for testing)
CREATE POLICY "Allow all operations on test_users" ON test_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on test_posts" ON test_posts FOR ALL USING (true);