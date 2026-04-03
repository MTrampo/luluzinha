CREATE TABLE public.config_plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text UNIQUE NOT NULL,         -- 'starter'
    name text NOT NULL,                -- 'Luluzinha Starter'
    description text,                  -- O que o plano oferece
    price numeric(10, 2) NOT NULL,     -- O 'base_value' da assinatura
    mp_plan_id text UNIQUE NOT NULL,   -- O ID 88e3aa8e...
    
    -- Limites de Uso
    max_procedures int4 DEFAULT 6,
    max_users int4 DEFAULT 1,
    history_retention_days int4 DEFAULT 30, -- O limite de 1 mês

    billing_period text DEFAULT 'monthly',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);