-- Insert default admin user
-- Password: admin123 (bcrypt hashed)
INSERT INTO users (email, password_hash) 
VALUES ('admin@plantdiary.com', '$2a$10$X5XaEspLtO8jV2xQKzoIne5Kau8dTggd5FnS397dWxteyCUr3zmrq'); 