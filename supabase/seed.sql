BEGIN;
SET CONSTRAINTS ALL DEFERRED;

INSERT INTO public.profiles (user_id,user_name,email,postcode,about,interests,status, created_at, updated_at, is_deleted,deleted_at) VALUES


(
  'u_00012',
  'meep',
  'metadatablowout@dev.com',
  '1010',
  'Currently rescuing metadata from the void.',
  '{popular science, literature, boys own stories}'::text[],
  'ACTIVE',
  '2026-01-01 09:00:00', '2026-01-01 09:00:00', FALSE, NULL
),
(
  'u_00013',
  'compulsive_reader',
  'compre@libraryapp.io',
  '1021',
  'Obsessed with how book cards render when titles are way too long.',
  '{classic literature, sci-fi worldbuilding. 18th century literature}'::text[],
  'ACTIVE',
  '2026-01-01 09:15:00', '2026-01-01 09:15:00', FALSE, NULL
),
(
  'u_00014',
  'quillian',
  'quillz@libraryapp.io',
  '1024',
  'Aspiring author, fan of creative non-fiction.',
  '{war histories, historical biographies, manga}'::text[],
  'ACTIVE',
  '2026-01-01 09:30:00', '2026-01-01 09:30:00', FALSE, NULL
),
(
  'u_00015',
  'the_fantacist',
  'partner3@libraryapp.io',
  '1023',
  'Actively trying to break the string parsers on input fields - everything about it.',
  '{Licking fingers to turn pages, high fantasy trilogies}'::text[],
  'ACTIVE',
  '2026-01-01 09:45:00', '2026-01-01 09:45:00', FALSE, NULL
),
(
  'u_00005',
  'ghost_reader',
  'inactive_test@example.com',
  '2022',
  'Created an account 6 months ago, listed one book, and completely vanished into thin air.',
  '{Thrillers, mystery novels, poetry}'::text[],
  'INACTIVE',
  '2026-01-01 10:00:00', '2026-04-15 14:30:00', FALSE, NULL
),
(
  'u_00006',
  'serial_dogearer',
  'banned_user@rules.com',
  '1010',
  'Account flag history: Returned three pristine hardcovers with the corners folded down.',
  '{Graphic novels, paperback fiction, breaking the rules}'::text[],
  'SUSPENDED',
  '2026-01-01 10:15:00', '2026-05-20 11:15:00', FALSE, NULL
),
(
  'u_00007',
  'branesque',
  'cats@rule.com',
  '1010',
  '',
  '{Graphic novels, paperback fiction}'::text[],
  'ACTIVE', 
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE, NULL
),
(
  'u_00008',
  'ezra_1',
  'dearleader@project.com',
  '',
  'Early adopter.',
  '{Red rot eradication, novels, esoteric literature}'::text[],
  'ACTIVE', 
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE, NULL
),
(
  'u_00009',
  'eden@home',
  'cankanban@sorted.com',
  '6000', 
  '',
  '{philosophy, paperback fiction}'::text[],
  'ACTIVE', 
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE, NULL
),
(
  'u_00010',
  'deleted_bookworm',
  'gone@forgotten.com',
  '1021',
  'I chose to delete my profile last month.',
  '{Clessucks}'::text[],
  'INACTIVE', 
  '2026-01-01 10:00:00',
  '2026-04-15 14:30:00', -- updated_at = deletion day
  TRUE,                  -- is_deleted is set to TRUE
  '2026-04-15 14:30:00'  -- deleted_at timestamp populated
),
(
  'u_00011',
  'off-piste',
  'gone@forawhile.com',
  '1021',
  'In the Hebrides for the month.',
  '{Horse racing fiction, Movies with talking animals}'::text[],
  'INACTIVE', 
  '2026-01-01 10:00:00',
  '2026-04-15 14:30:00', -- updated_at = set inactive
  FALSE,                  
  NULL 
);

INSERT INTO public.book (book_id,owner_id,title,creator,edition_name,work_id,isbn,format,condition,search_index,status,image,lending_terms,created_at, updated_at, is_deleted,deleted_at) VALUES

(
  'bk_00001',
  'u_00001', 
  'Alice''s Adventures in Wonderland', 
  'Lewis Carroll, John Tenniel',
  'Standard Edition',
  'OL138052W',
  '0706413121, 9780706413120', 
  'Hardcover',
  'Good',
  'lewis carroll alices adventures in wonderland 0706413121 9780706413120',
  'Available',
  'https://covers.openlibrary.org/b/id/12547113-M.jpg', 
  '2 weeks max, no dog-ears',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  FALSE,
  NULL
),
(
  'bk_00002',
  'u_00001',
  'The Divine Comedy: Inferno, Purgatoria, Paradiso',
  'Dante Alighieri, Henry Wordsworth Longfellow',
  'Royal Collectors Edition',
  'work_dante_divine_comedy',
  '9781774762554',
  'Hardcover',
  'Mint',
  'dante alighieri the divine comedy inferno purgatoria paradiso 9781774762554 OL93140W OL93230W OL93227W',
  'Available',
  'https://covers.openlibrary.org/b/id/10522833-M.jpg',
  'Four weeks max',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  FALSE,
  NULL
),


