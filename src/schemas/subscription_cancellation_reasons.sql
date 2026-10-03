-- Tabela de Motivos de Cancelamento de Assinatura (Subscription Cancellation Reasons)
CREATE TABLE IF NOT EXISTS public.subscription_cancellation_reasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  mp_subscription_id TEXT,
  reason TEXT NOT NULL,
  reason_details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Segurança por Linha (RLS)
ALTER TABLE public.subscription_cancellation_reasons ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Donos podem registrar motivo de cancelamento"
ON public.subscription_cancellation_reasons
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.establishments
    WHERE id = establishment_id AND owner_id = auth.uid()
  )
);

CREATE POLICY "Donos podem visualizar seus motivos de cancelamento"
ON public.subscription_cancellation_reasons
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.establishments
    WHERE id = establishment_id AND owner_id = auth.uid()
  )
);
