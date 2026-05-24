---Possible extension - if owner wants multiple image, or add damaged book pics/condition
CREATE TABLE book_images (
  image_id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,          -- e.g., "Tear on page 40" or "Front cover"
  uploaded_by TEXT NOT NULL, -- Tracks if owner or borrower uploaded it
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES book(book_id),
  FOREIGN KEY (uploaded_by) REFERENCES user(user_id)
);