(
  'bk_00003',
  'u_00001', 
  'Space Pirates of Alpha Centauri',
  'Gore Vidal Jr.', 
  '1985 Pulp Edition',
  'work_alpha_centauri',
  '9780000000001',
  'Paperback',
  'Fair', 
  'gore vidal space pirates of alpha centauri pulp sci-fi trashy',
  'Available',
   'https://covers.openlibrary.org/b/id/10522833-M.jpg',
  '1 week max', 
  '2026-01-05 14:00:00', 
  '2026-01-05 14:00:00', 
  FALSE, 
  NULL
),
(
  'bk_00004',
  'u_00004', 
  'The Chronicle of the Iron Throne',
  'M.K. Darkwood',
  'Limited Foil Collector''s Edition',
  'work_iron_throne',
  '9780000000002',
  'Paperback',
  'Poor', 
  'mk darkwood chronicle of the iron throne high fantasy limited edition',
  'Available',
   'https://covers.openlibrary.org/b/id/10522833-M.jpg',
  'In-city only now', 
  '2026-01-05 14:00:00', 
  '2026-01-05 14:00:00', 
  FALSE, 
  NULL
),
(
  'bk_00005',
  'u_00005',
  'The Silent Whispers',
  'A. Ghost',
  'First Edition',
  'work_silent_whispers',
  '9780000000003',
  'Hardcover',
  'Good',
  'a ghost the silent whispers mystery thriller poet',
  'On loan', 
   'https://covers.openlibrary.org/b/id/10522833-M.jpg',
  'Return promptly', 
  '2026-01-10 09:00:00', 
  '2026-01-10 09:00:00', 
  FALSE, 
  NULL
),


(
  'bk_00006',
  'u_00001',
  'The Left Hand of Darkness',
  'Le Guin, Ursula K.',
  '50th Anniversary Edition',
  'wrk_90112',
  '9780441007318',
  'Paperback',
  'Good',
  'the left hand of darkness ursula k le guin paperback 9780441007318',
  'Available',
  'https://covers.openlibrary.org/b/id/8234567-L.jpg',
  '14-day max loan, local pickup only',
  '2026-01-15 09:30:00',
  '2026-01-15 09:30:00',
  FALSE,
  NULL
),

(
  'bk_00007',
  'u_00002',
  'Dune',
  'Herbert, Frank',
  'Ace Premium Edition',
  'wrk_14590',
  '9780441172719',
  'Paperback',
  'Fair',
  'dune frank herbert ace premium edition 9780441172719',
  'On Loan',
  'https://covers.openlibrary.org/b/id/9102345-L.jpg',
  'Flexible return, treat it with care',
  '2026-01-22 14:15:00',
  '2026-02-10 11:00:00',
  FALSE,
  NULL
),

(
  'bk_00008',
  'u_00003',
  'Neuromancer',
  'Gibson, William',
  'Ace Science Fiction Matrix Series',
  'wrk_33412',
  '9780441569595',
  'Paperback',
  'Like New',
  'neuromancer william gibson ace matrix 9780441569595',
  'Available',
  'https://covers.openlibrary.org/b/id/1122334-L.jpg',
  '7-day quick swap preferred',
  '2026-02-02 18:22:00',
  '2026-02-02 18:22:00',
  FALSE,
  NULL
),

(
  'bk_00009',
  'u_00004',
  'Frankenstein',
  'Shelley, Mary',
  'Penguin Classics',
  'wrk_00281',
  '9780141439471',
  'Paperback',
  'Poor',
  'frankenstein mary shelley penguin classics 9780141439471',
  'Available',
  'https://covers.openlibrary.org/b/id/4455667-L.jpg',
  'Spine is fragile, read at your desk only',
  '2026-02-18 10:05:00',
  '2026-02-18 10:05:00',
  FALSE,
  NULL
),

(
  'bk_00010',
  'u_00005',
  'The Hobbit',
  'Tolkien, J.R.R.',
  'Del Rey Mass Market Edition',
  'wrk_55491',
  '9780345339683',
  'Paperback',
  'Good',
  'the hobbit jrr tolkien del rey mass market 9780345339683',
  'Available',
  'https://covers.openlibrary.org/b/id/7788990-L.jpg',
  'No notes or underlining please',
  '2026-03-01 12:40:00',
  '2026-03-01 12:40:00',
  FALSE,
  NULL
),

