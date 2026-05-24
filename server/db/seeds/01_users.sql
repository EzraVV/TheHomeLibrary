INSERT INTO user (user_id,user_name,email,postcode,about,interests,status, created_at, updated_at, is_deleted,deleted_at) VALUES


(
  'u_00001',
  'meep',
  'metadatablowout@dev.com',
  '1010',
  'Currently rescuing metadata from the void.',
  'popular science, literature, boys own stories',
  'ACTIVE',
  '2026-01-01 09:00:00', '2026-01-01 09:00:00', FALSE, NULL
),
(
  'u_00002',
  'compulsive_reader',
  'compre@libraryapp.io',
  '1021',
  'Obsessed with how book cards render when titles are way too long.',
  'classic literature, sci-fi worldbuilding. 18th century literature',
  'ACTIVE',
  '2026-01-01 09:15:00', '2026-01-01 09:15:00', FALSE, NULL
),
(
  'u_00003',
  'quillian',
  'quillz@libraryapp.io',
  '1024',
  'Aspiring author, fan of creative non-fiction.',
  'war histories, historical biographies, manga',
  'ACTIVE',
  '2026-01-01 09:30:00', '2026-01-01 09:30:00', FALSE, NULL
),
(
  'u_00004',
  'the_fantacist',
  'partner3@libraryapp.io',
  '1023',
  'Actively trying to break the string parsers on input fields - everything about it.',
  'Licking fingers to turn pages, high fantasy trilogies',
  'ACTIVE',
  '2026-01-01 09:45:00', '2026-01-01 09:45:00', FALSE, NULL
),
(
  'u_00005',
  'ghost_reader',
  'inactive_test@example.com',
  '2022',
  'Created an account 6 months ago, listed one book, and completely vanished into thin air.',
  'Thrillers, mystery novels, poetry',
  'INACTIVE',
  '2026-01-01 10:00:00', '2026-04-15 14:30:00', FALSE, NULL
),
(
  'u_00006',
  'serial_dogearer',
  'banned_user@rules.com',
  '1010',
  'Account flag history: Returned three pristine hardcovers with the corners folded down.',
  'Graphic novels, paperback fiction, breaking the rules',
  'SUSPENDED',
  '2026-01-01 10:15:00', '2026-05-20 11:15:00', FALSE, NULL
),
(
  'u_00007',
  'branesque',
  'cats@rule.com',
  '1010',
  '',
  'Graphic novels, paperback fiction',
  'ACTIVE', 
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE, NULL
),
(
  'u_00008',
  'ezra_1',
  'dearleader@project.com',
  '',
  'Early adopter.',
  'Graphic novels, classics',
  'ACTIVE', 
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE, NULL
),
(
  'u_00009',
  'eden@home',
  'cankanban@sorted.com',
  '6000', 
  '',
  'philosophy, paperback fiction',
  'ACTIVE', 
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE, NULL
),
(
  'u_00010',
  'deleted_bookworm',
  'gone@forgotten.com',
  '1021',
  'I chose to delete my profile last month.',
  'Classics',
  'INACTIVE', 
  '2026-01-01 10:00:00',
  '2026-04-15 14:30:00', -- updated_at = deletion day
  TRUE,                  -- is_deleted is set to TRUE
  '2026-04-15 14:30:00'  -- deleted_at timestamp populated
);

(
  'u_00011',
  'off-piste',
  'gone@forawhile.com',
  '1021',
  'In the Hebrides for the month.',
  'Horse racing fiction',
  'INACTIVE', 
  '2026-01-01 10:00:00',
  '2026-04-15 14:30:00', -- updated_at = set inactive
  FALSE,                  
  NULL 
);