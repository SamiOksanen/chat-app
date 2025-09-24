-- Seed file to update existing data with new message formatting fields
-- This ensures backward compatibility by setting sensible defaults

BEGIN;

-- Set has_markdown to FALSE for all existing messages (they don't have markdown)
UPDATE public.messages
SET has_markdown = FALSE
WHERE has_markdown IS NULL;

-- Set mentioned_user_ids to empty array for all existing messages
UPDATE public.messages
SET mentioned_user_ids = '{}'
WHERE mentioned_user_ids IS NULL;

-- Set updated_at to createdt for all existing messages
UPDATE public.messages
SET updated_at = createdt
WHERE updated_at IS NULL;

-- Set display_name to username for existing users if display_name is null
UPDATE public.users
SET display_name = username
WHERE display_name IS NULL;

-- Set default online status for existing users
UPDATE public.users
SET is_online = FALSE,
    last_seen = createdt
WHERE is_online IS NULL;

COMMIT;