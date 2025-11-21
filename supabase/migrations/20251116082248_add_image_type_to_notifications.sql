/*
  # Add image type to notifications table

  1. Changes
    - Add `image` column to `notifications` table
      - Type: text
      - Allowed values: 'good', 'bad', 'problem'
      - Default: 'good'
      - Not null
    - This field determines which pool of GIFs to display in the full-screen notification

  2. Notes
    - Existing rows will be updated with default value 'good'
    - The frontend will map this to one of three GIF pools
*/

-- Add image column with default value
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'image'
  ) THEN
    ALTER TABLE notifications ADD COLUMN image text NOT NULL DEFAULT 'good';
  END IF;
END $$;

-- Add check constraint to ensure only valid values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'notifications_image_check'
  ) THEN
    ALTER TABLE notifications
    ADD CONSTRAINT notifications_image_check
    CHECK (image IN ('good', 'bad', 'problem'));
  END IF;
END $$;