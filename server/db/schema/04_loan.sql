CREATE TABLE loan (
  loan_id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  borrower_id TEXT NOT NULL,
  due_at TIMESTAMP NOT NULL,
  returned_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT,

  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (book_id)
    REFERENCES book(book_id),
  
  FOREIGN KEY (owner_id)
    REFERENCES `user`(user_id),
  
  FOREIGN KEY (borrower_id)
    REFERENCES `user`(user_id)
);