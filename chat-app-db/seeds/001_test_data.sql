-- Test data seed file for chat-app e2e testing
-- This file is only executed in development and test environments

-- Check if we're in test or development environment
-- Skip in production
DO $$
BEGIN
    IF current_setting('server_version_num')::int >= 90600 AND
       (current_database() LIKE '%test%' OR
        current_setting('application_name', true) LIKE '%dev%' OR
        coalesce(current_setting('custom.environment', true), 'development') IN ('development', 'test')) THEN

        -- Clear existing test data
        DELETE FROM messages;
        DELETE FROM conversationusers;
        DELETE FROM conversations;
        DELETE FROM users;

        -- Reset sequences
        ALTER SEQUENCE users_userid_seq RESTART WITH 1;
        ALTER SEQUENCE conversations_conversationid_seq RESTART WITH 1;
        ALTER SEQUENCE conversationusers_conversationuserid_seq RESTART WITH 1;
        ALTER SEQUENCE messages_messageid_seq RESTART WITH 1;

        -- Insert test users
        INSERT INTO users (username, password, token, email, theme, createdt) VALUES
        ('testuser1', '$2b$10$/o.Zs8HezVjfqhXLpUM6vuRRwjk7BxB8xzCFd8XIA78ZJGn2e2kEy', 'test-token-user1-12345', 'testuser1@example.com', 'light', NOW() - INTERVAL '7 days'),
        ('testuser2', '$2b$10$/o.Zs8HezVjfqhXLpUM6vuRRwjk7BxB8xzCFd8XIA78ZJGn2e2kEy', 'test-token-user2-67890', 'testuser2@example.com', 'dark', NOW() - INTERVAL '5 days'),
        ('testuser3', '$2b$10$/o.Zs8HezVjfqhXLpUM6vuRRwjk7BxB8xzCFd8XIA78ZJGn2e2kEy', 'test-token-user3-abcde', 'testuser3@example.com', 'light', NOW() - INTERVAL '3 days'),
        ('testuser4', '$2b$10$/o.Zs8HezVjfqhXLpUM6vuRRwjk7BxB8xzCFd8XIA78ZJGn2e2kEy', 'test-token-user4-fghij', 'testuser4@example.com', 'dark', NOW() - INTERVAL '2 days'),
        ('newuser', '$2b$10$/o.Zs8HezVjfqhXLpUM6vuRRwjk7BxB8xzCFd8XIA78ZJGn2e2kEy', 'test-token-newuser-klmno', 'newuser@example.com', 'light', NOW() - INTERVAL '1 hour');

        -- Insert test conversations
        -- Direct message conversation between user1 and user2
        INSERT INTO conversations (groupflag, groupname, adminid, createdt) VALUES
        ('N', NULL, NULL, NOW() - INTERVAL '5 days');

        -- Group conversation with user1 as admin
        INSERT INTO conversations (groupflag, groupname, adminid, createdt) VALUES
        ('Y', 'Test Group Chat', 1, NOW() - INTERVAL '3 days');

        -- Another direct message conversation between user1 and user3
        INSERT INTO conversations (groupflag, groupname, adminid, createdt) VALUES
        ('N', NULL, NULL, NOW() - INTERVAL '2 days');

        -- Large group conversation with user2 as admin
        INSERT INTO conversations (groupflag, groupname, adminid, createdt) VALUES
        ('Y', 'Team Discussion', 2, NOW() - INTERVAL '1 day');

        -- Insert conversation participants
        -- Conversation 1: Direct message (user1, user2)
        INSERT INTO conversationusers (conversationid, userid, createdt) VALUES
        (1, 1, NOW() - INTERVAL '5 days'),
        (1, 2, NOW() - INTERVAL '5 days');

        -- Conversation 2: Group chat (user1, user2, user3)
        INSERT INTO conversationusers (conversationid, userid, createdt) VALUES
        (2, 1, NOW() - INTERVAL '3 days'),
        (2, 2, NOW() - INTERVAL '3 days'),
        (2, 3, NOW() - INTERVAL '3 days');

        -- Conversation 3: Direct message (user1, user3)
        INSERT INTO conversationusers (conversationid, userid, createdt) VALUES
        (3, 1, NOW() - INTERVAL '2 days'),
        (3, 3, NOW() - INTERVAL '2 days');

        -- Conversation 4: Team discussion (user2, user3, user4)
        INSERT INTO conversationusers (conversationid, userid, createdt) VALUES
        (4, 2, NOW() - INTERVAL '1 day'),
        (4, 3, NOW() - INTERVAL '1 day'),
        (4, 4, NOW() - INTERVAL '1 day');

        -- Insert test messages
        -- Conversation 1 messages (Direct message between user1 and user2)
        INSERT INTO messages (conversationid, userid, message, createdt) VALUES
        (1, 1, 'Hey there! How are you doing?', NOW() - INTERVAL '5 days' + INTERVAL '1 hour'),
        (1, 2, 'Hi! I''m doing great, thanks for asking. How about you?', NOW() - INTERVAL '5 days' + INTERVAL '2 hours'),
        (1, 1, 'Pretty good! Just working on some new features.', NOW() - INTERVAL '5 days' + INTERVAL '3 hours'),
        (1, 2, 'That sounds exciting! What kind of features?', NOW() - INTERVAL '4 days'),
        (1, 1, 'Adding some real-time chat functionality', NOW() - INTERVAL '3 days' + INTERVAL '2 hours');

        -- Conversation 2 messages (Group chat)
        INSERT INTO messages (conversationid, userid, message, createdt) VALUES
        (2, 1, 'Welcome to our test group!', NOW() - INTERVAL '3 days' + INTERVAL '30 minutes'),
        (2, 2, 'Thanks for adding me! This looks great.', NOW() - INTERVAL '3 days' + INTERVAL '1 hour'),
        (2, 3, 'Happy to be here! 👋', NOW() - INTERVAL '3 days' + INTERVAL '1 hour 30 minutes'),
        (2, 1, 'Let''s use this group to coordinate our testing', NOW() - INTERVAL '2 days' + INTERVAL '2 hours'),
        (2, 2, 'Sounds like a plan!', NOW() - INTERVAL '2 days' + INTERVAL '3 hours'),
        (2, 3, 'I agree, this will be very useful', NOW() - INTERVAL '1 day' + INTERVAL '1 hour');

        -- Conversation 3 messages (Direct message between user1 and user3)
        INSERT INTO messages (conversationid, userid, message, createdt) VALUES
        (3, 1, 'Quick question about the project...', NOW() - INTERVAL '2 days' + INTERVAL '1 hour'),
        (3, 3, 'Sure! What do you need to know?', NOW() - INTERVAL '2 days' + INTERVAL '2 hours'),
        (3, 1, 'Are you available for a call later today?', NOW() - INTERVAL '1 day' + INTERVAL '3 hours'),
        (3, 3, 'Yes, I''m free after 3 PM', NOW() - INTERVAL '1 day' + INTERVAL '4 hours');

        -- Conversation 4 messages (Team discussion)
        INSERT INTO messages (conversationid, userid, message, createdt) VALUES
        (4, 2, 'Hey team! Let''s discuss the upcoming release', NOW() - INTERVAL '1 day' + INTERVAL '1 hour'),
        (4, 3, 'Great timing! I have some updates to share', NOW() - INTERVAL '1 day' + INTERVAL '2 hours'),
        (4, 4, 'Perfect! I''ve been waiting for this discussion', NOW() - INTERVAL '1 day' + INTERVAL '3 hours'),
        (4, 2, 'Excellent! Let''s start with the current status', NOW() - INTERVAL '1 day' + INTERVAL '4 hours'),
        (4, 3, 'All my tasks are on track for the deadline', NOW() - INTERVAL '1 day' + INTERVAL '5 hours'),
        (4, 4, 'Same here! Everything looks good on my end', NOW() - INTERVAL '23 hours'),
        (4, 2, 'Fantastic! This release is going to be great', NOW() - INTERVAL '22 hours');

        -- Add some recent messages for real-time testing
        INSERT INTO messages (conversationid, userid, message, createdt) VALUES
        (1, 2, 'Just wanted to check in - how''s the testing going?', NOW() - INTERVAL '2 hours'),
        (2, 1, 'E2E tests are looking good so far!', NOW() - INTERVAL '1 hour'),
        (3, 3, 'Ready for our call whenever you are', NOW() - INTERVAL '30 minutes');

        RAISE NOTICE 'Test data seeded successfully for % environment', current_database();
    ELSE
        RAISE NOTICE 'Skipping test data seed - not in development/test environment';
    END IF;
END
$$;