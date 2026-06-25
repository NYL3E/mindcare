-- ============================================================
-- MindCare — Supabase Schema
-- Colle ce script dans le SQL Editor de ton dashboard Supabase
-- ============================================================

-- 1. Profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default 'Utilisateur',
  bio text not null default '',
  created_at timestamptz not null default now()
);

-- 2. AI Settings
create table if not exists public.ai_settings (
  user_id uuid references auth.users on delete cascade primary key,
  name text not null default 'Sarah',
  personality text not null default 'empathique',
  color text not null default 'pink',
  tutoiement boolean not null default true,
  decontracte boolean not null default true,
  eyes text not null default 'round',
  mouth text not null default 'smile',
  hair text not null default 'none',
  updated_at timestamptz not null default now()
);

-- 3. Mood entries
create table if not exists public.mood_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  energy smallint not null check (energy >= 0 and energy <= 100),
  mood smallint not null check (mood >= 0 and mood <= 100),
  stress smallint not null check (stress >= 0 and stress <= 100),
  social smallint not null check (social >= 0 and social <= 100),
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

-- 4. Chat messages
create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  text text not null,
  is_user boolean not null default false,
  ts text not null default '',
  seq integer not null default 0,
  created_at timestamptz not null default now()
);

-- 5. Activities
create table if not exists public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  category text not null,
  category_icon text,
  description text not null,
  participants smallint not null default 0,
  max_participants smallint not null,
  location text not null,
  date_label text,
  is_public boolean not null default true,
  host_name text,
  joined boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. Friends
create table if not exists public.friends (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  initial text not null,
  online boolean not null default false,
  mood_icon text not null default 'smile',
  gradient_from text not null,
  gradient_to text not null,
  created_at timestamptz not null default now()
);

-- 7. Friend requests
create table if not exists public.friend_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  initial text not null,
  mutual_friends smallint not null default 0,
  gradient_from text not null,
  gradient_to text not null,
  created_at timestamptz not null default now()
);

-- 8. Notification prefs
create table if not exists public.notification_prefs (
  user_id uuid references auth.users on delete cascade primary key,
  checkin boolean not null default true,
  messages boolean not null default true,
  activites boolean not null default true,
  amis boolean not null default true
);

-- 9. Privacy prefs
create table if not exists public.privacy_prefs (
  user_id uuid references auth.users on delete cascade primary key,
  profil_public boolean not null default true,
  show_mood boolean not null default true,
  share_location boolean not null default false
);

-- 10. User settings
create table if not exists public.user_settings (
  user_id uuid references auth.users on delete cascade primary key,
  theme text not null default 'clair'
);

-- ============================================================
-- Row Level Security — chaque utilisateur accède uniquement
-- à ses propres données
-- ============================================================

alter table public.profiles enable row level security;
alter table public.ai_settings enable row level security;
alter table public.mood_entries enable row level security;
alter table public.chat_messages enable row level security;
alter table public.activities enable row level security;
alter table public.friends enable row level security;
alter table public.friend_requests enable row level security;
alter table public.notification_prefs enable row level security;
alter table public.privacy_prefs enable row level security;
alter table public.user_settings enable row level security;

create policy "own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own" on public.ai_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.mood_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.chat_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.activities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.friends for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.friend_requests for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.notification_prefs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.privacy_prefs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
