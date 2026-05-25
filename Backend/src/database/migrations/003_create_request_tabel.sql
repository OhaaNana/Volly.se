CREATE TABLE request(
  id SERIAL PRIMARY KEY,
  post_id INT,
  status request_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (post_id) REFERENCES post(id)
)
