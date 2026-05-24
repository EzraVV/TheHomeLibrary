CREATE TABLE book (
  book_id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  creator TEXT,
  edition_name TEXT,
  work_id TEXT, 
  isbn TEXT, 
  format TEXT,
  condition TEXT,
  search_index TEXT,
  status TEXT,
  image TEXT, 
  lending_terms TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (owner_id)
    REFERENCES `user`(user_id)
);