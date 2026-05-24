CREATE TABLE follows (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL,
  followed_id TEXT NOT NULL,

  FOREIGN KEY (follower_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
  FOREIGN KEY (followed_id) REFERENCES `user`(user_id) ON DELETE CASCADE
);