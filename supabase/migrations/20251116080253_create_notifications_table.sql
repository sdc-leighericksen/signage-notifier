/*
  # Create notifications table for digital signage

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key) - Unique identifier for each notification
      - `title` (text, required) - Notification title
      - `description` (text, required) - Notification description
      - `color` (text, required) - HEX color code for notification styling
      - `timestamp` (timestamptz, optional) - User-provided timestamp for the notification event
      - `created_at` (timestamptz, auto-generated) - When the notification was created in the system
  
  2. Security
    - Enable RLS on `notifications` table
    - Add policy for anonymous users to insert notifications (for webhook)
    - Add policy for anonymous users to read notifications (for UI)
  
  3. Indexes
    - Create index on `created_at` for efficient sorting by newest first
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  color text NOT NULL DEFAULT '#333333',
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient sorting
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert notifications (for webhook endpoint)
CREATE POLICY "Allow anonymous insert"
  ON notifications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to read notifications (for UI)
CREATE POLICY "Allow anonymous select"
  ON notifications
  FOR SELECT
  TO anon
  USING (true);