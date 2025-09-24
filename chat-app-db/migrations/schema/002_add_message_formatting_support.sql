-- Add columns to support advanced message formatting features
-- This migration adds support for markdown content flags and mention functionality

BEGIN;

-- Add new columns to messages table
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS has_markdown BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS mentioned_user_ids INTEGER[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_has_markdown
ON public.messages (has_markdown)
WHERE has_markdown = TRUE;

CREATE INDEX IF NOT EXISTS idx_messages_mentioned_users
ON public.messages USING GIN (mentioned_user_ids)
WHERE mentioned_user_ids <> '{}';

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;