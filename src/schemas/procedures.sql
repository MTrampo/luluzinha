-- 1. Tabela de Procedimentos/Serviços (Procedures)
CREATE TABLE public.procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  
  -- Detalhes do Serviço
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- Duração em minutos
  price DECIMAL(10, 2) NOT NULL,
  
  -- Controle de Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar Segurança (RLS)
ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de RLS (Português)

-- Permite que donos vejam os serviços do seu estabelecimento
CREATE POLICY "Donos podem ver serviços do seu estabelecimento"
ON public.procedures FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = procedures.establishment_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos insiram serviços no seu estabelecimento
CREATE POLICY "Donos podem inserir serviços no seu estabelecimento"
ON public.procedures FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = procedures.establishment_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos atualizem serviços do seu estabelecimento
CREATE POLICY "Donos podem atualizar serviços do seu estabelecimento"
ON public.procedures FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = procedures.establishment_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos deletem serviços do seu estabelecimento
CREATE POLICY "Donos podem deletar serviços do seu estabelecimento"
ON public.procedures FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = procedures.establishment_id
    AND establishments.owner_id = auth.uid()
));