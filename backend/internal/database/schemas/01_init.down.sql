DROP INDEX IF EXISTS idx_refresh_tokens_expires_at;
DROP INDEX IF EXISTS idx_refresh_tokens_user_id;
DROP INDEX IF EXISTS idx_users_username;

DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users; 