
CREATE TABLE messages(
                       id SERIAL PRIMARY KEY,
                       post_id INT,
                       sender_id INT,
                       text_message TEXT,
                       request_id INT,
                       read_at TIMESTAMP DEFAULT NOW(),
                       created_at TIMESTAMP DEFAULT NOW(),
                       updated_at TIMESTAMP DEFAULT NOW(),
                         
                       FOREIGN KEY (request_id) REFERENCES request(id),
                       FOREIGN KEY (post_id) REFERENCES post(id),
                       FOREIGN KEY (sender_id) REFERENCES user(id)
);