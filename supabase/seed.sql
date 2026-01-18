-- Seed test data for CI/CD testing

-- Seed test data
INSERT INTO test_users (name, email) VALUES
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Smith', 'bob@example.com'),
  ('Charlie Brown', 'charlie@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO test_posts (title, content, user_id) VALUES
  ('Welcome Post', 'This is a test post for our application.', 1),
  ('Another Post', 'Testing the post functionality.', 2),
  ('Third Post', 'More test content here.', 1)
ON CONFLICT DO NOTHING;