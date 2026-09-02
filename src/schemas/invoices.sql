-- Tabela de Faturas / Pagamentos (Invoices)
CREATE TABLE public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Relacionamentos
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,

  -- Integração com Mercado Pago
  mp_payment_id TEXT UNIQUE NOT NULL,
  mp_subscription_id TEXT,
  mp_preapproval_id TEXT,

  -- Dados do pagador
  mp_payer_id BIGINT,
  mp_payer_email TEXT,

  -- Valores e status
  amount NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'BRL',
  status TEXT,
  paid_at TIMESTAMPTZ,

  -- Auditoria
  raw_payload JSONB,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_invoices_establishment_id ON public.invoices(establishment_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON public.invoices(subscription_id);

-- Habilitar RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (Português, seguir padrão do projeto)

-- Permite que donos vejam faturas do seu estabelecimento
CREATE POLICY "Donos podem ver faturas do seu estabelecimento"
ON public.invoices
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = invoices.establishment_id
      AND establishments.owner_id = auth.uid()
  )
);

-- Permite que donos insiram faturas para seu estabelecimento
CREATE POLICY "Donos podem inserir faturas para seu estabelecimento"
ON public.invoices
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = invoices.establishment_id
      AND establishments.owner_id = auth.uid()
  )
);

-- Permite que donos atualizem faturas do seu estabelecimento
CREATE POLICY "Donos podem atualizar faturas do seu estabelecimento"
ON public.invoices
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = invoices.establishment_id
      AND establishments.owner_id = auth.uid()
  )
);

-- Permite que donos deletem faturas do seu estabelecimento
CREATE POLICY "Donos podem deletar faturas do seu estabelecimento"
ON public.invoices
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = invoices.establishment_id
      AND establishments.owner_id = auth.uid()
  )
);

-- Observações:
-- - `mp_payer_id` pode ser NULL para pagamentos como convidado; armazene `payer_email` como fallback.
-- - Recomenda-se criar jobs de reconciliação que consultem o Mercado Pago para completar `mp_payer_id` quando possível.
