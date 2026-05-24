----Possible extension; track book condition
CREATE TABLE condition_report (
  report_id TEXT PRIMARY KEY,
  loan_id TEXT NOT NULL,
  reporter_id TEXT NOT NULL,  -- The user raising the issue (borrower or owner)
  type TEXT NOT NULL,         -- 'PICKUP' or 'RETURN'
  notes TEXT NOT NULL,        -- 'bloodstains on page 40, foxed throughout'
  severity TEXT,              -- 'MINOR', 'MAJOR', 'DESTRUCTIVE'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (loan_id) 
    REFERENCES loan(loan_id),
  FOREIGN KEY (reporter_id) 
    REFERENCES user(user_id)
);