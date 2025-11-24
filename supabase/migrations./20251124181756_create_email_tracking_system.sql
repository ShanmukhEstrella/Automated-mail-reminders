/*
  # Email Follow-Up Tracking System

  1. New Tables
    - `emails`
      - `id` (uuid, primary key)
      - `subject` (text, email subject line)
      - `content` (text, email body content)
      - `sender` (text, sender email/name)
      - `is_important` (boolean, AI classification result)
      - `importance_reason` (text, AI explanation)
      - `status` (text, 'pending', 'replied', 'reminded')
      - `created_at` (timestamptz, when email was received)
      - `reminder_sent_at` (timestamptz, when reminder was triggered)
      - `replied_at` (timestamptz, when email was replied to)
    
    - `reminders`
      - `id` (uuid, primary key)
      - `email_id` (uuid, foreign key to emails)
      - `message` (text, reminder message content)
      - `sent_at` (timestamptz, when reminder was sent)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public access for demo purposes (authenticated users can manage all data)

  3. Important Notes
    - This is a demo system simulating email classification and reminder workflows
    - Status tracks: pending → replied OR pending → reminded
    - AI classification determines which emails get monitored
*/

CREATE TABLE IF NOT EXISTS emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  content text NOT NULL,
  sender text NOT NULL,
  is_important boolean DEFAULT false,
  importance_reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'reminded')),
  created_at timestamptz DEFAULT now(),
  reminder_sent_at timestamptz,
  replied_at timestamptz
);

CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid REFERENCES emails(id) ON DELETE CASCADE,
  message text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to emails"
  ON emails FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to emails"
  ON emails FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to emails"
  ON emails FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to reminders"
  ON reminders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to reminders"
  ON reminders FOR INSERT
  TO public
  WITH CHECK (true);
