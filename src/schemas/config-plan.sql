-- 1. Tabela de Configurações de Planos (Limites e Recursos)
CREATE TABLE IF NOT EXISTS public.config_plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,                             -- 'Padrão Luluzinha (Fundadoras)', 'Alpha', etc.
    max_procedures int4 NOT NULL DEFAULT 6,
    max_users int4 NOT NULL DEFAULT 1,
    history_retention_days int4 NOT NULL DEFAULT 30, -- Flexível para 30, 90, 365 dias
    is_default boolean NOT NULL DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS para config_plans
ALTER TABLE public.config_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de config_plans para todos"
ON public.config_plans FOR SELECT
USING (true);

-- 2. Tabela de Planos (Catálogo Comercial e Integração)
CREATE TABLE IF NOT EXISTS public.plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text UNIQUE NOT NULL,         -- 'starter', 'financier-luluzinha'
    name text NOT NULL,                -- 'Luluzinha Starter'
    description text,                  -- O que o plano oferece
    price numeric(10, 2) NOT NULL,     -- O 'base_value' da assinatura
    mp_plan_id text UNIQUE NOT NULL,   -- O ID 88e3aa8e...
    
    -- Vinculação com a Configuração do Plano
    config_plan_id uuid REFERENCES public.config_plans(id) ON DELETE SET NULL,

    -- Apresentação e Destaque
    features jsonb DEFAULT '[]'::jsonb,
    badge text DEFAULT NULL,
    is_featured boolean DEFAULT false,
    sort_order int4 DEFAULT 0,

    billing_period text DEFAULT 'monthly',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Migração: Removidas colunas legado da tabela plans (agora geridas em config_plans)
ALTER TABLE public.plans DROP COLUMN IF EXISTS max_procedures;
ALTER TABLE public.plans DROP COLUMN IF EXISTS max_users;
ALTER TABLE public.plans DROP COLUMN IF EXISTS history_retention_days;