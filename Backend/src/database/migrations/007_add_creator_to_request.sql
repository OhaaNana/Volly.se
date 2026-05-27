ALTER TABLE request
  ADD COLUMN IF NOT EXISTS creator_id INT REFERENCES users(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_request_post_creator
  ON request(post_id, creator_id);

CREATE INDEX IF NOT EXISTS idx_messages_request_id ON messages(request_id);
ALTER TABLE request ADD COLUMN IF NOT EXISTS creator_id INT REFERENCES users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS uniq_request_post_creator ON request(post_id, creator_id);