-- Replace legacy demo-only metadata with real ISBN-backed records.
-- Ownership, lending status, condition, and loan relationships remain unchanged.
update public.book
set
  title = case book_id
    when 'bk_00001' then 'Alice''s Adventures in Wonderland'
    when 'bk_00003' then 'Foundation'
    when 'bk_00004' then 'The Name of the Rose'
    when 'bk_00005' then 'Rebecca'
    when 'bk_00011' then 'Pride and Prejudice'
    when 'bk_00012' then 'Brave New World'
  end,
  creator = case book_id
    when 'bk_00001' then 'Lewis Carroll'
    when 'bk_00003' then 'Isaac Asimov'
    when 'bk_00004' then 'Umberto Eco'
    when 'bk_00005' then 'Daphne du Maurier'
    when 'bk_00011' then 'Jane Austen'
    when 'bk_00012' then 'Aldous Huxley'
  end,
  work_id = case book_id
    when 'bk_00001' then 'google:9780141439761'
    when 'bk_00003' then 'google:9780553293357'
    when 'bk_00004' then 'google:9780156001311'
    when 'bk_00005' then 'google:9780380730407'
    when 'bk_00011' then 'google:9780141439518'
    when 'bk_00012' then 'google:9780099518471'
  end,
  isbn = case book_id
    when 'bk_00001' then '9780141439761'
    when 'bk_00003' then '9780553293357'
    when 'bk_00004' then '9780156001311'
    when 'bk_00005' then '9780380730407'
    when 'bk_00011' then '9780141439518'
    when 'bk_00012' then '9780099518471'
  end,
  image = '',
  description = null,
  search_index = lower(case book_id
    when 'bk_00001' then 'Alice''s Adventures in Wonderland Lewis Carroll 9780141439761'
    when 'bk_00003' then 'Foundation Isaac Asimov 9780553293357'
    when 'bk_00004' then 'The Name of the Rose Umberto Eco 9780156001311'
    when 'bk_00005' then 'Rebecca Daphne du Maurier 9780380730407'
    when 'bk_00011' then 'Pride and Prejudice Jane Austen 9780141439518'
    when 'bk_00012' then 'Brave New World Aldous Huxley 9780099518471'
  end),
  updated_at = now()
where book_id in (
  'bk_00001',
  'bk_00003',
  'bk_00004',
  'bk_00005',
  'bk_00011',
  'bk_00012'
);
