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

-- 2. Tabela de Bloqueios de Horários
CREATE TABLE public.establishment_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  reason TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  date DATE,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT block_type_check CHECK (
    (date IS NOT NULL AND day_of_week IS NULL) OR 
    (date IS NULL AND day_of_week IS NOT NULL)
  )
);

ALTER TABLE public.establishment_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donos podem gerenciar seus próprios bloqueios"
ON public.establishment_blocks
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());