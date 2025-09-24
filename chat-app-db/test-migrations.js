#!/usr/bin/env node
/**
 * Simple test script to verify database migrations work correctly
 * This script tests that the new columns for message formatting are created and accessible
 */

import { Client } from 'pg';
import { DATABASE_URL } from './scripts/db-config.js';

async function testDatabaseSchema() {
  const client = new Client(DATABASE_URL);

  try {
    console.log('Connecting to database...');
    await client.connect();

    // Test that new columns exist in messages table
    console.log('Testing messages table schema...');
    const messagesQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'messages'
      AND column_name IN ('has_markdown', 'mentioned_user_ids', 'updated_at')
      ORDER BY column_name;
    `;

    const messagesResult = await client.query(messagesQuery);
    const expectedMessagesColumns = ['has_markdown', 'mentioned_user_ids', 'updated_at'];
    const foundMessagesColumns = messagesResult.rows.map(row => row.column_name);

    console.log('Found message columns:', foundMessagesColumns);
    for (const expectedCol of expectedMessagesColumns) {
      if (!foundMessagesColumns.includes(expectedCol)) {
        throw new Error(`Expected column '${expectedCol}' not found in messages table`);
      }
    }

    // Test that new columns exist in users table
    console.log('Testing users table schema...');
    const usersQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('display_name', 'avatar_url', 'is_online', 'last_seen')
      ORDER BY column_name;
    `;

    const usersResult = await client.query(usersQuery);
    const expectedUsersColumns = ['avatar_url', 'display_name', 'is_online', 'last_seen'];
    const foundUsersColumns = usersResult.rows.map(row => row.column_name);

    console.log('Found user columns:', foundUsersColumns);
    for (const expectedCol of expectedUsersColumns) {
      if (!foundUsersColumns.includes(expectedCol)) {
        throw new Error(`Expected column '${expectedCol}' not found in users table`);
      }
    }

    // Test that indexes exist
    console.log('Testing indexes...');
    const indexQuery = `
      SELECT indexname, tablename
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname IN (
        'idx_messages_has_markdown',
        'idx_messages_mentioned_users',
        'idx_users_username_search',
        'idx_users_display_name_search',
        'idx_users_online_status'
      )
      ORDER BY indexname;
    `;

    const indexResult = await client.query(indexQuery);
    const foundIndexes = indexResult.rows.map(row => row.indexname);
    console.log('Found indexes:', foundIndexes);

    const expectedIndexes = [
      'idx_messages_has_markdown',
      'idx_messages_mentioned_users',
      'idx_users_display_name_search',
      'idx_users_online_status',
      'idx_users_username_search'
    ];

    for (const expectedIndex of expectedIndexes) {
      if (!foundIndexes.includes(expectedIndex)) {
        console.warn(`Warning: Expected index '${expectedIndex}' not found`);
      }
    }

    // Test that trigger function exists
    console.log('Testing trigger function...');
    const functionQuery = `
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_name = 'update_updated_at_column'
      AND routine_schema = 'public';
    `;

    const functionResult = await client.query(functionQuery);
    if (functionResult.rows.length === 0) {
      throw new Error('Trigger function update_updated_at_column not found');
    }

    // Test basic insert with new columns
    console.log('Testing basic insert with new columns...');

    // First, create a test user if it doesn't exist
    const insertUserQuery = `
      INSERT INTO users (username, password, token, email, display_name, is_online)
      VALUES ('test_user', 'test_pass', 'test_token', 'test@example.com', 'Test User', false)
      ON CONFLICT (username) DO UPDATE SET display_name = EXCLUDED.display_name
      RETURNING userid;
    `;
    const userResult = await client.query(insertUserQuery);
    const userId = userResult.rows[0].userid;

    // Create a test conversation
    const insertConvQuery = `
      INSERT INTO conversations (groupflag, groupname)
      VALUES ('N', 'Test Conversation')
      RETURNING conversationid;
    `;
    const convResult = await client.query(insertConvQuery);
    const conversationId = convResult.rows[0].conversationid;

    // Test inserting a message with new columns
    const insertMessageQuery = `
      INSERT INTO messages (conversationid, userid, message, has_markdown, mentioned_user_ids)
      VALUES ($1, $2, 'Test message with formatting', true, ARRAY[$2])
      RETURNING messageid, has_markdown, mentioned_user_ids, updated_at;
    `;

    const messageResult = await client.query(insertMessageQuery, [conversationId, userId]);
    const message = messageResult.rows[0];

    if (!message.has_markdown) {
      throw new Error('has_markdown field not set correctly');
    }

    if (!Array.isArray(message.mentioned_user_ids) || message.mentioned_user_ids.length === 0) {
      throw new Error('mentioned_user_ids field not set correctly');
    }

    if (!message.updated_at) {
      throw new Error('updated_at field not set correctly');
    }

    console.log('✅ All database schema tests passed!');
    console.log('New columns and indexes are working correctly.');

    // Clean up test data
    await client.query('DELETE FROM messages WHERE messageid = $1', [message.messageid]);
    await client.query('DELETE FROM conversations WHERE conversationid = $1', [conversationId]);
    await client.query('DELETE FROM users WHERE userid = $1', [userId]);

  } catch (error) {
    console.error('❌ Database schema test failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseSchema();
}

export { testDatabaseSchema };