(
  'bk_00011',
  'u_00006',
  'Pride and Prejudice',
  'Austen, Jane',
  'Hardcover Collector''s Library',
  'wrk_88321',
  '9781909621640',
  'Hardcover',
  'As New',
  'pride and prejudice jane austen hardcover collectors library 9781909621640',
  'Available',
  'https://covers.openlibrary.org/b/id/5544332-L.jpg',
  'Deposit required for non-regulars',
  '2026-03-14 16:55:00',
  '2026-03-14 16:55:00',
  FALSE,
  NULL
),

(
  'bk_00012',
  'u_00010',
  'Brave New World',
  'Huxley, Aldous',
  'Harper Perennial Modern Classics',
  'wrk_77104',
  '9780060850524',
  'Paperback',
  'Good',
  'brave new world aldous huxley harper perennial 9780060850524',
  'Available',
  'https://covers.openlibrary.org/b/id/2233445-L.jpg',
  '3-week maximum checkout window',
  '2026-04-05 08:20:00',
  '2026-04-05 08:20:00',
  FALSE,
  NULL
);

INSERT INTO public.book_images (image_id,book_id, image_url, description, uploaded_by, created_at) VALUES
(
  'img_00001',
  'bk_00004', 
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
  'Front cover state at initial listing - pristine collector foil wrap intact.',
  'u_00004', 
  '2026-01-05 14:30:00' 
),
(
  'img_00002',
  'bk_00004', 
  'https://images.unsplash.com/photo-1604866830893-c13cafa515d5?auto=format&fit=crop&w=600&q=80',
  'Condition report asset: Close up of torn spine canvas and bent lower right corners.',
  'u_00004',  
  '2026-05-14 11:15:00' 
);

-- Starting file: server/db/seeds/04_loans.sql

INSERT INTO loan (loan_id,book_id,owner_id,borrower_id, status, due_at, returned_at, created_at, updated_at, archived_at) VALUES
(
  'ln_00001',
  'bk_00003',
  'u_00001',
  'u_00003',
  'RETURNED',
  '2026-02-15 12:00:00',
  '2026-02-14 16:30:00', 
  '2026-02-01 12:00:00',
  '2026-02-14 16:30:00',
  NULL
),
(
  'ln_00002',
  'bk_00003',
  'u_00001',
  'u_00002',
  'RETURNED',
  '2026-03-15 12:00:00',
  '2026-03-15 09:00:00', 
  '2026-03-01 12:00:00',
  '2026-03-15 09:00:00',
  NULL
),
(
  'ln_00003',
  'bk_00004',
  'u_00004',
  'u_00006',
  'RETURNED',
  '2026-05-14 12:00:00',
  '2026-05-14 11:15:00', 
  '2026-05-01 12:00:00',
  '2026-05-14 11:15:00',
  NULL
),
(
  'ln_00004',
  'bk_00005',
  'u_00005',
  'u_00001',
  'OVERDUE',
  '2026-02-14 12:00:00',
  NULL,                  
  '2026-02-01 12:00:00',
  '2026-02-14 12:00:00',
  NULL  
),
(
  'ln_00005',
  'bk_00005',
  'u_00005',
  'u_00001',
  'RETURNED',
  '2026-03-14 12:00:00',
  '2026-03-16 12:00:00',                 
  '2026-03-01 12:00:00',
  '2026-03-16 12:00:00',
  '2026-04-04 12:00:00'
);
-- Starting file: server/db/seeds/05_condition_reports.sql


INSERT INTO condition_report (report_id, loan_id,reporter_id,type,notes, severity, created_at, updated_at) VALUES
(
  'crp_00001',
  'ln_00003',             
  'u_00004',              
  'DAMAGE',
  'The book was returned with multiple front-facing corners deeply dogeared and structural damage to the lower third of the spine.',
  'HIGH',                 
  '2026-05-14 11:15:00',  
  '2026-05-14 11:15:00'
);

-- Starting file: server/db/seeds/06_book_reviews.sql


INSERT INTO book_review (b_review_id, user_id,book_id,format_variant, rating, comment, created_at, updated_at, is_deleted, deleted_at) VALUES
(
  'brv_00001',
  'u_00002',             
  'bk_00004',            
  'Limited Foil Edition', 
  5,                      
  'An absolute masterpiece of modern fantasy. The worldbuilding is incredibly deep, and Darkwood knows how to handle an ensemble cast without pacing drag. Highly recommend finding a copy if you can.',
  '2026-03-20 15:45:00',  
  '2026-03-20 15:45:00',
  FALSE,
  NULL
);

-- Starting file: server/db/seeds/07_user_reviews.sql

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

-- Starting file: server/db/seeds/08_follows.sql

INSERT INTO follows (id, follower_id, followed_id) VALUES
(
  'f_00001', 
  'u_00001', 
  'u_00002'  
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


COMMIT
