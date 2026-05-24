CREATE TABLE condition_report (
  report_id TEXT PRIMARY KEY,
  loan_id TEXT NOT NULL,
  reporter_id TEXT NOT NULL,  
  type TEXT NOT NULL,         
  notes TEXT NOT NULL,        
  severity TEXT,             
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (loan_id) 
    REFERENCES loan(loan_id),
  FOREIGN KEY (reporter_id) 
    REFERENCES `user`(user_id)
);