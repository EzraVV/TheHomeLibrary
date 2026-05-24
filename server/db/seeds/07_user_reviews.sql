INSERT INTO user_review (u_review_id,loan_id, reviewer_id, user_id,rating,comment, created_at, updated_at, is_deleted, deleted_at) VALUES
(
  'urv_00001',
  'ln_00002',
  'u_00002', 
  'u_00001', 
    5,
  'Absolute legend. The books were returned in good condition and communication was super fast.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  FALSE,
  NULL
),
(
  'urv_00002',
  'ln_00001',
  'u_00003', 
  'u_00001', 
  4,
  'Great selection of trashy sci fi. Highly recommend borrowing from their library.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  FALSE,
  NULL
),
(
  'urv_00003',
  'ln_00003',
  'u_00004', 
  'u_00006', 
  1,
  'Returned my limited edition paperback with the corners dogeared and spine broken. Avoid lending to them!',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  FALSE,
  NULL
),
(
  'urv_00004',
  'ln_00004',
  'u_00001', 
  'u_00005', 
  3,
  'They vanished midway through organising the book return. Leaving a neutral review until they get back to me.',
  '2026-02-10 09:15:00',
  '2026-03-01 11:20:00', 
  TRUE,                  
  '2026-03-01 11:20:00'
);
