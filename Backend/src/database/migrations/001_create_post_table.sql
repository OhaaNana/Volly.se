CREATE TABLE post (
    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id),

    title TEXT,
    description TEXT,

    help_type TEXT,

    category TEXT NOT NULL DEFAULT '',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);