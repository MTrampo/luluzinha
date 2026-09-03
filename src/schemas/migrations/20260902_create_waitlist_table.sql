-- Migration: 20260902_create_waitlist_table.sql
-- Description: Criação da tabela de lista de espera (Waitlist) para a fase Alpha Fechada

CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    origin TEXT DEFAULT 'landing_pricing',
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Permitir inserção anônima e autenticada para novos cadastros na lista de espera
DROP POLICY IF EXISTS "Allow anon and authenticated insert into waitlist" ON public.waitlist;
CREATE POLICY "Allow anon and authenticated insert into waitlist"
    ON public.waitlist
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and authenticated select into waitlist" ON public.waitlist;
CREATE POLICY "Allow anon and authenticated select into waitlist"
    ON public.waitlist
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Permitir leitura e gerenciamento total apenas para service_role
DROP POLICY IF EXISTS "Allow service_role full access on waitlist" ON public.waitlist;
CREATE POLICY "Allow service_role full access on waitlist"
    ON public.waitlist
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

