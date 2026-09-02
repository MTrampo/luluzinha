CREATE TABLE IF NOT EXISTS public.plan_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(64) UNIQUE NOT NULL,
  plan_slug VARCHAR(50) NOT NULL REFERENCES public.plans(slug) ON DELETE CASCADE,
  recipient_name VARCHAR(100) NULL,
  recipient_email VARCHAR(150) NULL,
  max_uses INT NOT NULL DEFAULT 1,
  used_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 day'),
  used_at TIMESTAMPTZ NULL,
  used_by_user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_plan_invitations_token ON public.plan_invitations(token);
CREATE INDEX IF NOT EXISTS idx_plan_invitations_active_expiry ON public.plan_invitations(is_active, expires_at);

-- RLS
ALTER TABLE public.plan_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de convites ativos por token"
ON public.plan_invitations
FOR SELECT
USING (true);
