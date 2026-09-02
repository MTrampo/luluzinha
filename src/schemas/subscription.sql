-- 1. Tabela de Assinaturas (Subscriptions)
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Integração com Mercado Pago
  mp_preapproval_plan_id TEXT,
  mp_subscription_id TEXT UNIQUE,
  mp_status TEXT NOT NULL DEFAULT 'pending', -- active, pending, cancelled, etc.
  
  -- Detalhes do Plano
  plan_name TEXT DEFAULT NULL, -- Starter, Premium
  base_value DECIMAL(10, 2) NOT NULL,
  
  -- Gestão de Usuários Adicionais (Pré-pago)
  extra_users_count INTEGER DEFAULT 0,
  extra_user_price DECIMAL(10, 2) DEFAULT 0,
  
  -- Períodos de Validade
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de inconsistências de Assinaturas (Subscription Inconsistencies)
CREATE TABLE public.subscription_inconsistencies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mp_preapproval_id text NOT NULL, -- ID da assinatura (5...)
  mp_payer_id text,               -- ID do pagador no MP
  payer_email_received text,      -- O e-mail que veio no Webhook
  payment text,                -- subscription_preapproval / payment
  preapproval_data jsonb,             -- O objeto completo para auditoria
  issue_reason text,              -- Ex: "E-mail não encontrado no banco"
  resolved boolean DEFAULT false, -- Para você marcar quando resolver
  created_at timestamptz DEFAULT now()
); 

-- Políticas de Segurança para Assinaturas --

-- 1. Política com a lógica que permite o .select().single() no código
CREATE POLICY "Donos podem ver sua própria assinatura"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (
  -- Caso A: A assinatura já está vinculada ao estabelecimento do usuário
  id IN (
    SELECT subscription_id 
    FROM public.establishments 
    WHERE owner_id = auth.uid()
  )
  OR 
  -- Caso B: A assinatura foi criada agora (status pending) por um dono de estabelecimento
  (
    mp_status = 'pending' AND 
    EXISTS (SELECT 1 FROM public.establishments WHERE owner_id = auth.uid())
  )
);

-- 2. Política para permitir que o usuário crie uma assinatura (INSERT)
CREATE POLICY "Permitir Criar Assinatura Dono"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.owner_id = auth.uid()
  )
);

-- 3. Política para permitir que o usuário crie sua assinatura se for dono de estabelecimento (mesma lógica do .select().single())
CREATE POLICY "Permitir criar assinatura se for dono de estabelecimento"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.establishments
    WHERE owner_id = auth.uid()
  )
);

-- 4. Política para permitir que o usuário atualize sua assinatura (UPDATE)
CREATE POLICY "Permitir update para donos do estabelecimento"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (
  EXISTS ( SELECT 1
    FROM establishments
    WHERE ((establishments.owner_id = auth.uid()) 
    AND ((establishments.subscription_id = subscriptions.id) 
    OR (subscriptions.id IS NOT NULL))))
)