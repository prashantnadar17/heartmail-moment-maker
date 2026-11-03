CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id uuid NOT NULL REFERENCES public.drafts(id) ON DELETE CASCADE,
  original_amount_paise integer NOT NULL CHECK (original_amount_paise >= 0),
  discount_amount_paise integer NOT NULL DEFAULT 0 CHECK (discount_amount_paise >= 0),
  final_amount_paise integer NOT NULL CHECK (final_amount_paise >= 0),
  currency text NOT NULL DEFAULT 'INR',
  payment_provider text NOT NULL DEFAULT 'razorpay',
  provider_order_id text,
  mode text NOT NULL DEFAULT 'test' CHECK (mode IN ('test','live')),
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','awaiting_payment','paid','failed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX orders_draft_id_idx ON public.orders(draft_id);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider_payment_id text NOT NULL UNIQUE,
  provider_signature text,
  amount_paise integer NOT NULL CHECK (amount_paise >= 0),
  currency text NOT NULL DEFAULT 'INR',
  mode text NOT NULL DEFAULT 'test' CHECK (mode IN ('test','live')),
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','verified','failed')),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX payments_order_id_idx ON public.payments(order_id);

CREATE TABLE public.cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id uuid NOT NULL REFERENCES public.drafts(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  public_token text NOT NULL UNIQUE,
  token_hash text NOT NULL UNIQUE,
  mode text NOT NULL DEFAULT 'test' CHECK (mode IN ('test','live')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','revoked')),
  published_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX cards_draft_id_idx ON public.cards(draft_id);

CREATE TABLE public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_id text NOT NULL,
  payload jsonb,
  processed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);

GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.cards TO service_role;
GRANT ALL ON public.webhook_events TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies on purpose: these tables hold order, payment
-- and publication state and are managed exclusively through the admin client
-- inside server functions. RLS with zero policies keeps them locked.