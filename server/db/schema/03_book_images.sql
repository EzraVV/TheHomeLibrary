CREATE TABLE book_images (
  image_id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,          
  uploaded_by TEXT NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES book(book_id),
  FOREIGN KEY (uploaded_by) REFERENCES `user`(user_id)
);
