CREATE TABLE user_review (
 u_review_id TEXT PRIMARY KEY,
 reviewer_id TEXT NOT NULL,
 user_id TEXT NOT NULL,
 rating INTEGER CHECK(rating >=0 AND rating <=5),
 comment TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 loan_id TEXT NOT NULL,

 is_deleted BOOLEAN DEFAULT FALSE,
 deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY (user_id)
  REFERENCES `user`(user_id),

 FOREIGN KEY (reviewer_id)
  REFERENCES `user`(user_id), 

 FOREIGN KEY (loan_id)
  REFERENCES loan(loan_id) 
);
