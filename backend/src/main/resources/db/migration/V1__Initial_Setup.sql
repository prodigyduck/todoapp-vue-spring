-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id BIGSERIAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert initial admin user (for testing)
INSERT INTO users (id, username, password, email, created_at, updated_at) 
VALUES (1, 'admin', '$2a$10$16bKUFYqQGPtVVdeQaE6z8g2J9BQzVnI', 'admin@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample todos
INSERT INTO todos (id, title, description, completed, user_id, created_at, updated_at) 
VALUES (1, 'Sample Todo 1', 'This is a sample todo for testing', FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample todos for testing multiple todo items
INSERT INTO todos (id, title, description, completed, user_id, created_at, updated_at) 
VALUES 
(2, 'Sample Todo 2', 'This is a second sample todo', FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Sample Todo 3', 'This is a third sample todo', FALSE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);