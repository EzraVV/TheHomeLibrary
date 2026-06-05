create sequence if not exists public.profile_id_seq start with 10001;
create sequence if not exists public.book_id_seq start with 10001;
create sequence if not exists public.loan_id_seq start with 10001;

create or replace function public.next_prefixed_id(prefix text, sequence_name text)
returns text
language plpgsql
as $$
declare
  next_value bigint;
begin
  execute format('select nextval(%L)', sequence_name) into next_value;
  return prefix || lpad(next_value::text, 5, '0');
end;
$$;

create table public.profiles (
  user_id text primary key default public.next_prefixed_id('u_', 'public.profile_id_seq'),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  user_name text unique not null,
  pronouns text,
  email text unique not null,
  postcode text,
  about text,
  interests text[] not null default '{}',
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false,
  deleted_at timestamptz
);

create table public.book (
  book_id text primary key default public.next_prefixed_id('bk_', 'public.book_id_seq'),
  owner_id text not null references public.profiles(user_id),
  title text not null,
  creator text,
  edition_name text,
  work_id text,
  isbn text,
  format text,
  description text,
  condition text,
  search_index text,
  status text not null default 'Available',
  image text,
  lending_terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false,
  deleted_at timestamptz
);

create table public.book_images (
  image_id text primary key,
  book_id text not null references public.book(book_id),
  image_url text not null,
  description text,
  uploaded_by text not null references public.profiles(user_id),
  created_at timestamptz not null default now()
);

create table public.loan (
  loan_id text primary key default public.next_prefixed_id('ln_', 'public.loan_id_seq'),
  book_id text not null references public.book(book_id),
  owner_id text not null references public.profiles(user_id),
  borrower_id text not null references public.profiles(user_id),
  due_at timestamptz not null,
  returned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  status text,
  is_deleted boolean not null default false,
  deleted_at timestamptz
);

create table public.condition_report (
  report_id text primary key,
  loan_id text not null references public.loan(loan_id),
  reporter_id text not null references public.profiles(user_id),
  type text not null,
  notes text not null,
  severity text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.book_review (
  b_review_id text primary key,
  user_id text not null references public.profiles(user_id),
  book_id text not null references public.book(book_id),
  format_variant text,
  rating integer check (rating between 0 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false,
  deleted_at timestamptz
);

create table public.user_review (
  u_review_id text primary key,
  reviewer_id text not null references public.profiles(user_id),
  user_id text not null references public.profiles(user_id),
  rating integer check (rating between 0 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  loan_id text not null references public.loan(loan_id),
  is_deleted boolean not null default false,
  deleted_at timestamptz
);

create table public.follows (
  id text primary key,
  follower_id text not null references public.profiles(user_id) on delete cascade,
  followed_id text not null references public.profiles(user_id) on delete cascade
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (
    auth_user_id,
    user_name,
    email,
    pronouns,
    postcode,
    about,
    interests
  )
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'user_name', ''), 'reader_' || left(new.id::text, 8)),
    new.email,
    nullif(new.raw_user_meta_data ->> 'pronouns', ''),
    nullif(new.raw_user_meta_data ->> 'postcode', ''),
    nullif(new.raw_user_meta_data ->> 'about', ''),
    case
      when jsonb_typeof(new.raw_user_meta_data -> 'interests') = 'array'
        then array(select jsonb_array_elements_text(new.raw_user_meta_data -> 'interests'))
      else '{}'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

alter table public.profiles enable row level security;
alter table public.book enable row level security;
alter table public.book_images enable row level security;
alter table public.loan enable row level security;
alter table public.condition_report enable row level security;
alter table public.book_review enable row level security;
alter table public.user_review enable row level security;
alter table public.follows enable row level security;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
