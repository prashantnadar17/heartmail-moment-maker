alter table public.drafts add column deliver_at timestamptz;
comment on column public.drafts.deliver_at is 'Optional scheduled delivery: the recipient link unlocks at this moment';