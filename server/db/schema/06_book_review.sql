CREATE TABLE book_review (
 b_review_id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 book_id TEXT NOT NULL,
 format_variant TEXT,
 rating INTEGER CHECK(rating >=0 AND rating <=5), 
 comment TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 is_deleted BOOLEAN DEFAULT FALSE,
 deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY (user_id)
  REFERENCES `user`(user_id),

 FOREIGN KEY (book_id)
  REFERENCES book(book_id) 
);
