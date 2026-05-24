INSERT INTO follows (id, follower_id, followed_id) VALUES
(
  'f_00001', 
  'u_00001', -- meep
  'u_00002'  -- follows compulsive_reader
),
(
  'f_00002', 
  'u_00002', -- compulsive_reader
  'u_00001'  -- follows meep back (Mutual match test!)
),
(
  'f_00003', 
  'u_00003', -- quillian
  'u_00001'  -- follows meep
),
(
  'f_00004', 
  'u_00004', -- the_fantacist
  'u_00001'  -- follows meep
),
(
  'f_00005', 
  'u_00008', -- ezra 
  'u_00009'  -- follows eden
),
(
  'f_00006', 
  'u_00001', -- meep
  'u_00006'  -- follows serial_dogearer (Test: following a suspended account)
),
(
  'f_00007', 
  'u_00001', -- meep (Active)
  'u_00010'  -- follows deleted_bookworm (Soft-Deleted)
),
(
  'f_00008', 
  'u_00010', -- deleted_bookworm (Soft-Deleted)
  'u_00003'  -- follows quillian (Active)
);