insert into public.profiles (
  user_id, user_name, email, postcode, about, interests, status
) values
  (
    'u_00001',
    'demo_reader',
    'demo-reader@example.invalid',
    '1010',
    'A non-authenticated demo profile retained for catalogue data.',
    array['popular science', 'literature'],
    'ACTIVE'
  )
on conflict (user_id) do nothing;

insert into public.book (
  book_id, owner_id, title, creator, edition_name, work_id, isbn, format,
  condition, search_index, status, image, lending_terms
) values
  (
    'bk_00001',
    'u_00001',
    'Alice''s Adventures in Wonderland',
    'Lewis Carroll',
    'Standard Edition',
    'OL138052W',
    '9780706413120',
    'Hardcover',
    'Good',
    'alice adventures wonderland lewis carroll',
    'Available',
    '',
    ''
  )
on conflict (book_id) do nothing;

select setval('public.profile_id_seq', 10001, false);
select setval('public.book_id_seq', 10001, false);
select setval('public.loan_id_seq', 10001, false);
