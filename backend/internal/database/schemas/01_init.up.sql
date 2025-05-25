CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    );

CREATE INDEX idx_users_username ON users(username); 

CREATE TABLE refresh_tokens (
    token VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Insert default admin user
-- Password: admin123 (bcrypt hashed)
INSERT INTO users (email, username, password_hash) 
VALUES ('admin@plantdiary.com', 'admin', '$2a$10$X5XaEspLtO8jV2xQKzoIne5Kau8dTggd5FnS397dWxteyCUr3zmrq'); 