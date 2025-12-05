/*
  # Create counselling sessions and messages tables

  ## Overview
  This migration sets up the database schema for the AI counselling support tool research prototype.
  
  ## New Tables
  
  ### `sessions`
  Stores information about each counselling session including:
  - `id` (uuid, primary key) - Unique session identifier
  - `mode` (text) - Either "text" or "avatar" mode
  - `profile` (jsonb) - User's survey answers (tone, focus, style, pace, address)
  - `step` (text) - Current conversation step (INTRO, CHECK_IN, EXPLORE, COPING, WRAP_UP, END)
  - `created_at` (timestamptz) - When the session was created
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `messages`
  Stores all messages exchanged in sessions:
  - `id` (uuid, primary key) - Unique message identifier
  - `session_id` (uuid, foreign key) - Reference to the session
  - `sender` (text) - Either "user" or "agent"
  - `text` (text) - The message content
  - `step` (text) - The conversation step when this message was sent
  - `created_at` (timestamptz) - Message timestamp
  
  ## Security
  - RLS is enabled on both tables
  - Public access is allowed for this research prototype (no authentication required)
  - In production, you would restrict this to authenticated users only
  
  ## Notes
  - Sessions are stored with their personalization profile as JSON
  - Messages maintain chronological order via created_at
  - Step tracking helps manage conversation flow
*/

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mode text NOT NULL CHECK (mode IN ('text', 'avatar')),
  profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  step text NOT NULL DEFAULT 'INTRO' CHECK (step IN ('INTRO', 'CHECK_IN', 'EXPLORE', 'COPING', 'WRAP_UP', 'END')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('user', 'agent')),
  text text NOT NULL,
  step text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(session_id, created_at);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sessions"
  ON sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to sessions"
  ON sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to sessions"
  ON sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to messages"
  ON messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to messages"
  ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);