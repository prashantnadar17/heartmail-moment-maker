-- HeartMuse Phase 1 schema

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  tagline text,
  description text,
  thumbnail_url text,
  experience_type text not null check (experience_type in ('birthday','sorry','photo_puzzle')),
  configuration jsonb not null default '{}'::jsonb,
  base_price_paise int not null check (base_price_paise >= 0),
  discount_amount_paise int not null default 0 check (discount_amount_paise >= 0),
  currency text not null default 'INR',
  is_active boolean not null default false,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  popularity int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_display_name text not null,
  location text,
  content text not null,
  rating int not null check (rating between 1 and 5),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.drafts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  template_id uuid not null references public.templates(id),
  session_reference text not null,
  personalization jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','checkout','paid','published','abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
);

create index idx_templates_category on public.templates(category_id);
create index idx_templates_active on public.templates(is_active, sort_order);
create index idx_drafts_session on public.drafts(session_reference);
create index idx_drafts_template on public.drafts(template_id);

-- Grants
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
grant select on public.templates to anon, authenticated;
grant all on public.templates to service_role;
grant select on public.testimonials to anon, authenticated;
grant all on public.testimonials to service_role;
grant all on public.drafts to service_role;
grant select, insert, update, delete on public.drafts to authenticated;

-- RLS
alter table public.categories enable row level security;
alter table public.templates enable row level security;
alter table public.testimonials enable row level security;
alter table public.drafts enable row level security;

create policy "Public can read active categories" on public.categories for select to anon, authenticated using (is_active);
create policy "Admin service role manages categories" on public.categories for all to service_role using (true) with check (true);

create policy "Public can read active templates" on public.templates for select to anon, authenticated using (is_active);
create policy "Admin service role manages templates" on public.templates for all to service_role using (true) with check (true);

create policy "Public can read approved testimonials" on public.testimonials for select to anon, authenticated using (is_approved);
create policy "Admin service role manages testimonials" on public.testimonials for all to service_role using (true) with check (true);

create policy "Authenticated owners read own drafts" on public.drafts for select to authenticated using (owner_id = auth.uid());
create policy "Admin service role manages drafts" on public.drafts for all to service_role using (true) with check (true);

-- Seed categories
insert into public.categories (name, slug, description, icon, sort_order) values
  ('Birthday','birthday','Make their day unforgettable with candles, cake and confetti.','Cake',1),
  ('Sorry & Apology','sorry','Say it right when words are hard to find.','HeartHandshake',2),
  ('Marriage Proposal','proposal','The question, asked beautifully.','Gem',3),
  ('Anniversary','anniversary','Celebrate every year of your story.','CalendarHeart',4),
  ('Friendship','friendship','For the ones who know you best.','Users',5),
  ('Thank You','thank-you','Gratitude they can replay anytime.','Sparkles',6),
  ('Miss You','miss-you','Close the distance with one link.','CloudMoon',7),
  ('Mother''s Day','mothers-day','For the person who made everything possible.','Heart',8),
  ('Father''s Day','fathers-day','Tell dad what he means to you.','Shield',9),
  ('Valentine''s Day','valentines-day','A love note, elevated.','Flower',10),
  ('Wedding','wedding','Congratulations in full bloom.','Church',11),
  ('Graduation','graduation','Mark the milestone they earned.','GraduationCap',12),
  ('Congratulations','congratulations','Wins deserve real celebration.','Trophy',13),
  ('Farewell','farewell','Goodbyes that stay memorable.','Send',14),
  ('Long Distance','long-distance','One link across the miles.','Globe',15),
  ('Just Because','just-because','No occasion needed for kindness.','Sun',16),
  ('Festivals','festivals','Share festive joy, wherever they are.','PartyPopper',17),
  ('Baby Announcement','baby-announcement','The sweetest news, beautifully told.','Baby',18),
  ('Photo Puzzle','photo-puzzle','A hidden photo revealed piece by piece.','Puzzle',19);

-- Seed templates (three launch experiences)
insert into public.templates (category_id, name, slug, tagline, description, experience_type, configuration, base_price_paise, discount_amount_paise, is_active, is_featured, is_new, popularity, sort_order)
select c.id, t.name, t.slug, t.tagline, t.description, t.exp, t.configuration::jsonb, t.base, t.disc, t.act, t.feat, t.isnew, t.pop, t.sort
from (values
  ('birthday','Birthday Cake Reveal','birthday-cake-reveal','Blow out the candles, light up their day','An interactive birthday experience with a cake reveal, blowable candles, balloons, confetti and a personal letter.','birthday','{"experience":"birthday","fields":{"recipientName":true,"senderName":true,"birthdayDate":false,"message":true,"candles":true,"cakeStyle":true,"theme":true,"photos":false},"features":["candleBlow","balloons","confetti","letter"]}', 24900, 5000, true, false, true, 5, 1),
  ('sorry','Heartfelt Apology','heartfelt-apology','When an apology deserves more than a text','A tender multi-step apology experience with a personal letter, envelope animation and optional passcode.','sorry','{"experience":"sorry","fields":{"recipientName":true,"senderName":true,"messageHeadline":true,"messageBody":true,"messageClosing":true,"theme":true,"photos":false,"passcode":false},"features":["envelope","letter","reveals"]}', 24900, 5000, true, true, false, 10, 2),
  ('photo-puzzle','Surprise Photo Puzzle','surprise-photo-puzzle','They solve it, they discover it','A playful sliding puzzle built from your photo that reveals a hidden message when solved.','photo_puzzle','{"experience":"photo_puzzle","fields":{"recipientName":true,"senderName":true,"photo":true,"hiddenMessage":true,"puzzleSize":true,"theme":true},"features":["puzzle","reveal"]}', 24900, 5000, true, true, true, 8, 3)
) as t(cat, name, slug, tagline, description, exp, configuration, base, disc, act, feat, isnew, pop, sort)
join public.categories c on c.slug = t.cat;
