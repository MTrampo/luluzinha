-- 1. Tabela de Estabelecimentos (Establishments)
CREATE TABLE public.establishments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  
  -- Identidade do Negócio
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  
  -- Operação do Negócio (Padronizado em Inglês)
  opening_hours JSONB DEFAULT '{
    "mon": {"open": "08:00", "close": "18:00", "closed": false},
    "tue": {"open": "08:00", "close": "18:00", "closed": false},
    "wed": {"open": "08:00", "close": "18:00", "closed": false},
    "thu": {"open": "08:00", "close": "18:00", "closed": false},
    "fri": {"open": "08:00", "close": "18:00", "closed": false},
    "sat": {"open": "08:00", "close": "14:00", "closed": false},
    "sun": {"open": "00:00", "close": "00:00", "closed": true}
  }'::jsonb,
  
  -- Campos para Uso Futuro (Reservados)
  address TEXT,
  phone TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Políticas de Segurança para Estabelecimentos --

CREATE POLICY "Donos podem ver seu próprio estabelecimento"
ON public.establishments
FOR SELECT
TO authenticated
USING (
  auth.uid() = owner_id
);

CREATE POLICY "Donos podem inserir seu próprio estabelecimento"
ON public.establishments
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Donos podem atualizar seu próprio estabelecimento"
ON public.establishments
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);