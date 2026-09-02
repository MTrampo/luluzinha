-- 1. Tabela de Clientes (Customers / Poderosas)
CREATE TABLE public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  
  -- Detalhes da Cliente
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  birthday DATE,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar Segurança (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de RLS (Português)

-- Permite que donos vejam as clientes do seu estabelecimento
CREATE POLICY "Donos podem ver clientes do seu estabelecimento"
ON public.customers FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = customers.establishment_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos insiram clientes no seu estabelecimento
CREATE POLICY "Donos podem inserir clientes no seu estabelecimento"
ON public.customers FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = customers.establishment_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos atualizem clientes do seu estabelecimento
CREATE POLICY "Donos podem atualizar clientes do seu estabelecimento"
ON public.customers FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = customers.establishment_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos deletem clientes do seu estabelecimento
CREATE POLICY "Donos podem deletar clientes do seu estabelecimento"
ON public.customers FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = customers.establishment_id
    AND establishments.owner_id = auth.uid()
));
