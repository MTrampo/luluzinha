-- 1. Tabela de Agendamentos (Schedules / Ciclos)
CREATE TABLE public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  
  -- Informações de Tempo Unificadas
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  
  -- Histórico Consolidado (duração em minutos)
  total_price DECIMAL(10, 2) NOT NULL,
  total_duration INTEGER NOT NULL, 
  
  -- Status e Observações
  status INT NOT NULL DEFAULT 0,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Relacionamento Agendamento <-> Procedimentos
CREATE TABLE public.schedule_procedures (
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  procedure_id UUID NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  
  -- Salva o preço e duração (em minutos) no momento do agendamento
  price_at_time DECIMAL(10, 2) NOT NULL,
  duration_at_time INTEGER NOT NULL,
  
  PRIMARY KEY (schedule_id, procedure_id)
);

-- 3. Habilitar Segurança (RLS)
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_procedures ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de RLS para Schedules

-- Permite que donos vejam ciclos do seu estabelecimento
CREATE POLICY "Donos podem ver ciclos do seu estabelecimento"
ON public.schedules FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = schedules.establishment_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos insiram ciclos no seu estabelecimento
CREATE POLICY "Donos podem inserir ciclos no seu estabelecimento"
ON public.schedules FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = schedules.establishment_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos atualizem ciclos do seu estabelecimento
CREATE POLICY "Donos podem atualizar ciclos do seu estabelecimento"
ON public.schedules FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = schedules.establishment_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos deletem ciclos do seu estabelecimento
CREATE POLICY "Donos podem deletar ciclos do seu estabelecimento"
ON public.schedules FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.establishments
    WHERE establishments.id = schedules.establishment_id
    AND establishments.owner_id = auth.uid()
));


-- 5. Políticas de RLS para Schedule_Procedures

-- Permite que donos vejam procedimentos de seus ciclos
CREATE POLICY "Donos podem ver procedimentos dos seus ciclos"
ON public.schedule_procedures FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.schedules
    JOIN public.establishments ON establishments.id = schedules.establishment_id
    WHERE schedules.id = schedule_procedures.schedule_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos insiram procedimentos em seus ciclos
CREATE POLICY "Donos podem inserir procedimentos nos seus ciclos"
ON public.schedule_procedures FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.schedules
    JOIN public.establishments ON establishments.id = schedules.establishment_id
    WHERE schedules.id = schedule_procedures.schedule_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos atualizem procedimentos de seus ciclos
CREATE POLICY "Donos podem atualizar procedimentos dos seus ciclos"
ON public.schedule_procedures FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.schedules
    JOIN public.establishments ON establishments.id = schedules.establishment_id
    WHERE schedules.id = schedule_procedures.schedule_id
    AND establishments.owner_id = auth.uid()
));

-- Permite que donos deletem procedimentos de seus ciclos
CREATE POLICY "Donos podem deletar procedimentos dos seus ciclos"
ON public.schedule_procedures FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.schedules
    JOIN public.establishments ON establishments.id = schedules.establishment_id
    WHERE schedules.id = schedule_procedures.schedule_id
    AND establishments.owner_id = auth.uid()
));
