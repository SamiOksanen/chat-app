-- Add user profile fields required for mention system and user search
-- This migration adds display names, avatars, and online status tracking

BEGIN;

-- Add user profile fields if they don't exist
DO $$
BEGIN
    -- Add display_name column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'display_name'
    ) THEN
        ALTER TABLE public.users ADD COLUMN display_name VARCHAR(100);
    END IF;

    -- Add avatar_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
    END IF;

    -- Add is_online column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'is_online'
    ) THEN
        ALTER TABLE public.users ADD COLUMN is_online BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add last_seen column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'last_seen'
    ) THEN
        ALTER TABLE public.users ADD COLUMN last_seen TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create search indexes for user search performance
CREATE INDEX IF NOT EXISTS idx_users_username_search
ON public.users (username)
WHERE username IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_display_name_search
ON public.users (display_name)
WHERE display_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_online_status
ON public.users (is_online, last_seen)
WHERE is_online = TRUE;

COMMIT;