-- The browser never talks to Supabase directly.
-- API routes use a server-only service role key, so anonymous users do not
-- need direct table access.

DROP POLICY IF EXISTS "Allow public read access to sessions" ON sessions;
DROP POLICY IF EXISTS "Allow public insert to sessions" ON sessions;
DROP POLICY IF EXISTS "Allow public update to sessions" ON sessions;
DROP POLICY IF EXISTS "Allow public read access to messages" ON messages;
DROP POLICY IF EXISTS "Allow public insert to messages" ON messages;
